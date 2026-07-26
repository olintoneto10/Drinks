// A história por trás de cada drink. Fatos verificáveis; quando a origem é
// disputada, o texto diz isso com todas as letras ("conta-se que", "há quem
// reivindique") — lenda apresentada como lenda.
//
// Receitas sem verbete aqui recebem a ficha derivada (nível, tempo, ocasião) e,
// se o usuário tiver a IA ativada, a história é escrita sob demanda e guardada.

const HISTORIAS = {
  'negroni': {
    origem: 'Florença, Itália · 1919',
    criador: 'Fosco Scarselli, no Caffè Casoni',
    historia: 'O conde Camillo Negroni voltava de uma temporada nos Estados Unidos com o paladar acostumado a bebidas mais fortes. Pediu ao barman que reforçasse seu Americano de sempre: no lugar da água com gás, gin. Scarselli topou — e trocou também a rodela de limão por uma de laranja, para que todos no salão soubessem, de longe, qual era o copo do conde.',
    curiosidade: 'A casca de laranja não é enfeite: é o crachá do conde, repetido há mais de cem anos no mundo inteiro.',
    ocasiao: 'Aperitivo, fim de tarde',
    temperatura: 'Bem gelado, pedra grande',
    harmoniza: 'Azeitonas, queijo curado, presunto cru',
    variacoes: 'Boulevardier (bourbon), Negroni Sbagliato (espumante)',
    cultura: 'Anthony Bourdain o transformou em bandeira; aparece em <i>Um Lugar ao Sol</i>',
  },
  'daiquiri': {
    origem: 'Cuba · por volta de 1898',
    criador: 'Atribuído a Jennings Cox, engenheiro americano',
    historia: 'Nas minas de ferro de Daiquirí, perto de Santiago de Cuba, engenheiros americanos misturavam o rum local com limão e açúcar para tornar o calor suportável. O nome do vilarejo pegou. Décadas depois, no Floridita de Havana, o drink virou rotina de Hemingway — que o pedia sem açúcar e com o dobro de rum.',
    curiosidade: 'Simples ao ponto da crueldade: com três ingredientes, não há onde esconder um rum ruim ou um limão velho.',
    ocasiao: 'Calor, começo de noite',
    temperatura: 'Gelado, coado sem gelo',
    harmoniza: 'Frutos do mar, ceviche',
    variacoes: 'Hemingway Daiquiri (toranja e maraschino), frozen',
    cultura: 'A bebida de Hemingway em Havana',
  },
  'caipirinha': {
    origem: 'Brasil · registrada por volta de 1918',
    criador: 'Popular, sem autoria',
    historia: 'Conta-se que nasceu no interior paulista como remédio caseiro contra a gripe espanhola: cachaça com limão, alho e mel. O alho e o mel foram ficando pelo caminho; o açúcar e o gelo entraram. A origem é oral e disputada, mas o percurso — de xarope de fazenda a cartão de visita do país — é bem documentado.',
    curiosidade: 'É um dos poucos coquetéis com receita fixada por decreto: o governo brasileiro definiu oficialmente o que pode se chamar caipirinha.',
    ocasiao: 'Churrasco, praia, qualquer sexta-feira',
    temperatura: 'Muito gelada, gelo à vontade',
    harmoniza: 'Petiscos fritos, feijoada, queijo coalho',
    variacoes: 'Caipiroska (vodka), caipifrutas, batida',
    cultura: 'Coquetel nacional do Brasil',
  },
  'mojito': {
    origem: 'Havana, Cuba',
    criador: 'Descende do <i>El Draque</i>, do século XVI',
    historia: 'O ancestral do mojito é o El Draque — aguardente de cana, limão, hortelã e açúcar —, que marinheiros usavam como remédio e cujo nome homenageia o corsário Francis Drake. Com a chegada do rum refinado, virou o mojito moderno. La Bodeguita del Medio o transformou em ponto turístico.',
    curiosidade: 'A famosa placa atribuindo a frase "meu mojito na Bodeguita" a Hemingway é ótima propaganda — e de autenticidade bastante contestada por historiadores.',
    ocasiao: 'Tarde quente, varanda',
    temperatura: 'Gelado, gelo triturado',
    harmoniza: 'Comida cubana, peixe grelhado',
    variacoes: 'Virgin mojito, mojito de frutas',
    cultura: 'Cartão-postal de Havana',
  },
  'old-fashioned': {
    origem: 'Estados Unidos · século XIX',
    criador: 'Reivindicado pelo Pendennis Club, Louisville',
    historia: 'Em 1806, um jornal de Nova York definiu "cocktail" como destilado, açúcar, água e bitters — exatamente esta receita. Quando os drinks começaram a ganhar licores e enfeites, os clientes conservadores passaram a pedir o coquetel "à moda antiga". O apelido virou o nome.',
    curiosidade: 'Não é um drink entre outros: é literalmente a definição original da palavra coquetel, sobrevivendo intacta há dois séculos.',
    ocasiao: 'Noite tranquila, conversa longa',
    temperatura: 'Gelado, uma pedra grande só',
    harmoniza: 'Chocolate amargo, charuto, carne vermelha',
    variacoes: 'Wisconsin Old Fashioned, com rum ou conhaque',
    cultura: 'O copo de Don Draper em <i>Mad Men</i>',
  },
  'manhattan': {
    origem: 'Nova York · anos 1880',
    criador: 'Disputado',
    historia: 'A lenda mais repetida atribui o drink a um banquete no Manhattan Club oferecido por Jennie Jerome, mãe de Winston Churchill — mas as datas não fecham: ela estava na Inglaterra, grávida dele. O que se sabe é que o coquetel apareceu nos bares nova-iorquinos dos anos 1880 e nunca mais saiu.',
    curiosidade: 'É o Old Fashioned que trocou a água por vermute — e, com isso, inventou a família inteira dos coquetéis com vinho aromatizado.',
    ocasiao: 'Antes do jantar, ocasião formal',
    temperatura: 'Mexido com gelo, servido sem',
    harmoniza: 'Queijos azuis, castanhas',
    variacoes: 'Perfect Manhattan, Rob Roy (uísque escocês)',
    cultura: 'Presença constante no cinema noir',
  },
  'martini-seco': {
    origem: 'Estados Unidos · virada do século XX',
    criador: 'Evolução do Martinez',
    historia: 'Começou doce e foi secando década após década: no começo, meio a meio com vermute; nos anos 1950, apenas um sussurro. Churchill dizia bastar olhar para a garrafa de vermute do outro lado do salão. É menos uma receita do que uma discussão de cem anos sobre proporção.',
    curiosidade: 'Bond pede batido, não mexido — e todo bartender range os dentes: bater quebra o gelo e turva a bebida, que deveria ser límpida como cristal.',
    ocasiao: 'Aperitivo, ocasião elegante',
    temperatura: 'Gélido, taça congelada',
    harmoniza: 'Azeitona, ostras, amêndoas salgadas',
    variacoes: 'Dirty, Gibson (cebolinha), Vesper',
    cultura: 'A assinatura de James Bond',
  },
  'gin-tonica': {
    origem: 'Índia colonial britânica · século XIX',
    criador: 'Oficiais do exército britânico',
    historia: 'A água tônica nasceu remédio: quinino contra a malária, amargo a ponto de ser intragável. Os oficiais britânicos passaram a cortá-la com gin, açúcar e limão. O remédio virou ritual — e o ritual, um dos coquetéis mais bebidos do planeta.',
    curiosidade: 'Churchill brincava que o gin com tônica salvou mais vidas de ingleses do que todos os médicos do Império.',
    ocasiao: 'Qualquer hora, calor',
    temperatura: 'Muito gelado, taça cheia de gelo',
    harmoniza: 'Petiscos leves, frutos do mar',
    variacoes: 'Gin tônica com especiarias, com frutas cítricas',
    cultura: 'Renasceu nos anos 2000 pela mão dos bares espanhóis',
  },
  'moscow-mule': {
    origem: 'Los Angeles, EUA · 1941',
    criador: 'John G. Martin e Jack Morgan',
    historia: 'Três estoques encalhados num só balcão: um importador com vodka que ninguém queria, um dono de bar com ginger beer parada e uma sócia com canecas de cobre sem saída. Juntaram os três no Cock\'n Bull, saíram fotografando o drink pelos bares da cidade — e criaram, de quebra, o gosto americano por vodka.',
    curiosidade: 'A caneca de cobre não é frescura: o metal transmite o frio rápido e mantém a bebida gelada por muito mais tempo.',
    ocasiao: 'Happy hour, calor',
    temperatura: 'Muito gelado, caneca gelada',
    harmoniza: 'Comida apimentada, tacos',
    variacoes: 'Mule com gin, com uísque, com tequila',
    cultura: 'Uma das campanhas de marketing mais bem-sucedidas do século',
  },
  'espresso-martini': {
    origem: 'Londres · fim dos anos 1980',
    criador: 'Dick Bradsell',
    historia: 'Uma modelo chegou ao balcão onde Bradsell trabalhava e pediu algo que a acordasse e depois a derrubasse. Ele tinha uma máquina de espresso ao lado do bar. Nascia — com outro nome, Vodka Espresso — o coquetel que quarenta anos depois tomaria as cartas do mundo inteiro.',
    curiosidade: 'A espuma não vem de clara nem de creme: são os óleos do café, emulsionados pela batida vigorosa. Café velho não faz espuma.',
    ocasiao: 'Depois do jantar, antes da noite começar',
    temperatura: 'Gelado, taça sem gelo',
    harmoniza: 'Sobremesa de chocolate, tiramisù',
    variacoes: 'Com licor de avelã, com tequila',
    cultura: 'O coquetel-símbolo da retomada dos bares nos anos 2020',
  },
  'bramble': {
    origem: 'Londres · 1984',
    criador: 'Dick Bradsell, no Fred\'s Club',
    historia: 'Bradsell queria um drink que fosse inglês de verdade, sem parecer importado. Voltou à infância na Ilha de Wight, às tardes colhendo amoras silvestres no mato, e desenhou o gosto daquilo: gin, limão, açúcar e um fio de licor de amora sangrando pelo gelo triturado.',
    curiosidade: 'O licor é despejado por cima de propósito, sem misturar — o desenho vermelho descendo pelo gelo é parte da receita.',
    ocasiao: 'Tarde de verão',
    temperatura: 'Gelado, gelo triturado',
    harmoniza: 'Sobremesas de frutas vermelhas',
    variacoes: 'Com uísque, com frutas da estação',
    cultura: 'Um dos primeiros "clássicos modernos" reconhecidos',
  },
  'pina-colada': {
    origem: 'San Juan, Porto Rico · 1954',
    criador: 'Ramón "Monchito" Marrero, no Caribe Hilton',
    historia: 'Marrero passou três meses testando combinações até chegar ao ponto: queria um drink que resumisse a ilha inteira em um copo. Serviu-o por 35 anos no mesmo hotel. Em 1978, Porto Rico o declarou bebida oficial do país.',
    curiosidade: 'O nome descreve a receita: <i>piña</i> (abacaxi) <i>colada</i> (coada) — o suco de abacaxi espremido e passado na peneira.',
    ocasiao: 'Praia, piscina, férias',
    temperatura: 'Gelado, batido com gelo',
    harmoniza: 'Frutas tropicais, camarão empanado',
    variacoes: 'Chi Chi (vodka), versão sem álcool',
    cultura: 'Imortalizada na canção <i>Escape</i>, de Rupert Holmes',
  },
  'irish-coffee': {
    origem: 'Foynes, Irlanda · 1943',
    criador: 'Joe Sheridan',
    historia: 'Um voo transatlântico voltou ao aeroporto por causa do tempo ruim, e os passageiros desembarcaram encharcados e congelando de madrugada. O chef Sheridan improvisou café com uísque e creme por cima. Um americano perguntou se aquilo era café brasileiro; ele respondeu que era café irlandês.',
    curiosidade: 'O creme tem que ser levemente batido e boiar: bebe-se o café quente <i>através</i> da camada fria de creme — o contraste é o drink.',
    ocasiao: 'Noite fria, depois do jantar',
    temperatura: 'Quente, com creme frio por cima',
    harmoniza: 'Sobremesas, torta de maçã',
    variacoes: 'Com conhaque, com licor de café',
    cultura: 'Cruzou o Atlântico em 1952 e virou instituição em São Francisco',
  },
  'aperol-spritz': {
    origem: 'Vêneto, Itália',
    criador: 'Herança austríaca, batizada em Pádua',
    historia: 'Quando o Vêneto pertencia ao império austríaco, os soldados achavam o vinho local forte demais e pediam um esguicho — <i>spritzen</i> — de água. O costume ficou. Em 1919, os irmãos Barbieri criaram o Aperol em Pádua, e a Itália juntou as duas heranças no copo.',
    curiosidade: 'Monta-se pela ordem inversa da intuição: espumante primeiro, Aperol depois — assim ele desce e colore a bebida sozinho.',
    ocasiao: 'Aperitivo, fim de tarde ao ar livre',
    temperatura: 'Muito gelado, taça cheia de gelo',
    harmoniza: 'Azeitonas, batatinhas, presunto de Parma',
    variacoes: 'Spritz com Campari, Hugo, Select',
    cultura: 'O som do verão europeu',
  },
  'cosmopolitan': {
    origem: 'Estados Unidos · anos 1980',
    criador: 'Disputado; consagrado por Dale DeGroff',
    historia: 'Várias pessoas reivindicam a criação — de Miami a São Francisco. O que não se discute é quem o tornou mundial: Dale DeGroff o serviu no Rainbow Room, em Nova York, e a televisão fez o resto nos anos 1990.',
    curiosidade: 'Sofreu a pior das vinganças do sucesso: virou tão onipresente que os bares passaram a ter vergonha dele. Feito com limão espremido na hora, é excelente.',
    ocasiao: 'Noite, encontro com amigos',
    temperatura: 'Gelado, taça sem gelo',
    harmoniza: 'Canapés, salmão defumado',
    variacoes: 'Com frutas vermelhas, versão seca',
    cultura: 'A marca registrada de <i>Sex and the City</i>',
  },
  'penicillin': {
    origem: 'Nova York · 2005',
    criador: 'Sam Ross, no Milk & Honey',
    historia: 'Ross pegou a lógica de um remédio caseiro de avó — mel, limão e gengibre — e o levou a sério, com uísque escocês na base e um fio de single malt defumado por cima. O nome é piada e diagnóstico ao mesmo tempo.',
    curiosidade: 'É considerado um dos poucos drinks criados neste século que já entrou no cânone dos clássicos, ao lado de receitas centenárias.',
    ocasiao: 'Noite fria, quando a garganta pede',
    temperatura: 'Gelado, pedra grande',
    harmoniza: 'Queijos defumados, castanhas',
    variacoes: 'Com bourbon, com mel de flores',
    cultura: 'Clássico moderno instantâneo',
  },
  'tom-collins': {
    origem: 'Nova York · 1874',
    criador: 'Batizado por uma pegadinha',
    historia: 'Em 1874 espalhou-se por Nova York uma brincadeira: dizia-se a alguém que um tal Tom Collins estava num bar da esquina falando mal dele. A vítima saía furiosa procurando o sujeito de bar em bar. Os bartenders, espertos, criaram um drink com o nome — para servir a quem chegasse perguntando.',
    curiosidade: 'É provavelmente o único coquetel clássico que existe por causa de uma piada coletiva que tomou uma cidade inteira.',
    ocasiao: 'Tarde quente, jardim',
    temperatura: 'Gelado, copo alto com gelo',
    harmoniza: 'Petiscos leves, saladas',
    variacoes: 'John Collins (uísque), Vodka Collins',
    cultura: 'O "Great Tom Collins Hoax" de 1874',
  },
  'french-75': {
    origem: 'Paris · 1915',
    criador: 'Atribuído a Harry MacElhone',
    historia: 'Batizado em plena Primeira Guerra com o nome do canhão francês de 75 milímetros, o mais temido da artilharia aliada. Diziam que o efeito da bebida lembrava levar um tiro da peça — gim e champanhe fazem mesmo um estrago elegante.',
    curiosidade: 'É um dos raros clássicos que sobem: começa como um sour comum e termina com champanhe, mudando de textura no meio do gole.',
    ocasiao: 'Celebração, brinde',
    temperatura: 'Muito gelado, taça flute',
    harmoniza: 'Ostras, canapés, queijos frescos',
    variacoes: 'French 76 (vodka), com conhaque',
    cultura: 'Aparece em <i>Casablanca</i>',
  },
  'bellini': {
    origem: 'Veneza, Itália · 1948',
    criador: 'Giuseppe Cipriani, no Harry\'s Bar',
    historia: 'Cipriani fazia purê de pêssegos brancos e o misturava ao prosecco. O tom rosado da bebida lembrou-lhe a toga de um santo num quadro de Giovanni Bellini, pintor veneziano do século XV, então em exposição na cidade. O nome ficou.',
    curiosidade: 'A receita original exige pêssego branco, não amarelo — a diferença de perfume é o motivo de o drink existir.',
    ocasiao: 'Brunch, comemoração',
    temperatura: 'Gelado, taça flute',
    harmoniza: 'Café da manhã, frutas, presunto cru',
    variacoes: 'Rossini (morango), Mimosa (laranja)',
    cultura: 'O Harry\'s Bar de Veneza é monumento nacional italiano',
  },
  'bloody-mary': {
    origem: 'Paris · anos 1920',
    criador: 'Fernand Petiot, no Harry\'s New York Bar',
    historia: 'Petiot começou misturando partes iguais de vodka e suco de tomate em Paris. Levou a receita para o St. Regis, em Nova York, onde foi obrigado a rebatizá-la de Red Snapper por pudor do hotel — mas o nome original venceu.',
    curiosidade: 'É o único clássico que se tempera como um prato: sal, pimenta, molho inglês, tabasco. Cada bartender tem sua receita secreta de tempero.',
    ocasiao: 'Brunch, domingo de manhã',
    temperatura: 'Gelado, copo alto',
    harmoniza: 'Ovos, bacon, frutos do mar',
    variacoes: 'Red Snapper (gin), Michelada (cerveja)',
    cultura: 'Fama imortal de cura para ressaca',
  },
  'sidecar': {
    origem: 'Paris ou Londres · anos 1920',
    criador: 'Disputado entre Harry MacElhone e Pat MacGarry',
    historia: 'Conta-se que um cliente habitual chegava ao bar no sidecar da motocicleta de seu motorista, sempre no fim da tarde, e pedia algo que o esquentasse antes do jantar. O apelido do veículo virou o nome da bebida.',
    curiosidade: 'A borda de açúcar divide bartenders há um século: metade jura que é essencial, a outra metade que é heresia sobre um drink já equilibrado.',
    ocasiao: 'Antes do jantar, noite fria',
    temperatura: 'Gelado, taça sem gelo',
    harmoniza: 'Queijos maturados, sobremesas cítricas',
    variacoes: 'Com rum, com bourbon',
    cultura: 'Ícone da Paris dos anos 1920',
  },
  'rabo-de-galo': {
    origem: 'Brasil · anos 1950',
    criador: 'Popular, de boteco',
    historia: 'Nasceu simples como só o boteco brasileiro sabe: cachaça e vermute, na medida do olho. Ganhou fama com a chegada dos aperitivos amargos italianos ao país e virou o aperitivo nacional — barato, direto e sem cerimônia.',
    curiosidade: '"Rabo de galo" é a tradução literal de <i>cocktail</i>. O Brasil batizou seu coquetel simplesmente de "coquetel".',
    ocasiao: 'Fim de tarde, boteco',
    temperatura: 'Gelado, copo baixo',
    harmoniza: 'Petiscos de boteco, torresmo, queijo',
    variacoes: 'Com Cynar, com licor de ervas',
    cultura: 'Redescoberto pela nova coquetelaria brasileira',
  },
  'boulevardier': {
    origem: 'Paris · anos 1920',
    criador: 'Erskine Gwynne',
    historia: 'Gwynne era um americano rico que editava em Paris uma revista literária chamada <i>The Boulevardier</i>. Frequentava o Harry\'s Bar e pedia seu Negroni com bourbon no lugar do gin. Harry MacElhone anotou a variação em seu livro com o nome da revista.',
    curiosidade: 'A troca parece pequena, mas muda tudo: o bourbon adoça e arredonda o amargo do Campari que o gin deixava afiado.',
    ocasiao: 'Noite fria, conversa longa',
    temperatura: 'Gelado, pedra grande',
    harmoniza: 'Carnes vermelhas, chocolate amargo',
    variacoes: 'Old Pal (mais seco), com centeio',
    cultura: 'O Negroni do inverno',
  },
  'cuba-libre': {
    origem: 'Havana, Cuba · por volta de 1900',
    criador: 'Soldados e cubanos no pós-guerra',
    historia: 'Depois da guerra hispano-americana, a Coca-Cola chegou a Cuba junto com as tropas americanas. Rum cubano, refrigerante americano e um brinde que era palavra de ordem política: "¡Por Cuba libre!" — por Cuba livre.',
    curiosidade: 'Sem o limão espremido não é Cuba Libre, é rum com Coca-Cola. A acidez é o que separa os dois.',
    ocasiao: 'Festa, encontro informal',
    temperatura: 'Gelado, copo alto',
    harmoniza: 'Comida de festa, petiscos fritos',
    variacoes: 'Com rum escuro, com limão siciliano',
    cultura: 'Um brinde político que virou bebida',
  },
};

