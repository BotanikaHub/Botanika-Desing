# Auditoria — Order Bump do carrinho (`snippets/botanika-order-bump.liquid`)

Data: 2026-08-24 · Tema auditado: **"Creatina - Tema Padrão"** (`gid://shopify/OnlineStoreTheme/158758928616`, 9 pares)
Comparação: **"Tema Padrão"** (MAIN, `158480433384`) tem só 8 pares — não inclui Creatina→Whey.

Método: `draftOrderCalculate` com `acceptAutomaticDiscounts: true`, 1 carrinho por par,
conferindo o preço unitário real contra o preço que o card promete (`price × 0,9`).

## Tabela par a par

| # | Trigger (produto no carrinho) | Bump ofertado | Card promete | Desconto que sustenta | ID do desconto | Trigger qty 1 | Trigger qty ≥ 2 |
|---|---|---|---|---|---|---|---|
| 1 | Whey Balance Chocolate | Creatina | R$ 115,47 | `[BUMP] Whey → Creatina 10%` | 1572745740520 | ✅ 115,47 | ❌ 128,30 |
| 2 | Whey Balance Sem Sabor | Creatina | R$ 115,47 | `[BUMP] Whey → Creatina 10%` | 1572745740520 | ✅ 115,47 | ❌ 128,30 |
| 3 | Hair Botanika | Super Vitamina C | R$ 80,57 | `[BUMP] Hair → Vitamina C 10%` | 1572745773288 | ✅ 80,57 | ❌ 89,52 |
| 4 | Tri[Mg] Complex | TetraVit D | R$ 105,41 | `[BUMP] Tri[Mg] → TetraVit D 10%` | 1572746133736 | ✅ 105,41 | ❌ 117,12 |
| 5 | TetraVit D | Super Ômega 3 | R$ 146,81 | `[BUMP] TetraVit D → Ômega 3 10%` | 1572746166504 | ✅ 146,81 | ❌ 163,12 |
| 6 | Super Vitamina C | TetraVit D | R$ 105,41 | `[BUMP] Vit C / Ômega → TetraVit D 10%` | 1573508743400 | ✅ 105,41 | ❌ 117,12 |
| 7 | Super Ômega 3 | TetraVit D | R$ 105,41 | `[BUMP] Vit C / Ômega → TetraVit D 10%` | 1573508743400 | ✅ 105,41 | ❌ 117,12 |
| 8 | Sleep Inositol | Tri[Mg] Complex | R$ 78,75 | `[BUMP] Sleep → Tri[Mg] 10%` | 1573508776168 | ✅ 78,75 | ❌ 87,50 |
| 9 | Creatina | Whey Balance (Choco + Sem Sabor) | R$ 132,57 | `[BUMP] Creatina → Whey 10%` | 1574087000296 | ✅ 132,57 | ❌ 147,30 |

**Nenhum par órfão**: todos os 9 têm desconto automático ATIVO, sem `endsAt`,
10% no produto ofertado, `combinesWith {order, product, shipping} = true`.

## FIX aplicado

`[BUMP] Creatina → Whey 10%` (1574087000296) cobria só o **Whey Chocolate**.
Um cliente que trocasse pro **Sem Sabor** pagava R$ 147,30 cheio.
→ `productsToAdd: gid://shopify/Product/9600936902888` (Whey Sem Sabor).
Verificado: Creatina 1× + Whey Sem Sabor 1× = **R$ 132,57**. ✅

Foi um *update*, não um desconto novo — não consumiu slot do teto de 25.

## Bug remanescente: escada no trigger anula o bump

O `[BUMP]` é um BxGy cujo "customer buys" é o produto trigger. Quando esse
**mesmo produto** já recebe um `[ESCADA]` (product discount na própria linha),
o Shopify descarta o BxGy inteiro — o bump não é aplicado em lugar nenhum.

Reproduzido exatamente como no print do dono: 4× Creatina + 1× Whey Choco →
subtotal R$ 609,18, Creatina a R$ 115,47 (escada 10%), **Whey a R$ 147,30 cheio**.

Vale pros 9 pares, porque todo trigger tem escada ativa:

- trigger qty **1** → sem escada → bump aplica → card honesto ✅
- trigger qty **≥ 2** → escada dispara → bump sumiu → **card mente** ❌

Escada em produto **diferente** do trigger não atrapalha
(Creatina 1× + Whey 1× + TetraVit 3× → Whey sai R$ 132,57 normal).

### Opções (decisão do dono)

1. **Pausar as escadas dos produtos trigger** — bump passa a valer sempre,
   mas muda a economia de multi-unidade da loja toda.
2. **Só mostrar o card quando o trigger tiver qty 1** — mexe no Liquid
   (`ob_item.quantity == 1` no loop de detecção), não mexe em preço.
   Card fica 100% honesto, mas perde alcance.

Nada disso foi aplicado — as duas opções mudam campanha/preço.

## Teto de descontos automáticos

~25 automáticos ativos (16 `[ESCADA]`, 7 `[BUMP]`, 1 `[KIT]`, 1 app Upsell.com)
+ 1 `[CAMPANHA] Creatina no cérebro — 10%` SCHEDULED. Está no limite.
Candidatos a liberar slot: `[ESCADA] Sleep Inositol — 5% (2un)` (o 10% já expirou,
escada quebrada pela metade) e o `[KIT] Kit Whey/Crea/Taurato + Hair — 5% no Hair`.
