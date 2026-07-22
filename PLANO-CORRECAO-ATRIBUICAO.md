# PLANO DE CORREÇÃO DA ATRIBUIÇÃO — BOTANIKA
*Conta Meta 1164715034920965 · Pixel 828186133708463 · Utmify dashboard 6a2839a9a025e4a9b9db300e. Gerado 21/07/2026.*

## O PROBLEMA (recap com números)
- **580 pedidos untracked** no período (01/06–21/07). Na semana 14–21/07: pixel atribuiu **146** vendas ao FB × Utmify amarrou só **25** × **137 untracked**.
- **Causa-raiz:** a query string se perde no caminho **anúncio → LP Lovable → checkout Shopify**. Isso quebra os DOIS identificadores de uma vez:
  - `fbclid` chega modificado → alerta de `fbc` no Meta.
  - `utm_*` some → Utmify não consegue atribuir → "untracked".
- Efeito: **ROAS por campanha cego.** A operação real é melhor do que o ROAS mostra, mas ninguém enxerga.

---

## FIX EM 3 FRENTES

### 🎯 Frente 1 — UTM padrão em todos os anúncios Meta *(gestor de tráfego)*
No Ads Manager → campo **"Parâmetros de URL"** (nível conta, ou por anúncio), setar:
```
utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&utm_id={{campaign.id}}
```
- As macros `{{...}}` o Meta preenche sozinho. A Utmify lê `utm_source/medium/campaign/content/term`.
- Aplicar nas **3 campanhas novas** (PROSPECTING, RETARGETING, REC AUDIENCIA) e deixar como padrão pras futuras.
- *(Dá pra aplicar via API — Meta Ads MCP — quando o conector estiver de pé.)*

### 🔧 Frente 2 — LP Lovable preserva a query string *(dev — a mais crítica)*
No botão que redireciona pro checkout Shopify, **repassar a query string inteira**:
```js
const qs = window.location.search;        // ?fbclid=...&utm_source=...
const sep = checkoutUrl.includes('?') ? '&' : '?';
window.location.href = checkoutUrl + (qs ? sep + qs.slice(1) : '');
```
- **Não** re-encodar, **não** baixar caixa (lowercase), **não** filtrar parâmetros.
- Isso conserta **`fbc` E `utm` de uma vez** — é o elo que está quebrado hoje.

### ✅ Frente 3 — Shopify / Pixel *(validar)*
- Confirmar que a **CAPI dupla da Utmify segue desativada** (feito em 21/07 — verificar em 24–48h que o alerta de `fbc` sumiu e SERVER ≈ BROWSER).
- Shopify carrega o UTM do checkout pra atribuição do pedido → Utmify lê.

---

## VALIDAÇÃO (teste ponta a ponta)
1. Clicar num anúncio ativo → a URL da LP tem `?fbclid=...&utm_source=facebook&utm_campaign=...`?
2. Clicar em **Comprar** → a URL do **checkout Shopify** AINDA tem `fbclid` + `utm`?
3. Completar 1 pedido teste → na **Utmify** ele aparece **atribuído** (não "untracked")? No **Meta → Testar eventos**, o `fbc` bate com a URL?
4. Esperado em dias: `fbc` coverage sobe · **untracked despenca** · ROAS por campanha passa a ser confiável.

## ORDEM DE EXECUÇÃO
**Frente 2 (LP) é a mais crítica** — sem ela, a UTM da Frente 1 se perde no meio do caminho. Priorizar o dev do Lovable. Frente 1 o gestor faz em paralelo. Frente 3 é só conferência.
