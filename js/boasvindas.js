// Boas-vindas: leva a pessoa da tela vazia à primeira vitória em menos de um
// minuto. Em vez de "Seu bar está vazio", o app abre revelando o que ela já pode
// fazer com o que tem em casa.

// Os suspeitos de sempre — o que costuma existir numa casa brasileira
const KIT_INICIAL = ['cachaca', 'vodka', 'gin', 'rum-branco', 'whisky', 'tequila',
  'limao', 'laranja', 'hortela', 'agua-tonica', 'agua-com-gas', 'refrigerante-cola',
  'suco-laranja', 'campari', 'vermute-tinto', 'espumante'];

function abrirBoasVindas() {
  const escolhidos = new Set();
  const tela = document.createElement('div');
  tela.id = 'boasvindas';
  document.body.appendChild(tela);

  const pinta = html => {
    tela.innerHTML = `<div class="bv-caixa">${html}</div>`;
  };

  // --- 1. Convite ---
  const passo1 = () => {
    pinta(`
      <div class="bv-topo">
        <h1>Meu<em>Bar</em></h1>
        <div class="orn-bv">· · ✦ · ·</div>
      </div>
      <p class="bv-lead">Todo bar começa com uma garrafa.</p>
      <p class="bv-texto">Me diga o que você tem em casa e eu digo o que dá para fazer
        esta noite — com receita, história e passo a passo.</p>
      <button class="btn primario" data-ir="2">Abrir meu bar</button>`);
  };

  // --- 2. O que você tem ---
  const passo2 = () => {
    const chips = KIT_INICIAL
      .filter(id => ING_MAP[id])
      .map(id => `<button type="button" class="chip ${escolhidos.has(id) ? 'on' : ''}"
        data-kit="${id}">${esc(ING_MAP[id].nome.replace(/ \(.*\)/, ''))}</button>`)
      .join('');
    pinta(`
      <div class="bv-topo">
        <span class="bv-passo">Passo 1 de 2</span>
        <h2 class="bv-titulo">O que tem aí?</h2>
      </div>
      <p class="bv-texto">Toque no que você tem em casa. Sem pressa — dá para completar
        depois, e açúcar, sal e gelo eu já considero.</p>
      <div class="chips bv-chips">${chips}</div>
      <label class="btn bv-foto">📸 Ou fotografe sua estante
        <input id="bv-estante" type="file" accept="image/*" capture="environment" hidden>
      </label>
      <button class="btn primario" data-ir="3">Ver o que já dá para fazer</button>
      <button class="btn bv-pular" data-pular>Pular por enquanto</button>`);
  };

  // --- 3. A primeira vitória ---
  const passo3 = () => {
    for (const id of escolhidos) state.bar.add(id);
    Store.setBar(state.bar);
    const { ready, almost } = matchRecipes();
    const lista = ready.slice(0, 3);

    pinta(`
      <div class="bv-topo">
        <span class="bv-passo">Passo 2 de 2</span>
        <h2 class="bv-titulo">${lista.length
          ? `Seu bar já serve ${ready.length} ${ready.length === 1 ? 'drink' : 'drinks'}`
          : 'Quase lá'}</h2>
      </div>
      ${lista.length ? `
        <ul class="bv-lista">
          ${lista.map(({ receita }) => `<li>
            <span class="bv-nome">${esc(receita.nome)}</span>
            <span class="bv-pontos"></span>
            <span class="bv-copo">${esc(receita.copo.toLowerCase())}</span>
          </li>`).join('')}
        </ul>
        <p class="bv-texto">${almost.length
          ? `E com mais um ingrediente você desbloqueia outros ${almost.length}.`
          : 'Toque em qualquer um para ver a receita e a história.'}</p>`
      : `<p class="bv-texto">Com o que você marcou ainda não fecho uma receita inteira.
          Sem problema: me diga que estilo você curte e eu calculo a menor lista de
          compras que resolve isso.</p>
        <button class="btn primario" data-montar>🛒 Montar meu bar</button>`}
      <button class="btn ${lista.length ? 'primario' : ''}" data-fim>Entrar no bar</button>`);
  };

  const ir = n => {
    if (n === 2) passo2();
    else if (n === 3) passo3();
  };

  tela.addEventListener('click', ev => {
    const kit = ev.target.closest('[data-kit]');
    if (kit) {
      const id = kit.dataset.kit;
      escolhidos.has(id) ? escolhidos.delete(id) : escolhidos.add(id);
      kit.classList.toggle('on', escolhidos.has(id));
      if (escolhidos.has(id)) vibrar(HAPTICO.toque);
      return;
    }
    const avancar = ev.target.closest('[data-ir]');
    if (avancar) { ir(Number(avancar.dataset.ir)); return; }
    // Quem chegou ao fim sem fechar nenhuma receita está exatamente na pergunta
    // que o Montar meu bar responde. Fecha as boas-vindas e já abre a ferramenta.
    if (ev.target.closest('[data-montar]')) {
      Store.setBoasVindas(true);
      tela.remove();
      renderBar();
      trocarAba('bar');
      abrirMontarBar();
      return;
    }
    if (ev.target.closest('[data-pular]') || ev.target.closest('[data-fim]')) {
      Store.setBoasVindas(true);
      tela.remove();
      renderBar();
      trocarAba('sugestoes');
      if (escolhidos.size) {
        toast('Bar aberto', 'Pode ajustar seu acervo quando quiser em Meu Bar.');
      }
    }
  });

  tela.addEventListener('change', ev => {
    if (ev.target.id !== 'bv-estante') return;
    const arquivo = ev.target.files[0];
    if (!arquivo) return;
    if (!Store.getApiKey()) {
      toast('Ative o Especialista antes', 'A leitura da estante precisa da chave de API (aba IA).', 'info');
      return;
    }
    Store.setBoasVindas(true);
    tela.remove();
    trocarAba('bar');
    analisarEstante(arquivo);
  });

  passo1();
}

function checarBoasVindas() {
  if (Store.getBoasVindas()) return false;
  if (state.bar.size || state.entries.length) { Store.setBoasVindas(true); return false; }
  abrirBoasVindas();
  return true;
}
