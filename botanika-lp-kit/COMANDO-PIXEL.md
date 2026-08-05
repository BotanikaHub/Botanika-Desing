# COMANDO — Instalar Pixel / Analytics numa LP

> Rastreamento de tráfego pago e analytics. É uma **mudança geral**: instalamos nas LPs
> deste repo e replicamos o mesmo bloco nas LPs de fora (colando o comando no agente de cada uma).
>
> **Antes de instalar, preencha os IDs reais:**
> - Meta Pixel ID: `SEU_PIXEL_ID` (ex.: `1234567890`)
> - GA4 Measurement ID: `G-XXXXXXX`
> - TikTok Pixel ID (opcional): `SEU_TT_PIXEL`
> - Google Ads (opcional): `AW-XXXXXXX` + label de conversão

---

## 1) Meta Pixel (Facebook/Instagram Ads) — colar logo após `<head>`

```html
<!-- Meta Pixel -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','SEU_PIXEL_ID');
fbq('track','PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=SEU_PIXEL_ID&ev=PageView&noscript=1"/></noscript>
<!-- /Meta Pixel -->
```

## 2) GA4 (Google Analytics 4) — colar logo após `<head>`

```html
<!-- GA4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','G-XXXXXXX');
</script>
<!-- /GA4 -->
```

## 3) TikTok Pixel (opcional) — colar após `<head>`

```html
<!-- TikTok Pixel -->
<script>
!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
ttq.load('SEU_TT_PIXEL');ttq.page();}(window,document,'ttq');
</script>
<!-- /TikTok Pixel -->
```

---

## 4) Eventos de conversão — disparar nos CTAs (antes de `</body>`)

Dispara **InitiateCheckout** em qualquer clique que leve ao carrinho (`/cart/`) e **Lead** em envio de formulário. Não precisa marcar cada botão — o listener pega todos.

```html
<script>
(function(){
  // Checkout (clique em qualquer link/botão que vá pro carrinho)
  document.addEventListener('click',function(e){
    var el=e.target.closest('a[href*="/cart/"], .js-buy, .btn-buy, #mainBuy');
    if(!el) return;
    if(window.fbq)  fbq('track','InitiateCheckout');
    if(window.gtag) gtag('event','begin_checkout');
    if(window.ttq)  ttq.track('InitiateCheckout');
  });
  // Lead (envio de formulário de cadastro, se houver)
  document.addEventListener('submit',function(e){
    if(window.fbq)  fbq('track','Lead');
    if(window.gtag) gtag('event','generate_lead');
    if(window.ttq)  ttq.track('SubmitForm');
  });
})();
</script>
```

Eventos padrão úteis: `PageView` (automático), `ViewContent` (opcional no load), `InitiateCheckout` (clique comprar), `Lead` (form), `Purchase` (fica na Shopify/obrigado, não na LP).

---

## 5) Onde colar (resumo)
- Blocos **1/2/3** → imediatamente após a tag `<head>` (quanto mais alto, melhor para o PageView).
- Bloco **4** (eventos) → antes de `</body>`, junto dos outros `<script>`.
- Validar depois: `node --check` nos `<script>` não-módulo + balanço de tags.

## 6) Comando pronto pra colar no agente de uma LP de fora

```
Instale rastreamento nesta LP, sem mudar o design:
1) Meta Pixel ID SEU_PIXEL_ID e GA4 G-XXXXXXX — colar os snippets padrão logo após <head>, com PageView automático.
2) Adicionar disparo de eventos: InitiateCheckout (clique em qualquer link/botão que vá para /cart/) e Lead (submit de formulário, se houver) — para fbq e gtag.
3) Manter tudo autocontido (inline), sem quebrar layout. Validar (node --check + balanço de tags), commitar com mensagem clara, publicar e me devolver o link.
(Use os snippets oficiais Meta fbevents.js e GA4 gtag.js. Não abrir PR sem pedido.)
```

## 7) LGPD
Para tráfego BR, o ideal é disparar os pixels **após consentimento** de cookies. Versão simples (sem banner) já funciona; se precisar de banner de consentimento, peça que a gente adiciona um gate que só chama `fbq`/`gtag` após o "aceitar".
