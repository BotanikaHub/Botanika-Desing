# RELATÓRIO DE TRÁFEGO — BOTANIKA (PARCIAL)
*Período coberto: dados coletados nesta operação (07/07 → 21/07/2026) + estado de tracking.*
*Gerado: 21/07/2026. Conta Meta: CA 01 - Botanika JUN/26 · 1164715034920965 · Pixel 828186133708463.*

> ⚠️ **Este relatório é PARCIAL.** Foi montado com os dados puxados via MCP (Meta Ads + Utmify) **antes** dos conectores caírem. Falta o **período completo de junho** campanha a campanha e o **Google Ads** — isso exige reconectar Meta Ads MCP + Utmify (fazer num chat novo com os conectores ligados). Ver "O que falta" no fim.

---

## 1. ESTADO DO TRACKING (o mais crítico pra assumir)

**Qualidade do pixel (Purchase) — EMQ 9,2 (excelente):**
- email 95,4% · telefone 100% · external_id 100% · nome/endereço ~100% · **fbc 66,2%**.
- Ou seja: o *matching* de Purchase está forte; o `fbc` sujo é quase cosmético.

**Problema estrutural encontrado — CAPI DUPLA:**
- A **Utmify** (`Botanika Meta Pixel 2.0`) rodava uma 2ª CAPI (S2S) pro **mesmo pixel** `828186133708463` do app oficial do Shopify.
- Consequências: (1) **duplicação de Purchase** (server vive acima do browser em 28 dias); (2) **`value = commission`** → valor de compra enviado como comissão, não faturamento (estraga otimização por valor/ROAS); (3) **`fbc` modificado** em 14% dos Purchase (alerta Meta de 12/07 — 15 conjuntos, R$1.713).
- ✅ **Ação tomada (21/07):** operador **desativou** o pixel `Botanika Meta Pixel 2.0` na Utmify → app do Shopify vira fonte única. **Pendente de verificação** (checar em 24–48h se o SERVER converge pro BROWSER e o alerta some).

**Buraco de atribuição (crônico — investigar):**
- Dia D 07/07: pixel atribuiu **31** vendas ao FB × Utmify amarrou **3** × **39 untracked**.
- Semana 14–21/07: pixel **146** × Utmify **25** × **137 untracked**.
- Causa provável: redirect das LPs Lovable → checkout **não preserva a query string** (perde `fbclid` e `utm_*`). CTAs do tema são texto livre, não anexam UTM.

---

## 2. DIA D (07/07) — conta 1164715034920965

| Métrica | Valor |
|---|---|
| Investimento (spend) | **R$395,63** |
| Faturamento atribuído | R$274,63 |
| ROAS (Utmify) | 0,69 |
| Impressões | 26.827 |
| Cliques no link | 1.092 · **CTR 4,07%** |
| CPM | R$14,75 · Custo/clique R$0,36 |
| Visitas à LP | 203 |
| InitiateCheckout | 72 · Custo/IC R$5,49 |
| Pedidos (Utmify→Meta) | 3 (2 aprovados, 1 pendente) · 31 no pixel · 39 untracked |
| Produtos vendidos | Tri[Mg] Complex · Hair Botanika · TetraVit D |

> 🚩 **Alerta forte:** o spend do Dia D nessa conta foi **R$395**, muito abaixo dos **R$3.000** planejados como verba dedicada. Ou a campanha Dia D não entregou/gastou, ou o spend está em outra conta/estrutura. **Verificar no acesso ao vivo** — é a primeira coisa a checar.

---

## 3. SEMANA 14–21/07 — nível anúncio (52 anúncios ativos)

| Métrica (7 dias) | Valor |
|---|---|
| Vendas atribuídas ao FB pelo pixel | **146** |
| Pedidos amarrados pela Utmify | 25 |
| Pedidos untracked | 137 |
| Faturamento atribuído | R$5.566,84 |
| Investimento | R$4.106,66 |

**Top anúncios por vendas (pixel):**
| Anúncio | Vendas (pixel) | Pedidos (Utmify) | Spend |
|---|---|---|---|
| HAIR_V03 | 25 | 5 | R$708,69 |
| ad_vnd_02 | 14 | 5 | R$579,40 |
| TRIMAGNESIO_V02 | 14 | 2 | R$314,67 |
| TETRAVITD_V02 | 14 | 1 | R$360,38 |
| TRIMAGNESIO_V02 (var.) | 12 | 2 | R$143,69 |

> Observação: a diferença gigante entre "vendas no pixel" (146) e "pedidos Utmify" (25) é o mesmo buraco de atribuição da seção 1 — não confie no ROAS por campanha da Utmify até corrigir os UTMs.

---

## 4. TENDÊNCIA DE DUPLICAÇÃO (Purchase por fonte, 28 dias)
- Em praticamente toda hora do período, **SERVER ≥ BROWSER** (server ~1,3–1,5× o browser).
- Padrão estrutural e contínuo = assinatura da 2ª CAPI da Utmify.
- Ressalva honesta: bloqueio de browser também infla o server, então isso **confirma a fonte dupla contínua**, mas a contagem exata de duplicados só sai na aba **Deduplicação** do Events Manager (ou observando o SERVER cair após a desativação de 21/07).

---

## 5. DIAGNÓSTICO PRA ASSUMIR — o que está bom / quebrado

**Bom:**
- Pixel + CAPI do app Shopify com **EMQ 9,2** (sinal de Purchase forte).
- Criativos de Hair e Tri[Mg] puxando vendas no pixel.
- CTR do Dia D saudável (4,07%).

**Quebrado / risco:**
1. **Atribuição cega** (137 untracked/semana) → ROAS por campanha não confiável. *Corrigir UTMs + passthrough da query string nas LPs.*
2. **CAPI dupla** (mitigada em 21/07, verificar efeito).
3. **Spend do Dia D muito abaixo do planejado** (R$395 vs R$3.000) → confirmar entrega real das verbas dedicadas.
4. **Valor como comissão** na Utmify (resolvido junto da desativação, confirmar).

**5 primeiras ações recomendadas:**
1. Verificar (24–48h) se a desativação da CAPI da Utmify zerou a duplicação e o alerta de `fbc`.
2. Corrigir atribuição: `utm_*` nos anúncios + repasse íntegro da query string LP→checkout.
3. Auditar por que o spend real ficou abaixo do planejado (verbas Dia D / funil direto).
4. Subir a **Campanha Search** (pendência antiga, Maximizar Cliques).
5. Reconstruir o RMKT no Google + Merchant Center (Shopping).

---

## 6. O QUE FALTA (precisa de acesso ao vivo — chat novo com conectores ligados)
- Performance **campanha/conjunto/anúncio de 01/06 a 30/06** (spend, ROAS, CPA por campanha).
- **Linha do tempo** de mudanças na conta (log de atividades da Meta).
- **Google Ads** (via Utmify `get_google_ad_objects`) — o que existe/rodou.
- Confirmação do efeito da desativação da CAPI Utmify.
