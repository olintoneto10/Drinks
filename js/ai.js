// Modo Especialista: conversa com a API da Anthropic direto do navegador.
// A chave fica apenas no localStorage do aparelho do usuário.

const AI_MODEL = 'claude-opus-5';

function buildSystemPrompt(barIds, profileTags, topDrinks, pessoas = []) {
  const itens = [...barIds].map(id => ING_MAP[id]?.nome).filter(Boolean);
  const perfil = profileTags.length
    ? profileTags.map(t => TAG_NOMES[t] || t).join(', ')
    : 'ainda desconhecido';
  const favoritos = topDrinks.length
    ? topDrinks.map(d => `${d.nome} (nota ${d.nota})`).join('; ')
    : 'nenhum registrado ainda';

  return `Você é um bartender especialista e simpático do app MeuBar, conversando em português do Brasil.

O QUE O USUÁRIO TEM EM CASA (além de açúcar, sal e gelo):
${itens.length ? itens.join(', ') : 'nada cadastrado ainda — sugira drinks acessíveis e pergunte o que a pessoa tem'}

PERFIL DE SABOR (aprendido das avaliações no diário): ${perfil}
DRINKS MAIS BEM AVALIADOS PELO USUÁRIO: ${favoritos}

PESSOAS CADASTRADAS E O QUE CADA UMA GOSTA:
${pessoas.length
    ? pessoas.map(p => `- ${p.nome}: gosta de ${p.gostos.length ? p.gostos.join(', ') : '(nada declarado)'}${
        p.evita?.length ? `; NÃO PODE/EVITA: ${p.evita.join(', ')}` : ''}`).join('\n')
    : '- nenhuma pessoa cadastrada além do usuário'}
Se o usuário pedir um drink para uma dessas pessoas, use as preferências dela e
respeite rigorosamente as restrições (especialmente álcool).

Regras:
- Priorize sugestões que usem só o que o usuário tem; se faltar algo, deixe claro o que falta e sugira substituições.
- Para cada sugestão dê: nome, ingredientes com medidas, modo de preparo curto, copo e uma dica de especialista.
- Seja conciso e direto, como um bom bartender de balcão. Use no máximo 2 ou 3 sugestões por resposta.
- Incentive o consumo responsável quando fizer sentido, sem sermão.`;
}

// Analisa a foto da estante e devolve os ids dos ingredientes do catálogo
// que aparecem na imagem.
async function identificarGarrafas(apiKey, base64Jpeg) {
  const catalogo = INGREDIENTES
    .filter(i => !i.basico)
    .map(i => `${i.id}: ${i.nome}`)
    .join('\n');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64Jpeg } },
          {
            type: 'text',
            text: `Esta é a foto do bar/estante de bebidas de um usuário. Identifique quais itens do catálogo abaixo aparecem na foto (garrafas, latas, frutas, etc.).

CATÁLOGO (id: nome):
${catalogo}

Responda APENAS com um array JSON de ids do catálogo, sem nenhum outro texto. Exemplo: ["gin","campari","limao"]. Se não reconhecer nada, responda [].
Inclua um item apenas se estiver razoavelmente confiante. Rum claro conta como rum-branco; whisky americano/bourbon como bourbon; triple sec/Cointreau como licor-laranja.`,
          },
        ],
      }],
    }),
  });

  if (!res.ok) {
    let msg = `Erro ${res.status}`;
    try {
      const err = await res.json();
      if (err?.error?.message) msg += `: ${err.error.message}`;
    } catch { /* corpo não-JSON */ }
    if (res.status === 401) msg = 'Chave de API inválida. Confira na aba IA.';
    throw new Error(msg);
  }

  const data = await res.json();
  if (data.stop_reason === 'refusal') throw new Error('Não consegui analisar essa imagem.');
  const texto = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  const m = texto.match(/\[[\s\S]*?\]/);
  if (!m) return [];
  try {
    const ids = JSON.parse(m[0]);
    return ids.filter(id => ING_MAP[id] && !ING_MAP[id].basico);
  } catch { return []; }
}

async function askExpert(apiKey, systemPrompt, history) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 1500,
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages: history,
    }),
  });

  if (!res.ok) {
    let msg = `Erro ${res.status}`;
    try {
      const err = await res.json();
      if (err?.error?.message) msg += `: ${err.error.message}`;
    } catch { /* corpo não-JSON */ }
    if (res.status === 401) msg = 'Chave de API inválida. Confira em Configurações.';
    throw new Error(msg);
  }

  const data = await res.json();
  if (data.stop_reason === 'refusal') {
    return 'Não consegui responder a esse pedido. Tenta reformular?';
  }
  return (data.content || [])
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('\n');
}
