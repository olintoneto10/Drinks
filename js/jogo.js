// Gamificação — com uma regra que orienta tudo aqui:
//
// NADA neste arquivo recompensa beber mais. Não há sequência de dias, não há
// meta semanal, não há nada que gere culpa por pular uma noite. Um app de
// bebida que premia volume empurra o usuário na direção errada, e uma
// sequência de dias faz exatamente isso: transforma pular um dia em perda.
//
// O que se conta aqui é repertório, técnica e curiosidade: drinks DIFERENTES,
// países visitados, técnicas dominadas, rotas percorridas. Fazer a mesma
// caipirinha dez vezes não move nenhum número — e está tudo certo com isso.

const NIVEIS = [
  { min: 0, nome: 'Curioso' },
  { min: 3, nome: 'Aprendiz' },
  { min: 8, nome: 'Bartender de casa' },
  { min: 16, nome: 'Anfitrião' },
  { min: 28, nome: 'Bartender' },
  { min: 45, nome: 'Mestre de balcão' },
];

// Rotas: sequências que contam uma história quando bebidas em ordem
const ROTAS = [
  {
    id: 'negroni', nome: 'A árvore do Negroni',
    sobre: 'Um drink, duas mutações e um século de distância entre eles.',
    passos: ['americano', 'negroni', 'boulevardier'],
  },
  {
    id: 'partes-iguais', nome: 'A linhagem de partes iguais',
    sobre: 'Quatro drinks, quatro décadas, a mesma régua de medida.',
    passos: ['last-word', 'paper-plane', 'naked-and-famous', 'division-bell'],
  },
  {
    id: 'sour', nome: 'A escola do sour',
    sobre: 'Destilado, cítrico e açúcar. Entenda um e você entende metade da coquetelaria.',
    passos: ['daiquiri', 'whiskey-sour', 'margarita', 'pisco-sour'],
  },
  {
    id: 'brasil', nome: 'Volta ao Brasil',
    sobre: 'O que o país inventou com cachaça, fruta e leite condensado.',
    passos: ['caipirinha', 'caipifruta-morango', 'rabo-de-galo', 'batida-de-coco'],
  },
  {
    id: 'agave', nome: 'A rota do agave',
    sobre: 'Do mais direto ao mais defumado, na ordem em que fazem sentido.',
    passos: ['tommys-margarita', 'paloma', 'siesta', 'oaxaca-old-fashioned'],
  },
];

// ---------- Contexto que as conquistas leem ----------
function contextoDoJogo() {
  const feitos = new Set(state.entries.map(e => e.receitaId).filter(Boolean));
  const receitas = [...feitos].map(id => RECEITA_MAP[id]).filter(Boolean);
  const paises = new Set();
  for (const id of feitos) if (PAIS_DO_DRINK[id]) paises.add(PAIS_DO_DRINK[id]);
  const tags = new Set(receitas.flatMap(r => r.tags));
  const pessoas = new Set(state.entries.map(e => e.pessoaId).filter(p => p && p !== 'eu'));
  return {
    feitos, receitas, paises, tags, pessoas,
    entries: state.entries,
    comFoto: state.entries.filter(e => e.foto).length,
    autorais: receitas.filter(r => r.autoral).length,
    avancados: receitas.filter(r => nivelDaReceita(r) === 3).length,
  };
}

