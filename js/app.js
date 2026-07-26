// MeuBar — lógica principal da interface.

const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];

const state = {
  bar: Store.getBar(),
  shopping: Store.getShopping(),
  entries: [],
  pessoas: Store.getPessoas(), // [{id, nome, tags: [], evita: []}]
  pessoaAtiva: 'eu',
  festa: Store.getFesta(), // ids das pessoas no modo festa
  favoritos: Store.getFavoritos(),
  filtroTag: 'todos',
  buscaSugestao: '',
  fotoURLs: new Map(), // entryId -> objectURL
};

// Tags que uma pessoa pode declarar que gosta
const TAGS_PREFERENCIA = ['doce', 'citrico', 'amargo', 'seco', 'refrescante',
  'cremoso', 'frutado', 'forte', 'tropical', 'salgado', 'quente', 'sem-alcool'];

// Restrições: "não pode / evita" — 'alcool' é especial (só mostra sem álcool)
const TAGS_EVITA = ['alcool', 'doce', 'citrico', 'amargo', 'cremoso', 'forte', 'quente'];
const EVITA_NOMES = { 'alcool': 'Álcool' };

function getPessoa(id) {
  if (id === 'eu') {
    return state.pessoas.find(p => p.id === 'eu') || { id: 'eu', nome: 'Você', tags: [] };
  }
  return state.pessoas.find(p => p.id === id) || null;
}

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

// Reduz a foto para no máximo 1200px (JPEG) antes de salvar — evita estourar
// a cota de armazenamento do navegador com fotos de vários MB.
function comprimirFoto(file) {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const max = 1200;
      const escala = Math.min(1, max / Math.max(img.width, img.height));
      if (escala === 1 && file.size < 500_000) return resolve(file);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => resolve(blob || file), 'image/jpeg', 0.82);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

// ---------- Perfil de sabor (aprendido por pessoa) ----------
function tasteProfile(pessoaId = 'eu') {
  const pesos = {};
  for (const e of state.entries) {
    if (!e.nota) continue;
    if ((e.pessoaId || 'eu') !== pessoaId) continue;
    const receita = e.receitaId && RECEITA_MAP[e.receitaId];
    if (!receita) continue;
    const peso = e.nota - 3; // 4-5 puxa para cima, 1-2 para baixo
    for (const tag of receita.tags) {
      pesos[tag] = (pesos[tag] || 0) + peso;
    }
  }
  return pesos;
}

// Foto mais recente do diário para cada receita — a foto do usuário
// vale mais que qualquer ilustração.
function fotosPorReceita() {
  const mapa = {};
  const ordenadas = [...state.entries]
    .filter(e => e.receitaId && e.foto)
    .sort((a, b) => (a.data || '').localeCompare(b.data || ''));
  for (const e of ordenadas) mapa[e.receitaId] = e;
  return mapa;
}

function topProfileTags(pesos, n = 3) {
  return Object.entries(pesos)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([t]) => t);
}

// Pesos usados para ordenar as sugestões: preferências declaradas da pessoa
// ativa e, no caso de "Você", também o que o app aprendeu das notas do diário.
function pesosDePessoa(id) {
  const pesos = Object.assign({}, tasteProfile(id));
  const pessoa = getPessoa(id);
  for (const t of pessoa?.tags || []) pesos[t] = (pesos[t] || 0) + 2;
  return pesos;
}

function pesosAtivos() {
  if (state.pessoaAtiva === 'festa') {
    const pesos = {};
    for (const id of state.festa) {
      for (const [t, v] of Object.entries(pesosDePessoa(id))) {
        pesos[t] = (pesos[t] || 0) + v;
      }
    }
    return pesos;
  }
  return pesosDePessoa(state.pessoaAtiva);
}

// Restrições ativas: da pessoa selecionada, ou a união de todas na festa
function evitaAtivas() {
  const ids = state.pessoaAtiva === 'festa' ? state.festa : [state.pessoaAtiva];
  const evita = new Set();
  for (const id of ids) {
    for (const t of getPessoa(id)?.evita || []) evita.add(t);
  }
  return evita;
}

function violaRestricao(receita, evita) {
  if (evita.has('alcool') && !receita.tags.includes('sem-alcool')) return true;
  return receita.tags.some(t => t !== 'sem-alcool' && evita.has(t));
}

