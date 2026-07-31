# Lumora — Design & Engineering Studio

> **Fonte:** getlayers (recriação) · **Uso:** repertório de técnica — inspirar, nunca copiar direto numa LP Botanika.

## O que este prompt ensina (resumo)
Site light, 1 lib (Lenis). **Grid rem adaptativo** (font-size por vw); **spring helper JS puro** (tension/friction→rAF); **loader contador 000→100**; **reveal linha/palavra com clip-mask**; **hero before/after com "liquid reveal"** (pincel no canvas revela 2ª imagem); relógio ao vivo; modal stub; **count-up por scroll-progress**; componentes PillButton/Eyebrow/TagChip/AnimatedLink.

## Engine reutilizável (o núcleo técnico — verbatim)

### Grid rem adaptativo
```css
@media (max-width:1920px){ html{ font-size:0.833333vw } }
@media (max-width:1440px){ html{ font-size:1.111111vw } }
@media (max-width:1024px){ html{ font-size:1.5625vw } }
@media (max-width:640px){  html{ font-size:4.444444vw } }
```
```js
function applyAdaptiveGrid(){
  const FONT_BASE=16, baseWidth=1920, coef=0.6666;
  const w=window.innerWidth;
  const widthReduction=((baseWidth-w)/baseWidth)*100;
  const size=FONT_BASE-(FONT_BASE*(widthReduction*coef))/100;
  if(size>FONT_BASE) document.documentElement.style.fontSize=size+'px';
  else document.documentElement.style.removeProperty('font-size');
}
applyAdaptiveGrid(); addEventListener('resize', applyAdaptiveGrid);
```

### Spring helper (substitui react-spring)
`accel = tension*(target-x) - friction*v`, integra em `dt≈1/60`, assenta quando `|target-x|<0.001 && |v|<0.001`. Equivalências de curva:
- `{210,26}` ≈ `cubic-bezier(.22,1,.36,1)` ~0.7s
- `{200,24}`/`{180,26}` ≈ `cubic-bezier(.16,1,.3,1)` ~0.8s
- `{320,18}` (hovers) ≈ `cubic-bezier(.2,.8,.2,1)` ~0.35s
Hovers desativados no touch.

### Reveals de texto (substitui spring-text-engine), dispara 1x no viewport
- **Linha:** wrap em `overflow:hidden`, inner `translateY(100%→0)`+`opacity`, stagger por linha, `easeOutCubic` (`cubic-bezier(.215,.61,.355,1)`) 900ms.
- **Palavra:** cada palavra `translateY(24px→0)`+`opacity`, stagger 35ms, `easeOutQuart` (`cubic-bezier(.165,.84,.44,1)`) 700ms.

### Loader (PageLoader)
Painel fixo z120, `#0a0a0a`, cantos `border-radius:0 0 2rem 2rem`. Trava scroll no mount. Barra 1px com fill `#cf8047`; contador **3 dígitos** 000→100 em `FILL_MS=1300ms` com **easeInOutCubic** (`t<.5?4t³:1-((-2t+2)³)/2`). Ao chegar em 100: slide `translateY(0→-100%)` `{220,30}`, fade do conteúdo, seta `ready=true`, `startScroll()`, remove do DOM. Todos os reveals do hero são gated em `ready`.

