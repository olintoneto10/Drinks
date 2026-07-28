// Instalar como app.
//
// O MeuBar já é um PWA completo — manifesto, service worker, funciona offline —
// e nunca dizia isso a ninguém. Quem usava pelo navegador continuava usando pelo
// navegador, e um app de bar aberto no meio de uma aba perdida não é o app que
// se abre com o copo na mão.
//
// Duas regras que o convite respeita, porque o app inteiro respeita:
// 1. O convite é merecido, não automático. Só aparece depois de um momento de
//    valor de verdade — um drink registrado, um preparo terminado. Pedir
//    instalação a quem acabou de chegar é cobrar antes de servir.
// 2. "Não" é resposta. Cada recusa dobra a espera, e na terceira o app para de
//    perguntar para sempre. O caminho manual continua no Diário, para quem
//    mudar de ideia.

const ESPERA_RECUSA = [30, 90];   // dias de silêncio depois da 1ª e da 2ª recusa
const MAX_RECUSAS = ESPERA_RECUSA.length;

let promptNativo = null;    // o evento do Chrome, guardado para usar no clique
let convidouNestaSessao = false;

// Chrome/Edge/Android avisam antes de mostrar a barra deles; guardamos o evento
// para disparar no nosso momento, não no deles.
window.addEventListener('beforeinstallprompt', ev => {
  ev.preventDefault();
  promptNativo = ev;
});

window.addEventListener('appinstalled', () => {
  promptNativo = null;
  Store.setInstalar({ ...Store.getInstalar(), instalado: true });
  document.getElementById('convite-instalar')?.remove();
  renderLinhaInstalar();
  toast('MeuBar instalado', 'Agora ele abre direto da sua tela inicial.');
});

function jaEhApp() {
  return window.matchMedia?.('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
}

// iOS não tem beforeinstallprompt: no Safari a instalação é manual, pelo menu
// Compartilhar. Sem esta checagem o convite viraria um botão que não faz nada.
function ehIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function podeInstalar() {
  return !jaEhApp() && (!!promptNativo || ehIOS());
}

function esperaCumprida(dados) {
  if (!dados.recusas) return true;
  if (dados.recusas >= MAX_RECUSAS) return false;
  const dias = (Date.now() - new Date(dados.quando || 0)) / 86400000;
  return dias >= ESPERA_RECUSA[dados.recusas - 1];
}

// A tela está ocupada quando há celebração, modal, diálogo ou aviso na frente.
// O momento de valor é justamente o mais concorrido do app — brinde, marco e
// aviso de registro acontecem todos ali —, e o convite chegando por cima vira
// exatamente o pedágio que ele não deve ser.
function telaOcupada() {
  return !!(document.getElementById('brinde')
    || document.getElementById('boasvindas')
    || document.querySelector('.dialogo-fundo')
    || document.querySelector('#modal.aberto')
    || document.querySelector('#toasts .toast'));
}

// Chamada nos momentos de valor. `motivo` só muda a primeira linha do convite:
// o texto fala do que a pessoa acabou de fazer, não do app.
function talvezConvidarInstalar(motivo = 'geral') {
  if (convidouNestaSessao || !podeInstalar()) return false;
  const dados = Store.getInstalar();
  if (dados.instalado || !esperaCumprida(dados)) return false;
  convidouNestaSessao = true;
  esperarTelaLivre(() => abrirConviteInstalar(motivo));
  return true;
}

// Espera a tela esvaziar, com teto: se em 30s a pessoa não terminou o que
// estava fazendo, desiste em silêncio e libera a próxima sessão para tentar.
function esperarTelaLivre(acao, tentativas = 40) {
  if (!telaOcupada()) { setTimeout(acao, 700); return; }
  if (tentativas <= 0) { convidouNestaSessao = false; return; }
  setTimeout(() => esperarTelaLivre(acao, tentativas - 1), 750);
}

const LINHA_MOTIVO = {
  registro: 'Seu diário começou.',
  preparo: 'Drink pronto, receita na mão.',
  geral: 'Seu bar está de pé.',
};

function abrirConviteInstalar(motivo = 'geral') {
  if (document.getElementById('convite-instalar') || !podeInstalar()) return;
  const caixa = document.createElement('div');
  caixa.id = 'convite-instalar';
  caixa.setAttribute('role', 'dialog');
  caixa.setAttribute('aria-label', 'Instalar o MeuBar');
  caixa.innerHTML = `
    <button class="ci-fechar" data-recusar aria-label="Agora não">✕</button>
    <p class="ci-motivo">${esc(LINHA_MOTIVO[motivo] || LINHA_MOTIVO.geral)}</p>
    <h3>Leve o MeuBar para a tela inicial</h3>
    <p class="ci-texto">${ehIOS()
      ? 'No Safari: toque em <strong>Compartilhar</strong> (o quadrado com a seta) e '
        + 'depois em <strong>Adicionar à Tela de Início</strong>.'
      : 'Ele abre sozinho, sem barra de navegador, e <strong>funciona sem internet</strong> '
        + '— receitas, diário e fotos ficam no aparelho.'}</p>
    <div class="ci-acoes">
      ${ehIOS() ? '' : '<button class="btn primario" data-instalar>Instalar</button>'}
      <button class="btn" data-recusar>${ehIOS() ? 'Entendi' : 'Agora não'}</button>
    </div>`;
  document.body.appendChild(caixa);
  requestAnimationFrame(() => caixa.classList.add('aberto'));

  const fechar = () => {
    caixa.classList.remove('aberto');
    setTimeout(() => caixa.remove(), 300);
  };

  caixa.addEventListener('click', async ev => {
    if (ev.target.closest('[data-recusar]')) {
      // No iOS não há o que recusar — as instruções são a resposta inteira, e
      // marcar recusa esconderia o convite de quem só leu e fechou.
      if (!ehIOS()) {
        const dados = Store.getInstalar();
        Store.setInstalar({ ...dados, recusas: (dados.recusas || 0) + 1, quando: new Date().toISOString() });
      }
      fechar();
      return;
    }
    if (ev.target.closest('[data-instalar]')) {
      fechar();
      await dispararInstalacao();
    }
  });
}

async function dispararInstalacao() {
  if (!promptNativo) return;
  const evento = promptNativo;
  promptNativo = null;   // o evento do Chrome só serve uma vez
  try {
    evento.prompt();
    const { outcome } = await evento.userChoice;
    if (outcome === 'dismissed') {
      const dados = Store.getInstalar();
      Store.setInstalar({ ...dados, recusas: (dados.recusas || 0) + 1, quando: new Date().toISOString() });
      promptNativo = evento;   // recusou o diálogo do sistema, não o convite
    }
  } catch { /* navegador recusou o pedido */ }
  renderLinhaInstalar();
}

// Caminho permanente, no rodapé do Diário: quem disse "agora não" três vezes,
// ou quem apagou os dados, ainda consegue instalar quando quiser.
function renderLinhaInstalar() {
  const alvo = document.getElementById('linha-instalar');
  if (!alvo) return;
  if (jaEhApp()) {
    alvo.innerHTML = '<p class="dica">📲 Você está usando o MeuBar instalado. '
      + 'Ele funciona sem internet.</p>';
    return;
  }
  if (!podeInstalar()) { alvo.innerHTML = ''; return; }
  alvo.innerHTML = '<button class="btn" id="btn-instalar-app">📲 Instalar o MeuBar no celular</button>';
}
