# COMANDO — Rastreamento das LPs (Meta Pixel + GA4)

Bloco padrão de rastreamento para as landing pages da Botanika. Cobre a hierarquia
mínima de eventos: **visualização** no load e **carrinho/checkout** no clique de
qualquer link de `/cart/`.

- **Meta Pixel:** `828186133708463`
- **GA4:** `G-2JFV5TGHCV`

## 1) No `<head>` — bases

```html
<!-- Meta Pixel -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','828186133708463');fbq('track','PageView');
</script>
<noscript><img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=828186133708463&ev=PageView&noscript=1"></noscript>

<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-2JFV5TGHCV"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','G-2JFV5TGHCV');
</script>
```

## 2) Logo após `<body>` — eventos (view + carrinho/checkout)

Troque `VARIANT`, `NAME` e `PRICE` pelos dados reais do produto. O `value` do
carrinho é calculado pela quantidade (`:1`, `:2`, `:3`) lida do próprio link.

```html
<script>
(function(){
  var VARIANT='48115367936232', NAME='TetraVit D', PRICE=117.12, CUR='BRL';
  function fb(ev,d){ try{ if(window.fbq) fbq('track',ev,d); }catch(e){} }
  function ga(ev,d){ try{ if(window.gtag) gtag('event',ev,d); }catch(e){} }
  function fire(kind){
    if(kind==='view'){
      fb('ViewContent',{content_ids:[VARIANT],content_type:'product',content_name:NAME,value:PRICE,currency:CUR});
      ga('view_item',{currency:CUR,value:PRICE,items:[{item_id:VARIANT,item_name:NAME,price:PRICE,quantity:1}]});
    }
  }
  if(document.readyState!=='loading') fire('view');
  else document.addEventListener('DOMContentLoaded',function(){ fire('view'); });
  // carrinho/checkout: clique em qualquer link de /cart/ (captura no document)
  document.addEventListener('click', function(e){
    var a=e.target && e.target.closest ? e.target.closest('a[href*="/cart/"]') : null;
    if(!a) return;
    var href=a.getAttribute('href')||'';
    var qm=href.match(/\/cart\/\d+:(\d+)/); var qty=qm?parseInt(qm[1],10):1;
    var value=Math.round(PRICE*qty*100)/100;
    var items=[{item_id:VARIANT,item_name:NAME,price:PRICE,quantity:qty}];
    fb('AddToCart',{content_ids:[VARIANT],content_type:'product',content_name:NAME,value:value,currency:CUR,num_items:qty});
    fb('InitiateCheckout',{content_ids:[VARIANT],content_type:'product',value:value,currency:CUR,num_items:qty});
    ga('add_to_cart',{currency:CUR,value:value,items:items});
    ga('begin_checkout',{currency:CUR,value:value,items:items});
  }, true);
})();
</script>
```

## Mapa de eventos

| Momento | Meta Pixel | GA4 |
|---|---|---|
| Load | `PageView` (base) + `ViewContent` | `view_item` |
| Clique em `a[href*="/cart/"]` | `AddToCart` + `InitiateCheckout` | `add_to_cart` + `begin_checkout` |

> O listener fica no `document` em **captura** (`true`) — pega o clique antes da
> navegação para o checkout Shopify, mesmo que o link só apareça na seção de oferta.
> Só o botão dentro da oferta aponta para `/cart/`; os demais CTAs são âncora para a oferta.
