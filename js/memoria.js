export function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Um par só pode entrar na rodada se não se confundir com os já escolhidos.
// Pares sem "figura" (os temas antigos) são sempre compatíveis entre si.
function compativel(par, escolhidos) {
  if (par.figura === undefined) return true;
  return escolhidos.every((outro) =>
    outro.figura === undefined ||
    (outro.figura !== par.figura &&
      !par.conflita?.includes(outro.figura) &&
      !outro.conflita?.includes(par.figura))
  );
}

export function sortearPares(banco, quantidade) {
  let maisLonga = 0;

  // Sorteio guloso; se a rodada não fechar, recomeça (algumas combinações travam).
  for (let tentativa = 0; tentativa < 50; tentativa++) {
    const escolhidos = [];
    const chavesUsadas = new Set();

    for (const par of embaralhar(banco)) {
      if (chavesUsadas.has(par.chave)) continue; // mesma chave: pula
      if (!compativel(par, escolhidos)) continue; // confunde com algum já escolhido: pula
      chavesUsadas.add(par.chave);
      escolhidos.push(par);
      if (escolhidos.length === quantidade) return escolhidos;
    }
    maisLonga = Math.max(maisLonga, escolhidos.length);
  }

  throw new Error(
    `O banco só consegue montar ${maisLonga} pares compatíveis, mas pediu ${quantidade}.`
  );
}

function criarCartas(pares) {
  const cartas = pares.flatMap((par, idPar) => [
    { idPar, chave: par.chave, conteudo: par.a, virada: false, combinada: false },
    { idPar, chave: par.chave, conteudo: par.b, virada: false, combinada: false },
  ]);
  return embaralhar(cartas);
}

export function criarJogo(banco, quantidadePares) {
  return {
    cartas: criarCartas(sortearPares(banco, quantidadePares)),
    selecionadas: [],
    bloqueado: false,
  };
}

// Retorna: "ignorada", "primeira", "acerto" ou "erro"
export function virarCarta(jogo, indice) {
  const carta = jogo.cartas[indice];
  if (jogo.bloqueado || carta.virada || carta.combinada) return "ignorada";

  carta.virada = true;
  jogo.selecionadas.push(indice);
  if (jogo.selecionadas.length < 2) return "primeira";

  const [a, b] = jogo.selecionadas;
  if (jogo.cartas[a].idPar === jogo.cartas[b].idPar) {
    jogo.cartas[a].combinada = true;
    jogo.cartas[b].combinada = true;
    jogo.selecionadas = [];
    return "acerto";
  }
  jogo.bloqueado = true;
  return "erro";
}

export function esconderErradas(jogo) {
  jogo.selecionadas.forEach((i) => { jogo.cartas[i].virada = false; });
  jogo.selecionadas = [];
  jogo.bloqueado = false;
}

export function venceu(jogo) {
  return jogo.cartas.every((c) => c.combinada);
}