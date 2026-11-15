// Modo "figura + característica".
// Cada figura tem suas características VERDADEIRAS. Uma característica pode valer para várias figuras
// (ex.: "Tem 12 arestas" vale para cubo e paralelepípedo); o que importa é que as figuras que
// compartilham a frase não entrem juntas na mesma rodada (isso é calculado abaixo, em "conflita").

const verdadeiras = {
  "Cubo": [
    "Tem 6 faces",
    "Tem 12 arestas",
    "Tem 8 vértices",
    "Todas as faces são quadrados",
    "Todas as arestas têm a mesma medida",
    "É um poliedro",
    "É uma figura tridimensional",
    "Todas as suas faces são planas",
  ],
  "Paralelepípedo": [
    "Tem 6 faces",
    "Tem 12 arestas",
    "Tem 8 vértices",
    "Todas as faces são retângulos",
    "As faces opostas são paralelas e iguais",
    "É um poliedro",
    "É uma figura tridimensional",
    "Todas as suas faces são planas",
  ],
  "Cilindro": [
    "Tem duas bases circulares",
    "Tem uma superfície lateral curva",
    "Tem duas faces planas",
    "Não tem vértices",
    "É um corpo redondo",
    "As duas bases são paralelas e iguais",
    "É uma figura tridimensional",
    "Não é um poliedro",
  ],
  "Cone": [
    "Tem uma base circular",
    "Tem um vértice",
    "Tem uma superfície lateral curva",
    "Tem uma única face plana",
    "É um corpo redondo",
    "Não é um poliedro",
    "É uma figura tridimensional",
    "Nenhuma de suas faces é um polígono",
  ],
  "Esfera": [
    "Tem superfície curva",
    "Não tem arestas",
    "Não tem vértices",
    "Não tem nenhuma face plana",
    "Todos os pontos da superfície estão à mesma distância do centro",
    "É uma figura tridimensional",
    "É um corpo redondo",
    "Não é um poliedro",
  ],
  "Pirâmide": [
    "Tem 5 faces",
    "Tem 8 arestas",
    "Tem 5 vértices",
    "Sua base é um quadrado",
    "Tem 4 faces laterais triangulares",
    "É um poliedro",
    "É uma figura tridimensional",
    "Suas faces laterais se encontram em um único vértice",
  ],
  "Prisma triangular": [
    "Tem 5 faces",
    "Tem 9 arestas",
    "Tem 6 vértices",
    "Tem duas bases triangulares",
    "Tem 3 faces laterais retangulares",
    "As duas bases são paralelas e iguais",
    "É um poliedro",
    "É uma figura tridimensional",
  ],
  "Quadrado": [
    "Tem 4 lados",
    "Tem 4 vértices",
    "Tem 4 ângulos retos",
    "Todos os lados têm a mesma medida",
    "Os lados opostos são paralelos",
    "É um polígono",
    "É um quadrilátero",
    "É uma figura plana",
  ],
  "Retângulo": [
    "Tem 4 lados",
    "Tem 4 vértices",
    "Tem 4 ângulos retos",
    "Os lados opostos são paralelos",
    "Os lados opostos têm a mesma medida",
    "É um quadrilátero",
    "É um polígono",
    "É uma figura plana",
  ],
  "Triângulo": [
    "Tem 3 lados",
    "Tem 3 vértices",
    "Tem 3 ângulos internos",
    "A soma dos ângulos internos é 180°",
    "É um polígono",
    "É uma figura plana",
    "É o polígono com menor número de lados",
    "Todos os seus lados são segmentos de reta",
  ],
  "Círculo": [
    "Não tem vértices",
    "Não é um polígono",
    "Todos os pontos do contorno estão à mesma distância do centro",
    "É uma figura plana",
    "Tem raio e diâmetro",
    "Seu contorno é uma curva fechada",
    "Não tem lados retos",
    "Tem centro",
  ],
  "Hexágono": [
    "Tem 6 lados",
    "Tem 6 vértices",
    "Tem 6 ângulos internos",
    "A soma dos ângulos internos é 720°",
    "É um polígono",
    "É uma figura plana",
    "Todos os seus lados são segmentos de reta",
    "Tem mais lados que um pentágono",
  ],
  "Losango": [
    "Tem 4 lados",
    "Tem 4 vértices",
    "Todos os lados têm a mesma medida",
    "Os lados opostos são paralelos",
    "As diagonais são perpendiculares",
    "É um quadrilátero",
    "É um polígono",
    "É uma figura plana",
  ],
};

