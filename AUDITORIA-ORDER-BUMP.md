# Auditoria — Order Bump do carrinho (`snippets/botanika-order-bump.liquid`)

Data: 2026-08-24 · Tema: **"Creatina - Tema Padrão"** (`OnlineStoreTheme/158758928616`, 9 pares) —
cópia que vai ao ar. O **"Tema Padrão"** (MAIN, `158480433384`) tem só 8 pares, sem Creatina→Whey.

Método: `draftOrderCalculate` com `acceptAutomaticDiscounts: true`, 1 carrinho por par,
conferindo o preço unitário real contra o que o card promete (`price × 0,9`).

## Tabela par a par (estado atual)

| # | Trigger | Bump ofertado | Card promete | Desconto (ID) | Entregue qty 1 | qty ≥ 2 (escada no trigger) |
|---|---|---|---|---|---|---|
| 1 | Whey Choco | Creatina (10% no Whey) | R$ 132,57 no Whey | `[BUMP] Creatina → Whey` 1574087000296 | ✅ 132,57 | oculto |
| 2 | Whey Sem Sabor | Creatina (10% no Whey) | R$ 132,57 no Whey | `[BUMP] Creatina → Whey` 1574087000296 | ✅ 132,57 | oculto |
| 3 | Hair | Super Vit C | R$ 80,57 | `[BUMP] Hair → Vitamina C` 1572745773288 | ✅ 80,57 | oculto |
| 4 | Tri[Mg] | TetraVit D | R$ 105,41 | `[BUMP] Tri[Mg] → TetraVit D` 1572746133736 | ✅ 105,41 | oculto |
| 5 | TetraVit D | Super Ômega 3 | R$ 146,81 | `[BUMP] TetraVit D → Ômega 3` 1572746166504 | ✅ 146,81 | oculto |
| 6 | Super Vit C | TetraVit D | R$ 105,41 | `[BUMP] Vit C / Ômega → TetraVit D` 1573508743400 | ✅ 105,41 | oculto |
| 7 | Super Ômega 3 | TetraVit D (10% no Ômega) | R$ 146,81 no Ômega | `[BUMP] TetraVit D → Ômega 3` 1572746166504 | ✅ 146,81 | oculto |
| 8 | Sleep | Tri[Mg] | R$ 78,75 | `[BUMP] Sleep → Tri[Mg]` 1573508776168 | ✅ 78,75 | oculto |
| 9 | Creatina | Whey (Choco + Sem Sabor) | R$ 132,57 | `[BUMP] Creatina → Whey` 1574087000296 | ✅ 132,57 | oculto |

**Nenhum par órfão**: os 9 têm BxGy ATIVO, sem `endsAt`, 10% no produto ofertado,
`combinesWith {order, product, shipping} = true`. Os pares 1, 2 e 7 tiveram a copy invertida (FIX 3); os demais entregam direto.
Com trigger qty >= 2 a escada assume e o card fica **oculto** pelo gate (FIX 2).

## FIX 1 — Whey Sem Sabor no par 9 (aplicado)

`[BUMP] Creatina → Whey 10%` (1574087000296) cobria só o Chocolate; quem trocasse pro
Sem Sabor pagava R$ 147,30 cheio. Adicionado `Product/9600936902888`.
Verificado: Creatina 1× + Whey Sem Sabor 1× = **R$ 132,57** ✅
Foi *update*, não consumiu slot do teto de 25.

## FIX 2 — gate da escada no tema (aplicado)

**Defeito A — escada no trigger anula o bump.** O `[BUMP]` é um BxGy cujo "customer buys"
é o trigger. Se essa **mesma linha** já recebe um `[ESCADA]`, o Shopify descarta o BxGy
inteiro. Reproduz o print do dono: 4× Creatina + 1× Whey → subtotal R$ 609,18,
Creatina 115,47 (escada) e **Whey 147,30 cheio**.

Vale pros 9 pares (todo trigger tem escada ativa):
trigger qty 1 → bump aplica; trigger qty ≥ 2 → escada dispara → bump morre.
Escada em produto *diferente* do trigger não atrapalha.

Correção no snippet: o card só aparece se a linha do trigger estiver **sem nenhum
desconto de linha** (`line_level_discount_allocations.size == 0`). Regra genérica —
não depende de hardcodar qty, e acompanha qualquer escada futura.

## FIX 3 — pares recíprocos, copy invertida (aplicado)

**Defeito B.** Onde existem os dois sentidos (T→B e B→T), o Shopify aplica **um só**:
o que desconta o produto mais caro — que é o **trigger**, não o bump. Atinge os pares 1, 2 e 7.

- Whey ↔ Creatina: ganha `Creatina → Whey` (14,73 no Whey) sobre `Whey → Creatina` (12,83).
- Ômega ↔ TetraVit: ganha `TetraVit → Ômega` (16,31) sobre `Ômega → TetraVit` (11,71).

Atenuante: o cliente pagava **menos** que o card prometia no total — o desconto é maior,
só caía na outra linha. Era erro de exibição, não prejuízo.

Correção (opção **a**, escolhida pelo dono): esses 3 cards passam a anunciar o desconto
no produto que de fato o recebe, mantendo a oferta e o valor. Marcados por `ob_reverse`
(`'1,1,0,0,0,0,1,0,0'`), com o nome curto do trigger em `ob_shorts`.

| # | Headline nova | Preço grande | Selo verde |
|---|---|---|---|
| 1 | Leve a Creatina e ganhe 10% no seu Whey | R$ 128,30 (Creatina) | 10% no seu Whey Balance: ~~R$ 147,30~~ R$ 132,57 |
| 2 | Leve a Creatina e ganhe 10% no seu Whey | R$ 128,30 (Creatina) | 10% no seu Whey Balance: ~~R$ 147,30~~ R$ 132,57 |
| 7 | Leve o TetraVit D e ganhe 10% no seu Ômega 3 | R$ 117,12 (TetraVit) | 10% no seu Ômega 3: ~~R$ 163,12~~ R$ 146,81 |

CTA nesses casos: "Adicionar e ativar 10% OFF". Preços saem de `product.price` (nada
hardcoded) e batem com o que o `draftOrderCalculate` entrega. **Nenhum card mente mais.**

## Teto de descontos automáticos

~25 ativos (16 `[ESCADA]`, 7 `[BUMP]`, 1 `[KIT]`, 1 app Upsell.com) + 1 `[CAMPANHA]`
SCHEDULED. No limite. Candidatos a liberar slot: `[ESCADA] Sleep Inositol — 5% (2un)`
(o 10% já expirou, escada pela metade) e `[KIT] Kit Whey/Crea/Taurato + Hair — 5% no Hair`.
