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
  animar: true, // cascata só ao entrar na aba, não a cada toque
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

// Receitas criadas pelo usuário entram no catálogo global (motor, diário, perfil)
function aplicarReceitasCustom() {
  for (const r of Store.getReceitasCustom()) {
    if (!RECEITA_MAP[r.id]) RECEITAS.push(r);
    RECEITA_MAP[r.id] = r;
  }
}

function salvarReceitaCustom(receita) {
  const custom = Store.getReceitasCustom().filter(r => r.id !== receita.id);
  custom.push(receita);
  Store.setReceitasCustom(custom);
  const idx = RECEITAS.findIndex(r => r.id === receita.id);
  if (idx >= 0) RECEITAS[idx] = receita; else RECEITAS.push(receita);
  RECEITA_MAP[receita.id] = receita;
}

function excluirReceitaCustom(id) {
  Store.setReceitasCustom(Store.getReceitasCustom().filter(r => r.id !== id));
  const idx = RECEITAS.findIndex(r => r.id === id);
  if (idx >= 0) RECEITAS.splice(idx, 1);
  delete RECEITA_MAP[id];
  state.favoritos.delete(id);
  Store.setFavoritos(state.favoritos);
}

function getPessoa(id) {
  if (id === 'eu') {
    return state.pessoas.find(p => p.id === 'eu') || { id: 'eu', nome: 'Você', tags: [] };
  }
  return state.pessoas.find(p => p.id === id) || null;
}

