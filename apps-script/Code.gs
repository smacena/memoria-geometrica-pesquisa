// Google Apps Script do JOGO DA MEMÓRIA. Recebe as rodadas e grava numa planilha.
// Cole este código em Extensões > Apps Script, numa planilha do Google SÓ para este jogo.
//
// Três abas são criadas sozinhas:
//   "Rodadas":    uma linha por rodada (resumo).
//   "Tentativas": uma linha por tentativa (cada vez que o jogador vira duas cartas).
//   "Numeros":    números de identificação já reservados e o aparelho dono de cada um.
// "Rodadas" e "Tentativas" se ligam pela coluna id_rodada.

const ABA_RODADAS = 'Rodadas';
const ABA_TENTATIVAS = 'Tentativas';
const ABA_NUMEROS = 'Numeros';

const CAMPOS_RODADAS = [
  'id_rodada', 'data_hora', 'id_aparelho', 'id_jogador', 'tema', 'pares',
  'tempo_configurado_s', 'previa_s', 'resultado', 'pares_encontrados', 'tentativas',
  'erros', 'acertos_de_primeira', 'tempo_usado_s', 'tempo_primeiro_acerto_s', 'entrada',
];
const CAMPOS_TENTATIVAS = [
  'id_rodada', 'tentativa', 'tempo_ms', 'duracao_ms',
  'carta_1', 'par_1', 'carta_2', 'par_2', 'acertou', 'entrada',
];
const CAMPOS_NUMEROS = ['id_jogador', 'aparelho', 'data_hora'];

// O jogo chama este endereço (GET) antes de começar: ?acao=reservar&id=123&aparelho=XYZ
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.acao === 'reservar') {
    return resposta(reservar(String(p.id || ''), String(p.aparelho || '')));
  }
  return resposta('servidor ok');
}

// O jogo envia uma rodada terminada (POST).
function doPost(e) {
  const trava = LockService.getScriptLock();
  trava.waitLock(20000); // vários jogadores podem enviar ao mesmo tempo
  try {
    const lote = JSON.parse(e.postData.contents);
    const rodada = lote.rodada;
    const tentativas = lote.tentativas || [];

    const abaRodadas = obterAba(ABA_RODADAS, CAMPOS_RODADAS, [1, 2, 3, 4]);
    const abaTentativas = obterAba(ABA_TENTATIVAS, CAMPOS_TENTATIVAS, [1]);

    // Não grava a mesma rodada duas vezes (o aparelho pode reenviar se a conexão cair)
    const ultima = abaRodadas.getLastRow();
    const jaGravadas = new Set(
      ultima > 1 ? abaRodadas.getRange(2, 1, ultima - 1, 1).getValues().map((l) => String(l[0])) : []
    );
    if (jaGravadas.has(String(rodada.id_rodada))) return resposta('repetida');

    abaRodadas.getRange(ultima + 1, 1, 1, CAMPOS_RODADAS.length).setValues([
      CAMPOS_RODADAS.map((c) => valor(rodada[c])),
    ]);

    if (tentativas.length > 0) {
      const inicio = abaTentativas.getLastRow() + 1;
      abaTentativas.getRange(inicio, 1, tentativas.length, CAMPOS_TENTATIVAS.length).setValues(
        tentativas.map((t) => CAMPOS_TENTATIVAS.map((c) => valor(t[c])))
      );
    }
    return resposta('ok');
  } catch (erro) {
    return resposta('erro: ' + erro.message);
  } finally {
    trava.releaseLock();
  }
}

// ---- números de identificação ----

// "007" e "7" contam como o mesmo número.
function normalizar(id) {
  return String(id).replace(/^0+(?=\d)/, '');
}

// Devolve o número da linha onde o id está, ou 0 se não existir.
function acharNumero(aba, id) {
  const ultima = aba.getLastRow();
  if (ultima < 2) return 0;
  const ids = aba.getRange(2, 1, ultima - 1, 1).getValues();
  const alvo = normalizar(id);
  for (let i = 0; i < ids.length; i++) {
    if (normalizar(ids[i][0]) === alvo) return i + 2;
  }
  return 0;
}

// O número pertence ao primeiro aparelho que o reservar. Esse aparelho pode jogar quantas rodadas
// quiser com ele; outro aparelho recebe "ocupado". Respostas: ok, ocupado, invalido.
function reservar(id, aparelho) {
  if (!/^\d{1,8}$/.test(id) || !aparelho) return 'invalido';
  const trava = LockService.getScriptLock();
  trava.waitLock(20000);
  try {
    const aba = obterAba(ABA_NUMEROS, CAMPOS_NUMEROS, [1, 2, 3]);
    const linha = acharNumero(aba, id);
    if (linha === 0) {
      aba.appendRow([id, aparelho, new Date().toISOString()]);
      return 'ok';
    }
    return String(aba.getRange(linha, 2).getValue()) === aparelho ? 'ok' : 'ocupado';
  } finally {
    trava.releaseLock();
  }
}

// ---- utilidades ----

function valor(v) {
  return v === undefined || v === null ? '' : v;
}

// Cria a aba com o cabeçalho na primeira vez. As colunas listadas ficam como texto
// (a planilha não converte datas nem apaga zeros à esquerda).
function obterAba(nome, campos, colunasTexto) {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(nome);
  if (!aba) {
    aba = planilha.insertSheet(nome);
    aba.appendRow(campos);
    colunasTexto.forEach((c) => aba.getRange(1, c, aba.getMaxRows(), 1).setNumberFormat('@'));
  }
  return aba;
}

function resposta(texto) {
  return ContentService.createTextOutput(texto);
}