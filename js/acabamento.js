// Toque final: guarnições e bitters que combinam com a receita aberta.
//
// É o que um bartender diria ao entregar o copo — "esse aí pede uma casca de
// laranja" — e que o app não dizia. As receitas trazem a guarnição canônica
// quando existe; o que faltava era o passo seguinte, o de quem já fez o drink
// três vezes e quer melhorar.
//
// Duas regras que estruturam o arquivo:
//
// 1. Sugestão, nunca exigência. Nada daqui entra no motor de sugestões nem no
//    "pode fazer agora" — a receita continua sendo o que a receita é. Por isso
//    também não precisam existir no catálogo de ingredientes.
//
// 2. Sem marca. O app inteiro não cita uma marca em lugar nenhum, e começar por
//    aqui abriria a porta para o catálogo virar vitrine. "Bitter de laranja",
//    não a marca X de bitter de laranja.

// Sufixo "Acab" porque GUARNICOES e nomes curtos já existem em art.js — no
// escopo global compartilhado, colidir aqui derruba a página inteira.
const temIngAcab = (r, ...ids) => ids.some(id => r.ing.some(i => i.id === id));
const temTagAcab = (r, ...tags) => tags.some(t => r.tags.includes(t));

// A ordem é a prioridade: a primeira que casar vence o espaço.
const SUGESTOES_GUARNICAO = [
  {
    id: 'casca-laranja', nome: 'Casca de laranja',
    porque: 'torça sobre o copo antes de largar — o óleo da casca acende o amargo e o baunilhado do destilado',
    ing: 'laranja',
    quando: r => temIngAcab(r, 'bourbon', 'whisky', 'conhaque', 'campari', 'amaro', 'vermute-tinto')
      || temTagAcab(r, 'amargo'),
  },
  {
    id: 'casca-limao', nome: 'Casca de limão-siciliano',
    porque: 'levanta o botânico do gin e deixa o final mais seco',
    ing: 'limao',
    quando: r => temIngAcab(r, 'gin', 'vodka', 'vermute-seco') && temTagAcab(r, 'seco', 'citrico'),
  },
  {
    id: 'alecrim', nome: 'Ramo de alecrim',
    porque: 'bata no palmo da mão antes de espetar; o aroma chega antes do gole',
    quando: r => temIngAcab(r, 'gin') && temTagAcab(r, 'seco', 'citrico', 'refrescante'),
  },
  {
    id: 'hortela', nome: 'Buquê de hortelã',
    porque: 'um maço fechado junto ao canudo perfuma sem soltar folha no copo',
    ing: 'hortela',
    quando: r => temTagAcab(r, 'refrescante', 'tropical') && !temIngAcab(r, 'hortela'),
  },
  {
    id: 'pepino', nome: 'Fita de pepino',
    porque: 'descascada no descascador e enrolada dentro do copo — refresca sem adoçar',
    ing: 'pepino',
    quando: r => temIngAcab(r, 'gin', 'vodka', 'saque') && temTagAcab(r, 'refrescante'),
  },
  {
    id: 'cereja', nome: 'Cereja em conserva',
    porque: 'a de verdade, escura e densa; a vermelha fluorescente só serve de enfeite',
    quando: r => temIngAcab(r, 'vermute-tinto', 'maraschino') && temTagAcab(r, 'forte', 'doce'),
  },
  {
    id: 'sal-borda', nome: 'Meia borda de sal',
    porque: 'só metade: quem quiser bebe pelo lado salgado, quem não quiser tem para onde ir',
    quando: r => temIngAcab(r, 'tequila', 'mezcal') && temTagAcab(r, 'citrico'),
  },
  {
    id: 'pimenta-rosa', nome: 'Pimenta-rosa moída na hora',
    porque: 'três grãos amassados por cima dão perfume sem ardência',
    quando: r => temTagAcab(r, 'tropical', 'frutado') && !temTagAcab(r, 'cremoso'),
  },
  {
    id: 'noz-moscada', nome: 'Noz-moscada ralada na hora',
    porque: 'ralada no copo, nunca do pote — a moída perde o óleo em uma semana',
    quando: r => temTagAcab(r, 'cremoso', 'quente'),
  },
  {
    id: 'canela', nome: 'Pau de canela',
    porque: 'passe a chama de um fósforo por ele antes de servir; solta o doce sem açúcar',
    quando: r => temTagAcab(r, 'quente') || temIngAcab(r, 'rum-escuro', 'licor-cafe'),
  },
  {
    id: 'cafe-graos', nome: 'Três grãos de café',
    porque: 'a tradição italiana manda três — saúde, felicidade e prosperidade',
    quando: r => temIngAcab(r, 'licor-cafe', 'cafe-espresso') || (temTagAcab(r, 'cremoso') && temIngAcab(r, 'vodka')),
  },
  {
    id: 'desidratada', nome: 'Rodela de cítrico desidratada',
    porque: 'não molha, não escorrega e dura a noite toda numa bandeja',
    quando: r => temTagAcab(r, 'citrico', 'refrescante'),
  },
  {
    id: 'morango', nome: 'Morango em leque',
    porque: 'três cortes verticais sem separar a base, aberto na borda',
    ing: 'morango',
    quando: r => temIngAcab(r, 'morango', 'xarope-morango', 'espumante') && temTagAcab(r, 'frutado', 'doce'),
  },
  {
    id: 'gengibre', nome: 'Lasca de gengibre',
    porque: 'fina, cortada na hora, apoiada no gelo — pica só no aroma',
    ing: 'gengibre',
    quando: r => temIngAcab(r, 'ginger-beer', 'xarope-gengibre', 'gengibre'),
  },
];