// ---------- Ficha derivada: vale para as 47 receitas ----------
function nivelDaReceita(r) {
  const p = (r.preparo || '').toLowerCase();
  const temClara = r.ing.some(i => i.id === 'ovo');
  if (temClara || p.includes('liquidificador') || p.includes('coe duplo')) return 3;
  if (p.includes('bata') || p.includes('macere') || p.includes('coqueteleira')) return 2;
  return 1;
}

const NIVEL_NOMES = { 1: 'iniciante', 2: 'intermediário', 3: 'avançado' };

function tempoDaReceita(r) {
  const n = nivelDaReceita(r);
  const ings = r.ing.filter(i => !BASICOS.has(i.id)).length;
  return Math.min(6, n + Math.ceil(ings / 3));
}

function ocasiaoDerivada(r) {
  if (r.tags.includes('quente')) return 'Noite fria';
  if (r.tags.includes('sem-alcool')) return 'Qualquer hora do dia';
  if (r.tags.includes('cremoso')) return 'Depois do jantar';
  if (r.tags.includes('amargo')) return 'Aperitivo, antes de comer';
  if (r.tags.includes('tropical') || r.tags.includes('refrescante')) return 'Calor, tarde ao ar livre';
  return 'Noite, encontro com amigos';
}

// História guardada pelo usuário (escrita pela IA sob demanda)
function historiaDe(id) {
  return HISTORIAS[id] || Store.getHistorias()[id] || null;
}