// ---------- Motor de sugestões ----------
function matchRecipes() {
  const pesos = pesosAtivos();
  const evita = evitaAtivas();
  const ready = [];
  const almost = [];
  for (const r of RECEITAS) {
    if (violaRestricao(r, evita)) continue;
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
  if (state.filtroTag === 'favoritos') return state.favoritos.has(receita.id);
  if (state.filtroTag !== 'todos' && !receita.tags.includes(state.filtroTag)) return false;
  return true;
}

// ---------- Render: Sugestões ----------
// Linha de cardápio: nome ..... copo, com detalhes na linha de baixo
function cardReceita({ receita, faltam, score }, destaque, fotos) {
  const tags = receita.tags.map(t => esc((TAG_NOMES[t] || t).toLowerCase())).join(', ');
  let selo;
  if (state.pessoaAtiva === 'festa') selo = 'agrada a turma';
  else if (state.pessoaAtiva === 'eu') selo = 'seu estilo';
  else selo = `p/ ${esc(getPessoa(state.pessoaAtiva)?.nome || '')}`;
  const match = destaque && score > 0 ? `<span class="match">✨ ${selo} — </span>` : '';
  const fav = state.favoritos.has(receita.id) ? '<span class="fav">♥</span>' : '';
  const foto = fotos[receita.id] ? '<span class="tem-foto" title="Você tem foto desse">📷</span>' : '';
  let faltaHtml = '';
  if (faltam.length) {
    const ing = ING_MAP[faltam[0]];
    const naLista = state.shopping.has(ing.id);
    faltaHtml = `<div class="falta">falta: <strong>${esc(ing.nome)}</strong>
      <button class="mini ${naLista ? 'ok' : ''}" data-shop="${ing.id}">
        ${naLista ? '✓ na lista' : '+ lista'}</button></div>`;
  }
  return `<div class="card sugestao" data-receita="${receita.id}">
    <div class="item">
      <h3>${esc(receita.nome)}${fav}${foto}</h3>
      <span class="pontos"></span>
      <span class="copo-item">${esc(receita.copo.toLowerCase())}</span>
    </div>
    <div class="sub">${match}<span class="tags-linha">${tags}</span></div>
    ${faltaHtml}
  </div>`;
}

// Ingredientes que mais desbloqueiam drinks do perfil ativo
function ingredientesQueValemAPena(almost) {
  const ganho = {};
  for (const { receita, faltam, score } of almost) {
    const id = faltam[0];
    if (!ganho[id]) ganho[id] = { score: 0, drinks: [] };
    ganho[id].score += 1 + Math.max(0, score);
    ganho[id].drinks.push(receita.nome);
  }
  return Object.entries(ganho)
    .sort((a, b) => b[1].score - a[1].score || b[1].drinks.length - a[1].drinks.length)
    .slice(0, 3);
}

function renderPessoasRow() {
  const eu = getPessoa('eu');
  const outras = state.pessoas.filter(p => p.id !== 'eu');
  const chip = (p, nome) => {
    const on = state.pessoaAtiva === p.id;
    const lapis = on ? ` <span class="lapis" data-editar-pessoa="${p.id}">✎</span>` : '';
    return `<button class="chip ${on ? 'on' : ''}" data-pessoa="${p.id}">${esc(nome)}${lapis}</button>`;
  };
  const festaOn = state.pessoaAtiva === 'festa';
  const festaChip = outras.length
    ? `<button class="chip ${festaOn ? 'on' : ''}" data-festa>🎉 Festa${festaOn ? ' <span class="lapis" data-editar-festa>✎</span>' : ''}</button>`
    : '';
  $('#pessoas-row').innerHTML = `
    <p class="dica" style="margin-bottom:6px">Para quem vai o drink?</p>
    <div class="chips">
      ${chip(eu, 'Você')}
      ${outras.map(p => chip(p, p.nome)).join('')}
      ${festaChip}
      <button class="chip" data-nova-pessoa>+ pessoa</button>
    </div>`;
}

function renderSugestoes() {
  renderPessoasRow();
  const { ready, almost } = matchRecipes();
  const readyF = ready.filter(x => passaFiltro(x.receita));
  const almostF = almost.filter(x => passaFiltro(x.receita));

  let perfilHtml = '';
  if (state.pessoaAtiva === 'eu') {
    const declaradas = getPessoa('eu').tags;
    const aprendidas = topProfileTags(tasteProfile());
    const todas = [...new Set([...declaradas, ...aprendidas])];
    if (todas.length) {
      perfilHtml = `<p class="perfil">Seu perfil: você curte drinks
        <strong>${todas.map(t => esc((TAG_NOMES[t] || t).toLowerCase())).join(', ')}</strong>
        — as sugestões já levam isso em conta.</p>`;
    } else {
      perfilHtml = `<p class="perfil">Toque no ✎ ao lado de <strong>Você</strong> para dizer
        o que curte — e as notas do diário também me ensinam seu gosto.</p>`;
    }
  } else if (state.pessoaAtiva === 'festa') {
    const nomes = state.festa.map(id => id === 'eu' ? 'Você' : getPessoa(id)?.nome).filter(Boolean);
    perfilHtml = `<p class="perfil">🎉 Modo festa: <strong>${nomes.map(esc).join(', ')}</strong>
      — priorizando drinks que agradam todo mundo e respeitando as restrições de cada um.</p>`;
  } else {
    const pessoa = getPessoa(state.pessoaAtiva);
    const aprendidas = topProfileTags(tasteProfile(state.pessoaAtiva));
    const gostos = [...new Set([...(pessoa?.tags || []), ...aprendidas])]
      .map(t => esc((TAG_NOMES[t] || t).toLowerCase()));
    const restricoes = (pessoa?.evita || []).map(t => esc((EVITA_NOMES[t] || TAG_NOMES[t] || t).toLowerCase()));
    perfilHtml = `<p class="perfil">Sugerindo para <strong>${esc(pessoa?.nome || '')}</strong>${
      gostos.length ? ` — gosta de: <strong>${gostos.join(', ')}</strong>` : ''}${
      restricoes.length ? ` — evita: <strong>${restricoes.join(', ')}</strong>` : ''}.</p>`;
  }

  const fotos = fotosPorReceita();

  let html = perfilHtml;
  if (state.bar.size === 0) {
    html += `<div class="vazio">🍾 Seu bar está vazio.<br>
      Cadastre o que você tem em casa na aba <strong>Meu Bar</strong> e eu digo o que dá para fazer.</div>`;
  }
  html += `<h2>Pode fazer agora <span class="badge">${readyF.length}</span></h2>`;
  html += readyF.length
    ? `<div class="cards">${readyF.map(x => cardReceita(x, true, fotos)).join('')}</div>`
    : '<p class="dica">Nada por enquanto — adicione mais itens ao seu bar.</p>';

  // Compras inteligentes: o que mais desbloqueia drinks do perfil ativo
  if (state.bar.size > 0 && almost.length) {
    const dicas = ingredientesQueValemAPena(almost);
    if (dicas.length) {
      const quem = state.pessoaAtiva === 'eu' ? 'seu perfil' : getPessoa(state.pessoaAtiva)?.nome;
      html += `<h2>Vale a pena comprar</h2>
        <p class="dica">Pensando em ${esc(quem)}, estes ingredientes desbloqueiam mais drinks:</p>
        <ul class="compras-inteligentes">` +
        dicas.map(([id, g]) => {
          const naLista = state.shopping.has(id);
          return `<li><div><strong>${esc(ING_MAP[id]?.nome || id)}</strong>
            <span class="meta">desbloqueia: ${g.drinks.slice(0, 3).map(esc).join(', ')}${g.drinks.length > 3 ? '…' : ''}</span></div>
            <button class="mini ${naLista ? 'ok' : ''}" data-shop="${id}">${naLista ? '✓ na lista' : '+ lista'}</button></li>`;
        }).join('') + '</ul>';
    }
  }

  html += `<h2>Falta só 1 ingrediente <span class="badge">${almostF.length}</span></h2>`;
  html += almostF.length
    ? `<div class="cards">${almostF.map(x => cardReceita(x, false, fotos)).join('')}</div>`
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
    html += `<div class="bloco"><h2>Lista de compras</h2><ul class="lista-compras">${itens}</ul></div>`;
  }

  html += '<h2>O que você tem em casa</h2>';
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

function filtroPeriodo(e) {
  const periodo = $('#filtro-periodo')?.value || 'todos';
  if (periodo === 'todos' || !e.data) return periodo === 'todos';
  const hoje = new Date();
  const [y, m] = e.data.split('-').map(Number);
  if (periodo === 'mes') return y === hoje.getFullYear() && m === hoje.getMonth() + 1;
  if (periodo === 'tres-meses') {
    const limite = new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1);
    return new Date(y, m - 1, 1) >= limite;
  }
  if (periodo === 'ano') return y === hoje.getFullYear();
  return true;
}

