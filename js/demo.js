// Especialista sem chave: um bartender local, que responde do catálogo.
//
// A aba era uma porta trancada. Pedia uma chave da API da Anthropic — coisa que
// quase ninguém tem, e que ninguém vai criar para experimentar um app de drinks
// — e não mostrava nada do que havia atrás. Quem entrava via um formulário e
// saía. A funcionalidade mais cara de explicar era a única invisível.
//
// Aqui a aba responde de cara, sem chave e sem rede, com o que dá para responder
// sem IA: procurar no acervo por sabor, por ingrediente, por pessoa e pelo que
// já dá para fazer hoje. Não é a IA e não finge ser — cada resposta é montada
// por regra, e o rodapé diz o que a versão com chave faz que esta não faz.

const DEMO_MAX = 3;

// Como as pessoas realmente escrevem. À esquerda o que se digita, à direita a
// tag do catálogo. Sem acento: a normalização acontece antes da comparação.
const DEMO_SINONIMOS = {
  citrico: 'citrico', acido: 'citrico', azedo: 'citrico', limao: 'citrico',
  doce: 'doce', adocicado: 'doce', docinho: 'doce',
  amargo: 'amargo', amarga: 'amargo', bitter: 'amargo',
  seco: 'seco', seca: 'seco', dry: 'seco',
  refrescante: 'refrescante', refresco: 'refrescante', leve: 'refrescante',
  gelado: 'refrescante', calor: 'refrescante', verao: 'refrescante',
  cremoso: 'cremoso', cremosa: 'cremoso', creme: 'cremoso',
  frutado: 'frutado', fruta: 'frutado', frutas: 'frutado',
  forte: 'forte', alcoolico: 'forte', puxado: 'forte', pesado: 'forte',
  quente: 'quente', inverno: 'quente', frio: 'quente',
  tropical: 'tropical', praia: 'tropical', verao_tropical: 'tropical',
  salgado: 'salgado', salgada: 'salgado', salino: 'salgado',
};

// Frases inteiras que valem por uma restrição — "sem álcool" não é uma palavra.
const DEMO_SEM_ALCOOL = ['sem alcool', 'nao alcoolico', 'zero alcool', 'sem bebida alcoolica',
  'nao bebe', 'nao pode beber', 'gravida', 'dirigindo', 'de carro', 'mocktail', 'virgem'];

const DEMO_AGORA = ['posso fazer', 'consigo fazer', 'da para fazer', 'tenho em casa',
  'com o que eu tenho', 'com o que tenho', 'agora', 'hoje'];

const semAcentoDemo = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// ---------- Leitura da pergunta ----------
function lerPergunta(texto) {
  const t = semAcentoDemo(texto.toLowerCase());
  const palavras = t.split(/[^a-z0-9-]+/).filter(Boolean);

  const tags = new Set();
  for (const p of palavras) if (DEMO_SINONIMOS[p]) tags.add(DEMO_SINONIMOS[p]);
  const semAlcool = DEMO_SEM_ALCOOL.some(f => t.includes(f));
  if (semAlcool) tags.delete('forte');

  // Ingredientes: casa pelo nome do catálogo, do mais longo para o mais curto,
  // para "rum escuro" ganhar de "rum" quando os dois cabem na frase.
  // Só como palavra inteira: "dirigindo" contém "gin", e quem avisa que vai
  // dirigir está pedindo o contrário de um gin tônica.
  const ings = [];
  const porTamanho = [...INGREDIENTES].sort((a, b) => b.nome.length - a.nome.length);
  for (const i of porTamanho) {
    const nome = semAcentoDemo(i.nome.toLowerCase());
    if (nome.length < 3 || ings.includes(i.id)) continue;
    const alvo = nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // O "s?" final aceita o plural que todo mundo escreve: "tenho morangos".
    if (new RegExp(`(^|[^a-z0-9])${alvo}s?($|[^a-z0-9])`).test(t)) ings.push(i.id);
  }

  // Pessoas cadastradas: "algo para a Marília" tem resposta melhor que a genérica.
  const pessoa = (typeof state !== 'undefined' ? state.pessoas : [])
    .filter(p => p.id !== 'eu' && p.nome.length >= 3)
    .find(p => t.includes(semAcentoDemo(p.nome.toLowerCase())));

  return {
    tags,
    ings,
    semAlcool,
    pessoa,
    soAgora: DEMO_AGORA.some(f => t.includes(f)),
    surpresa: /surpree|aleator|qualquer|tanto faz|me indica|sugere|sugestao/.test(t),
    vazia: !tags.size && !ings.length && !semAlcool && !pessoa,
  };
}

