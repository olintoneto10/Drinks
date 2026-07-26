// Ilustrações dos drinks em SVG: a taça certa, as cores da bebida,
// guarnição e bolhas — leves, offline e com identidade própria.

const CORES_DRINK = {
  'caipirinha': ['#d8e8b0', '#b8d47e'],
  'caipiroska': ['#e0ecc2', '#c2d894'],
  'caipifruta-morango': ['#e86a6a', '#c23b4e'],
  'mojito': ['#d9efc8', '#a8d8a0'],
  'gin-tonica': ['#e8f0f2', '#c8dfe6'],
  'negroni': ['#d94f2b', '#a8321f'],
  'boulevardier': ['#c14526', '#8f2a1a'],
  'americano': ['#e05a33', '#b03c22'],
  'aperol-spritz': ['#f2803c', '#e05a1f'],
  'hugo-spritz': ['#eef2dc', '#d6e4b8'],
  'old-fashioned': ['#d98a3c', '#a85c22'],
  'manhattan': ['#b8442e', '#8a2f22'],
  'martini-seco': ['#eff3f4', '#dce8ea'],
  'margarita': ['#dff0d8', '#b8dcaa'],
  'tequila-sunrise': ['#f2b03c', '#d94f2b'],
  'paloma': ['#f4c8c0', '#e89a8e'],
  'daiquiri': ['#eef4e0', '#cfe6b8'],
  'pina-colada': ['#f4eeda', '#e8dcbc'],
  'cuba-libre': ['#8a5a30', '#5a3618'],
  'dark-n-stormy': ['#c8a05a', '#6a4518'],
  'moscow-mule': ['#e8e4c8', '#cfc89a'],
  'cosmopolitan': ['#e86a8a', '#d43f66'],
  'sex-on-the-beach': ['#f2a03c', '#e0566a'],
  'espresso-martini': ['#6a4530', '#3a2418'],
  'white-russian': ['#e8dcc8', '#b89a72'],
  'black-russian': ['#4a3020', '#2a1a10'],
  'bloody-mary': ['#d43f2b', '#a82418'],
  'whiskey-sour': ['#f2d88a', '#dca43c'],
  'gimlet': ['#e4f0d8', '#c2e0aa'],
  'tom-collins': ['#eef4e4', '#d4e8c2'],
  'clover-club': ['#f2b8c2', '#e8808e'],
  'bramble': ['#b05a8a', '#6a2a56'],
  'french-75': ['#f4eec8', '#e8dc9a'],
  'bellini': ['#f8d8aa', '#f2b87e'],
  'mimosa': ['#f8d465', '#f2b83c'],
  'sangria': ['#a8283c', '#6a1424'],
  'rabo-de-galo': ['#c1502e', '#8a3020'],
  'batida-de-coco': ['#f8f4e8', '#ece2cc'],
  'penicillin': ['#e8c465', '#c89a3c'],
  'irish-coffee': ['#7a4c2e', '#42291a'],
  'sidecar': ['#e8b465', '#cf8a3c'],
  'kir-royale': ['#c23f5e', '#8a2440'],
  'virgin-mojito': ['#e4f2d4', '#bfe4ae'],
  'shirley-temple': ['#f28a8a', '#e04f5e'],
  'limonada-suica': ['#f0f4d8', '#dcecb4'],
  'abacaxi-hortela': ['#f2e465', '#e0cc3c'],
  'maracuja-tonica': ['#f4d465', '#ecb83c'],
};

