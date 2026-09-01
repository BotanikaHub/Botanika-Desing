# Mudança 5 · Order bump + barra de frete grátis — Hair

> Adaptação do "carrinho contínuo" pra LP estática: a página redireciona pro `/cart/`, então o análogo é
> **1 order bump contextual + barra de progresso de frete grátis + cart permalink multi-item**.

## Como ficou (Hair) — no bloco da oferta (`.offer-cta`)
- **Barra de frete grátis (R$349, real):** `Faltam R$ X pra frete grátis` → enche → **"🎉 Frete grátis desbloqueado!"** (verde) ao cruzar R$349.
- **Order bump — Tri[Mg] Complex** (VARIANT `48115368558824`, **R$ 87,50/frasco**): **réplica do card de oferta da própria página do Tri** (`landing-tri`) — um card premium com **seletor de frascos (1/2/3)** em pill deslizante, **stage com os frascos em leque** (`bottle-tri.png`), **selo circular −5%/−10%**, preço grande `3× de R$ X` (número em dourado) + `ou R$ Y à vista` + linha `economize R$ Z` (com o cheio riscado, no padrão do Tri) + tag ("Preço regular" / "Mais vendido · 5% OFF" / "Menor preço · 10% OFF"). Botão **"Adicionar ao meu pedido"** (opcional) — quando adicionado, entra no checkout e move a barra de frete pelo **total do frasco selecionado**; trocar a quantidade atualiza ao vivo; clicar de novo remove.
  - 1 frasco: R$ 87,50 · `3× de R$ 29,17` (preço regular)
  - 2 frascos: R$ 166,25 (−5%, economize R$ 8,75) · `3× de R$ 55,42`
  - 3 frascos: R$ 236,25 (−10%, economize R$ 26,25) · `3× de R$ 78,75`
  - Preços/economia = **escada REAL e ATIVA do Tri** (`[ESCADA] Tri 5% 2un`, `[ESCADA] Tri 10% 3un`) — os mesmos números da página do Tri. *(O BxGy `[BUMP] Hair → Tri[Mg] 5%` segue ativo no Shopify mas não é divulgado — a escada do Tri já é o desconto real; se o BxGy aplicar, é bônus silencioso.)*
  - **Reuso do design entre LPs:** o card do bump herda o visual da LP do produto ofertado — mesmos tokens (aqui Hair e Tri já compartilham `#303890`/`#F8C840`, Fraunces+Inter), classes `bt-*` copiadas do `.buy-card` do Tri, e o asset `bottle-tri.png` trazido pra pasta do Hair.
- **Card com a cara do PRODUTO do bump** (não da página): classe modificadora `.bump-<produto>` (aqui `.bump-tri` = meia-noite índigo + menta, a identidade do Tri). Assim o bump "salta" como um produto diferente. Padrão reutilizável: cada LP dá ao card o tema do produto que está oferecendo.
- **Cart permalink multi-item:** `#buy` vira `/cart/48650670670056:<kit>,48115368558824:<frascos>` (frascos = 1/2/3 do card escolhido). Kit 1 mantém `?discount=BOTANIKA`. Os descontos de escada (Hair e Tri) são **automáticos** e **combinam** (`combinesWith.productDiscounts:true` nos dois) — aplicam sozinhos no carrinho, sem code na URL, sem um cancelar o outro (PDP = checkout).

## Desconto real criado (BxGy)
- **`[BUMP] Hair → Tri[Mg] 5%`** — `DiscountAutomaticNode/1576169505000`, **ACTIVE**, sem data de fim.
- Compra 1× Hair (`Product/9525143896296`) → ganha 1× Tri[Mg] (`Product/9347154968808`) a **−5%**.
- `combinesWith {productDiscounts:true, orderDiscounts:true, shippingDiscounts:true}` — verificado que os `[ESCADA] Hair 5%/10%` (kit 2/3) também combinam com productDiscounts, então o desconto do kit **não é cancelado** pelo bump (PDP = checkout).

## Matemática (frete)
Frete grátis = **R$349** (confirmado: não é um desconto — é uma regra de frete no *delivery profile*, `TOTAL_PRICE ≥ 349 BRL → MeuCorreios grátis`). Os `[FRETE]` de R$199 estão todos EXPIRADOS; o frete vivo é a regra de R$349.
- A preço cheio, o Tri é **R$87,50** → **kit3 (268,38) + Tri = 355,88 ≥ 349** → o bump **desbloqueia o frete** no melhor kit (com folga). O gancho "adicione e ganhe frete grátis" entrega sem depender de nenhum desconto.
- (Existe o BxGy `[BUMP] Hair → Tri[Mg] 5%` ativo no Shopify — foi criado a 5% justamente pra que, **se** aplicasse, o kit3+Tri ainda ficasse ≥349. Como não aplicou no teste do dono, a LP usa o preço cheio e não anuncia %.)

