# PÁGINAS — mapa das landing pages Botanika

> **Leia este arquivo primeiro** ao editar qualquer LP. Cada produto é uma **pasta isolada** — mexer numa nunca afeta a outra. Confirme com o usuário qual pasta vai editar antes de começar.

## Convenção
- **Repositório:** `botanikahub/botanika-desing`
- **Uma pasta por produto:** `landing-<slug>/index.html` (arquivo único, HTML autocontido).
- **Branch de publicação:** `lp` (todas as páginas ficam nela). O link muda só pela pasta.
- **Link fixo de cada página:** `https://raw.githack.com/BotanikaHub/Botanika-Desing/lp/landing-<slug>/index.html`
- **Preview instantâneo (sem cache):** troque `lp` pelo SHA do commit → `.../<sha>/landing-<slug>/index.html`
- **Guia de construção/design:** `botanika-lp-superprompt.md` (design system, interações, regras).
- **Checkout Shopify:** `https://botanikabrasil.com.br/cart/<VARIANT_ID>:<QTD>` (kit 1 nos botões soltos; a oferta muda por kit).
- Ao terminar uma edição: validar (`node --check` nos scripts), commit, e push para a branch `lp`.

## Páginas

### 1. Super Ômega 3 + CoQ10
- **Pasta:** `landing-omega/`
- **Link:** https://raw.githack.com/BotanikaHub/Botanika-Desing/lp/landing-omega/index.html
- **Shopify:** produto `super-omega-3-coq10` · **VARIANT_ID `48115368034536`**
- **Preço:** 3x de R$ 54,37 · ou R$ 163,12 à vista · kits 2 (5% OFF) e 3 (10% OFF)
- **Identidade:** oceano profundo azul-marinho + dourado · fundo WebGL (ondas + koi + cápsulas) · Playfair Display
- **Fotos de depoimento:** `landing-omega/proof/` (também usadas pelo Tri)
- **Status:** ✅ pronta

### 2. Tri[Mg] Complex — Magnésio 3 em 1
- **Pasta:** `landing-tri/`
- **Link:** https://raw.githack.com/BotanikaHub/Botanika-Desing/lp/landing-tri/index.html
- **Shopify:** produto `tri-mg-complex` · **VARIANT_ID `48115368558824`**
- **Preço:** 3x de R$ 29,17 · ou R$ 87,50 à vista · kits 2 (5% OFF) e 3 (10% OFF) — *confirmar preços de kit na loja*
- **Identidade:** meia-noite índigo + menta/violeta/champagne · fundo constelação mineral interativa (muda de cor por seção) · molécula "3 em 1" orbitando · Fraunces
- **Imagem do pote:** `landing-tri/bottle-tri.png` (transparente)
- **Status:** ✅ pronta

### 3. Hair Botanika — Cabelos, Unhas e Pele
- **Pasta:** `landing-hair/`
- **Link:** https://raw.githack.com/BotanikaHub/Botanika-Desing/lp/landing-hair/index.html
- **Shopify:** produto `hair-botanika` · **VARIANT_ID `48650670670056`** (SKU 80.1.5)
- **Preço/descontos:** descontos **automáticos por quantidade** no Shopify (`HAIR5` = −5% em 2un, `HAIR10` = −10% em 3un — ambos ATIVOS): **1 pote R$ 99,40 · 2 potes R$ 188,86 (−5%) · 3 potes R$ 268,38 (−10%, R$ 89,46/pote)**. Checkout **sem cupom** (o desconto aplica sozinho por quantidade). Frete grátis real só > R$ 349. *(cupom `BOTANIKA` 5% existe, mas é redundante/pior que o automático nos kits)*
- **Produto:** 12 ativos (Biotina, Silício Orgânico, Zinco, Ferro, Cisteína, Metionina, Iodo, Vit A/E/B1/B2/B5) · 60 cápsulas · 38g · sem açúcar/glúten · 1 cápsula/dia
- **Identidade:** **"Fio de Seda"** — ameixa/vinho profundo escuro + rosé-gold + champagne · **Bodoni Moda + Familjen Grotesk**
- **Fundo-assinatura:** **WebGL flow-wave recolorido** (Three.js 0.143, mesmo pipeline do Ômega — "cabelo/tecido fluindo" do kit 07) com bloom, motes nacarados e repel do ponteiro; **fallback 2D "Seda Líquida"** (canvas) se o WebGL falhar
- **Imagens (Higgsfield):** editorial (mulher cabelo luminoso 16:9+9:16), cápsulas/ingredientes, macro de fios de seda (band divider), flatlay com o pote — via CDN cloudfront (⚠️ não puderam ser conferidas visualmente no sandbox; validar no preview)
- **Assets locais:** `hair-rotulo.png` (pote navy transparente, herói) · `hair-caixa.png`
- **Estrutura:** 12 seções (hero, dor, band, solução, ingredientes, benefícios, ritual, para quem, depoimentos, garantia, oferta, FAQ, escassez) + header, WhatsApp, barra mobile
- **Rastreamento:** Meta Pixel `828186133708463` (PageView + ViewContent + InitiateCheckout) · repasse de UTMs no checkout · OG/Twitter
- **Status:** ✅ reconstruída v2 (WebGL, imagens editoriais, distinta do Ômega)

### 4. Whey Balance Chocolate — Whey + Colágeno C-PURE®
- **Pasta:** `landing-whey-balance-chocolate/`
- **Link:** https://raw.githack.com/BotanikaHub/Botanika-Desing/lp/landing-whey-balance-chocolate/index.html
- **Shopify:** produto `whey-balance-chocolate` · **VARIANT_ID `48115368919272`**
- **Preço:** 3x de R$ 49,10 · ou R$ 147,30 à vista · 455 g · kits 2/3 com cupom `BOTANIKA` (5% OFF) — *confirmar descontos de kit na loja*
- **Produto:** whey concentrado + colágeno hidrolisado C-PURE® · 23 g de proteína/porção · adoçado naturalmente · sem açúcar/corantes/glúten · força + tônus
- **Identidade:** "Cacau Fundido" — espresso + cobre/caramelo + creme · fundo canvas de chocolate fundido (reativo ao mouse) · Cormorant Garamond + Hanken Grotesk
- **Mídia:** imagens/vídeos Higgs Field (16:9 desktop + 9:16 mobile via `<picture>`) hospedados no CDN Higgsfield · depoimentos reais em `landing-whey-balance-chocolate/proof/`
- **Status:** ✅ pronta (depoimentos reais integrados; confirmar descontos de kit)

<!-- PRÓXIMOS PRODUTOS (modelo — copiar ao criar):
### N. <Nome do produto>
- **Pasta:** `landing-<slug>/`
- **Link:** https://raw.githack.com/BotanikaHub/Botanika-Desing/lp/landing-<slug>/index.html
- **Shopify:** produto `<handle>` · **VARIANT_ID `<id>`**
- **Preço:** ...
- **Identidade:** <paleta / fundo / assinatura / fonte — DEVE ser própria, não clonar outra LP>
- **Status:** em construção
-->

## Como editar uma página específica (comando pra colar num chat novo)
> "Leia o `PAGINAS.md` e o `botanika-lp-superprompt.md` no repo `botanikahub/botanika-desing`. Vou editar a LP do **[produto]**. Me confirma qual pasta/arquivo você vai mexer antes de começar."
