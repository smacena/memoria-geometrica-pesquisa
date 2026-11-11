import * as bancos from './dados.js';
import { config } from './config.js';
import { criarJogo, virarCarta, esconderErradas, venceu } from './memoria.js';
import { iniciarCamera } from './camera.js';
import { novoIdRodada, idAparelho, registrarRodada, enviarPendentes, reservarNumero } from './registro.js';

const tabuleiro = document.getElementById('tabuleiro');
const escolha = document.getElementById('escolha');
const listaTemas = document.getElementById('niveis');
const relogio = document.getElementById('relogio');
const mensagem = document.getElementById('mensagem');
const botaoNovo = document.getElementById('novo');
const botaoCamera = document.getElementById('camera');
const botaoTelaCheia = document.getElementById('tela-cheia');
const campoNumero = document.getElementById('jogador');
const erroNumero = document.getElementById('erro-numero');
const rotuloJogador = document.getElementById('identificacao');

let jogo, tema, jogador, tempoRestante, intervalo, intervaloPrevia;
let encerrado = true;
let previa = false;
let registro = null; // dados da rodada em andamento

// ---------------------------------------------------------------- tela

function atualizarRelogio() {
  relogio.textContent = `⏱ ${tempoRestante}s`;
}

function preencher(el, conteudo) {
  if (conteudo.imagem) {
    const img = document.createElement('img');
    img.src = conteudo.imagem;
    img.alt = conteudo.alt || '';
    img.draggable = false;
    el.appendChild(img);
  } else {
    el.textContent = conteudo.texto;
  }
}

function desenhar() {
  tabuleiro.innerHTML = '';
  const colunas = jogo.cartas.length <= 6 ? 3 : 4;
  tabuleiro.style.gridTemplateColumns = `repeat(${colunas}, 1fr)`;

  jogo.cartas.forEach((carta, i) => {
    const el = document.createElement('button');
    el.className = 'carta';
    el.dataset.indice = i;
    if (carta.virada || carta.combinada) {
      el.classList.add('aberta');
      preencher(el, carta.conteudo);
    }
    if (carta.combinada) el.classList.add('combinada');
    if (jogo.bloqueado && jogo.selecionadas.includes(i)) el.classList.add('errada');
    // clique de verdade (dedo ou mouse) = "toque"; clique gerado pela câmera não é "confiável" para o navegador
    el.addEventListener('click', (ev) => aoClicar(i, ev.isTrusted ? 'toque' : 'camera'));
    tabuleiro.appendChild(el);
  });
}

// ---------------------------------------------------------------- registro

// Nome curto e legível de uma carta: o arquivo da imagem (sem pasta e extensão) ou o texto.
function descrever(conteudo) {
  if (conteudo.imagem) return conteudo.imagem.split('/').pop().replace(/\.[^.]+$/, '');
  return conteudo.texto;
}

function iniciarRegistro() {
  registro = {
    idRodada: novoIdRodada(),
    criadoEm: Date.now(),
    tema,
    idJogador: jogador,
    pares: jogo.cartas.length / 2,
    tempoConfigurado: config.temas[tema].tempoSegundos,
    previa: config.tempoPreviaSegundos > 0 ? config.tempoPreviaSegundos : 0,
    inicioMs: null,          // preenchido quando o relógio começa (depois da prévia)
    tentativas: [],
    primeira: null,          // primeira carta virada da tentativa em andamento
    entradas: new Set(),
    errados: new Set(),      // pares que já apareceram em tentativas erradas
    acertosDePrimeira: 0,
    primeiroAcertoMs: null,
    enviado: false,
  };
}

