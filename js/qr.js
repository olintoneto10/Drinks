// Gerador de QR Code em JavaScript puro — modo byte, nível de correção M.
//
// Por que escrever em vez de usar uma biblioteca: o app não tem build nem
// dependência, funciona offline e a política de segurança do navegador barra
// script de CDN. São ~250 linhas e o formato é fechado desde 2006.
//
// Só codifica. Ler QR é problema da câmera do celular, que já faz isso nativo
// — por isso o cartão carrega uma URL: apontar a câmera abre o app.

// ---------- Aritmética no corpo de Galois GF(256) ----------
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d; // polinômio primitivo do QR
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a, b) {
  if (!a || !b) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

// Polinômio gerador para n códigos de correção
function polinomioGerador(n) {
  let g = [1];
  for (let i = 0; i < n; i++) {
    const novo = new Array(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) {
      novo[j] ^= g[j];
      novo[j + 1] ^= gfMul(g[j], GF_EXP[i]);
    }
    g = novo;
  }
  return g;
}

function correcaoReedSolomon(dados, nCorrecao) {
  const g = polinomioGerador(nCorrecao);
  const resto = new Array(nCorrecao).fill(0);
  for (const byte of dados) {
    const fator = byte ^ resto[0];
    resto.shift();
    resto.push(0);
    if (fator) for (let i = 0; i < g.length - 1; i++) resto[i] ^= gfMul(g[i + 1], fator);
  }
  return resto;
}

// ---------- Tabelas do formato (nível M) ----------
// Por versão 1..40: [total de códigos de dados, códigos de correção por bloco,
// blocos do grupo 1, blocos do grupo 2]
const VERSOES_M = [
  [16, 10, 1, 0], [28, 16, 1, 0], [44, 26, 1, 0], [64, 18, 2, 0],
  [86, 24, 2, 0], [108, 16, 4, 0], [124, 18, 4, 0], [154, 22, 2, 2],
  [182, 22, 3, 2], [216, 26, 4, 1], [254, 30, 1, 4], [290, 22, 6, 2],
  [334, 22, 8, 1], [365, 24, 4, 5], [415, 24, 5, 5], [453, 28, 7, 3],
  [507, 28, 10, 1], [563, 26, 9, 4], [627, 26, 3, 11], [669, 26, 3, 13],
  [714, 26, 17, 0], [782, 28, 17, 0], [860, 28, 4, 14], [914, 28, 6, 14],
  [1000, 28, 8, 13], [1062, 28, 19, 4], [1128, 28, 22, 3], [1193, 28, 3, 23],
  [1267, 28, 21, 7], [1373, 28, 19, 10], [1455, 28, 2, 29], [1541, 28, 10, 23],
  [1631, 28, 14, 21], [1725, 28, 14, 23], [1812, 28, 12, 26], [1914, 28, 6, 34],
  [1992, 28, 29, 14], [2102, 28, 13, 32], [2216, 28, 40, 7], [2334, 28, 18, 31],
];

// Posições dos padrões de alinhamento por versão
const ALINHAMENTO = [
  [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42],
  [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66],
  [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86],
  [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102],
  [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118],
  [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130],
  [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142],
  [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154],
  [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166],
  [6, 30, 58, 86, 114, 142, 170],
];

// ---------- Montagem ----------
function bitsDeDados(texto, versao) {
  const bytes = new TextEncoder().encode(texto);
  const bits = [];
  const push = (valor, tamanho) => {
    for (let i = tamanho - 1; i >= 0; i--) bits.push((valor >> i) & 1);
  };
  push(0b0100, 4);                          // modo byte
  push(bytes.length, versao < 10 ? 8 : 16); // contagem
  for (const b of bytes) push(b, 8);

  const capacidade = VERSOES_M[versao - 1][0] * 8;
  push(0, Math.min(4, capacidade - bits.length));       // terminador
  while (bits.length % 8) bits.push(0);                 // alinha em byte

  const codigos = [];
  for (let i = 0; i < bits.length; i += 8) {
    codigos.push(parseInt(bits.slice(i, i + 8).join(''), 2));
  }
  // preenchimento alternado exigido pela norma
  const enchimento = [0xec, 0x11];
  let k = 0;
  while (codigos.length < VERSOES_M[versao - 1][0]) codigos.push(enchimento[k++ % 2]);
  return codigos;
}

// Intercala blocos de dados e de correção, como a norma exige
function intercalar(codigos, versao) {
  const [, porBloco, g1, g2] = VERSOES_M[versao - 1];
  const totalBlocos = g1 + g2;
  const base = Math.floor(codigos.length / totalBlocos);
  const blocos = [];
  let pos = 0;
  for (let i = 0; i < totalBlocos; i++) {
    const tamanho = i < g1 ? base : base + 1;
    blocos.push(codigos.slice(pos, pos + tamanho));
    pos += tamanho;
  }
  const correcoes = blocos.map(b => correcaoReedSolomon(b, porBloco));

  const saida = [];
  const maior = Math.max(...blocos.map(b => b.length));
  for (let i = 0; i < maior; i++) {
    for (const b of blocos) if (i < b.length) saida.push(b[i]);
  }
  for (let i = 0; i < porBloco; i++) {
    for (const c of correcoes) saida.push(c[i]);
  }
  return saida;
}

function novaMatriz(tamanho) {
  return Array.from({ length: tamanho }, () => new Array(tamanho).fill(null));
}

function porPadraoFixo(m, versao) {
  const n = m.length;
  const localizador = (linha, coluna) => {
    for (let i = -1; i <= 7; i++) {
      for (let j = -1; j <= 7; j++) {
        const l = linha + i, c = coluna + j;
        if (l < 0 || l >= n || c < 0 || c >= n) continue;
        const borda = i === -1 || i === 7 || j === -1 || j === 7;
        const anel = i === 0 || i === 6 || j === 0 || j === 6;
        const miolo = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        m[l][c] = borda ? 0 : (anel || miolo) ? 1 : 0;
      }
    }
  };
  localizador(0, 0); localizador(0, n - 7); localizador(n - 7, 0);

  // temporizadores
  for (let i = 8; i < n - 8; i++) {
    m[6][i] = i % 2 === 0 ? 1 : 0;
    m[i][6] = i % 2 === 0 ? 1 : 0;
  }
  // Alinhamento. A exclusão é posicional: só os três cantos ocupados pelos
  // localizadores ficam de fora. Testar "centro já preenchido" parece
  // equivalente e não é — os padrões da linha e da coluna 6 cruzam o
  // temporizador de propósito, e seriam pulados por engano.
  const eixos = ALINHAMENTO[versao - 1];
  const pri = eixos[0], ult = eixos[eixos.length - 1];
  for (const l of eixos) {
    for (const c of eixos) {
      if ((l === pri && c === pri) || (l === pri && c === ult) || (l === ult && c === pri)) continue;
      for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
          m[l + i][c + j] = (Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0)) ? 1 : 0;
        }
      }
    }
  }
  m[n - 8][8] = 1; // módulo escuro, sempre

  // reserva das áreas de formato e de versão
  for (let i = 0; i < 9; i++) {
    if (m[8][i] === null) m[8][i] = 0;
    if (m[i][8] === null) m[i][8] = 0;
  }
  for (let i = 0; i < 8; i++) {
    if (m[8][n - 1 - i] === null) m[8][n - 1 - i] = 0;
    if (m[n - 1 - i][8] === null) m[n - 1 - i][8] = 0;
  }
  if (versao >= 7) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        if (m[n - 11 + j][i] === null) m[n - 11 + j][i] = 0;
        if (m[i][n - 11 + j] === null) m[i][n - 11 + j] = 0;
      }
    }
  }
}

