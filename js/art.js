// Ilustrações dos drinks em SVG: o copo certo, a cor real do líquido, gelo,
// guarnição e o reflexo do vidro. Leves, offline, sem licença de terceiro.
//
// A cor não é mais uma tabela à mão para cada receita — isso cobria 47 de 198 e
// deixava o resto num laranja genérico. Agora ela é calculada a partir dos
// ingredientes, com as clássicas ainda podendo sobrescrever o cálculo.

// ---------- Cor por ingrediente ----------
// peso = quanto o ingrediente domina a mistura. Destilado claro quase não
// pinta; Campari pinta quase sozinho.
const COR_ING = {
  // corantes fortes
  campari: ['#C8321E', 3], aperol: ['#E8621F', 3], grenadine: ['#C41E3A', 3],
  'vinho-tinto': ['#6E1220', 3], 'cafe-espresso': ['#3A2418', 3],
  'licor-cafe': ['#3E2519', 3], 'refrigerante-cola': ['#4A2A14', 3],
  'suco-tomate': ['#C43520', 3], 'licor-menta': ['#3FA06A', 3],
  'curacau-azul': ['#1E6FC4', 3], 'xarope-maca-verde': ['#7EC832', 3],
  'chartreuse-verde': ['#86A81E', 3], 'licor-cassis': ['#6A1E4A', 3],
  'xarope-morango': ['#D8324A', 3], 'xarope-framboesa': ['#C4285A', 3],
  fernet: ['#33200F', 3],
  // médios
  'rum-escuro': ['#8A5024', 2.5], 'licor-cacau': ['#4A2E1E', 2.5],
  'chartreuse-amarelo': ['#D9BE3C', 2.5], amaro: ['#6A3A1E', 2.5],
  'xarope-caramelo': ['#A86A2A', 2.5], 'suco-cranberry': ['#C42848', 2.5],
  'suco-laranja': ['#F0A028', 2], 'suco-abacaxi': ['#F0D048', 2],
  'suco-toranja': ['#F0A090', 2], maracuja: ['#F0C040', 2],
  'vermute-tinto': ['#8A3820', 2], whisky: ['#C88A3C', 2], bourbon: ['#C88A3C', 2],
  conhaque: ['#C07A32', 2], xerez: ['#D8A860', 2], cerveja: ['#E8B23C', 2],
  'cha-preto': ['#A06A38', 2], 'xarope-canela': ['#A0642E', 2],
  'xarope-tangerina': ['#F09030', 2], 'xarope-maracuja': ['#F0C040', 2],
  'licor-pessego': ['#F0B070', 2], melancia: ['#F06878', 2], morango: ['#E04858', 2],
  kiwi: ['#A8D048', 2], caju: ['#F0B838', 2], amaretto: ['#C88448', 2],
  maraschino: ['#EFE8D4', 1.5], 'licor-laranja': ['#E8B860', 1.5],
  mel: ['#E0A83C', 1.5], 'ginger-beer': ['#E8C878', 1.5], abacaxi: ['#F0D048', 1.5],
  'licor-coco': ['#F8F4EC', 1.5], pessego: ['#F4C088', 1.5],
  // cremes: pintam de claro com força
  'leite-de-coco': ['#FAF4E8', 2], 'creme-de-leite': ['#FBF6EC', 2],
  'leite-condensado': ['#FAF0DC', 2],
  // quase transparentes
  espumante: ['#F4E8B8', 1.2], 'vinho-branco': ['#F0E8B0', 1.2],
  'vermute-seco': ['#F0EAC8', 1.2], 'agua-tonica': ['#F0F6F8', .7],
  'agua-com-gas': ['#F0F6F8', .7], 'refrigerante-limao': ['#F0F8E0', .7],
  'limonada-rosa': ['#F27B92', 1.6],
  'agua-de-coco': ['#F4F8F0', .7], limao: ['#E8F0C0', .5],
  'xarope-simples': ['#F4F0E0', .4], 'xarope-agave': ['#D8B060', 1],
  'xarope-orgeat': ['#F4EADC', 1], 'xarope-falernum': ['#F0E4C0', 1],
  hortela: ['#9FCE72', 1.4], pepino: ['#CFE8C0', .8], manjericao: ['#8FBE60', 1.2],
  gengibre: ['#EEE0B8', .8], 'xarope-gengibre': ['#EAD8A8', 1.2],
  'xarope-baunilha': ['#F4E8CC', 1],
  gin: ['#F2F4F0', .3], vodka: ['#F4F6F4', .3], 'rum-branco': ['#F4F4EE', .3],
  tequila: ['#F4F4E8', .3], cachaca: ['#F4F4EA', .3], saque: ['#F6F6F2', .3],
  pisco: ['#F4F4EE', .3], mezcal: ['#F2F2E6', .3], absinto: ['#DCE8B8', .5],
};