## Pares BxGy da loja (contexto)
`[BUMP]` ativos hoje (todos 10%): `Whey → Creatina`, `Hair → Vitamina C`, `Tri[Mg] → TetraVit D`, `Vit C/Ômega → TetraVit D`, `Sleep → Tri[Mg]`, `Creatina → Whey`. O `Hair → Vitamina C 10%` continua ativo (inofensivo; a LP só deixou de destacar a Vit C). Criei o `Hair → Tri[Mg] 5%` pra casar com o bump escolhido nesta LP.

**Regra pras LPs:** o produto do bump deve seguir um **par BxGy real e ATIVO** (`automaticDiscountNodes`, rótulo `[BUMP]`). Se o par que você quer não existe, **crie o BxGy** no Shopify (write — só com OK do dono) antes de exibir qualquer %/preço com desconto; escolha a % pensando no gancho do frete (deve manter o melhor kit ≥ R$349 se o objetivo é desbloquear frete). Sem desconto criado, o bump entra a **preço cheio real** (sem inventar desconto).

## Onde está (`landing-hair/index.html`)
- Asset: frasco transparente do Tri hospedado no **Shopify CDN** — `cdn.shopify.com/.../bottle-tri-transparente.png` (MediaImage `40551848444136`). O PNG transparente do `landing-tri/` foi ingerido no Shopify via `stagedUploadsCreate` + `fileCreate` (não referenciar cópia local — na convenção da LP, imagem de produto vive no Shopify CDN; o commit local não propagava no preview).
- CSS: bloco `/* order bump — réplica do card de oferta da página do Tri[Mg] */` (`.bumptri`, `.bt-qty`/`.bt-pill`, `.bt-card`, `.bt-stage`/`.bt-shelf`/`.bt-vis`/`.b1/.b2/.b3`, `.bt-badge`, `.bt-info`/`.bt-tag`/`.bt-price`/`.bt-pm`/`.bt-cash`/`.bt-save`, `.bt-add`) — adaptado do `.buy-card` do Tri com os tokens do Hair (`--indigo`=mint, `--indigo-soft`=violet, `--gold`=champ).
- Markup: `.frete` + `<div class="bumptri" id="bumptri" data-on>` (heading + `.bt-qty` pill 1/2/3 + `.bt-card` [stage com 3× `bottle-tri.png` + `#bt-badge`] [info: `#bt-tag`/`#bt-price`/`#bt-cash`/`#bt-save` + botão `#bt-add`]) no `.offer-cta`, antes do `#buy`.
- JS: `BUMPV` + `BUMPS={'1':{n,total,inst,cash,tag,save,badge},...}` (números REAIS da escada do Tri) + `btSel` (frasco selecionado), `btOn` (adicionado?), `bumpQty` (0 ou frascos). IIFE `#bumptri`: `render()` (atualiza tag/preço/cash/save/badge/leque), `pill()` (desliza sob o botão ativo), `apply()` (liga/desliga o bump → `data-on`, texto do botão, `bumpQty`, href, frete). `checkout()` anexa `,BUMPV:bumpQty`; `updateFrete()` soma `BUMPS[bumpQty].total`.

## Testado (headless)
- Trocar frasco (sem adicionar) **pré-visualiza** tag/preço/selo (qty3 → "Menor preço · 10% OFF", R$78,75, selo −10%, "economize R$26,25") sem mexer no frete/checkout. **Adicionar** → `data-on=1`, botão "✓ Adicionado", frete kit3+3fr **"desbloqueado!"** (100%), href `...:3,48115368558824:3`. Trocar p/ 2 frascos com o bump ligado atualiza href `...:3,...:2` ao vivo. **Remover** volta pra 77%/kit3. `bottle-tri.png` carrega; leque + pill deslizante OK. Sem overflow 390px · `node --check` + tags OK.

## Export p/ as outras LPs
> "Order bump + barra de frete (`05-ORDER-BUMP.md`). O add-on pode ser **kit de quantidade do MESMO produto** (1/2/3 frascos, escolha única) aproveitando a **escada real do produto** (`[ESCADA] <produto> 5%/10%`, `automaticDiscountNodes` ATIVO → economia honesta nos kits 2/3), **ou** um cross-sell via **par BxGy real e ATIVO** (`[BUMP]`). Só exiba %/economia se houver desconto real e ativo; senão, **preço cheio real confirmado no Shopify** (sem riscar). Ponha o **parcelado em evidência** (padrão do preço da LP). Frete grátis = confirme no *delivery profile* (`TOTAL_PRICE ≥ X`), não nos `[FRETE]` (podem estar expirados) — na loja hoje é **R$349**. Cards com o **tema do produto do bump** (`.bump-<slug>`). `checkout()` anexa `,<variant>:<qtd>`; `updateFrete()` soma o total do kit escolhido; single-select — **nunca empilhar** mais de um add-on. Confirme que a escada do add-on **combina** (`combinesWith.productDiscounts:true`) com a escada do produto principal antes de mostrar os dois descontos juntos."