### LiquidReveal (assinatura do hero — before/after com pincel no canvas)
Container: `<img>` base (sempre visível, LCP) + `<canvas>` que pinta a 2ª imagem no rastro do cursor.
- **Mapping (não trocar):** base = `hero/after.jpg`; revelada = `hero/before.jpg`.
- Params: `brushRadius=143`, `decay=0.016`/frame, `dpr=min(devicePixelRatio,2)`, fadeFrames 120.
- Canvas = rect×dpr. Offscreen "cover" desenha a imagem revelada com math object-fit:cover. Brush offscreen = `diameter=ceil(radius*2)`.
- `pointermove` na window → coords ×dpr; ignora pontos > radius fora; interpola `step=max(radius*0.3,1)`, `n=min(ceil(dist/step),60)`.
- Tick rAF: se tem pontos `idle=0` senão `idle++` e para se `idle>120`. `fade=drawing?decay:min(decay+idle*0.004,0.5)`; `globalCompositeOperation='destination-out'; fillStyle=rgba(0,0,0,fade); fillRect(full)`. stamp(x,y): brush `source-over` gradiente radial (stops 1/0.82/0 em 0/0.55/1), depois `source-in` desenha região da cover, depois no canvas principal `source-over` drawImage(brush). `prefers-reduced-motion` → só imagem base.

### Count-up (Stats) por scroll-progress
Trigger `start "top bottom"` → `end "center center"` (0 quando topo bate no fundo do viewport, 1 quando centro bate no centro); mostra `round(progress*value)`, throttle ~30ms.

### Componentes
- **PillButton:** `inline-flex; border-radius:9999px; font-weight:500`. Variantes dark `#0a0a0a`/#fff, light `#f1f0ee`/#111, outline (border `#e6e5e2`). Com seta: badge circular 2.25rem, ícone hover-spring `{320,18}` (right desloca `translate(3px,0)`, up-right `translate(2px,-2px)`). Root hover `scale 1→1.04`.
- **Eyebrow:** `inline-flex; gap:.5rem; font-size:.875rem; font-weight:500` + dot 0.375rem. Tom dark texto `rgba(17,17,17,.7)`/dot `.5`; light texto `rgba(255,255,255,.7)`/dot `.6`.
- **TagChip:** `inline-flex; border:1px; border-radius:9999px; padding:.5rem 1rem`. Light (em card escuro) border `rgba(255,255,255,.25)`.
- **AnimatedLink:** span hover-spring `translateX 0→4px, opacity .65→1 {320,22}` (legal: `0→3px, .7→1`).

## Paleta & tokens
`--background:#ffffff --foreground:#111111 --ink:#0a0a0a --muted:#8d8d8d --subtle:#b6b6b6 --line:#e6e5e2 --surface:#f1f0ee --surface-2:#e3e2df --accent:#b15f2c --accent-from:#cf8047 --accent-to:#97501f --hero-from:#ecebe9 --hero-to:#c9c9c9`. Radii pill 9999 / card 2rem / card-sm 1.25rem / control .875rem. Watermark 13rem. Shell 88rem. Fonte **Onest** 400/500/600/700.

## Estrutura (DOM order)
PageLoader → Header(overlay, relógio ao vivo + Menu) → main{ Hero(#home liquid-reveal + watermark LUMORA + HeroCard carrossel + Partners) → About(globe + statement word-reveal) → CreateBand(We/Build/→/Better) → Portfolio(#works 4 cards pretos) → Services(#services 4 rows hover-fill) → Stats(painel preto count-up) } → Footer(preto CTA+colunas+watermark) → NavMenu(overlay fullscreen) → RequestModal(stub submit).

## Delays de entrada (ms após `ready`)
header 150, eyebrow 200, H1 250 (lineStagger 120), hero card 400, partners 550, rating 650, CTAs 750, status bar 900, watermark 300. CreateBand `index*120`, Portfolio `index*90`, Services `index*80`, Stats `index*90`.

## Assets
`ASSET_BASE_URL=https://api.getlayers.ai/storage/v1/object/public/public/assets/lumora-e8b711fc68`
`/hero/before.jpg` (revelada / afterSrc) · `/hero/after.jpg` (base / beforeSrc). Não trocar.

> Copy verbatim das seções de marketing (Portfolio/Services/Stats/Footer) é específica do Lumora e **não** se reaproveita para Botanika — o valor aqui é o engine acima. Se precisar do texto original literal dessas seções, ele está no histórico do prompt getlayers.
