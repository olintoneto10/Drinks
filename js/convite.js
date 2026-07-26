// Cartão de convidado: você manda um link, a pessoa preenche o que gosta e
// devolve outro link que a cadastra no seu app. Tudo pela URL — sem servidor.

function b64urlEncode(texto) {
  const bytes = new TextEncoder().encode(texto);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
}

function urlBase() {
  return location.origin + location.pathname;
}

function compartilharConvite() {
  const url = `${urlBase()}#convidado`;
  compartilharTexto('Cartão do MeuBar',
    `Vou preparar uns drinks! Me conta o que você gosta — leva 30 segundos:\n${url}`);
}

// ---------- Tela do convidado ----------
function abrirCartaoConvidado() {
  const gostos = new Set();
  const evita = new Set();
  const chips = (lista, attr, nomes) => lista.map(t =>
    `<button type="button" class="chip" data-${attr}="${t}">${esc(nomes[t] || TAG_NOMES[t])}</button>`
  ).join('');

  document.body.classList.add('modo-convidado');
  const div = document.createElement('div');
  div.id = 'takeover';
  div.innerHTML = `
    <div class="takeover-caixa">
      <h1>Meu<em>Bar</em></h1>
      <p class="slogan">cartão do convidado</p>
      <div class="orn">· · ✦ · ·</div>
      <p class="dica">Diz aí o que você curte — quem te convidou vai preparar
        um drink com a sua cara.</p>
      <form id="form-convidado">
        <label>Seu nome
          <input name="nome" required maxlength="40" placeholder="Ex.: Marília">
        </label>
        <label>Gosto de drinks...</label>
        <div class="chips" id="chips-gosto">${chips(TAGS_PREFERENCIA, 'gosto', TAG_NOMES)}</div>
        <label>Evito / não posso</label>
        <div class="chips" id="chips-nao">${chips(TAGS_EVITA, 'nao', EVITA_NOMES)}</div>
        <button class="btn primario" type="submit">Enviar minhas preferências</button>
      </form>
    </div>`;
  document.body.appendChild(div);

  const toggle = (containerId, attr, conjunto) => {
    div.querySelector(containerId).addEventListener('click', ev => {
      const chip = ev.target.closest(`[data-${attr}]`);
      if (!chip) return;
      const t = chip.dataset[attr];
      conjunto.has(t) ? conjunto.delete(t) : conjunto.add(t);
      chip.classList.toggle('on', conjunto.has(t));
    });
  };
  toggle('#chips-gosto', 'gosto', gostos);
  toggle('#chips-nao', 'nao', evita);

  div.querySelector('#form-convidado').addEventListener('submit', ev => {
    ev.preventDefault();
    const nome = ev.target.nome.value.trim();
    const dados = b64urlEncode(JSON.stringify({ n: nome, g: [...gostos], e: [...evita] }));
    const url = `${urlBase()}#pessoa=${dados}`;
    div.querySelector('.takeover-caixa').innerHTML = `
      <h1>Meu<em>Bar</em></h1>
      <div class="orn">· · ✦ · ·</div>
      <h2 style="text-align:center">Prontinho, ${esc(nome)}!</h2>
      <p class="dica">Agora é só mandar este link de volta para quem te convidou —
        é ele que cadastra suas preferências.</p>
      <button class="btn primario" id="btn-devolver">Enviar de volta</button>
      <p class="dica" style="word-break:break-all">${esc(url)}</p>`;
    div.querySelector('#btn-devolver').addEventListener('click', () => {
      compartilharTexto('Minhas preferências no MeuBar',
        `Aqui vão minhas preferências de drinks — abre esse link no seu MeuBar:\n${url}`);
    });
  });
}

// ---------- Anfitrião recebe o cartão preenchido ----------
function receberPessoaDaURL(dados) {
  let p;
  try { p = JSON.parse(b64urlDecode(dados)); } catch { return; }
  if (!p?.n) return;

  const gostos = (p.g || []).filter(t => TAGS_PREFERENCIA.includes(t));
  const evita = (p.e || []).filter(t => TAGS_EVITA.includes(t));
  const lista = arr => arr.length
    ? arr.map(t => esc((EVITA_NOMES[t] || TAG_NOMES[t] || t).toLowerCase())).join(', ')
    : '—';

  $('#modal-corpo').innerHTML = `
    <h2>✉️ Cartão recebido</h2>
    <p><strong>${esc(p.n)}</strong> preencheu as preferências:</p>
    <p class="dica">Gosta de: ${lista(gostos)}<br>Evita: ${lista(evita)}</p>
    <button class="btn primario" id="btn-aceitar-pessoa">Adicionar às minhas pessoas</button>
    <button class="btn" id="btn-recusar-pessoa">Agora não</button>`;
  $('#modal').classList.add('aberto');

  const limpar = () => {
    history.replaceState(null, '', urlBase());
    fecharModal();
  };

  $('#btn-aceitar-pessoa').addEventListener('click', () => {
    const existente = state.pessoas.find(x => x.id !== 'eu' &&
      x.nome.toLowerCase() === p.n.trim().toLowerCase());
    if (existente) {
      existente.tags = gostos;
      existente.evita = evita;
      state.pessoaAtiva = existente.id;
    } else {
      const nova = { id: 'p' + Date.now(), nome: p.n.trim(), tags: gostos, evita };
      state.pessoas.push(nova);
      state.pessoaAtiva = nova.id;
    }
    Store.setPessoas(state.pessoas);
    limpar();
    trocarAba('sugestoes');
    renderSugestoes();
  });
  $('#btn-recusar-pessoa').addEventListener('click', limpar);
}

// Chamado no init: decide se a URL é um convite ou um cartão preenchido
function checarConvite() {
  const hash = location.hash || '';
  if (hash === '#convidado') {
    if (!document.getElementById('takeover')) abrirCartaoConvidado();
    return true;
  }
  const m = hash.match(/^#pessoa=(.+)$/);
  if (m) receberPessoaDaURL(m[1]);
  return false;
}

// Abrir o link estando com o app já aberto não recarrega a página — o hash
// muda sozinho, então tratamos o evento também.
window.addEventListener('hashchange', checarConvite);
