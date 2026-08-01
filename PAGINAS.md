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
- **Shopify:** produto `hair-botanika` (confirmar handle) · **VARIANT_ID `HAIR_VARIANT_ID` (⚠️ placeholder — trocar pelo real)**
- **Preço:** *placeholder* 3x de R$ 32,33 · ou R$ 97,00 · kits 2 (5% OFF) e 3 (10% OFF + frete grátis) — *confirmar preços/variant na loja*
- **Produto:** 12 ativos (Biotina, Silício Orgânico, Zinco, Ferro, Cisteína, Metionina, Iodo, Vit A/E/B1/B2/B5) · 60 cápsulas · 38g · sem açúcar/glúten
- **Identidade:** "Seiva & Raiz" — verde-botânico profundo + rosé-champagne + dourado · fundo canvas "cascata de fios luminosos" (reage ao mouse) · Italiana + Outfit
- **Pote:** render SVG estilizado (trocar por PNG transparente quando disponível)
- **Status:** ✅ pronta (pendente: VARIANT_ID + preços reais da loja)

### 4. Whey Balance Chocolate — Whey + Colágeno C-PURE®
- **Pasta:** `landing-whey-balance-chocolate/`
- **Link:** https://raw.githack.com/BotanikaHub/Botanika-Desing/lp/landing-whey-balance-chocolate/index.html
- **Shopify:** produto `whey-balance-chocolate` · **VARIANT_ID `48115368919272`**
- **Preço:** 3x de R$ 49,10 · ou R$ 147,30 à vista · 455 g · kits 2/3 com cupom `BOTANIKA` (5% OFF) — *confirmar descontos de kit na loja*
- **Produto:** whey concentrado + colágeno hidrolisado C-PURE® · 23 g de proteína/porção · adoçado naturalmente · sem açúcar/corantes/glúten · força + tônus
- **Identidade:** "Azul Royal & Cacau Dourado" — azul-royal profundo + dourado · fundo canvas de partículas douradas · Playfair Display + Manrope
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
