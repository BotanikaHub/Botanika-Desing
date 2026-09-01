# Mudança 5 · Order bump + barra de frete grátis — Hair

> Adaptação do "carrinho contínuo" pra LP estática: a página redireciona pro `/cart/`, então o análogo é
> **1 order bump contextual + barra de progresso de frete grátis + cart permalink multi-item**.

## Como ficou (Hair) — no bloco da oferta (`.offer-cta`)
- **Barra de frete grátis (R$349, real):** `Faltam R$ X pra frete grátis` → enche → **"🎉 Frete grátis desbloqueado!"** (verde) ao cruzar R$349.
- **Order bump — Tri[Mg] Complex** (VARIANT `48115368558824`, **R$ 87,50/frasco**): **3 cards de escolha única** (1, 2 ou 3 frascos, ou nenhum) — todos com a identidade do produto (`.bump-tri`). Cada card põe **em evidência o parcelado** (`3× de R$ X sem juros`, padrão do Hair) — **sem riscar preço**. Os kits de 2 e 3 frascos seguem a **escada REAL e ATIVA do Tri** (`[ESCADA] Tri 5% 2un`, `[ESCADA] Tri 10% 3un`), então mostram **economia honesta** (selo `−5%`/`−10%` + "Economia de R$ X"). Escolher um card move a barra de frete pelo **total daquele kit**; marcar outro troca (single-select); clicar no marcado desmarca.
  - 1 frasco: R$ 87,50 · `3× de R$ 29,17`
  - 2 frascos: R$ 166,25 (−5%, economia R$ 8,75) · `3× de R$ 55,42`
  - 3 frascos: R$ 236,25 (−10%, economia R$ 26,25) · `3× de R$ 78,75`
  - *(O BxGy `[BUMP] Hair → Tri[Mg] 5%` continua ativo no Shopify mas **não é divulgado** — a escada do próprio Tri já dá desconto real nos kits 2/3; se o BxGy aplicar, é bônus silencioso.)*
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
- CSS: `/* order bump + barra de frete grátis */` (`.frete*`, `.bump*`) + `/* tema do PRODUTO do bump */` (`.bump-tri`) + `.bumps`/`.bumps-head` (grupo dos 3 cards) + `.bump-eco` (selo −5%/−10% menta, honesto = escada real).
- Markup: `.frete` + `<div class="bumps" id="bumps">` (heading + 3× `<label class="bump bump-tri" data-qty>` com `<input class="bump-chk" data-qty>`) no topo do `.offer-cta`, antes do `#buy`. Cada card: `<b class="bump-price">3× de R$ X sem juros</b>` + (2/3) `<em class="bump-eco">−5%/−10%</em>` + "Economia de R$ X". **Sem strikethrough.**
- JS: `BUMPV` (variante) + `BUMPS={'1':{qty,total},'2':...,'3':...}` (totais REAIS com a escada do Tri) + `bumpQty` (0 = nenhum), `FRETE=349`; `checkout()` anexa `,BUMPV:bumpQty`; `updateFrete()` soma `BUMPS[bumpQty].total`; seletor single-select nos `#bumps .bump-chk` (marca um → desmarca os outros; remarca → desliga). `applyKit` chama `updateFrete()`.

## Testado (headless)
- kit3 s/ bump: "Faltam R$ 80,62" (77%). kit3 + 1/3 frascos: **"Frete grátis desbloqueado!"** (100%), href `...:3,48115368558824:<n>`. Single-select: marcar 3 desmarca 1; clicar no marcado desliga. kit1 + 2 frascos: "Faltam R$ 83,35" (76%), href `...:1,48115368558824:2?discount=BOTANIKA`. Cards mostram `3× de R$ 29,17/55,42/78,75` + economia real. Sem overflow 390px · `node --check` + tags OK.

## Export p/ as outras LPs
> "Order bump + barra de frete (`05-ORDER-BUMP.md`). O add-on pode ser **kit de quantidade do MESMO produto** (1/2/3 frascos, escolha única) aproveitando a **escada real do produto** (`[ESCADA] <produto> 5%/10%`, `automaticDiscountNodes` ATIVO → economia honesta nos kits 2/3), **ou** um cross-sell via **par BxGy real e ATIVO** (`[BUMP]`). Só exiba %/economia se houver desconto real e ativo; senão, **preço cheio real confirmado no Shopify** (sem riscar). Ponha o **parcelado em evidência** (padrão do preço da LP). Frete grátis = confirme no *delivery profile* (`TOTAL_PRICE ≥ X`), não nos `[FRETE]` (podem estar expirados) — na loja hoje é **R$349**. Cards com o **tema do produto do bump** (`.bump-<slug>`). `checkout()` anexa `,<variant>:<qtd>`; `updateFrete()` soma o total do kit escolhido; single-select — **nunca empilhar** mais de um add-on. Confirme que a escada do add-on **combina** (`combinesWith.productDiscounts:true`) com a escada do produto principal antes de mostrar os dois descontos juntos."
