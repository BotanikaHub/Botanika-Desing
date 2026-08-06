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

## Status
⏸️ Aguardando você subir os UGC no Meta e avisar. Aí eu monto as 5 campanhas teste (pausadas) com UGC + campeão apontando pras LPs.
