# MeuBar — briefing de contexto para assistentes de IA

Cole este documento inteiro no início de uma conversa nova. Ele descreve um app
que já existe e está funcionando; use-o como base para gerar ideias, textos,
receitas, código ou análises. **Não invente funcionalidades que não estão aqui** —
se algo não estiver descrito, considere que não existe.

---

## 1. O que é

**MeuBar — seu bartender de bolso.** Um aplicativo web (PWA) em português do
Brasil que responde três perguntas conectadas:

1. **O que dá para eu beber hoje?** — a partir do que existe na minha estante
2. **O que eu achei do que bebi?** — diário de degustação com nota e foto
3. **Para quem é este drink?** — perfis de gosto por pessoa

A costura entre as três é o diferencial: **as notas que o usuário dá no diário
realimentam o motor de sugestões.** No mercado, apps de receita não sabem o que
você achou, e apps de diário não sabem o que você tem em casa. Este faz os dois
e liga um no outro.

**Autor:** Olinto (usuário brasileiro, não é o desenvolvedor original do código —
o app foi construído em par com uma IA e ele atua como dono de produto).

---

## 2. Números atuais

| | |
|---|---|
| Receitas | **199** |
| Ingredientes catalogados | **89**, em 6 categorias |
| Verbetes históricos escritos à mão | **136** |
| Lendas da casa (ficção assumida) | **10** |
| Variações de família (sem verbete) | **52** |
| Drinks autorais modernos | 10 |
| Receitas sem álcool | 19 |
| Países no passaporte | 25 |
| Substituições de ingrediente | 27 |
| Conquistas | 14 · **Rotas guiadas:** 5 · **Níveis:** 6 |
| Tamanho total do app | **528 KB** |
| Linhas de código | ~8.900 (JS + CSS + HTML) |
| Dependências | **zero** — sem build, sem npm, sem framework |

---

## 3. Princípios de produto (importantes — respeite-os ao sugerir qualquer coisa)

Estes não são preferências estéticas; são decisões tomadas com motivo. Propostas
que os contrariem devem vir com o custo declarado.

1. **Nada sai do aparelho.** Sem conta, sem servidor, sem rastreio, sem anúncio,
   sem assinatura. Todo dado vive em `localStorage` + `IndexedDB`. A única
   chamada externa é para a API da Anthropic, com a chave do próprio usuário.
2. **A gamificação nunca premia beber mais.** Não existe sequência de dias
   (*streak*), meta semanal, nem qualquer mecânica que gere culpa por pular uma
   noite. O que conta é **repertório**: só drinks *diferentes* movem os números.
   Repetir o favorito não muda nada — e a tela diz isso.
3. **História inventada é sempre rotulada.** Verbetes pesquisados levam carimbo
   `real`; ficção leva carimbo `lenda`. A ficção só existe em **drinks criados
   para o app**, nunca colada num clássico — lenda em drink real competiria com
   a história verdadeira dele.
4. **Origem disputada é dita como disputada.** "Conta-se que", "há quem
   reivindique". Nunca escolher um lado quando as fontes divergem.
5. **"Pode fazer agora" significa que você tem o que a receita pede.** As
   substituições existem, mas de propósito **não** entram no motor de sugestões —
   inflar a lista transformaria a seção em promessa vazia.
6. **Ingrediente novo só entra com receita que o use.** Nada de encher a lista.
7. **Sem build.** Arquivos soltos, `<script src>` em ordem, escopo global
   compartilhado. Qualquer proposta que exija empacotador precisa justificar.

---

## 4. Estrutura da interface

Quatro abas. O app abre em **Meu Bar** se a estante estiver vazia, e em
**Sugestões** caso contrário.

### Aba 1 — Sugestões
- Seletor de **pessoa** no topo (Você / convidados cadastrados / 🎉 modo festa)
- Busca por nome
- **Filtros combináveis** (marque vários): cítrico, doce, amargo, refrescante,
  forte, cremoso, tropical, salgado, quente, sem álcool, ✎ autorais,
  ✦ lendas da casa, ♥ favoritos. O cruzamento é **E** (interseção); quando não
  devolve nada, o app afrouxa sozinho para **OU** e avisa por quê.
- **Drink do dia** — escolha estável pela data, com preferência pelo que ainda
  não foi feito. Some sob filtro ou busca.
- **Efeméride** — "há um ano você tomou um Daiquiri hoje"
- **Boas-voltas** — saudação para quem ficou tempo sem abrir (5 faixas: 7, 21,
  60, 180, 400 dias)
