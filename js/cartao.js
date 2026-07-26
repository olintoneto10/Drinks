// Cartão de receita: uma imagem para mandar no grupo, com QR que devolve a
// receita editável — a melhor ideia do Highball, adaptada ao nosso jeito.
//
// Quem recebe não precisa de app nenhum para ler: aponta a câmera do celular,
// que decodifica o QR nativamente e abre o MeuBar já com a receita pronta
// para importar. Por isso o QR carrega uma URL, e não dados soltos.

// Receita do catálogo viaja pelo id (QR pequeno); receita própria viaja
// inteira, compactada em chaves de uma letra.
function payloadDaReceita(r) {
  if (!r.custom) return r.id;
  const compacto = {
    n: r.nome,
    c: r.copo,
    t: r.tags,
    i: r.ing.map(i => [i.id, i.q]),
    p: r.preparo,
  };
  if (r.ingExtra) compacto.x = r.ingExtra;
  const json = JSON.stringify(compacto);
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return '~' + btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function urlDaReceita(r) {
  const base = location.origin + location.pathname.replace(/index\.html$/, '');
  return `${base}#drink=${payloadDaReceita(r)}`;
}

function lerPayload(payload) {
  if (!payload.startsWith('~')) return RECEITA_MAP[payload] || null;
  try {
    const b64 = payload.slice(1).replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, ch => ch.charCodeAt(0));
    const d = JSON.parse(new TextDecoder().decode(bytes));
    if (!d.n || !Array.isArray(d.i)) return null;
    return {
      id: 'recebida-' + Date.now().toString(36),
      nome: String(d.n).slice(0, 80),
      copo: String(d.c || 'Copo baixo').slice(0, 40),
      tags: Array.isArray(d.t) ? d.t.slice(0, 5) : [],
      ing: d.i.filter(par => Array.isArray(par) && ING_MAP[par[0]])
        .map(([id, q]) => ({ id, q: String(q || '').slice(0, 40) })),
      preparo: String(d.p || '').slice(0, 900),
      ingExtra: d.x ? String(d.x).slice(0, 200) : '',
      custom: true,
    };
  } catch { return null; }
}

// ---------- Desenho ----------
function desenharQR(ctx, texto, x, y, lado) {
  const m = gerarQR(texto);
  const n = m.length;
  const mod = Math.floor(lado / (n + 8)); // 4 módulos de silêncio de cada lado
  const total = mod * (n + 8);
  const ox = x + Math.round((lado - total) / 2);
  const oy = y + Math.round((lado - total) / 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(ox, oy, total, total);
  ctx.fillStyle = '#201D1A';
  for (let l = 0; l < n; l++) {
    for (let c = 0; c < n; c++) {
      if (m[l][c]) ctx.fillRect(ox + (c + 4) * mod, oy + (l + 4) * mod, mod, mod);
    }
  }
  return total;
}

// Quebra o texto em linhas que cabem na largura
function linhas(ctx, texto, largura) {
  const palavras = texto.split(/\s+/);
  const saida = [];
  let atual = '';
  for (const p of palavras) {
    const teste = atual ? `${atual} ${p}` : p;
    if (ctx.measureText(teste).width > largura && atual) { saida.push(atual); atual = p; }
    else atual = teste;
  }
  if (atual) saida.push(atual);
  return saida;
}

function gerarCartaoReceita(receitaId) {
  const r = RECEITA_MAP[receitaId];
  if (!r) return;

  const url = urlDaReceita(r);
  const [c1, c2] = (typeof CORES_DRINK === 'object' && CORES_DRINK[r.id]) || ['#C4372B', '#8F2A1A'];

  const L = 1000;
  const ings = r.ing.filter(i => !BASICOS.has(i.id));

  // A altura sai do conteúdo, não de um chute: mede-se o preparo antes de
  // dimensionar, senão sobra um vão morto acima do QR nos drinks curtos.
  const regua = document.createElement('canvas').getContext('2d');
  regua.font = 'italic 25px Georgia, serif';
  const corpo = linhas(regua, r.preparo, L - 240).slice(0, 4);
  const A = 700 + ings.length * 42 + corpo.length * 36 + 396;

  const canvas = document.createElement('canvas');
  canvas.width = L;
  canvas.height = A;
  const ctx = canvas.getContext('2d');

  // Fundo na cor do próprio drink, escurecido para o texto branco respirar
  const fundo = ctx.createLinearGradient(0, 0, L * .4, A);
  fundo.addColorStop(0, escurecer(c1, .58));
  fundo.addColorStop(1, escurecer(c2, .72));
  ctx.fillStyle = fundo;
  ctx.fillRect(0, 0, L, A);

  // Facho de luz vindo de cima, como na hora do bar
  const luz = ctx.createRadialGradient(L / 2, -80, 40, L / 2, -80, A * .85);
  luz.addColorStop(0, 'rgba(255,246,232,.20)');
  luz.addColorStop(1, 'rgba(255,246,232,0)');
  ctx.fillStyle = luz;
  ctx.fillRect(0, 0, L, A);

  // Moldura fina
  ctx.strokeStyle = 'rgba(255,255,255,.26)';
  ctx.lineWidth = 2;
  ctx.strokeRect(38, 38, L - 76, A - 76);

  ctx.textAlign = 'center';

  // Selo
  ctx.fillStyle = 'rgba(255,255,255,.62)';
  ctx.font = '500 22px Helvetica, Arial, sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('MEUBAR', L / 2, 108);
  ctx.letterSpacing = '0px';

  // Ilustração do drink
  const arte = document.createElement('div');
  arte.innerHTML = svgDrink(r, 300);
  const svg = arte.querySelector('svg');
  const img = new Image();
  const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
  const urlSvg = URL.createObjectURL(blob);

  img.onload = () => {
    ctx.drawImage(img, (L - 300) / 2, 150, 300, 300);
    URL.revokeObjectURL(urlSvg);
    concluir();
  };
  img.onerror = () => { URL.revokeObjectURL(urlSvg); concluir(); };
  img.src = urlSvg;

  function concluir() {
    let y = 528;

    // Nome
    ctx.fillStyle = '#FFFFFF';
    let tamanho = 74;
    ctx.font = `${tamanho}px Georgia, serif`;
    while (ctx.measureText(r.nome).width > L - 200 && tamanho > 40) {
      tamanho -= 4;
      ctx.font = `${tamanho}px Georgia, serif`;
    }
    ctx.fillText(r.nome, L / 2, y);
    y += 46;

    // Copo e perfil
    ctx.fillStyle = 'rgba(255,255,255,.66)';
    ctx.font = 'italic 26px Georgia, serif';
    const tags = r.tags.map(t => (TAG_NOMES[t] || t).toLowerCase()).join(' · ');
    ctx.fillText(`${r.copo.toLowerCase()} · ${tags}`, L / 2, y);
    y += 56;

    // Filete
    ctx.strokeStyle = 'rgba(255,255,255,.24)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(L / 2 - 120, y); ctx.lineTo(L / 2 + 120, y); ctx.stroke();
    y += 52;

    // Ingredientes
    ctx.font = '30px Georgia, serif';
    for (const i of ings) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`${ING_MAP[i.id]?.nome || i.id} — ${i.q}`, L / 2, y);
      y += 42;
    }
    y += 18;

    // Preparo, no máximo quatro linhas
    ctx.fillStyle = 'rgba(255,255,255,.74)';
    ctx.font = 'italic 25px Georgia, serif';
    for (const linha of corpo) { ctx.fillText(linha, L / 2, y); y += 36; }

    // QR num quadrado claro, com a legenda do lado
    const ladoQR = 220;
    const qrY = A - ladoQR - 92;
    const qrX = 86;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(qrX, qrY, ladoQR, ladoQR);
    desenharQR(ctx, url, qrX, qrY, ladoQR);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '30px Georgia, serif';
    ctx.fillText('Aponte a câmera', qrX + ladoQR + 40, qrY + 84);
    ctx.fillStyle = 'rgba(255,255,255,.66)';
    ctx.font = 'italic 25px Georgia, serif';
    ctx.fillText('e a receita abre no seu', qrX + ladoQR + 40, qrY + 126);
    ctx.fillText('celular, pronta para editar.', qrX + ladoQR + 40, qrY + 160);

    entregarCartao(canvas, r.nome);
  }
}

