// Catálogo de ingredientes e receitas do MeuBar.
// Ingredientes "basicos" (açúcar, sal, gelo, pimenta) são considerados sempre disponíveis.

const CATEGORIAS = [
  { id: 'destilados', nome: 'Destilados' },
  { id: 'licores', nome: 'Licores, vermutes e vinhos' },
  { id: 'mixers', nome: 'Mixers e sucos' },
  { id: 'xaropes', nome: 'Xaropes e adoçantes' },
  { id: 'frescos', nome: 'Frutas e frescos' },
  { id: 'outros', nome: 'Outros' },
];

const INGREDIENTES = [
  // Destilados
  { id: 'cachaca', nome: 'Cachaça', cat: 'destilados' },
  { id: 'vodka', nome: 'Vodka', cat: 'destilados' },
  { id: 'gin', nome: 'Gin', cat: 'destilados' },
  { id: 'rum-branco', nome: 'Rum branco', cat: 'destilados' },
  { id: 'rum-escuro', nome: 'Rum escuro', cat: 'destilados' },
  { id: 'tequila', nome: 'Tequila', cat: 'destilados' },
  { id: 'whisky', nome: 'Whisky', cat: 'destilados' },
  { id: 'bourbon', nome: 'Bourbon', cat: 'destilados' },
  { id: 'conhaque', nome: 'Conhaque', cat: 'destilados' },
  { id: 'mezcal', nome: 'Mezcal', cat: 'destilados' },
  { id: 'pisco', nome: 'Pisco', cat: 'destilados' },
  // Licores, vermutes e vinhos
  { id: 'licor-laranja', nome: 'Licor de laranja (triple sec / Cointreau)', cat: 'licores' },
  { id: 'licor-cafe', nome: 'Licor de café', cat: 'licores' },
  { id: 'licor-cassis', nome: 'Licor de cassis / amora', cat: 'licores' },
  { id: 'licor-pessego', nome: 'Licor de pêssego', cat: 'licores' },
  { id: 'licor-sabugueiro', nome: 'Licor de flor de sabugueiro (St-Germain)', cat: 'licores' },
  { id: 'vermute-seco', nome: 'Vermute seco', cat: 'licores' },
  { id: 'vermute-tinto', nome: 'Vermute tinto', cat: 'licores' },
  { id: 'campari', nome: 'Campari', cat: 'licores' },
  { id: 'aperol', nome: 'Aperol', cat: 'licores' },
  { id: 'amaro', nome: 'Amaro (Nonino, Averna, Ramazzotti)', cat: 'licores' },
  { id: 'chartreuse-verde', nome: 'Chartreuse verde', cat: 'licores' },
  { id: 'chartreuse-amarelo', nome: 'Chartreuse amarelo', cat: 'licores' },
  { id: 'maraschino', nome: 'Maraschino (licor de marasca)', cat: 'licores' },
  { id: 'absinto', nome: 'Absinto', cat: 'licores' },
  { id: 'espumante', nome: 'Espumante / prosecco', cat: 'licores' },
  { id: 'licor-coco', nome: 'Licor de coco (Malibu)', cat: 'licores' },
  { id: 'licor-cacau', nome: 'Licor de cacau (crème de cacao)', cat: 'licores' },
  { id: 'licor-menta', nome: 'Licor de menta (crème de menthe)', cat: 'licores' },
  { id: 'amaretto', nome: 'Amaretto', cat: 'licores' },
  { id: 'fernet', nome: 'Fernet', cat: 'licores' },
  { id: 'xerez', nome: 'Xerez seco (fino / manzanilla)', cat: 'licores' },
  { id: 'saque', nome: 'Saquê', cat: 'licores' },
  { id: 'curacau-azul', nome: 'Curaçau azul', cat: 'licores' },
  { id: 'vinho-branco', nome: 'Vinho branco seco', cat: 'licores' },
  { id: 'vinho-tinto', nome: 'Vinho tinto', cat: 'licores' },
  // Mixers e sucos
  { id: 'agua-tonica', nome: 'Água tônica', cat: 'mixers' },
  { id: 'agua-com-gas', nome: 'Água com gás', cat: 'mixers' },
  { id: 'refrigerante-cola', nome: 'Refrigerante de cola', cat: 'mixers' },
  { id: 'ginger-beer', nome: 'Ginger beer / ginger ale', cat: 'mixers' },
  { id: 'refrigerante-limao', nome: 'Refrigerante de limão (Sprite / 7up)', cat: 'mixers' },
  { id: 'cerveja', nome: 'Cerveja (pilsen / lager)', cat: 'mixers' },
  { id: 'agua-de-coco', nome: 'Água de coco', cat: 'mixers' },
  { id: 'suco-laranja', nome: 'Suco de laranja', cat: 'mixers' },
  { id: 'suco-abacaxi', nome: 'Suco de abacaxi', cat: 'mixers' },
  { id: 'suco-cranberry', nome: 'Suco de cranberry', cat: 'mixers' },
  { id: 'suco-tomate', nome: 'Suco de tomate', cat: 'mixers' },
  { id: 'suco-toranja', nome: 'Suco de toranja (grapefruit)', cat: 'mixers' },
  { id: 'cafe-espresso', nome: 'Café espresso', cat: 'mixers' },
  { id: 'leite-de-coco', nome: 'Leite de coco', cat: 'mixers' },
  { id: 'leite-condensado', nome: 'Leite condensado', cat: 'mixers' },
  { id: 'creme-de-leite', nome: 'Creme de leite fresco', cat: 'mixers' },
  // Xaropes e adoçantes — a prateleira que separa o drink caseiro do drink de bar
  { id: 'xarope-simples', nome: 'Xarope simples (açúcar e água)', cat: 'xaropes' },
  { id: 'grenadine', nome: 'Xarope de romã (grenadine)', cat: 'xaropes' },
  { id: 'xarope-tangerina', nome: 'Xarope de tangerina', cat: 'xaropes' },
  { id: 'xarope-gengibre', nome: 'Xarope de gengibre', cat: 'xaropes' },
  { id: 'xarope-maca-verde', nome: 'Xarope de maçã verde', cat: 'xaropes' },
  { id: 'xarope-morango', nome: 'Xarope de morango', cat: 'xaropes' },
  { id: 'xarope-framboesa', nome: 'Xarope de framboesa', cat: 'xaropes' },
  { id: 'xarope-maracuja', nome: 'Xarope de maracujá', cat: 'xaropes' },
  { id: 'xarope-baunilha', nome: 'Xarope de baunilha', cat: 'xaropes' },
  { id: 'xarope-canela', nome: 'Xarope de canela', cat: 'xaropes' },
  { id: 'xarope-caramelo', nome: 'Xarope de caramelo', cat: 'xaropes' },
  { id: 'xarope-hortela', nome: 'Xarope de hortelã / menta', cat: 'xaropes' },
  { id: 'xarope-orgeat', nome: 'Xarope de amêndoa (orgeat)', cat: 'xaropes' },
  { id: 'xarope-falernum', nome: 'Falernum (especiarias, cravo e limão)', cat: 'xaropes' },
  { id: 'xarope-agave', nome: 'Xarope de agave', cat: 'xaropes' },
  // Frutas e frescos
  { id: 'limao', nome: 'Limão (tahiti)', cat: 'frescos' },
  { id: 'laranja', nome: 'Laranja', cat: 'frescos' },
  { id: 'morango', nome: 'Morango', cat: 'frescos' },
  { id: 'melancia', nome: 'Melancia', cat: 'frescos' },
  { id: 'kiwi', nome: 'Kiwi', cat: 'frescos' },
  { id: 'caju', nome: 'Caju', cat: 'frescos' },
  { id: 'abacaxi', nome: 'Abacaxi', cat: 'frescos' },
  { id: 'maracuja', nome: 'Maracujá', cat: 'frescos' },
  { id: 'pessego', nome: 'Pêssego', cat: 'frescos' },
  { id: 'hortela', nome: 'Hortelã', cat: 'frescos' },
  { id: 'manjericao', nome: 'Manjericão', cat: 'frescos' },
  { id: 'pepino', nome: 'Pepino', cat: 'frescos' },
  { id: 'gengibre', nome: 'Gengibre', cat: 'frescos' },
  { id: 'mel', nome: 'Mel', cat: 'frescos' },
  { id: 'ovo', nome: 'Ovo (clara)', cat: 'frescos' },
  // Outros
  { id: 'angostura', nome: 'Angostura bitters', cat: 'outros' },
  { id: 'molho-ingles', nome: 'Molho inglês', cat: 'outros' },
  { id: 'pacoca', nome: 'Paçoca / amendoim', cat: 'outros' },
  { id: 'cha-preto', nome: 'Chá preto ou mate', cat: 'outros' },
  // Básicos (sempre disponíveis)
  { id: 'acucar', nome: 'Açúcar', cat: 'outros', basico: true },
  { id: 'sal', nome: 'Sal', cat: 'outros', basico: true },
  { id: 'gelo', nome: 'Gelo', cat: 'outros', basico: true },
];

const ING_MAP = Object.fromEntries(INGREDIENTES.map(i => [i.id, i]));
const BASICOS = new Set(INGREDIENTES.filter(i => i.basico).map(i => i.id));

