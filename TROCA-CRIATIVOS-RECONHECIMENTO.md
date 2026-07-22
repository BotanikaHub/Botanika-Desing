# TROCA DE CRIATIVOS — CAMPANHA DE RECONHECIMENTO (REC AUDIENCIA)
*Conta 1164715034920965 · Campanha `REC | AUDIENCIA | BOTANIKA | JUL26` = `120249808797950563`. Gerado 21/07/2026.*

## Por que é manual (não dá pelo MCP)
`ads_get_ig_accounts` retorna **vazio** → o app do Meta Ads MCP **não tem `instagram_basic`** na conta @botanika, então **não lê os posts/reels**. O IG está vinculado e veiculando normalmente; falta só o **scope de leitura** pro app. Enquanto isso, a criação sai do Ads Manager (seu login enxerga o IG).

## Estrutura atual da REC
**2 conjuntos (ambos ACTIVE):**
- `ABERTO | F35-60 | ALCANCE` → `120249808797920563`
- `ABERTO | F35-60 | ALCANCE — Cópia` → `120250139042420563`

## PASSO A PASSO — criar os anúncios novos (nos 2 conjuntos)
1. Ads Manager → abrir o conjunto → **Criar anúncio**.
2. Identidade: Página **Botanika Brasil (1231632870022568)** + IG **@botanika**.
3. **Usar publicação existente** → aba **Instagram** → escolher os **reels/posts novos**.
4. 1 post por anúncio · **3–4 anúncios por conjunto**.
5. Publicar. Repetir no outro conjunto (ou duplicar os anúncios pro conjunto "Cópia").

## ANÚNCIOS ANTIGOS A PAUSAR (após subir os novos)
| Ad ID | Nome | Status |
|---|---|---|
| 120250139042430563 | REC_MARCA_V04 | ACTIVE |
| 120249809318550563 | REC_MARCA_V04 | ACTIVE |
| 120250139042470563 | REC_MARCA_V05 | ACTIVE |
| 120249809318540563 | REC_MARCA_V05 | ACTIVE |
| 120249808797960563 | REC_MARCA_V01 | ACTIVE |
| 120250139042440563 | REC_MARCA_V01 | ACTIVE |
| 120249809318570563 | REC_MARCA_V02 | WITH_ISSUES |
| 120249809318560563 | REC_MARCA_V03 | WITH_ISSUES |

> ⚠️ **Não pausar os velhos antes de os novos estarem ativos** — senão a REC fica sem anúncio e para de entregar.
> Assim que os novos subirem, o gestor pode pausar esses 8 via MCP (`ads_update_entity status=PAUSED` → **reativar não precisa**, é só pausar) ou na mão.

## Como destravar o MCP pra IG (opcional)
Gerenciador de Negócios → **Contas do Instagram → @botanika → Atribuir apps/parceiros** → dar acesso ao **app do Meta Ads MCP** (ativo Instagram, não só a conta de anúncios). Se propagar, `ads_get_ig_accounts` para de vir vazio e a troca inteira passa a rodar por API.
