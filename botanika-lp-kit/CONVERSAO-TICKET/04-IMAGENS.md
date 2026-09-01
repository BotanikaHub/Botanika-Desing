# Mudança 4 · Imagens de benefício/objeção — Hair

## Como ficou (Hair)
Seção nova **`#resultados`** ("O que muda quando o cuidado vem de dentro"), entre **Benefícios** e **Ritual**.
4 cards **4:5** (imagem cobrindo + overlay: **selo lime no topo**, frase em Fraunces embaixo sobre gradiente):
- **Cabelo** — "Força e brilho que nascem na raiz."
- **Unhas** — "Firmeza que você sente no dia a dia."
- **Pele** — "O viço que vem de dentro."
- **1 por dia** (quebra a objeção "é complicado") — "Uma cápsula. Sem cronograma, sem drama."

Grid 4 col (desktop) → 2 col (≤820px). Foto do produto continua **primeiro** (hero); estes cards de benefício vêm no meio, antes das fotos secundárias das seções finais.

## Como as imagens foram feitas/hospedadas (fluxo reutilizável)
1. **Geração:** Higgsfield `generate_image_batch`, modelo `soul_2`, aspect 4:5 (saiu 3:4, 1536×2048), estilo editorial/lifestyle, mulheres brasileiras 30–50, luz quente, tons creme/índigo/dourado, **sem rótulo/texto/logo** (IA erra rótulo → cenas de benefício, não o produto).
2. **Hospedagem estável:** as URLs do Higgsfield são **cloudfront temporário** (expiram) → ingeridas no **Shopify** via `fileCreate` (server-side) → URLs permanentes `cdn.shopify.com`. **Nunca** referenciar o cloudfront direto na LP.
3. **Na LP:** referenciar a URL `cdn.shopify.com`. (No sandbox do agente o cdn.shopify é bloqueado p/ QA próprio — revisar no preview raw.githack, que carrega normal no navegador do usuário.)

### URLs no Shopify (Hair)
- Cabelo: `.../files/hf_20260901_014632_226d1088-...png`
- Unhas: `.../files/hf_20260901_014632_d8689e33-...png`
- Pele: `.../files/hf_20260901_014632_01b03cca-...png`
- Rotina: `.../files/hf_20260901_014632_91e0448e-...png`
(MediaImage GIDs `40550526583016/615784/648552/681320`.)

## Export p/ as outras LPs
> "Replique a seção `#resultados` (cards 4:5, `.bcards/.bcard`). Gere as imagens no Higgsfield (`soul_2`, 4:5, editorial, sem rótulo), **ingira no Shopify via `fileCreate`** e use as URLs `cdn.shopify.com` (nunca o cloudfront). Copy ANVISA-safe da categoria; selo = pilar/benefício, frase curta embaixo."

## Pendências
- **Revisão visual do usuário** (o agente não consegue QA das imagens — cdn.shopify bloqueado no sandbox). Se alguma imagem não servir, regenerar + re-ingerir + trocar URL.