// Marca quais posições são reservadas (não recebem dados)
function mapaReservado(versao, tamanho) {
  const r = novaMatriz(tamanho);
  porPadraoFixo(r, versao);
  return r.map(linha => linha.map(v => v !== null));
}

const MASCARAS = [
  (l, c) => (l + c) % 2 === 0,
  (l) => l % 2 === 0,
  (l, c) => c % 3 === 0,
  (l, c) => (l + c) % 3 === 0,
  (l, c) => (Math.floor(l / 2) + Math.floor(c / 3)) % 2 === 0,
  (l, c) => ((l * c) % 2) + ((l * c) % 3) === 0,
  (l, c) => (((l * c) % 2) + ((l * c) % 3)) % 2 === 0,
  (l, c) => (((l + c) % 2) + ((l * c) % 3)) % 2 === 0,
];

function colocarDados(m, reservado, bytes) {
  const n = m.length;
  const bits = [];
  for (const b of bytes) for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1);
  let idx = 0, subindo = true;
  for (let cDir = n - 1; cDir > 0; cDir -= 2) {
    if (cDir === 6) cDir--; // pula a coluna do temporizador
    for (let passo = 0; passo < n; passo++) {
      const linha = subindo ? n - 1 - passo : passo;
      for (const coluna of [cDir, cDir - 1]) {
        if (reservado[linha][coluna]) continue;
        m[linha][coluna] = idx < bits.length ? bits[idx] : 0;
        idx++;
      }
    }
    subindo = !subindo;
  }
}

