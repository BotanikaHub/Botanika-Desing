# Auditoria — Order Bump do carrinho (`snippets/botanika-order-bump.liquid`)

Data: 2026-08-24 · Tema: **"Creatina - Tema Padrão"** (`OnlineStoreTheme/158758928616`, 9 pares) —
cópia que vai ao ar. O **"Tema Padrão"** (MAIN, `158480433384`) tem só 8 pares, sem Creatina→Whey.

Método: `draftOrderCalculate` com `acceptAutomaticDiscounts: true`, 1 carrinho por par,
conferindo o preço unitário real contra o que o card promete (`price × 0,9`).

## Tabela par a par (estado atual)

| # | Trigger | Bump ofertado | Card promete | Desconto (ID) | Entregue qty 1 | qty ≥ 2 (escada no trigger) |
|---|---|---|---|---|---|---|
| 1 | Whey Choco | Creatina | R$ 115,47 | `[BUMP] Whey → Creatina` 1572745740520 | ❌ 128,30 | ❌ |
| 2 | Whey Sem Sabor | Creatina | R$ 115,47 | `[BUMP] Whey → Creatina` 1572745740520 | ❌ 128,30 | ❌ |
| 3 | Hair | Super Vit C | R$ 80,57 | `[BUMP] Hair → Vitamina C` 1572745773288 | ✅ 80,57 | ❌ 89,52 |
| 4 | Tri[Mg] | TetraVit D | R$ 105,41 | `[BUMP] Tri[Mg] → TetraVit D` 1572746133736 | ✅ 105,41 | ❌ 117,12 |
| 5 | TetraVit D | Super Ômega 3 | R$ 146,81 | `[BUMP] TetraVit D → Ômega 3` 1572746166504 | ✅ 146,81 | ❌ 163,12 |
| 6 | Super Vit C | TetraVit D | R$ 105,41 | `[BUMP] Vit C / Ômega → TetraVit D` 1573508743400 | ✅ 105,41 | ❌ 117,12 |
| 7 | Super Ômega 3 | TetraVit D | R$ 105,41 | `[BUMP] Vit C / Ômega → TetraVit D` 1573508743400 | ❌ 117,12 | ❌ |
| 8 | Sleep | Tri[Mg] | R$ 78,75 | `[BUMP] Sleep → Tri[Mg]` 1573508776168 | ✅ 78,75 | ❌ 87,50 |
| 9 | Creatina | Whey (Choco + Sem Sabor) | R$ 132,57 | `[BUMP] Creatina → Whey` 1574087000296 | ✅ 132,57 | ❌ 147,30 |

**Nenhum par órfão**: os 9 têm BxGy ATIVO, sem `endsAt`, 10% no produto ofertado,
`combinesWith {order, product, shipping} = true`. Os ❌ são conflito, não ausência.

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

## Defeito B — pares recíprocos (NÃO corrigido, decisão pendente)

Onde existem os dois sentidos (T→B e B→T), o Shopify aplica **um só**: o que desconta o
produto mais caro. Atinge os pares 1, 2 e 7.

- Whey ↔ Creatina: ganha `Creatina → Whey` (desconta 14,73 no Whey) sobre
  `Whey → Creatina` (12,83). Card 1/2 promete Creatina 115,47, entrega 128,30.
- Ômega ↔ TetraVit: ganha `TetraVit → Ômega` (16,31) sobre `Ômega → TetraVit` (11,71).
  Card 7 promete TetraVit 105,41, entrega 117,12.

Atenuante: nesses casos o cliente paga **menos** no total do que o card prometeu
(o desconto é maior, só cai na outra linha). É erro de exibição, não prejuízo.

Opções: (a) inverter a copy desses cards — "adicione X e ganhe 10% no seu Y",
mantendo a oferta e o valor; (b) remover os pares 1, 2 e 7 do card, perdendo o bump
em carrinhos de Whey e de Ômega.

## Teto de descontos automáticos

~25 ativos (16 `[ESCADA]`, 7 `[BUMP]`, 1 `[KIT]`, 1 app Upsell.com) + 1 `[CAMPANHA]`
SCHEDULED. No limite. Candidatos a liberar slot: `[ESCADA] Sleep Inositol — 5% (2un)`
(o 10% já expirou, escada pela metade) e `[KIT] Kit Whey/Crea/Taurato + Hair — 5% no Hair`.
