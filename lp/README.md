# LP Botanika — Tri [Mg] Complex (Magnésio)

Landing page Tier 2 (React + Tailwind + Framer Motion + React Three Fiber + Lenis).
Primeira LP do padrão reutilizável. Segue `docs/lp-design-system.md`.

## Rodar

```bash
cd lp
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ (deploy em Vercel/Netlify/Cloudflare Pages)
```

## Estrutura

- `src/data/magnesio.js` — TODO o conteúdo (copy + preços + links). **Edite aqui.**
- `src/components/Sections.jsx` — as 15 seções (componentes reutilizáveis).
- `src/components/Chrome.jsx` — barra de urgência, header, rodapé.
- `src/components/Hero3D.jsx` — hero 3D (R3F) com fallback automático.
- `src/components/ui.jsx` — primitivos: RevealLines, MagneticButton, CountUp, etc.
- `src/lib/` — Lenis (smooth scroll) e variantes de motion.

## O que ainda é PLACEHOLDER (refinar)

1. **Links de checkout** — em `src/data/magnesio.js`, trocar `VARIANT_ID_1/2/3`
   pelos `variant_id` reais das 3 variações (1/2/3 unidades). Formato:
   `https://botanikabrasil.com.br/cart/<variant_id>:1`
2. **Copy/claims** — rascunho ANVISA-safe (auxilia/contribui/apoia). Validar com Copy/PDP oficial.
3. **Preços** — valores de exemplo; ajustar aos reais.
4. **Frasco 3D** — hoje é um placeholder (cilindro azul+tampa dourada). Para o produto real:
   - Colocar o arquivo `.glb` em `public/model/frasco.glb` (< 3MB, com Draco).
   - Em `Hero3D.jsx`, trocar o `<Bottle/>` por `useGLTF('/model/frasco.glb')`.
5. **Imagens Higgsfield** (geradas no universo da marca) — o ambiente de dev bloqueia
   download do CDN, então NÃO estão embutidas. Para usar como fallback do hero em mobile:
   - Salvar a imagem em `public/img/hero.png`.
   - Em `src/components/Sections.jsx` (Hero), passar `<Hero3D fallbackSrc="/img/hero.png" />`.
   - Sem isso, o mobile usa um mesh gradient em CSS (também no brand, funciona bem).

## Tracking (instalado)

Instalação PRÓPRIA na LP (não passa pelo Custom Pixel do Shopify). Base no `index.html`,
eventos na `src/lib/tracking.js`. Guarda `window.__TRACK__` desliga tudo em localhost/preview.

Hierarquia de eventos que dispara na LP (os de checkout ficam no Shopify):

| Evento LP | Meta Pixel | GA4 | Quando |
|---|---|---|---|
| PageView | `PageView` | `page_view` | automático no load |
| Ver produto | `ViewContent` | `view_item` | ao abrir a LP |
| Ir pro carrinho | `AddToCart` | `add_to_cart` | clique em qualquer CTA de compra (qty 1/2/3) |

- Meta Pixel: `828186133708463`
- GA4: `G-2JFV5TGHCV` (→ Google Ads `791-605-0839` via link GA4↔Ads; conversão purchase importada do Shopify)
- **Não** disparamos InitiateCheckout/AddPaymentInfo/Purchase aqui — acontecem no checkout do Shopify (pixel/CAPI de lá).
