# HOSTING — domínio das campanhas (Cloudflare Pages + GoDaddy)

As LPs da Botanika rodam no domínio da marca via **Cloudflare Pages** (host) + **GoDaddy** (DNS).
A loja `botanikabrasil.com.br` (raiz) continua na Shopify — as LPs usam um **subdomínio**.

## O que está no ar
- **Domínio das campanhas:** `https://ofertas.botanikabrasil.com.br/<slug>`
  - `/omega3`  → `landing-omega`
  - `/trimagnesio` → `landing-tri`
  - `/hair` → `landing-hair`
- **Projeto Cloudflare Pages:** `botanika-desing` (conta `operacional.botanika@gmail.com`)
  - Git: `BotanikaHub/Botanika-Desing`, **Production branch: `lp`**
  - **Build command:** `bash build.sh` · **Build output:** `/`
  - `*.pages.dev` interno: `botanika-desing.pages.dev`
- **DNS (GoDaddy):** CNAME `ofertas` → `botanika-desing.pages.dev` (nameservers seguem na GoDaddy).

## Como os slugs limpos funcionam
`build.sh` (raiz do repo) roda no deploy e **copia** cada `landing-<slug>` para uma pasta com o
slug curto usado no anúncio. Assim `/omega3` é uma pasta real (URL curta, sem redirect) e as
`landing-*` continuam sendo a fonte da verdade (não muda nada pros outros agentes / raw.githack).
> ⚠️ O `_redirects` com rewrite `200` NÃO funciona no Pages (ele redireciona pra `/landing-*`). Por isso usamos `build.sh`.

## Adicionar um produto novo ao domínio
1. Criar a LP normal em `landing-<slug>/index.html`.
2. Em `build.sh`, adicionar 1 linha: `clone landing-<slug> <slug-do-anuncio>`.
3. Commit/push na `lp` → deploy automático (~1-2 min) → `ofertas.botanikabrasil.com.br/<slug-do-anuncio>` no ar.

## Regras de ouro (não quebrar)
- **Nunca** trocar os nameservers da GoDaddy pra Cloudflare, nem mexer no registro raiz `@`/`www`/MX (é a loja + e-mail).
- No Custom domain do Pages, usar sempre **"My DNS provider → Begin CNAME setup"** (não "DNS transfer").
- Deploy automático está ligado: qualquer push na `lp` republica. Validar antes (`node --check` + tags).

## Setup do zero (se precisar recriar)
1. Cloudflare → Workers & Pages → Create → **Pages** → Import Git → `Botanika-Desing`, branch `lp`, build `bash build.sh`, output `/`.
2. Aba **Custom domains** → Set up a domain → `ofertas.botanikabrasil.com.br` → **My DNS provider / Begin CNAME setup**.
3. GoDaddy → Manage DNS → Add CNAME: Name `ofertas`, Value `botanika-desing.pages.dev`, TTL 1h.
4. Voltar no Pages → **Check DNS records** → aguardar ficar **Active** (SSL automático).

## Tráfego pago
- Verificar `botanikabrasil.com.br` no **Meta Business → Domínios** (o subdomínio `ofertas.` entra junto). Pixel `828186133708463` + GA4 `G-2JFV5TGHCV` já nas LPs (ver `COMANDO-PIXEL.md`).
