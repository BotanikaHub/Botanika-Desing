# 🛡️ SEMANA DA IMUNIDADE — Plano de Campanha (Meta Ads)
*Briefing fechado com o operador em 17/08/2026. Aguardando conector do Meta voltar pra executar via API. Conta: CA 01 - Botanika (1164715034920965) · Pixel 828186133708463 (Purchase).*

## Briefing (respostas do operador)
- **Criativos:** 5 vídeos NOVOS que o operador já subiu na conta → localizar via `ads_get_ad_videos` (os 5 mais recentes).
- **Destino:** página do **Kit Imunidade (10% OFF)** — confirmar handle exato via Shopify (`search_products` "Kit Imunidade"). Provável `/products/kit-imunidade` — VALIDAR antes de subir.
- **Orçamento:** **R$300/dia**.
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
- **Anúncios:** os **5 vídeos** em cada conjunto ativo. Cada vídeo precisa de thumbnail → pegar `picture` via `ads_get_ad_videos` e passar como `image_url` no video_data (evita erro 1443226). CTA "Comprar agora". Destino = página do Kit Imunidade.

## UTM (aplicar já o padrão limpo — Frente 1, por serem anúncios NOVOS)
```
utm_source=FB&utm_medium=paid&utm_campaign=semana_imunidade&utm_content={{ad.name}}&utm_term={{placement}}&utm_id={{campaign.id}}
```
(Padroniza `FB` fixo + `{{placement}}` resolve o truncamento — só é settável na criação do anúncio.)

## Checklist de execução (quando o Meta voltar)
1. [ ] `ads_get_ad_videos` → identificar os 5 vídeos novos (mais recentes) + pegar `picture` de cada.
2. [ ] Shopify `search_products` "Kit Imunidade" → confirmar URL/handle do destino.
3. [ ] Criar campanha CBO R$300/dia (Sales/Purchase), pausada.
4. [ ] Criar 4 conjuntos (C1/C2/C4 ativos, C3 pausado) com segmentação padrão.
5. [ ] Criar os anúncios (5 vídeos × 3 conjuntos ativos = 15 ads) com thumbnail + destino Kit + UTM padrão.
6. [ ] Ativar campanha + conjuntos C1/C2/C4. Confirmar ACTIVE (lembrar do bug status_forced_to_paused → reativar se cair).
7. [ ] Registrar IDs aqui.

## ⏳ Pendências paralelas (quando o Meta voltar, mesma sessão)
- ⤵️ **Reverter Retargeting** R$250 → R$150 (a escala não segurou: ROAS real 2,86 → 0,00 no pós-otimização).
- Decidir teste UGC (pausas de Hair C4 / Tetra C1 mataram os UGC desses; só sobrou o de Tri sem entrega).
