# 🍹 MeuBar — seu bartender de bolso

App (PWA) que sugere drinks a partir do que você tem em casa, guarda um diário
de degustação com fotos e notas, e inclui um bartender de IA que conhece o seu
bar e o seu gosto.

## Funcionalidades

- **🍾 Meu Bar** — cadastre os ingredientes que você tem em casa (destilados,
  licores, mixers, frutas). Açúcar, sal e gelo já contam como disponíveis.
- **🍸 Sugestões** — ~45 receitas clássicas divididas em *"pode fazer agora"* e
  *"falta só 1 ingrediente"* (com botão para mandar o item que falta para a
  lista de compras). Filtros por perfil: cítrico, doce, amargo, sem álcool etc.
- **📈 Perfil de sabor** — as notas que você dá no diário ensinam o app o que
  você gosta, e as sugestões passam a ser ordenadas pelo seu estilo.
- **📔 Diário** — registre cada drink com foto, data, nota (1–5 estrelas) e um
  texto sobre a experiência. Tudo fica salvo no aparelho (IndexedDB), com busca.
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

### Camada de experiência

- **Modo Preparo** — tela cheia, um passo por vez, tipografia grande para quem
  está de pé com as mãos ocupadas.
- **O Brinde** — ao concluir, o copo se enche, sobem bolhas e o celular vibra
  *antes* de qualquer formulário; marcos (1º, 10º, 50º…) ganham selo carimbado.
- **Histórias** — origem, criador, curiosidade, harmonização, variações e
  aparições culturais. 25 clássicos escritos à mão (lendas marcadas como
  lendas); os demais o Especialista escreve sob demanda e guarda no aparelho.
- **Boas-vindas** — em vez da tela vazia, o app leva à primeira vitória:
  marque o que tem em casa e veja na hora o que já dá para fazer.
- **Movimento** — entrada em cascata, transições entre abas, ingredientes que
  se preenchem, bolhas nas ilustrações, skeleton nas esperas, avisos próprios
  no lugar dos diálogos do sistema e resposta tátil (vibração). Tudo respeita
  `prefers-reduced-motion`.

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
css/style.css         tema visual
js/data.js            catálogo de ingredientes + receitas com tags de sabor
js/db.js              persistência (IndexedDB + localStorage)
js/app.js             UI, motor de sugestões e perfil de sabor
js/ai.js              integração com a API da Anthropic (modo Especialista)
sw.js                 service worker (funciona offline)
manifest.webmanifest  manifesto do PWA
```
