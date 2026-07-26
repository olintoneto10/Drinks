// Momentos: a hora do bar (luz da sala), o drink do dia, as efemérides do
// diário e a coleção de clássicos. É o que dá motivo para voltar ao app.

// ---------- 1. Hora do bar ----------
// 'auto' acende sozinho das 18h às 6h; o usuário pode fixar dia ou noite.
function ehHoraDaNoite() {
  const h = new Date().getHours();
  return h >= 18 || h < 6;
}

function aplicarLuz() {
  const modo = Store.getLuz();
  const noite = modo === 'noite' || (modo === 'auto' && ehHoraDaNoite());
  document.body.classList.toggle('noite', noite);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', noite ? '#241C17' : '#FBFAF7');
  const btn = document.getElementById('btn-luz');
  if (btn) {
    btn.textContent = noite ? '☾' : '☀';
    btn.setAttribute('aria-label', noite ? 'Apagar as luzes da noite' : 'Acender a noite');
    btn.title = modo === 'auto' ? 'Luz automática — toque para fixar' : 'Luz fixa — toque para alternar';
  }
  return noite;
}

// auto → fixa o oposto do que está valendo → volta para auto
function alternarLuz() {
  const modo = Store.getLuz();
  const noiteAgora = document.body.classList.contains('noite');
  if (modo === 'auto') {
    Store.setLuz(noiteAgora ? 'dia' : 'noite');
    toast(noiteAgora ? 'Luzes acesas' : 'A noite chegou',
      'Toque de novo para voltar ao automático.', 'info');
  } else {
    Store.setLuz('auto');
    toast('Luz automática', 'A sala escurece sozinha a partir das 18h.', 'info');
  }
  aplicarLuz();
}

// ---------- 2. Drink do dia ----------
// Escolha estável no dia: muda à meia-noite, não a cada recarga.
function drinkDoDia() {
  const { ready } = matchRecipes();
  if (!ready.length) return null;
  const feitos = new Set(state.entries.map(e => e.receitaId).filter(Boolean));
  const inéditos = ready.filter(x => !feitos.has(x.receita.id));
  const pool = inéditos.length ? inéditos : ready;
  const hoje = new Date().toISOString().slice(0, 10);
  const semente = [...hoje].reduce((s, c) => s + c.charCodeAt(0), 0);
  const escolhido = pool[semente % pool.length];
  return { ...escolhido, inedito: inéditos.length > 0 };
}

function blocoDrinkDoDia() {
  // só na visão pessoal e sem filtro ativo — não atrapalha quem está buscando
  if (state.pessoaAtiva !== 'eu' || state.filtroTag !== 'todos' || state.buscaSugestao.trim()) return '';
  const d = drinkDoDia();
  if (!d) return '';
  const h = historiaDe(d.receita.id);
  const chamada = h?.curiosidade
    || (d.inedito ? 'Você ainda não fez este. Hoje é um bom dia.' : 'Um velho conhecido, sempre bem-vindo.');
  return `<button type="button" class="drink-dia" data-receita="${d.receita.id}">
    <span class="rotulo-dia">✦ Drink do dia</span>
    <h3>${esc(d.receita.nome)}</h3>
    <p>${chamada}</p>
  </button>`;
}