function registrarJogada(resultado, indice, origem) {
  const agora = Date.now();
  registro.entradas.add(origem);

  if (resultado === 'primeira') {
    registro.primeira = { indice, origem, em: agora };
    return;
  }

  // 'acerto' ou 'erro': fecha a tentativa (duas cartas viradas)
  const a = registro.primeira;
  if (!a) return;
  const cartaA = jogo.cartas[a.indice];
  const cartaB = jogo.cartas[indice];
  const acertou = resultado === 'acerto';

  registro.tentativas.push({
    id_rodada: registro.idRodada,
    tentativa: registro.tentativas.length + 1,
    tempo_ms: agora - registro.inicioMs,
    duracao_ms: agora - a.em,
    carta_1: descrever(cartaA.conteudo),
    par_1: cartaA.chave ?? '',
    carta_2: descrever(cartaB.conteudo),
    par_2: cartaB.chave ?? '',
    acertou: acertou ? 1 : 0,
    entrada: origem,
  });
  registro.primeira = null;

  if (acertou) {
    if (!registro.errados.has(cartaA.idPar)) registro.acertosDePrimeira++;
    if (registro.primeiroAcertoMs === null) registro.primeiroAcertoMs = agora - registro.inicioMs;
  } else {
    registro.errados.add(cartaA.idPar);
    registro.errados.add(cartaB.idPar);
  }
}

function resumoEntrada(entradas) {
  if (entradas.size === 0) return '';
  return entradas.size > 1 ? 'misto' : [...entradas][0];
}

const segundos = (ms) => Math.round(ms / 100) / 10;

// Envia o resumo e as tentativas da rodada à planilha (uma vez só por rodada).
function finalizarRegistro(resultado) {
  if (!registro || registro.enviado) return;
  const r = registro;
  r.enviado = true;
  if (resultado === 'abandonou' && r.tentativas.length === 0) return; // só olhou os temas: não registra

  const fim = Date.now();
  const lote = {
    rodada: {
      id_rodada: r.idRodada,
      data_hora: new Date(r.criadoEm).toISOString(),
      id_aparelho: config.registrarAparelho ? idAparelho() : '',
      id_jogador: r.idJogador,
      tema: r.tema,
      pares: r.pares,
      tempo_configurado_s: r.tempoConfigurado,
      previa_s: r.previa,
      resultado,
      pares_encontrados: jogo.cartas.filter((c) => c.combinada).length / 2,
      tentativas: r.tentativas.length,
      erros: r.tentativas.filter((t) => !t.acertou).length,
      acertos_de_primeira: r.acertosDePrimeira,
      tempo_usado_s: segundos(fim - (r.inicioMs ?? fim)),
      tempo_primeiro_acerto_s: r.primeiroAcertoMs === null ? '' : segundos(r.primeiroAcertoMs),
      entrada: resumoEntrada(r.entradas),
    },
    tentativas: r.tentativas,
  };
  registrarRodada(lote, config.enderecoRegistro);
}

// ---------------------------------------------------------------- jogo

function terminar(texto, resultado) {
  clearInterval(intervalo);
  encerrado = true;
  mensagem.textContent = texto;
  finalizarRegistro(resultado);
}

// Único ponto de entrada: toque ou câmera.
function aoClicar(indice, origem = 'camera') {
  if (encerrado || previa) return;
  const resultado = virarCarta(jogo, indice);
  if (resultado === 'ignorada') return;
  registrarJogada(resultado, indice, origem);
  desenhar();
  if (resultado === 'erro') {
    const jogoAtual = jogo;
    setTimeout(() => {
      if (jogo !== jogoAtual) return; // a rodada mudou nesse meio tempo
      esconderErradas(jogo);
      desenhar();
    }, 1100);
  }
  if (venceu(jogo)) terminar('Você venceu! 🎉', 'venceu');
}

function mostrarEscolha() {
  clearInterval(intervaloPrevia);
  previa = false;
  clearInterval(intervalo);
  if (!encerrado) finalizarRegistro('abandonou'); // saiu no meio da rodada
  encerrado = true;
  jogo = null;
  mensagem.textContent = '';
  relogio.textContent = '';
  rotuloJogador.hidden = true;
  tabuleiro.hidden = true;
  escolha.hidden = false;
}

function iniciarRelogio() {
  clearInterval(intervalo);
  if (registro) registro.inicioMs = Date.now();
  intervalo = setInterval(() => {
    tempoRestante--;
    atualizarRelogio();
    if (tempoRestante <= 0) terminar('Tempo esgotado!', 'tempo_esgotado');
  }, 1000);
}