const CONQUISTAS = [
  { id: 'primeiro', icone: '🥂', nome: 'Primeiro brinde', sobre: 'Registrou o primeiro drink no diário.',
    testa: c => c.entries.length >= 1 },
  { id: 'cinco-drinks', icone: '📖', nome: 'Repertório', sobre: 'Cinco drinks diferentes preparados.',
    testa: c => c.feitos.size >= 5 },
  { id: 'quinze-drinks', icone: '📚', nome: 'Carta própria', sobre: 'Quinze drinks diferentes preparados.',
    testa: c => c.feitos.size >= 15 },
  { id: 'passaporte', icone: '🌍', nome: 'Passaporte', sobre: 'Drinks de cinco países diferentes.',
    testa: c => c.paises.size >= 5 },
  { id: 'volta-ao-mundo', icone: '✈️', nome: 'Volta ao mundo', sobre: 'Drinks de dez países diferentes.',
    testa: c => c.paises.size >= 10 },
  { id: 'clara', icone: '🥚', nome: 'Mão firme', sobre: 'Preparou um drink com clara de ovo.',
    testa: c => c.receitas.some(r => r.ing.some(i => i.id === 'ovo')) },
  { id: 'avancado', icone: '⚗️', nome: 'Técnica', sobre: 'Três drinks de nível avançado.',
    testa: c => c.avancados >= 3 },
  { id: 'autorais', icone: '✎', nome: 'Contemporâneo', sobre: 'Três drinks autorais preparados.',
    testa: c => c.autorais >= 3 },
  { id: 'amargo', icone: '🍊', nome: 'Paladar de aperitivo', sobre: 'Aprendeu a gostar de amargo.',
    testa: c => c.tags.has('amargo') },
  { id: 'sem-alcool', icone: '🌿', nome: 'Bar para todos', sobre: 'Três drinks sem álcool preparados.',
    testa: c => c.receitas.filter(r => r.tags.includes('sem-alcool')).length >= 3 },
  { id: 'anfitriao', icone: '👥', nome: 'Anfitrião', sobre: 'Serviu três pessoas diferentes.',
    testa: c => c.pessoas.size >= 3 },
  { id: 'fotografo', icone: '📷', nome: 'Bebe pelos olhos', sobre: 'Cinco registros com foto.',
    testa: c => c.comFoto >= 5 },
  { id: 'autor', icone: '✍️', nome: 'Receita da casa', sobre: 'Criou uma receita própria.',
    testa: () => RECEITAS.some(r => r.custom) },
  { id: 'colecionador', icone: '🏛️', nome: 'Colecionador', sobre: 'Um quarto do cardápio preparado.',
    testa: c => c.feitos.size >= Math.ceil(RECEITAS.filter(r => !r.custom).length / 4) },
];

function nivelDoBar(distintos) {
  let atual = NIVEIS[0], proximo = null;
  for (const n of NIVEIS) {
    if (distintos >= n.min) atual = n;
    else { proximo = proximo || n; }
  }
  return { atual, proximo };
}

function progressoRota(rota, feitos) {
  const feitosNaRota = rota.passos.filter(id => feitos.has(id));
  return { feitos: feitosNaRota.length, total: rota.passos.length };
}

// ---------- Render ----------
function renderJogo() {
  const alvo = $('#jogo');
  if (!alvo) return;
  const c = contextoDoJogo();
  const { atual, proximo } = nivelDoBar(c.feitos.size);
  const ganhas = CONQUISTAS.filter(x => x.testa(c));

  const faltamPro = proximo ? proximo.min - c.feitos.size : 0;
  const legenda = proximo
    ? `${faltamPro} ${faltamPro === 1 ? 'drink novo' : 'drinks novos'} para ${proximo.nome}`
    : 'Você chegou ao fim da escala. Agora é só repertório.';

  const selos = CONQUISTAS.map(x => {
    const tem = x.testa(c);
    return `<li class="selo ${tem ? 'tem' : ''}" title="${esc(x.sobre)}">
      <span class="selo-icone">${x.icone}</span>
      <span class="selo-nome">${esc(x.nome)}</span>
      <span class="selo-sobre">${esc(x.sobre)}</span>
    </li>`;
  }).join('');

  const rotas = ROTAS.map(r => {
    const p = progressoRota(r, c.feitos);
    const completa = p.feitos === p.total;
    const marcas = r.passos.map(id => {
      const rec = RECEITA_MAP[id];
      const ok = c.feitos.has(id);
      return `<li class="${ok ? 'ok' : ''}">${ok ? '✓' : '○'} ${esc(rec ? rec.nome : id)}</li>`;
    }).join('');
    return `<div class="rota ${completa ? 'completa' : ''}">
      <div class="rota-topo">
        <h3>${esc(r.nome)}</h3>
        <span class="rota-conta">${p.feitos}/${p.total}</span>
      </div>
      <p class="dica">${esc(r.sobre)}</p>
      <ul class="rota-passos">${marcas}</ul>
    </div>`;
  }).join('');

  alvo.innerHTML = `
    <h2>Seu balcão</h2>
    <div class="nivel">
      <span class="nivel-nome">${esc(atual.nome)}</span>
      <span class="nivel-conta">${c.feitos.size} ${c.feitos.size === 1 ? 'drink diferente' : 'drinks diferentes'}</span>
      <p class="dica">${esc(legenda)}</p>
    </div>
    <p class="dica nota-jogo">Só contam drinks <em>diferentes</em>. Repetir o
      favorito não move número nenhum aqui — e não deveria mesmo.</p>

    <h2>Conquistas <span class="badge">${ganhas.length}/${CONQUISTAS.length}</span></h2>
    <ul class="selos">${selos}</ul>

    <h2>Rotas</h2>
    <p class="dica">Sequências que contam uma história quando bebidas em ordem.</p>
    ${rotas}`;
}
