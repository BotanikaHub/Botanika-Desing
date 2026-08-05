# COMANDO — Instalar Pixel / Analytics numa LP (Botanika)

> Rastreamento padrão das LPs Botanika. Mudança geral: fazemos nas LPs deste repo
> e replicamos o mesmo bloco nas de fora (colando o comando no agente de cada uma).

## IDs oficiais (já reais)
- **Meta Pixel:** `828186133708463`  (dataset "Pixel - Botanika 2.0")
- **GA4 (Google Analytics 4):** `G-2JFV5TGHCV`  (tag "Botanika")
- GTM da loja `GTM-WQ7B2563` → é do site botanikabrasil.com.br, **não** vai nas LPs.

## O que a LP consegue rastrear (topo do funil)
| Evento | Meta | GA4 | Onde |
|---|---|---|---|
| Ver a página / produto | `PageView` + `ViewContent` | `page_view` + `view_item` | ✅ ao carregar |
| Clicar em "Comprar" (link `/cart/`) | `AddToCart` + `InitiateCheckout` | `add_to_cart` + `begin_checkout` | ✅ no clique |
| `AddPaymentInfo` / `Purchase` | — | — | ❌ acontecem na **Shopify** (configurar lá) |

---

## Bloco pronto (cole logo após `<body>`; se a página não tiver `<body>`, cole no topo, após o `<meta viewport>`)

```html
<!-- ===== Rastreamento: Meta Pixel + GA4 (hierarquia de eventos) ===== -->
<script>
(function(){
  var META_PIXEL='828186133708463';   /* Pixel - Botanika 2.0 */
  var GA4_ID='G-2JFV5TGHCV';           /* GA4 Botanika */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init',META_PIXEL); fbq('track','PageView'); fbq('track','ViewContent');
  var gaOn=GA4_ID && GA4_ID.indexOf('XXXX')===-1;
  if(gaOn){
    var g=document.createElement('script');g.async=!0;g.src='https://www.googletagmanager.com/gtag/js?id='+GA4_ID;document.head.appendChild(g);
    window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};
    gtag('js',new Date());gtag('config',GA4_ID);gtag('event','view_item');
  }
  document.addEventListener('click',function(e){
    var el=e.target.closest('a[href*="/cart/"]'); if(!el) return;
    if(window.fbq){ fbq('track','AddToCart'); fbq('track','InitiateCheckout'); }
    if(gaOn && window.gtag){ gtag('event','add_to_cart'); gtag('event','begin_checkout'); }
  },true);
})();
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=828186133708463&ev=PageView&noscript=1" alt=""/></noscript>
<!-- ===== /Rastreamento ===== -->
```

Notas:
- O seletor `a[href*="/cart/"]` pega **todos** os botões de compra (todos apontam pro carrinho). Não precisa marcar botão por botão.
- Listener em modo captura (`true`) → dispara mesmo com `target="_blank"`.
- Se a LP tiver **formulário de lead**, adicione dentro do IIFE:
  `document.addEventListener('submit',function(){ if(window.fbq)fbq('track','Lead'); if(gaOn&&window.gtag)gtag('event','generate_lead'); });`

---

## Comando pronto pra colar no agente de uma LP de fora

```
Instale o rastreamento padrão da Botanika nesta LP, sem mudar o design.

Cole o bloco abaixo logo após a tag <body> (se a página não tiver <body>, cole no topo do documento, após o <meta viewport>). Não altere os IDs.

<!-- ===== Rastreamento: Meta Pixel + GA4 (hierarquia de eventos) ===== -->
<script>
(function(){
  var META_PIXEL='828186133708463';
  var GA4_ID='G-2JFV5TGHCV';
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init',META_PIXEL); fbq('track','PageView'); fbq('track','ViewContent');
  var gaOn=GA4_ID && GA4_ID.indexOf('XXXX')===-1;
  if(gaOn){var g=document.createElement('script');g.async=!0;g.src='https://www.googletagmanager.com/gtag/js?id='+GA4_ID;document.head.appendChild(g);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',GA4_ID);gtag('event','view_item');}
  document.addEventListener('click',function(e){var el=e.target.closest('a[href*="/cart/"]');if(!el)return;if(window.fbq){fbq('track','AddToCart');fbq('track','InitiateCheckout');}if(gaOn&&window.gtag){gtag('event','add_to_cart');gtag('event','begin_checkout');}},true);
})();
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=828186133708463&ev=PageView&noscript=1" alt=""/></noscript>
<!-- ===== /Rastreamento ===== -->

Regras: manter autocontido (inline), sem quebrar layout. Se os botões de compra NÃO forem links /cart/, me avise o seletor real deles. Valide (node --check + balanço de tags), commite e publique. Não abrir PR sem pedido.
```

---

## Status
- **Ômega 3** e **Tri[Mg]** → Meta Pixel + GA4 instalados e no ar ✅

## Pendências / próximos passos
- **AddPaymentInfo e Purchase**: ligar na **Shopify** (pixel/CAPI da loja) apontando pro mesmo `828186133708463` + GA4 `G-2JFV5TGHCV`.
- **CAPI (API de Conversões)** server-side para tráfego pago: reforça o match — fazer depois.
- **LGPD**: para disparar só após consentimento, adicionar um gate que só chame `fbq`/`gtag` depois do "aceitar" (peça se quiser o banner).
