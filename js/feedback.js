// Camada de feedback: avisos, confirmações e vibração com a identidade da casa.
// Substitui alert/confirm/prompt do sistema, que quebravam a imersão.

function prefereMenosMovimento() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ---------- Som do brinde ----------
// Um único som no app inteiro, no momento em que o drink fica pronto — e
// desligado por padrão. Áudio que toca sem aviso num app aberto no meio de uma
// festa é intrusivo, e "encantador na primeira vez, irritante na décima" é o
// destino de todo som automático. Quem quiser, liga em Ajustes.
//
// Sintetizado no Web Audio em vez de arquivo: não são bytes para baixar, não há
// o que cachear, e funciona offline como o resto do app.
let _audio = null;

function tocarBrinde() {
  if (!Store.getSom() || prefereMenosMovimento()) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    // O contexto nasce suspenso até um gesto do usuário (regra do iOS e do
    // Chrome). Aqui sempre há um: o som só toca depois de um toque.
    _audio = _audio || new Ctx();
    if (_audio.state === 'suspended') _audio.resume();

    const agora = _audio.currentTime;
    // Duas taças não soam na mesma nota. A segunda entra 60 ms depois, numa
    // quinta acima — é o que faz soar como brinde e não como notificação.
    [[1244.5, 0], [1864.7, 0.06]].forEach(([hz, atraso], i) => {
      const osc = _audio.createOscillator();
      const vol = _audio.createGain();
      osc.type = 'triangle';
      osc.frequency.value = hz;
      const t0 = agora + atraso;
      // Ataque quase instantâneo e queda exponencial longa: é o envelope do
      // vidro. Rampa linear soaria como bipe de micro-ondas.
      vol.gain.setValueAtTime(0.0001, t0);
      vol.gain.exponentialRampToValueAtTime(i ? 0.10 : 0.16, t0 + 0.006);
      vol.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.1);
      osc.connect(vol).connect(_audio.destination);
      osc.start(t0);
      osc.stop(t0 + 1.2);
    });
  } catch { /* navegador sem áudio, ou bloqueado — silêncio é aceitável */ }
}

// Vibração curta como confirmação física (Android; iOS ainda não expõe a API)
function vibrar(padrao) {
  if (!navigator.vibrate || prefereMenosMovimento()) return;
  try { navigator.vibrate(padrao); } catch { /* sem suporte */ }
}

const HAPTICO = {
  toque: 10,        // marcar um ingrediente
  gostei: [12],     // favoritar
  brinde: [8, 40, 14], // drink concluído
  registro: [10, 30],  // um toque virou entrada no diário
  erro: [22, 60, 22],
};

function elToasts() {
  let el = document.getElementById('toasts');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toasts';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  return el;
}

// tipo: 'ok' (padrão) | 'erro' | 'info'
// acao (opcional): { rotulo, aoTocar } vira um botão dentro do aviso. É o que
// permite salvar primeiro e perguntar depois — quem registrou sem querer desfaz
// ali mesmo, sem confirmação antes de cada gravação.
function toast(titulo, detalhe = '', tipo = 'ok', acao = null) {
  const div = document.createElement('div');
  div.className = `toast ${tipo}`;
  div.innerHTML = `<b>${esc(titulo)}</b>${detalhe ? esc(detalhe) : ''}`;
  if (acao) {
    const btn = document.createElement('button');
    btn.className = 'toast-acao';
    btn.type = 'button';
    btn.textContent = acao.rotulo;
    div.appendChild(btn);
  }
  elToasts().appendChild(div);
  requestAnimationFrame(() => div.classList.add('aparece'));
  if (tipo === 'erro') vibrar(HAPTICO.erro);
  const sair = () => {
    div.classList.remove('aparece');
    setTimeout(() => div.remove(), 400);
  };
  // Com botão o aviso fica mais tempo: desfazer precisa caber num movimento
  // humano, não numa corrida contra o relógio.
  const timer = setTimeout(sair, acao ? 7000 : (tipo === 'erro' ? 5200 : 3600));
  div.addEventListener('click', ev => {
    clearTimeout(timer);
    if (acao && ev.target.closest('.toast-acao')) acao.aoTocar();
    sair();
  });
}

// Diálogo próprio, acima de qualquer modal. Retorna Promise.
function abrirDialogo(html, montar) {
  return new Promise(resolve => {
    const fundo = document.createElement('div');
    fundo.className = 'dialogo-fundo';
    fundo.innerHTML = `<div class="dialogo" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(fundo);
    requestAnimationFrame(() => fundo.classList.add('aberto'));

    const fechar = valor => {
      fundo.classList.remove('aberto');
      setTimeout(() => fundo.remove(), 260);
      document.removeEventListener('keydown', naTecla);
      resolve(valor);
    };
    const naTecla = ev => { if (ev.key === 'Escape') fechar(null); };
    document.addEventListener('keydown', naTecla);
    fundo.addEventListener('click', ev => { if (ev.target === fundo) fechar(null); });
    montar(fundo.querySelector('.dialogo'), fechar);
  });
}

function confirmar(titulo, texto = '', rotuloOk = 'Confirmar', perigo = false) {
  return abrirDialogo(`
    <h3>${esc(titulo)}</h3>
    ${texto ? `<p>${esc(texto)}</p>` : ''}
    <div class="dialogo-acoes">
      <button class="btn" data-nao>Cancelar</button>
      <button class="btn ${perigo ? 'btn-excluir' : 'primario'}" data-sim>${esc(rotuloOk)}</button>
    </div>`,
    (caixa, fechar) => {
      caixa.querySelector('[data-nao]').addEventListener('click', () => fechar(false));
      caixa.querySelector('[data-sim]').addEventListener('click', () => fechar(true));
      caixa.querySelector('[data-sim]').focus();
    }).then(v => v === true);
}

function perguntar(titulo, valorInicial = '', placeholder = '') {
  return abrirDialogo(`
    <h3>${esc(titulo)}</h3>
    <textarea rows="3" placeholder="${esc(placeholder)}">${esc(valorInicial)}</textarea>
    <div class="dialogo-acoes">
      <button class="btn" data-nao>Cancelar</button>
      <button class="btn primario" data-sim>Salvar</button>
    </div>`,
    (caixa, fechar) => {
      const campo = caixa.querySelector('textarea');
      campo.focus();
      campo.setSelectionRange(campo.value.length, campo.value.length);
      caixa.querySelector('[data-nao]').addEventListener('click', () => fechar(null));
      caixa.querySelector('[data-sim]').addEventListener('click', () => fechar(campo.value));
    });
}

// ---------- Movimento ----------
// Entrada em cascata: as linhas do cardápio sobem uma após a outra.
function escalonar(container, seletor = '.card', passo = 45, maximo = 14) {
  if (!container || prefereMenosMovimento()) return;
  container.querySelectorAll(seletor).forEach((el, i) => {
    if (i >= maximo) return;
    el.style.animationDelay = `${i * passo}ms`;
    el.classList.add('entra-linha');
  });
}

// Número que corre de zero até o valor — dá peso à conquista.
function contarAte(el, valor, dur = 1000) {
  if (prefereMenosMovimento()) { el.textContent = valor; return; }
  const inicio = performance.now();
  const passo = agora => {
    const t = Math.min(1, (agora - inicio) / dur);
    el.textContent = (valor * (1 - Math.pow(1 - t, 3))).toFixed(
      Number.isInteger(valor) ? 0 : 1);
    if (t < 1) requestAnimationFrame(passo);
    else el.textContent = valor;
  };
  requestAnimationFrame(passo);
}