// Tags de sabor usadas no perfil: citrico, doce, amargo, seco, refrescante,
// cremoso, frutado, forte, quente, tropical, sem-alcool
const RECEITAS = [
  {
    id: 'caipirinha', nome: 'Caipirinha', copo: 'Copo baixo', tags: ['citrico', 'refrescante', 'forte'],
    ing: [{ id: 'cachaca', q: '60 ml' }, { id: 'limao', q: '1 unidade' }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Corte o limão em pedaços, retire o miolo branco e macere com o açúcar no copo. Complete com gelo, adicione a cachaça e misture bem.',
  },
  {
    id: 'caipiroska', nome: 'Caipiroska', copo: 'Copo baixo', tags: ['citrico', 'refrescante'],
    ing: [{ id: 'vodka', q: '60 ml' }, { id: 'limao', q: '1 unidade' }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Macere o limão com o açúcar, complete com gelo, adicione a vodka e misture.',
  },
  {
    id: 'caipifruta-morango', nome: 'Caipifruta de Morango', copo: 'Copo baixo', tags: ['doce', 'frutado', 'refrescante'],
    ing: [{ id: 'cachaca', q: '60 ml' }, { id: 'morango', q: '4 unidades' }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Macere os morangos com o açúcar, complete com gelo, adicione a cachaça e misture. Fica ótima com meio limão junto.',
  },
  {
    id: 'mojito', nome: 'Mojito', copo: 'Copo alto', tags: ['citrico', 'refrescante'],
    ing: [{ id: 'rum-branco', q: '50 ml' }, { id: 'limao', q: '1/2 unidade' }, { id: 'hortela', q: '8 folhas' }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'agua-com-gas', q: 'para completar' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Macere levemente a hortelã com o açúcar e o suco do limão (sem rasgar as folhas). Adicione gelo, o rum e complete com água com gás. Decore com um ramo de hortelã.',
  },
  {
    id: 'gin-tonica', nome: 'Gin Tônica', copo: 'Taça grande', tags: ['seco', 'refrescante'],
    ing: [{ id: 'gin', q: '50 ml' }, { id: 'agua-tonica', q: '150 ml' }, { id: 'limao', q: '1 fatia' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Encha a taça de gelo, adicione o gin, complete com tônica gelada e finalize com uma fatia de limão. Especiarias como zimbro e alecrim elevam o drink.',
  },
  {
    id: 'negroni', nome: 'Negroni', copo: 'Copo baixo', tags: ['amargo', 'forte'],
    ing: [{ id: 'gin', q: '30 ml' }, { id: 'campari', q: '30 ml' }, { id: 'vermute-tinto', q: '30 ml' }, { id: 'laranja', q: '1 fatia', opcional: true }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Misture partes iguais de gin, Campari e vermute tinto direto no copo com gelo. Mexa por 15 segundos e decore com laranja.',
  },
  {
    id: 'boulevardier', nome: 'Boulevardier', copo: 'Copo baixo', tags: ['amargo', 'forte'],
    ing: [{ id: 'bourbon', q: '45 ml' }, { id: 'campari', q: '30 ml' }, { id: 'vermute-tinto', q: '30 ml' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Um Negroni de bourbon: misture tudo com gelo, mexa bem e decore com casca de laranja.',
  },
  {
    id: 'americano', nome: 'Americano', copo: 'Copo alto', tags: ['amargo', 'refrescante'],
    ing: [{ id: 'campari', q: '30 ml' }, { id: 'vermute-tinto', q: '30 ml' }, { id: 'agua-com-gas', q: 'para completar' }, { id: 'laranja', q: '1 fatia', opcional: true }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Monte no copo com gelo: Campari, vermute e complete com água com gás. Leve e aperitivo perfeito.',
  },
  {
    id: 'aperol-spritz', nome: 'Aperol Spritz', copo: 'Taça de vinho', tags: ['amargo', 'refrescante', 'frutado'],
    ing: [{ id: 'aperol', q: '60 ml' }, { id: 'espumante', q: '90 ml' }, { id: 'agua-com-gas', q: '30 ml' }, { id: 'laranja', q: '1 fatia' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Na taça com bastante gelo: espumante, Aperol e um toque de água com gás. Decore com laranja.',
  },
  {
    id: 'hugo-spritz', nome: 'Hugo Spritz', copo: 'Taça de vinho', tags: ['doce', 'refrescante'],
    ing: [{ id: 'licor-sabugueiro', q: '30 ml' }, { id: 'espumante', q: '90 ml' }, { id: 'agua-com-gas', q: '30 ml' }, { id: 'hortela', q: '1 ramo' }, { id: 'limao', q: '1 fatia', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Na taça com gelo: licor de sabugueiro, espumante, água com gás e hortelã. Fresco e floral.',
  },
  {
    id: 'old-fashioned', nome: 'Old Fashioned', copo: 'Copo baixo', tags: ['forte', 'doce', 'amargo'],
    ing: [{ id: 'bourbon', q: '60 ml' }, { id: 'acucar', q: '1 cubo ou 1 colher de chá' }, { id: 'angostura', q: '2 dashes' }, { id: 'laranja', q: 'casca' }, { id: 'gelo', q: '1 pedra grande' }],
    preparo: 'Dissolva o açúcar com o bitters e um pouco de água. Adicione o bourbon e gelo, mexa até gelar. Esprema os óleos da casca de laranja sobre o drink.',
  },
  {
    id: 'manhattan', nome: 'Manhattan', copo: 'Taça coupé', tags: ['forte', 'doce'],
    ing: [{ id: 'bourbon', q: '60 ml' }, { id: 'vermute-tinto', q: '30 ml' }, { id: 'angostura', q: '2 dashes' }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Mexa tudo com gelo em um copo misturador e coe para a taça gelada. Decore com cereja se tiver.',
  },
  {
    id: 'martini-seco', nome: 'Dry Martini', copo: 'Taça martini', tags: ['seco', 'forte'],
    ing: [{ id: 'gin', q: '60 ml' }, { id: 'vermute-seco', q: '10 ml' }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Mexa o gin e o vermute com bastante gelo e coe para a taça gelada. Decore com azeitona ou twist de limão.',
  },
  {
    id: 'margarita', nome: 'Margarita', copo: 'Taça margarita', tags: ['citrico', 'forte'],
    ing: [{ id: 'tequila', q: '50 ml' }, { id: 'licor-laranja', q: '25 ml' }, { id: 'limao', q: '25 ml de suco' }, { id: 'sal', q: 'para a borda' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Passe limão na borda da taça e mergulhe no sal. Bata tequila, licor e suco de limão com gelo na coqueteleira e coe.',
  },
  {
    id: 'tequila-sunrise', nome: 'Tequila Sunrise', copo: 'Copo alto', tags: ['doce', 'frutado', 'tropical'],
    ing: [{ id: 'tequila', q: '50 ml' }, { id: 'suco-laranja', q: '120 ml' }, { id: 'grenadine', q: '10 ml' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'No copo com gelo, adicione tequila e suco de laranja. Despeje a grenadine devagar pela borda para criar o degradê.',
  },
  {
    id: 'paloma', nome: 'Paloma', copo: 'Copo alto', tags: ['citrico', 'amargo', 'refrescante'],
    ing: [{ id: 'tequila', q: '50 ml' }, { id: 'suco-toranja', q: '100 ml' }, { id: 'limao', q: '1/2 unidade' }, { id: 'agua-com-gas', q: 'para completar' }, { id: 'sal', q: 'para a borda' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Copo com borda de sal e gelo: tequila, suco de toranja, suco de limão e complete com água com gás.',
  },
  {
    id: 'daiquiri', nome: 'Daiquiri', copo: 'Taça coupé', tags: ['citrico', 'seco'],
    ing: [{ id: 'rum-branco', q: '60 ml' }, { id: 'limao', q: '25 ml de suco' }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo na coqueteleira com gelo por 10 segundos e coe duplo para a taça gelada. Simples e perfeito.',
  },
  {
    id: 'pina-colada', nome: 'Piña Colada', copo: 'Copo alto', tags: ['doce', 'cremoso', 'tropical'],
    ing: [{ id: 'rum-branco', q: '50 ml' }, { id: 'suco-abacaxi', q: '90 ml' }, { id: 'leite-de-coco', q: '30 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo no liquidificador com gelo até ficar cremoso. Decore com abacaxi.',
  },
  {
    id: 'cuba-libre', nome: 'Cuba Libre', copo: 'Copo alto', tags: ['doce', 'refrescante'],
    ing: [{ id: 'rum-branco', q: '50 ml' }, { id: 'refrigerante-cola', q: '120 ml' }, { id: 'limao', q: '1/2 unidade' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Copo com gelo, rum, suco de meio limão e complete com refrigerante de cola. Misture levemente.',
  },
  {
    id: 'dark-n-stormy', nome: "Dark 'n' Stormy", copo: 'Copo alto', tags: ['refrescante', 'forte'],
    ing: [{ id: 'rum-escuro', q: '60 ml' }, { id: 'ginger-beer', q: '100 ml' }, { id: 'limao', q: '1/4 unidade' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Copo com gelo, ginger beer e o rum escuro despejado por cima. Finalize com limão.',
  },
  {
    id: 'moscow-mule', nome: 'Moscow Mule', copo: 'Caneca de cobre', tags: ['citrico', 'refrescante'],
    ing: [{ id: 'vodka', q: '50 ml' }, { id: 'ginger-beer', q: '120 ml' }, { id: 'limao', q: '1/2 unidade' }, { id: 'gengibre', q: 'fatias', opcional: true }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Na caneca (ou copo) com gelo: vodka, suco de limão e complete com ginger beer. Decore com hortelã e gengibre.',
  },
  {
    id: 'cosmopolitan', nome: 'Cosmopolitan', copo: 'Taça martini', tags: ['citrico', 'frutado'],
    ing: [{ id: 'vodka', q: '40 ml' }, { id: 'licor-laranja', q: '15 ml' }, { id: 'suco-cranberry', q: '30 ml' }, { id: 'limao', q: '15 ml de suco' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo na coqueteleira com gelo e coe duplo para a taça gelada. Decore com casca de laranja.',
  },
  {
    id: 'sex-on-the-beach', nome: 'Sex on the Beach', copo: 'Copo alto', tags: ['doce', 'frutado', 'tropical'],
    ing: [{ id: 'vodka', q: '40 ml' }, { id: 'licor-pessego', q: '20 ml' }, { id: 'suco-laranja', q: '60 ml' }, { id: 'suco-cranberry', q: '60 ml' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'No copo com gelo, adicione tudo e misture. Decore com laranja.',
  },
  {
    id: 'espresso-martini', nome: 'Espresso Martini', copo: 'Taça coupé', tags: ['doce', 'forte'],
    ing: [{ id: 'vodka', q: '40 ml' }, { id: 'licor-cafe', q: '20 ml' }, { id: 'cafe-espresso', q: '1 dose (30 ml)' }, { id: 'acucar', q: '1 colher de chá', opcional: true }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo vigorosamente na coqueteleira com gelo e coe duplo — a espuma vem do café. Decore com 3 grãos de café.',
  },
  {
    id: 'white-russian', nome: 'White Russian', copo: 'Copo baixo', tags: ['doce', 'cremoso'],
    ing: [{ id: 'vodka', q: '40 ml' }, { id: 'licor-cafe', q: '20 ml' }, { id: 'creme-de-leite', q: '30 ml' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'No copo com gelo: vodka e licor de café. Despeje o creme de leite por cima delicadamente.',
  },
  {
    id: 'black-russian', nome: 'Black Russian', copo: 'Copo baixo', tags: ['doce', 'forte'],
    ing: [{ id: 'vodka', q: '50 ml' }, { id: 'licor-cafe', q: '25 ml' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Monte direto no copo com gelo e misture levemente.',
  },
  {
    id: 'bloody-mary', nome: 'Bloody Mary', copo: 'Copo alto', tags: ['salgado', 'forte'],
    ing: [{ id: 'vodka', q: '50 ml' }, { id: 'suco-tomate', q: '120 ml' }, { id: 'limao', q: '1/4 unidade' }, { id: 'molho-ingles', q: '3 dashes' }, { id: 'sal', q: 'e pimenta a gosto' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Misture tudo no copo com gelo. Ajuste o tempero — pimenta, sal de aipo e tabasco elevam o drink. Decore com salsão.',
  },
  {
    id: 'whiskey-sour', nome: 'Whiskey Sour', copo: 'Copo baixo', tags: ['citrico', 'doce'],
    ing: [{ id: 'bourbon', q: '60 ml' }, { id: 'limao', q: '25 ml de suco' }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'ovo', q: '1 clara', opcional: true }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo na coqueteleira (com clara, bata primeiro sem gelo para espumar). Coe para o copo com gelo.',
  },
  {
    id: 'gimlet', nome: 'Gimlet', copo: 'Taça coupé', tags: ['citrico', 'seco'],
    ing: [{ id: 'gin', q: '60 ml' }, { id: 'limao', q: '20 ml de suco' }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo na coqueteleira com gelo e coe duplo para a taça gelada.',
  },
  {
    id: 'tom-collins', nome: 'Tom Collins', copo: 'Copo alto', tags: ['citrico', 'refrescante'],
    ing: [{ id: 'gin', q: '50 ml' }, { id: 'limao', q: '25 ml de suco' }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'agua-com-gas', q: 'para completar' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Misture gin, limão e açúcar no copo com gelo. Complete com água com gás.',
  },
  {
    id: 'clover-club', nome: 'Clover Club', copo: 'Taça coupé', tags: ['frutado', 'citrico'],
    ing: [{ id: 'gin', q: '50 ml' }, { id: 'limao', q: '20 ml de suco' }, { id: 'grenadine', q: '15 ml' }, { id: 'ovo', q: '1 clara' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo sem gelo para espumar, depois com gelo. Coe duplo para a taça.',
  },
  {
    id: 'bramble', nome: 'Bramble', copo: 'Copo baixo', tags: ['frutado', 'citrico'],
    ing: [{ id: 'gin', q: '50 ml' }, { id: 'limao', q: '25 ml de suco' }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'licor-cassis', q: '15 ml' }, { id: 'gelo', q: 'triturado' }],
    preparo: 'Monte gin, limão e açúcar no copo com gelo triturado. Despeje o licor de cassis por cima para "sangrar" no drink.',
  },
  {
    id: 'french-75', nome: 'French 75', copo: 'Taça flute', tags: ['citrico', 'seco'],
    ing: [{ id: 'gin', q: '30 ml' }, { id: 'limao', q: '15 ml de suco' }, { id: 'acucar', q: '1 colher de chá' }, { id: 'espumante', q: 'para completar' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata gin, limão e açúcar com gelo, coe para a flute e complete com espumante gelado.',
  },
  {
    id: 'bellini', nome: 'Bellini', copo: 'Taça flute', tags: ['doce', 'frutado'],
    ing: [{ id: 'pessego', q: '1/2 unidade (purê)' }, { id: 'espumante', q: '100 ml' }],
    preparo: 'Bata o pêssego até virar purê, coloque na flute e complete devagar com espumante gelado.',
  },
  {
    id: 'mimosa', nome: 'Mimosa', copo: 'Taça flute', tags: ['citrico', 'refrescante'],
    ing: [{ id: 'suco-laranja', q: '75 ml' }, { id: 'espumante', q: '75 ml' }],
    preparo: 'Partes iguais de suco de laranja gelado e espumante, montado direto na taça.',
  },
  {
    id: 'sangria', nome: 'Sangria', copo: 'Jarra / taça', tags: ['frutado', 'doce', 'refrescante'],
    ing: [{ id: 'vinho-tinto', q: '1 garrafa' }, { id: 'laranja', q: '1 unidade' }, { id: 'limao', q: '1 unidade' }, { id: 'acucar', q: '3 colheres' }, { id: 'agua-com-gas', q: 'para completar', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Corte as frutas e deixe marinar no vinho com açúcar por 30 min na geladeira. Sirva com gelo e um toque de água com gás.',
  },
  {
    id: 'rabo-de-galo', nome: 'Rabo de Galo', copo: 'Copo baixo', tags: ['forte', 'amargo'],
    ing: [{ id: 'cachaca', q: '50 ml' }, { id: 'vermute-tinto', q: '25 ml' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'O clássico brasileiro de boteco: misture cachaça e vermute tinto no copo com gelo. Uma casca de laranja moderniza.',
  },
  {
    id: 'batida-de-coco', nome: 'Batida de Coco', copo: 'Copo baixo', tags: ['doce', 'cremoso', 'tropical'],
    ing: [{ id: 'cachaca', q: '50 ml' }, { id: 'leite-de-coco', q: '50 ml' }, { id: 'leite-condensado', q: '50 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo no liquidificador com gelo até ficar cremoso.',
  },
  {
    id: 'penicillin', nome: 'Penicillin', copo: 'Copo baixo', tags: ['citrico', 'forte'],
    ing: [{ id: 'whisky', q: '60 ml' }, { id: 'limao', q: '25 ml de suco' }, { id: 'mel', q: '2 colheres de chá' }, { id: 'gengibre', q: '3 fatias' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Macere o gengibre, adicione whisky, limão e mel dissolvido em água quente. Bata com gelo e coe para o copo.',
  },
  {
    id: 'irish-coffee', nome: 'Irish Coffee', copo: 'Caneca de vidro', tags: ['quente', 'doce', 'cremoso'],
    ing: [{ id: 'whisky', q: '40 ml' }, { id: 'cafe-espresso', q: '120 ml de café quente' }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'creme-de-leite', q: 'levemente batido, por cima' }],
    preparo: 'Dissolva o açúcar no café quente, adicione o whisky e cubra com creme de leite levemente batido.',
  },
  {
    id: 'sidecar', nome: 'Sidecar', copo: 'Taça coupé', tags: ['citrico', 'forte'],
    ing: [{ id: 'conhaque', q: '50 ml' }, { id: 'licor-laranja', q: '25 ml' }, { id: 'limao', q: '25 ml de suco' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo na coqueteleira com gelo e coe para a taça gelada. Borda de açúcar é opcional e clássica.',
  },
  {
    id: 'kir-royale', nome: 'Kir Royale', copo: 'Taça flute', tags: ['doce', 'frutado'],
    ing: [{ id: 'licor-cassis', q: '15 ml' }, { id: 'espumante', q: '100 ml' }],
    preparo: 'Licor de cassis na flute, complete devagar com espumante gelado.',
  },
  // Sem álcool
  {
    id: 'virgin-mojito', nome: 'Virgin Mojito', copo: 'Copo alto', tags: ['sem-alcool', 'citrico', 'refrescante'],
    ing: [{ id: 'limao', q: '1/2 unidade' }, { id: 'hortela', q: '8 folhas' }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'agua-com-gas', q: 'para completar' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Macere a hortelã com açúcar e limão, adicione gelo e complete com água com gás.',
  },
  {
    id: 'shirley-temple', nome: 'Shirley Temple', copo: 'Copo alto', tags: ['sem-alcool', 'doce'],
    ing: [{ id: 'ginger-beer', q: '150 ml' }, { id: 'grenadine', q: '15 ml' }, { id: 'limao', q: '1 fatia', opcional: true }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Copo com gelo, grenadine e complete com ginger ale. Decore com cereja se tiver.',
  },
  {
    id: 'limonada-suica', nome: 'Limonada Suíça Cremosa', copo: 'Copo alto', tags: ['sem-alcool', 'citrico', 'cremoso'],
    ing: [{ id: 'limao', q: '1 unidade com casca' }, { id: 'acucar', q: '2 colheres' }, { id: 'leite-condensado', q: '2 colheres' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata o limão com casca (rapidamente, para não amargar), açúcar, água e gelo. Coe, volte ao liquidificador com o leite condensado e pulse.',
  },
  {
    id: 'abacaxi-hortela', nome: 'Abacaxi com Hortelã', copo: 'Copo alto', tags: ['sem-alcool', 'tropical', 'refrescante'],
    ing: [{ id: 'abacaxi', q: '2 fatias' }, { id: 'hortela', q: '6 folhas' }, { id: 'acucar', q: '1 colher', opcional: true }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata o abacaxi com hortelã, gelo e um pouco de água. Coe se preferir mais leve.',
  },
  {
    id: 'maracuja-tonica', nome: 'Maracujá Tônica', copo: 'Taça grande', tags: ['sem-alcool', 'citrico', 'refrescante'],
    ing: [{ id: 'maracuja', q: '1 unidade' }, { id: 'agua-tonica', q: '150 ml' }, { id: 'mel', q: '1 colher', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Polpa do maracujá na taça com gelo, complete com tônica. Um toque de mel equilibra o azedo.',
  },
  {
    id: 'mai-tai', nome: 'Mai Tai', copo: 'Copo baixo', tags: ['tropical', 'citrico', 'forte'],
    ing: [{ id: 'rum-branco', q: '30 ml' }, { id: 'rum-escuro', q: '30 ml' }, { id: 'licor-laranja', q: '15 ml' }, { id: 'xarope-orgeat', q: '15 ml' }, { id: 'limao', q: '25 ml' }, { id: 'gelo', q: 'picado' }],
    preparo: 'Bata tudo na coqueteleira com gelo, menos o rum escuro. Sirva no copo com gelo picado e despeje o rum escuro por cima, devagar, para ele ficar boiando.',
  },
  {
    id: 'jungle-bird', nome: 'Jungle Bird', copo: 'Copo baixo', tags: ['tropical', 'amargo', 'frutado'],
    ing: [{ id: 'rum-escuro', q: '45 ml' }, { id: 'campari', q: '20 ml' }, { id: 'suco-abacaxi', q: '45 ml' }, { id: 'xarope-simples', q: '15 ml' }, { id: 'limao', q: '15 ml' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Bata tudo na coqueteleira com gelo e coe sobre gelo novo. O abacaxi faz espuma sozinho — não precisa de clara.',
  },
  {
    id: 'bees-knees', nome: "Bee's Knees", copo: 'Taça coupé', tags: ['citrico', 'doce', 'seco'],
    ing: [{ id: 'gin', q: '60 ml' }, { id: 'mel', q: '20 ml' }, { id: 'limao', q: '20 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Dissolva o mel em um pouco de água morna antes (mel puro não se mistura com bebida gelada). Bata tudo com gelo e coe na taça, sem gelo.',
  },
  {
    id: 'gold-rush', nome: 'Gold Rush', copo: 'Copo baixo', tags: ['citrico', 'doce', 'forte'],
    ing: [{ id: 'bourbon', q: '60 ml' }, { id: 'mel', q: '22 ml' }, { id: 'limao', q: '22 ml' }, { id: 'gelo', q: 'pedra grande' }],
    preparo: 'Dilua o mel em água morna, bata tudo com gelo e coe sobre uma pedra grande. É um Whiskey Sour que trocou o açúcar por mel.',
  },
  {
    id: 'appletini', nome: 'Maçã Verde (Appletini)', copo: 'Taça coupé', tags: ['doce', 'citrico', 'frutado'],
    ing: [{ id: 'vodka', q: '50 ml' }, { id: 'xarope-maca-verde', q: '25 ml' }, { id: 'licor-laranja', q: '15 ml' }, { id: 'limao', q: '15 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo na coqueteleira com bastante gelo e coe na taça gelada. O limão é o que impede o xarope de dominar tudo — não pule.',
  },
  {
    id: 'mule-de-gengibre', nome: 'Mule de Gengibre', copo: 'Copo alto', tags: ['refrescante', 'citrico', 'forte'],
    ing: [{ id: 'vodka', q: '50 ml' }, { id: 'xarope-gengibre', q: '25 ml' }, { id: 'limao', q: '20 ml' }, { id: 'agua-com-gas', q: '100 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Vodka, xarope e limão no copo com gelo, mexa e complete com água com gás. É o Moscow Mule para quem não tem ginger beer — e fica mais afiado.',
  },
  {
    id: 'spritz-de-tangerina', nome: 'Spritz de Tangerina', copo: 'Taça grande', tags: ['refrescante', 'frutado', 'doce'],
    ing: [{ id: 'espumante', q: '90 ml' }, { id: 'xarope-tangerina', q: '20 ml' }, { id: 'agua-com-gas', q: '40 ml' }, { id: 'laranja', q: '1 fatia', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Xarope no fundo da taça com gelo, complete com espumante e finalize com a água com gás. Mexa uma vez só, de baixo para cima.',
  },
  {
    id: 'tangerina-tonica', nome: 'Tangerina Tônica', copo: 'Taça grande', tags: ['refrescante', 'citrico', 'seco'],
    ing: [{ id: 'gin', q: '50 ml' }, { id: 'xarope-tangerina', q: '15 ml' }, { id: 'agua-tonica', q: '150 ml' }, { id: 'limao', q: '1 fatia' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Encha a taça de gelo, gin e xarope, mexa e complete com tônica gelada. A tangerina arredonda o amargo do quinino sem apagar o gin.',
  },
  {
    id: 'limonada-de-gengibre', nome: 'Limonada de Gengibre', copo: 'Copo alto', tags: ['sem-alcool', 'citrico', 'refrescante'],
    ing: [{ id: 'xarope-gengibre', q: '30 ml' }, { id: 'limao', q: '30 ml' }, { id: 'agua-com-gas', q: '150 ml' }, { id: 'hortela', q: '4 folhas', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Xarope e limão no copo, complete com gelo e água com gás. Bata a hortelã na palma da mão antes de colocar, para soltar o aroma sem amargar.',
  },
  {
    id: 'maca-verde-refresco', nome: 'Maçã Verde com Limão', copo: 'Copo alto', tags: ['sem-alcool', 'doce', 'refrescante'],
    ing: [{ id: 'xarope-maca-verde', q: '30 ml' }, { id: 'limao', q: '25 ml' }, { id: 'agua-com-gas', q: '150 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Xarope e limão no copo cheio de gelo, complete com água com gás e mexa de leve. Ácido e doce na mesma medida — o verde faz o resto.',
  },
  {
    id: 'daiquiri-morango', nome: 'Daiquiri de Morango', copo: 'Taça coupé', tags: ['frutado', 'citrico', 'doce'],
    ing: [{ id: 'rum-branco', q: '60 ml' }, { id: 'xarope-morango', q: '20 ml' }, { id: 'limao', q: '25 ml' }, { id: 'morango', q: '2 unidades', opcional: true }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo com bastante gelo e coe na taça, sem gelo. Com morango fresco junto fica mais encorpado; só com xarope fica mais limpo e mais ácido.',
  },
  {
    id: 'floradora', nome: 'Floradora', copo: 'Copo alto', tags: ['frutado', 'citrico', 'refrescante'],
    ing: [{ id: 'gin', q: '45 ml' }, { id: 'xarope-framboesa', q: '20 ml' }, { id: 'limao', q: '20 ml' }, { id: 'ginger-beer', q: '90 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Bata o gin, o xarope e o limão com gelo, coe no copo cheio de gelo e complete com ginger beer. O gengibre é o que impede a framboesa de virar refresco.',
  },
  {
    id: 'pornstar-martini', nome: 'Pornstar Martini', copo: 'Taça coupé', tags: ['frutado', 'tropical', 'doce'],
    ing: [{ id: 'vodka', q: '50 ml' }, { id: 'maracuja', q: '1 unidade' }, { id: 'xarope-maracuja', q: '15 ml' }, { id: 'xarope-baunilha', q: '15 ml' }, { id: 'limao', q: '15 ml' }, { id: 'espumante', q: '60 ml, à parte' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo com gelo, menos o espumante, e coe na taça. O espumante vai num copinho separado, ao lado — alterna-se um gole de cada.',
  },
  {
    id: 'hot-toddy', nome: 'Hot Toddy', copo: 'Caneca de vidro', tags: ['quente', 'doce', 'citrico'],
    ing: [{ id: 'whisky', q: '50 ml' }, { id: 'mel', q: '2 colheres de chá' }, { id: 'limao', q: '20 ml' }, { id: 'xarope-canela', q: '10 ml' }, { id: 'agua-com-gas', q: '120 ml de água quente' }],
    preparo: 'Dissolva o mel na água quente, junte o uísque, o limão e a canela. Nunca ferva: acima de 80 °C o álcool evapora e o aroma vai junto.',
  },
  {
    id: 'espresso-tonica', nome: 'Espresso Tônica com Caramelo', copo: 'Copo alto', tags: ['sem-alcool', 'amargo', 'refrescante'],
    ing: [{ id: 'cafe-espresso', q: '1 dose' }, { id: 'xarope-caramelo', q: '15 ml' }, { id: 'agua-tonica', q: '150 ml' }, { id: 'laranja', q: '1 casca', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Xarope e tônica no copo cheio de gelo. O café vai por último e devagar, por cima — ele fica em camada e desce sozinho, sem precisar mexer.',
  },
  {
    id: 'mint-julep', nome: 'Mint Julep', copo: 'Copo baixo', tags: ['refrescante', 'forte', 'doce'],
    ing: [{ id: 'bourbon', q: '60 ml' }, { id: 'xarope-hortela', q: '20 ml' }, { id: 'hortela', q: '8 folhas' }, { id: 'gelo', q: 'triturado, bastante' }],
    preparo: 'Bata a hortelã na palma da mão e passe pelas paredes do copo. Encha de gelo triturado, junte bourbon e xarope e mexa até o copo suar por fora.',
  },
  {
    id: 'corn-n-oil', nome: "Corn 'n' Oil", copo: 'Copo baixo', tags: ['forte', 'doce', 'amargo'],
    ing: [{ id: 'rum-escuro', q: '60 ml' }, { id: 'xarope-falernum', q: '20 ml' }, { id: 'limao', q: '15 ml' }, { id: 'angostura', q: '4 gotas' }, { id: 'gelo', q: 'pedra grande' }],
    preparo: 'Mexa o rum, o falernum e o limão com gelo e sirva sobre uma pedra grande. As gotas de angostura vão por cima, sem mexer — é delas que vem o nome.',
  },
  {
    id: 'tommys-margarita', nome: "Tommy's Margarita", copo: 'Copo baixo', tags: ['citrico', 'seco', 'forte'],
    ing: [{ id: 'tequila', q: '60 ml' }, { id: 'limao', q: '30 ml' }, { id: 'xarope-agave', q: '20 ml' }, { id: 'sal', q: 'na borda', opcional: true }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo com gelo e coe sobre gelo novo. Sem licor de laranja, o agave devolve à tequila o sabor da própria planta — é a Margarita que os bartenders bebem.',
  },

  // ---------- Coquetelaria autoral: drinks com autor, data e endereço ----------
  {
    id: 'paper-plane', nome: 'Paper Plane', copo: 'Taça coupé', autoral: true, tags: ['amargo', 'citrico', 'forte'],
    ing: [{ id: 'bourbon', q: '22 ml' }, { id: 'aperol', q: '22 ml' }, { id: 'amaro', q: '22 ml' }, { id: 'limao', q: '22 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Partes iguais dos quatro. Bata com gelo e coe na taça, sem gelo. A simetria é o drink inteiro — mudar uma medida desequilibra tudo.',
  },
  {
    id: 'naked-and-famous', nome: 'Naked & Famous', copo: 'Taça coupé', autoral: true, tags: ['citrico', 'amargo', 'forte'],
    ing: [{ id: 'mezcal', q: '22 ml' }, { id: 'chartreuse-amarelo', q: '22 ml' }, { id: 'aperol', q: '22 ml' }, { id: 'limao', q: '22 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Também em partes iguais. Bata bem gelado e coe na taça. A fumaça do mezcal chega primeiro e o amargo do Aperol fecha.',
  },
  {
    id: 'last-word', nome: 'Last Word', copo: 'Taça coupé', autoral: true, tags: ['citrico', 'seco', 'forte'],
    ing: [{ id: 'gin', q: '22 ml' }, { id: 'chartreuse-verde', q: '22 ml' }, { id: 'maraschino', q: '22 ml' }, { id: 'limao', q: '22 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Quatro partes iguais, batidas com bastante gelo e coadas sem gelo. O Chartreuse domina se o limão não estiver bem fresco.',
  },
  {
    id: 'division-bell', nome: 'Division Bell', copo: 'Taça coupé', autoral: true, tags: ['citrico', 'amargo', 'frutado'],
    ing: [{ id: 'mezcal', q: '45 ml' }, { id: 'aperol', q: '22 ml' }, { id: 'maraschino', q: '15 ml' }, { id: 'limao', q: '22 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo com gelo e coe na taça gelada. É o Last Word com mezcal no lugar do gin — mais fumaça, menos ervas.',
  },
  {
    id: 'oaxaca-old-fashioned', nome: 'Oaxaca Old Fashioned', copo: 'Copo baixo', autoral: true, tags: ['forte', 'doce', 'amargo'],
    ing: [{ id: 'tequila', q: '45 ml' }, { id: 'mezcal', q: '15 ml' }, { id: 'xarope-agave', q: '10 ml' }, { id: 'angostura', q: '2 gotas' }, { id: 'laranja', q: '1 casca' }, { id: 'gelo', q: 'pedra grande' }],
    preparo: 'Mexa tudo com gelo — nunca bata — e sirva sobre uma pedra grande. Queime a casca de laranja sobre o copo antes de largá-la dentro.',
  },
  {
    id: 'gin-basil-smash', nome: 'Gin Basil Smash', copo: 'Copo baixo', autoral: true, tags: ['citrico', 'refrescante', 'seco'],
    ing: [{ id: 'gin', q: '60 ml' }, { id: 'manjericao', q: '1 punhado' }, { id: 'limao', q: '25 ml' }, { id: 'xarope-simples', q: '20 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Soque o manjericão no fundo da coqueteleira, junte o resto, bata com gelo e coe duas vezes sobre gelo novo. Sim, aqui o manjericão se soca de verdade.',
  },
  {
    id: 'old-cuban', nome: 'Old Cuban', copo: 'Taça coupé', autoral: true, tags: ['refrescante', 'citrico', 'doce'],
    ing: [{ id: 'rum-escuro', q: '45 ml' }, { id: 'hortela', q: '6 folhas' }, { id: 'limao', q: '22 ml' }, { id: 'xarope-simples', q: '20 ml' }, { id: 'angostura', q: '2 gotas' }, { id: 'espumante', q: '60 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo com gelo, menos o espumante, e coe na taça. O espumante entra por último, despejado devagar pela borda.',
  },
  {
    id: 'trinidad-sour', nome: 'Trinidad Sour', copo: 'Taça coupé', autoral: true, tags: ['amargo', 'citrico', 'forte'],
    ing: [{ id: 'angostura', q: '45 ml' }, { id: 'xarope-orgeat', q: '30 ml' }, { id: 'whisky', q: '15 ml' }, { id: 'limao', q: '22 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Leu certo: a angostura é a base, não o tempero. Bata tudo com bastante gelo e coe na taça. Uma dose inteira de bitters — e funciona.',
  },
  {
    id: 'siesta', nome: 'Siesta', copo: 'Taça coupé', autoral: true, tags: ['amargo', 'citrico', 'refrescante'],
    ing: [{ id: 'tequila', q: '50 ml' }, { id: 'campari', q: '15 ml' }, { id: 'suco-toranja', q: '20 ml' }, { id: 'limao', q: '15 ml' }, { id: 'xarope-simples', q: '15 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo bem gelado e coe na taça, sem gelo. É um Negroni que virou sour e trocou o gin pela tequila.',
  },
  {
    id: 'eastside', nome: 'Eastside', copo: 'Taça coupé', autoral: true, tags: ['refrescante', 'citrico', 'seco'],
    ing: [{ id: 'gin', q: '55 ml' }, { id: 'pepino', q: '3 rodelas' }, { id: 'hortela', q: '6 folhas' }, { id: 'limao', q: '22 ml' }, { id: 'xarope-simples', q: '20 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Macere o pepino, junte o resto, bata com gelo e coe duas vezes para nenhuma folha passar. O pepino é o que segura a hortelã de dominar.',
  },
  {
    id: 'pisco-sour', nome: 'Pisco Sour', copo: 'Taça coupé', tags: ['citrico', 'cremoso', 'forte'],
    ing: [{ id: 'pisco', q: '60 ml' }, { id: 'limao', q: '30 ml' }, { id: 'xarope-simples', q: '20 ml' }, { id: 'ovo', q: '1 clara' }, { id: 'angostura', q: '3 gotas' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo sem gelo primeiro, para a clara montar, depois bata de novo com gelo e coe duas vezes. As gotas de angostura vão desenhadas sobre a espuma.',
  },
  {
    id: 'sazerac', nome: 'Sazerac', copo: 'Copo baixo', tags: ['forte', 'amargo', 'seco'],
    ing: [{ id: 'whisky', q: '60 ml' }, { id: 'absinto', q: 'para lavar o copo' }, { id: 'acucar', q: '1 colher de chá' }, { id: 'angostura', q: '4 gotas' }, { id: 'limao', q: '1 casca' }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Gire o absinto no copo gelado e descarte o excesso. Mexa o resto com gelo à parte e coe no copo lavado, sem gelo. A casca de limão é torcida por cima e descartada.',
  },
  {
    id: 'corpse-reviver', nome: 'Corpse Reviver nº 2', copo: 'Taça coupé', tags: ['citrico', 'seco', 'forte'],
    ing: [{ id: 'gin', q: '25 ml' }, { id: 'licor-laranja', q: '25 ml' }, { id: 'vermute-seco', q: '25 ml' }, { id: 'limao', q: '25 ml' }, { id: 'absinto', q: 'para lavar o copo' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Lave a taça com absinto e descarte o excesso. Bata os quatro restantes em partes iguais e coe na taça. O livro original avisa: quatro seguidos e o efeito se inverte.',
  },
  {
    id: 'aviation', nome: 'Aviation', copo: 'Taça coupé', tags: ['citrico', 'seco', 'frutado'],
    ing: [{ id: 'gin', q: '55 ml' }, { id: 'maraschino', q: '15 ml' }, { id: 'limao', q: '20 ml' }, { id: 'xarope-simples', q: '8 ml', opcional: true }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo com bastante gelo e coe na taça gelada, sem gelo. O maraschino é potente: 15 ml é limite, não sugestão.',
  },
  {
    id: 'hemingway-daiquiri', nome: 'Hemingway Daiquiri', copo: 'Taça coupé', tags: ['citrico', 'seco', 'forte'],
    ing: [{ id: 'rum-branco', q: '60 ml' }, { id: 'suco-toranja', q: '30 ml' }, { id: 'maraschino', q: '15 ml' }, { id: 'limao', q: '15 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo bem gelado e coe na taça. Não leva açúcar nenhum — era exatamente assim que Hemingway o pedia no Floridita.',
  },

  // ---------- Doces e gaseificados: a família do refrigerante alcoólico ----------
  {
    id: 'vodka-ice', nome: 'Vodka Ice Caseiro', copo: 'Copo alto', tags: ['doce', 'citrico', 'refrescante'],
    ing: [{ id: 'vodka', q: '40 ml' }, { id: 'limao', q: '20 ml' }, { id: 'xarope-simples', q: '15 ml' }, { id: 'refrigerante-limao', q: '150 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Vodka, limão e xarope no copo cheio de gelo. Complete com o refrigerante e mexa uma vez só. É a versão caseira do Ice de garrafa — e com limão de verdade fica bem melhor.',
  },
  {
    id: 'screwdriver', nome: 'Screwdriver', copo: 'Copo alto', tags: ['doce', 'frutado', 'refrescante'],
    ing: [{ id: 'vodka', q: '50 ml' }, { id: 'suco-laranja', q: '150 ml' }, { id: 'laranja', q: '1 fatia', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Vodka sobre o gelo, complete com suco de laranja e mexa. Dois ingredientes: a diferença inteira está em o suco ser fresco ou de caixinha.',
  },
  {
    id: 'cape-codder', nome: 'Cape Codder', copo: 'Copo alto', tags: ['frutado', 'citrico', 'refrescante'],
    ing: [{ id: 'vodka', q: '50 ml' }, { id: 'suco-cranberry', q: '150 ml' }, { id: 'limao', q: '1 rodela' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Vodka e cranberry no copo com gelo, mexa e esprema a rodela de limão por cima. O limão é o que tira o cranberry do enjoativo.',
  },
  {
    id: 'sea-breeze', nome: 'Sea Breeze', copo: 'Copo alto', tags: ['frutado', 'citrico', 'refrescante'],
    ing: [{ id: 'vodka', q: '50 ml' }, { id: 'suco-cranberry', q: '90 ml' }, { id: 'suco-toranja', q: '60 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Tudo no copo cheio de gelo, mexa de leve. O cranberry desce e a toranja fica em cima — sai com duas camadas se você não mexer muito.',
  },
  {
    id: 'bay-breeze', nome: 'Bay Breeze', copo: 'Copo alto', tags: ['doce', 'tropical', 'frutado'],
    ing: [{ id: 'vodka', q: '50 ml' }, { id: 'suco-cranberry', q: '90 ml' }, { id: 'suco-abacaxi', q: '60 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Mesma construção do Sea Breeze, com abacaxi no lugar da toranja. Fica bem mais doce — e é por isso que quase sempre agrada mais.',
  },
  {
    id: 'woo-woo', nome: 'Woo Woo', copo: 'Copo alto', tags: ['doce', 'frutado', 'refrescante'],
    ing: [{ id: 'vodka', q: '40 ml' }, { id: 'licor-pessego', q: '25 ml' }, { id: 'suco-cranberry', q: '120 ml' }, { id: 'limao', q: '1 rodela' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Tudo no copo com gelo e uma mexida. Sem o limão espremido no fim ele fica doce demais — não pule.',
  },
  {
    id: 'fuzzy-navel', nome: 'Fuzzy Navel', copo: 'Copo alto', tags: ['doce', 'frutado', 'refrescante'],
    ing: [{ id: 'licor-pessego', q: '60 ml' }, { id: 'suco-laranja', q: '150 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Duas coisas, sobre bastante gelo. É dos drinks mais leves que existem em teor alcoólico — o licor de pêssego tem menos álcool que a maioria dos destilados.',
  },
  {
    id: 'malibu-abacaxi', nome: 'Malibu com Abacaxi', copo: 'Copo alto', tags: ['doce', 'tropical', 'cremoso'],
    ing: [{ id: 'licor-coco', q: '50 ml' }, { id: 'suco-abacaxi', q: '150 ml' }, { id: 'limao', q: '1 rodela', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Licor de coco e abacaxi sobre gelo. É a Piña Colada sem liquidificador e sem creme — mais leve e pronta em vinte segundos.',
  },
  {
    id: 'vodka-melancia', nome: 'Vodka de Melancia', copo: 'Copo alto', tags: ['doce', 'frutado', 'refrescante'],
    ing: [{ id: 'vodka', q: '45 ml' }, { id: 'melancia', q: '4 cubos' }, { id: 'limao', q: '15 ml' }, { id: 'agua-com-gas', q: '80 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Macere a melancia, junte vodka e limão, complete com gelo e água com gás. Melancia é quase toda água: não precisa coar, mas coado fica mais elegante.',
  },
  {
    id: 'coco-limao', nome: 'Coco com Limão', copo: 'Copo alto', tags: ['sem-alcool', 'refrescante', 'citrico'],
    ing: [{ id: 'agua-de-coco', q: '180 ml' }, { id: 'limao', q: '20 ml' }, { id: 'hortela', q: '5 folhas' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Bata a hortelã na palma da mão, junte tudo no copo com gelo. A água de coco já tem sal e açúcar próprios — o limão só acorda os dois.',
  },

  // ---------- Ampliação: clássicos de balcão, tiki e o repertório brasileiro ----------
  {
    id: 'garibaldi', nome: 'Garibaldi', copo: 'Copo alto', tags: ['amargo', 'frutado', 'refrescante'],
    ing: [{ id: 'campari', q: '50 ml' }, { id: 'suco-laranja', q: '150 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Campari no copo com gelo e complete com suco de laranja batido até ficar espumoso. A espuma é o drink — suco parado deixa o Campari amargo demais.',
  },
  {
    id: 'bicicletta', nome: 'Bicicletta', copo: 'Taça grande', tags: ['amargo', 'seco', 'refrescante'],
    ing: [{ id: 'campari', q: '45 ml' }, { id: 'vinho-branco', q: '90 ml' }, { id: 'agua-com-gas', q: '60 ml' }, { id: 'laranja', q: '1 fatia', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Campari e vinho branco gelado na taça com gelo, complete com água com gás. Mexa uma vez só.',
  },
  {
    id: 'negroni-sbagliato', nome: 'Negroni Sbagliato', copo: 'Copo baixo', tags: ['amargo', 'refrescante'],
    ing: [{ id: 'campari', q: '30 ml' }, { id: 'vermute-tinto', q: '30 ml' }, { id: 'espumante', q: '60 ml' }, { id: 'laranja', q: '1 fatia', opcional: true }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Campari e vermute no copo com gelo, complete com espumante bem gelado. O espumante entra por último e devagar, para não perder o gás.',
  },
  {
    id: 'batanga', nome: 'Batanga', copo: 'Copo alto', tags: ['refrescante', 'citrico', 'forte'],
    ing: [{ id: 'tequila', q: '50 ml' }, { id: 'refrigerante-cola', q: '150 ml' }, { id: 'limao', q: '1/2 unidade' }, { id: 'sal', q: 'na borda' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Borda salgada, suco de meio limão, tequila e gelo. Complete com cola e mexa com a faca — no bar onde nasceu, a mesma faca que cortou o limão.',
  },
  {
    id: 'el-presidente', nome: 'El Presidente', copo: 'Taça coupé', tags: ['seco', 'frutado', 'forte'],
    ing: [{ id: 'rum-branco', q: '50 ml' }, { id: 'vermute-seco', q: '25 ml' }, { id: 'licor-laranja', q: '10 ml' }, { id: 'grenadine', q: '5 ml' }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Mexa tudo com gelo — nunca bata — e coe na taça gelada. A granadina entra em gota: é cor e um fundo doce, não sabor principal.',
  },
  {
    id: 'mary-pickford', nome: 'Mary Pickford', copo: 'Taça coupé', tags: ['doce', 'tropical', 'frutado'],
    ing: [{ id: 'rum-branco', q: '55 ml' }, { id: 'suco-abacaxi', q: '55 ml' }, { id: 'maraschino', q: '10 ml' }, { id: 'grenadine', q: '5 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo com gelo e coe na taça. O abacaxi faz uma espuma clara que assenta em segundos — sirva na hora.',
  },
  {
    id: 'between-the-sheets', nome: 'Between the Sheets', copo: 'Taça coupé', tags: ['citrico', 'forte', 'seco'],
    ing: [{ id: 'rum-branco', q: '30 ml' }, { id: 'conhaque', q: '30 ml' }, { id: 'licor-laranja', q: '20 ml' }, { id: 'limao', q: '20 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo bem gelado e coe na taça, sem gelo. É um Sidecar que ganhou rum — e ficou bem mais forte do que parece.',
  },
  {
    id: 'vieux-carre', nome: 'Vieux Carré', copo: 'Copo baixo', tags: ['forte', 'doce', 'amargo'],
    ing: [{ id: 'whisky', q: '30 ml' }, { id: 'conhaque', q: '30 ml' }, { id: 'vermute-tinto', q: '30 ml' }, { id: 'angostura', q: '2 gotas' }, { id: 'gelo', q: 'pedra grande' }],
    preparo: 'Mexa tudo com gelo e sirva sobre uma pedra grande. Dois destilados em partes iguais pedem diluição lenta — pedra pequena estraga.',
  },
  {
    id: 'brooklyn', nome: 'Brooklyn', copo: 'Taça coupé', tags: ['seco', 'amargo', 'forte'],
    ing: [{ id: 'whisky', q: '55 ml' }, { id: 'vermute-seco', q: '25 ml' }, { id: 'maraschino', q: '8 ml' }, { id: 'angostura', q: '2 gotas' }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Mexa com gelo e coe na taça gelada. É o Manhattan do outro lado do rio: vermute seco no lugar do tinto.',
  },
  {
    id: 'rob-roy', nome: 'Rob Roy', copo: 'Taça coupé', tags: ['forte', 'doce'],
    ing: [{ id: 'whisky', q: '60 ml' }, { id: 'vermute-tinto', q: '25 ml' }, { id: 'angostura', q: '2 gotas' }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Mexa com gelo por 20 segundos e coe na taça. Manhattan com uísque escocês — a turfa muda tudo.',
  },
  {
    id: 'martinez', nome: 'Martinez', copo: 'Taça coupé', tags: ['doce', 'seco', 'forte'],
    ing: [{ id: 'gin', q: '45 ml' }, { id: 'vermute-tinto', q: '30 ml' }, { id: 'maraschino', q: '8 ml' }, { id: 'angostura', q: '2 gotas' }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Mexa com gelo e coe na taça gelada. Muito mais doce que um Dry Martini — e veio antes dele.',
  },
  {
    id: 'bijou', nome: 'Bijou', copo: 'Taça coupé', tags: ['forte', 'doce', 'seco'],
    ing: [{ id: 'gin', q: '30 ml' }, { id: 'vermute-tinto', q: '30 ml' }, { id: 'chartreuse-verde', q: '30 ml' }, { id: 'angostura', q: '1 gota', opcional: true }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Partes iguais, mexidas com gelo e coadas sem gelo. Três joias: gin diamante, vermute rubi e Chartreuse esmeralda.',
  },
  {
    id: 'hanky-panky', nome: 'Hanky Panky', copo: 'Taça coupé', tags: ['amargo', 'forte', 'doce'],
    ing: [{ id: 'gin', q: '45 ml' }, { id: 'vermute-tinto', q: '45 ml' }, { id: 'fernet', q: '8 ml' }, { id: 'laranja', q: '1 casca' }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Mexa com gelo e coe na taça. O Fernet entra em dose mínima: mais que isso e ele engole o resto.',
  },
  {
    id: 'tuxedo', nome: 'Tuxedo', copo: 'Taça coupé', tags: ['seco', 'forte'],
    ing: [{ id: 'gin', q: '45 ml' }, { id: 'vermute-seco', q: '45 ml' }, { id: 'maraschino', q: '5 ml' }, { id: 'absinto', q: '2 gotas' }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Mexa tudo com gelo e coe na taça gelada. O absinto vai em gotas dentro, não a lavar o copo.',
  },
  {
    id: 'casino', nome: 'Casino', copo: 'Taça coupé', tags: ['citrico', 'seco', 'frutado'],
    ing: [{ id: 'gin', q: '55 ml' }, { id: 'maraschino', q: '15 ml' }, { id: 'limao', q: '15 ml' }, { id: 'angostura', q: '2 gotas' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata com gelo e coe na taça. Primo do Aviation, sem o licor de violeta e com bitters.',
  },
  {
    id: 'pink-lady', nome: 'Pink Lady', copo: 'Taça coupé', tags: ['frutado', 'doce', 'cremoso'],
    ing: [{ id: 'gin', q: '50 ml' }, { id: 'grenadine', q: '15 ml' }, { id: 'limao', q: '15 ml' }, { id: 'ovo', q: '1 clara' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata sem gelo primeiro para montar a clara, depois com gelo, e coe duas vezes. A espuma rosada tem que ficar firme na superfície.',
  },
  {
    id: 'ward-8', nome: 'Ward 8', copo: 'Taça coupé', tags: ['citrico', 'doce', 'forte'],
    ing: [{ id: 'whisky', q: '60 ml' }, { id: 'limao', q: '20 ml' }, { id: 'suco-laranja', q: '20 ml' }, { id: 'grenadine', q: '10 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo com gelo e coe. Dois cítricos em vez de um: a laranja arredonda o que o limão deixa afiado.',
  },
  {
    id: 'scofflaw', nome: 'Scofflaw', copo: 'Taça coupé', tags: ['citrico', 'seco', 'frutado'],
    ing: [{ id: 'whisky', q: '45 ml' }, { id: 'vermute-seco', q: '30 ml' }, { id: 'limao', q: '20 ml' }, { id: 'grenadine', q: '15 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata bem gelado e coe na taça. A granadina aqui é ingrediente de verdade, não gota de cor.',
  },
  {
    id: 'air-mail', nome: 'Air Mail', copo: 'Taça flute', tags: ['citrico', 'doce', 'refrescante'],
    ing: [{ id: 'rum-branco', q: '40 ml' }, { id: 'mel', q: '15 ml' }, { id: 'limao', q: '20 ml' }, { id: 'espumante', q: '80 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Dilua o mel em água morna, bata com o rum e o limão, coe na taça e complete com espumante.',
  },
  {
    id: 'saturn', nome: 'Saturn', copo: 'Taça grande', tags: ['tropical', 'citrico', 'doce'],
    ing: [{ id: 'gin', q: '45 ml' }, { id: 'xarope-orgeat', q: '15 ml' }, { id: 'xarope-falernum', q: '15 ml' }, { id: 'maracuja', q: '1/2 unidade' }, { id: 'limao', q: '20 ml' }, { id: 'gelo', q: 'picado' }],
    preparo: 'Bata tudo com gelo e sirva com gelo picado. Um tiki de gin, que é raridade — quase todos são de rum.',
  },
  {
    id: 'zombie', nome: 'Zombie', copo: 'Copo alto', tags: ['tropical', 'forte', 'frutado'],
    ing: [{ id: 'rum-branco', q: '40 ml' }, { id: 'rum-escuro', q: '40 ml' }, { id: 'xarope-falernum', q: '15 ml' }, { id: 'suco-abacaxi', q: '40 ml' }, { id: 'limao', q: '25 ml' }, { id: 'grenadine', q: '10 ml' }, { id: 'angostura', q: '2 gotas' }, { id: 'gelo', q: 'picado' }],
    preparo: 'Bata tudo com gelo picado e sirva sem coar. Donn Beach limitava a dois por cliente, e o motivo é o teor alcoólico.',
  },
  {
    id: 'painkiller', nome: 'Painkiller', copo: 'Copo alto', tags: ['tropical', 'cremoso', 'doce'],
    ing: [{ id: 'rum-escuro', q: '60 ml' }, { id: 'suco-abacaxi', q: '100 ml' }, { id: 'suco-laranja', q: '30 ml' }, { id: 'leite-de-coco', q: '30 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Bata tudo com gelo e sirva no copo cheio. Noz-moscada ralada por cima não é enfeite: é o aroma que fecha o drink.',
  },
  {
    id: 'fog-cutter', nome: 'Fog Cutter', copo: 'Copo alto', tags: ['tropical', 'forte', 'citrico'],
    ing: [{ id: 'rum-branco', q: '45 ml' }, { id: 'conhaque', q: '25 ml' }, { id: 'gin', q: '15 ml' }, { id: 'xarope-orgeat', q: '20 ml' }, { id: 'suco-laranja', q: '50 ml' }, { id: 'limao', q: '25 ml' }, { id: 'gelo', q: 'picado' }],
    preparo: 'Bata tudo e sirva com gelo picado. Trader Vic avisava: "depois de dois destes, você não enxerga mais nada".',
  },
  {
    id: 'bitter-mai-tai', nome: 'Bitter Mai Tai', copo: 'Copo baixo', tags: ['amargo', 'tropical', 'citrico'],
    ing: [{ id: 'mezcal', q: '45 ml' }, { id: 'campari', q: '25 ml' }, { id: 'xarope-orgeat', q: '20 ml' }, { id: 'licor-laranja', q: '10 ml' }, { id: 'limao', q: '25 ml' }, { id: 'gelo', q: 'picado' }],
    preparo: 'Bata tudo com gelo e sirva com gelo picado. Fumaça, amargo e amêndoa — o tiki menos tiki que existe.',
  },
  {
    id: 'kingston-negroni', nome: 'Kingston Negroni', copo: 'Copo baixo', tags: ['amargo', 'forte', 'tropical'],
    ing: [{ id: 'rum-escuro', q: '30 ml' }, { id: 'campari', q: '30 ml' }, { id: 'vermute-tinto', q: '30 ml' }, { id: 'laranja', q: '1 casca' }, { id: 'gelo', q: 'pedra grande' }],
    preparo: 'Mexa com gelo e sirva sobre pedra grande. Um Negroni que trocou o gin por rum jamaicano — mais funky, mais doce.',
  },
  {
    id: 'chartreuse-swizzle', nome: 'Chartreuse Swizzle', copo: 'Copo alto', tags: ['citrico', 'tropical', 'refrescante'],
    ing: [{ id: 'chartreuse-verde', q: '45 ml' }, { id: 'suco-abacaxi', q: '30 ml' }, { id: 'xarope-falernum', q: '20 ml' }, { id: 'limao', q: '20 ml' }, { id: 'gelo', q: 'triturado' }],
    preparo: 'Copo cheio de gelo triturado e mexa de baixo para cima com colher longa até o copo suar. É o que "swizzle" quer dizer.',
  },
  {
    id: 'toronto', nome: 'Toronto', copo: 'Copo baixo', tags: ['amargo', 'forte', 'seco'],
    ing: [{ id: 'whisky', q: '55 ml' }, { id: 'fernet', q: '10 ml' }, { id: 'xarope-simples', q: '8 ml' }, { id: 'angostura', q: '2 gotas' }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Mexa com gelo e coe. É um Old Fashioned que trocou parte do açúcar por amargo de ervas.',
  },
  {
    id: 'amaretto-sour', nome: 'Amaretto Sour', copo: 'Copo baixo', tags: ['doce', 'citrico', 'cremoso'],
    ing: [{ id: 'amaretto', q: '55 ml' }, { id: 'bourbon', q: '20 ml' }, { id: 'limao', q: '25 ml' }, { id: 'ovo', q: '1 clara' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata sem gelo, depois com gelo, e coe sobre gelo novo. O golpe do bourbon é o que tira o drink do enjoativo.',
  },
  {
    id: 'godfather', nome: 'Godfather', copo: 'Copo baixo', tags: ['forte', 'doce'],
    ing: [{ id: 'whisky', q: '50 ml' }, { id: 'amaretto', q: '20 ml' }, { id: 'gelo', q: 'pedra grande' }],
    preparo: 'Direto no copo, sobre uma pedra grande, e mexa. Dois ingredientes: a proporção é o drink inteiro.',
  },
  {
    id: 'grasshopper', nome: 'Grasshopper', copo: 'Taça coupé', tags: ['cremoso', 'doce'],
    ing: [{ id: 'licor-menta', q: '30 ml' }, { id: 'licor-cacau', q: '30 ml' }, { id: 'creme-de-leite', q: '30 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Partes iguais, batidas com bastante gelo até gelar o metal, e coadas na taça. Sobremesa em forma de copo.',
  },
  {
    id: 'stinger', nome: 'Stinger', copo: 'Copo baixo', tags: ['forte', 'doce', 'refrescante'],
    ing: [{ id: 'conhaque', q: '55 ml' }, { id: 'licor-menta', q: '20 ml' }, { id: 'gelo', q: 'triturado' }],
    preparo: 'Mexa com gelo e sirva sobre gelo triturado. Era o digestivo da alta sociedade americana antes da Lei Seca.',
  },
  {
    id: 'brandy-alexander', nome: 'Brandy Alexander', copo: 'Taça coupé', tags: ['cremoso', 'doce'],
    ing: [{ id: 'conhaque', q: '35 ml' }, { id: 'licor-cacau', q: '35 ml' }, { id: 'creme-de-leite', q: '35 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata bem gelado e coe na taça. Noz-moscada ralada por cima — sem ela o drink fica plano.',
  },
  {
    id: 'bamboo', nome: 'Bamboo', copo: 'Taça coupé', tags: ['seco', 'amargo'],
    ing: [{ id: 'xerez', q: '45 ml' }, { id: 'vermute-seco', q: '45 ml' }, { id: 'angostura', q: '2 gotas' }, { id: 'limao', q: '1 casca' }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Mexa com gelo e coe na taça gelada. Tem metade do álcool de um martíni e o dobro de sutileza.',
  },
  {
    id: 'adonis', nome: 'Adonis', copo: 'Taça coupé', tags: ['seco', 'doce'],
    ing: [{ id: 'xerez', q: '50 ml' }, { id: 'vermute-tinto', q: '40 ml' }, { id: 'angostura', q: '2 gotas' }, { id: 'laranja', q: '1 casca' }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Mexa com gelo e coe. Irmão do Bamboo, com vermute tinto — mais doce e mais escuro.',
  },
  {
    id: 'sherry-cobbler', nome: 'Sherry Cobbler', copo: 'Copo alto', tags: ['frutado', 'refrescante', 'doce'],
    ing: [{ id: 'xerez', q: '90 ml' }, { id: 'laranja', q: '2 rodelas' }, { id: 'acucar', q: '1 colher de chá' }, { id: 'abacaxi', q: '1 fatia', opcional: true }, { id: 'gelo', q: 'triturado' }],
    preparo: 'Macere a laranja com o açúcar, junte o xerez, encha de gelo triturado e mexa. Sirva com canudo — foi este drink que popularizou o canudo.',
  },
  {
    id: 'michelada', nome: 'Michelada', copo: 'Copo alto', tags: ['salgado', 'citrico', 'refrescante'],
    ing: [{ id: 'cerveja', q: '330 ml' }, { id: 'limao', q: '30 ml' }, { id: 'molho-ingles', q: '4 gotas' }, { id: 'sal', q: 'na borda' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Borda salgada, limão e molho inglês no fundo do copo com gelo, e complete com cerveja bem gelada, inclinando o copo.',
  },
  {
    id: 'radler', nome: 'Radler', copo: 'Copo alto', tags: ['refrescante', 'citrico', 'doce'],
    ing: [{ id: 'cerveja', q: '200 ml' }, { id: 'refrigerante-limao', q: '200 ml' }, { id: 'limao', q: '1 rodela', opcional: true }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Metade e metade, os dois bem gelados, no copo inclinado. Fica com cerca de metade do álcool de uma cerveja.',
  },
  {
    id: 'whiskey-smash', nome: 'Whiskey Smash', copo: 'Copo baixo', tags: ['citrico', 'refrescante', 'forte'],
    ing: [{ id: 'bourbon', q: '60 ml' }, { id: 'limao', q: '1/2 unidade' }, { id: 'hortela', q: '8 folhas' }, { id: 'xarope-simples', q: '20 ml' }, { id: 'gelo', q: 'triturado' }],
    preparo: 'Macere o limão em pedaços com a hortelã e o xarope, junte o bourbon, bata e sirva sem coar sobre gelo triturado.',
  },
  {
    id: 'southside', nome: 'Southside', copo: 'Taça coupé', tags: ['citrico', 'refrescante', 'seco'],
    ing: [{ id: 'gin', q: '55 ml' }, { id: 'limao', q: '22 ml' }, { id: 'hortela', q: '8 folhas' }, { id: 'xarope-simples', q: '20 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo com gelo e coe duas vezes na taça. É um Mojito de gin servido sem gelo — e bem mais elegante.',
  },
  {
    id: 'gin-fizz', nome: 'Gin Fizz', copo: 'Copo alto', tags: ['citrico', 'cremoso', 'refrescante'],
    ing: [{ id: 'gin', q: '55 ml' }, { id: 'limao', q: '25 ml' }, { id: 'xarope-simples', q: '20 ml' }, { id: 'ovo', q: '1 clara' }, { id: 'agua-com-gas', q: '60 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata sem gelo, depois com gelo, coe no copo sem gelo e complete com água com gás bem devagar — a espuma sobe sozinha acima da borda.',
  },
  {
    id: 'vesper', nome: 'Vesper', copo: 'Taça coupé', tags: ['seco', 'forte'],
    ing: [{ id: 'gin', q: '60 ml' }, { id: 'vodka', q: '20 ml' }, { id: 'vermute-seco', q: '10 ml' }, { id: 'limao', q: '1 casca' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Batido, não mexido — como o personagem pede, mesmo sendo tecnicamente errado para um drink só de destilados.',
  },
  {
    id: 'french-connection', nome: 'French Connection', copo: 'Copo baixo', tags: ['forte', 'doce'],
    ing: [{ id: 'conhaque', q: '45 ml' }, { id: 'amaretto', q: '25 ml' }, { id: 'gelo', q: 'pedra grande' }],
    preparo: 'Direto no copo com uma pedra grande. Dois ingredientes, nenhuma técnica, e mesmo assim precisa de conhaque decente.',
  },
  {
    id: 'blood-and-sand', nome: 'Blood and Sand', copo: 'Taça coupé', tags: ['frutado', 'doce', 'forte'],
    ing: [{ id: 'whisky', q: '25 ml' }, { id: 'vermute-tinto', q: '25 ml' }, { id: 'licor-cassis', q: '25 ml' }, { id: 'suco-laranja', q: '25 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Quatro partes iguais, batidas com gelo e coadas na taça. O original usa licor de cereja; com cassis fica mais escuro e mais ácido.',
  },
  {
    id: 'quentao', nome: 'Quentão', copo: 'Caneca de vidro', tags: ['quente', 'doce', 'forte'],
    ing: [{ id: 'cachaca', q: '200 ml' }, { id: 'gengibre', q: '1 pedaço' }, { id: 'xarope-canela', q: '30 ml' }, { id: 'laranja', q: '1 unidade' }, { id: 'acucar', q: '4 colheres' }],
    preparo: 'Faça uma calda com o açúcar, junte gengibre, casca de laranja e canela, cozinhe alguns minutos e só então acrescente a cachaça. Sirva quente, nunca fervendo.',
  },
  {
    id: 'vinho-quente', nome: 'Vinho Quente', copo: 'Caneca de vidro', tags: ['quente', 'doce', 'frutado'],
    ing: [{ id: 'vinho-tinto', q: '500 ml' }, { id: 'xarope-canela', q: '40 ml' }, { id: 'laranja', q: '1 unidade' }, { id: 'acucar', q: '3 colheres' }, { id: 'gengibre', q: '1 fatia', opcional: true }],
    preparo: 'Aqueça o vinho com açúcar, canela e rodelas de laranja sem deixar ferver. Quinze minutos em fogo baixo bastam.',
  },
  {
    id: 'leite-de-onca', nome: 'Leite de Onça', copo: 'Copo alto', tags: ['cremoso', 'doce'],
    ing: [{ id: 'cachaca', q: '50 ml' }, { id: 'leite-condensado', q: '100 ml' }, { id: 'licor-cacau', q: '30 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo com gelo até ficar homogêneo. Canela em pó por cima. É doce sem pedir desculpa — e é para ser mesmo.',
  },

  // ---------- Famílias: variações reais, sem verbete inventado ----------
  {
    id: 'john-collins', nome: 'John Collins', copo: 'Copo alto', tags: ['citrico', 'refrescante'],
    familia: 'Da família Collins: destilado, limão, açúcar e água com gás num copo alto.',
    ing: [{ id: 'bourbon', q: '55 ml' }, { id: 'limao', q: '25 ml' }, { id: 'xarope-simples', q: '20 ml' }, { id: 'agua-com-gas', q: '90 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Bata o bourbon, o limão e o xarope com gelo, coe no copo cheio de gelo e complete com água com gás.',
  },
  {
    id: 'vodka-collins', nome: 'Vodka Collins', copo: 'Copo alto', tags: ['citrico', 'refrescante'],
    familia: 'Collins de vodka — o mais neutro da família, e por isso o que mais depende de limão fresco.',
    ing: [{ id: 'vodka', q: '55 ml' }, { id: 'limao', q: '25 ml' }, { id: 'xarope-simples', q: '20 ml' }, { id: 'agua-com-gas', q: '90 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Bata vodka, limão e xarope com gelo, coe no copo com gelo e complete com água com gás.',
  },
  {
    id: 'rum-collins', nome: 'Rum Collins', copo: 'Copo alto', tags: ['citrico', 'refrescante', 'tropical'],
    familia: 'Collins de rum branco, primo direto do Mojito sem a hortelã.',
    ing: [{ id: 'rum-branco', q: '55 ml' }, { id: 'limao', q: '25 ml' }, { id: 'xarope-simples', q: '20 ml' }, { id: 'agua-com-gas', q: '90 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Bata rum, limão e xarope com gelo, coe no copo com gelo e complete com água com gás.',
  },
  {
    id: 'campari-soda', nome: 'Campari Soda', copo: 'Copo baixo', tags: ['amargo', 'refrescante'],
    familia: 'Aperitivo italiano na forma mais curta possível: amargo e gás.',
    ing: [{ id: 'campari', q: '45 ml' }, { id: 'agua-com-gas', q: '90 ml' }, { id: 'laranja', q: '1 fatia', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Campari no copo com gelo e complete com água com gás. Uma volta de colher e pronto.',
  },
  {
    id: 'aperol-tonica', nome: 'Aperol Tônica', copo: 'Taça grande', tags: ['amargo', 'frutado', 'refrescante'],
    familia: 'Highball de aperitivo: o quinino da tônica puxa o amargo do Aperol para cima.',
    ing: [{ id: 'aperol', q: '50 ml' }, { id: 'agua-tonica', q: '150 ml' }, { id: 'laranja', q: '1 fatia' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Aperol na taça cheia de gelo, complete com tônica gelada e finalize com a fatia de laranja.',
  },
  {
    id: 'amaro-tonica', nome: 'Amaro Tônica', copo: 'Copo alto', tags: ['amargo', 'refrescante'],
    familia: 'Highball de amaro — a forma mais fácil de entrar em amargos de ervas.',
    ing: [{ id: 'amaro', q: '50 ml' }, { id: 'agua-tonica', q: '150 ml' }, { id: 'laranja', q: '1 casca' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Amaro no copo com gelo, complete com tônica e torça a casca de laranja por cima.',
  },
  {
    id: 'whisky-highball', nome: 'Whisky Highball', copo: 'Copo alto', tags: ['seco', 'refrescante', 'forte'],
    familia: 'O highball japonês: uísque e gás, com obsessão pela temperatura e pelo gelo.',
    ing: [{ id: 'whisky', q: '50 ml' }, { id: 'agua-com-gas', q: '150 ml' }, { id: 'limao', q: '1 casca', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Copo e uísque bem gelados, gelo até a borda, e a água com gás escorrendo pela colher. Uma volta só de baixo para cima.',
  },
  {
    id: 'fernet-com-cola', nome: 'Fernet com Cola', copo: 'Copo alto', tags: ['amargo', 'doce', 'refrescante'],
    familia: 'Bebida nacional não oficial da Argentina, onde se toma o ano inteiro.',
    ing: [{ id: 'fernet', q: '50 ml' }, { id: 'refrigerante-cola', q: '150 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Fernet no copo com gelo e complete com cola. Na Argentina a proporção é motivo de discussão séria.',
  },
  {
    id: 'vermute-tonica', nome: 'Vermute Tônica', copo: 'Taça grande', tags: ['amargo', 'seco', 'refrescante'],
    familia: 'Aperitivo espanhol de balcão: baixo teor alcoólico e muita complexidade.',
    ing: [{ id: 'vermute-tinto', q: '60 ml' }, { id: 'agua-tonica', q: '120 ml' }, { id: 'laranja', q: '1 fatia' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Vermute na taça com gelo, complete com tônica e finalize com laranja e uma azeitona, se tiver.',
  },
  {
    id: 'gin-gin-mule', nome: 'Gin-Gin Mule', copo: 'Copo alto', tags: ['refrescante', 'citrico', 'seco'],
    familia: 'Mule de gin com hortelã — cruzamento de Mojito com Moscow Mule.',
    ing: [{ id: 'gin', q: '50 ml' }, { id: 'hortela', q: '8 folhas' }, { id: 'limao', q: '22 ml' }, { id: 'xarope-simples', q: '15 ml' }, { id: 'ginger-beer', q: '90 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Macere a hortelã com o limão e o xarope, junte o gin, bata com gelo, coe no copo com gelo e complete com ginger beer.',
  },
  {
    id: 'mexican-mule', nome: 'Mexican Mule', copo: 'Copo alto', tags: ['refrescante', 'citrico', 'forte'],
    familia: 'Mule de tequila, da mesma família do Moscow e do Dark \'n\' Stormy.',
    ing: [{ id: 'tequila', q: '50 ml' }, { id: 'limao', q: '22 ml' }, { id: 'ginger-beer', q: '120 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Tequila e limão no copo com gelo e complete com ginger beer bem gelada.',
  },
  {
    id: 'kentucky-mule', nome: 'Kentucky Mule', copo: 'Copo alto', tags: ['refrescante', 'citrico', 'forte'],
    familia: 'Mule de bourbon: o caramelo do uísque com o ardido do gengibre.',
    ing: [{ id: 'bourbon', q: '50 ml' }, { id: 'limao', q: '22 ml' }, { id: 'ginger-beer', q: '120 ml' }, { id: 'hortela', q: '1 ramo', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Bourbon e limão no copo cheio de gelo, complete com ginger beer e decore com hortelã.',
  },
  {
    id: 'gin-sour', nome: 'Gin Sour', copo: 'Taça coupé', tags: ['citrico', 'seco'],
    familia: 'Sour de gin: a mesma fórmula do Whiskey Sour com outra base.',
    ing: [{ id: 'gin', q: '55 ml' }, { id: 'limao', q: '25 ml' }, { id: 'xarope-simples', q: '20 ml' }, { id: 'ovo', q: '1 clara', opcional: true }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo com gelo e coe na taça. Com clara, bata primeiro sem gelo para montar a espuma.',
  },
  {
    id: 'rum-sour', nome: 'Rum Sour', copo: 'Taça coupé', tags: ['citrico', 'doce'],
    familia: 'Sour de rum — é um Daiquiri com um pouco mais de açúcar.',
    ing: [{ id: 'rum-branco', q: '55 ml' }, { id: 'limao', q: '25 ml' }, { id: 'xarope-simples', q: '22 ml' }, { id: 'angostura', q: '2 gotas', opcional: true }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo com gelo e coe na taça. As gotas de angostura por cima da espuma.',
  },
  {
    id: 'mezcal-sour', nome: 'Mezcal Sour', copo: 'Taça coupé', tags: ['citrico', 'seco', 'forte'],
    familia: 'Sour de mezcal: a fumaça entra no lugar do doce.',
    ing: [{ id: 'mezcal', q: '50 ml' }, { id: 'limao', q: '25 ml' }, { id: 'xarope-agave', q: '20 ml' }, { id: 'ovo', q: '1 clara', opcional: true }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata sem gelo, depois com gelo, e coe duas vezes. O agave conversa melhor com o mezcal que o açúcar.',
  },
  {
    id: 'new-york-sour', nome: 'New York Sour', copo: 'Copo baixo', tags: ['citrico', 'frutado', 'forte'],
    familia: 'Whiskey Sour com uma camada de vinho tinto flutuando por cima.',
    ing: [{ id: 'bourbon', q: '55 ml' }, { id: 'limao', q: '25 ml' }, { id: 'xarope-simples', q: '20 ml' }, { id: 'vinho-tinto', q: '20 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata o sour e coe sobre gelo novo. O vinho vai por último, despejado devagar sobre as costas de uma colher, e fica boiando.',
  },
  {
    id: 'vodka-martini', nome: 'Vodka Martini', copo: 'Taça martíni', tags: ['seco', 'forte'],
    familia: 'Martíni de vodka — o mesmo drink, sem o zimbro do gin.',
    ing: [{ id: 'vodka', q: '70 ml' }, { id: 'vermute-seco', q: '10 ml' }, { id: 'limao', q: '1 casca' }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Mexa com bastante gelo por 30 segundos e coe na taça gelada. Torça a casca de limão sobre a superfície.',
  },
  {
    id: 'gibson', nome: 'Gibson', copo: 'Taça martíni', tags: ['seco', 'forte', 'salgado'],
    familia: 'Dry Martini com cebola em conserva no lugar da azeitona — só isso muda.',
    ing: [{ id: 'gin', q: '70 ml' }, { id: 'vermute-seco', q: '10 ml' }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Mexa com gelo e coe na taça. A guarnição é uma cebolinha em conserva, e é ela que dá nome ao drink.',
  },
  {
    id: 'meio-a-meio', nome: 'Martini 50/50', copo: 'Taça coupé', tags: ['seco'],
    familia: 'Martíni em partes iguais, como se bebia antes de o vermute virar quase enfeite.',
    ing: [{ id: 'gin', q: '45 ml' }, { id: 'vermute-seco', q: '45 ml' }, { id: 'angostura', q: '1 gota', opcional: true }, { id: 'limao', q: '1 casca' }, { id: 'gelo', q: 'para mexer' }],
    preparo: 'Mexa com gelo e coe na taça gelada. Bem menos alcoólico e bem mais aromático que um Dry Martini moderno.',
  },
  {
    id: 'daiquiri-maracuja', nome: 'Daiquiri de Maracujá', copo: 'Taça coupé', tags: ['citrico', 'tropical', 'frutado'],
    familia: 'Daiquiri com fruta, categoria que o Floridita de Havana popularizou.',
    ing: [{ id: 'rum-branco', q: '55 ml' }, { id: 'maracuja', q: '1/2 unidade' }, { id: 'limao', q: '20 ml' }, { id: 'xarope-simples', q: '20 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata a polpa com o resto e coe duas vezes, para as sementes não passarem.',
  },
  {
    id: 'caipifruta-maracuja', nome: 'Caipifruta de Maracujá', copo: 'Copo baixo', tags: ['tropical', 'doce', 'citrico'],
    familia: 'Caipifruta: a fórmula da caipirinha aplicada a qualquer fruta da feira.',
    ing: [{ id: 'cachaca', q: '60 ml' }, { id: 'maracuja', q: '1 unidade' }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Polpa do maracujá macerada com o açúcar, gelo até a borda e a cachaça por cima. Misture bem.',
  },
  {
    id: 'caipifruta-abacaxi', nome: 'Caipifruta de Abacaxi', copo: 'Copo baixo', tags: ['tropical', 'doce', 'refrescante'],
    familia: 'Caipifruta de abacaxi, com ou sem hortelã.',
    ing: [{ id: 'cachaca', q: '60 ml' }, { id: 'abacaxi', q: '3 cubos' }, { id: 'hortela', q: '5 folhas', opcional: true }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Macere o abacaxi com o açúcar, junte gelo e cachaça. A hortelã batida na mão vai por último.',
  },
  {
    id: 'caipifruta-kiwi', nome: 'Caipifruta de Kiwi', copo: 'Copo baixo', tags: ['citrico', 'doce', 'frutado'],
    familia: 'Caipifruta de kiwi, das mais pedidas em quiosque brasileiro.',
    ing: [{ id: 'cachaca', q: '60 ml' }, { id: 'kiwi', q: '1 unidade' }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Macere o kiwi descascado com o açúcar, complete com gelo e cachaça.',
  },
  {
    id: 'caipifruta-tangerina', nome: 'Caipifruta de Tangerina', copo: 'Copo baixo', tags: ['citrico', 'doce', 'refrescante'],
    familia: 'Caipifruta cítrica, feita com a fruta inteira em gomos.',
    ing: [{ id: 'cachaca', q: '60 ml' }, { id: 'xarope-tangerina', q: '20 ml' }, { id: 'limao', q: '1/2 unidade' }, { id: 'acucar', q: '1 colher de chá' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Macere o limão com o açúcar, junte o xarope de tangerina, o gelo e a cachaça.',
  },
  {
    id: 'caipiroska-morango', nome: 'Caipiroska de Morango', copo: 'Copo baixo', tags: ['doce', 'frutado', 'refrescante'],
    familia: 'Caipiroska com fruta: vodka no lugar da cachaça.',
    ing: [{ id: 'vodka', q: '60 ml' }, { id: 'morango', q: '4 unidades' }, { id: 'limao', q: '1/2 unidade' }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Macere os morangos e o limão com o açúcar, complete com gelo e vodka.',
  },
  {
    id: 'caipisaque', nome: 'Caipisaquê', copo: 'Copo baixo', tags: ['citrico', 'refrescante'],
    familia: 'Caipirinha de saquê, criada no Brasil pela comunidade nipo-brasileira.',
    ing: [{ id: 'saque', q: '70 ml' }, { id: 'limao', q: '1 unidade' }, { id: 'acucar', q: '2 colheres de chá' }, { id: 'gelo', q: 'a gosto' }],
    preparo: 'Macere o limão com o açúcar, complete com gelo e saquê. Bem mais leve que a caipirinha de cachaça.',
  },
  {
    id: 'caju-amigo', nome: 'Caju Amigo', copo: 'Copo baixo', tags: ['frutado', 'forte'],
    familia: 'Preparo tradicional do Nordeste: cachaça e caju, sem mais nada.',
    ing: [{ id: 'cachaca', q: '60 ml' }, { id: 'caju', q: '1 unidade' }, { id: 'acucar', q: '1 colher de chá', opcional: true }, { id: 'gelo', q: 'a gosto', opcional: true }],
    preparo: 'Macere o caju, junte a cachaça e sirva. No original não leva gelo nem açúcar — é caju e cachaça.',
  },
  {
    id: 'batida-de-maracuja', nome: 'Batida de Maracujá', copo: 'Copo alto', tags: ['doce', 'tropical', 'cremoso'],
    familia: 'Batida: cachaça batida com fruta e leite condensado.',
    ing: [{ id: 'cachaca', q: '60 ml' }, { id: 'maracuja', q: '1 unidade' }, { id: 'leite-condensado', q: '60 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo no liquidificador com gelo até ficar cremoso. Coe se quiser sem sementes.',
  },
  {
    id: 'batida-de-amendoim', nome: 'Batida de Amendoim', copo: 'Copo alto', tags: ['doce', 'cremoso'],
    familia: 'Batida de paçoca, tradicional de festa junina.',
    ing: [{ id: 'cachaca', q: '60 ml' }, { id: 'pacoca', q: '2 unidades' }, { id: 'leite-condensado', q: '60 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata a paçoca com o leite condensado, a cachaça e gelo até ficar homogêneo.',
  },
  {
    id: 'batida-de-morango', nome: 'Batida de Morango', copo: 'Copo alto', tags: ['doce', 'frutado', 'cremoso'],
    familia: 'Batida de fruta vermelha, da mesma família da de coco.',
    ing: [{ id: 'cachaca', q: '60 ml' }, { id: 'morango', q: '6 unidades' }, { id: 'leite-condensado', q: '50 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo com gelo até ficar cremoso e sirva imediatamente.',
  },
  {
    id: 'planters-punch', nome: "Planter's Punch", copo: 'Copo alto', tags: ['tropical', 'citrico', 'frutado'],
    familia: 'Ponche jamaicano, da família dos punches — a mais antiga da coquetelaria.',
    ing: [{ id: 'rum-escuro', q: '60 ml' }, { id: 'limao', q: '25 ml' }, { id: 'suco-laranja', q: '40 ml' }, { id: 'grenadine', q: '15 ml' }, { id: 'angostura', q: '3 gotas' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Bata tudo com gelo e sirva no copo cheio. A regra antiga do punch: um azedo, dois doces, três fortes, quatro fracos.',
  },
  {
    id: 'hurricane', nome: 'Hurricane', copo: 'Copo alto', tags: ['tropical', 'frutado', 'forte'],
    familia: 'Tiki de Nova Orleans, servido em copo de formato próprio.',
    ing: [{ id: 'rum-branco', q: '45 ml' }, { id: 'rum-escuro', q: '45 ml' }, { id: 'maracuja', q: '1 unidade' }, { id: 'limao', q: '25 ml' }, { id: 'grenadine', q: '15 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Bata tudo com gelo e sirva sem coar no copo alto. É bem mais forte do que o sabor de fruta deixa parecer.',
  },
  {
    id: 'bahama-mama', nome: 'Bahama Mama', copo: 'Copo alto', tags: ['tropical', 'doce', 'cremoso'],
    familia: 'Tropical caribenho da família do Painkiller.',
    ing: [{ id: 'rum-escuro', q: '40 ml' }, { id: 'licor-coco', q: '30 ml' }, { id: 'suco-abacaxi', q: '90 ml' }, { id: 'limao', q: '20 ml' }, { id: 'grenadine', q: '10 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Bata tudo com gelo e sirva no copo cheio. A granadina desce e faz o degradê sozinha.',
  },
  {
    id: 'blue-hawaii', nome: 'Blue Hawaii', copo: 'Copo alto', tags: ['tropical', 'doce', 'citrico'],
    familia: 'Tiki dos anos 1950, famoso mais pela cor que pelo sabor.',
    ing: [{ id: 'rum-branco', q: '45 ml' }, { id: 'curacau-azul', q: '25 ml' }, { id: 'suco-abacaxi', q: '90 ml' }, { id: 'limao', q: '20 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Bata tudo com gelo e sirva no copo cheio. O curaçau azul é um licor de laranja com corante — o sabor é cítrico, não azul.',
  },
  {
    id: 'missionarys-downfall', nome: "Missionary's Downfall", copo: 'Taça coupé', tags: ['tropical', 'refrescante', 'citrico'],
    familia: 'Tiki de hortelã e abacaxi, batido no liquidificador.',
    ing: [{ id: 'rum-branco', q: '50 ml' }, { id: 'abacaxi', q: '3 cubos' }, { id: 'hortela', q: '10 folhas' }, { id: 'licor-pessego', q: '15 ml' }, { id: 'limao', q: '20 ml' }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo no liquidificador com gelo até ficar verde e cremoso. É dos poucos tiki que se serve numa taça.',
  },
  {
    id: 'tinto-de-verano', nome: 'Tinto de Verano', copo: 'Copo alto', tags: ['frutado', 'refrescante', 'doce'],
    familia: 'O que os espanhóis realmente bebem no verão, em vez de sangria.',
    ing: [{ id: 'vinho-tinto', q: '150 ml' }, { id: 'refrigerante-limao', q: '150 ml' }, { id: 'limao', q: '1 rodela' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Metade e metade no copo cheio de gelo, com uma rodela de limão. Mais fácil e mais leve que a sangria.',
  },
  {
    id: 'kalimotxo', nome: 'Kalimotxo', copo: 'Copo alto', tags: ['doce', 'refrescante'],
    familia: 'Mistura basca de vinho tinto com cola, popular em festas de rua.',
    ing: [{ id: 'vinho-tinto', q: '150 ml' }, { id: 'refrigerante-cola', q: '150 ml' }, { id: 'limao', q: '1 rodela', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Metade e metade, bem gelados. Foi inventada, dizem, para salvar um lote de vinho ruim numa festa.',
  },
  {
    id: 'spritzer', nome: 'Spritzer', copo: 'Taça grande', tags: ['seco', 'refrescante'],
    familia: 'Vinho branco com água com gás — a forma mais antiga do spritz.',
    ing: [{ id: 'vinho-branco', q: '120 ml' }, { id: 'agua-com-gas', q: '80 ml' }, { id: 'limao', q: '1 rodela', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Vinho e água com gás bem gelados sobre gelo. Cerca de metade do álcool de uma taça de vinho.',
  },
  {
    id: 'sangria-branca', nome: 'Sangria Branca', copo: 'Taça grande', tags: ['frutado', 'doce', 'refrescante'],
    familia: 'Sangria feita com vinho branco, mais leve que a tinta.',
    ing: [{ id: 'vinho-branco', q: '150 ml' }, { id: 'licor-laranja', q: '20 ml' }, { id: 'abacaxi', q: '2 cubos' }, { id: 'laranja', q: '2 rodelas' }, { id: 'agua-com-gas', q: '60 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Deixe as frutas de molho no vinho com o licor por algumas horas na geladeira. Complete com água com gás na hora de servir.',
  },
  {
    id: 'mimosa-de-maracuja', nome: 'Mimosa de Maracujá', copo: 'Taça flute', tags: ['tropical', 'doce', 'refrescante'],
    familia: 'Mimosa com outro suco — a fórmula aceita qualquer fruta ácida.',
    ing: [{ id: 'espumante', q: '90 ml' }, { id: 'maracuja', q: '1/2 unidade' }, { id: 'xarope-simples', q: '10 ml', opcional: true }],
    preparo: 'Polpa coada no fundo da taça e complete com espumante gelado, despejado devagar.',
  },
  {
    id: 'carajillo', nome: 'Carajillo', copo: 'Copo baixo', tags: ['doce', 'amargo', 'quente'],
    familia: 'Café com licor, tradicional na Espanha e hoje febre no México.',
    ing: [{ id: 'licor-cafe', q: '50 ml' }, { id: 'cafe-espresso', q: '1 dose' }, { id: 'gelo', q: '3 pedras' }],
    preparo: 'Bata o licor com gelo, coe no copo e despeje o espresso quente por cima. A espuma do café fica boiando.',
  },
  {
    id: 'grog', nome: 'Grog', copo: 'Caneca de vidro', tags: ['quente', 'citrico', 'doce'],
    familia: 'Ração da Marinha britânica desde 1740: rum, água, limão e açúcar.',
    ing: [{ id: 'rum-escuro', q: '50 ml' }, { id: 'limao', q: '20 ml' }, { id: 'mel', q: '2 colheres de chá' }, { id: 'agua-com-gas', q: '120 ml de água quente' }, { id: 'xarope-canela', q: '10 ml', opcional: true }],
    preparo: 'Dissolva o mel na água quente, junte o rum e o limão. Nunca ferva.',
  },
  {
    id: 'limonada-de-morango', nome: 'Limonada de Morango', copo: 'Copo alto', tags: ['sem-alcool', 'frutado', 'refrescante'],
    familia: 'Limonada com fruta macerada, sem álcool.',
    ing: [{ id: 'morango', q: '5 unidades' }, { id: 'limao', q: '25 ml' }, { id: 'xarope-simples', q: '25 ml' }, { id: 'agua-com-gas', q: '150 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Macere os morangos com o xarope, junte o limão, o gelo e complete com água com gás.',
  },
  {
    id: 'limonada-de-maracuja', nome: 'Limonada de Maracujá', copo: 'Copo alto', tags: ['sem-alcool', 'citrico', 'tropical'],
    familia: 'Limonada tropical, sem álcool.',
    ing: [{ id: 'maracuja', q: '1 unidade' }, { id: 'limao', q: '20 ml' }, { id: 'xarope-simples', q: '25 ml' }, { id: 'agua-com-gas', q: '150 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Polpa no copo com o xarope e o limão, complete com gelo e água com gás.',
  },
  {
    id: 'cha-gelado-pessego', nome: 'Chá Gelado de Pêssego', copo: 'Copo alto', tags: ['sem-alcool', 'doce', 'refrescante'],
    familia: 'Chá gelado com fruta — base de vários mocktails de bar.',
    ing: [{ id: 'cha-preto', q: '200 ml frio' }, { id: 'pessego', q: '1/2 unidade' }, { id: 'limao', q: '15 ml' }, { id: 'xarope-simples', q: '20 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Macere o pêssego com o xarope, junte o chá bem frio e o limão, e complete com gelo.',
  },
  {
    id: 'melancia-hortela', nome: 'Melancia com Hortelã', copo: 'Copo alto', tags: ['sem-alcool', 'refrescante', 'doce'],
    familia: 'Refresco de fruta batida, sem álcool.',
    ing: [{ id: 'melancia', q: '5 cubos' }, { id: 'hortela', q: '6 folhas' }, { id: 'limao', q: '20 ml' }, { id: 'agua-com-gas', q: '80 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Bata a melancia, coe, junte o limão e a hortelã batida na mão, e complete com água com gás.',
  },
  {
    id: 'abacaxi-gengibre', nome: 'Abacaxi com Gengibre', copo: 'Copo alto', tags: ['sem-alcool', 'tropical', 'refrescante'],
    familia: 'Suco funcional que virou drink de cardápio.',
    ing: [{ id: 'suco-abacaxi', q: '150 ml' }, { id: 'xarope-gengibre', q: '25 ml' }, { id: 'limao', q: '20 ml' }, { id: 'agua-com-gas', q: '60 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Tudo no copo com gelo e uma volta de colher. O gengibre é o que impede o abacaxi de ficar só doce.',
  },
  {
    id: 'tonica-de-pepino', nome: 'Tônica de Pepino', copo: 'Taça grande', tags: ['sem-alcool', 'refrescante', 'amargo'],
    familia: 'Aperitivo sem álcool: o amargo do quinino faz o papel do destilado.',
    ing: [{ id: 'pepino', q: '4 rodelas' }, { id: 'agua-tonica', q: '180 ml' }, { id: 'limao', q: '15 ml' }, { id: 'hortela', q: '4 folhas', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Macere levemente o pepino, junte gelo, limão e complete com tônica.',
  },
  {
    id: 'mule-sem-alcool', nome: 'Mule sem Álcool', copo: 'Copo alto', tags: ['sem-alcool', 'citrico', 'refrescante'],
    familia: 'Mule sem o destilado: o gengibre segura o drink sozinho.',
    ing: [{ id: 'xarope-gengibre', q: '25 ml' }, { id: 'limao', q: '25 ml' }, { id: 'ginger-beer', q: '150 ml' }, { id: 'hortela', q: '1 ramo', opcional: true }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Xarope e limão no copo com gelo, complete com ginger beer.',
  },
  {
    id: 'virgin-pina-colada', nome: 'Piña Colada sem Álcool', copo: 'Copo alto', tags: ['sem-alcool', 'tropical', 'cremoso'],
    familia: 'Piña Colada sem o rum — o creme de coco já sustenta o drink.',
    ing: [{ id: 'suco-abacaxi', q: '120 ml' }, { id: 'leite-de-coco', q: '50 ml' }, { id: 'limao', q: '10 ml', opcional: true }, { id: 'gelo', q: 'para bater' }],
    preparo: 'Bata tudo com gelo até ficar cremoso e sirva no copo alto.',
  },
  {
    id: 'virgin-sea-breeze', nome: 'Sea Breeze sem Álcool', copo: 'Copo alto', tags: ['sem-alcool', 'citrico', 'frutado'],
    familia: 'O Sea Breeze sem a vodka: os dois sucos e o gelo.',
    ing: [{ id: 'suco-cranberry', q: '120 ml' }, { id: 'suco-toranja', q: '90 ml' }, { id: 'limao', q: '10 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Cranberry no copo com gelo e a toranja por cima, devagar, para ficar em camadas.',
  },
  {
    id: 'laranja-canela', nome: 'Laranja com Canela', copo: 'Copo alto', tags: ['sem-alcool', 'doce', 'refrescante'],
    familia: 'Suco temperado — canela e cítrico funcionam juntos há séculos.',
    ing: [{ id: 'suco-laranja', q: '180 ml' }, { id: 'xarope-canela', q: '20 ml' }, { id: 'limao', q: '10 ml' }, { id: 'gelo', q: 'bastante' }],
    preparo: 'Tudo no copo com gelo e mexa. Uma casca de laranja torcida por cima fecha o aroma.',
  },
];

const RECEITA_MAP = Object.fromEntries(RECEITAS.map(r => [r.id, r]));

const TAG_NOMES = {
  'citrico': 'Cítrico', 'doce': 'Doce', 'amargo': 'Amargo', 'seco': 'Seco',
  'refrescante': 'Refrescante', 'cremoso': 'Cremoso', 'frutado': 'Frutado',
  'forte': 'Forte', 'quente': 'Quente', 'tropical': 'Tropical',
  'sem-alcool': 'Sem álcool', 'salgado': 'Salgado',
};

// Substituições: o que serve no lugar de quê, e o que muda no copo.
// Não entram no motor de sugestões de propósito — "pode fazer agora" continua
// significando que você tem o que a receita pede. Isto é conselho de balcão
// para quando falta algo, não uma forma de inflar a lista.
const SUBSTITUTOS = {
  'xarope-simples': [{ id: 'acucar', nota: 'dissolva antes num pouco de água quente' },
                     { id: 'mel', nota: 'mais encorpado e com gosto próprio' }],
  'xarope-agave': [{ id: 'mel', nota: 'mais floral' },
                   { id: 'xarope-simples', nota: 'mais neutro' }],
  'mel': [{ id: 'xarope-simples', nota: 'perde o floral' },
          { id: 'xarope-agave', nota: 'bem parecido' }],
  'bourbon': [{ id: 'whisky', nota: 'menos doce, mais seco' }],
  'whisky': [{ id: 'bourbon', nota: 'mais doce e redondo' }],
  'conhaque': [{ id: 'bourbon', nota: 'menos frutado' }],
  'mezcal': [{ id: 'tequila', nota: 'perde a fumaça, que é o ponto do drink' }],
  'tequila': [{ id: 'mezcal', nota: 'fica defumado' }],
  'pisco': [{ id: 'cachaca', nota: 'de cana em vez de uva, mas mesma família' }],
  'rum-escuro': [{ id: 'rum-branco', nota: 'mais leve, perde o caramelo' }],
  'rum-branco': [{ id: 'cachaca', nota: 'mais herbáceo' }],
  'amaro': [{ id: 'campari', nota: 'bem mais amargo' },
            { id: 'aperol', nota: 'bem mais doce' }],
  'aperol': [{ id: 'campari', nota: 'quase o dobro de amargor' }],
  'chartreuse-amarelo': [{ id: 'chartreuse-verde', nota: 'mais forte e mais herbáceo' }],
  'chartreuse-verde': [{ id: 'chartreuse-amarelo', nota: 'mais suave e mais doce' }],
  'maraschino': [{ id: 'licor-laranja', nota: 'perde o amargo de amêndoa' }],
  'licor-coco': [{ id: 'leite-de-coco', nota: 'sem álcool; adoce um pouco' }],
  'suco-toranja': [{ id: 'suco-laranja', nota: 'bem mais doce, perde o amargo' }],
  'ginger-beer': [{ id: 'xarope-gengibre', nota: 'complete com água com gás' }],
  'agua-com-gas': [{ id: 'agua-tonica', nota: 'entra um amargo de quinino' }],
  'refrigerante-limao': [{ id: 'agua-com-gas', nota: 'adoce com xarope simples' }],
  'xarope-framboesa': [{ id: 'xarope-morango', nota: 'mais doce, menos ácido' },
                       { id: 'grenadine', nota: 'muda para romã' }],
  'xarope-morango': [{ id: 'morango', nota: 'macere com açúcar' }],
  'creme-de-leite': [{ id: 'leite-condensado', nota: 'bem mais doce' }],
  'espumante': [{ id: 'agua-com-gas', nota: 'vira versão sem álcool' }],
  'vermute-seco': [{ id: 'vermute-tinto', nota: 'mais doce e mais escuro' }],
  'licor-laranja': [{ id: 'maraschino', nota: 'mais seco e amendoado' }],
};

// O que da minha estante serve no lugar do que falta
function substitutosDisponiveis(id, bar) {
  return (SUBSTITUTOS[id] || []).filter(s => bar.has(s.id) || BASICOS.has(s.id));
}
