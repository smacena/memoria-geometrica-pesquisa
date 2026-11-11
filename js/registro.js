// Registro das rodadas do jogo da memória.
// Cada rodada terminada vira um "lote" ({ rodada, tentativas }) enviado a uma planilha do Google
// (veja apps-script/Code.gs). Sem internet, o lote fica numa fila no aparelho e é reenviado depois.
const CHAVE_FILA = 'memoria.fila';
const CHAVE_APARELHO = 'memoria.aparelho';

function lerFila() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_FILA)) || [];
  } catch {
    return [];
  }
}

function gravarFila(fila) {
  try {
    localStorage.setItem(CHAVE_FILA, JSON.stringify(fila));
  } catch {
    // sem armazenamento disponível: segue sem fila
  }
}

// Código anônimo deste aparelho/navegador (não tem nome nem dado pessoal).
// É ele que "assina" o número de identificação: só este aparelho pode usá-lo.
let idEmMemoria = null;
export function idAparelho() {
  try {
    let id = localStorage.getItem(CHAVE_APARELHO);
    if (!id) {
      id = 'A' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 8).toUpperCase();
      localStorage.setItem(CHAVE_APARELHO, id);
    }
    return id;
  } catch {
    // sem armazenamento (ex.: aba privada em navegador antigo): vale só enquanto a página estiver aberta
    if (!idEmMemoria) idEmMemoria = 'A' + Math.random().toString(36).slice(2, 12).toUpperCase();
    return idEmMemoria;
  }
}

// Pergunta à planilha se o número está livre (ou já é deste aparelho) e o reserva.
// Retorna: 'ok', 'ocupado', 'erro' (resposta inesperada), 'sem_conexao' ou 'sem_verificacao'
// (quando o endereço da planilha não está configurado, como em testes locais).
export async function reservarNumero(numero, endereco) {
  if (!endereco) return 'sem_verificacao';
  const controle = new AbortController();
  const limite = setTimeout(() => controle.abort(), 15000);
  try {
    const url = `${endereco}?acao=reservar&id=${encodeURIComponent(numero)}&aparelho=${encodeURIComponent(idAparelho())}`;
    const resposta = await fetch(url, { signal: controle.signal });
    if (!resposta.ok) return 'sem_conexao';
    const texto = (await resposta.text()).trim();
    if (texto === 'ok') return 'ok';
    if (texto === 'ocupado') return 'ocupado';
    return 'erro';
  } catch {
    return 'sem_conexao';
  } finally {
    clearTimeout(limite);
  }
}

export function pendentes() {
  return lerFila().length;
}

// Identificador único da rodada (a planilha usa para não gravar a mesma rodada duas vezes).
export function novoIdRodada() {
  return 'M' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}

async function enviar(endereco, lote) {
  // text/plain evita a verificação prévia (preflight) do navegador, que o Apps Script não responde
  const resposta = await fetch(endereco, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(lote),
  });
  if (!resposta.ok) throw new Error(`Falha ao enviar: ${resposta.status}`);
}

// Tenta enviar tudo que está na fila. O que falhar continua na fila para a próxima tentativa.
export async function enviarPendentes(endereco) {
  if (!endereco) return;
  const enviados = new Set();
  for (const lote of lerFila()) {
    try {
      await enviar(endereco, lote);
      enviados.add(lote.rodada.id_rodada);
    } catch {
      // sem internet ou planilha fora do ar: fica para depois
    }
  }
  if (enviados.size > 0) {
    gravarFila(lerFila().filter((lote) => !enviados.has(lote.rodada.id_rodada)));
  }
}

export async function registrarRodada(lote, endereco) {
  gravarFila([...lerFila(), lote]);
  await enviarPendentes(endereco);
}