// Escurece uma cor #rrggbb mantendo o matiz — o cartão precisa de contraste
// para o texto branco, e as cores dos drinks são quase todas claras.
function escurecer(hex, quanto) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - quanto));
  const g = Math.round(((n >> 8) & 255) * (1 - quanto));
  const b = Math.round((n & 255) * (1 - quanto));
  return `rgb(${r},${g},${b})`;
}

function entregarCartao(canvas, nome) {
  canvas.toBlob(async blob => {
    if (!blob) return;
    const arquivo = new File([blob], `${nome.toLowerCase().replace(/\s+/g, '-')}.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
      try { await navigator.share({ files: [arquivo], title: nome }); return; }
      catch { /* cancelado — cai para download */ }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = arquivo.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    toast('Cartão salvo', 'A imagem foi baixada — mande no grupo.');
  }, 'image/png');
}

// ---------- Recebendo uma receita ----------
function checarReceitaRecebida() {
  const m = location.hash.match(/^#drink=(.+)$/);
  if (!m) return;
  const r = lerPayload(decodeURIComponent(m[1]));
  history.replaceState(null, '', location.pathname + location.search);
  if (!r) { toast('Cartão não reconhecido', 'O código pode estar incompleto.', 'erro'); return; }

  // Receita do catálogo: é só abrir
  if (RECEITA_MAP[r.id] && !r.custom) { abrirReceita(r.id); return; }

  const ing = r.ing.map(i => `<li>${esc(ING_MAP[i.id]?.nome || i.id)} — ${esc(i.q)}</li>`).join('');
  $('#modal-corpo').innerHTML = `
    <span class="rotulo-dia">✦ Receita recebida</span>
    <h2>${esc(r.nome)}</h2>
    <p class="linha-ficha">${esc(r.copo)}</p>
    <h3>Ingredientes</h3>
    <ul class="ingredientes">${ing}</ul>
    <h3>Preparo</h3>
    <p>${esc(r.preparo)}</p>
    <button class="btn primario" id="btn-guardar-recebida">Guardar no meu bar</button>`;
  abrirModal();
  $('#btn-guardar-recebida').addEventListener('click', () => {
    salvarReceitaCustom(r);
    fecharModal();
    renderSugestoes();
    toast('Receita guardada', `${r.nome} entrou nas suas receitas.`);
  });
}

// Trocar só o #hash não recarrega a página: sem isto, escanear um cartão com
// o app já aberto não faria nada.
window.addEventListener('hashchange', checarReceitaRecebida);
