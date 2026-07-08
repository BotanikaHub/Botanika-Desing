// Camada única de tracking: dispara Meta Pixel (fbq) + GA4 (gtag) juntos.
// Hierarquia de eventos que ACONTECEM na LP: PageView (auto no index.html) ->
// ViewContent -> AddToCart. Os de checkout (InitiateCheckout/AddPaymentInfo/
// Purchase) disparam no checkout do Shopify, não aqui.
import { tracking as T } from '../data/magnesio'

const on = () => typeof window !== 'undefined' && window.__TRACK__

// ViewContent: o visitante está vendo a página do produto.
export function trackViewContent() {
  if (!on()) return
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [T.contentId],
      content_name: T.contentName,
      content_type: 'product',
      content_category: T.category,
      currency: T.currency,
      value: T.basePrice,
    })
  }
  if (window.gtag) {
    window.gtag('event', 'view_item', {
      currency: T.currency,
      value: T.basePrice,
      items: [{ item_id: T.contentId, item_name: T.contentName, price: T.basePrice, quantity: 1 }],
    })
  }
}

// AddToCart: clique num CTA que leva ao /cart do Shopify (adiciona ao carrinho).
export function trackAddToCart(qty = 1, value) {
  if (!on()) return
  const v = value != null ? value : T.basePrice * qty
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [T.contentId],
      content_name: T.contentName,
      content_type: 'product',
      currency: T.currency,
      value: v,
      contents: [{ id: T.contentId, quantity: qty }],
    })
  }
  if (window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: T.currency,
      value: v,
      items: [{ item_id: T.contentId, item_name: T.contentName, price: T.basePrice, quantity: qty }],
    })
  }
}
