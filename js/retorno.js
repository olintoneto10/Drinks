// O retorno: o que traz a pessoa de volta e o que ela encontra ao voltar.
//
// Sem servidor não existe push de verdade — e no iOS o push da web só funciona
// para app instalado na tela inicial. Então o convite para voltar sai daqui
// pelo caminho que funciona em qualquer aparelho: um lembrete no calendário
// da própria pessoa, que ela controla e cancela quando quiser.

// ---------- 1. A volta é recebida ----------
const SAUDACOES = [
  { dias: 400, texto: 'Faz mais de um ano. O bar continuou aqui, esperando.' },
  { dias: 180, texto: 'Meio ano sem aparecer. Nada estragou — destilado não tem pressa.' },
  { dias: 60, texto: 'Dois meses. O gelo derreteu, mas a estante está igual.' },
  { dias: 21, texto: 'Três semanas sem um brinde. Que tal hoje?' },
  { dias: 7, texto: 'Uma semana fora. Bom te ver de volta.' },
];

function diasDesdeUltimoAcesso() {
  const ultimo = Store.getUltimoAcesso();
  if (!ultimo) return 0;
  return Math.floor((Date.now() - new Date(ultimo).getTime()) / 86400000);
}

// Calculada uma única vez, no boot: marcarVisita() zera o contador logo em
// seguida, e sem guardar aqui a saudação sumiria na primeira troca de aba.
let saudacaoDaSessao;

function abrirSessao() {
  const dias = diasDesdeUltimoAcesso();
  saudacaoDaSessao = SAUDACOES.find(s => dias >= s.dias) || null;
  marcarVisita();
}

function blocoBoasVoltas() {
  const saudacao = saudacaoDaSessao;
  if (!saudacao) return '';
  const feitos = state.entries.length;
  const rodape = feitos
    ? `Seu diário tem ${feitos} ${feitos === 1 ? 'registro' : 'registros'} guardados.`
    : 'Seu diário ainda está em branco.';
  return `<div class="boas-voltas">
    <span class="rotulo-dia">✦ Bem-vindo de volta</span>
    <p>${esc(saudacao.texto)}</p>
    <p class="bv-rodape">${esc(rodape)}</p>
  </div>`;
}

// Só marca a visita depois que a saudação já foi mostrada, para que ela não
// se apague sozinha ao recarregar a página no mesmo instante.
function marcarVisita() {
  Store.setUltimoAcesso(new Date().toISOString());
}

// ---------- 2. O convite para voltar ----------
const DIAS_SEMANA = [
  { n: 'SU', nome: 'domingo' }, { n: 'MO', nome: 'segunda' }, { n: 'TU', nome: 'terça' },
  { n: 'WE', nome: 'quarta' }, { n: 'TH', nome: 'quinta' }, { n: 'FR', nome: 'sexta' },
  { n: 'SA', nome: 'sábado' },
];

function dobrar(n) { return String(n).padStart(2, '0'); }

// Próxima ocorrência do dia da semana escolhido, no horário escolhido
function proximaData(diaSemana, hora) {
  const agora = new Date();
  const alvo = new Date(agora);
  alvo.setHours(hora, 0, 0, 0);
  const delta = (diaSemana - agora.getDay() + 7) % 7;
  alvo.setDate(agora.getDate() + (delta === 0 && alvo <= agora ? 7 : delta));
  return alvo;
}

// Data em UTC no formato do iCalendar (o fuso do usuário já entrou no cálculo)
function paraICS(d) {
  return d.getUTCFullYear() + dobrar(d.getUTCMonth() + 1) + dobrar(d.getUTCDate())
    + 'T' + dobrar(d.getUTCHours()) + dobrar(d.getUTCMinutes()) + '00Z';
}

// O iCalendar exige quebra CRLF e linhas de no máximo 75 octetos
function dobrarLinhas(linhas) {
  return linhas.flatMap(l => {
    const partes = [];
    let resto = l;
    while (new TextEncoder().encode(resto).length > 75) {
      let corte = 74;
      while (new TextEncoder().encode(resto.slice(0, corte)).length > 74) corte--;
      partes.push((partes.length ? ' ' : '') + resto.slice(0, corte));
      resto = resto.slice(corte);
    }
    partes.push((partes.length ? ' ' : '') + resto);
    return partes;
  }).join('\r\n');
}

function gerarICS(diaSemana, hora) {
  const inicio = proximaData(diaSemana, hora);
  const fim = new Date(inicio.getTime() + 30 * 60000);
  const dia = DIAS_SEMANA[diaSemana];
  return dobrarLinhas([
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MeuBar//Lembrete//PT-BR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:meubar-${Date.now()}@meubar.local`,
    `DTSTAMP:${paraICS(new Date())}`,
    `DTSTART:${paraICS(inicio)}`,
    `DTEND:${paraICS(fim)}`,
    `RRULE:FREQ=WEEKLY;BYDAY=${dia.n}`,
    'SUMMARY:🍹 Hora do bar',
    'DESCRIPTION:Abra o MeuBar e veja o drink do dia. Trinta minutos para você.',
    'BEGIN:VALARM',
    'TRIGGER:-PT10M',
    'ACTION:DISPLAY',
    'DESCRIPTION:🍹 Hora do bar',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]) + '\r\n';
}

function baixarLembrete(diaSemana, hora) {
  const blob = new Blob([gerarICS(diaSemana, hora)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'meubar-hora-do-bar.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Lembrete criado', `Toda ${DIAS_SEMANA[diaSemana].nome} às ${hora}h — abra o arquivo para adicionar ao seu calendário.`);
}

function renderLembrete() {
  const alvo = $('#lembrete');
  if (!alvo) return;
  const opcoes = DIAS_SEMANA
    .map((d, i) => `<option value="${i}"${i === 5 ? ' selected' : ''}>${d.nome}</option>`).join('');
  const horas = [17, 18, 19, 20, 21, 22]
    .map(h => `<option value="${h}"${h === 19 ? ' selected' : ''}>${h}h</option>`).join('');
  alvo.innerHTML = `
    <h2>Hora do bar</h2>
    <p class="dica">Um lembrete semanal no seu calendário, para o bar não virar
      aquela coisa que só acontece quando sobra tempo. Fica no seu aparelho e
      você cancela pelo próprio calendário quando quiser.</p>
    <div class="linha-lembrete">
      <label>Dia<select id="lembrete-dia">${opcoes}</select></label>
      <label>Hora<select id="lembrete-hora">${horas}</select></label>
    </div>
    <button id="btn-lembrete" class="btn">📅 Criar lembrete semanal</button>`;
  $('#btn-lembrete').addEventListener('click', () => {
    baixarLembrete(Number($('#lembrete-dia').value), Number($('#lembrete-hora').value));
  });
}