// Bloco de história no modal. Sem história, mostra o convite — a lacuna de
// curiosidade é o que faz abrir o próximo drink.
function blocoHistoria(r, h) {
  const linha = (rotulo, valor) => valor
    ? `<li><span>${rotulo}</span><span>${valor}</span></li>` : '';

  if (!h) {
    const ficha = `<ul class="ficha-drink">
      ${linha('Ocasião', esc(ocasiaoDerivada(r)))}
      ${linha('Copo', esc(r.copo))}
    </ul>`;
    if (r.custom) return ficha;
    return `${ficha}
      <button class="btn btn-descobrir" data-descobrir="${r.id}">
        ✦ Descobrir a história deste drink</button>`;
  }

  return `
    <div class="historia">
      <span class="rotulo-hist">A história</span>
      <p>${h.historia}</p>
      ${h.criador ? `<p class="assinatura">— ${h.criador}</p>` : ''}
      ${h.curiosidade ? `<p class="curiosidade">${h.curiosidade}</p>` : ''}
      <ul class="ficha-drink">
        ${linha('Ocasião', h.ocasiao || ocasiaoDerivada(r))}
        ${linha('Temperatura', h.temperatura)}
        ${linha('Harmoniza com', h.harmoniza)}
        ${linha('Variações', h.variacoes)}
        ${linha('Na cultura', h.cultura)}
      </ul>
      <a class="btn btn-video" target="_blank" rel="noopener"
        href="https://open.spotify.com/search/${encodeURIComponent(r.nome + ' bar jazz')}">
        ♫ Trilha para este drink</a>
      ${h.porIA ? '<p class="dica">História escrita pelo Especialista.</p>' : ''}
    </div>`;
}

// Pede ao Especialista a história de um drink sem verbete e guarda no aparelho
async function buscarHistoriaIA(receita) {
  const chave = Store.getApiKey();
  if (!chave) return null;
  const resposta = await askExpert(chave,
    'Você é um historiador de coquetelaria. Responda SOMENTE com um objeto JSON válido, ' +
    'sem cercas de código, com as chaves: origem (cidade/país e época), criador, historia ' +
    '(2 a 3 frases, em português do Brasil, tom de bartender culto; se a origem for ' +
    'disputada, diga "conta-se que"), curiosidade (1 frase surpreendente), ocasiao, ' +
    'temperatura, harmoniza, variacoes, cultura (filme, série ou fato cultural; se não ' +
    'houver, string vazia).',
    [{ role: 'user', content: `Conte a história do drink "${receita.nome}", feito com ${receita.ing.map(i => ING_MAP[i.id]?.nome || i.id).join(', ')}.` }]);
  const m = resposta.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    const dados = JSON.parse(m[0]);
    const guardadas = Store.getHistorias();
    guardadas[receita.id] = { ...dados, porIA: true };
    Store.setHistorias(guardadas);
    return guardadas[receita.id];
  } catch { return null; }
}
