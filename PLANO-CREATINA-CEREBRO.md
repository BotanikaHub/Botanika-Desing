# 🧠 CREATINA NO CÉREBRO — Mídia (Meta) · Live seg 24/08
*Montado 22/08. Conta CA 01 - Botanika (1164715034920965) · Pixel 828186133708463 PURCHASE · Page Botanika Brasil (1231632870022568). Destino: página da creatina `products/creatina-l-carnitina` (= Creatina Monohidratada + Mg Taurato, SKU 80.1.7 ✅ confirmado). Estoque 836 un.*

## Cronograma da oferta
- **Live:** IG Botanika, **seg 24/08 20h**. Boost do vídeo ao vivo (R$400, só segunda) — feito pela equipe/nativo ou enviando o link p/ eu subir.
- **12% OFF:** seg **21h** → ter **21h59**.
- **Gap:** ter 21h59 → qua (preço cheio) — conversão fica PAUSADA nesse intervalo.
- **10% OFF:** qua → sex **23h59**.

## Estrutura montada (tudo PAUSADO no nível campanha; conjuntos+anúncios já ATIVOS)
Criativos: 4 estáticos (`ad01–04`), versão 12% e versão 10% (a arte traz o número). Copy sem número. UTM `utm_source=FB&utm_medium=paid&utm_campaign=creatina_cerebro&utm_content=adNN_<12|10>off&utm_term={{placement}}&utm_id={{campaign.id}}`.

| Campanha | ID | Conjunto | Público | Verba | Stop auto |
|---|---|---|---|---|---|
| **B1 · CONV 12%** | 120251547887250563 | C1 Remarketing 30D (120251547888610563) | viu produto + carrinho + checkout 30d + compradores | CBO **R$400/dia** | ter 25/08 21:59 |
| | | C2 Frio LAL 1% (120251547889260563) | Lookalike 1% compradores (exclui compradores 14d) | | |
| **B2 · CONV 10%** | 120251547887480563 | C1 Remarketing 30D (120251547889780563) | idem acima | CBO **R$400/dia** | sex 28/08 23:59 |
| | | C2 Frio LAL 1% (120251547891190563) | idem frio | | |

- B1: anúncios `ad01–04` 12% em cada conjunto (8 ads). B2: `ad01–04` 10% (8 ads). Todos ACTIVE.
- **Campanha A (Live Boost):** `CREATINA CÉREBRO | LIVE BOOST | AGO26` — ID **120251594254580563** — OUTCOME_ENGAGEMENT / THRUPLAY, CBO **R$400/dia**, stop auto ter 02:00. Conjunto `LIVE | Quente + LAL 1%` (120251594256280563): LAL 1% compradores + viu produto/carrinho/compradores 30d. **PAUSADA, SEM anúncio** — a live NÃO tem link antes de acontecer. Fluxo: seg 20h operador avisa "estamos ao vivo" → eu busco o vídeo da live via API no IG @botanikabrasil (id 17841477932297256, vinculado à conta ✅) com ads_get_ig_media, crio o anúncio (object_story_id da mídia da live) no conjunto 120251594256280563 e ligo. Se a live em andamento demorar a ficar impulsionável, subir assim que a mídia aparecer. Obs: se quiserem garantir gastar os R$400 nas ~3-4h da live, trocar p/ orçamento vitalício R$400 no momento de ativar (senão o diário paça em 24h e gasta menos).

## 🔔 Ativação (corrigido)
> ⚠️ O agendamento nativo do Meta (start_time na campanha) NÃO segurou — resetou o start pra "agora" ao ativar. Por isso: B1 = sinal manual; B2 = despertador do agente.
1. **Seg 20h — "live no ar"** → equipe impulsiona o vídeo da live (R$400).
2. **Seg 21h — "12% no ar"** → operador me pinga, ativo a **B1** (120251547887250563). Para sozinha ter 21h59 (stop_time). Fica **PAUSADA** até o sinal.
3. **Ter 25/08 21h59** → B1 encerra sozinha. Gap ~2,5h (preço cheio, madrugada).
4. **Qua 26/08 00:30 — 10% entra no site (confirmado)** → **despertador automático do agente** (trigger `trig_017JAC9H6c85og6ogujKsvbT`) ativa a **B2** (120251547887480563). Para sozinha sex 23h59 (stop_time). Fica PAUSADA até 00:30.

**Pixel:** operador confirmou Purchase padrão do site ativo. ✅

## Acompanhamento diário (o que vou reportar)
- Gasto vs verba (R$400/dia), **CPA**, **ROAS Meta e ROAS real (Utmify)** por campanha/conjunto.
- Remarketing × Frio: realocar/escalar no que performar.
- Ação do **gap ter→qua**: confirmar B1 parou e B2 só sobe com o 10% no ar.
- Estoque creatina (836 un — folgado).

## Pendências / sinais que preciso de vocês
- **Hora exata** que o 12% entra (seg 21h confirmado) e que o 10% entra (qua — hora a confirmar).
- Link do vídeo da live às 20h (se quiserem que EU suba o boost via API).
- Confirmar Purchase disparando na página da creatina (pixel padrão do site).
