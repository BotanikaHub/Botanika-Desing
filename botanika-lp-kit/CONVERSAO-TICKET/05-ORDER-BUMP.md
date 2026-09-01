# Mudança 5 · Order bump + barra de frete grátis — Hair

> Adaptação do "carrinho contínuo" pra LP estática: a página redireciona pro `/cart/`, então o análogo é
> **1 order bump contextual + barra de progresso de frete grátis + cart permalink multi-item**.
> A troca do drawer por página de carrinho é recurso do Shopify (fora do escopo da LP).

## Como ficou (Hair) — no bloco da oferta (`.offer-cta`)
- **Barra de frete grátis (R$349, real):** mostra `Faltam R$ X pra frete grátis` e a barra enche conforme o total; ao cruzar R$349 vira **"🎉 Frete grátis desbloqueado!"** (barra fica verde).
- **Order bump — Super Vitamina C** (VARIANT `48115368460520`, **R$ 89,52**, preço confirmado no Shopify): card com checkbox + miniatura do produto. Ao marcar, entra no carrinho e a barra de frete atualiza.
- **Cart permalink multi-item:** `#buy` vira `/cart/48650670670056:<kit>,48115368460520:1`. Kit 1 mantém `?discount=BOTANIKA`; kits 2/3 seguem com o desconto automático de quantidade.

## Matemática (por que funciona)
Frete grátis = R$349. Só **kit 3 (R$268,38) + Vit C (R$89,52) = R$357,90** cruza o limite → o bump **desbloqueia o frete** no melhor kit. Ótimo empurrão de ticket sem mentir.

## Onde está (`landing-hair/index.html`)
- CSS: bloco `/* order bump + barra de frete grátis */` (`.frete*`, `.bump*`).
- Markup: `.frete` + `<label class="bump">` no topo do `.offer-cta`, antes do `#buy`.
- JS: `SUPERC` (variante/preço), `bumpOn`, `FRETE=349`; `checkout()` anexa `,SUPERC.v:1` quando `bumpOn`; `updateFrete()` calcula total e pinta a barra; toggle do `#bump-chk` atualiza href + barra. `applyKit` chama `updateFrete()`.

## Testado (headless)
- kit3: "Faltam R$ 80,62" (77%); +bump → "Frete grátis desbloqueado!" (100%), href `...:3,48115368460520:1`.
- kit1+bump → "Faltam R$ 160,08", href `...:1,48115368460520:1?discount=BOTANIKA`. Sem overflow 390px · `node --check` + tags OK.

## Regras seguidas (do epic)
- **1 bump por vez** (contextual, não empilhado). Amarrado a **desconto/preço real**. Seletor de quantidade só com quantidades que têm desconto real (o bump é 1 un a preço cheio real).
- Upsells/order bumps existentes na loja **não** são tocados (isso é o checkout Shopify; a LP só monta o permalink).

## Export p/ as outras LPs
> "Replique o order bump + barra de frete (`05-ORDER-BUMP.md`). Escolha **1 produto de manutenção** coerente como bump e **confirme o preço real no Shopify**. Frete grátis = R$349. `checkout()` anexa `,<variant_bump>:1`; `updateFrete()` calcula total vs 349. Nunca empilhar mais de um bump."
