# Memória Geométrica

Jogo da memória para o ensino médio que liga figuras geométricas aos seus nomes e aos objetos do dia a dia (caixa de leite, dado, lata). Pode ser jogado por toque ou com a mão, usando a câmera.

## Como rodar

    python3 -m http.server 8000

Abra http://localhost:8000. A câmera só funciona em `localhost` ou HTTPS.

## Temas
Figuras planas, sólidos geométricos, objetos e figuras, e "Qual é a figura?".

## Estrutura
- `js/memoria.js`: regras do jogo, sem nada de tela.
- `js/main.js`: tela e entrada (toque ou câmera).
- `js/camera.js`: detecção da mão (MediaPipe) e círculo de seleção.
- `js/config.js`: pares por rodada e tempo de cada tema.
- `js/dados.js`: bancos de pares.
- `img/`: figuras planas (SVG) e sólidos 3D (GIF).