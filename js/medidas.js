// Escala de receita e unidade de medida.
//
// As quantidades do catálogo são texto livre ("30 ml", "1/2 unidade",
// "a gosto"). Em vez de reescrever tudo em número — que perderia "a gosto" e
// "para completar", que são instruções e não medidas — o número é extraído do
// começo da string e o resto viaja intacto.

const ML_POR_OZ = 29.5735;
const OITAVOS = ['', '⅛', '¼', '⅜', '½', '⅝', '¾', '⅞'];

// Palavras que ganham plural ao escalar; o catálogo já traz várias no plural
const PLURAIS = {
  unidade: 'unidades', fatia: 'fatias', folha: 'folhas', rodela: 'rodelas',
  cubo: 'cubos', gota: 'gotas', dose: 'doses', colher: 'colheres',
  pedaço: 'pedaços', casca: 'cascas', ramo: 'ramos', punhado: 'punhados',
};

// Extrai o número do início: aceita inteiro, decimal e fração ("1/2")
function separarQuantidade(q) {
  const m = String(q).match(/^\s*(\d+)\s*\/\s*(\d+)\s*(.*)$/);
  if (m) return { valor: Number(m[1]) / Number(m[2]), resto: m[3] };
  const n = String(q).match(/^\s*(\d+(?:[.,]\d+)?)\s*(.*)$/);
  if (n) return { valor: Number(n[1].replace(',', '.')), resto: n[2] };
  return null;
}

// Número em texto de bar: inteiro quando dá, fração de oitavo quando não dá
function numeroBonito(v) {
  const inteiro = Math.floor(v + 1e-9);
  const resto = v - inteiro;
  const oitavos = Math.round(resto * 8);
  if (oitavos === 0) return String(inteiro);
  if (oitavos === 8) return String(inteiro + 1);
  const fracao = OITAVOS[oitavos];
  return inteiro ? `${inteiro}${fracao}` : fracao;
}

function pluralizar(resto, valor) {
  if (valor <= 1) return resto;
  return resto.replace(/^([a-zà-ú]+)/i, p => PLURAIS[p.toLowerCase()] || p);
}

// Converte só o que está em ml; o resto passa direto
function paraOnca(valor, resto) {
  if (!/^ml\b/.test(resto)) return null;
  const oz = valor / ML_POR_OZ;
  // arredonda ao quarto de onça, que é como se mede atrás do balcão
  const quartos = Math.max(1, Math.round(oz * 4));
  return `${numeroBonito(quartos / 4)} oz${resto.slice(2)}`;
}

// Ponto único de formatação: escala e unidade juntas
function formatarQuantidade(q, fator = 1, unidade = 'ml') {
  const p = separarQuantidade(q);
  if (!p) return q; // "a gosto", "bastante", "para completar" — não são medidas

  const valor = p.valor * fator;
  if (unidade === 'oz') {
    const oz = paraOnca(valor, p.resto);
    if (oz) return oz;
  }
  // em ml, arredonda para múltiplo de 5 quando o volume é grande o bastante
  const emMl = /^ml\b/.test(p.resto);
  const v = emMl && valor >= 20 ? Math.round(valor / 5) * 5 : valor;
  return `${numeroBonito(v)} ${pluralizar(p.resto, v)}`.trim();
}

// Rótulo do rendimento
function rotuloRende(n) {
  return n === 1 ? '1 drink' : `${n} drinks`;
}
