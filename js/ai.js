// Modo Especialista: conversa com a API da Anthropic direto do navegador.
// A chave fica apenas no localStorage do aparelho do usuário.

const AI_MODEL = 'claude-opus-5';

function buildSystemPrompt(barIds, profileTags, topDrinks) {
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

Regras:
- Priorize sugestões que usem só o que o usuário tem; se faltar algo, deixe claro o que falta e sugira substituições.
- Para cada sugestão dê: nome, ingredientes com medidas, modo de preparo curto, copo e uma dica de especialista.
- Seja conciso e direto, como um bom bartender de balcão. Use no máximo 2 ou 3 sugestões por resposta.
- Incentive o consumo responsável quando fizer sentido, sem sermão.`;
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
