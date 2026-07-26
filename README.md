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
  casa e o que você já avaliou bem. Requer uma chave da API da Anthropic
  (criada em [console.anthropic.com](https://console.anthropic.com)), salva
  apenas no seu aparelho.

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
