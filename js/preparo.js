// Modo Preparo (um passo por vez, para quem está de pé com as mãos ocupadas)
// e O Brinde — a celebração que vem antes de qualquer formulário.

// Quebra o texto do preparo em passos. Receitas podem trazer `passos` prontos.
function passosDaReceita(r) {
  if (Array.isArray(r.passos) && r.passos.length) return r.passos;
  return (r.preparo || '')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function abrirPreparo(receitaId) {
  const r = RECEITA_MAP[receitaId];
  if (!r) return;
  const passos = passosDaReceita(r);
  // Herda a escala e a unidade escolhidas no modal — quem vai preparar para
  // oito pessoas não quer ver a medida de uma.
  const ings = r.ing
    .filter(i => !BASICOS.has(i.id))
    .map(i => `${ING_MAP[i.id]?.nome || i.id} — ${formatarQuantidade(i.q, state.rende, Store.getUnidade())}`);
  let atual = 0;

  fecharModal();
  const tela = document.createElement('div');
  tela.id = 'preparo';
  tela.setAttribute('role', 'dialog');
  tela.setAttribute('aria-modal', 'true');
  tela.setAttribute('aria-label', `Preparo do ${r.nome}, passo a passo`);
  tela.innerHTML = `
    <div class="preparo-topo">
      <h2>${esc(r.nome)}</h2>
      <button class="preparo-sair" aria-label="Sair do modo preparo">✕</button>
    </div>
    <div class="passos-marcas">
      ${passos.map(() => '<i></i>').join('')}
    </div>
    <div class="preparo-corpo">
      <div class="preparo-num"></div>
      <p class="preparo-texto" aria-live="polite"></p>
      <div class="preparo-ings"></div>
    </div>
    <div class="preparo-rodape">
      <button class="btn primario" data-proximo></button>
      <button class="btn" data-voltar>Passo anterior</button>
    </div>`;
  document.body.appendChild(tela);
  tela.querySelector('[data-proximo]').focus();

  const num = tela.querySelector('.preparo-num');
  const texto = tela.querySelector('.preparo-texto');
  const listaIng = tela.querySelector('.preparo-ings');
  const marcas = [...tela.querySelectorAll('.passos-marcas i')];
  const btnProx = tela.querySelector('[data-proximo]');
  const btnVolta = tela.querySelector('[data-voltar]');

  const pintar = () => {
    num.textContent = `Passo ${atual + 1} de ${passos.length}`;
    texto.textContent = passos[atual];
    // reinicia a animação de entrada do passo
    texto.style.animation = 'none';
    void texto.offsetWidth;
    texto.style.animation = '';
    // os ingredientes só atrapalham depois do primeiro passo
    listaIng.innerHTML = atual === 0 ? ings.map(esc).join('<br>') : '';
    marcas.forEach((m, i) => m.classList.toggle('feito', i <= atual));
    btnProx.textContent = atual === passos.length - 1 ? 'Pronto!' : 'Próximo passo';
    btnVolta.style.visibility = atual === 0 ? 'hidden' : 'visible';
    vibrar(HAPTICO.toque);
  };

  const sair = () => tela.remove();

  btnProx.addEventListener('click', () => {
    if (atual < passos.length - 1) { atual++; pintar(); return; }
    sair();
    abrirBrinde(r);
  });
  btnVolta.addEventListener('click', () => { if (atual > 0) { atual--; pintar(); } });
  tela.querySelector('.preparo-sair').addEventListener('click', sair);

  pintar();
}

// ---------- O Brinde ----------
function svgBrinde(r) {
  const copo = copoDoDrink(r.copo);
  const [c1, c2] = CORES_DRINK[r.id] || ['#C4372B', '#8A2418'];
  return `<svg viewBox="0 0 100 100" aria-hidden="true">
    <defs><linearGradient id="brinde-g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient></defs>
    <path class="liquido-enche" d="${copo.liquid}" fill="url(#brinde-g)"/>
    <circle class="bolha-brinde" cx="45" cy="${copo.topo + 30}" r="1.9" fill="#fff"/>
    <circle class="bolha-brinde" cx="54" cy="${copo.topo + 34}" r="1.5" fill="#fff"/>
    <circle class="bolha-brinde" cx="50" cy="${copo.topo + 26}" r="1.7" fill="#fff"/>
    <path d="${copo.glass}" fill="none" stroke="#201D1A" stroke-width="2.4"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// Marcos que merecem selo: o primeiro drink e as dezenas redondas
function marcoDoDiario(total) {
  if (total === 1) return { titulo: 'Seu bar abriu', sub: 'Guarde esta data — foi aqui que começou.', n: '1º' };
  if ([10, 25, 50, 100, 200].includes(total)) {
    return { titulo: `${total} drinks preparados`, sub: 'Isso já é repertório de bartender.', n: String(total) };
  }
  return null;
}

function abrirBrinde(r) {
  const tela = document.createElement('div');
  tela.id = 'brinde';
  tela.setAttribute('role', 'dialog');
  tela.setAttribute('aria-modal', 'true');
  tela.setAttribute('aria-label', `${r.nome} pronto`);
  tela.innerHTML = `
    <div class="luz-brinde"></div>
    ${svgBrinde(r)}
    <h2>Ficou pronto. Saúde!</h2>
    <p class="brinde-sub">${esc(r.nome)} — feito por você.</p>
    <p class="brinde-nota">Ficou bom?</p>
    <div class="estrelas rapidas" role="group" aria-label="Registrar no diário com nota">
      ${[1, 2, 3, 4, 5].map(n => `<button type="button" class="estrela" data-nota="${n}"
        aria-label="Registrar com ${n} ${n === 1 ? 'estrela' : 'estrelas'}">★</button>`).join('')}
    </div>
    <div class="brinde-acoes">
      <button class="btn" data-registrar>Registrar com detalhes</button>
      <button class="btn" data-compartilhar>Compartilhar a receita</button>
      <button class="btn" data-fechar>Fechar</button>
    </div>`;
  document.body.appendChild(tela);
  vibrar(HAPTICO.brinde);
  tocarBrinde();
  tela.querySelector('.estrela').focus();
  // Levou o preparo até o fim: o app acabou de valer a pena.
  talvezConvidarInstalar('preparo');

  const fechar = () => tela.remove();
  // Copo na mão, drink recém-pronto: é aqui que a nota é mais honesta e mais
  // barata de dar. Uma estrela fecha a tela e grava — nada de formulário.
  tela.querySelectorAll('[data-nota]').forEach(btn => {
    btn.addEventListener('click', () => {
      fechar();
      registrarRapido(r.id, Number(btn.dataset.nota));
    });
  });
  tela.querySelector('[data-registrar]').addEventListener('click', () => {
    fechar();
    abrirFormEntrada(null, r.id);
  });
  tela.querySelector('[data-compartilhar]').addEventListener('click', () => compartilharReceita(r.id));
  tela.querySelector('[data-fechar]').addEventListener('click', fechar);
}

// Celebração de marco, mostrada depois de registrar no diário
function celebrarMarco(total) {
  const marco = marcoDoDiario(total);
  if (!marco) return false;
  const tela = document.createElement('div');
  tela.id = 'brinde';
  tela.setAttribute('role', 'dialog');
  tela.setAttribute('aria-modal', 'true');
  tela.setAttribute('aria-label', marco.titulo);
  tela.innerHTML = `
    <div class="luz-brinde"></div>
    <div class="selo-conquista"><b>${esc(marco.n)}</b><small>drink${marco.n === '1º' ? '' : 's'}</small></div>
    <h2>${esc(marco.titulo)}</h2>
    <p class="brinde-sub">${esc(marco.sub)}</p>
    <div class="brinde-acoes">
      <button class="btn primario" data-fechar>Continuar</button>
    </div>`;
  document.body.appendChild(tela);
  vibrar(HAPTICO.brinde);
  const btn = tela.querySelector('[data-fechar]');
  btn.focus();
  btn.addEventListener('click', () => tela.remove());
  return true;
}
