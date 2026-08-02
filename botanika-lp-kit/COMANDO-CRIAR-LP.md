# COMANDO — criar uma nova LP Botanika (v2, otimizado)

Copie o bloco **COMANDO — INÍCIO … FIM**, cole num **chat novo** (com **Shopify, Google Drive, Higgsfield
e UTMIFY ligados**) e troque `[PRODUTO]`. Este comando já embute tudo que a gente aprendeu construindo as
LPs — em especial a `landing-hair/` (a mais recente e completa: WebGL, tabela de doses real, fotos reais do
Shopify, loader, prova em print, kit com frete grátis). **Use `landing-hair/` e `landing-omega/` como régua.**

> Atalho pra colar no chat novo (uma linha):
> "Leia `botanika-lp-kit/COMANDO-CRIAR-LP.md` no repo botanikahub/botanika-desing e siga-o à risca. Use como
> régua `git show origin/lp:landing-hair/index.html` e `git show origin/lp:landing-omega/index.html`. Vou criar
> a LP do **[PRODUTO]**. Responda só com (a) pasta, (b) identidade proposta e (c) referências — e aguarde meu ok."

---

**COMANDO — INÍCIO**

Você é designer + copywriter de conversão + engenheiro front-end sênior. Vai criar a LP premium da Botanika
para **[PRODUTO]**, com identidade visual 100% própria, no MESMO nível (ou acima) de `landing-omega/`,
`landing-tri/`, `landing-whey-balance-chocolate/` e `landing-hair/`. Repo: `botanikahub/botanika-desing`.
Responda em português.

### 0) REGRAS FIXAS (não quebrar)
- 1 pasta por produto: `landing-<slug>/index.html` — HTML **autocontido** (CSS+JS inline; libs só via CDN).
- Funciona no **Safari mobile ao vivo**. `html{overflow-x:hidden}` na RAIZ.
- Publicar na branch **`lp`**. Link fixo: `https://raw.githack.com/BotanikaHub/Botanika-Desing/lp/landing-<slug>/index.html`
  (preview sem cache: troque `lp` pelo SHA do commit).
- **NUNCA inventar dado** (dose, claim, preço, depoimento). **NUNCA** pôr identificador de modelo em commit/código.
- Validar antes de commitar: `node --check` no `<script>` clássico **E** no `<script type="module">` (salve como
  `.mjs`) + balanço de tags.

### 1) LEIA PRIMEIRO
`CLAUDE.md`, `PAGINAS.md`, `botanika-lp-superprompt.md`, `botanika-lp-kit/` (esp. `prompts/00-INDEX.md` e
`FONTES.md`). As LPs prontas ficam na branch `lp` — se o working branch não tiver as pastas `landing-*`, leia
com `git show origin/lp:landing-<x>/index.html`. Abra **omega** (WebGL, régua máxima) e **hair** (mais completa)
como referência de tokens, fundo, seções e interações.

### 2) VERDADE DO PRODUTO — A FONTE É O SHOPIFY, E ESTÁ NOS METAFIELDS
- `search_products` → título, handle, **VARIANT_ID**, preço. A `description` costuma vir VAZIA.
- `graphql_query` em `product.metafields(namespace:"custom")` — é ONDE está o conteúdo oficial e ATUAL. Puxe
  (quando existirem): `nutrition_table` (JSON: doses + %VD reais), `benefit_items`, `faq_items`,
  `for_whom_items`, `how_to_take_steps`, `manifesto_body`, `why_combo_body`, `ingredients_subheading`,
  `ingredient_1/2/3_title`+`description`, `responsible_use_items`, e as imagens `hero_image`,
  `para_quem_image`, `qty_tier1_image`/`qty_tier2_image`/`qty_tier3_image` (são **MediaImage GIDs** — resolva
  as URLs com `nodes(ids:[...]){... on MediaImage{image{url}}}`).
- ⚠️ **NÃO confie só no rótulo/caixa antigos do Drive**: a formulação pode ter mudado (ex.: Hair virou de
  "12 ativos" p/ **13** ao ganhar Selênio+Licopeno). O metafield manda.