// ---------- 3. Efemérides ----------
function efemeride() {
  const agora = new Date();
  const diaMes = `${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;
  const anoAtual = agora.getFullYear();
  const antigos = state.entries
    .filter(e => e.data && e.data.slice(5) === diaMes && Number(e.data.slice(0, 4)) < anoAtual)
    .sort((a, b) => a.data.localeCompare(b.data));
  if (!antigos.length) return '';
  const e = antigos[0];
  const anos = anoAtual - Number(e.data.slice(0, 4));
  const primeiroDesse = state.entries
    .filter(x => x.nome.toLowerCase() === e.nome.toLowerCase())
    .sort((a, b) => (a.data || '').localeCompare(b.data || ''))[0];
  const foiOPrimeiro = primeiroDesse && primeiroDesse.id === e.id;
  return `<div class="efemeride">
    Há ${anos === 1 ? 'exatamente um ano' : `${anos} anos`} você
    ${foiOPrimeiro ? 'preparou seu primeiro' : 'estava bebendo um'}
    <strong>${esc(e.nome)}</strong>.${e.texto ? ` <em>“${esc(e.texto)}”</em>` : ''}
  </div>`;
}

// ---------- 4. Coleção de clássicos e passaporte ----------
// País de origem dos drinks com verbete — alimenta o passaporte.
const PAIS_DO_DRINK = {
  'negroni': 'Itália', 'boulevardier': 'França', 'americano': 'Itália',
  'aperol-spritz': 'Itália', 'bellini': 'Itália', 'hugo-spritz': 'Itália',
  'daiquiri': 'Cuba', 'mojito': 'Cuba', 'cuba-libre': 'Cuba',
  'caipirinha': 'Brasil', 'caipiroska': 'Brasil', 'caipifruta-morango': 'Brasil',
  'rabo-de-galo': 'Brasil', 'batida-de-coco': 'Brasil',
  'old-fashioned': 'Estados Unidos', 'manhattan': 'Estados Unidos',
  'martini-seco': 'Estados Unidos', 'moscow-mule': 'Estados Unidos',
  'cosmopolitan': 'Estados Unidos', 'penicillin': 'Estados Unidos',
  'tom-collins': 'Estados Unidos', 'whiskey-sour': 'Estados Unidos',
  'clover-club': 'Estados Unidos', 'tequila-sunrise': 'Estados Unidos',
  'white-russian': 'Estados Unidos', 'black-russian': 'Estados Unidos',
  'sex-on-the-beach': 'Estados Unidos',
  'espresso-martini': 'Inglaterra', 'bramble': 'Inglaterra', 'gimlet': 'Inglaterra',
  'gin-tonica': 'Inglaterra',
  'french-75': 'França', 'sidecar': 'França', 'bloody-mary': 'França',
  'kir-royale': 'França', 'mimosa': 'França',
  'margarita': 'México', 'paloma': 'México',
  'pina-colada': 'Porto Rico', 'irish-coffee': 'Irlanda',
  'dark-n-stormy': 'Bermudas', 'sangria': 'Espanha',
  'mai-tai': 'Estados Unidos', 'bees-knees': 'Estados Unidos',
  'gold-rush': 'Estados Unidos', 'appletini': 'Estados Unidos',
  'mule-de-gengibre': 'Estados Unidos', 'jungle-bird': 'Malásia',
  'spritz-de-tangerina': 'Itália', 'daiquiri-morango': 'Cuba',
  'floradora': 'Estados Unidos', 'mint-julep': 'Estados Unidos',
  'tommys-margarita': 'Estados Unidos', 'pornstar-martini': 'Inglaterra',
  'hot-toddy': 'Escócia', 'corn-n-oil': 'Barbados', 'espresso-tonica': 'Suécia',
  'paper-plane': 'Estados Unidos', 'naked-and-famous': 'Estados Unidos',
  'last-word': 'Estados Unidos', 'division-bell': 'Estados Unidos',
  'oaxaca-old-fashioned': 'Estados Unidos', 'old-cuban': 'Estados Unidos',
  'trinidad-sour': 'Estados Unidos', 'siesta': 'Estados Unidos',
  'eastside': 'Estados Unidos', 'sazerac': 'Estados Unidos',
  'aviation': 'Estados Unidos', 'hemingway-daiquiri': 'Cuba',
  'gin-basil-smash': 'Alemanha', 'pisco-sour': 'Peru',
  'corpse-reviver': 'Inglaterra',
  'screwdriver': 'Estados Unidos', 'cape-codder': 'Estados Unidos',
  'sea-breeze': 'Estados Unidos', 'bay-breeze': 'Estados Unidos',
  'woo-woo': 'Estados Unidos', 'fuzzy-navel': 'Estados Unidos',
  'malibu-abacaxi': 'Barbados', 'coco-limao': 'Brasil',
};

function statsColecao() {
  const feitos = new Set(state.entries.map(e => e.receitaId).filter(Boolean));
  const classicos = RECEITAS.filter(r => !r.custom);
  const paises = new Set();
  for (const id of feitos) if (PAIS_DO_DRINK[id]) paises.add(PAIS_DO_DRINK[id]);
  return { feitos, classicos, paises };
}

function renderColecao() {
  const alvo = $('#colecao');
  if (!alvo) return;
  const { feitos, classicos, paises } = statsColecao();
  const n = classicos.filter(r => feitos.has(r.id)).length;
  if (!state.entries.length) { alvo.innerHTML = ''; return; }

  const pct = Math.round((n / classicos.length) * 100);
  alvo.innerHTML = `
    <h2>Coleção</h2>
    <p class="dica">Você já preparou <strong data-conta="${n}">0</strong> dos
      ${classicos.length} clássicos — ${pct}% da carta.</p>
    <div class="barra-colecao"><i style="width:${pct}%"></i></div>
    ${paises.size ? `<p class="passaporte">🌍 Já bebeu em <strong>${paises.size}</strong>
      ${paises.size === 1 ? 'país' : 'países'} sem sair de casa:
      <em>${[...paises].sort().map(esc).join(', ')}</em>.</p>` : ''}
    <div class="grade-colecao">
      ${classicos.map(r => `<button class="peca ${feitos.has(r.id) ? 'feito' : ''}"
        data-receita="${r.id}" title="${esc(r.nome)}">${esc(r.nome)}</button>`).join('')}
    </div>`;
  const c = alvo.querySelector('[data-conta]');
  if (c) contarAte(c, Number(c.dataset.conta), 900);
}
