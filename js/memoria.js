export function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function sortearPares(banco, quantidade) {
  const escolhidos = [];
  const chavesUsadas = new Set();

  for (const par of embaralhar(banco)) {
    if (chavesUsadas.has(par.chave)) continue; // mesma figura: pula
    chavesUsadas.add(par.chave);
    escolhidos.push(par);
    if (escolhidos.length === quantidade) return escolhidos;
  }

  throw new Error(
    `O banco só tem ${escolhidos.length} pares diferentes, mas pediu ${quantidade}.`
  );
}

function criarCartas(pares) {
  const cartas = pares.flatMap((par, idPar) => [
    { idPar, conteudo: par.a, virada: false, combinada: false },
    { idPar, conteudo: par.b, virada: false, combinada: false },
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