- Lista em **três seções**: **"Pode fazer agora"**, **"Falta só 1 ingrediente"**
  e **"Explorar o acervo"** (tudo que pede 2+ ingredientes que faltam). O acervo
  vem fechado, ordenado por distância, cada linha nomeando o que falta, com um
  botão "+ tudo na lista" que manda todos os itens de uma vez para as compras.
  Sem ele, uma estante de iniciante enxergava 32 das 199 receitas.
- **Busca por nome de drink OU nome de ingrediente**, ignorando acento
  ("maracuja" acha "maracujá"). A busca abre o acervo sozinha.
- **"Vale a pena comprar"** — ingredientes que destravam mais drinks (some
  durante a busca)
- Botões: criar minha receita · cardápio da noite (imagem)

### Aba 2 — Meu Bar
O topo **muda com a situação da estante**: com menos de 8 itens o "Montar meu
bar" é a ação em destaque e a foto desce; com a estante montada a ordem se
inverte. Cada botão leva sua legenda.
- **🛒 Montar meu bar pelo que eu gosto** — escolhe um estilo e o app calcula a
  menor lista de compras que destrava mais drinks daquele estilo. Também
  aparece na lista "pode fazer agora" vazia e no fim das boas-vindas de quem
  não fechou nenhuma receita.
- **📸 Fotografar minha estante** — a IA identifica as garrafas (precisa da chave)
- Busca de ingrediente
- Chips por categoria: Destilados · Licores, vermutes e vinhos · Mixers e sucos ·
  Xaropes e adoçantes · Frutas e frescos · Outros
- Lista de compras integrada (marcar "comprei" move o item para o bar)
- Açúcar, sal e gelo contam como sempre disponíveis

### Aba 3 — Diário
- **Registro em um toque** — na receita e na tela do brinde, tocar numa estrela
  grava a entrada (data de hoje, nome do drink, nota). Grava primeiro e pergunta
  depois: o aviso traz **desfazer** e um convite discreto para completar.
- Caminho longo (opcional): nome, receita do app, data, quem bebeu, nota 1–5,
  **onde**, **quanto custou**, texto livre, foto (comprimida a ~1200px)
- Resumo do mês · busca · filtros por nota mínima e período
- **🎁 Retrospectiva** — cartaz do ano em imagem
- **Coleção e passaporte** — clássicos a conquistar + países visitados
- **Seu balcão** — nível, 14 conquistas, 5 rotas guiadas
- **Hora do bar** — lembrete semanal em arquivo `.ics` para o calendário
- Backup — exportar e importar tudo em um JSON

### Aba 4 — IA (Especialista)
Abre num chat que **funciona sem chave e sem internet**.

- **Modo demonstração (padrão, `js/demo.js`)** — bartender local, determinístico.
  Interpreta o pedido em português: sabor (com sinônimos — "azedo" → cítrico),
  ingrediente (só palavra inteira: "dirigindo" não conta como "gin"), restrição
  ("estou dirigindo", "grávida" → sem álcool), pessoa cadastrada pelo nome e
  disponibilidade ("com o que eu tenho"). Responde com ficha completa:
  ingredientes, medidas, preparo, copo, o que falta na estante e uma
  curiosidade. Cinco perguntas prontas abrem a conversa. **Toda resposta declara
  que não é a IA** e o que a versão com chave faz a mais.
- **Modo IA** — com a chave da API da Anthropic colada pelo usuário (guardada só
  no aparelho), o chat vira o bartender de verdade, que inventa receita nova e
  improvisa. Modelo usado: `claude-opus-5`.

---

## 5. Funcionalidades em detalhe

### Motor de sugestões
Cruza a estante com as 199 receitas. Ordena por afinidade com o perfil ativo.
O perfil combina **tags declaradas** (o usuário diz que curte doce) com **tags
aprendidas** (notas 4–5 no diário ensinam sozinhas).

### Perfis por pessoa e modo festa
Cada convidado tem gostos e **restrições** ("João não bebe álcool"). O modo
festa prioriza drinks que agradam o grupo inteiro respeitando as restrições.

### Cartão de convidado
Manda um link; a pessoa marca o que gosta e evita; devolve um link que a
cadastra. **Sem servidor** — as preferências viajam dentro da própria URL.

### Cartão de receita com QR
Gera uma imagem na cor do próprio drink, com ilustração, ingredientes e um
QR code. Quem recebe **aponta a câmera do celular** (não precisa de app para
ler) e a receita abre no MeuBar pronta para guardar e editar. Clássico do
catálogo viaja pelo id; receita própria viaja inteira dentro do QR.
**O gerador de QR foi escrito à mão em JS puro** (modo byte, correção nível M,
versões 1 a 40) porque o app não tem dependências.