// Sobrescritas à mão: onde o cálculo não acerta o que a memória espera ver.
const CORES_DRINK = {
  'negroni': ['#d94f2b', '#a8321f'],
  'martini-seco': ['#eff3f4', '#dce8ea'],
  'espresso-martini': ['#6a4530', '#3a2418'],
  'black-russian': ['#4a3020', '#2a1a10'],
  'pina-colada': ['#f4eeda', '#e8dcbc'],
  'batida-de-coco': ['#f8f4e8', '#ece2cc'],
  'irish-coffee': ['#7a4c2e', '#42291a'],
  'bramble': ['#b05a8a', '#6a2a56'],
  'sangria': ['#a8283c', '#6a1424'],
  'cuba-libre': ['#8a5a30', '#5a3618'],
  'blue-hawaii': ['#4aa8dc', '#1e6fb4'],
  'grasshopper': ['#8fd0a8', '#5aa87e'],
};

const hexParaRGB = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgbParaHex = ([r, g, b]) => '#' + [r, g, b]
  .map(v => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');
const clarear = (rgb, f) => rgb.map(v => v + (255 - v) * f);
const escurecerRGB = (rgb, f) => rgb.map(v => v * (1 - f));

// Misturar cores em RGB puxa tudo para o cinza — o Mojito saía bege. Afasta-se
// cada canal da média para devolver a saturação que a mistura comeu.
function realcar(rgb, f) {
  const media = (rgb[0] + rgb[1] + rgb[2]) / 3;
  return rgb.map(v => media + (v - media) * f);
}

// Média ponderada das cores dos ingredientes presentes.
// `semCamada` é o que já foi desenhado como camada separada no fundo do copo:
// contá-lo de novo na média tingiria o drink inteiro, e a Tequila Sunrise
// saía vermelha em vez de laranja com fundo vermelho.
function corDoDrink(receita, semCamada = null) {
  if (CORES_DRINK[receita.id]) return CORES_DRINK[receita.id];
  let soma = [0, 0, 0], peso = 0;
  for (const i of receita.ing) {
    if (i.id === semCamada) continue;
    const entrada = COR_ING[i.id];
    if (!entrada) continue;
    const [hex, p] = entrada;
    const rgb = hexParaRGB(hex);
    for (let k = 0; k < 3; k++) soma[k] += rgb[k] * p;
    peso += p;
  }
  if (!peso) return ['#e8a13c', '#c0563c'];
  const media = realcar(soma.map(v => v / peso), 1.7);
  return [rgbParaHex(clarear(media, .10)), rgbParaHex(escurecerRGB(media, .22))];
}

// ---------- Copos ----------
// centro e meia-largura do líquido em cada altura, para posicionar gelo e espuma
const COPOS = {
  rocks: {
    topo: 36, nivel: 52, fundo: 77, meia: 15, comGelo: true,
    glass: 'M32 36 L34 80 L66 80 L68 36',
    liquid: 'M34.5 52 L35.5 77.5 L64.5 77.5 L65.5 52 Z',
    brilho: 'M37 40 L38.6 76',
  },
  highball: {
    topo: 24, nivel: 36, fundo: 77, meia: 11, comGelo: true,
    glass: 'M36 24 L38 80 L62 80 L64 24',
    liquid: 'M38.2 36 L39.7 77.5 L60.3 77.5 L61.8 36 Z',
    brilho: 'M40.5 30 L42 75',
  },
  martini: {
    topo: 28, nivel: 32, fundo: 52, meia: 19,
    glass: 'M26 28 L74 28 L50 55 Z M50 55 L50 78 M36 80 L64 80',
    liquid: 'M31 31.5 L69 31.5 L50 52.5 Z',
    brilho: 'M34 32 L47 46',
  },
  coupe: {
    topo: 30, nivel: 33, fundo: 51, meia: 19,
    glass: 'M28 30 C30 48 40 54 50 54 C60 54 70 48 72 30 M50 54 L50 78 M36 80 L64 80',
    liquid: 'M30.5 33 C33 47 42 51.5 50 51.5 C58 51.5 67 47 69.5 33 Z',
    brilho: 'M33 34 C35 45 40 49 45 50',
  },
  flute: {
    topo: 22, nivel: 26, fundo: 55, meia: 5.4,
    glass: 'M43 22 C42 46 46 56 50 58 C54 56 58 46 57 22 M50 58 L50 78 M38 80 L62 80',
    liquid: 'M44.6 26 C44 45 47.5 54 50 55.5 C52.5 54 56 45 55.4 26 Z',
    brilho: 'M46 28 C45.6 44 47.5 51 49 53',
  },
  wine: {
    topo: 26, nivel: 32, fundo: 54, meia: 16.5, comGelo: true,
    glass: 'M31 26 C31 46 38 56 50 57 C62 56 69 46 69 26 M50 57 L50 78 M36 80 L64 80',
    liquid: 'M33.5 32 C34.5 46 41 53.5 50 54.4 C59 53.5 65.5 46 66.5 32 Z',
    brilho: 'M36 33 C37 45 41 51 46 53',
  },
  mug: {
    topo: 30, nivel: 38, fundo: 75, meia: 13.5,
    glass: 'M34 30 L34 78 L66 78 L66 30 M66 40 C77 40 77 62 66 62',
    liquid: 'M36.5 38 L36.5 75.5 L63.5 75.5 L63.5 38 Z',
    brilho: 'M39 42 L39 73',
  },
};

function copoDoDrink(copo) {
  const c = (copo || '').toLowerCase();
  if (c.includes('baixo')) return COPOS.rocks;
  if (c.includes('alto')) return COPOS.highball;
  if (c.includes('martini')) return COPOS.martini;
  if (c.includes('coupé') || c.includes('coupe') || c.includes('margarita')) return COPOS.coupe;
  if (c.includes('flute')) return COPOS.flute;
  if (c.includes('caneca')) return COPOS.mug;
  return COPOS.wine;
}

// ---------- Peças ----------
// Gelo só onde o gelo fica no copo: taça servida "up" e caneca quente não levam.
function desenharGelo(receita, copo) {
  if (!copo.comGelo) return '';
  const g = receita.ing.find(i => i.id === 'gelo');
  if (!g) return '';
  const q = (g.q || '').toLowerCase();
  if (q.includes('bater') || q.includes('mexer')) return ''; // fica na coqueteleira

  const meio = (copo.nivel + copo.fundo) / 2;
  if (q.includes('tritur') || q.includes('picado')) {
    let pedras = '';
    for (let n = 0; n < 7; n++) {
      const x = 40 + (n % 3) * 7 + (n % 2) * 2;
      const y = copo.nivel + 4 + Math.floor(n / 3) * 8 + (n % 2) * 3;
      pedras += `<rect x="${x}" y="${y}" width="5" height="5" rx="1.2"
        fill="#fff" opacity="${0.3 - (n % 3) * 0.04}" transform="rotate(${n * 23} ${x + 2.5} ${y + 2.5})"/>`;
    }
    return pedras;
  }
  if (q.includes('pedra grande')) {
    return `<rect x="43" y="${meio - 7}" width="14" height="14" rx="2.5"
      fill="#fff" opacity="0.26" transform="rotate(10 50 ${meio})"/>`;
  }
  return `<rect x="41" y="${copo.nivel + 4}" width="10" height="10" rx="2"
      fill="#fff" opacity="0.24" transform="rotate(8 46 ${copo.nivel + 9})"/>
    <rect x="52" y="${copo.nivel + 11}" width="9" height="9" rx="2"
      fill="#fff" opacity="0.18" transform="rotate(-12 56 ${copo.nivel + 15})"/>`;
}

// Espuma de clara batida ou camada de creme
function desenharEspuma(receita, copo) {
  const ids = receita.ing.map(i => i.id);
  const temClara = ids.includes('ovo');
  const temCreme = ['creme-de-leite', 'leite-condensado'].some(x => ids.includes(x));
  if (!temClara && !temCreme) return '';
  const y = copo.nivel + 1;
  const rx = copo.meia * 0.92;
  return `<ellipse cx="50" cy="${y}" rx="${rx.toFixed(1)}" ry="${(rx * 0.2).toFixed(1)}"
    fill="#FBF5E6" opacity="${temClara ? 0.95 : 0.85}"/>`;
}

// A granadina é mais densa que suco e afunda — é isso que faz o degradê do
// Sunrise. Só vale onde há altura para a camada aparecer.
function temCamadaFundo(receita, copo) {
  return copo.comGelo && copo.fundo - copo.nivel > 20
    && receita.ing.some(i => i.id === 'grenadine');
}

function desenharCamada(receita, copo) {
  if (!temCamadaFundo(receita, copo)) return '';
  const alturaTotal = copo.fundo - copo.nivel;
  const y = copo.fundo - alturaTotal * 0.34;
  return `<path d="M${50 - copo.meia * 0.94} ${y} L${50 - copo.meia} ${copo.fundo}
    L${50 + copo.meia} ${copo.fundo} L${50 + copo.meia * 0.94} ${y} Z"
    fill="#C41E3A" opacity="0.55"/>`;
}

const GUARNICOES = {
  hortela: t => `<ellipse cx="61" cy="${t - 4}" rx="5" ry="2.6" fill="#7fb069" transform="rotate(-28 61 ${t - 4})"/>
    <ellipse cx="67" cy="${t - 7}" rx="5" ry="2.6" fill="#699a56" transform="rotate(24 67 ${t - 7})"/>`,
  manjericao: t => `<ellipse cx="62" cy="${t - 4}" rx="5.5" ry="3.4" fill="#5f9648" transform="rotate(-22 62 ${t - 4})"/>
    <ellipse cx="68" cy="${t - 8}" rx="4.6" ry="2.9" fill="#4f8039" transform="rotate(28 68 ${t - 8})"/>`,
  laranja: t => `<circle cx="66" cy="${t}" r="6" fill="#f2a03c"/><circle cx="66" cy="${t}" r="3.4" fill="#f8c878"/>`,
  limao: t => `<circle cx="66" cy="${t}" r="6" fill="#b8d47e"/><circle cx="66" cy="${t}" r="3.4" fill="#e0eebc"/>`,
  'suco-toranja': t => `<circle cx="66" cy="${t}" r="6" fill="#f0968a"/><circle cx="66" cy="${t}" r="3.4" fill="#f8c2b6"/>`,
  morango: t => `<path d="M65 ${t - 5} L69.5 ${t - 1} L65 ${t + 4} L60.5 ${t - 1} Z" fill="#d43f4e"/>
    <path d="M62 ${t - 5.5} L68 ${t - 5.5}" stroke="#5f9648" stroke-width="2" stroke-linecap="round"/>`,
  melancia: t => `<path d="M60 ${t - 4} A6.5 6.5 0 0 0 72 ${t - 4} Z" fill="#f0687a"/>
    <path d="M60 ${t - 4} A6.5 6.5 0 0 0 72 ${t - 4}" stroke="#5f9648" stroke-width="1.8" fill="none"/>`,
  abacaxi: t => `<path d="M61 ${t - 4} L70 ${t - 4} L67 ${t + 3} L64 ${t + 3} Z" fill="#f2d465"/>
    <path d="M63 ${t - 5} L65 ${t - 9} M66 ${t - 5} L68 ${t - 9}" stroke="#5f9648" stroke-width="1.6" stroke-linecap="round"/>`,
  pepino: t => `<ellipse cx="65" cy="${t - 2}" rx="3" ry="7" fill="#cfe6b4" transform="rotate(22 65 ${t - 2})"/>
    <ellipse cx="65" cy="${t - 2}" rx="1.6" ry="5" fill="#e8f2d8" transform="rotate(22 65 ${t - 2})"/>`,
  maraschino: t => `<circle cx="66" cy="${t + 1}" r="4.2" fill="#c0223c"/>
    <path d="M66 ${t - 3} L66 ${t - 8}" stroke="#5f9648" stroke-width="1.4" stroke-linecap="round"/>`,
  'cafe-espresso': t => `<ellipse cx="64" cy="${t - 1}" rx="2.6" ry="3.6" fill="#4a2f1c" transform="rotate(18 64 ${t - 1})"/>
    <ellipse cx="69" cy="${t - 3}" rx="2.6" ry="3.6" fill="#3a2416" transform="rotate(-14 69 ${t - 3})"/>`,
  'xarope-canela': t => `<rect x="62" y="${t - 8}" width="3" height="13" rx="1.5" fill="#a0642e" transform="rotate(16 63.5 ${t - 1})"/>`,
  gengibre: t => `<path d="M61 ${t} q4 -6 8 -2 q3 3 -1 5 q-4 2 -7 -3 Z" fill="#e0c890"/>`,
  kiwi: t => `<circle cx="66" cy="${t}" r="6" fill="#8ab83c"/><circle cx="66" cy="${t}" r="3.2" fill="#dcecb0"/>`,
  maracuja: t => `<path d="M60.5 ${t - 4} A6 6 0 0 0 71.5 ${t - 4} Z" fill="#f0c040"/>
    <path d="M60.5 ${t - 4} A6 6 0 0 0 71.5 ${t - 4}" stroke="#a8721e" stroke-width="1.6" fill="none"/>`,
};

// Ordem de prioridade: o que a receita usa como enfeite, não como base
const ORDEM_GUARNICAO = ['hortela', 'manjericao', 'maraschino', 'morango', 'melancia',
  'kiwi', 'abacaxi', 'maracuja', 'pepino', 'gengibre', 'xarope-canela',
  'cafe-espresso', 'suco-toranja', 'laranja', 'limao'];

function desenharGuarnicao(receita, copo) {
  const ids = new Set(receita.ing.map(i => i.id));
  for (const chave of ORDEM_GUARNICAO) {
    if (ids.has(chave)) return GUARNICOES[chave](copo.topo);
  }
  return '';
}

// Sal na borda, quando a receita pede
function desenharBorda(receita, copo) {
  const sal = receita.ing.find(i => i.id === 'sal');
  if (!sal || !/borda/i.test(sal.q || '')) return '';
  const meia = copo === COPOS.rocks ? 18 : copo === COPOS.highball ? 14 : 24;
  return `<path d="M${50 - meia} ${copo.topo} L${50 + meia} ${copo.topo}"
    stroke="#fff" stroke-width="3.4" stroke-linecap="round" opacity="0.75"
    stroke-dasharray="1 2.6"/>`;
}

function svgDrink(receita, tamanho = 76) {
  const copo = copoDoDrink(receita.copo);
  const [c1, c2] = corDoDrink(receita, temCamadaFundo(receita, copo) ? 'grenadine' : null);
  const gid = `g-${receita.id}`;
  const ids = receita.ing.map(i => i.id);

  let deco = desenharCamada(receita, copo) + desenharGelo(receita, copo);

  // Bolhas para drinks gaseificados
  if (['espumante', 'agua-com-gas', 'agua-tonica', 'ginger-beer', 'refrigerante-cola',
       'refrigerante-limao', 'cerveja'].some(x => ids.includes(x))) {
    const b = (cx, cy, r, o, i) =>
      `<circle class="bolha-viva" cx="${cx}" cy="${cy}" r="${r}" fill="#fff" opacity="${o}"/>`;
    const y0 = copo.nivel + 6;
    deco += b(50 - copo.meia * .3, y0 + 4, 1.7, .45)
          + b(50 + copo.meia * .3, y0 + 12, 1.4, .4)
          + b(50 - copo.meia * .05, y0 + 20, 1.7, .35);
  }
  deco += desenharEspuma(receita, copo);

  return `<svg viewBox="0 0 100 100" width="${tamanho}" height="${tamanho}" role="img" aria-label="Ilustração: ${receita.nome}">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
      </linearGradient>
      <clipPath id="c-${receita.id}"><path d="${copo.liquid}"/></clipPath>
    </defs>
    <path d="${copo.liquid}" fill="url(#${gid})"/>
    <g clip-path="url(#c-${receita.id})">${deco}</g>
    <path class="copo-traco" d="${copo.glass}" fill="none" stroke="#201D1A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="copo-brilho" d="${copo.brilho}" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity="0.52"/>
    ${desenharBorda(receita, copo)}
    ${desenharGuarnicao(receita, copo)}
  </svg>`;
}
