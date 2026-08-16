# 🏋️ SEMANA FITNESS — Mapa de Montagem Manual (Meta Ads)
*Plano B para subir manual no Gerenciador de Anúncios enquanto o conector do Meta está fora. Conta: CA 01 - Botanika (1164715034920965). Período: TER 11/08 → SÁB 15/08.*

---

## 1) CAMPANHA
- **Nome:** `SEMANA FITNESS | IMG | AGO26`
- **Objetivo:** Vendas (Sales)
- **Orçamento:** **no CONJUNTO (ABO)** — desligar "Orçamento da campanha (CBO)"
- **Sem teste A/B.**

## 2) CONJUNTOS (3) — orçamento vitalício, agendado 11–15/08
Configurações **iguais nos 3** (muda só o público e o valor):
- **Otimização:** Conversões · Evento **Compra (Purchase)** · Pixel **828186133708463**
- **Orçamento:** **vitalício (lifetime)**, início **11/08 00:00** / fim **15/08 23:59** (BRT)
- **Local:** Brasil · **Gênero:** Mulheres · **Idade:** 35–65+
- **Posicionamentos:** Manuais → **Feed + Stories + Reels** (Facebook e Instagram)
- **Excluir:** público **Compradores 14D** (`120249973420360563`)

| Conjunto | Público | Orçamento vitalício (5 dias) |
|---|---|---|
| **C1 — LAL Compradores** | Lookalike de compradores | **R$ 900** |
| **C2 — Retargeting Visitantes** | Visitantes site (home + PDP + checkout, últimos 14–30d) · excluir compradores | **R$ 600** |
| **C3 — Engajamento IG** | Engajamento no Instagram (últimos 365d) | **R$ 500** |
| | **TOTAL** | **R$ 2.000** |

## 3) ANÚNCIOS — as 4 imagens em CADA conjunto (12 anúncios no total)
Formato imagem única · 1:1 (2048×2048). Página: **Botanika**. Pixel ligado.

| Imagem | Anúncio | Destino (Website URL) | utm_content |
|---|---|---|---|
| **adsemana01** (Kit 10% OFF) | `SF \| Abertura Kit` | `botanikabrasil.com.br/products/kit-whey-balance-creatina-taurato` | `abertura_kit` |
| **adsemana02** (oferta geral / frete) | `SF \| Oferta Geral` | `botanikabrasil.com.br/collections/semana-fitness` | `abertura_oferta` |
| **adsemana03** (Leve 2 kits) | `SF \| Leve 2 Kits` | `botanikabrasil.com.br/products/kit-whey-balance-creatina-taurato` | `leve2_kits` |
| **adsemana04** (Combo Whey+Creatina) | `SF \| Combo` | `botanikabrasil.com.br/products/kit-whey-balance-creatina-taurato` | `combo` |

**Parâmetros de URL** (campo "Parâmetros de URL" de cada anúncio):
```
utm_source=meta&utm_medium=paid&utm_campaign=semana_fitness&utm_content=<abertura_kit|abertura_oferta|leve2_kits|combo>
```
**CTA sugerido:** "Comprar agora" (ou "Saiba mais").

## 4) CRONOGRAMA DOS CRIATIVOS
- **As 4 imagens** = todas de **abertura** → ativas desde **11/08** nos 3 conjuntos.
- **Urgência ("último dia") para 15/08:** ainda **não temos** peça de urgência. Duas opções:
  1. Mandar 1–2 imagens de "último dia" e eu/ você adiciona nos conjuntos no sábado; ou
  2. No sábado, deixar rodando só a **03 (Leve 2 kits)** como empurrão final.

## 5) ⚠️ PENDÊNCIAS / ALERTAS
- **Estoque baixo:** Kit e Whey com **47 unidades** cada. Se vender bem, esgota — repor ou vigiar pra não gastar mídia em produto esgotado. Creatina tem 909.
- **Confirmar:** frete grátis R$199 ativo + desconto **8% dos avulsos** aplicado no período. (Kit 10% já está no preço: R$275,60 → R$248,04.)
- **UTM `utm_source=meta`** (conforme brief). O resto da conta usa `FB` — se quiser padronizar depois, dá pra alinhar.
- **ROAS alvo 5.0 = real (Utmify)** — agressivo (breakeven ~2,06). Monitorar CTR/ROAS diário, pausar criativo/público fraco, realocar nos vencedores.
- **Só 1:1:** no Stories/Reels a imagem fica com borda. Pra otimizar, mandar versões 9:16 depois.

---
*Assim que o conector do Meta voltar, eu subo tudo isso automático via API — este mapa é só o plano B manual.*

---

## ✅ EXECUTADO VIA API (11/08) — CAMPANHA NO AR
Conexão do Meta voltou; subi tudo via API. Imagens hospedadas no repo público (`ads-semana-fitness/`) e referenciadas por URL raw — o Meta já baixou e hospedou cada criativo (não dependem mais do repo).

**Campanha:** `SEMANA FITNESS | IMG | AGO26` — ID 120251268421230563 — ACTIVE · Vendas/Purchase (pixel 828186133708463) · ABO · 11–15/08.

| Conjunto | ID | Público | Vitalício |
|---|---|---|---|
| SF \| C1 LAL Compradores | 120251268428140563 | LAL 1% compradores (Purchase) | R$900 |
| SF \| C2 Retargeting Visitantes | 120251268433260563 | SITE TODOS 30D + VIU PRODUTO 30D + CHECKOUT INITIATE 30D + CARRINHO 30D (exclui compradores 14D) | R$600 |
| SF \| C3 Engajamento IG | 120251268431050563 | ENG 90D IG Botanika (exclui compradores 14D) | R$500 |

