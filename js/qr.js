// Ao tocar no QR code da tela inicial, ele abre grande no meio da tela (como uma foto de galeria),
// para o celular do aluno conseguir ler de longe. Fecha ao tocar em qualquer lugar, no X ou com Esc.
const mini = document.getElementById('qr');

if (mini) {
  const imagem = mini.querySelector('img');
  mini.tabIndex = 0;
  mini.setAttribute('role', 'button');
  mini.setAttribute('aria-label', 'Ampliar o QR code');

  const painel = document.createElement('div');
  painel.id = 'qr-ampliado';
  painel.hidden = true;
  painel.innerHTML =
    '<button type="button" id="qr-fechar" aria-label="Fechar">✕</button>' +
    '<img alt="' + (imagem ? imagem.alt : 'QR code') + '" src="' + (imagem ? imagem.src : '') + '">' +
    '<p>Aponte a câmera do celular para o QR code</p>';
  document.body.appendChild(painel);

  const abrir = () => { painel.hidden = false; };
  const fechar = () => { painel.hidden = true; };

  mini.addEventListener('click', abrir);
  mini.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); }
  });
  painel.addEventListener('click', fechar);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });
}