// Imagens: [nome, figura que representa, caminho]
const imagens = [
  ['Cubo', 'Cubo', 'img/solidos/cubo.gif'],
  ['Paralelepípedo', 'Paralelepípedo', 'img/solidos/paralelepipedo.gif'],
  ['Cilindro', 'Cilindro', 'img/solidos/cilindro.gif'],
  ['Cone', 'Cone', 'img/solidos/cone.gif'],
  ['Esfera', 'Esfera', 'img/solidos/esfera.gif'],
  ['Pirâmide', 'Pirâmide', 'img/solidos/piramide.gif'],
  ['Prisma triangular', 'Prisma triangular', 'img/solidos/prisma-triangular.gif'],
  ['Quadrado', 'Quadrado', 'img/planas/quadrado.svg'],
  ['Retângulo', 'Retângulo', 'img/planas/retangulo.svg'],
  ['Triângulo', 'Triângulo', 'img/planas/triangulo.svg'],
  ['Círculo', 'Círculo', 'img/planas/circulo.svg'],
  ['Hexágono', 'Hexágono', 'img/planas/hexagono.svg'],
  ['Losango', 'Losango', 'img/planas/losango.svg'],
  ['Dado', 'Cubo', 'img/objetos/dado.gif'],
  ['Caixa de leite', 'Paralelepípedo', 'img/objetos/caixa-de-leite.gif'],
  ['Tijolo', 'Paralelepípedo', 'img/objetos/tijolo.gif'],
  ['Lata', 'Cilindro', 'img/objetos/lata.gif'],
  ['Chapéu de festa', 'Cone', 'img/objetos/chapeu-de-festa.gif'],
  ['Bola', 'Esfera', 'img/objetos/bola.gif'],
  ['Laranja', 'Esfera', 'img/objetos/laranja.gif'],
  ['Barraca', 'Prisma triangular', 'img/objetos/barraca.gif'],
  ['Pirâmide do Egito', 'Pirâmide', 'img/objetos/piramide-do-egito.gif'],
  ['Relógio', 'Círculo', 'img/objetos-planos/relogio.svg'],
  ['Janela', 'Retângulo', 'img/objetos-planos/janela.svg'],
  ['Placa de atenção', 'Triângulo', 'img/objetos-planos/placa-atencao.svg'],
];

// Famílias: figuras que se confundem (uma é caso particular da outra) nunca entram juntas,
// mesmo que a lista de características não registre a frase que as aproxima.
const familias = [
  ['Cubo', 'Paralelepípedo'],
  ['Quadrado', 'Retângulo', 'Losango'],
];

// Figuras (diferentes da dada) com as quais a frase gera confusão:
// as que também têm a frase como verdadeira + as da mesma família.
function outrasFiguras(figura, texto) {
  const mesmaFrase = Object.keys(verdadeiras).filter((f) => f !== figura && verdadeiras[f].includes(texto));
  const mesmaFamilia = familias.filter((fam) => fam.includes(figura)).flat().filter((f) => f !== figura);
  return [...new Set([...mesmaFrase, ...mesmaFamilia])];
}

// Um par para cada combinação imagem x característica verdadeira da figura dela.
//   chave   : identifica o par no registro (figura + frase)
//   figura  : a figura da imagem (objetos da mesma figura têm o mesmo valor)
//   conflita: figuras que NÃO podem estar na rodada, porque a frase também serve a elas
export const figuraCaracteristica = imagens.flatMap(([nome, figura, imagem]) =>
  verdadeiras[figura].map((texto) => ({
    chave: `${nome} | ${texto}`,
    figura,
    conflita: outrasFiguras(figura, texto),
    a: { imagem, alt: nome },
    b: { texto },
  }))
);