Todos: mulheres 35–65+ BR · Feed/Stories/Reels FB+IG · advantage_audience:0 (segmentação fixa).

**12 anúncios** (4 imagens × 3 conjuntos), CTA Comprar agora, UTM `utm_source=meta&utm_medium=paid&utm_campaign=semana_fitness&utm_content=<abertura_kit|abertura_oferta|leve2_kits|combo>`:
- adsemana01/03/04 (Kit/combo/leve2) → página do Kit `kit-whey-balance-creatina-taurato`
- adsemana02 (oferta geral) → coleção `semana-fitness`

**Pendências:** estoque Kit/Whey 47 un. (vigiar) · sem peça de urgência p/ sábado · imagens só 1:1 (Stories com borda) · ROAS alvo 5.0 real é agressivo (monitorar e realocar).

---

## 🎯 OTIMIZAÇÃO EXECUTADA (12/08) — LP × Site + eficiência
Veredito do teste LP: **site vence de lavada** (Tetra site 8,6x vs LP 2,7x; Hair/Tri LP fizeram 0 venda). Ações aprovadas e aplicadas:
- ⏸️ **4 campanhas de LP pausadas** (Hair/Tri/TetraVitD/Omega3) — libera R$400/dia do pior ROAS.
- ⏸️ **Semana Fitness pausada** (falta de Whey).
- ⬆️ **TetraVitD 4CONJ** R$100 → **R$200/dia** (melhor ROAS de produto, 8,6x).
- ⬆️ **Tri 4CONJ** R$100 → **R$150/dia** (recuperou, 3 conjuntos positivos).
- ⏸️ **Hair C1 Lista Human** (conjunto) pausado — 0 venda.
- ✅ Perenes mantidas: Prospecting R$600 (9,9x) · Retargeting R$120 (13,5x).

---

## 🔬 ESCALA POR DADO REAL + TESTE UGC→SITE (13/08)
Cruzamento 4 fontes. **ROAS Meta é inflado ~3x** — Utmify (real) mostrou o verdadeiro:
Prospecting 2,95x ✅ · Retargeting 2,44x ✅ · Hair 1,73x ⚠️ · Tri 1,71x (3d 2,70↑) ⚠️ · TetraVitD 0,74x 🔴 (breakeven ~2,06). Blended real 1,88x. ~75% dos pedidos sem atribuição Meta + 30% sem UTM (ponto cego).

**Escala eficiente aplicada:**
- ⬆️ Prospecting R$600 → R$800 · ⬆️ Retargeting R$120 → R$150 (os únicos acima do breakeven real)
- 🔻 TetraVitD R$200 → R$100 (no vermelho real) · ✋ Hair R$130 e Tri R$150 mantidos

**Teste UGC→site (2º anúncio nos conjuntos vencedores, mesmo destino site + UTM, sem budget extra):**
- HAIR C4 → UGC LissiaHairBotanika (ad 120251343778960563) → /products/hair-botanika
- TRI C2 → UGC TriMgComplex (ad 120251343782130563) → /products/tri-mg-complex
- TETRA C1 → UGC LissiaTetraVitD (ad 120251343785080563) → /products/tetravit-d
UTM utm_content=UGC_<produto> pra comparar UGC × campeão. Ativos.

**Pendências:** corrigir rastreio de UTM (30% sem tag + truncamento) = alavanca nº1. Omega sem campanha de site (UGC LarissaOmega31 fora por ora).

---

## ⚙️ OTIMIZAÇÃO POR DADO REAL (16/08) — cruzamento 5 fontes
Relatório 13–16/08 cruzando Shopify (R$31,6k vendas / 103 ped), Utmify (ROAS real paga **0,84** vs Meta 5,53 inflado ~4x), Meta, Supabase (⚠️ pipeline parado desde 08/08) e ActiveCampaign (sem envio desde 08/08; abertura <5%; carrinhos por produto inativos). Só o Retargeting acima do breakeven real (2,86). Ações aplicadas via API:

- 🔻 **Prospecting CBO** R$800 → **R$500/dia** (maior sangria: real 0,57, −R$990 no período) + ⏸️ **pausado o anúncio `AD | TETRAVITD_V02 (campeão)`** (120250691245230563) no conj. PROSP ADV+ BROAD (R$1.233 gastos, pior eficiência).
- ⬆️ **Retargeting** R$150 → **R$250/dia** (único acima do breakeven real, 2,86) + ⏸️ conj. **ENG DR WILLIAM F35-60** (120250204745680563) pausado (0 venda).
- ⏸️ **TetraVitD**: conj. **C1 / C2 / C4** pausados (R$258 sem venda) — concentra R$100 no **C3 Eng Dr William** (único que converte).
- ⏸️ **Hair**: conj. **C4 Aberto ADV** (120251154356280563) pausado (0 venda) — concentra R$130 em **C2 + C3**.
- ✋ **Tri** R$150 mantido (real 1,15, no limiar — observar).

Orçamento diário: **R$1.330 → R$1.130** (−R$200/dia, realocado pro que dá retorno real). Obs.: cada edição força PAUSE nessa conta → Prospecting e Retargeting reativados via ads_activate_entity, confirmados ACTIVE.

**Alavancas fora da mídia (p/ dev/time):** publicar tema-cópia (correção UTM) · religar pipeline Supabase · reativar carrinho abandonado + entregabilidade no ActiveCampaign.
