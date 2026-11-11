import { planas, solidos, objetos, objetosNome, objetosPlanos } from './dados.js';
import { config } from './config.js';
import { criarJogo, virarCarta, esconderErradas, venceu } from './memoria.js';
import { iniciarCamera } from './camera.js';

const bancos = { planas, solidos, objetos, objetosNome, objetosPlanos };

const tabuleiro = document.getElementById('tabuleiro');
const escolha = document.getElementById('escolha');
const listaTemas = document.getElementById('niveis');
const relogio = document.getElementById('relogio');
const mensagem = document.getElementById('mensagem');
const botaoNovo = document.getElementById('novo');
const botaoCamera = document.getElementById('camera');
const botaoTelaCheia = document.getElementById('tela-cheia');

let jogo, tempoRestante, intervalo;
let encerrado = true;

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
    el.addEventListener('click', () => aoClicar(i));
    tabuleiro.appendChild(el);
  });
}

function terminar(texto) {
  clearInterval(intervalo);
  encerrado = true;
  mensagem.textContent = texto;
}

// Único ponto de entrada: toque ou câmera.
function aoClicar(indice) {
  if (encerrado) return;
  const resultado = virarCarta(jogo, indice);
  if (resultado === 'ignorada') return;
  desenhar();
  if (resultado === 'erro') {
    const jogoAtual = jogo;
    setTimeout(() => {
      if (jogo !== jogoAtual) return; // a rodada mudou nesse meio tempo
      esconderErradas(jogo);
      desenhar();
    }, 1100);
  }
  if (venceu(jogo)) terminar('Você venceu! 🎉');
}

function mostrarEscolha() {
  clearInterval(intervalo);
  encerrado = true;
  jogo = null;
  mensagem.textContent = '';
  relogio.textContent = '';
  tabuleiro.hidden = true;
  escolha.hidden = false;
}

function iniciar(tema) {
  const { pares, tempoSegundos } = config.temas[tema];
  let novoJogo;
  try {
    novoJogo = criarJogo(bancos[tema], pares);
  } catch (erro) {
    console.error(erro);
    mensagem.textContent = 'Este tema não tem pares suficientes. Veja o console.';
    return;
  }

  clearInterval(intervalo);
  jogo = novoJogo;
  tempoRestante = tempoSegundos;
  encerrado = false;
  mensagem.textContent = '';
  escolha.hidden = true;
  tabuleiro.hidden = false;
  atualizarRelogio();
  desenhar();
  intervalo = setInterval(() => {
    tempoRestante--;
    atualizarRelogio();
    if (tempoRestante <= 0) terminar('Tempo esgotado!');
  }, 1000);
}

// Botões de tema, criados a partir do config
Object.entries(config.temas).forEach(([chave, tema]) => {
  const botao = document.createElement('button');
  botao.className = 'nivel';
  botao.id = `nivel-${chave}`;
  botao.textContent = tema.nome;
  botao.addEventListener('click', () => iniciar(chave));
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

mostrarEscolha();