// Bitters: dashes de 35% a 45% de álcool. É pouco no copo, mas não é zero.
const SUGESTOES_BITTER = [
  {
    id: 'angostura', nome: 'Angostura', ing: 'angostura',
    porque: 'dois dashes amarram o doce com o forte — é o sal da coquetelaria',
    quando: r => temTagAcab(r, 'forte', 'doce') && temIngAcab(r, 'bourbon', 'whisky', 'rum-escuro', 'conhaque', 'cachaca'),
  },
  {
    id: 'laranja', nome: 'Bitter de laranja',
    porque: 'um dash em drink de gin com vermute faz o botânico aparecer em camadas',
    quando: r => temIngAcab(r, 'gin', 'vermute-seco', 'vermute-tinto'),
  },
  {
    id: 'peychaud', nome: "Bitter de anis (tipo Peychaud's)",
    porque: 'mais floral e menos apimentado que o Angostura; casa com whisky de centeio',
    quando: r => temIngAcab(r, 'whisky', 'absinto') && temTagAcab(r, 'forte'),
  },
  {
    id: 'cacau', nome: 'Bitter de cacau',
    porque: 'dois dashes em drink cremoso dão profundidade sem somar açúcar',
    quando: r => temTagAcab(r, 'cremoso') || temIngAcab(r, 'licor-cacau', 'licor-cafe'),
  },
  {
    id: 'toranja', nome: 'Bitter de toranja',
    porque: 'puxa o cítrico para o lado amargo e alonga o final',
    quando: r => temTagAcab(r, 'citrico', 'tropical'),
  },
  {
    id: 'aipo', nome: 'Bitter de aipo',
    porque: 'o caminho curto para deixar um drink salgado com cara de coquetel',
    quando: r => temTagAcab(r, 'salgado'),
  },
];

function acabamentosDe(r) {
  const jaTem = new Set(r.ing.map(i => i.id));
  const escolher = (lista, quantos) => lista
    .filter(x => { try { return x.quando(r); } catch { return false; } })
    // Não sugerir o que a receita já pede: seria conselho para fazer o que já
    // está escrito três linhas acima.
    .filter(x => !x.ing || !jaTem.has(x.ing))
    .slice(0, quantos);

  // Bitter é destilado — 35% a 45%. Num drink sem álcool ele quebraria
  // exatamente a promessa que levou a pessoa a escolher aquele drink, e quem
  // evita álcool costuma ter um motivo que não admite "só um dash".
  const semAlcool = r.tags.includes('sem-alcool');
  return {
    guarnicoes: escolher(SUGESTOES_GUARNICAO, 2),
    bitters: semAlcool ? [] : escolher(SUGESTOES_BITTER, 1),
    semAlcool,
  };
}

function blocoAcabamento(r) {
  const { guarnicoes, bitters, semAlcool } = acabamentosDe(r);
  const todos = [...guarnicoes, ...bitters];
  if (!todos.length) return '';

  const linha = x => {
    // O que existe no catálogo vira botão de compra; o resto é só conselho.
    const compra = x.ing && ING_MAP[x.ing]
      ? `<button class="mini ${state.shopping.has(x.ing) ? 'ok' : ''}" data-shop="${x.ing}"
          >${state.shopping.has(x.ing) ? '✓ na lista' : '+ lista'}</button>`
      : '';
    return `<li>
      <div><strong>${esc(x.nome)}</strong> ${compra}</div>
      <span class="porque">${esc(x.porque)}</span>
    </li>`;
  };

  return `<h3>Toque final</h3>
    <p class="dica">Sugestões da casa, fora da receita — ela funciona sem nada
      disto. ${semAlcool ? 'Sem bitters aqui: eles são destilados, e este drink é sem álcool.' : ''}</p>
    <ul class="acabamento">${todos.map(linha).join('')}</ul>`;
}