- **DESCONTOS — confirme os DOIS:**
  (a) `codeDiscountNodeByCode(code:"BOTANIKA")` → hoje **5%**.
  (b) **DESCONTOS AUTOMÁTICOS POR QUANTIDADE por produto** (liste `automaticDiscountNodes`; ex. do Hair:
  `HAIR5` = −5% em 2un, `HAIR10` = −10% em 3un). **Os kits usam o AUTOMÁTICO** (aplica sozinho no checkout).
  NÃO force `?discount=BOTANIKA` em carrinho multi-unidade se isso bloquear um automático melhor (ex.: −10%
  no 3un vira só −5%). Frete grátis real só **> R$349** — veja se algum kit cruza (ex.: 4un costuma cruzar).
- **Depoimentos: só REAIS.** Se a pasta do Drive for repost misto/DM privado, **NÃO** republique screenshot
  com rosto/@ nem invente review. Pode apresentar o TEXTO real como card estilo "print/mensagem" (sem
  fabricar identidade). Alérgenos/uso responsável do metafield vão pra FAQ + rodapé.

### 3) IMAGENS
- **PREFIRA as fotos REAIS do Shopify** (metafields): hero, para-quem, e **imagem de kit dinâmica** (1/2/3
  potes que troca no toggle). São renders oficiais, sem risco de "IA estranha".
- Complemente com **Higgsfield** só se precisar (hero quente p/ OG, macro abstrato p/ band divider):
  `generate_image` model `marketing_studio_image`, 16:9 e 9:16. Pote flutuante: use o PNG do rótulo se já for
  transparente (cheque o canal alpha) ou `remove_background`.
