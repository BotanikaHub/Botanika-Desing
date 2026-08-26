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

---

# PDP/Home da Creatina — precos conflitantes (25/08/2026)

Tema editado: **"Copy of Creatina - Tema Padrao"** (`OnlineStoreTheme/158774591720`).
Observado: PDP anunciava R$ 112,90 (-12%) no banner roxo E R$ 118,04 (8% "Semana Fitness")
no card 1 KIT; a home mostrava ribbon "-12% HOJE" com o preco real R$ 128,30 ao lado.

## Causa 1 — fase de campanha fantasma (corrigido)

`snippets/botanika-campaign-css.liquid` decidia a fase no cliente:

    if (n <= P1E) return P(12);          // sem limite inferior
    if (n >= P2S && n <= P2E) return P(10);

Sem checar `P1S`, a fase de 12% valia para qualquer instante anterior a 26/08 02:59Z.
O desconto que a sustentava — `[CAMPANHA] Creatina no cerebro — 12% (relampago)` —
esta EXPIRED com `startsAt == endsAt == 2026-08-24T15:08:43Z`, ou seja, nunca valeu.

Fase 1 removida. Ficou so a fase 2, cuja janela casa exatamente com
`[CAMPANHA] Creatina no cerebro — 10%`: 26/08 11:00Z ate 29/08 02:59:59Z.

## Causa 2 — bonus fixo de 8% "Semana Fitness" (corrigido)

`blocks/_product-quantity-cards.liquid` somava 8% a TODOS os tiers sempre que o
produto estivesse em `settings.camp_handles`:

    {%- if sf_camp == 'yes' -%}{%- assign sf_bonus = 8 -%}{%- endif -%}
    {%- assign t1_eff = bs.tier1_discount | plus: sf_bonus -%}

Dai o "8% OFF / 🔥 Semana Fitness — 8%" no 1 KIT e o "13% / 5% + 8%" no 2 KITS.
A campanha Semana Fitness encerrou em 11/08/2026. Bonus e subtitulos removidos:
os tiers passam a usar so as settings do bloco (0 / 5 / 10).

Risco que isso evitava: a partir de 26/08 a campanha de 10% entra e, com o bonus
ativo, os cards voltariam a anunciar 8/13/18% — todos falsos de novo.

## Pendente — dois textos no editor do tema

Nao sobrescrevi `config/settings_data.json`: o Shopify o armazena minificado e
devolve formatado na API, entao nao da para validar por md5 (minificado = 10416 B
contra 10445 B reais). Reescrever a partir de uma reconstrucao nao verificavel
arrisca apagar alguma setting em silencio.

Trocar no editor → Configuracoes do tema:

- **Campanha — destaque de produtos → Texto do selo**
  `🧠 −12% HOJE` → `🧠 Creatina no cerebro` (sem percentual: o selo nao tem
  janela de data, entao qualquer % nele fica falso fora da campanha)
- **Contagem regressiva → Mensagem**
  `⏳ Semana Fitness termina em` → `⏳ A oferta termina em`

Tambem restam dois textos "Semana Fitness" em `templates/product.json`, ambos em
blocos com `show: false` (`_product-campaign-selo` e `_product-countdown-bar`) —
invisiveis hoje, mas vale limpar antes que alguem os ligue.

---

# Causa 3 — o 10% vazou para TODAS as PDPs (26/08/2026)

**Erro meu.** Para colocar a Creatina em 10% nos cards de kit eu editei
`tier1_discount` / `tier2_discount` / `tier3_discount` em
`templates/product.json`. Esse arquivo e o **template padrao de produto:
vale para todo produto que nao tem `templateSuffix`** — ou seja, a loja
inteira. Resultado: toda PDP passou a anunciar 10% OFF.

Exemplo pego pelo dono, Hair Botanika (variant `48650670670056`):

| Card | O tema anunciava | Preco real no checkout | Veredito |
|---|---|---|---|
| 1 KIT | 10% OFF · R$ 89,46 | **R$ 99,40** (sem desconto) | mentira |
| 2 KITS | 10% | R$ 94,43/un (5%) | mentira |
| 3 KITS | 10% | R$ 89,46/un (10%) | ok por acaso |

## Correcao

1. `templates/product.json` voltou **byte a byte** ao original
   (32088 bytes, md5 `781a26091ab1db31069a40e44855ff5a`), escada `0/5/10`.
2. Criado `templates/product.creatina.json` (32090 bytes, md5
   `f030fceb336523f34766652a38e3c818`) — identico ao padrao, so com os tres
   tiers em `10/10/10`.
3. Produto Creatina (`gid://shopify/Product/9347155067112`) recebeu
   `templateSuffix: "creatina"`.

Os dois arquivos estao espelhados em `tema-shopify/templates/`.

## Por que 10/10/10 na Creatina

O desconto da campanha e 10% liso, nao escada. Conferido no
`draftOrderCalculate` com `acceptAutomaticDiscounts: true`
(variant `48115368820968`, preco cheio R$ 128,30):

| Qtd | Preco/un no checkout | % |
|---|---|---|
| 1 | R$ 115,47 | 10% |
| 2 | R$ 115,47 | 10% |
| 3 | R$ 115,47 | 10% |

Hair conferido no mesmo oraculo depois do revert: R$ 99,40 / R$ 94,43 /
R$ 89,46 — bate exatamente com a escada `0/5/10` restaurada.

## Atencao — o tema ATIVO ainda esta errado

O tema publicado (`Creatina 10% - Tema Padrao`, id `158803165416`) ainda
tem o `templates/product.json` com `10/10/10` (md5 `f030fceb...`). A API
bloqueia escrita em tema publicado, entao **a correcao so entra quando a
copia corrigida for publicada**. Ate la, toda PDP que nao seja a da
Creatina continua anunciando 10% que nao existe.

Com o `templateSuffix` ja setado, a Creatina fica certa nos dois cenarios:
no tema ativo cai no `product.json` (que hoje esta 10/10/10) e no tema
novo usa o `product.creatina.json`.

## Pendente

- **Depois de sexta (28/08):** quando o desconto de 10% da Creatina
  acabar, `templates/product.creatina.json` precisa voltar para `0/5/10`
  (ou tirar o `templateSuffix` do produto). Os cards de kit nao tem trava
  de data — so o overlay roxo tem.
- `templates/product.kit.json` (usado pelo produto `kit-whey-balance-creatina-taurato`,
  hoje em DRAFT) nao foi auditado.
