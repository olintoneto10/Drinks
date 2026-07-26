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
  { id: 'vinho-tinto', nome: 'Vinho tinto', cat: 'licores' },
  // Mixers e sucos
  { id: 'agua-tonica', nome: 'Água tônica', cat: 'mixers' },
  { id: 'agua-com-gas', nome: 'Água com gás', cat: 'mixers' },
  { id: 'refrigerante-cola', nome: 'Refrigerante de cola', cat: 'mixers' },
  { id: 'ginger-beer', nome: 'Ginger beer / ginger ale', cat: 'mixers' },
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
];

const RECEITA_MAP = Object.fromEntries(RECEITAS.map(r => [r.id, r]));

const TAG_NOMES = {
  'citrico': 'Cítrico', 'doce': 'Doce', 'amargo': 'Amargo', 'seco': 'Seco',
  'refrescante': 'Refrescante', 'cremoso': 'Cremoso', 'frutado': 'Frutado',
  'forte': 'Forte', 'quente': 'Quente', 'tropical': 'Tropical',
  'sem-alcool': 'Sem álcool', 'salgado': 'Salgado',
};
