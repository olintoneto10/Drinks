// Retrospectiva do ano: calcula os números do diário e desenha um cartaz
// no mesmo estilo de carta impressa do app.

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function statsDoAno(ano) {
  const doAno = state.entries.filter(e => e.data && e.data.startsWith(String(ano)));
  if (!doAno.length) return null;

  const conta = (arr, chave) => {
    const mapa = {};
    for (const item of arr) {
      const k = chave(item);
      if (k === null || k === undefined || k === '') continue;
      mapa[k] = (mapa[k] || 0) + 1;
    }
    return Object.entries(mapa).sort((a, b) => b[1] - a[1]);
  };

  const comNota = doAno.filter(e => e.nota);
  const maisBebidos = conta(doAno, e => e.nome.trim());
  const porMes = conta(doAno, e => Number(e.data.split('-')[1]) - 1);
  const porPessoa = conta(doAno.filter(e => (e.pessoaId || 'eu') !== 'eu'),
    e => getPessoa(e.pessoaId)?.nome || e.pessoaNome);

  // Perfil de sabor dominante no ano
  const pesos = {};
  for (const e of doAno) {
    const receita = e.receitaId && RECEITA_MAP[e.receitaId];
    if (!receita) continue;
    for (const t of receita.tags) pesos[t] = (pesos[t] || 0) + (e.nota ? e.nota - 2 : 1);
  }
  const perfil = Object.entries(pesos)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([t]) => (TAG_NOMES[t] || t).toLowerCase());

  const melhor = [...comNota].sort((a, b) =>
    b.nota - a.nota || (b.data || '').localeCompare(a.data || ''))[0];

  return {
    ano,
    total: doAno.length,
    media: comNota.length
      ? (comNota.reduce((s, e) => s + e.nota, 0) / comNota.length).toFixed(1) : null,
    campeao: maisBebidos[0] && maisBebidos[0][1] > 1 ? maisBebidos[0] : null,
    melhor,
    mes: porMes[0] ? { nome: MESES[porMes[0][0]], n: porMes[0][1] } : null,
    parceiro: porPessoa[0] ? { nome: porPessoa[0][0], n: porPessoa[0][1] } : null,
    perfil,
    comFoto: doAno.filter(e => e.foto).length,
  };
}

function gerarRetrospectiva() {
  const ano = new Date().getFullYear();
  const s = statsDoAno(ano) || statsDoAno(ano - 1);
  if (!s) {
    alert('Ainda não há registros suficientes no diário para uma retrospectiva.');
    return;
  }

  const linhas = [];
  if (s.campeao) linhas.push(['O drink do seu ano', s.campeao[0], `${s.campeao[1]} vezes`]);
  if (s.melhor) linhas.push(['Nota máxima', s.melhor.nome, '★'.repeat(s.melhor.nota)]);
  if (s.mes) linhas.push(['Mês mais animado', s.mes.nome, `${s.mes.n} ${s.mes.n === 1 ? 'registro' : 'registros'}`]);
  if (s.parceiro) linhas.push(['Brindou mais com', s.parceiro.nome, `${s.parceiro.n}×`]);
  if (s.perfil.length) linhas.push(['Seu paladar', s.perfil.join(', '), '']);
  if (s.media) linhas.push(['Nota média', s.media, 'de 5']);

  // A última linha termina em 616 + 132n; o resto é folga para o rodapé
  const W = 1080;
  const H = 780 + linhas.length * 132;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FBFAF7';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#201D1A';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.strokeStyle = '#C4372B';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(52, 52, W - 104, H - 104);

  // Marca
  ctx.textAlign = 'left';
  ctx.font = 'normal 76px Georgia, serif';
  const meuW = ctx.measureText('Meu').width;
  ctx.font = 'italic 76px Georgia, serif';
  const barW = ctx.measureText('Bar').width;
  const x0 = W / 2 - (meuW + barW) / 2;
  ctx.fillStyle = '#201D1A';
  ctx.font = 'normal 76px Georgia, serif';
  ctx.fillText('Meu', x0, 165);
  ctx.fillStyle = '#C4372B';
  ctx.font = 'italic 76px Georgia, serif';
  ctx.fillText('Bar', x0 + meuW, 165);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#6B665C';
  ctx.font = 'italic 40px Georgia, serif';
  ctx.fillText(`retrospectiva ${s.ano}`, W / 2, 225);

  // Número principal
  ctx.fillStyle = '#C4372B';
  ctx.font = 'normal 150px Georgia, serif';
  ctx.fillText(String(s.total), W / 2, 390);
  ctx.fillStyle = '#201D1A';
  ctx.font = 'italic 40px Georgia, serif';
  ctx.fillText(s.total === 1 ? 'drink registrado' : 'drinks registrados', W / 2, 445);
  if (s.comFoto) {
    ctx.fillStyle = '#6B665C';
    ctx.font = '28px Helvetica, sans-serif';
    ctx.fillText(`${s.comFoto} COM FOTO`, W / 2, 492);
  }

  ctx.fillStyle = '#C4372B';
  ctx.font = '36px Georgia, serif';
  ctx.fillText('· · ✦ · ·', W / 2, 560);

  // Linhas de destaque
  let y = 650;
  for (const [rotulo, valor, extra] of linhas) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#6B665C';
    ctx.font = '25px Helvetica, sans-serif';
    ctx.fillText(rotulo.toUpperCase(), W / 2, y);

    ctx.fillStyle = '#201D1A';
    let tamanho = 54;
    ctx.font = `normal ${tamanho}px Georgia, serif`;
    while (ctx.measureText(valor).width > W - 200 && tamanho > 30) {
      tamanho -= 4;
      ctx.font = `normal ${tamanho}px Georgia, serif`;
    }
    ctx.fillText(valor, W / 2, y + 58);

    if (extra) {
      ctx.fillStyle = '#C4372B';
      ctx.font = 'italic 30px Georgia, serif';
      ctx.fillText(extra, W / 2, y + 98);
    }
    y += 132;
  }

  ctx.fillStyle = '#6B665C';
  ctx.font = '24px Helvetica, sans-serif';
  ctx.fillText('FEITO COM ♥ NO MEUBAR', W / 2, H - 85);

  canvas.toBlob(async blob => {
    if (!blob) return;
    const arquivo = new File([blob], `retrospectiva-${s.ano}.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
      try { await navigator.share({ files: [arquivo], title: `Minha retrospectiva ${s.ano}` }); return; }
      catch { /* cancelado — cai para download */ }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `retrospectiva-${s.ano}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }, 'image/png');
}