- **VÍDEO:** NÃO use `marketing_studio_video` (força modo "UGC" e **fabrica um depoimento falso de pessoa**).
  Para loop ambiente use `kling3_0_turbo` com `start_image` de uma imagem abstrata ("no people, no text, no
  product"). Embarque como `<video autoplay muted loop playsinline poster=...>`.
- ⚠️ **SANDBOX:** o egress bloqueia cloudfront (Higgsfield), `cdn.shopify.com` e `*.lovable.app` — você **não**
  consegue baixar nem VER essas mídias aqui (carregam normal pro usuário final). Avise que as mídias geradas
  por IA precisam ser conferidas no **preview ao vivo**. Fetch direto dá `ERR_TUNNEL`/403.

### 4) IDENTIDADE — PROPONHA E ESPERE "OK" (não code antes)
Responda com (a) pasta `landing-<slug>/`; (b) **paleta + fontes + assinatura de fundo** ÚNICAS; (c) 3–5
referências de técnica do `botanika-lp-kit/prompts/` (o `07-flow-wave` é ótimo p/ "fio/tecido fluindo").
Seja **distinto**: Ômega = navy+dourado (oceano) · Tri = índigo+menta (constelação) · Whey = espresso+cobre
(cacau) · Hair = ameixa/vinho+rosé-gold ("Fio de Seda"). Fontes já usadas (evite repetir): Playfair, Manrope,
Fraunces, Cormorant Garamond, Hanken Grotesk, Bodoni Moda, Familjen Grotesk, Instrument Serif. **Só construa
após o "ok".**

### 5) CONSTRUÇÃO (igual/melhor que omega+hair)
- **LOADER** de abertura: contador **000→100** + assinatura de fundo, some suave (trava de segurança p/ nunca
  prender a página; respeita `prefers-reduced-motion`).
- **FUNDO-ASSINATURA em WebGL:** flow-wave do Ômega (Three.js 0.143 via importmap unpkg; `SphereGeometry` de
  pontos aditivos + simplex noise + 3 `EffectComposer`/bloom + `FinalPass` com "flames" + motes + repel do
  ponteiro + stream por scroll) **RECOLORIDO** pra paleta do produto. Perf: `pixelRatio` limitado, respeita
  reduced-motion. **FALLBACK 2D** em `<canvas>` ("blobs líquidos + filamentos + poeira", render **0.5–0.6×**,
  **SEM `shadowBlur`**) que roda se o WebGL falhar (`try/catch` no import dinâmico; esconde um canvas quando o
  outro assume).
- **12–13 SEÇÕES:** hero (pain-first + pote flutuante + H1 reveal) · dor · band (vídeo/imagem) · solução ·
  ingredientes · **TABELA DE TRANSPARÊNCIA** (doses+%VD reais do `nutrition_table`) · benefícios
  (`benefit_items`) · ritual (`how_to_take_steps`) · para quem (`for_whom_items`) · depoimentos reais +
  números (count-up) · garantia (7 dias + uso responsável) · oferta · FAQ (`faq_items`) · escassez · rodapé.
  \+ header fixo (glass), WhatsApp flutuante (`wa.me/5531972679362`), **barra de compra fixa no mobile**.
- **INTERAÇÕES (GSAP 3.12.2):** botões magnéticos (`gsap.quickTo`), tilt+glow nos cards, count-up, reveal on
  scroll (IntersectionObserver + stagger), **reveal por palavra com blur-up** (cada palavra num
  `.word{white-space:nowrap}`; se a palavra for gradiente, o elemento interno precisa do **próprio**
  `background`+`background-clip:text`, senão some), barra de progresso de scroll, pote com float.
- **HERO cabe na PRIMEIRA DOBRA:** `#hero{min-height:100svh; display:flex; align-items:center}`; dimensione o
  H1 pra caber copy + pote + CTA sem rolar (desktop, laptop 1366×768 e mobile). Pote grande.

### 6) OFERTA + COMMERCE + RASTREAMENTO
- **Toggle de kit (1/2/3/4)** + painel dinâmico (preço, riscado, %desconto, por-pote, duração, economia) +
  **IMAGEM DE KIT que troca** (`qty_tierN_image`) + botão que troca o `href`.
- Checkout: `https://botanikabrasil.com.br/cart/<VARIANT_ID>:<QTD>` (deixe os automáticos aplicarem; `?discount`
  só quando ajudar). **Repasse UTMs** (`utm_*`, `fbclid`, `gclid`, `ttclid`, `src`, `sck`) da URL pros links.
- **Countdown HONESTO:** data real de campanha (peça ao usuário) — não 24h que reinicia.
- **Meta Pixel:** pegue o ID no UTMIFY (`get_dashboards` → `get_integrations_pixels` → `adPlatformPixels[].id`;
  hoje `828186133708463`). Instale base + `PageView` + `ViewContent` + `InitiateCheckout` nos CTAs (o texto do
  botão "COMPRAR AGORA" ajuda a detecção do UTMIFY). **Open Graph + Twitter card** (og:image = foto real ou hero quente).

### 7) VALIDAR & PUBLICAR
- `node --check` no `<script>` clássico **E** no `<script type="module">` (salve como `.mjs`) + tags balanceadas.
- **QA visual com Playwright/Chromium headless** (args: `--use-gl=swiftshader` pro WebGL renderizar). Scripts e
  screenshots em `/tmp` — **NUNCA no repo** (o stop-hook reclama de arquivo não commitado). Lembre: imagens de
  CDN não carregam no sandbox (aparece alt text) — valide o layout aqui e as **mídias no link ao vivo**.
- Commit → publique na **`lp`** com edição **CIRÚRGICA** do `PAGINAS.md` (substitua só o bloco do produto; não
  sobrescreva o arquivo todo, pra não perder outras LPs). Entregue o **link fixo por SHA** pra conferir sem cache.

### 8) PRIMEIRA RESPOSTA ESPERADA
Só **(a)** pasta `landing-<slug>/`, **(b)** identidade proposta (paleta/fontes/assinatura), **(c)** 3–5
referências do kit. **AGUARDE meu "ok" antes de construir.**

**COMANDO — FIM**

---

> **Exemplo-régua:** `landing-hair/index.html` (na branch `lp`) é a implementação de referência deste comando —
> abra e espelhe o nível. Dica: já cole no fim do comando o VARIANT_ID e o preço prontos se quiser pular a etapa da Shopify.
