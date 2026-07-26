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

// Guloso ponderado. Pontuar só "fecha receita agora" trava com a estante
// vazia, porque no começo nenhuma receita está a um item de distância. Então
// cada candidato ganha 1/faltam² por receita em que aparece: quem está perto
// de fechar domina, e quem aparece em muitas ainda acumula.
function montarKit(estilo, maxItens = 8) {
  const alvo = RECEITAS.filter(r => !r.custom && estilo.escolhe(r));
  const inicial = jaTenho();
  const tenho = new Set(inicial);
  let comprar = [];

  while (comprar.length < maxItens) {
    const pontos = new Map();
    for (const r of alvo) {
      const faltam = faltamPara(r, tenho);
      if (!faltam.length) continue;
      const peso = 1 / (faltam.length * faltam.length);
      for (const id of faltam) pontos.set(id, (pontos.get(id) || 0) + peso);
    }
    if (!pontos.size) break;

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
  return { comprar, destravadas, ganho: destravadas.length - antes.length, total: alvo.length };
}

function abrirMontarBar() {
  const chips = ESTILOS.map(e => `<button class="chip" data-estilo="${e.id}">${esc(e.nome)}</button>`).join('');
  $('#modal-corpo').innerHTML = `
    <h2>Montar meu bar</h2>
    <p class="dica">Diga que tipo de bebida você quer fazer e eu monto a menor
      lista de compras que destrava o máximo de drinks desse estilo — contando
      o que você já tem em casa.</p>
    <div class="chips" id="estilos">${chips}</div>
    <div id="resultado-kit"></div>`;
  abrirModal();
}

function mostrarKit(estiloId) {
  const estilo = ESTILOS.find(e => e.id === estiloId);
  $$('#estilos .chip').forEach(c => c.classList.toggle('on', c.dataset.estilo === estiloId));
  const { comprar, destravadas, ganho, total } = montarKit(estilo);
  const alvo = $('#resultado-kit');

  if (!comprar.length) {
    alvo.innerHTML = `<p class="dica">Você já tem em casa tudo que precisa para
      ${destravadas.length} ${destravadas.length === 1 ? 'drink' : 'drinks'} desse
      estilo. Não precisa comprar nada.</p>`;
    return;
  }

  const naLista = comprar.filter(id => state.shopping.has(id)).length === comprar.length;
  alvo.innerHTML = `
    <p class="kit-resumo">Com <strong>${comprar.length}
      ${comprar.length === 1 ? 'item' : 'itens'}</strong> você passa a fazer
      <strong>${destravadas.length}</strong> de ${total} drinks
      ${esc(estilo.nome.toLowerCase())}${ganho ? ` — ${ganho} a mais que hoje` : ''}.</p>
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
