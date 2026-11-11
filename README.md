# Memória Geométrica (versão com pesquisa)

Jogo da memória para o ensino médio que liga figuras geométricas aos seus nomes e a objetos do dia a dia.
Funciona por toque, mouse ou com a mão, pela câmera. Esta versão registra as jogadas para análise do professor.

## Identificação

O jogador digita um número de identificação (só dígitos, de 1 a 8), sem nome. O número é obrigatório, aparece no
topo da tela e pertence ao celular que o usou primeiro: o mesmo celular joga quantas rodadas quiser com ele, e
outro celular recebe a mensagem de que o número já foi usado. "007" e "7" contam como o mesmo número.

## O que é registrado

Numa planilha do Google, com três abas criadas automaticamente:

- **Rodadas**: uma linha por rodada (tema, resultado, pares encontrados, tentativas, erros, acertos de primeira,
  tempo usado, tempo até o primeiro acerto e se jogou por toque ou câmera).
- **Tentativas**: uma linha para cada vez que o jogador vira duas cartas (quais cartas e a que pares pertencem,
  se acertou, tempos). Com isso dá para ver quais figuras os alunos mais confundem.
- **Numeros**: os números reservados e o aparelho dono de cada um.

Se o aparelho estiver sem internet ao terminar, a rodada fica numa fila e é enviada quando a conexão voltar.

## Como configurar a planilha (uma vez só)

1. Crie uma planilha nova no Google Planilhas, só para este jogo.
2. Em Extensões > Apps Script, cole o conteúdo de `apps-script/Code.gs` e salve.
3. Implantar > Nova implantação > "App da Web". Em "Executar como", escolha "Eu"; em "Quem tem acesso",
   "Qualquer pessoa". Autorize quando o Google pedir.
4. Cole o endereço do app (termina em `/exec`) em `enderecoRegistro`, em `js/config.js`.

Ao alterar o `Code.gs`, use Implantar > Gerenciar implantações > lápis > Nova versão, para manter o mesmo endereço.
O endereço fica no código público do repositório: quem o encontrar poderia enviar linhas falsas.

## Como testar no computador

    python3 -m http.server 8000

Abra http://localhost:8000. A câmera só funciona em `localhost` ou em HTTPS (por exemplo, GitHub Pages).
Com `enderecoRegistro` vazio, o jogo exige o número, mas não confere se ele já foi usado e não registra as rodadas.

## Ajustes

`js/config.js`: temas, pares e tempo de cada um, tempo da prévia, tempos da câmera, endereço da planilha.
`js/dados.js`: pares de cada tema.

## Estrutura

- `js/memoria.js`: regras do jogo, sem tela.
- `js/main.js`: telas, entrada e registro das jogadas.
- `js/camera.js`: detecção da mão (MediaPipe) e círculo de seleção.
- `js/registro.js`: número de identificação e envio à planilha, com fila offline.
- `apps-script/Code.gs`: código que recebe os dados e grava na planilha.