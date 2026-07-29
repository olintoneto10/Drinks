// Monte meu bar: escolha um estilo de bebida e o app calcula a menor lista de
// compras que destrava o máximo de drinks daquele estilo.
//
// O motor de sugestões responde "o que dá para fazer com o que tenho". Este
// responde a pergunta inversa, que é a de quem está montando a estante:
// "o que eu compro para fazer o que eu gosto?".

const ESTILOS = [
  {
    // O estilo é definido tanto pelo que tem quanto pelo que NÃO tem: doce sem
    // ser forte, amargo ou seco, e montado no copo — nada de coqueteleira.
    id: 'ice', nome: 'Doce e fácil', exemplo: 'tipo Ice, Woo Woo, Sea Breeze',
    escolhe: r => (r.tags.includes('doce') || r.tags.includes('frutado'))
      && !['forte', 'amargo', 'seco', 'quente'].some(t => r.tags.includes(t))
      && nivelDaReceita(r) === 1,
  },
  {
    id: 'citrico', nome: 'Cítrico e refrescante', exemplo: 'caipirinha, mojito, daiquiri',
    escolhe: r => r.tags.includes('citrico') && !r.tags.includes('cremoso'),
  },
  {
    // Só 'amargo'. Incluir 'seco' aqui enchia o alvo de drinks de gin e o
    // guloso comprava gin em vez de Campari — o oposto do que o nome promete.
    id: 'amargo', nome: 'Amargo e aperitivo', exemplo: 'negroni, spritz, americano',
    escolhe: r => r.tags.includes('amargo'),
  },
  {
    id: 'seco', nome: 'Seco e direto', exemplo: 'dry martini, gin tônica, gimlet',
    escolhe: r => r.tags.includes('seco'),
  },
  {
    id: 'forte', nome: 'Forte e clássico', exemplo: 'old fashioned, manhattan, sazerac',
    escolhe: r => r.tags.includes('forte'),
  },
  {
    id: 'tropical', nome: 'Tropical e frutado', exemplo: 'piña colada, mai tai, batida',
    escolhe: r => r.tags.includes('tropical') || r.tags.includes('cremoso'),
  },
  {
    id: 'sem-alcool', nome: 'Sem álcool', exemplo: 'limonadas, tônicas, sucos de bar',
    escolhe: r => r.tags.includes('sem-alcool'),
  },
];

// Ingredientes que já contam como disponíveis: os básicos e o que está no bar
function jaTenho() {
  return new Set([...state.bar, ...BASICOS]);
}

// O que falta numa receita, ignorando o que é opcional
function faltamPara(receita, tenho) {
  return receita.ing.filter(i => !i.opcional && !tenho.has(i.id)).map(i => i.id);
}

// Quantos itens vale comprar. Um estilo cabe em 8; combinando estilos o alvo
// cresce e 8 garrafas destravariam pouco de cada um — mas a promessa continua
// sendo "a MENOR lista", então o teto sobe devagar e para em 12.
function tetoDeItens(n) {
  return Math.min(12, 6 + 2 * Math.max(1, n));
}

// Guloso ponderado. Pontuar só "fecha receita agora" trava com a estante
// vazia, porque no começo nenhuma receita está a um item de distância. Então
// cada candidato ganha 1/faltam² por receita em que aparece: quem está perto
// de fechar domina, e quem aparece em muitas ainda acumula.
//
// Aceita um ou vários estilos. Com vários, o alvo é a UNIÃO das receitas —
// quem marcou cítrico e amargo quer uma lista que sirva aos dois, não a
// interseção, que seria quase sempre vazia.
function montarKit(estilos, maxItens = null) {
  const lista = Array.isArray(estilos) ? estilos : [estilos];
  const alvo = RECEITAS.filter(r => !r.custom && lista.some(e => e.escolhe(r)));
  maxItens = maxItens ?? tetoDeItens(lista.length);
  const inicial = jaTenho();
  const tenho = new Set(inicial);
  let comprar = [];

  // Cada estilo com seu próprio alvo, para dar para medir quem está atrás.
  const trilhas = lista.map(e => ({
    estilo: e,
    receitas: RECEITAS.filter(r => !r.custom && e.escolhe(r)),
    travado: false,
  }));
  const cobertura = t => {
    const feitas = t.receitas.filter(r => faltamPara(r, tenho).length === 0).length;
    return t.receitas.length ? feitas / t.receitas.length : 1;
  };

  // Rodízio, não soma. Somar as contribuições de todos os estilos parece justo
  // e não é: cítrico tem 87 receitas contra 37 do amargo e é mais barato de
  // destravar, então venceria todas as rodadas e a lista sairia 20 drinks
  // cítricos e ZERO amargos — exatamente o oposto de quem marcou os dois.
  // A cada compra, escolhe o estilo com menor cobertura e compra para ele.
  while (comprar.length < maxItens) {
    const vivas = trilhas.filter(t => !t.travado);
    if (!vivas.length) break;
    const atras = vivas.reduce((a, b) => cobertura(a) <= cobertura(b) ? a : b);

    const pontos = new Map();
    for (const r of atras.receitas) {
      const faltam = faltamPara(r, tenho);
      if (!faltam.length) continue;
      const peso = 1 / (faltam.length * faltam.length);
      for (const id of faltam) pontos.set(id, (pontos.get(id) || 0) + peso);
    }
    // Estilo sem nada a comprar sai do rodízio para não travar os outros.
    if (!pontos.size) { atras.travado = true; continue; }

    let melhor = null;
    for (const [id, p] of pontos) if (!melhor || p > melhor.p) melhor = { id, p };
    tenho.add(melhor.id);
    comprar.push(melhor.id);
  }

  const destravadas = alvo.filter(r => faltamPara(r, tenho).length === 0);

  // Apara o que sobrou: item que não participa de nenhuma receita destravada
  // não tem por que estar na lista de compras. Remover não desfaz nada, já
  // que nenhuma receita completa depende dele.
  const usados = new Set(destravadas.flatMap(r => r.ing.map(i => i.id)));
  comprar = comprar.filter(id => usados.has(id));

  const antes = alvo.filter(r => faltamPara(r, inicial).length === 0);
  // Com mais de um estilo marcado, o total agregado não diz quanto cada um
  // ganhou. A quebra por estilo é o que permite ver que a lista serve aos dois
  // — ou que um deles ficou de fora.
  const porEstilo = trilhas.map(t => ({
    nome: t.estilo.nome,
    destravadas: t.receitas.filter(r => faltamPara(r, tenho).length === 0).length,
    total: t.receitas.length,
  }));
  return {
    comprar, destravadas, porEstilo,
    ganho: destravadas.length - antes.length,
    total: alvo.length,
  };
}

