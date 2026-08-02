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
- **Camada imersiva compartilhada:** todas as LPs usam libs self-hosted em `<pasta>/vendor/` (gsap + ScrollTrigger) → **cursor glow**, **parallax de imagens** (ScrollTrigger) e header some ao rolar. Scroll nativo + `scroll-behavior:smooth` (o Lenis foi removido por travar o scroll em algumas páginas). Bloco aditivo e guardado (degrada com segurança; respeita `prefers-reduced-motion`).

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
- **Produto:** **13 ativos** (fórmula atual: Vit A/E/B1/B2/B5, Biotina, Zinco, Ferro, Iodo, **Selênio**, **Licopeno**, Cisteína, Metionina, Silício) · 60 cáps · 38g · sem açúcar/glúten · 1 cáps/dia · rende 60 dias
- **Identidade:** **"Fio de Seda"** — ameixa/vinho profundo escuro + rosé-gold + champagne · **Bodoni Moda + Familjen Grotesk**
- **Fundo-assinatura:** **WebGL flow-wave recolorido** (Three.js 0.143, mesmo pipeline do Ômega — "cabelo/tecido fluindo" do kit 07) com bloom, motes nacarados e repel do ponteiro; **fallback 2D "Seda Líquida"** (canvas) se o WebGL falhar
- **Imagens:** **fotos REAIS do Shopify** (hero, para-quem, e kits 1/2/3 potes dinâmicos na oferta) puxadas dos metafields; band divider = 1 render abstrato (macro de fios). Fonte: metafields do produto (título, tabela nutricional, benefícios, FAQ, para-quem, ritual — tudo real)
- **Assets locais:** `hair-rotulo.png` (pote navy transparente, herói) · `hair-caixa.png`
- **Estrutura:** 13 seções (+ **Tabela de transparência** com doses/%VD reais). Hero pain-first ("Você já tentou de tudo por fora — menos olhar por dentro"). Copy da Lovable + metafields Shopify
- **Rastreamento:** Meta Pixel `828186133708463` (PageView + ViewContent + InitiateCheckout) · repasse de UTMs no checkout · OG/Twitter
- **Imersão:** GSAP ScrollTrigger (parallax de imagens + **cor do fundo WebGL por seção**), cursor glow, entrada cinematográfica do hero, marquee de ativos, barras de %VD animadas, header some ao rolar. Libs de animação **self-hosted** em `landing-hair/vendor/` (three via unpkg).
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

### 5. Super Vitamina C — Vitamina C + Quercetina + Própolis
- **Pasta:** `landing-super-vitamina-c/`
- **Link:** https://raw.githack.com/BotanikaHub/Botanika-Desing/lp/landing-super-vitamina-c/index.html
- **Shopify:** produto `super-vitamina-c` · **VARIANT_ID `48115368460520`**
- **Preço:** R$ 89,52 (ou 3× de R$ 29,84) · kits 2 un `SUPER5` (−5%) e 3 un `SUPER10` (−10%) — descontos automáticos por quantidade; cupom `BOTANIKA` (5%) no pote avulso · frete grátis > R$349
- **Produto:** Vitamina C 1000 mg + Quercetina 100 mg + Própolis (6 mg de compostos fenólicos) · 60 cápsulas (30 doses) · 2 cápsulas/dia
- **Identidade:** "Âmbar Vivo · Efervescência Cítrica" — âmbar-noite + laranja/mel + lima-quercetina · fundo WebGL flow-wave recolorido ("vitamina C líquida" + motes) com fallback 2D · Spectral + Onest
- **Status:** ✅ pronta

### 6. TetraVit D — Vitaminas A, D3, E e K2 em Gotas
- **Pasta:** `landing-tetravit/`
- **Link:** https://raw.githack.com/BotanikaHub/Botanika-Desing/lp/landing-tetravit/index.html
- **Shopify:** produto `tetravit-d` · **VARIANT_ID `48115367936232`** (SKU 80.1.9)
- **Preço:** R$ 117,12 à vista · ou 3x de R$ 39,04 · kits 2 (5% OFF → R$ 222,53) e 3 (10% OFF → R$ 316,22) · cupom `BOTANIKA` · frete grátis > R$349
- **Produto:** A, D3 (50 mcg/333% VD), E, K2 (MK-7) em veículo TCM · 30 ml · 2 gotas/dia · 300 doses (~10 meses) · sem glúten/açúcar
- **Identidade:** **"Luz Líquida"** — espresso/âmbar quente + mel/ouro-líquido + coral-nascer-do-sol + verde-mineral K2 · fundo canvas próprio (gotículas de óleo dourado subindo + "sol" que segue o cursor) · **Newsreader + Sora**
- **Ângulo:** dor primeiro — "D3 sozinha é metade da equação"; sinergia D3+K2 (íons de cálcio animados em SVG) como coração da página
- **Imagens:** caixa em **PNG transparente** (recorte via Higgsfield, CDN cloudfront) flutuando no hero/oferta; **depoimentos reais** em `landing-tetravit/proof/` (galeria estilo stories) + **UGC real** em "para quem é"; fotos Shopify enquadradas nas seções internas
- **Imersão:** smooth-scroll com momentum + parallax por seção, aura de cor por seção, loader, count-up, tilt+glow, botões magnéticos, barra de compra fixa no mobile. **100% autocontido** (sem `vendor/`, canvas 2D próprio), Safari-safe
- **Status:** ✅ pronta

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

## Como CRIAR uma nova página (comando pra colar num chat novo)
> "Leia `botanika-lp-kit/COMANDO-CRIAR-LP.md` no repo `botanikahub/botanika-desing` e siga-o à risca. Use como régua `git show origin/lp:landing-hair/index.html` e `git show origin/lp:landing-omega/index.html`. Vou criar a LP do **[PRODUTO]**. Responda só com (a) pasta, (b) identidade proposta e (c) referências — e aguarde meu ok."

O comando completo (v2, com todos os aprendizados: metafields do Shopify como fonte da verdade, descontos automáticos por quantidade, fotos reais, WebGL flow-wave, loader, tabela de doses, prova em print) fica em **`botanika-lp-kit/COMANDO-CRIAR-LP.md`**. **Exemplo-régua da última LP:** `landing-hair/` (a mais completa).