### Escala e unidade
"Vou fazer para 8" multiplica a receita inteira, e o Modo Preparo herda a
conta. Alterna **ml / oz** (arredondado ao quarto de onça). O que é instrução —
"a gosto", "para completar" — passa intacto, porque não é medida.

### Substituições
Falta o bourbon e você tem whisky? Diz o que serve **e o que muda no copo**
("menos doce, mais seco"). Só sugere o que está na estante.

### Modo Preparo e O Brinde
Tela cheia, um passo por vez, tipografia grande para quem está de pé. Ao
concluir: o copo se enche, sobem bolhas, o celular vibra — **antes** de
qualquer formulário. Marcos (1º, 10º, 50º drink) ganham selo carimbado.

### Histórias
Origem, criador, curiosidade, ocasião, temperatura, harmonização, variações e
aparições culturais. Carimbo `real` ou `lenda` ao lado do título. Receitas sem
verbete mostram uma **linha verdadeira sobre a família** a que pertencem
("Da família Collins: destilado, limão, açúcar e água com gás num copo alto").

### Trilha sonora
Cada drink sugere o que ouvir enquanto se prepara, escolhido pela **origem** e
pelo **destilado**: samba para a caipirinha, son cubano para o mojito, blues
para o Whiskey Sour, folk irlandês para o Irish Coffee.

### Ilustrações
Geradas em **SVG**, não fotografadas — sem licença, sem CDN, cobrindo 199 de
199. A cor do líquido é **calculada a partir dos ingredientes**, com peso por
poder de tingimento e realce de saturação. Inclui copo correto, gelo conforme o
preparo pede, camada densa no fundo quando há granadina, espuma de clara, sal
na borda, reflexo no vidro e guarnição escolhida entre 16. **A foto do próprio
usuário substitui a ilustração** quando existe.

### Hora do bar
Das 18h às 6h o app troca para a paleta noturna: fundo nogueira, facho de luz
quente vindo de cima, campari brilhando. Botão ☀/☾ fixa à mão e volta ao
automático no toque seguinte.

---

## 6. Identidade visual — "Aperitivo Editorial"

Cardápio de papel, não app de receita. Escolhida pelo dono entre três opções.

**Dia:** papel `#FBFAF7` · branco `#FFFFFF` · tinta `#201D1A` · cinza `#6B665C` ·
acento campari `#C4372B` · linha `#E5E1D8`
**Noite:** nogueira `#241C17` · `#2E251E` · pergaminho `#F2E7D8` · `#A08D7C` ·
brasa `#E4553C` · `#3C2E24`

**Tipografia:** Georgia (serifa) para leitura, Helvetica para rótulos em caixa
alta com entreletras. Base em `125%` (20px), toda a escala em `rem`.

**Layout:** linhas de cardápio com pontilhado ligando o nome ao copo, ornamento
`· · ✦ · ·` nos títulos de seção, navegação centralizada.

**Movimento:** entrada em cascata, transições entre abas, ingredientes que se
preenchem, bolhas nas ilustrações, esqueleto nas esperas, avisos próprios no
lugar dos diálogos do sistema, vibração. Tudo respeita `prefers-reduced-motion`.

---

## 7. Arquitetura técnica

**Site estático puro.** Sem build, sem npm, sem framework. Arquivos carregados
por `<script src>` em ordem, compartilhando escopo global.

```
index.html            4 abas + modal
css/style.css         tema Aperitivo Editorial
css/movimento.css     movimento, feedback e modo noite
js/data.js            199 receitas + 89 ingredientes + substituições
js/historias.js       146 verbetes + ficha derivada + trilha
js/art.js             ilustrações SVG com cor calculada
js/medidas.js         escala de receita e conversão ml/oz
js/qr.js              gerador de QR Code em JS puro
js/cartao.js          cartão de receita em imagem + importação por QR
js/db.js              IndexedDB (diário com fotos) + localStorage
js/ai.js              API da Anthropic (chave do usuário)
js/demo.js            bartender local: interpreta o pedido e responde sem chave
js/instalar.js        convite para instalar como app (merecido, recusável)

Acessibilidade: WCAG 2.2 AA, com o contraste medido em teste automatizado nos
dois temas. `--linha` é decorativa; `--linha-forte` é a borda que identifica um
componente (3:1). `--acento` é texto; `--acento-btn` é fundo de botão (4.5:1
com branco em cima). Todo controle tem nome acessível, alvos passam de 24x24
(navegação em 44x44), títulos não pulam nível, lista de sugestões e chat são
regiões vivas, e modal/preparo/brinde são diálogos com foco preso.
js/app.js             UI, motor de sugestões e perfil de sabor
js/kit.js             lista de compras a partir do estilo preferido
js/jogo.js            nível, conquistas e rotas
js/momentos.js        hora do bar, drink do dia, efemérides, coleção
js/retorno.js         boas-voltas e lembrete .ics
js/preparo.js         modo preparo passo a passo e o brinde
js/retro.js           cartaz da retrospectiva (canvas)
js/boasvindas.js      primeiro acesso guiado
js/convite.js         cartão de convidado (dados na URL)
sw.js                 service worker (funciona offline)
```