function mostrarPrevia() {
  let restante = config.tempoPreviaSegundos;
  if (restante <= 0) {
    iniciarRelogio();
    return;
  }

  previa = true;
  jogo.cartas.forEach((c) => { c.virada = true; });
  desenhar();
  mensagem.textContent = `Memorize! As cartas se escondem em ${restante}s`;

  clearInterval(intervaloPrevia);
  intervaloPrevia = setInterval(() => {
    restante--;
    if (restante > 0) {
      mensagem.textContent = `Memorize! As cartas se escondem em ${restante}s`;
      return;
    }
    clearInterval(intervaloPrevia);
    previa = false;
    jogo.cartas.forEach((c) => { c.virada = false; });
    mensagem.textContent = '';
    desenhar();
    iniciarRelogio();
  }, 1000);
}

function iniciar(chaveTema, numero) {
  const { pares, tempoSegundos } = config.temas[chaveTema];
  let novoJogo;
  try {
    novoJogo = criarJogo(bancos[chaveTema], pares);
  } catch (erro) {
    console.error(erro);
    mensagem.textContent = 'Este tema não tem pares suficientes. Veja o console.';
    return;
  }

  clearInterval(intervalo);
  clearInterval(intervaloPrevia);
  jogo = novoJogo;
  tema = chaveTema;
  jogador = numero;
  tempoRestante = tempoSegundos;
  encerrado = false;
  mensagem.textContent = '';
  escolha.hidden = true;
  tabuleiro.hidden = false;
  rotuloJogador.textContent = `Nº ${jogador}`;
  rotuloJogador.hidden = false;
  iniciarRegistro();
  atualizarRelogio();
  desenhar();
  mostrarPrevia();
}

// ---------------------------------------------------------------- botões e arranque

// Confere o número de identificação (obrigatório, só dígitos e exclusivo deste aparelho) e começa a rodada.
async function tentarIniciar(chaveTema) {
  const numero = campoNumero.value.replace(/\D/g, '');
  erroNumero.textContent = '';
  if (!numero) {
    erroNumero.textContent = 'Digite o seu número de identificação para escolher o jogo.';
    campoNumero.focus();
    return;
  }

  const botoes = [...listaTemas.children];
  botoes.forEach((b) => { b.disabled = true; });
  erroNumero.textContent = 'Verificando o número...';
  const situacao = await reservarNumero(numero, config.enderecoRegistro);
  botoes.forEach((b) => { b.disabled = false; });

  if (situacao === 'ocupado') {
    erroNumero.textContent = 'Esse número já foi usado por outra pessoa. Escolha outro número.';
    campoNumero.focus();
    return;
  }
  if (situacao === 'sem_conexao' || situacao === 'erro') {
    erroNumero.textContent = 'Não foi possível verificar o número agora. Confira a internet e tente de novo.';
    return;
  }
  erroNumero.textContent = '';
  iniciar(chaveTema, numero);
}

campoNumero.addEventListener('input', () => {
  campoNumero.value = campoNumero.value.replace(/\D/g, ''); // só números
});

// Botões de tema, criados a partir do config
Object.entries(config.temas).forEach(([chave, t]) => {
  const botao = document.createElement('button');
  botao.className = 'nivel';
  botao.id = `nivel-${chave}`;
  botao.textContent = t.nome;
  botao.addEventListener('click', () => tentarIniciar(chave));
  listaTemas.appendChild(botao);
});

botaoNovo.addEventListener('click', mostrarEscolha);

botaoCamera.addEventListener('click', async () => {
  botaoCamera.disabled = true;
  botaoCamera.textContent = 'Carregando...';
  try {
    await iniciarCamera(aoClicar);
    botaoCamera.textContent = 'Câmera ligada';
  } catch (erro) {
    console.error(erro);
    botaoCamera.disabled = false;
    botaoCamera.textContent = 'Ativar câmera';
    mensagem.textContent = 'Não consegui ligar a câmera. Veja o console.';
  }
});

botaoTelaCheia.addEventListener('click', () => {
  const raiz = document.documentElement;
  const emTelaCheia = document.fullscreenElement || document.webkitFullscreenElement;
  if (emTelaCheia) {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  } else {
    (raiz.requestFullscreen || raiz.webkitRequestFullscreen).call(raiz);
  }
});

if (!config.enderecoRegistro) {
  console.warn('config.enderecoRegistro está vazio: as rodadas não são registradas (ficam na fila do aparelho).');
}
enviarPendentes(config.enderecoRegistro);
window.addEventListener('online', () => enviarPendentes(config.enderecoRegistro));

mostrarEscolha();