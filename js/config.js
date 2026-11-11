// Ajuste aqui antes da apresentação.
// pares = pares por rodada (cartas = pares x 2); tempoSegundos = duração da rodada.
export const config = {
    // Endereço (URL) da planilha do Google que recebe as rodadas (veja apps-script/Code.gs).
enderecoRegistro: 'https://script.google.com/macros/s/AKfycbzhsuRQrBnRhDzYrp33uCG1CkjAYW7q04YuwjGAwlCyPZJ6QFAaoHSNymVFGGyhsQIp/exec',

  // Se true, cada rodada também leva um código anônimo do aparelho. Com o número de identificação
  // já registrado, normalmente não é preciso.
  registrarAparelho: false,
  // segundos em que todas as cartas ficam à mostra no início (0 desliga)
  tempoPreviaSegundos: 5,
  temas: {
    planas:      { nome: 'Figuras planas',      pares: 6, tempoSegundos: 120 },
    solidos:     { nome: 'Sólidos geométricos', pares: 5, tempoSegundos: 120 },
    objetos:     { nome: 'Objetos e figuras',   pares: 5, tempoSegundos: 150 },
    objetosNome: { nome: 'Qual é a figura?',    pares: 5, tempoSegundos: 120 },
    objetosPlanos: { nome: 'Objetos planos', pares: 5, tempoSegundos: 120 },
  },
};