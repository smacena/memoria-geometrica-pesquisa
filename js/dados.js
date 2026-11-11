// Cada par tem uma "chave" (o nome da figura) e dois lados: a e b.
// Cada lado é { imagem, alt } ou { texto }.
const figura = (pasta, arquivo, nome) => ({
  chave: nome,
  a: { imagem: `img/${pasta}/${arquivo}`, alt: nome },
  b: { texto: nome },
});

const objetoEFigura = (objeto, solido, nome) => ({
  chave: nome,
  a: { imagem: `img/objetos/${objeto}.gif`, alt: `Objeto: ${nome}` },
  b: { imagem: `img/solidos/${solido}.gif`, alt: nome },
});

const objetoENome = (objeto, nome) => ({
  chave: nome,
  a: { imagem: `img/objetos/${objeto}.gif`, alt: `Objeto: ${nome}` },
  b: { texto: nome },
});

export const planas = [
  figura('planas', 'triangulo.svg', 'Triângulo'),
  figura('planas', 'quadrado.svg', 'Quadrado'),
  figura('planas', 'retangulo.svg', 'Retângulo'),
  figura('planas', 'losango.svg', 'Losango'),
  figura('planas', 'trapezio.svg', 'Trapézio'),
  figura('planas', 'paralelogramo.svg', 'Paralelogramo'),
  figura('planas', 'pentagono.svg', 'Pentágono'),
  figura('planas', 'hexagono.svg', 'Hexágono'),
  figura('planas', 'octogono.svg', 'Octógono'),
  figura('planas', 'circulo.svg', 'Círculo'),
  figura('planas', 'triangulo-retangulo.svg', 'Triângulo retângulo'),
  figura('planas', 'triangulo-isosceles.svg', 'Triângulo isósceles'),
  figura('planas', 'triangulo-escaleno.svg', 'Triângulo escaleno'),
  figura('planas', 'angulo-agudo.svg', 'Ângulo agudo'),
  figura('planas', 'angulo-reto.svg', 'Ângulo reto'),
  figura('planas', 'angulo-obtuso.svg', 'Ângulo obtuso'),
  figura('planas', 'setor-circular.svg', 'Setor circular'),
  figura('planas', 'semicirculo.svg', 'Semicírculo'),
  figura('planas', 'elipse.svg', 'Elipse'),
  figura('planas', 'coroa-circular.svg', 'Coroa circular'),
  figura('planas', 'heptagono.svg', 'Heptágono'),
  figura('planas', 'decagono.svg', 'Decágono'),
];

export const solidos = [
  figura('solidos', 'cubo.gif', 'Cubo'),
  figura('solidos', 'paralelepipedo.gif', 'Paralelepípedo'),
  figura('solidos', 'cilindro.gif', 'Cilindro'),
  figura('solidos', 'cone.gif', 'Cone'),
  figura('solidos', 'esfera.gif', 'Esfera'),
  figura('solidos', 'piramide.gif', 'Pirâmide'),
  figura('solidos', 'prisma-triangular.gif', 'Prisma triangular'),
  figura('solidos', 'tetraedro.gif', 'Tetraedro'),
  figura('solidos', 'octaedro.gif', 'Octaedro'),
  figura('solidos', 'prisma-hexagonal.gif', 'Prisma hexagonal'),
  figura('solidos', 'tronco-de-cone.gif', 'Tronco de cone'),
  figura('solidos', 'tronco-de-piramide.gif', 'Tronco de pirâmide'),
  figura('solidos', 'semiesfera.gif', 'Semiesfera'),
  figura('solidos', 'piramide-pentagonal.gif', 'Pirâmide pentagonal'),
];

export const objetos = [
  objetoEFigura('caixa-de-leite', 'paralelepipedo', 'Paralelepípedo'),
  objetoEFigura('dado', 'cubo', 'Cubo'),
  objetoEFigura('lata', 'cilindro', 'Cilindro'),
  objetoEFigura('casquinha', 'cone', 'Cone'),
  objetoEFigura('bola', 'esfera', 'Esfera'),
  objetoEFigura('barraca', 'prisma-triangular', 'Prisma triangular'),
  objetoEFigura('lapis', 'prisma-hexagonal', 'Prisma hexagonal'),
  objetoEFigura('tijolo', 'paralelepipedo', 'Paralelepípedo'),
  objetoEFigura('copo', 'tronco-de-cone', 'Tronco de cone'),
  objetoEFigura('vaso', 'tronco-de-cone', 'Tronco de cone'),
  objetoEFigura('chapeu-de-festa', 'cone', 'Cone'),
  objetoEFigura('laranja', 'esfera', 'Esfera'),
  objetoEFigura('pilha', 'cilindro', 'Cilindro'),
  objetoEFigura('caixa-de-presente', 'cubo', 'Cubo'),
  objetoEFigura('piramide-do-egito', 'piramide', 'Pirâmide'),
  objetoEFigura('diamante', 'octaedro', 'Octaedro'),
  objetoEFigura('iglu', 'semiesfera', 'Semiesfera'),
];

export const objetosNome = [
  objetoENome('caixa-de-leite', 'Paralelepípedo'),
  objetoENome('dado', 'Cubo'),
  objetoENome('lata', 'Cilindro'),
  objetoENome('casquinha', 'Cone'),
  objetoENome('bola', 'Esfera'),
  objetoENome('barraca', 'Prisma triangular'),
  objetoENome('lapis', 'Prisma hexagonal'),
  objetoENome('tijolo', 'Paralelepípedo'),
  objetoENome('copo', 'Tronco de cone'),
  objetoENome('vaso', 'Tronco de cone'),
  objetoENome('chapeu-de-festa', 'Cone'),
  objetoENome('laranja', 'Esfera'),
  objetoENome('pilha', 'Cilindro'),
  objetoENome('caixa-de-presente', 'Cubo'),
  objetoENome('piramide-do-egito', 'Pirâmide'),
  objetoENome('diamante', 'Octaedro'),
  objetoENome('iglu', 'Semiesfera'),
];

const objetoPlano = (objeto, figuraArquivo, nome) => ({
  chave: nome,
  a: { imagem: `img/objetos-planos/${objeto}.svg`, alt: `Objeto: ${nome}` },
  b: { imagem: `img/planas/${figuraArquivo}.svg`, alt: nome },
});

export const objetosPlanos = [
  objetoPlano('relogio', 'circulo', 'Círculo'),
  objetoPlano('janela', 'retangulo', 'Retângulo'),
  objetoPlano('placa-atencao', 'triangulo', 'Triângulo'),
  objetoPlano('azulejo', 'quadrado', 'Quadrado'),
  objetoPlano('pizza', 'setor-circular', 'Setor circular'),
  objetoPlano('cd', 'coroa-circular', 'Coroa circular'),
  objetoPlano('rampa', 'triangulo-retangulo', 'Triângulo retângulo'),
  objetoPlano('pipa', 'losango', 'Losango'),
  objetoPlano('favo', 'hexagono', 'Hexágono'),
];