// Consome o pedido de animação: a cascata roda uma vez por entrada de aba.
function consumirAnimacao() {
  const v = state.animar;
  state.animar = false;
  return v;
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

// Converte qualquer imagem em JPEG base64 (máx. 1200px) para enviar à IA
function fotoParaBase64Jpeg(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const max = 1200;
      const escala = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.85).split(',')[1]);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Imagem inválida')); };
    img.src = url;
  });
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
  // "autorais" não é sabor: é a leva moderna, com autor, ano e endereço conhecidos
  if (state.filtroTag === 'autorais') return !!receita.autoral;
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
  const combina = destaque && score > 0 ? ' combina' : '';
  // O que abre a receita é um <button> de verdade: o cardápio inteiro se
  // percorre no Tab. O "+ lista" fica fora dele — botão dentro de botão é
  // HTML inválido e o teclado não alcança o de dentro.
  return `<div class="card sugestao${combina}">
    <button type="button" class="card-abre" data-receita="${receita.id}">
      <div class="item">
        <h3>${esc(receita.nome)}${fav}${foto}</h3>
        <span class="pontos"></span>
        <span class="copo-item">${esc(receita.copo.toLowerCase())}</span>
      </div>
      <div class="sub">${match}<span class="tags-linha">${receita.custom ? 'sua receita · ' : ''}${tags}</span></div>
    </button>
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

  let html = blocoBoasVoltas() + efemeride() + blocoDrinkDoDia() + perfilHtml;
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
  if (consumirAnimacao()) escalonar($('#lista-sugestoes'));
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
  if (consumirAnimacao()) escalonar($('#conteudo-bar'), '.bloco', 60);
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
  $('#stats-diario').innerHTML = `<p class="stats">Este mês: <strong data-conta="${doMes.length}">0</strong>
    ${doMes.length === 1 ? 'registro' : 'registros'}${media ? ` · nota média <strong>${media}</strong>` : ''}${
    melhor ? ` · destaque: <strong>${esc(melhor.nome)}</strong>` : ''}</p>`;
  const alvo = $('#stats-diario [data-conta]');
  if (alvo) contarAte(alvo, Number(alvo.dataset.conta), 800);
}

function renderDiario() {
  renderStatsDiario();
  renderColecao();
  $('#btn-retrospectiva').classList.toggle('escondido', state.entries.length < 3);
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

  const pintarDiario = entries.map(e => {
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
  $('#lista-diario').innerHTML = pintarDiario;
  if (consumirAnimacao()) escalonar($('#lista-diario'), '.entrada');
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
  // A foto do usuário é o ativo emocional mais forte: vira capa, não miniatura.
  const arte = entrada
    ? `<figure class="foto-heroi">
        <img src="${fotoURL(entrada)}" alt="Sua foto de ${esc(r.nome)}">
        <figcaption>📷 sua foto</figcaption>
      </figure>`
    : svgDrink(r, 140);
  const h = historiaDe(r.id);
  const nivel = nivelDaReceita(r);
  $('#modal-corpo').innerHTML = `
    <div class="arte-modal">${arte}</div>
    <h2>${esc(r.nome)}</h2>
    <p class="linha-ficha">${h ? esc(h.origem) + ' · ' : ''}${'★'.repeat(nivel)}${'☆'.repeat(3 - nivel)} ${esc(NIVEL_NOMES[nivel])} · ${tempoDaReceita(r)} min</p>
    <div class="tags">${r.tags.map(t => `<span class="tag">${esc(TAG_NOMES[t] || t)}</span>`).join('')}</div>
    <p class="meta">🥃 ${esc(r.copo)}</p>
    <div id="area-historia">${blocoHistoria(r, h)}</div>
    ${blocoTrilha(r)}
    <h3>Ingredientes</h3>
    <ul class="ingredientes">${ing}</ul>
    <h3>Preparo</h3>
    <p>${esc(r.preparo)}</p>
    ${r.ingExtra ? `<p class="dica">Outros: ${esc(r.ingExtra)}</p>` : ''}
    <h3>Minhas anotações</h3>
    <div id="nota-area">
      ${Store.getNotas()[r.id]
        ? `<p class="nota-texto">${esc(Store.getNotas()[r.id])}</p>`
        : '<p class="dica">Seus ajustes na receita — ex.: "faço com 2 limões e menos açúcar".</p>'}
      <button class="mini" id="btn-editar-nota" data-receita="${r.id}">✎ ${Store.getNotas()[r.id] ? 'editar' : 'anotar'}</button>
    </div>
    <button class="btn primario" id="btn-preparar" data-receita="${r.id}">Preparar passo a passo</button>
    <a class="btn btn-video" target="_blank" rel="noopener"
      href="https://www.youtube.com/results?search_query=${encodeURIComponent('como fazer ' + r.nome + ' drink receita')}">
      ▶ Ver vídeos do preparo</a>
    <button class="btn" id="btn-registrar" data-receita="${r.id}">Já fiz — só registrar</button>
    <div class="botoes-duplos">
      <button class="btn" id="btn-favoritar" data-receita="${r.id}">
        ${state.favoritos.has(r.id) ? '♥ Favorito' : '♡ Favoritar'}</button>
      <button class="btn" id="btn-compartilhar" data-receita="${r.id}">Compartilhar</button>
    </div>
    ${r.custom ? `<div class="botoes-duplos">
      <button class="btn" id="btn-editar-receita" data-receita="${r.id}">Editar receita</button>
      <button class="btn btn-excluir" id="btn-excluir-receita" data-receita="${r.id}">Excluir</button>
    </div>` : ''}`;
  abrirModal();
}

async function compartilharTexto(titulo, texto) {
  if (navigator.share) {
    try { await navigator.share({ title: titulo, text: texto }); } catch { /* cancelado */ }
  } else {
    try {
      await navigator.clipboard.writeText(texto);
      toast('Copiado!', 'É só colar onde quiser.');
    } catch { toast('Não consegui compartilhar', 'Seu navegador não permite esta ação.', 'erro'); }
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
  abrirModal();

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
    if (!entry) celebrarMarco(state.entries.length);
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
      ${pessoa ? '' : `<button type="button" class="btn" id="btn-convidar">
        ✉️ Ou envie um cartão para a pessoa preencher</button>`}
      <button class="btn primario" type="submit">Salvar</button>
      ${pessoa && !isEu ? `<button class="btn" type="button" id="btn-apagar-pessoa" style="color:var(--erro)">Remover pessoa</button>` : ''}
    </form>`;
  abrirModal();

  $('#chips-pref').addEventListener('click', ev => {
    const chip = ev.target.closest('[data-tag-pref]');
    if (!chip) return;
    const t = chip.dataset.tagPref;
    tags.has(t) ? tags.delete(t) : tags.add(t);
    chip.classList.toggle('on', tags.has(t));
  });

  const convidar = $('#btn-convidar');
  if (convidar) convidar.addEventListener('click', compartilharConvite);

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
    apagar.addEventListener('click', async () => {
      if (!await confirmar(`Remover ${pessoa.nome}?`,
        'Os registros dela no diário são mantidos.', 'Remover', true)) return;
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

// ---------- Receita própria: criar e editar ----------
const COPOS_OPCOES = ['Copo baixo', 'Copo alto', 'Taça coupé', 'Taça martini',
  'Taça de vinho', 'Taça flute', 'Caneca de vidro'];

function linhaIngrediente(sel = '', q = '') {
  const opcoes = ['<option value="">— ingrediente —</option>']
    .concat(CATEGORIAS.map(cat => {
      const itens = INGREDIENTES.filter(i => i.cat === cat.id)
        .map(i => `<option value="${i.id}" ${i.id === sel ? 'selected' : ''}>${esc(i.nome)}</option>`);
      return `<optgroup label="${esc(cat.nome)}">${itens.join('')}</optgroup>`;
    })).join('');
  return `<div class="linha-ing">
    <select class="ing-sel">${opcoes}</select>
    <input class="ing-q" type="text" placeholder="qtd. (ex.: 50 ml)" maxlength="40" value="${esc(q)}">
    <button type="button" class="mini danger ing-tira">✕</button>
  </div>`;
}

function abrirFormReceita(receita = null) {
  const tagsSel = new Set(receita?.tags || []);
  const chips = TAGS_PREFERENCIA.map(t =>
    `<button type="button" class="chip ${tagsSel.has(t) ? 'on' : ''}" data-tag-rec="${t}">${esc(TAG_NOMES[t])}</button>`
  ).join('');
  const linhas = (receita?.ing?.length ? receita.ing : [{ id: '', q: '' }, { id: '', q: '' }])
    .filter(i => !i.basico)
    .map(i => linhaIngrediente(i.id, i.q)).join('');

  $('#modal-corpo').innerHTML = `
    <h2>${receita ? 'Editar receita' : '🍸 Minha receita'}</h2>
    <form id="form-receita">
      <label>Nome do drink
        <input name="nome" required maxlength="60" value="${esc(receita?.nome || '')}" placeholder="Ex.: Drink da casa">
      </label>
      <label>Copo
        <select name="copo">${COPOS_OPCOES.map(c =>
          `<option ${receita?.copo === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
      </label>
      <label>Perfil de sabor (alimenta as sugestões)</label>
      <div class="chips" id="chips-receita">${chips}</div>
      <label>Ingredientes do catálogo (para eu saber quando você pode fazer)</label>
      <div id="linhas-ing">${linhas}</div>
      <button type="button" class="mini" id="btn-mais-ing">+ ingrediente</button>
      <label style="margin-top:12px">Outros ingredientes (fora do catálogo, opcional)
        <input name="ingExtra" maxlength="120" value="${esc(receita?.ingExtra || '')}" placeholder="Ex.: xarope de gengibre caseiro">
      </label>
      <label>Preparo
        <textarea name="preparo" rows="3" required maxlength="600" placeholder="Como fazer...">${esc(receita?.preparo || '')}</textarea>
      </label>
      <button class="btn primario" type="submit">Salvar receita</button>
    </form>`;
  abrirModal();

  $('#chips-receita').addEventListener('click', ev => {
    const chip = ev.target.closest('[data-tag-rec]');
    if (!chip) return;
    const t = chip.dataset.tagRec;
    tagsSel.has(t) ? tagsSel.delete(t) : tagsSel.add(t);
    chip.classList.toggle('on', tagsSel.has(t));
  });

  $('#btn-mais-ing').addEventListener('click', () => {
    $('#linhas-ing').insertAdjacentHTML('beforeend', linhaIngrediente());
  });
  $('#linhas-ing').addEventListener('click', ev => {
    const tira = ev.target.closest('.ing-tira');
    if (tira) tira.closest('.linha-ing').remove();
  });

  $('#form-receita').addEventListener('submit', ev => {
    ev.preventDefault();
    const form = ev.target;
    const ing = $$('#linhas-ing .linha-ing')
      .map(l => ({ id: l.querySelector('.ing-sel').value, q: l.querySelector('.ing-q').value.trim() || 'a gosto' }))
      .filter(i => i.id);
    if (!ing.length) { toast('Falta um ingrediente', 'Escolha pelo menos 1 item do catálogo.', 'erro'); return; }
    const nova = {
      id: receita?.id || 'custom-' + Date.now(),
      custom: true,
      nome: form.nome.value.trim(),
      copo: form.copo.value,
      tags: tagsSel.size ? [...tagsSel] : ['classico'],
      ing: [...ing, { id: 'gelo', q: 'a gosto' }],
      ingExtra: form.ingExtra.value.trim(),
      preparo: form.preparo.value.trim(),
    };
    salvarReceitaCustom(nova);
    fecharModal();
    renderSugestoes();
  });
}

// ---------- Cardápio da noite (imagem para compartilhar) ----------
function gerarCardapioFesta() {
  const { ready } = matchRecipes();
  const drinks = ready.slice(0, 8);
  if (!drinks.length) { toast('Cardápio vazio', 'Adicione itens ao seu bar para ter o que servir.', 'erro'); return; }
  const nomes = state.pessoaAtiva === 'festa'
    ? state.festa.map(id => id === 'eu' ? 'Você' : getPessoa(id)?.nome).filter(Boolean)
    : [];

  const W = 1080;
  const H = 560 + drinks.length * 96 + (nomes.length ? 60 : 0);
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // papel
  ctx.fillStyle = '#FBFAF7';
  ctx.fillRect(0, 0, W, H);
  // moldura fina
  ctx.strokeStyle = '#201D1A';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.strokeStyle = '#C4372B';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(52, 52, W - 104, H - 104);

  ctx.textAlign = 'center';
  // marca
  ctx.fillStyle = '#201D1A';
  ctx.font = 'normal 88px Georgia, serif';
  const meuW = ctx.measureText('Meu').width;
  const barW = ctx.measureText('Bar').width;
  ctx.textAlign = 'left';
  ctx.fillText('Meu', W / 2 - (meuW + barW) / 2, 175);
  ctx.fillStyle = '#C4372B';
  ctx.font = 'italic 88px Georgia, serif';
  ctx.fillText('Bar', W / 2 - (meuW + barW) / 2 + meuW, 175);
  ctx.textAlign = 'center';

  ctx.fillStyle = '#6B665C';
  ctx.font = 'italic 34px Georgia, serif';
  ctx.fillText('cardápio da noite', W / 2, 230);
  const hoje = new Date();
  ctx.font = '28px Helvetica, sans-serif';
  ctx.fillText(hoje.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(), W / 2, 280);

  let y = 330;
  if (nomes.length) {
    ctx.fillStyle = '#201D1A';
    ctx.font = 'italic 32px Georgia, serif';
    ctx.fillText(`para ${nomes.join(', ')}`, W / 2, y);
    y += 60;
  }
  ctx.fillStyle = '#C4372B';
  ctx.font = '36px Georgia, serif';
  ctx.fillText('· · ✦ · ·', W / 2, y + 10);
  y += 80;

  for (const { receita } of drinks) {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#201D1A';
    ctx.font = '44px Georgia, serif';
    ctx.fillText(receita.nome, 110, y);
    const nomeW = ctx.measureText(receita.nome).width;
    ctx.fillStyle = '#6B665C';
    ctx.font = 'italic 30px Georgia, serif';
    ctx.textAlign = 'right';
    const copoTxt = receita.copo.toLowerCase();
    ctx.fillText(copoTxt, W - 110, y);
    const copoW = ctx.measureText(copoTxt).width;
    // pontilhado
    ctx.strokeStyle = '#b8b2a4';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 9]);
    ctx.beginPath();
    ctx.moveTo(110 + nomeW + 18, y - 8);
    ctx.lineTo(W - 110 - copoW - 18, y - 8);
    ctx.stroke();
    ctx.setLineDash([]);
    // tags
    ctx.textAlign = 'left';
    ctx.fillStyle = '#6B665C';
    ctx.font = 'italic 26px Georgia, serif';
    ctx.fillText(receita.tags.map(t => (TAG_NOMES[t] || t).toLowerCase()).join(', '), 110, y + 36);
    y += 96;
    ctx.textAlign = 'center';
  }

  ctx.fillStyle = '#6B665C';
  ctx.font = '24px Helvetica, sans-serif';
  ctx.fillText('FEITO COM ♥ NO MEUBAR', W / 2, H - 85);

  canvas.toBlob(async blob => {
    if (!blob) return;
    const arquivo = new File([blob], 'cardapio-meubar.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
      try { await navigator.share({ files: [arquivo], title: 'Cardápio da noite' }); return; }
      catch { /* cancelado — cai para download */ }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'cardapio-meubar.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }, 'image/png');
}

// ---------- Foto da estante: IA cadastra o bar ----------
async function analisarEstante(arquivo) {
  const chave = Store.getApiKey();
  if (!chave) {
    toast('Configure a IA primeiro', 'A leitura da estante precisa da sua chave de API.', 'info');
    trocarAba('expert');
    return;
  }
  $('#modal-corpo').innerHTML = `<h2>Analisando sua estante</h2>
    <p class="dica">Identificando garrafas e ingredientes...</p>
    <div class="skeleton"><i></i><i></i><i></i></div>`;
  abrirModal();
  try {
    const base64 = await fotoParaBase64Jpeg(arquivo);
    const ids = await identificarGarrafas(chave, base64);
    if (!ids.length) {
      $('#modal-corpo').innerHTML = `<h2>📸 Hmm...</h2>
        <p>Não reconheci nenhum item do catálogo nessa foto. Tenta uma foto mais de perto,
        com os rótulos visíveis?</p>
        <button class="btn" id="modal-ok">Fechar</button>`;
      $('#modal-ok').addEventListener('click', fecharModal);
      return;
    }
    const sel = new Set(ids);
    $('#modal-corpo').innerHTML = `<h2>📸 Encontrei isto</h2>
      <p class="dica">Toque para desmarcar o que eu errei, e confirme.</p>
      <div class="chips" id="chips-estante">
        ${ids.map(id => `<button type="button" class="chip on" data-estante-id="${id}">${esc(ING_MAP[id].nome)}</button>`).join('')}
      </div>
      <button class="btn primario" id="btn-confirmar-estante">Adicionar ao meu bar</button>`;
    $('#chips-estante').addEventListener('click', ev => {
      const chip = ev.target.closest('[data-estante-id]');
      if (!chip) return;
      const id = chip.dataset.estanteId;
      sel.has(id) ? sel.delete(id) : sel.add(id);
      chip.classList.toggle('on', sel.has(id));
    });
    $('#btn-confirmar-estante').addEventListener('click', () => {
      for (const id of sel) state.bar.add(id);
      Store.setBar(state.bar);
      fecharModal();
      renderBar();
      const { ready } = matchRecipes();
      toast(`${sel.size} ${sel.size === 1 ? 'item entrou' : 'itens entraram'} no seu bar`,
        `Agora você pode fazer ${ready.length} drinks.`);
    });
  } catch (err) {
    $('#modal-corpo').innerHTML = `<h2>⚠️ Não deu certo</h2><p>${esc(err.message)}</p>
      <button class="btn" id="modal-ok">Fechar</button>`;
    $('#modal-ok').addEventListener('click', fecharModal);
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
  abrirModal();

  $('#chips-festa').addEventListener('click', ev => {
    const chip = ev.target.closest('[data-festa-id]');
    if (!chip) return;
    const id = chip.dataset.festaId;
    sel.has(id) ? sel.delete(id) : sel.add(id);
    chip.classList.toggle('on', sel.has(id));
  });

  $('#btn-salvar-festa').addEventListener('click', () => {
    if (sel.size < 2) { toast('Festa de uma pessoa só?', 'Escolha pelo menos duas.', 'erro'); return; }
    state.festa = [...sel];
    Store.setFesta(state.festa);
    state.pessoaAtiva = 'festa';
    fecharModal();
    renderSugestoes();
  });
}

// De onde o modal foi aberto, para devolver o foco ao fechar — sem isso quem
// usa teclado volta para o topo da página a cada receita que espia.
let focoAnterior = null;

function abrirModal() {
  focoAnterior = document.activeElement;
  $('#modal').classList.add('aberto');
  // O ✕ é o primeiro alvo: garante que o leitor de tela entre na caixa e que
  // a saída esteja a um Tab de distância.
  requestAnimationFrame(() => $('#modal-fechar').focus());
}

function fecharModal() {
  $('#modal').classList.remove('aberto');
  $('#modal-corpo').innerHTML = '';
  if (focoAnterior?.isConnected) focoAnterior.focus();
  focoAnterior = null;
}

// Mantém o Tab dentro do modal enquanto ele está aberto
function prenderTab(ev) {
  const modal = $('#modal');
  if (ev.key !== 'Tab' || !modal.classList.contains('aberto')) return;
  const foco = [...modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => !el.disabled && el.offsetParent !== null);
  if (!foco.length) return;
  const primeiro = foco[0], ultimo = foco[foco.length - 1];
  if (ev.shiftKey && document.activeElement === primeiro) {
    ev.preventDefault(); ultimo.focus();
  } else if (!ev.shiftKey && document.activeElement === ultimo) {
    ev.preventDefault(); primeiro.focus();
  }
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
    app: 'meubar', versao: 2, exportadoEm: new Date().toISOString(),
    bar: [...state.bar], shopping: [...state.shopping],
    pessoas: state.pessoas, favoritos: [...state.favoritos],
    festa: state.festa, entries,
    receitas: Store.getReceitasCustom(), notas: Store.getNotas(),
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
  catch { toast('Arquivo inválido', 'Não consegui ler esse arquivo.', 'erro'); return; }
  if (dados?.app !== 'meubar' || !Array.isArray(dados.entries)) {
    toast('Backup não reconhecido', 'Esse arquivo não parece um backup do MeuBar.', 'erro');
    return;
  }
  if (!await confirmar(`Importar backup de ${fmtData(dados.exportadoEm?.slice(0, 10))}?`,
    `${dados.entries.length} registros. Isso substitui os dados atuais.`, 'Importar')) return;

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
  Store.setReceitasCustom(dados.receitas || []);
  Store.setNotas(dados.notas || {});
  aplicarReceitasCustom();
  state.entries = await dbGetEntries();
  renderDiario();
  renderSugestoes();
  toast('Backup importado', `${dados.entries.length} registros de volta no lugar.`);
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

  const pensando = addBubble('assistant', '');
  pensando.innerHTML = '<div class="skeleton"><i></i><i></i><i></i></div>';
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
  state.animar = true;
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

  // Sugestões: criar receita própria e cardápio da noite
  $('#btn-luz').addEventListener('click', alternarLuz);
  $('#colecao').addEventListener('click', ev => {
    const peca = ev.target.closest('[data-receita]');
    if (peca) abrirReceita(peca.dataset.receita);
  });
  $('#btn-nova-receita').addEventListener('click', () => abrirFormReceita());
  $('#btn-cardapio').addEventListener('click', gerarCardapioFesta);

  // Meu Bar
  $('#input-estante').addEventListener('change', ev => {
    const arquivo = ev.target.files[0];
    if (arquivo) analisarEstante(arquivo);
    ev.target.value = '';
  });
  $('#busca-bar').addEventListener('input', renderBar);
  $('#conteudo-bar').addEventListener('click', ev => {
    const ing = ev.target.closest('[data-ing]');
    if (ing) {
      const id = ing.dataset.ing;
      state.bar.has(id) ? state.bar.delete(id) : state.bar.add(id);
      Store.setBar(state.bar);
      if (state.bar.has(id)) vibrar(HAPTICO.toque);
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
  $('#btn-retrospectiva').addEventListener('click', gerarRetrospectiva);
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
      if (await confirmar('Apagar este registro?', 'Essa ação não pode ser desfeita.', 'Apagar', true)) {
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

  // Teclado: Esc fecha a tela de cima da pilha, uma por vez.
  // Os diálogos do feedback.js cuidam do próprio Esc e são os mais altos.
  document.addEventListener('keydown', ev => {
    if (ev.key === 'Tab') { prenderTab(ev); return; }
    if (ev.key !== 'Escape' || $('.dialogo-fundo')) return;
    const brinde = $('#brinde');
    if (brinde) { brinde.querySelector('[data-fechar]').click(); return; }
    const preparo = $('#preparo');
    if (preparo) { preparo.querySelector('.preparo-sair').click(); return; }
    if ($('#modal').classList.contains('aberto')) fecharModal();
  });

  // Modal
  $('#modal').addEventListener('click', async ev => {
    if (ev.target.id === 'modal' || ev.target.closest('#modal-fechar')) fecharModal();
    const desc = ev.target.closest('[data-descobrir]');
    if (desc) {
      const r = RECEITA_MAP[desc.dataset.descobrir];
      if (!Store.getApiKey()) {
        toast('Ative o Especialista', 'Com sua chave de API eu pesquiso e escrevo a história.', 'info');
        return;
      }
      $('#area-historia').innerHTML = '<div class="skeleton"><i></i><i></i><i></i></div>';
      try {
        const h = await buscarHistoriaIA(r);
        $('#area-historia').innerHTML = blocoHistoria(r, h);
        if (!h) toast('Não consegui desta vez', 'Tente de novo em instantes.', 'erro');
      } catch (err) {
        $('#area-historia').innerHTML = blocoHistoria(r, null);
        toast('Não consegui desta vez', err.message, 'erro');
      }
      return;
    }
    const prep = ev.target.closest('#btn-preparar');
    if (prep) { abrirPreparo(prep.dataset.receita); return; }
    const reg = ev.target.closest('#btn-registrar');
    if (reg) abrirFormEntrada(null, reg.dataset.receita);
    const favBtn = ev.target.closest('#btn-favoritar');
    if (favBtn) {
      const id = favBtn.dataset.receita;
      state.favoritos.has(id) ? state.favoritos.delete(id) : state.favoritos.add(id);
      Store.setFavoritos(state.favoritos);
      favBtn.textContent = state.favoritos.has(id) ? '♥ Favorito' : '♡ Favoritar';
      if (state.favoritos.has(id)) {
        favBtn.classList.remove('pulsa');
        void favBtn.offsetWidth;
        favBtn.classList.add('pulsa');
        vibrar(HAPTICO.gostei);
      }
      renderSugestoes();
    }
    const shareBtn = ev.target.closest('#btn-compartilhar');
    if (shareBtn) compartilharReceita(shareBtn.dataset.receita);

    const notaBtn = ev.target.closest('#btn-editar-nota');
    if (notaBtn) {
      const id = notaBtn.dataset.receita;
      const notas = Store.getNotas();
      const texto = await perguntar('Suas anotações', notas[id] || '',
        'Ex.: faço com 2 limões e menos açúcar');
      if (texto !== null) {
        if (texto.trim()) notas[id] = texto.trim(); else delete notas[id];
        Store.setNotas(notas);
        abrirReceita(id);
      }
    }

    const editarRec = ev.target.closest('#btn-editar-receita');
    if (editarRec) abrirFormReceita(RECEITA_MAP[editarRec.dataset.receita]);

    const excluirRec = ev.target.closest('#btn-excluir-receita');
    if (excluirRec) {
      const id = excluirRec.dataset.receita;
      if (await confirmar(`Excluir "${RECEITA_MAP[id]?.nome}"?`,
        'Os registros no diário são mantidos.', 'Excluir', true)) {
        excluirReceitaCustom(id);
        fecharModal();
        renderSugestoes();
      }
    }
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
  aplicarReceitasCustom();
  aplicarLuz();
  // a sala escurece sozinha ao cruzar as 18h com o app aberto
  setInterval(aplicarLuz, 5 * 60 * 1000);
  // Tela do convidado assume a página inteira — não precisa do app normal
  if (location.hash === '#convidado') { abrirCartaoConvidado(); return; }
  state.entries = await dbGetEntries();
  initEventos();
  checarConvite();
  checarBoasVindas();
  $('#contador-bar').textContent = state.bar.size;
  renderLembrete();
  // guarda "há quanto tempo faz" antes de registrar a visita de agora
  abrirSessao();
  trocarAba('sugestoes');

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline opcional */ });
  }
}

document.addEventListener('DOMContentLoaded', init);
