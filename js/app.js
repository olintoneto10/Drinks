// MeuBar — lógica principal da interface.

const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];

const state = {
  bar: Store.getBar(),
  shopping: Store.getShopping(),
  entries: [],
  filtroTag: 'todos',
  buscaSugestao: '',
  fotoURLs: new Map(), // entryId -> objectURL
};

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function fmtData(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function estrelas(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

// ---------- Perfil de sabor ----------
function tasteProfile() {
  const pesos = {};
  for (const e of state.entries) {
    if (!e.nota) continue;
    const receita = e.receitaId && RECEITA_MAP[e.receitaId];
    if (!receita) continue;
    const peso = e.nota - 3; // 4-5 puxa para cima, 1-2 para baixo
    for (const tag of receita.tags) {
      pesos[tag] = (pesos[tag] || 0) + peso;
    }
  }
  return pesos;
}

function topProfileTags(pesos, n = 3) {
  return Object.entries(pesos)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([t]) => t);
}

// ---------- Motor de sugestões ----------
function matchRecipes() {
  const pesos = tasteProfile();
  const ready = [];
  const almost = [];
  for (const r of RECEITAS) {
    const faltam = r.ing
      .filter(i => !i.opcional && !BASICOS.has(i.id) && !state.bar.has(i.id))
      .map(i => i.id);
    const score = r.tags.reduce((s, t) => s + (pesos[t] || 0), 0);
    const item = { receita: r, faltam, score };
    if (faltam.length === 0) ready.push(item);
    else if (faltam.length === 1) almost.push(item);
  }
  ready.sort((a, b) => b.score - a.score || a.receita.nome.localeCompare(b.receita.nome));
  almost.sort((a, b) => b.score - a.score || a.receita.nome.localeCompare(b.receita.nome));
  return { ready, almost };
}

function passaFiltro(receita) {
  const busca = state.buscaSugestao.trim().toLowerCase();
  if (busca && !receita.nome.toLowerCase().includes(busca)) return false;
  if (state.filtroTag !== 'todos' && !receita.tags.includes(state.filtroTag)) return false;
  return true;
}

// ---------- Render: Sugestões ----------
function cardReceita({ receita, faltam, score }, destaque) {
  const tags = receita.tags.map(t => `<span class="tag">${esc(TAG_NOMES[t] || t)}</span>`).join('');
  const match = destaque && score > 0 ? '<span class="match">✨ seu estilo</span>' : '';
  let faltaHtml = '';
  if (faltam.length) {
    const ing = ING_MAP[faltam[0]];
    const naLista = state.shopping.has(ing.id);
    faltaHtml = `<div class="falta">Falta: <strong>${esc(ing.nome)}</strong>
      <button class="mini ${naLista ? 'ok' : ''}" data-shop="${ing.id}">
        ${naLista ? '✓ na lista' : '+ lista de compras'}</button></div>`;
  }
  return `<div class="card" data-receita="${receita.id}">
    <div class="card-top"><h3>${esc(receita.nome)}</h3>${match}</div>
    <div class="tags">${tags}</div>
    ${faltaHtml}
  </div>`;
}

function renderSugestoes() {
  const { ready, almost } = matchRecipes();
  const readyF = ready.filter(x => passaFiltro(x.receita));
  const almostF = almost.filter(x => passaFiltro(x.receita));
  const pesos = tasteProfile();
  const top = topProfileTags(pesos);

  let perfilHtml = '';
  if (top.length) {
    perfilHtml = `<p class="perfil">Seu perfil: você curte drinks
      <strong>${top.map(t => esc((TAG_NOMES[t] || t).toLowerCase())).join(', ')}</strong>
      — as sugestões já levam isso em conta.</p>`;
  }

  let html = perfilHtml;
  if (state.bar.size === 0) {
    html += `<div class="vazio">🍾 Seu bar está vazio.<br>
      Cadastre o que você tem em casa na aba <strong>Meu Bar</strong> e eu digo o que dá para fazer.</div>`;
  }
  html += `<h2>🍸 Pode fazer agora <span class="badge">${readyF.length}</span></h2>`;
  html += readyF.length
    ? `<div class="cards">${readyF.map(x => cardReceita(x, true)).join('')}</div>`
    : '<p class="dica">Nada por enquanto — adicione mais itens ao seu bar.</p>';

  html += `<h2>🛒 Falta só 1 ingrediente <span class="badge">${almostF.length}</span></h2>`;
  html += almostF.length
    ? `<div class="cards">${almostF.map(x => cardReceita(x, false)).join('')}</div>`
    : '<p class="dica">Nenhuma sugestão aqui com os filtros atuais.</p>';

  $('#lista-sugestoes').innerHTML = html;
}

// ---------- Render: Meu Bar ----------
function renderBar() {
  const busca = ($('#busca-bar')?.value || '').trim().toLowerCase();
  let html = '';

  // Lista de compras
  if (state.shopping.size) {
    const itens = [...state.shopping].map(id => {
      const ing = ING_MAP[id];
      return `<li>${esc(ing?.nome || id)}
        <span>
          <button class="mini" data-comprei="${id}">✓ comprei</button>
          <button class="mini danger" data-tira-lista="${id}">✕</button>
        </span></li>`;
    }).join('');
    html += `<div class="bloco"><h2>🛒 Lista de compras</h2><ul class="lista-compras">${itens}</ul></div>`;
  }

  html += '<h2>🍾 O que você tem em casa</h2>';
  html += '<p class="dica">Toque para adicionar ou remover. Açúcar, sal e gelo já contam como disponíveis.</p>';

  for (const cat of CATEGORIAS) {
    const itens = INGREDIENTES.filter(i => i.cat === cat.id && !i.basico &&
      (!busca || i.nome.toLowerCase().includes(busca)));
    if (!itens.length) continue;
    const chips = itens.map(i => {
      const on = state.bar.has(i.id);
      return `<button class="chip ${on ? 'on' : ''}" data-ing="${i.id}">${on ? '✓ ' : ''}${esc(i.nome)}</button>`;
    }).join('');
    html += `<div class="bloco"><h3>${esc(cat.nome)}</h3><div class="chips">${chips}</div></div>`;
  }

  $('#conteudo-bar').innerHTML = html;
  $('#contador-bar').textContent = state.bar.size;
}

// ---------- Render: Diário ----------
function fotoURL(entry) {
  if (!entry.foto) return null;
  if (!state.fotoURLs.has(entry.id)) {
    state.fotoURLs.set(entry.id, URL.createObjectURL(entry.foto));
  }
  return state.fotoURLs.get(entry.id);
}

function renderDiario() {
  const busca = ($('#busca-diario')?.value || '').trim().toLowerCase();
  const entries = [...state.entries]
    .filter(e => !busca || (e.nome || '').toLowerCase().includes(busca) || (e.texto || '').toLowerCase().includes(busca))
    .sort((a, b) => (b.data || '').localeCompare(a.data || '') || b.id - a.id);

  if (!entries.length) {
    $('#lista-diario').innerHTML = `<div class="vazio">📔 Nenhum registro ainda.<br>
      Bebeu um drink bom (ou ruim)? Registre com foto, nota e a história do momento.</div>`;
    return;
  }

  $('#lista-diario').innerHTML = entries.map(e => {
    const url = fotoURL(e);
    const foto = url ? `<img class="foto" src="${url}" alt="Foto de ${esc(e.nome)}">` : '';
    const receita = e.receitaId && RECEITA_MAP[e.receitaId];
    return `<div class="card entrada" data-entry="${e.id}">
      ${foto}
      <div class="entrada-corpo">
        <div class="card-top"><h3>${esc(e.nome)}</h3><span class="nota">${estrelas(e.nota || 0)}</span></div>
        <p class="meta">${fmtData(e.data)}${receita ? ` · receita: ${esc(receita.nome)}` : ''}</p>
        ${e.texto ? `<p class="texto">${esc(e.texto)}</p>` : ''}
        <div class="acoes">
          <button class="mini" data-editar="${e.id}">✏️ editar</button>
          <button class="mini danger" data-apagar="${e.id}">🗑 apagar</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ---------- Modal de receita ----------
function abrirReceita(id) {
  const r = RECEITA_MAP[id];
  if (!r) return;
  const ing = r.ing.map(i => {
    const nome = ING_MAP[i.id]?.nome || i.id;
    const tem = BASICOS.has(i.id) || state.bar.has(i.id);
    return `<li class="${tem ? 'tem' : 'nao-tem'}">${tem ? '✓' : '✕'} ${esc(nome)} — ${esc(i.q)}${i.opcional ? ' <em>(opcional)</em>' : ''}</li>`;
  }).join('');
  $('#modal-corpo').innerHTML = `
    <h2>${esc(r.nome)}</h2>
    <div class="tags">${r.tags.map(t => `<span class="tag">${esc(TAG_NOMES[t] || t)}</span>`).join('')}</div>
    <p class="meta">🥃 ${esc(r.copo)}</p>
    <h3>Ingredientes</h3>
    <ul class="ingredientes">${ing}</ul>
    <h3>Preparo</h3>
    <p>${esc(r.preparo)}</p>
    <button class="btn primario" id="btn-registrar" data-receita="${r.id}">📔 Fiz esse! Registrar no diário</button>`;
  $('#modal').classList.add('aberto');
}

// ---------- Formulário do diário ----------
function abrirFormEntrada(entry = null, receitaId = null) {
  const receita = receitaId && RECEITA_MAP[receitaId];
  const opcoes = ['<option value="">— nenhuma —</option>']
    .concat(RECEITAS.map(r =>
      `<option value="${r.id}" ${(entry?.receitaId || receitaId) === r.id ? 'selected' : ''}>${esc(r.nome)}</option>`))
    .join('');
  const hoje = new Date().toISOString().slice(0, 10);
  const nota = entry?.nota || 0;

  $('#modal-corpo').innerHTML = `
    <h2>${entry ? 'Editar registro' : '📔 Novo registro'}</h2>
    <form id="form-entrada">
      <label>Nome do drink
        <input name="nome" required maxlength="80" value="${esc(entry?.nome || receita?.nome || '')}" placeholder="Ex.: Negroni">
      </label>
      <label>Receita do app (opcional — alimenta seu perfil de sabor)
        <select name="receitaId">${opcoes}</select>
      </label>
      <label>Quando bebi
        <input type="date" name="data" required value="${entry?.data || hoje}">
      </label>
      <label>Nota</label>
      <div class="estrelas" id="picker-estrelas">
        ${[1, 2, 3, 4, 5].map(n => `<button type="button" class="estrela ${n <= nota ? 'on' : ''}" data-n="${n}">★</button>`).join('')}
      </div>
      <input type="hidden" name="nota" value="${nota}">
      <label>Como foi a experiência?
        <textarea name="texto" rows="3" maxlength="1000" placeholder="Onde estava, com quem, o que achou...">${esc(entry?.texto || '')}</textarea>
      </label>
      <label class="btn-foto">📷 ${entry?.foto ? 'Trocar foto' : 'Adicionar foto'}
        <input type="file" name="foto" accept="image/*" hidden>
      </label>
      <div id="preview-foto">${entry?.foto ? `<img class="foto" src="${fotoURL(entry)}" alt="Foto atual">` : ''}</div>
      <button class="btn primario" type="submit">Salvar</button>
    </form>`;
  $('#modal').classList.add('aberto');

  const form = $('#form-entrada');
  let novaFoto = null;

  $('#picker-estrelas').addEventListener('click', ev => {
    const btn = ev.target.closest('.estrela');
    if (!btn) return;
    const n = Number(btn.dataset.n);
    form.nota.value = n;
    $$('#picker-estrelas .estrela').forEach(b => b.classList.toggle('on', Number(b.dataset.n) <= n));
  });

  form.foto.addEventListener('change', () => {
    novaFoto = form.foto.files[0] || null;
    if (novaFoto) {
      $('#preview-foto').innerHTML = `<img class="foto" src="${URL.createObjectURL(novaFoto)}" alt="Prévia da foto">`;
    }
  });

  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const dados = {
      nome: form.nome.value.trim(),
      receitaId: form.receitaId.value || null,
      data: form.data.value,
      nota: Number(form.nota.value) || 0,
      texto: form.texto.value.trim(),
      foto: novaFoto || entry?.foto || null,
      criadoEm: entry?.criadoEm || Date.now(),
    };
    if (entry) {
      dados.id = entry.id;
      if (novaFoto && state.fotoURLs.has(entry.id)) {
        URL.revokeObjectURL(state.fotoURLs.get(entry.id));
        state.fotoURLs.delete(entry.id);
      }
      await dbUpdateEntry(dados);
    } else {
      await dbAddEntry(dados);
    }
    state.entries = await dbGetEntries();
    fecharModal();
    trocarAba('diario');
    renderDiario();
    renderSugestoes();
  });
}

function fecharModal() {
  $('#modal').classList.remove('aberto');
  $('#modal-corpo').innerHTML = '';
}

// ---------- Especialista (IA) ----------
const chat = { history: [] };

function renderExpert() {
  const temChave = !!Store.getApiKey();
  $('#expert-config').classList.toggle('escondido', temChave);
  $('#expert-chat').classList.toggle('escondido', !temChave);
}

function addBubble(role, text) {
  const div = document.createElement('div');
  div.className = `bolha ${role}`;
  div.textContent = text;
  $('#chat-mensagens').appendChild(div);
  $('#chat-mensagens').scrollTop = $('#chat-mensagens').scrollHeight;
  return div;
}

async function enviarPergunta() {
  const input = $('#chat-input');
  const texto = input.value.trim();
  if (!texto) return;
  input.value = '';
  addBubble('user', texto);
  chat.history.push({ role: 'user', content: texto });

  const pensando = addBubble('assistant', 'Pensando... 🍸');
  const pesos = tasteProfile();
  const top = topProfileTags(pesos, 4);
  const topDrinks = state.entries
    .filter(e => e.nota >= 4)
    .sort((a, b) => b.nota - a.nota)
    .slice(0, 5)
    .map(e => ({ nome: e.nome, nota: e.nota }));

  try {
    const resposta = await askExpert(
      Store.getApiKey(),
      buildSystemPrompt(state.bar, top, topDrinks),
      chat.history,
    );
    pensando.textContent = resposta;
    chat.history.push({ role: 'assistant', content: resposta });
  } catch (err) {
    pensando.textContent = `⚠️ ${err.message}`;
    chat.history.pop(); // remove a pergunta que falhou para poder tentar de novo
  }
  $('#chat-mensagens').scrollTop = $('#chat-mensagens').scrollHeight;
}

// ---------- Navegação ----------
function trocarAba(aba) {
  $$('.aba').forEach(s => s.classList.toggle('ativa', s.id === `aba-${aba}`));
  $$('.tab').forEach(b => b.classList.toggle('ativa', b.dataset.aba === aba));
  if (aba === 'sugestoes') renderSugestoes();
  if (aba === 'bar') renderBar();
  if (aba === 'diario') renderDiario();
  if (aba === 'expert') renderExpert();
}

// ---------- Eventos globais ----------
function initEventos() {
  $('#tabs').addEventListener('click', ev => {
    const btn = ev.target.closest('.tab');
    if (btn) trocarAba(btn.dataset.aba);
  });

  // Sugestões: filtros, cards e lista de compras
  $('#filtros').addEventListener('click', ev => {
    const chip = ev.target.closest('.chip');
    if (!chip) return;
    state.filtroTag = chip.dataset.tag;
    $$('#filtros .chip').forEach(c => c.classList.toggle('on', c === chip));
    renderSugestoes();
  });
  $('#busca-sugestoes').addEventListener('input', ev => {
    state.buscaSugestao = ev.target.value;
    renderSugestoes();
  });
  $('#lista-sugestoes').addEventListener('click', ev => {
    const shop = ev.target.closest('[data-shop]');
    if (shop) {
      const id = shop.dataset.shop;
      state.shopping.has(id) ? state.shopping.delete(id) : state.shopping.add(id);
      Store.setShopping(state.shopping);
      renderSugestoes();
      return;
    }
    const card = ev.target.closest('[data-receita]');
    if (card) abrirReceita(card.dataset.receita);
  });

  // Meu Bar
  $('#busca-bar').addEventListener('input', renderBar);
  $('#conteudo-bar').addEventListener('click', ev => {
    const ing = ev.target.closest('[data-ing]');
    if (ing) {
      const id = ing.dataset.ing;
      state.bar.has(id) ? state.bar.delete(id) : state.bar.add(id);
      Store.setBar(state.bar);
      renderBar();
      return;
    }
    const comprei = ev.target.closest('[data-comprei]');
    if (comprei) {
      const id = comprei.dataset.comprei;
      state.shopping.delete(id);
      state.bar.add(id);
      Store.setShopping(state.shopping);
      Store.setBar(state.bar);
      renderBar();
      return;
    }
    const tira = ev.target.closest('[data-tira-lista]');
    if (tira) {
      state.shopping.delete(tira.dataset.tiraLista);
      Store.setShopping(state.shopping);
      renderBar();
    }
  });

  // Diário
  $('#btn-nova-entrada').addEventListener('click', () => abrirFormEntrada());
  $('#busca-diario').addEventListener('input', renderDiario);
  $('#lista-diario').addEventListener('click', async ev => {
    const editar = ev.target.closest('[data-editar]');
    if (editar) {
      const e = state.entries.find(x => x.id === Number(editar.dataset.editar));
      if (e) abrirFormEntrada(e);
      return;
    }
    const apagar = ev.target.closest('[data-apagar]');
    if (apagar) {
      const id = Number(apagar.dataset.apagar);
      if (confirm('Apagar este registro do diário?')) {
        await dbDeleteEntry(id);
        if (state.fotoURLs.has(id)) {
          URL.revokeObjectURL(state.fotoURLs.get(id));
          state.fotoURLs.delete(id);
        }
        state.entries = await dbGetEntries();
        renderDiario();
        renderSugestoes();
      }
    }
  });

  // Modal
  $('#modal').addEventListener('click', ev => {
    if (ev.target.id === 'modal' || ev.target.closest('#modal-fechar')) fecharModal();
    const reg = ev.target.closest('#btn-registrar');
    if (reg) abrirFormEntrada(null, reg.dataset.receita);
  });

  // Especialista
  $('#form-chave').addEventListener('submit', ev => {
    ev.preventDefault();
    Store.setApiKey($('#input-chave').value.trim());
    renderExpert();
  });
  $('#btn-trocar-chave').addEventListener('click', () => {
    Store.setApiKey('');
    chat.history = [];
    $('#chat-mensagens').innerHTML = '';
    renderExpert();
  });
  $('#form-chat').addEventListener('submit', ev => {
    ev.preventDefault();
    enviarPergunta();
  });
}

// ---------- Boot ----------
async function init() {
  state.entries = await dbGetEntries();
  initEventos();
  trocarAba('sugestoes');

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline opcional */ });
  }
}

document.addEventListener('DOMContentLoaded', init);
