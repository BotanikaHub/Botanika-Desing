# Mudança 5 · Order bump + barra de frete grátis — Hair

> Adaptação do "carrinho contínuo" pra LP estática: a página redireciona pro `/cart/`, então o análogo é
> **1 order bump contextual + barra de progresso de frete grátis + cart permalink multi-item**.

## Como ficou (Hair) — no bloco da oferta (`.offer-cta`)
- **Barra de frete grátis (R$349, real):** `Faltam R$ X pra frete grátis` → enche → **"🎉 Frete grátis desbloqueado!"** (verde) ao cruzar R$349.
- **Order bump — Tri[Mg] Complex** (VARIANT `48115368558824`, **R$ 87,50** cheio): card com checkbox + miniatura. Em vez de prometer desconto, o card **risca o valor cheio à vista** (`R$ 87,50`) e coloca **em evidência o parcelado — `3× de R$ 29,17 sem juros`** (mesmo padrão do preço do Hair). Ao marcar, entra no carrinho e a barra de frete atualiza usando o **preço cheio**. *(O BxGy 5% existe no Shopify mas não aplicou no teste de checkout do dono → não divulgamos desconto; se aplicar, é bônus silencioso, nunca promessa quebrada.)*
- **Card com a cara do PRODUTO do bump** (não da página): classe modificadora `.bump-<produto>` (aqui `.bump-tri` = meia-noite índigo + menta, a identidade do Tri). Assim o bump "salta" como um produto diferente. Padrão reutilizável: cada LP dá ao card o tema do produto que está oferecendo.
- **Cart permalink multi-item:** `#buy` vira `/cart/48650670670056:<kit>,48115368558824:1`. Kit 1 mantém `?discount=BOTANIKA`. O BxGy é **automático** — aplica sozinho no carrinho quando o par Hair+Tri está presente (não precisa de code na URL).

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
- CSS: `/* order bump + barra de frete grátis */` (`.frete*`, `.bump*`) + `/* tema do PRODUTO do bump */` (`.bump-tri`) + `.bump-old` (preço cheio riscado).
- Markup: `.frete` + `<label class="bump bump-tri">` no topo do `.offer-cta`, antes do `#buy`; small com `<s class="bump-old">R$ 87,50</s>` + `<b class="bump-price">3× de R$ 29,17 sem juros</b>`.
- JS: `BUMP={v,price}` (variante + preço cheio real), `bumpOn`, `FRETE=349`; `checkout()` anexa `,BUMP.v:1`; `updateFrete()` calcula total×349 usando `BUMP.price`; toggle atualiza href+barra. `applyKit` chama `updateFrete()`.

## Testado (headless)
- kit3 s/ bump: "Faltam R$ 80,62" (77%). kit3 + Tri: **"Frete grátis desbloqueado!"** (100%), href `...:3,48115368558824:1`. Card mostra ~~R$ 87,50~~ **3× de R$ 29,17 sem juros**. Sem overflow 390px · `node --check` + tags OK.

## Export p/ as outras LPs
> "Order bump + barra de frete (`05-ORDER-BUMP.md`). Bump = **par BxGy real e ATIVO** da loja (`automaticDiscountNodes`, rótulo `[BUMP]`); se o par não existir, **crie o BxGy** no Shopify (só com OK do dono) antes de exibir desconto — a % deve manter o melhor kit ≥ frete grátis se o gancho é desbloquear frete; sem BxGy, **preço cheio real confirmado no Shopify**. Frete grátis = confirme no *delivery profile* (`TOTAL_PRICE ≥ X`), não nos `[FRETE]` (podem estar expirados) — na lota hoje é **R$349**. Card com o **tema do produto do bump** (`.bump-<slug>`), preço riscado + preço c/ desconto + selo. `checkout()` anexa `,<variant>:1` (BxGy aplica automático); `updateFrete()` usa o preço **com desconto**; nunca empilhar mais de um bump."