// Estilos marcados. Vive fora da função porque a lista é redesenhada a cada
// toque e a seleção precisa sobreviver ao redesenho.
const estilosMarcados = new Set();

function abrirMontarBar() {
  estilosMarcados.clear();
  $('#modal-corpo').innerHTML = `
    <h2>Montar meu bar</h2>
    <p class="dica">Diga que tipo de bebida você quer fazer e eu monto a menor
      lista de compras que destrava o máximo de drinks desses estilos — contando
      o que você já tem em casa. <strong>Dá para marcar vários.</strong></p>
    <div class="chips" id="estilos" role="group"
      aria-label="Estilos de bebida (dá para marcar vários)"></div>
    <div id="resultado-kit"></div>`;
  pintarEstilos();
  abrirModal();
}

function pintarEstilos() {
  $('#estilos').innerHTML = ESTILOS.map(e => {
    const on = estilosMarcados.has(e.id);
    return `<button class="chip ${on ? 'on' : ''}" data-estilo="${e.id}"
      aria-pressed="${on}">${on ? '✓ ' : ''}${esc(e.nome)}</button>`;
  }).join('');
}

// Alterna um estilo e recalcula. Marcar e desmarcar são o mesmo gesto — é o
// que a pessoa já aprendeu nos filtros da aba Sugestões.
function mostrarKit(estiloId) {
  estilosMarcados.has(estiloId)
    ? estilosMarcados.delete(estiloId)
    : estilosMarcados.add(estiloId);
  pintarEstilos();

  const alvo = $('#resultado-kit');
  if (!estilosMarcados.size) { alvo.innerHTML = ''; return; }

  const estilos = ESTILOS.filter(e => estilosMarcados.has(e.id));
  const { comprar, destravadas, porEstilo, ganho, total } = montarKit(estilos);
  const nomes = estilos.map(e => e.nome.toLowerCase());
  const quais = nomes.length === 1 ? nomes[0]
    : `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`;

  if (!comprar.length) {
    alvo.innerHTML = `<p class="dica">Você já tem em casa tudo que precisa para
      ${destravadas.length} ${destravadas.length === 1 ? 'drink' : 'drinks'}
      de ${esc(quais)}. Não precisa comprar nada.</p>`;
    return;
  }

  // Com vários estilos, o total agregado esconde se algum ficou de fora.
  const quebra = porEstilo.length > 1
    ? `<ul class="kit-quebra">${porEstilo.map(p => `<li>
        <span>${esc(p.nome)}</span><span>${p.destravadas} de ${p.total}</span></li>`).join('')}</ul>`
    : '';

  const naLista = comprar.filter(id => state.shopping.has(id)).length === comprar.length;
  alvo.innerHTML = `
    <p class="kit-resumo">Com <strong>${comprar.length}
      ${comprar.length === 1 ? 'item' : 'itens'}</strong> você passa a fazer
      <strong>${destravadas.length}</strong> de ${total} drinks
      de ${esc(quais)}${ganho ? ` — ${ganho} a mais que hoje` : ''}.</p>
    ${quebra}
    <h3>Comprar</h3>
    <ul class="ingredientes">${comprar
      .map(id => `<li class="nao-tem">${esc(ING_MAP[id].nome)}</li>`).join('')}</ul>
    <h3>Passa a fazer</h3>
    <ul class="ingredientes">${destravadas
      .map(r => `<li class="tem">${esc(r.nome)}</li>`).join('')}</ul>
    <button class="btn primario" id="btn-kit-lista" ${naLista ? 'disabled' : ''}>
      ${naLista ? '✓ Já está na lista de compras' : '🛒 Mandar para a lista de compras'}</button>`;

  const botao = $('#btn-kit-lista');
  if (naLista) return;
  botao.addEventListener('click', () => {
    comprar.forEach(id => state.shopping.add(id));
    Store.setShopping(state.shopping);
    renderBar();
    fecharModal();
    toast('Lista montada', `${comprar.length} ${comprar.length === 1 ? 'item foi' : 'itens foram'} para a sua lista de compras.`);
  });
}