**Persistência:** `IndexedDB` para o diário (com fotos em Blob); `localStorage`
para o resto, sob as chaves `meubar.bar`, `meubar.shopping`, `meubar.pessoas`,
`meubar.favoritos`, `meubar.festa`, `meubar.receitas`, `meubar.notas`,
`meubar.historias`, `meubar.chat`, `meubar.luz`, `meubar.unidade`,
`meubar.boasvindas`, `meubar.ultimoAcesso`, `meubar.apikey`.

**Acessibilidade:** o cardápio inteiro se percorre no Tab com anel de foco
visível; Esc fecha modal, Modo Preparo e Brinde na ordem certa; o foco fica
preso no modal aberto e volta para a linha de origem ao fechar.

**Testes:** 17 suítes Playwright, ~283 verificações, incluindo decodificação
real do QR gerado.

---

## 8. Modelo de dados (para gerar receitas ou código)

```js
// Ingrediente
{ id: 'gin', nome: 'Gin', cat: 'destilados' }        // cat: destilados |
// licores | mixers | xaropes | frescos | outros ; basico:true = sempre disponível

// Receita
{
  id: 'negroni',
  nome: 'Negroni',
  copo: 'Copo baixo',            // define a ilustração
  tags: ['amargo', 'forte'],     // ver lista abaixo
  autoral: true,                 // opcional: leva moderna com autor conhecido
  lenda: true,                   // opcional: drink criado para o app
  familia: 'Da família Collins…', // opcional: usado quando não há verbete
  ing: [{ id: 'gin', q: '30 ml' }, { id: 'laranja', q: '1 fatia', opcional: true }],
  preparo: 'Texto corrido; cada frase vira um passo no Modo Preparo.',
}

// Verbete histórico
{
  lenda: true,                   // opcional — marca como ficção
  origem: 'Florença, Itália · 1919',
  criador: 'Fosco Scarselli, no Caffè Casoni',
  historia: '2 a 4 frases',
  curiosidade: 'Um detalhe técnico ou cultural',
  ocasiao: '', temperatura: '', harmoniza: '', variacoes: '', cultura: '',
}
```

**Tags válidas:** `citrico` `doce` `amargo` `seco` `refrescante` `cremoso`
`frutado` `forte` `quente` `tropical` `sem-alcool` `salgado`

**Copos:** Copo baixo · Copo alto · Taça grande · Taça de vinho · Taça coupé ·
Taça martíni · Taça margarita · Taça flute · Caneca de vidro · Caneca de cobre ·
Jarra / taça

---

## 9. O que o app **não** tem (não sugira como se existisse)

- Fotografia real dos drinks — só ilustração SVG e a foto do próprio usuário
- Sincronização entre aparelhos — backup é exportar/importar à mão
- Comunidade, comentários ou perfis públicos
- Versão em inglês ou qualquer outro idioma
- Aplicativo em loja (App Store / Google Play)
- Vídeos de preparo
- Especificação por marca de bebida
- Leitura de código de barras
- IA sem a chave do usuário — todas as funções de IA dependem disso

---

## 10. Situação e próximos passos

O app está funcionando, testado e versionado, mas **ainda não publicado**: falta
ativar o GitHub Pages, o que só o dono pode fazer. Enquanto isso, o QR do cartão
de receita aponta para `localhost` e o app não é instalável nem compartilhável.

Prioridades reconhecidas, na ordem: publicar · decidir o rumo da IA (assumir que
é função avançada para quem tem chave, ou colocar um servidor e perder o "nada
sai deste aparelho") · versão em inglês · sincronização.

---

## 11. Como me ajudar melhor

Ao responder sobre este app, prefira:
- **Português do Brasil**, tom direto, sem jargão desnecessário
- Propostas que caibam em **site estático sem build**
- Respeitar os sete princípios da seção 3 — e, se propuser contrariá-los,
  dizer o custo antes
- Ser específico: nomes de receita reais, ids de ingrediente reais, tags válidas
- Dizer quando não souber, em vez de inventar história de coquetel

Bons pedidos para me fazer: novas receitas no formato da seção 8, textos de
verbete, ideias de funcionalidade que respeitem a arquitetura, revisão de
copy da interface, análise competitiva, ideias de divulgação.