// Cada tipo de copo define o contorno (stroke), o líquido (fill) e o topo do copo
const COPOS = {
  rocks: {
    topo: 36,
    glass: 'M32 36 L34 80 L66 80 L68 36',
    liquid: 'M34.5 52 L35.5 77.5 L64.5 77.5 L65.5 52 Z',
    extra: '<rect x="40" y="56" width="10" height="10" rx="2" fill="#fff" opacity="0.22" transform="rotate(8 45 61)"/>' +
           '<rect x="52" y="62" width="9" height="9" rx="2" fill="#fff" opacity="0.16" transform="rotate(-12 56 66)"/>',
  },
  highball: {
    topo: 24,
    glass: 'M36 24 L38 80 L62 80 L64 24',
    liquid: 'M38.2 36 L39.7 77.5 L60.3 77.5 L61.8 36 Z',
  },
  martini: {
    topo: 28,
    glass: 'M26 28 L74 28 L50 55 Z M50 55 L50 78 M36 80 L64 80',
    liquid: 'M31 31.5 L69 31.5 L50 52.5 Z',
  },
  coupe: {
    topo: 30,
    glass: 'M28 30 C30 48 40 54 50 54 C60 54 70 48 72 30 M50 54 L50 78 M36 80 L64 80',
    liquid: 'M30.5 33 C33 47 42 51.5 50 51.5 C58 51.5 67 47 69.5 33 Z',
  },
  flute: {
    topo: 22,
    glass: 'M43 22 C42 46 46 56 50 58 C54 56 58 46 57 22 M50 58 L50 78 M38 80 L62 80',
    liquid: 'M44.6 26 C44 45 47.5 54 50 55.5 C52.5 54 56 45 55.4 26 Z',
  },
  wine: {
    topo: 26,
    glass: 'M31 26 C31 46 38 56 50 57 C62 56 69 46 69 26 M50 57 L50 78 M36 80 L64 80',
    liquid: 'M33.5 32 C34.5 46 41 53.5 50 54.4 C59 53.5 65.5 46 66.5 32 Z',
  },
  mug: {
    topo: 30,
    glass: 'M34 30 L34 78 L66 78 L66 30 M66 40 C77 40 77 62 66 62',
    liquid: 'M36.5 38 L36.5 75.5 L63.5 75.5 L63.5 38 Z',
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
  return COPOS.wine; // taça de vinho, taça grande, jarra
}

function svgDrink(receita, tamanho = 76) {
  const copo = copoDoDrink(receita.copo);
  const [c1, c2] = CORES_DRINK[receita.id] || ['#e8a13c', '#c0563c'];
  const gid = `g-${receita.id}`;
  const ids = receita.ing.map(i => i.id);

  let deco = copo.extra || '';

  // Bolhas para drinks gaseificados
  if (['espumante', 'agua-com-gas', 'agua-tonica', 'ginger-beer', 'refrigerante-cola'].some(x => ids.includes(x))) {
    deco += '<circle cx="46" cy="48" r="1.6" fill="#fff" opacity="0.4"/>' +
            '<circle cx="54" cy="58" r="1.3" fill="#fff" opacity="0.35"/>' +
            '<circle cx="49" cy="68" r="1.6" fill="#fff" opacity="0.3"/>';
  }
  // Espuma/creme por cima
  if (['espresso-martini', 'irish-coffee', 'white-russian'].includes(receita.id)) {
    const y = copo.topo + 5;
    deco += `<ellipse cx="50" cy="${y}" rx="16" ry="3.2" fill="#f0e4cc" opacity="0.9"/>`;
  }

  // Guarnição no topo do copo
  let garnish = '';
  const t = copo.topo;
  if (ids.includes('hortela')) {
    garnish = `<ellipse cx="61" cy="${t - 4}" rx="5" ry="2.6" fill="#7fb069" transform="rotate(-28 61 ${t - 4})"/>` +
              `<ellipse cx="67" cy="${t - 7}" rx="5" ry="2.6" fill="#699a56" transform="rotate(24 67 ${t - 7})"/>`;
  } else if (ids.includes('laranja')) {
    garnish = `<circle cx="66" cy="${t}" r="6" fill="#f2a03c"/><circle cx="66" cy="${t}" r="3.4" fill="#f8c878"/>`;
  } else if (ids.includes('limao')) {
    garnish = `<circle cx="66" cy="${t}" r="6" fill="#b8d47e"/><circle cx="66" cy="${t}" r="3.4" fill="#e0eebc"/>`;
  } else if (ids.includes('morango')) {
    garnish = `<circle cx="65" cy="${t - 1}" r="4.5" fill="#d43f4e"/>`;
  } else if (ids.includes('abacaxi')) {
    garnish = `<rect x="61" y="${t - 6}" width="9" height="9" rx="2" fill="#f2d465" transform="rotate(12 65 ${t})"/>`;
  }

  return `<svg viewBox="0 0 100 100" width="${tamanho}" height="${tamanho}" role="img" aria-label="Ilustração: ${receita.nome}">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient></defs>
    <circle cx="50" cy="50" r="47" fill="#1d1a17"/>
    <path d="${copo.liquid}" fill="url(#${gid})"/>
    ${deco}
    <path d="${copo.glass}" fill="none" stroke="#e8a13c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    ${garnish}
  </svg>`;
}
