# 🍹 MeuBar — seu bartender de bolso

App (PWA) que sugere drinks a partir do que você tem em casa, guarda um diário
de degustação com fotos e notas, e inclui um bartender de IA que conhece o seu
bar e o seu gosto.

## Funcionalidades

- **🍾 Meu Bar** — cadastre os ingredientes que você tem em casa (destilados,
  licores, mixers, **xaropes**, frutas). Açúcar, sal e gelo já contam como
  disponíveis. São 15 xaropes, de tangerina e gengibre a orgeat e falernum, e
  cada um destrava receitas de verdade — nenhum entra só para enfeitar a lista.
- **🍸 Sugestões** — 198 receitas divididas em *"pode fazer agora"* e
  *"falta só 1 ingrediente"* (com botão para mandar o item que falta para a
  lista de compras). Os filtros de perfil **combinam entre si**: marque cítrico
  e forte e veja só o que é as duas coisas. Quando o cruzamento não devolve nada,
  o app afrouxa para "pelo menos uma" e avisa, em vez de mostrar tela vazia.
- **✦ Lendas da casa** — dez drinks originais, criados para o app, cada um com
  uma história **assumidamente inventada**. A ficção fica só em drink da casa,
  nunca colada num clássico: lenda em drink real competiria com a história
  verdadeira dele. Todo verbete fictício abre com aviso em destaque —
  *"Esta história é invenção nossa, não fato histórico"* — antes do texto, e o
  drink em si é receita de verdade, com proporções que funcionam. Cada verbete
  leva um **carimbo `real` ou `lenda`** ao lado do título — os dois lados são
  marcados, porque selo só na ficção pareceria ressalva, e selo só no fato não
  diria nada.
- **✎ Autorais** — além do cânone clássico, a leva moderna com autor, ano e
  endereço conhecidos: Paper Plane, Naked & Famous, Last Word, Division Bell,
  Oaxaca Old Fashioned, Gin Basil Smash, Old Cuban, Trinidad Sour, Siesta e
  Eastside. Filtro próprio, que não interfere no perfil de sabor.
- **🛒 Montar meu bar** — escolha um estilo (doce e fácil, cítrico, amargo,
  seco, forte, tropical, sem álcool) e o app calcula a **menor lista de compras
  que destrava o máximo de drinks daquele estilo**, contando o que você já tem.
  É a pergunta inversa do motor de sugestões: não "o que faço com isto?", mas
  "o que compro para fazer o que eu gosto?".
- **⚖️ Escala e medida** — "vou fazer para 8" multiplica a receita inteira, e
  o Modo Preparo herda a conta. Alterna entre **ml e oz** (arredondado ao quarto
  de onça, como se mede atrás do balcão). O que é instrução — "a gosto", "para
  completar" — passa intacto, porque não é medida.
- **🔄 Substituições** — faltou o bourbon e você tem whisky? A receita diz o que
  serve no lugar **e o que muda no copo**. Só sugere o que está na sua estante, e
  de propósito **não** entra no motor de sugestões: "pode fazer agora" continua
  significando que você tem o que a receita pede.
- **📈 Perfil de sabor** — as notas que você dá no diário ensinam o app o que
  você gosta, e as sugestões passam a ser ordenadas pelo seu estilo.
- **📔 Diário** — registre cada drink com foto, data, nota (1–5 estrelas) e um
  texto sobre a experiência, mais **onde foi e quanto custou**. Tudo fica salvo
  no aparelho (IndexedDB), com busca.
- **🛒 Lista de compras** — itens que faltam viram lista; ao marcar "comprei",
  o item entra automaticamente no seu bar.
