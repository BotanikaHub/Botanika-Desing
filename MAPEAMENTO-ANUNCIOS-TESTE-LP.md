# CAMPANHAS TESTE → LPs · MAPEAMENTO DE ANÚNCIOS (AGO26)
*Mesma estrutura 4 conjuntos, mas destino = LP (ofertas.botanikabrasil.com.br) em vez do site. UGC das pastas ugc_lissia + ugc_larissa. Gerado 05/08.*

## Regra: só faz campanha de produto que TEM anúncio. Sem anúncio = sem campanha.

| # | Produto | LP (destino) | UGC novos (pastas) | Campeão existente | Campanha teste? |
|---|---|---|---|---|---|
| 1 | Super Ômega 3 | /omega3 | LarissaOmega31, LarissaOmega3, (Omega3+Hair+VitC), Unboxing | OMEGA3_V02 | ✅ SIM |
| 2 | Tri[Mg] Complex | /trimagnesio | TriMgComplex, LissiaTriMgComplex2 | TRIMAGNESIO_V02 | ✅ SIM |
| 3 | Hair Botanika | /hair | LissiaHairBotanika, (Omega3+Hair+VitC) | HAIR_V03 | ✅ SIM |
| 5 | Super Vitamina C | /vitaminac | LarissaVitaminaC1, LarissaVitaminaC, (Omega3+Hair+VitC) | VITAMINAC_V02 | ✅ SIM |
| 6 | TetraVit D | /tetravit | LissiaTetraVitD, LissiaTetraVitD2 | TETRAVITD_V02 | ✅ SIM |
| 4 | Whey | /whey | — nenhum | — | ❌ NÃO (sem anúncio) |
| 7 | Sleep | /sleep | — nenhum | — | ❌ NÃO (sem anúncio) |
| 8 | Creatina | /creatina | — nenhum | — | ❌ NÃO (sem anúncio) |

**→ 5 campanhas teste:** Ômega 3 · Tri[Mg] · Hair · Vitamina C · TetraVit D.
**Arquivos "coringa":** "Omega 3, Hair, Vitamina C.mov" (combo) e "LarissaUnboxing.mov" (geral) — dá pra usar como anúncio extra em Ômega/Hair/VitC ou num conjunto de teste à parte.

## UTM (nos anúncios, campo url_tags)
```
utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&utm_id={{campaign.id}}
```
Link do anúncio = a LP do produto (coluna acima). Ex.: anúncio de Hair → `https://ofertas.botanikabrasil.com.br/hair` + as UTMs acima.

## ⚠️ 3 pontos técnicos pra alinhar antes de subir
1. **Campeão → LP:** os anúncios campeões hoje apontam pro **site**, não pra LP. Reusar o criativo puro manda pro destino antigo. Pra jogar o campeão na LP eu **crio um criativo novo** com o mesmo vídeo + link da LP + UTM. (Faço isso na hora de montar.)
2. **UGC novos:** quando você subir os vídeos no Meta, eu referencio cada um pelo nome, monto o anúncio com o link da LP + UTM. Se você já subir o anúncio pronto com a LP, melhor ainda — só confiro o link/UTM.
3. **Atribuição na LP:** essas LPs precisam **preservar a query string** até o checkout (a Frente 2 que está pendente). Se não preservarem, o pixel na LP dispara, mas a Utmify subconta a venda — a gente lê o resultado do teste pelo **Ads Manager**, não pela Utmify.

## Estrutura (igual às campanhas de agosto)
- 4 conjuntos: C1 Lista Human · C2 Eng Botanika · C3 Eng Dr William · C4 Aberto ADV.
- Mulheres 35–65+ BR · Feed/Stories/Reels FB+IG · exclui Compradores 14D.
- CBO, pausadas. (C3 Dr William segue dependendo do compartilhamento do público — mesmo caso das outras.)
- Nome sugerido: `TESTE | <PRODUTO> | LP | 4CONJ | AGO26`.

## ✅ EXECUTADO EM 05/08 (tudo PAUSADO) — 4 campanhas teste → LPs
Top 4 por vendas (com UGC). Whey/Sleep/Creatina fora (sem UGC), Vitamina C fora (5ª). R$100 CBO cada.
| Campanha | ID | LP | Vídeos usados (campeão + UGC) |
|---|---|---|---|
| TESTE \| HAIR \| LP \| AGO26 | 120251127930920563 | /hair | HAIR_V03 + LissiaHairBotanika |
| TESTE \| TRIMAGNESIO \| LP \| AGO26 | 120251127934030563 | /trimagnesio | tri_btnk_01 + TriMgComplex |
| TESTE \| TETRAVITD \| LP \| AGO26 | 120251127936840563 | /tetravit | TETRAVITD_V02 + LissiaTetraVitD |
| TESTE \| OMEGA3 \| LP \| AGO26 | 120251127938820563 | /omega3 | OMEGA3_V02 + LarissaOmega31 |

- **12 conjuntos** (C1 Human · C2 Eng Botanika · C4 Aberto ADV por campanha) + **24 anúncios** (2/conjunto: campeão + UGC).
- Todos: mulheres 35–65+ BR · Feed/Stories/Reels FB+IG · pixel **828186133708463** Purchase · exclui **Compradores 14D** · destino LP + UTM (`utm_source=facebook&utm_medium=paid&utm_campaign=teste_<produto>_lp&utm_content=campeao|ugc_*`).

**Ainda dá pra somar (ready, é só pedir):** UGC extras — Hair combo, Tri LissiaTriMgComplex2, TetraVitD LissiaTetraVitD2, Ômega LarissaOmega3 + combo + unboxing.
**Você adiciona no Ads Manager:** o 4º conjunto (Eng Dr William).
**Crítico antes de ativar:** confirmar que as LPs têm o pixel 828186133708463 e preservam a query string até o checkout.

---

## 🚀 ATIVADO EM 10/08 — 4 campanhas teste → LP no ar
Aval do operador ("pode ativar as 4, pixel com certeza esta la"). Ômega mantido (swap p/ Whey cancelado — sem ads exclusivos de Whey).

**Ligado (top-down):** 4 campanhas + 12 conjuntos (C1 Human · C2 Botanika · C4 Aberto ADV) + 24 anúncios (campeão + UGC). R$100/dia cada = **R$400/dia**.
- HAIR 120251127930920563 · TRI 120251127934030563 · TETRA 120251127936840563 · OMEGA3 120251127938820563
- Destinos: /hair · /trimagnesio · /tetravit · /omega3 · pixel 828186133708463 (Purchase) · exclui Compradores 14D.

**C3 (Dr William) segue PAUSADO** nas 4 (operador adiciona público real e publica manual):
- OMEGA3 C3 120251130057960563 · TETRA C3 120251130055680563 · TRI C3 120251130048140563 · HAIR C3 120251130033640563

**UTM:** anúncios com `utm_source=facebook` (rastreia como pago). Padronizar p/ `utm_source=FB` fica como follow-up opcional (mudança de UTM não zera aprendizado). Leitura do teste = **Ads Manager (pixel na LP)**; Utmify/Supabase leem limpo SE a LP preservar a query string até o checkout (Frente 2 — não verificável daqui, domínio bloqueado no proxy).

**Obs:** proxy do ambiente bloqueia `ofertas.botanikabrasil.com.br` — teste de passthrough até o checkout precisa ser feito manualmente pelo operador.
