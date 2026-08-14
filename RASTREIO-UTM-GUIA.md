# 🔧 Guia — Corrigir o rastreio de UTM (Botanika)

**Problema:** ~30% dos pedidos entram sem `utm_source` (o UTM do anúncio não chega ao pedido no Shopify) + `utm_term` truncado ("Instagram_St") + `utm_source` inconsistente (FB / facebook / meta). Isso subestima o ROAS real do pago e cega a decisão de escala.

---

## 🅰️ FRENTE 1 — No anúncio (Meta) — *feito pelo gestor de tráfego*
Padronizar o template de UTM (campo "Parâmetros de URL") em todas as campanhas:
```
utm_source=FB&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{placement}}&utm_id={{campaign.id}}
```
- `utm_source=FB` fixo (unifica; mata "meta"/"facebook").
- `{{placement}}` resolve o truncamento do `utm_term` (valor curto, minúsculo, com underscore).

## 🅱️ FRENTE 2 — No site/checkout (Shopify) — *dev* — resolve os 30% sem tag
O UTM da URL do anúncio precisa **persistir até o pedido**. Solução: capturar o UTM na chegada e gravar como **atributo do carrinho** → vira atributo do pedido (permanente e consultável).

**Colar antes de `</head>` no `theme.liquid`** (ou criar um snippet e dar `{% render %}`):
```html
<script>
(function () {
  try {
    var p = new URLSearchParams(location.search);
    var keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid'];
    var found = {};
    keys.forEach(function (k){ var v = p.get(k); if (v) found[k] = v; });
    if (Object.keys(found).length) localStorage.setItem('btnk_utms', JSON.stringify(found));
    var s = JSON.parse(localStorage.getItem('btnk_utms') || '{}');
    if (Object.keys(s).length) {
      fetch('/cart/update.js', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ attributes: s })
      });
    }
  } catch(e){}
})();
</script>
```
**Checagens extras (dev):**
- O tema não pode remover a query string (`?utm...`) ao navegar entre páginas.
- Se o checkout estiver em domínio diferente, confirmar que os atributos do carrinho passam (com o script acima, passam).

## ✅ Como validar
Um pedido novo vindo de anúncio deve mostrar os UTMs em **Pedido → Detalhes adicionais** no Shopify. A fatia "sem tag" no Utmify/Supabase deve cair bem abaixo dos 30%.

**Prioridade:** Frente 2 (site) é a que mais move o ponteiro. Frente 1 (anúncio) é polimento e é rápida.