- **🤖 Especialista (IA)** — chat com um bartender que sabe o que você tem em
  casa, o que cada pessoa gosta/evita e o que você já avaliou bem. Requer uma
  chave da API da Anthropic (criada em
  [console.anthropic.com](https://console.anthropic.com)), salva apenas no seu
  aparelho. A conversa persiste entre sessões.
- **👥 Pessoas, restrições e modo festa** — cadastre convidados com gostos
  ("Marília gosta de doce") e restrições ("João não bebe álcool"); o modo
  festa 🎉 prioriza drinks que agradam todo mundo respeitando as restrições.
- **♥ Favoritos e compartilhar** — marque receitas para depois e compartilhe
  receitas ou registros do diário via WhatsApp e afins (Web Share API).
- **🃏 Cartão de receita com QR** — gera uma imagem na cor do próprio drink,
  com a ilustração, os ingredientes e um QR. Quem recebe **aponta a câmera do
  celular** (não precisa de app nenhum para ler) e a receita abre no MeuBar
  pronta para guardar e editar. Clássico do catálogo viaja pelo id; receita
  própria viaja inteira dentro do QR. Sem servidor, como o cartão de convidado.
- **📊 Diário rico** — filtros por nota mínima e período, resumo neutro do mês
  (nº de registros, nota média, destaque) e fotos comprimidas automaticamente
  (~1200px) para não estourar o armazenamento.
- **💾 Backup** — exporte tudo (bar, pessoas, receitas, diário e fotos) em um
  arquivo único e importe em outro aparelho.
- **📸 Foto da estante** — tire uma foto das suas garrafas e a IA identifica os
  itens e preenche o Meu Bar sozinha (você confere antes de confirmar).
- **📜 Cardápio da noite** — gera uma imagem no estilo carta impressa com os
  drinks que dá para fazer, pronta para mandar no grupo ou apoiar na mesa.
- **✍️ Receitas próprias e anotações** — crie seus drinks (entram no motor de
  sugestões, no perfil e no diário) e anote seus ajustes nos clássicos.
- **🎁 Retrospectiva** — cartaz do seu ano em drinks: total, o campeão, a nota
  máxima, o mês mais animado, com quem você mais brindou e seu paladar.
- **✉️ Cartão de convidado** — mande um link, a pessoa marca o que gosta e
  evita, e devolve um link que a cadastra no seu app. Sem servidor: as
  preferências viajam dentro da própria URL.

### Ilustração

As imagens são **geradas em SVG**, não fotografadas: sem licença, sem CDN, sem
peso e cobrindo **198 de 198** receitas — inclusive as Lendas da casa, que não
existem em banco de imagem nenhum. A sua foto do drink substitui a ilustração
assim que você registra o preparo no diário.

A cor do líquido é **calculada a partir dos ingredientes**, com peso por poder
de tingimento (Campari pinta quase sozinho; vodka quase não pinta) e realce de
saturação, porque média de cores em RGB puxa tudo para o cinza. Entram ainda o
copo certo para cada receita, gelo conforme o que o preparo pede (pedra grande,
triturado, cubos), camada densa no fundo quando há granadina, espuma de clara,
sal na borda, reflexo no vidro e guarnição escolhida entre 16 possibilidades.

### Camada de experiência

- **Modo Preparo** — tela cheia, um passo por vez, tipografia grande para quem
  está de pé com as mãos ocupadas.
- **O Brinde** — ao concluir, o copo se enche, sobem bolhas e o celular vibra
  *antes* de qualquer formulário; marcos (1º, 10º, 50º…) ganham selo carimbado.
- **Histórias** — origem, criador, curiosidade, harmonização, variações e
  aparições culturais. **136 verbetes escritos à mão**, com lendas marcadas como
  lendas ("conta-se que", "há quem reivindique"); nada depende da chave de API.
  As outras 52 receitas são variações de família (Collins, Mule, Sour, caipifruta,
  batida) e trazem, em vez de história, **uma linha verdadeira sobre a família a
  que pertencem** — nada é inventado, e é isso que mantém os 136 verbetes
  confiáveis. Quem quiser a história delas pede ao Especialista, e ela vem
  identificada como escrita por IA.
- **Trilha** — cada drink sugere o que ouvir enquanto se prepara, escolhido pela
  origem e pelo destilado: samba para a caipirinha, son cubano para o mojito,
  blues para o Whiskey Sour, folk irlandês para o Irish Coffee.
- **Boas-vindas** — em vez da tela vazia, o app leva à primeira vitória:
  marque o que tem em casa e veja na hora o que já dá para fazer.
- **Movimento** — entrada em cascata, transições entre abas, ingredientes que
  se preenchem, bolhas nas ilustrações, skeleton nas esperas, avisos próprios
  no lugar dos diálogos do sistema e resposta tátil (vibração). Tudo respeita
  `prefers-reduced-motion`.
- **Hora do bar** — das 18h às 6h o app acende a luz de bar: fundo nogueira,
  um facho quente vindo de cima e o campari brilhando. O ☀/☾ no topo alterna
  à mão e volta ao automático no toque seguinte.
- **Drink do dia** — uma sugestão só sua, estável do primeiro ao último acesso
  do dia, com preferência pelo que você ainda não fez. Some quando você filtra
  ou busca, para não atrapalhar quem já sabe o que quer.
- **Efemérides** — "há um ano você tomou um Daiquiri hoje": o diário volta
  sozinho na data em que a memória foi feita.
- **Coleção e passaporte** — os clássicos viram peças a conquistar, com barra
  de progresso e os países de origem que você já visitou pelo copo.
- **Foto-herói** — a sua foto do drink abre a receita em capa sangrada, no
  lugar da miniatura redonda. Come-se e bebe-se pelos olhos.
- **Boas-voltas e lembrete** — quem some por um tempo é recebido de volta com
  uma linha que reconhece a ausência, e pode criar um lembrete semanal
  (arquivo `.ics`) no próprio calendário — sem servidor, sem notificação
  intrusiva, cancelável pelo calendário a qualquer momento.
- **Seu balcão** — nível de bartender, 14 conquistas e 5 rotas guiadas (a
  árvore do Negroni, a linhagem de partes iguais, a escola do sour, volta ao
  Brasil, a rota do agave). **Conta repertório, não volume**: só drinks
  *diferentes* movem os números, e não existe sequência de dias nem meta
  semanal — um app de bebida não deve premiar quem bebe mais, nem gerar culpa
  por pular uma noite.
- **Teclado e leitor de tela** — o cardápio inteiro se percorre no Tab com anel
  de foco visível, Esc fecha modal, Modo Preparo e Brinde na ordem certa, o foco
  fica preso dentro do modal aberto e volta para a linha de origem ao fechar.

## Como rodar

É um site estático — não precisa de build nem servidor de aplicação.

```bash
# qualquer servidor estático serve, por exemplo:
python3 -m http.server 8080
# e abra http://localhost:8080
```

### Publicar no GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em *Source*, escolha a branch e a pasta `/ (root)`.
3. Acesse a URL gerada pelo celular e use **"Adicionar à tela inicial"** para
   instalar como app.

## Privacidade

- Bar, lista de compras, diário e fotos ficam **somente no seu navegador**
  (localStorage + IndexedDB). Nada é enviado a servidor algum.
- O modo Especialista envia apenas a conversa e um resumo do seu bar/perfil
  para a API da Anthropic, usando a **sua** chave.

## Estrutura

```
index.html            interface (4 abas: Sugestões, Meu Bar, Diário, Especialista)
css/style.css         tema visual ("Aperitivo Editorial")
css/movimento.css     camada de experiência: movimento, feedback e modo noite
js/data.js            catálogo de ingredientes + receitas com tags de sabor
js/feedback.js        avisos, confirmações, vibração e cascata (sem diálogo nativo)
js/historias.js       histórias dos clássicos, ficha derivada e trilha
js/art.js             ilustrações dos drinks geradas em SVG
js/db.js              persistência (IndexedDB + localStorage)
js/ai.js              integração com a API da Anthropic (modo Especialista)
js/app.js             UI, motor de sugestões e perfil de sabor
js/retro.js           cartaz da retrospectiva do ano (canvas)
js/preparo.js         modo preparo passo a passo e o brinde
js/momentos.js        hora do bar, drink do dia, efemérides e coleção
js/retorno.js         boas-voltas e lembrete semanal no calendário (.ics)
js/medidas.js         escala de receita e conversão ml/oz
js/qr.js              gerador de QR Code em JS puro (modo byte, correção M)
js/cartao.js          cartão de receita em imagem + importação pelo QR
js/kit.js             lista de compras calculada a partir do estilo preferido
js/jogo.js            nível, conquistas e rotas (repertório, nunca volume)
js/boasvindas.js      primeiro acesso guiado até a primeira receita
js/convite.js         cartão de convidado (preferências viajam na URL)
sw.js                 service worker (funciona offline)
manifest.webmanifest  manifesto do PWA
```
