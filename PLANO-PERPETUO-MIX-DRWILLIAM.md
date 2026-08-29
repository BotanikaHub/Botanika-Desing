# 🔁 PERPETUO | MIX DR WILLIAM | 4CONJ | AGO26 — spec de build (rascunho)

*Montado 29/08. Conta CA 01 - Botanika (1164715034920965). Objetivo: injetar 5 criativos novos do Dr William + campeões pra recuperar ROAS real ~2.5. Tudo PAUSADO (rascunho) — o operador adiciona os públicos do Dr William no C3 (e onde quiser) e ativa. Corte de verba pras winners aplica só na ativação.*

## Estado
- ✅ Campanha criada: **120251683607170563** — OUTCOME_SALES, CBO **R$150/dia** (15000), PAUSED.
- ⏳ Falta: 5 criativos → 4 conjuntos → anúncios (todos PAUSED). Bloqueio: conector Meta flapando.

## Constantes
- ad_account_id: `1164715034920965`
- page_id: `1231632870022568` · instagram_user_id: `17841477932297256`
- pixel/promoted_object: `{pixel_id:828186133708463, custom_event_type:PURCHASE}`
- Excluir Compradores 14D: `120249973420360563`
- Segmentação base (C1/C2/C3): mulheres (genders [2]), age_min 35, age_max 65, BR, `advantage_audience:0`, location_types ["home"]. C4 = broad `advantage_audience:1`.
- optimization_goal OFFSITE_CONVERSIONS, billing IMPRESSIONS, destino WEBSITE.

## Criativos novos (5) — pegar `picture` FRESCO via ads_get_ad_videos antes (thumbs expiram)
| Criativo | video_id | destino (link_url) | content UTM |
|---|---|---|---|
| DrWilliam Hair 01 | 1801964810815211 | products/hair-botanika | drwilliam_hair01 |
| DrWilliam Hair 02 | 1437057951553126 | products/hair-botanika | drwilliam_hair02 |
| DrWilliam Creatina 01 | 1926493204974968 | products/creatina-l-carnitina | drwilliam_creatina01 |
| DrWilliam Creatina 02 | 1090878063458014 | products/creatina-l-carnitina | drwilliam_creatina02 |
| DrWilliam Creatina 03 | 2243895159737474 | products/creatina-l-carnitina | drwilliam_creatina03 |

UTM (link_url): `https://botanikabrasil.com.br/products/<handle>?utm_source=FB&utm_medium=paid&utm_campaign=perpetuo_mix_drwilliam&utm_content=<content>&utm_term={{placement}}&utm_id={{campaign.id}}`
CTA SHOP_NOW. Copy: Hair = "Queda, quebra e unhas fracas? Hair Botanika age de dentro pra fora." / Creatina = "Depois dos 40, a creatina é aliada de energia, foco e força — com o Dr. William."

## Criativos campeões (reusar creative_id direto, link já embutido)
- Hair V03: `1006145852050402`
- ad_vnd_01: `1409411537666011`
- Trimag V01 (Acorda cansada): `2166029990921894`

## Conjuntos (4) — CBO, sem verba própria (herda da campanha)
| Conj | Nome | Públicos (custom_audiences) |
|---|---|---|
| C1 | C1 · LISTA HUMAN | `120248122023530563` (Lista Human) + `120248122077510563` (LAL 1%) |
| C2 | C2 · ENG BOTANIKA + SITE | `120249805134400563` (ENG IG 180D) + `120249973101430563` (Viu produto 30D) + `120249973132260563` (Carrinho 30D) + `120249973084330563` (Site todos 30D) |
| C3 | C3 · ENG DR WILLIAM (ADD PUBLICO) | **NENHUM** — operador arrasta o [TODOS] Envolvimento IG. Só segmentação base. |
| C4 | C4 · ABERTO ADV | broad, sem custom audience, advantage_audience 1 |

## Anúncios (8 por conjunto = 32): mesmos criativos em cada
5 criativos novos (acima) + 3 campeões (1006145852050402, 1409411537666011, 2166029990921894).
Anúncio de vídeo precisa de thumbnail (image_url = picture do vídeo) → evita erro 1443226. Todos PAUSED.

## Ordem de execução (idempotente)
1. Carregar tools Meta (ToolSearch). Se indisponível → aguardar próximo tick.
2. `ads_get_ad_entities` level=adset filtrando por campaign 120251683607170563 → ver o que já existe (nome). Só criar o que falta.
3. Criar 5 criativos (se ainda não existem — checar por nome "CRIATIVO | DrWilliam ...").
4. Criar 4 conjuntos (se faltam).
5. Criar os 8 anúncios em cada conjunto (se faltam).
6. Tudo PAUSED. Ao concluir: apagar o cron verificador e reportar os IDs ao operador.

## Ativação (operador) — NÃO fazer automático
- Operador adiciona [TODOS] Envolvimento IG no C3 (e onde quiser), ativa campanha + conjuntos.
- Na ativação, aplicar o corte pra R$700/dia perpetuo: Prospecting 190, Trimag 160, Hair 90, Tetra 70, Retarget 40, **nova 150**. (Hoje somam 760.)
- Pausar anúncio perdedor `ad_vnd_03` (120250204745720563, ROAS 0,77) no Retargeting.
