# Mudança 5 · Order bump + barra de frete grátis — Hair

> Adaptação do "carrinho contínuo" pra LP estática: a página redireciona pro `/cart/`, então o análogo é
> **1 order bump contextual + barra de progresso de frete grátis + cart permalink multi-item**.

## Como ficou (Hair) — no bloco da oferta (`.offer-cta`)
- **Barra de frete grátis (R$349, real):** `Faltam R$ X pra frete grátis` → enche → **"🎉 Frete grátis desbloqueado!"** (verde) ao cruzar R$349.
- **Order bump — Tri[Mg] Complex** (VARIANT `48115368558824`, **R$ 87,50**, preço confirmado no Shopify): card com checkbox + miniatura. Ao marcar, entra no carrinho e a barra atualiza.
- **Card com a cara do PRODUTO do bump** (não da página): classe modificadora `.bump-<produto>` (aqui `.bump-tri` = meia-noite índigo + menta, a identidade do Tri). Assim o bump "salta" como um produto diferente. Padrão reutilizável: cada LP dá ao card o tema do produto que está oferecendo.
- **Cart permalink multi-item:** `#buy` vira `/cart/48650670670056:<kit>,48115368558824:1`. Kit 1 mantém `?discount=BOTANIKA`.

## Matemática (por que funciona)
Frete grátis = R$349. **kit 3 (R$268,38) + Tri (R$87,50) = R$355,88** cruza o limite → o bump **desbloqueia o frete** no melhor kit.

## Preço/afinidade: seguir os pares REAIS da loja (resposta à pergunta do dono)
A loja **tem** convenção de bump/cross-sell via descontos automáticos **BxGy** rotulados `[BUMP]`/`[KIT]`/`[CAMPANHA]` — mas **todos estão EXPIRADOS hoje**. Pares históricos encontrados:
- `[BUMP] Whey → Creatina 10%`
- `[KIT] Whey/Crea/Taurato + Hair — 5% no Hair` ← único par histórico do **Hair** (com a linha fitness, não com o Tri)
- `[CAMPANHA] Sono — Tri/Sleep → TetraVit`
- `[CAMPANHA] Imunidade — Tetra/Ômega/VitC`

**Ativos hoje:** só os `[ESCADA]` de quantidade por produto (5%/2un, 10%/3un) + frete grátis. → **Nenhum desconto ativo casa o Hair com outro produto**, então o bump entra a **preço cheio real** (honesto).

**Regra pras LPs:** o produto do bump deve seguir o **par BxGy real e ATIVO** da loja quando existir (aí o bump ganha desconto de verdade). Não existindo, escolher um produto de afinidade e vender a **preço cheio real** (sem inventar desconto). Se quiser que o bump tenha desconto, **ativar/criar** o BxGy no Shopify primeiro (é um write — só com OK do dono).

## Onde está (`landing-hair/index.html`)
- CSS: `/* order bump + barra de frete grátis */` (`.frete*`, `.bump*`) + `/* tema do PRODUTO do bump */` (`.bump-tri`).
- Markup: `.frete` + `<label class="bump bump-tri">` no topo do `.offer-cta`, antes do `#buy`.
- JS: `BUMP={v,price}` (variante+preço reais), `bumpOn`, `FRETE=349`; `checkout()` anexa `,BUMP.v:1`; `updateFrete()` calcula total×349; toggle atualiza href+barra. `applyKit` chama `updateFrete()`.

## Testado (headless)
- kit3: "Faltam R$ 80,62" → +Tri: "Frete grátis desbloqueado!", href `...:3,48115368558824:1`. Sem overflow 390px · `node --check` + tags OK. Card temado (dark índigo + menta) conferido.

## Export p/ as outras LPs
> "Order bump + barra de frete (`05-ORDER-BUMP.md`). Bump = **par BxGy real e ATIVO** da loja (`automaticDiscountNodes`, rótulos `[BUMP]/[KIT]`); não havendo, produto de afinidade a **preço cheio real confirmado no Shopify**. Frete grátis = R$349. Card com o **tema do produto do bump** (`.bump-<slug>`). `checkout()` anexa `,<variant>:1`; nunca empilhar mais de um bump."