// ---------- Escolha das receitas ----------
function escolherDemo(p) {
  const bar = typeof state !== 'undefined' ? state.bar : new Set();
  const evita = new Set(p.pessoa?.evita || []);
  if (p.semAlcool) evita.add('alcool');
  // Quando a pergunta cita alguém, o gosto dessa pessoa entra como pedido.
  const tags = new Set([...p.tags, ...(p.pessoa?.tags || [])]);

  const candidatos = [];
  for (const r of RECEITAS) {
    if (violaRestricao(r, evita)) continue;
    if (p.ings.length && !p.ings.every(id => r.ing.some(i => i.id === id))) continue;
    // Combina as tags entre si, como os filtros da aba Sugestões: quem pediu
    // cítrico e forte quer as duas coisas, não uma lista de cada.
    if (tags.size && ![...tags].every(t => r.tags.includes(t))) continue;
    const faltam = r.ing
      .filter(i => !i.opcional && !BASICOS.has(i.id) && !bar.has(i.id))
      .map(i => i.id);
    if (p.soAgora && faltam.length) continue;
    candidatos.push({ receita: r, faltam });
  }

  // Sem casamento exato, afrouxa para "pelo menos uma das tags" antes de
  // devolver nada — tela vazia é a pior resposta possível a uma pergunta.
  let afrouxou = false;
  if (!candidatos.length && tags.size > 1) {
    afrouxou = true;
    for (const r of RECEITAS) {
      if (violaRestricao(r, evita)) continue;
      if (p.ings.length && !p.ings.every(id => r.ing.some(i => i.id === id))) continue;
      if (![...tags].some(t => r.tags.includes(t))) continue;
      const faltam = r.ing
        .filter(i => !i.opcional && !BASICOS.has(i.id) && !bar.has(i.id))
        .map(i => i.id);
      candidatos.push({ receita: r, faltam });
    }
  }

  // Ordem: o que dá para fazer agora vem primeiro; depois o que combina com o
  // gosto aprendido no diário. Só na pergunta sem rumo o sorteio manda.
  const pesos = typeof tasteProfile === 'function' ? tasteProfile(p.pessoa?.id || 'eu') : {};
  candidatos.forEach(c => {
    c.score = c.receita.tags.reduce((s, t) => s + (pesos[t] || 0), 0);
    if (p.surpresa || p.vazia) c.score += Math.random() * 6;
  });
  candidatos.sort((a, b) => a.faltam.length - b.faltam.length || b.score - a.score);
  return { lista: candidatos.slice(0, DEMO_MAX), total: candidatos.length, afrouxou };
}

// ---------- Redação da resposta ----------
function fichaDemo(c) {
  const r = c.receita;
  const ing = r.ing
    .map(i => `   • ${ING_MAP[i.id]?.nome || i.id} — ${i.q}${i.opcional ? ' (opcional)' : ''}`)
    .join('\n');
  const falta = c.faltam.length
    ? `\n   Falta na sua estante: ${c.faltam.map(id => ING_MAP[id]?.nome || id).join(', ')}.`
    : '\n   Você tem tudo para este agora.';
  const h = typeof historiaDe === 'function' ? historiaDe(r.id) : null;
  // A curiosidade é o que um bartender diria ao entregar o copo. Só entra
  // quando cabe numa linha — resposta de chat não é verbete.
  const nota = h?.curiosidade && h.curiosidade.length <= 160 ? `\n   ${h.curiosidade}` : '';
  return `${r.nome} (${r.copo})\n${ing}\n   Preparo: ${r.preparo}${falta}${nota}`;
}

function responderDemo(texto) {
  const p = lerPergunta(texto);
  const { lista, total, afrouxou } = escolherDemo(p);

  if (!lista.length) {
    const pedido = [...p.tags].map(t => TAG_NOMES[t] || t).join(' + ');
    const comIng = p.ings.map(id => ING_MAP[id]?.nome || id).join(' + ');
    return `Não achei nada no acervo que junte ${[pedido, comIng].filter(Boolean).join(' com ') || 'isso'}.\n\n` +
      'Tente com menos condições de uma vez — "algo cítrico", "o que faço com gin" — ou ' +
      'procure o ingrediente direto na busca da aba Sugestões.\n\n' + RODAPE_DEMO;
  }

  const abertura = aberturaDemo(p, total, afrouxou);
  return `${abertura}\n\n${lista.map(fichaDemo).join('\n\n')}\n\n${RODAPE_DEMO}`;
}

function aberturaDemo(p, total, afrouxou) {
  const quantos = total > DEMO_MAX ? `Achei ${total} — estes são os três que eu levaria:` : null;
  if (afrouxou) {
    return 'Nada casa com tudo que você pediu de uma vez, então soltei um pouco: ' +
      'estes atendem pelo menos uma parte.';
  }
  if (p.pessoa) {
    const gosta = (p.pessoa.tags || []).map(t => (TAG_NOMES[t] || t).toLowerCase());
    const naoPode = (p.pessoa.evita || []).map(t => (EVITA_NOMES[t] || TAG_NOMES[t] || t).toLowerCase());
    const perfil = [
      gosta.length ? `gosta de ${gosta.join(', ')}` : '',
      naoPode.length ? `evita ${naoPode.join(', ')}` : '',
    ].filter(Boolean).join(' e ');
    return `Para ${p.pessoa.nome}${perfil ? ` (${perfil})` : ''}:`;
  }
  if (p.semAlcool) return 'Sem álcool nenhum, e sem virar refrigerante com guarda-chuva:';
  if (p.soAgora) return quantos || 'Com o que você tem em casa agora:';
  if (p.ings.length) {
    const nomes = p.ings.map(id => ING_MAP[id]?.nome || id).join(' e ');
    return `Com ${nomes}${quantos ? ` — ${total} no acervo, estes três primeiro:` : ':'}`;
  }
  if (p.vazia) return 'Não entendi bem o pedido, então vou de escolha da casa:';
  return quantos || 'O que eu serviria:';
}

const RODAPE_DEMO =
  '— Isto é a demonstração: eu procuro no acervo de 199 receitas por sabor, ' +
  'ingrediente e pessoa. Não sou a IA. Com sua chave da API da Anthropic, ' +
  'o especialista de verdade inventa receita nova, improvisa com o que sobrou ' +
  'na geladeira e conversa de fato.';

// Perguntas de exemplo, para a aba não abrir com um campo em branco. Rodam no
// mesmo interpretador — o que está escrito aqui é o que ele entende de verdade.
const DEMO_EXEMPLOS = [
  'algo cítrico e refrescante',
  'o que faço com gin?',
  'sem álcool, por favor',
  'o que dá para fazer agora?',
  'me surpreende',
];
