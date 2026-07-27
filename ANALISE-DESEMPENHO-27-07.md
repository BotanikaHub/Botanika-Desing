# ANÁLISE DE DESEMPENHO — BOTANIKA · 27/07/2026
*6 dias após a reorganização de 21/07. Fontes: Meta Ads MCP (pixel, 20–26/07) · Utmify (21–27/07) · Shopify real (20–27/07). Conta 1164715034920965 · Pixel 828186133708463.*

---

## 1. AS 3 CAMADAS DE VERDADE (a leitura mais importante)
| Camada | Vendas atribuídas ao Meta (7d) | Leitura |
|---|---|---|
| **Shopify real — referrer Instagram** | **214 pedidos** (187 + 27) · R$61,8k | a verdade da loja |
| **Meta pixel (Ads Manager)** | **223 vendas** | **bate com o real** ✔ |
| **Utmify** | **48 pedidos** · ROAS 2,87 | **ainda cego** ✗ |

> **Insight-chave:** o pixel da Meta (223) praticamente **empata com o real do Instagram (214)**. A Utmify (48) é a única das três que está errada. **Decisão operacional: confie no Ads Manager pra tomar decisão, não na Utmify — até a LP ser corrigida.**

---

## 2. DESEMPENHO POR CAMPANHA (Meta pixel, 20–26/07)
| Campanha | Dono | Status | Spend | Vendas | ROAS | CPA | Obs |
|---|---|---|---|---|---|---|---|
| **TRIMAGNESIO 2.0** | sua | ATIVA | R$715 | 51 | **24,6** | R$14 | ⭐ melhor da conta |
| **RETARGETING JUL 09/08** | sua (reativou) | ATIVA | R$1.043 | 49 | **13,6** | R$21 | quente, forte |
| **HAIR 2.0** | reativei p/ vc | ATIVA | R$1.040 | 48 | **13,3** | R$22 | **era 0,97 no relatório!** |
| **TETRAVITD 2.0** | sua | ATIVA | R$714 | 35 | **13,6** | R$20 | sólida |
| **PROSPECTING \| CBO** | **minha** | ATIVA | R$1.384 | 37 | **8,4** | R$37 | freq **5,2** ⚠️ fadiga |
| **REC \| AUDIENCIA** (topo) | minha (ajustei) | ATIVA | R$439 | — | — | — | CPM R$7,96 · 36,8k alcance · abastece o funil |
| **RETARGETING \| CBO** (nova) | minha | **PAUSADA** | R$207 | 3 | 4,7 | R$69 | pausei certo (mais fraca) |
| **LIVE 23-07** | — | PAUSADA | R$111 | — | — | — | **CTR 8,47%** (4–5× o normal) |

**Total Meta 7d: ~R$5,65k → 223 vendas no pixel.**

---

## 3. OS INSIGHTS NOVOS

1. **A reorg + desligar a CAPI dupla DESTRAVOU o ROAS real.** No relatório de 21/07 o HAIR aparecia com ROAS 0,97 e o TRIMAGNESIO 1,70. Hoje: HAIR **13,3** e TRIMAGNESIO **24,6**. Não foi mágica: antes o valor de compra ia como *comissão* (CAPI da Utmify), sujando o ROAS do pixel. Com a CAPI dupla desligada, o pixel voltou a receber o faturamento certo. **As campanhas sempre foram lucrativas — a gente é que estava cego.**

2. **Achamos a prova do vazamento de atribuição.** Na Utmify os `utm_term` chegam **truncados**: "In", "Ins", "Instag", "Instagram_S", "Instagram_St". A query string está sendo **cortada no meio** no redirect da LP Lovable → checkout. É exatamente a **Frente 2** pendente. Enquanto não corrigir, a Utmify continua enxergando ~1/4 das vendas.

3. **Suas campanhas antigas > minhas novas — e tudo bem.** As "2.0" por produto + o RETARGETING JUL 09/08 estão com ROAS 13–25. Você acertou em reativá-las. Minha PROSPECTING (8,4) é boa pra topo frio, mas é a de menor ROAS entre as ativas e a **frequência já está em 5,2** (fadiga de criativo chegando — precisa refresh).

4. **A loja real:** **331 pedidos / R$107k em 7 dias**, com R$5,9k de Meta. ROAS combinado (loja ÷ Meta) ~**18×**; só o Instagram ~**10×**. A operação está muito saudável — longe do "prejuízo 0,72" que o relatório cego mostrava.

5. **Google aparece de graça:** **42 pedidos** vieram de busca Google em 7d (R$12,4k) **sem gastar R$1 em Google Ads**. Chão fértil pra subir o Search (pendência antiga).

6. **Padrão de horário/dia:** o dinheiro é feito **8h–14h e 16h–22h**; sex/sáb são fracos (2 vendas/dia vs ~10 nos dias úteis). Dá pra concentrar verba.

7. **A LIVE teve CTR 8,47%** (4–5× o normal). O formato de live ad engaja muito — vale repetir na próxima.

---

## 4. AÇÕES RECOMENDADAS (aguardando seu OK)
1. **Corrigir a Frente 2 na LP Lovable** (agora tenho acesso via MCP) — destrava a atribuição de vez. **Prioridade máxima.**
2. **Escalar** TRIMAGNESIO 2.0 e RETARGETING JUL 09/08 (+20%) — melhor ROAS/CPA da conta.
3. **Refrescar criativo da PROSPECTING** (freq 5,2) ou ela cai.
4. **Manter** a RETARGETING CBO nova pausada (confirmado fraca).
5. **Subir o Google Search** (chão fértil, 42 pedidos orgânicos/semana).
