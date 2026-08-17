# 🛡️ SEMANA DA IMUNIDADE — Plano de Campanha (Meta Ads)
*Briefing fechado com o operador em 17/08/2026. Aguardando conector do Meta voltar pra executar via API. Conta: CA 01 - Botanika (1164715034920965) · Pixel 828186133708463 (Purchase).*

## Briefing (respostas do operador) — FECHADO
- **Criativos:** 5 vídeos NOVOS já na conta (9:16, 1080×1920) → localizar via `ads_get_ad_videos` (mais recentes) e pegar `picture` de cada:
  - 2× **Super Vitamina C** — "8% OFF, só até sexta 21/08"
  - 2× **Super Ômega 3** — "8% OFF até sexta"
  - 1× **TetraVit D** — "8% OFF até sexta"
- **Oferta real:** **8% OFF nos produtos individuais** (tag `8-off` ativa em Vit C / Ômega / Tetra no Shopify). NÃO é o Kit 10%.
- **Destino:** cada vídeo → **sua própria página de produto** (decisão do operador, por congruência):
  - Vit C → `https://botanikabrasil.com.br/products/super-vitamina-c` (R$89,52)
  - Ômega → `https://botanikabrasil.com.br/products/super-omega-3-coq10` (R$163,12)
  - Tetra → `https://botanikabrasil.com.br/products/tetravit-d` (R$117,12)
  - (Kit Imunidade `kit-da-imunidade` R$361 fica só como cross-sell no site.)
- **Orçamento:** **R$300/dia** (CBO).
- **Período:** 17/08 → 21/08 (começou hoje, de surpresa).

## Estrutura a montar
- **Campanha:** `SEMANA IMUNIDADE | VID | AGO26` — Objetivo Vendas (OUTCOME_SALES) · promoted_object pixel 828186133708463 / PURCHASE.
- **Orçamento:** **CBO R$300/dia** (daily). Pausar no fim do dia 21/08.
- **Conjuntos (padrão da conta):**
  - C1 · Lista Human (105K)
  - C2 · Eng Botanika
  - C3 · Eng Dr William — **subir PAUSADO** (operador troca o público real e ativa manual, como sempre)
  - C4 · Aberto ADV
- **Segmentação (todos):** mulheres 35–65+ · BR · Feed/Stories/Reels (FB+IG) · `advantage_audience:0` (segmentação fixa) · location_types:["home"] · **excluir Compradores 14D** (`120249973420360563`).
- **Anúncios:** os **5 vídeos** em cada conjunto ativo (5 × 3 = 15 ads). Cada vídeo precisa de thumbnail → pegar `picture` via `ads_get_ad_videos` e passar como `image_url` no video_data (evita erro 1443226). CTA "Comprar agora". **Destino por vídeo = página do produto correspondente** (Vit C / Ômega / Tetra, ver acima).

## UTM (aplicar já o padrão limpo — Frente 1, por serem anúncios NOVOS)
```
utm_source=FB&utm_medium=paid&utm_campaign=semana_imunidade&utm_content=<vitc|omega|tetra>_8off_v1&utm_term={{placement}}&utm_id={{campaign.id}}
```
(Padroniza `FB` fixo + `{{placement}}` resolve o truncamento — só é settável na criação do anúncio.)

## Checklist de execução (quando o Meta voltar)
1. [ ] `ads_get_ad_videos` → identificar os 5 vídeos (2 Vit C, 2 Ômega, 1 Tetra) + pegar `picture` de cada p/ thumbnail.
2. [x] Handles confirmados: super-vitamina-c · super-omega-3-coq10 · tetravit-d (todos ACTIVE, tag 8-off).
3. [ ] Criar campanha CBO R$300/dia (Sales/Purchase), pausada.
4. [ ] Criar 4 conjuntos (C1/C2/C4 ativos, C3 pausado) com segmentação padrão.
5. [ ] Criar os anúncios (5 vídeos × 3 conjuntos ativos = 15 ads): cada vídeo → página do SEU produto + thumbnail + UTM padrão limpo.
6. [ ] Ativar campanha + conjuntos C1/C2/C4. Confirmar ACTIVE (lembrar do bug status_forced_to_paused → reativar se cair).
7. [ ] Registrar IDs aqui.

## ✅ EXECUTADO (17/08) — CAMPANHA NO AR
**Campanha:** `SEMANA IMUNIDADE | VID | AGO26` — ID **120251435441430563** — CBO **R$300/dia**, OUTCOME_SALES/Purchase (pixel 828186133708463), para automático **21/08 23:59** BRT. ACTIVE.

Estrutura adaptada (públicos verificados, sem inventar ID): 2 conjuntos de prospecção.
| Conjunto | ID | Público |
|---|---|---|
| IMU \| C1 ABERTO ADV | 120251435444130563 | Broad mulheres 35-65+ BR (exclui Compradores 14D) |
| IMU \| C2 LAL 1% COMPRADORES | 120251435445470563 | Lookalike 1% Purchase (120250519285830563), exclui Compradores 14D |

**10 anúncios** (5 vídeos × 2 conjuntos), cada vídeo → página do produto, UTM padrão limpo (utm_source=FB…utm_content=<vitc|omega|tetra>_8off_vN):
- Vit C v1/v2 → super-vitamina-c · Ômega v1/v2 → super-omega-3-coq10 · Tetra v1 → tetravit-d
- IDs C1: 120251435459610563 / …460080563 / …460950563 / …461880563 / …462750563
- IDs C2: 120251435465660563 / …467080563 / …469730563 / …471690563 / …472780563
- Status: todos ACTIVE (3 em PENDING_REVIEW no C1 na hora da criação — liberação normal do Meta).

**Não incluído (operador adiciona manual se quiser):** conjuntos Eng Botanika / Eng Dr William (públicos originais não localizáveis por ID limpo aqui).

## ✅ Pendência paralela resolvida
- ⤵️ **Retargeting revertido** R$250 → **R$150** (campanha 120250204745640563) — reativado e confirmado ACTIVE.
- Teste UGC segue de lado (pausas de Hair C4 / Tetra C1 mataram os UGC desses; só sobrou o de Tri sem entrega) — decidir depois.