function aplicarMascara(m, reservado, mascara) {
  const n = m.length;
  const saida = m.map(l => l.slice());
  for (let l = 0; l < n; l++) {
    for (let c = 0; c < n; c++) {
      if (!reservado[l][c] && MASCARAS[mascara](l, c)) saida[l][c] ^= 1;
    }
  }
  return saida;
}

// Penalidade da norma, usada para escolher a máscara menos ruidosa
function penalidade(m) {
  const n = m.length;
  let p = 0;
  const linhaEColuna = (get) => {
    for (let a = 0; a < n; a++) {
      let corrida = 1;
      for (let b = 1; b < n; b++) {
        if (get(a, b) === get(a, b - 1)) corrida++;
        else { if (corrida >= 5) p += 3 + (corrida - 5); corrida = 1; }
      }
      if (corrida >= 5) p += 3 + (corrida - 5);
    }
  };
  linhaEColuna((a, b) => m[a][b]);
  linhaEColuna((a, b) => m[b][a]);

  for (let l = 0; l < n - 1; l++) {
    for (let c = 0; c < n - 1; c++) {
      const v = m[l][c];
      if (v === m[l][c + 1] && v === m[l + 1][c] && v === m[l + 1][c + 1]) p += 3;
    }
  }
  const alvo = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
  const casa = (linha) => {
    for (let i = 0; i + 11 <= n; i++) {
      let ok = true;
      for (let j = 0; j < 11; j++) if (linha[i + j] !== alvo[j]) { ok = false; break; }
      if (ok) p += 40;
      ok = true;
      for (let j = 0; j < 11; j++) if (linha[i + j] !== alvo[10 - j]) { ok = false; break; }
      if (ok) p += 40;
    }
  };
  for (let l = 0; l < n; l++) {
    casa(m[l]);
    casa(m.map(x => x[l]));
  }
  let escuros = 0;
  for (const l of m) for (const v of l) escuros += v;
  p += Math.floor(Math.abs((escuros * 100) / (n * n) - 50) / 5) * 10;
  return p;
}

function gravarFormato(m, mascara) {
  const n = m.length;
  // 00 = nível M; BCH(15,5) com XOR da norma
  let v = (0b00 << 3) | mascara;
  let bch = v << 10;
  for (let i = 4; i >= 0; i--) if ((bch >> (i + 10)) & 1) bch ^= 0b10100110111 << i;
  const bits = ((v << 10) | bch) ^ 0b101010000010010;
  const get = i => (bits >> (14 - i)) & 1;

  for (let i = 0; i <= 5; i++) m[8][i] = get(i);
  m[8][7] = get(6); m[8][8] = get(7); m[7][8] = get(8);
  for (let i = 9; i <= 14; i++) m[14 - i][8] = get(i);

  for (let i = 0; i <= 7; i++) m[n - 1 - i][8] = get(i);
  for (let i = 8; i <= 14; i++) m[8][n - 15 + i] = get(i);
}

function gravarVersao(m, versao) {
  if (versao < 7) return;
  const n = m.length;
  let bch = versao << 12;
  for (let i = 5; i >= 0; i--) if ((bch >> (i + 12)) & 1) bch ^= 0b1111100100101 << i;
  const bits = (versao << 12) | bch;
  for (let i = 0; i < 18; i++) {
    const bit = (bits >> i) & 1;
    const l = Math.floor(i / 3), c = i % 3;
    m[n - 11 + c][l] = bit;
    m[l][n - 11 + c] = bit;
  }
}

// Retorna uma matriz de 0/1 pronta para desenhar
function gerarQR(texto) {
  const bytes = new TextEncoder().encode(texto).length;
  let versao = 0;
  for (let v = 1; v <= 40; v++) {
    const cabecalho = 4 + (v < 10 ? 8 : 16);
    if (VERSOES_M[v - 1][0] * 8 >= cabecalho + bytes * 8) { versao = v; break; }
  }
  if (!versao) throw new Error('Conteúdo longo demais para um QR');

  const finais = intercalar(bitsDeDados(texto, versao), versao);
  const tamanho = versao * 4 + 17;
  const reservado = mapaReservado(versao, tamanho);

  const base = novaMatriz(tamanho);
  porPadraoFixo(base, versao);
  colocarDados(base, reservado, finais);

  let melhor = null;
  for (let mascara = 0; mascara < 8; mascara++) {
    const tentativa = aplicarMascara(base, reservado, mascara);
    gravarFormato(tentativa, mascara);
    gravarVersao(tentativa, versao);
    const p = penalidade(tentativa);
    if (!melhor || p < melhor.p) melhor = { m: tentativa, p };
  }
  return melhor.m;
}