// Resumo neutro do mês — informação, não julgamento
function renderStatsDiario() {
  const hoje = new Date();
  const doMes = state.entries.filter(e => {
    if (!e.data) return false;
    const [y, m] = e.data.split('-').map(Number);
    return y === hoje.getFullYear() && m === hoje.getMonth() + 1;
  });
  if (!doMes.length) { $('#stats-diario').innerHTML = ''; return; }
  const comNota = doMes.filter(e => e.nota);
  const media = comNota.length
    ? (comNota.reduce((s, e) => s + e.nota, 0) / comNota.length).toFixed(1)
    : null;
  const melhor = [...comNota].sort((a, b) => b.nota - a.nota)[0];
  $('#stats-diario').innerHTML = `<p class="stats">Este mês: <strong>${doMes.length}</strong>
    ${doMes.length === 1 ? 'registro' : 'registros'}${media ? ` · nota média <strong>${media}</strong>` : ''}${
    melhor ? ` · destaque: <strong>${esc(melhor.nome)}</strong>` : ''}</p>`;
}

function renderDiario() {
  renderStatsDiario();
  const busca = ($('#busca-diario')?.value || '').trim().toLowerCase();
  const notaMin = Number($('#filtro-nota')?.value || 0);
  const entries = [...state.entries]
    .filter(e => !busca || (e.nome || '').toLowerCase().includes(busca) || (e.texto || '').toLowerCase().includes(busca))
    .filter(e => !notaMin || (e.nota || 0) >= notaMin)
    .filter(filtroPeriodo)
    .sort((a, b) => (b.data || '').localeCompare(a.data || '') || b.id - a.id);

  if (!entries.length) {
    $('#lista-diario').innerHTML = state.entries.length
      ? '<div class="vazio">Nenhum registro com esses filtros.</div>'
      : `<div class="vazio">📔 Nenhum registro ainda.<br>
        Bebeu um drink bom (ou ruim)? Registre com foto, nota e a história do momento.</div>`;
    return;
  }

  $('#lista-diario').innerHTML = entries.map(e => {
    const url = fotoURL(e);
    const foto = url ? `<img class="foto" src="${url}" alt="Foto de ${esc(e.nome)}">` : '';
    const receita = e.receitaId && RECEITA_MAP[e.receitaId];
    const quem = e.pessoaId && e.pessoaId !== 'eu'
      ? (getPessoa(e.pessoaId)?.nome || e.pessoaNome) : null;
    return `<div class="card entrada" data-entry="${e.id}">
      ${foto}
      <div class="entrada-corpo">
        <div class="card-top"><h3>${esc(e.nome)}</h3><span class="nota">${estrelas(e.nota || 0)}</span></div>
        <p class="meta">${fmtData(e.data)}${receita ? ` · receita: ${esc(receita.nome)}` : ''}${
          quem ? ` · 👤 ${esc(quem)}` : ''}</p>
        ${e.texto ? `<p class="texto">${esc(e.texto)}</p>` : ''}
        <div class="acoes">
          <button class="mini" data-editar="${e.id}">editar</button>
          <button class="mini" data-compartilhar-entrada="${e.id}">compartilhar</button>
          <button class="mini danger" data-apagar="${e.id}">apagar</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function compartilharEntrada(id) {
  const e = state.entries.find(x => x.id === id);
  if (!e) return;
  const partes = [`🍸 ${e.nome} ${estrelas(e.nota || 0)}`, fmtData(e.data)];
  if (e.texto) partes.push(`"${e.texto}"`);
  partes.push('(do meu diário no MeuBar)');
  compartilharTexto(e.nome, partes.join('\n'));
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
  const fotos = fotosPorReceita();
  const entrada = fotos[r.id];
  const arte = entrada
    ? `<img class="arte-foto" src="${fotoURL(entrada)}" alt="Sua foto de ${esc(r.nome)}"><span class="sua-foto">📷 sua foto</span>`
    : svgDrink(r, 140);
  $('#modal-corpo').innerHTML = `
    <div class="arte-modal">${arte}</div>
    <h2>${esc(r.nome)}</h2>
    <div class="tags">${r.tags.map(t => `<span class="tag">${esc(TAG_NOMES[t] || t)}</span>`).join('')}</div>
    <p class="meta">🥃 ${esc(r.copo)}</p>
    <h3>Ingredientes</h3>
    <ul class="ingredientes">${ing}</ul>
    <h3>Preparo</h3>
    <p>${esc(r.preparo)}</p>
    <a class="btn btn-video" target="_blank" rel="noopener"
      href="https://www.youtube.com/results?search_query=${encodeURIComponent('como fazer ' + r.nome + ' drink receita')}">
      ▶ Ver vídeos do preparo</a>
    <button class="btn primario" id="btn-registrar" data-receita="${r.id}">Fiz esse! Registrar no diário</button>
    <div class="botoes-duplos">
      <button class="btn" id="btn-favoritar" data-receita="${r.id}">
        ${state.favoritos.has(r.id) ? '♥ Favorito' : '♡ Favoritar'}</button>
      <button class="btn" id="btn-compartilhar" data-receita="${r.id}">Compartilhar</button>
    </div>`;
  $('#modal').classList.add('aberto');
}

async function compartilharTexto(titulo, texto) {
  if (navigator.share) {
    try { await navigator.share({ title: titulo, text: texto }); } catch { /* cancelado */ }
  } else {
    try {
      await navigator.clipboard.writeText(texto);
      alert('Copiado! É só colar onde quiser.');
    } catch { alert('Não consegui compartilhar neste navegador.'); }
  }
}

function compartilharReceita(id) {
  const r = RECEITA_MAP[id];
  if (!r) return;
  const ing = r.ing.map(i => `• ${ING_MAP[i.id]?.nome || i.id} — ${i.q}`).join('\n');
  compartilharTexto(r.nome,
    `🍸 ${r.nome}\n\n${ing}\n\nPreparo: ${r.preparo}\n\n(via MeuBar)`);
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
      <label>Quem bebeu? (a nota ensina o gosto dessa pessoa)
        <select name="pessoaId">
          <option value="eu">Você</option>
          ${state.pessoas.filter(p => p.id !== 'eu').map(p =>
            `<option value="${p.id}" ${entry?.pessoaId === p.id ? 'selected' : ''}>${esc(p.nome)}</option>`).join('')}
        </select>
      </label>
      <label>Nota</label>
      <div class="estrelas" id="picker-estrelas" role="radiogroup" aria-label="Nota de 1 a 5 estrelas">
        ${[1, 2, 3, 4, 5].map(n => `<button type="button" class="estrela ${n <= nota ? 'on' : ''}" data-n="${n}"
          role="radio" aria-checked="${n === nota}" aria-label="${n} ${n === 1 ? 'estrela' : 'estrelas'}">★</button>`).join('')}
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

  form.foto.addEventListener('change', async () => {
    const arquivo = form.foto.files[0] || null;
    novaFoto = arquivo ? await comprimirFoto(arquivo) : null;
    if (novaFoto) {
      $('#preview-foto').innerHTML = `<img class="foto" src="${URL.createObjectURL(novaFoto)}" alt="Prévia da foto">`;
    }
  });

  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const quem = form.pessoaId.value || 'eu';
    const dados = {
      nome: form.nome.value.trim(),
      receitaId: form.receitaId.value || null,
      pessoaId: quem,
      // Guarda o nome para o registro sobreviver se a pessoa for removida
      pessoaNome: quem === 'eu' ? null : (getPessoa(quem)?.nome || null),
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

// ---------- Formulário de pessoa (preferências) ----------
function abrirFormPessoa(id = null) {
  const pessoa = id ? getPessoa(id) : null;
  const isEu = pessoa?.id === 'eu';
  const tags = new Set(pessoa?.tags || []);
  const evita = new Set(pessoa?.evita || []);
  const chips = TAGS_PREFERENCIA.map(t =>
    `<button type="button" class="chip ${tags.has(t) ? 'on' : ''}" data-tag-pref="${t}">${esc(TAG_NOMES[t])}</button>`
  ).join('');
  const chipsEvita = TAGS_EVITA.map(t =>
    `<button type="button" class="chip evita ${evita.has(t) ? 'on' : ''}" data-tag-evita="${t}">${esc(EVITA_NOMES[t] || TAG_NOMES[t])}</button>`
  ).join('');

  $('#modal-corpo').innerHTML = `
    <h2>${pessoa ? (isEu ? 'O que você curte' : `Preferências de ${esc(pessoa.nome)}`) : '👤 Nova pessoa'}</h2>
    <form id="form-pessoa">
      ${isEu ? '' : `<label>Nome
        <input name="nome" required maxlength="40" value="${esc(pessoa?.nome || '')}" placeholder="Ex.: Marília">
      </label>`}
      <label>Gosta de drinks...</label>
      <div class="chips" id="chips-pref">${chips}</div>
      <label>Evita / não pode</label>
      <div class="chips" id="chips-evita">${chipsEvita}</div>
      <p class="dica">Marcar <strong>Álcool</strong> em "evita" mostra apenas drinks sem álcool
        para essa pessoa. As demais restrições escondem os drinks daquele estilo.</p>
      <button class="btn primario" type="submit">Salvar</button>
      ${pessoa && !isEu ? `<button class="btn" type="button" id="btn-apagar-pessoa" style="color:var(--erro)">Remover pessoa</button>` : ''}
    </form>`;
  $('#modal').classList.add('aberto');

  $('#chips-pref').addEventListener('click', ev => {
    const chip = ev.target.closest('[data-tag-pref]');
    if (!chip) return;
    const t = chip.dataset.tagPref;
    tags.has(t) ? tags.delete(t) : tags.add(t);
    chip.classList.toggle('on', tags.has(t));
  });

  $('#chips-evita').addEventListener('click', ev => {
    const chip = ev.target.closest('[data-tag-evita]');
    if (!chip) return;
    const t = chip.dataset.tagEvita;
    evita.has(t) ? evita.delete(t) : evita.add(t);
    chip.classList.toggle('on', evita.has(t));
  });

  $('#form-pessoa').addEventListener('submit', ev => {
    ev.preventDefault();
    const form = ev.target;
    if (pessoa) {
      pessoa.tags = [...tags];
      pessoa.evita = [...evita];
      if (!isEu) pessoa.nome = form.nome.value.trim();
      if (isEu && !state.pessoas.some(p => p.id === 'eu')) state.pessoas.push(pessoa);
    } else {
      const nova = { id: 'p' + Date.now(), nome: form.nome.value.trim(), tags: [...tags], evita: [...evita] };
      state.pessoas.push(nova);
      state.pessoaAtiva = nova.id;
    }
    Store.setPessoas(state.pessoas);
    fecharModal();
    renderSugestoes();
  });

  const apagar = $('#btn-apagar-pessoa');
  if (apagar) {
    apagar.addEventListener('click', () => {
      if (!confirm(`Remover ${pessoa.nome}? Os registros dela no diário são mantidos.`)) return;
      state.pessoas = state.pessoas.filter(p => p.id !== pessoa.id);
      state.festa = state.festa.filter(id => id !== pessoa.id);
      Store.setFesta(state.festa);
      if (state.pessoaAtiva === pessoa.id) state.pessoaAtiva = 'eu';
      if (state.pessoaAtiva === 'festa' && state.festa.length < 2) state.pessoaAtiva = 'eu';
      Store.setPessoas(state.pessoas);
      fecharModal();
      renderSugestoes();
    });
  }
}

// ---------- Modo festa: quem está na roda? ----------
function abrirFormFesta() {
  const todos = [{ id: 'eu', nome: 'Você' }, ...state.pessoas.filter(p => p.id !== 'eu')];
  const sel = new Set(state.festa.length ? state.festa : todos.map(p => p.id));
  $('#modal-corpo').innerHTML = `
    <h2>🎉 Quem está na roda?</h2>
    <p class="dica">Escolha pelo menos duas pessoas. Vou priorizar drinks que agradem
      todo mundo e respeitar as restrições de cada um.</p>
    <div class="chips" id="chips-festa">
      ${todos.map(p => `<button type="button" class="chip ${sel.has(p.id) ? 'on' : ''}" data-festa-id="${p.id}">${esc(p.nome)}</button>`).join('')}
    </div>
    <button class="btn primario" id="btn-salvar-festa">Começar a festa</button>`;
  $('#modal').classList.add('aberto');

  $('#chips-festa').addEventListener('click', ev => {
    const chip = ev.target.closest('[data-festa-id]');
    if (!chip) return;
    const id = chip.dataset.festaId;
    sel.has(id) ? sel.delete(id) : sel.add(id);
    chip.classList.toggle('on', sel.has(id));
  });

  $('#btn-salvar-festa').addEventListener('click', () => {
    if (sel.size < 2) { alert('Escolha pelo menos duas pessoas.'); return; }
    state.festa = [...sel];
    Store.setFesta(state.festa);
    state.pessoaAtiva = 'festa';
    fecharModal();
    renderSugestoes();
  });
}

function fecharModal() {
  $('#modal').classList.remove('aberto');
  $('#modal-corpo').innerHTML = '';
}

// ---------- Backup: exportar e importar tudo ----------
function blobParaDataURL(blob) {
  return new Promise(resolve => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = () => resolve(null);
    fr.readAsDataURL(blob);
  });
}

async function exportarDados() {
  const entries = [];
  for (const e of state.entries) {
    const copia = { ...e };
    if (e.foto instanceof Blob) copia.foto = await blobParaDataURL(e.foto);
    entries.push(copia);
  }
  const dados = {
    app: 'meubar', versao: 1, exportadoEm: new Date().toISOString(),
    bar: [...state.bar], shopping: [...state.shopping],
    pessoas: state.pessoas, favoritos: [...state.favoritos],
    festa: state.festa, entries,
  };
  const blob = new Blob([JSON.stringify(dados)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `meubar-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

async function importarDados(arquivo) {
  let dados;
  try { dados = JSON.parse(await arquivo.text()); }
  catch { alert('Arquivo inválido.'); return; }
  if (dados?.app !== 'meubar' || !Array.isArray(dados.entries)) {
    alert('Esse arquivo não parece um backup do MeuBar.');
    return;
  }
  if (!confirm(`Importar backup de ${fmtData(dados.exportadoEm?.slice(0, 10))} ` +
    `(${dados.entries.length} registros)? Isso substitui os dados atuais.`)) return;

  await dbClearEntries();
  for (const url of state.fotoURLs.values()) URL.revokeObjectURL(url);
  state.fotoURLs.clear();
  for (const e of dados.entries) {
    const copia = { ...e };
    delete copia.id; // deixa o IndexedDB gerar ids novos
    if (typeof copia.foto === 'string' && copia.foto.startsWith('data:')) {
      copia.foto = await (await fetch(copia.foto)).blob();
    } else if (typeof copia.foto === 'string') {
      copia.foto = null;
    }
    await dbAddEntry(copia);
  }
  state.bar = new Set(dados.bar || []);
  state.shopping = new Set(dados.shopping || []);
  state.pessoas = dados.pessoas || [];
  state.favoritos = new Set(dados.favoritos || []);
  state.festa = dados.festa || [];
  state.pessoaAtiva = 'eu';
  Store.setBar(state.bar);
  Store.setShopping(state.shopping);
  Store.setPessoas(state.pessoas);
  Store.setFavoritos(state.favoritos);
  Store.setFesta(state.festa);
  state.entries = await dbGetEntries();
  renderDiario();
  renderSugestoes();
  alert('Backup importado! 🍸');
}

// ---------- Especialista (IA) ----------
const chat = { history: Store.getChat(), ocupado: false };

function renderExpert() {
  const temChave = !!Store.getApiKey();
  $('#expert-config').classList.toggle('escondido', temChave);
  $('#expert-chat').classList.toggle('escondido', !temChave);
  // Restaura a conversa salva ao voltar para a aba
  if (temChave && !$('#chat-mensagens').children.length && chat.history.length) {
    for (const msg of chat.history) addBubble(msg.role, msg.content);
  }
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
  if (chat.ocupado) return;
  const input = $('#chat-input');
  const texto = input.value.trim();
  if (!texto) return;
  chat.ocupado = true;
  input.value = '';
  input.disabled = true;
  $('#form-chat button').disabled = true;
  addBubble('user', texto);
  chat.history.push({ role: 'user', content: texto });

  const pensando = addBubble('assistant', 'Pensando... 🍸');
  const pesos = tasteProfile();
  const top = [...new Set([...getPessoa('eu').tags, ...topProfileTags(pesos, 4)])];
  const topDrinks = state.entries
    .filter(e => e.nota >= 4)
    .sort((a, b) => b.nota - a.nota)
    .slice(0, 5)
    .map(e => ({ nome: e.nome, nota: e.nota }));

  const pessoas = state.pessoas
    .filter(p => p.id !== 'eu')
    .map(p => ({
      nome: p.nome,
      gostos: p.tags.map(t => TAG_NOMES[t] || t),
      evita: (p.evita || []).map(t => EVITA_NOMES[t] || TAG_NOMES[t] || t),
    }));

  try {
    const resposta = await askExpert(
      Store.getApiKey(),
      buildSystemPrompt(state.bar, top, topDrinks, pessoas),
      chat.history,
    );
    pensando.textContent = resposta;
    chat.history.push({ role: 'assistant', content: resposta });
    Store.setChat(chat.history);
  } catch (err) {
    pensando.textContent = `⚠️ ${err.message}`;
    chat.history.pop(); // remove a pergunta que falhou para poder tentar de novo
  } finally {
    chat.ocupado = false;
    input.disabled = false;
    $('#form-chat button').disabled = false;
    input.focus();
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

  // Sugestões: pessoas, filtros, cards e lista de compras
  $('#pessoas-row').addEventListener('click', ev => {
    const editar = ev.target.closest('[data-editar-pessoa]');
    if (editar) {
      abrirFormPessoa(editar.dataset.editarPessoa);
      return;
    }
    if (ev.target.closest('[data-editar-festa]')) {
      abrirFormFesta();
      return;
    }
    if (ev.target.closest('[data-festa]')) {
      if (state.festa.length >= 2) {
        state.pessoaAtiva = 'festa';
        renderSugestoes();
      } else {
        abrirFormFesta();
      }
      return;
    }
    if (ev.target.closest('[data-nova-pessoa]')) {
      abrirFormPessoa();
      return;
    }
    const chip = ev.target.closest('[data-pessoa]');
    if (chip) {
      state.pessoaAtiva = chip.dataset.pessoa;
      renderSugestoes();
    }
  });

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
  $('#filtro-nota').addEventListener('change', renderDiario);
  $('#filtro-periodo').addEventListener('change', renderDiario);
  $('#btn-exportar').addEventListener('click', exportarDados);
  $('#input-importar').addEventListener('change', ev => {
    const arquivo = ev.target.files[0];
    if (arquivo) importarDados(arquivo);
    ev.target.value = '';
  });
  $('#lista-diario').addEventListener('click', async ev => {
    const editar = ev.target.closest('[data-editar]');
    if (editar) {
      const e = state.entries.find(x => x.id === Number(editar.dataset.editar));
      if (e) abrirFormEntrada(e);
      return;
    }
    const compartilhar = ev.target.closest('[data-compartilhar-entrada]');
    if (compartilhar) {
      compartilharEntrada(Number(compartilhar.dataset.compartilharEntrada));
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
    const favBtn = ev.target.closest('#btn-favoritar');
    if (favBtn) {
      const id = favBtn.dataset.receita;
      state.favoritos.has(id) ? state.favoritos.delete(id) : state.favoritos.add(id);
      Store.setFavoritos(state.favoritos);
      favBtn.textContent = state.favoritos.has(id) ? '♥ Favorito' : '♡ Favoritar';
      renderSugestoes();
    }
    const shareBtn = ev.target.closest('#btn-compartilhar');
    if (shareBtn) compartilharReceita(shareBtn.dataset.receita);
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
    Store.setChat([]);
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
  $('#contador-bar').textContent = state.bar.size;
  trocarAba('sugestoes');

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline opcional */ });
  }
}

document.addEventListener('DOMContentLoaded', init);
