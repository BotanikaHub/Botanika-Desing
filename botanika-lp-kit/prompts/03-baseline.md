# Baseline — Tennis Club & Academy

> **Fonte:** getlayers (recriação) · **Uso:** repertório de técnica — inspirar, nunca copiar direto numa LP Botanika.

## O que este prompt ensina (resumo)
LP editorial (Lenis). Loader cortina que sobe; hero parallax de foto por scroll; **ghost words gigantes** com reveal + parallax X; carrosséis com re-fire de animação; modal contato + menu fullscreen; grid rem adaptativo; componentes pill/eyebrow/dots/arrow-button.

## Núcleo técnico

### Lenis + scroll lock
`new Lenis({smoothWheel:true})` + raf loop. `lenis.start()/stop()` + `html{position:relative;overflow:hidden;height:100%}` para travar (loader/menu/modal). `window.scrollTo(0,0)` no load.

### Grid rem adaptativo (idêntico ao Lumora)
`FONT_BASE=16`, base 1920, COEF 0.6666; media-queries vw `0.833333/1.111111/1.5625/4.444444` em 1920/1440/1024/640. Acima de 1920 escala via JS.

### Frame de página
`<body>` branco; conteúdo em `<main>` com padding `0.5rem`(mobile)/`0.75rem`(≥640) → dá o enquadramento "card" arredondado das seções escuras. `overflow-x:clip`.

### Paleta
`--background#fff --foreground/#ink #0a0a0a --brand#2563c9 --brand-deep#0f2f63 --brand-light#5790e6 --accent-teal#0b6e97 --surface#f4f4f4 --ink-soft#717784 --ghost#d7dae1 --hairline#e6e8ec --on-brand#fff`. Radii card 1.5rem / card-lg 2rem / pill 62.5rem / xl 0.75rem. Fonte **Onest** 400/500.

### Spring helper
`v += (-tension*(x-target) - friction*v)*dt; x += v*dt`.

### 3 primitivas de reveal
1. **Clip-mask palavra/linha:** box `overflow:hidden`, inner `translateY(115%)`+`opacity:0`→0/1, stagger, `padding-bottom:0.14em` (linhas) / 0.12em (ghost). Re-fire ao trocar conteúdo (carrosséis).
2. **Inview:** de `{opacity:0,y:28}`→`{...,y:0}` na 1ª entrada (IntersectionObserver, once), com `delayIn`.
3. **Hover spring:** enter→to, leave→from. **Desativado ≤768px.**

### Easings nomeados
`easeOutExpo` (reveals de palavra/linha/ghost), `easeOutQuart` (fade de palavras facilities), `easeInOutCubic` (loader fill + cortina).

### Loader (cortina navy que sobe)
z200 `--brand-deep`. Wordmark + barra 10rem×1px com fill scaleX 0→1 (delay 120ms, dur `MIN_VISIBLE-120=1280ms`, easeInOutCubic). `MIN_VISIBLE 1400 / MAX_VISIBLE 2600 / EXIT 850`. No load → countdown 1400 → `ready=true` (destrava hero) + start Lenis + cortina `translateY(0→-105%)` easeInOutCubic. Reduced-motion: min ~200ms, exit instantâneo.

### Hero
Navy, `border-radius 2rem`, altura `calc(100svh-1rem)`/`-1.5rem`≥640 min 36rem. Plate de foto oversized (`top:-16%;height:132%`) com **parallax** `translateY(0→12%)` no scroll + overlay gradiente navy. Título `font-size:12.5vw` uppercase, reveal palavra-a-palavra clip-mask (wordStagger 140ms, dur 1100ms easeOutExpo), gated no loader. Tagline 2 linhas `2.4rem` stacked (baseDelay 350 / stagger 110 / dur 900). Collection slider (autoplay 3800ms, crossfade `{210,24}`) + membership card.

### Trust (ghost words)
`<h2>` `font-size:8.2vw` uppercase, 2 linhas de 2 palavras. Palavra 3 = cor ink, resto = ghost. Reveal clip-mask 700ms easeOutExpo, **re-fire ao trocar slide**. Parallax X oposto por palavra (`±3% / ±3% / -2%→4% / 4%→-3%`). Coach card `rotate 6deg`, crossfade de foto ao trocar.

### Componentes
- **Eyebrow:** `inline-flex; gap:.5rem; text-xs; uppercase; letter-spacing:.22em` + dot .375rem.
- **Pill button:** `rounded-pill; padding:.875rem 1.75rem; uppercase`. Seta `M5 12h14M13 6l6 6-6 6` que faz `x:0→5` no hover `{320,20}`. Variantes light/solid/outline.
- **Arrow button (carrossel):** círculo size-12/14, seta escala `1→1.15` `{320,18}`, prev = `scaleX(-1)`.
- **Carousel dots:** pill 0.375rem; ativo width 1.25rem.

### Modal contato + menu overlay
Portalados em body. Modal: backdrop navy@40% blur, panel spring `{240,26}` de `{opacity:0,y:28,scale:0.96}`, título stacked (stagger 90/dur 800), X que rotaciona `0→90deg` no hover. **Submit é stub — nunca rede.** Esc fecha; abre→stop Lenis + foca nome após 120ms; fecha→start Lenis + reset após 350ms. Menu: backdrop `--brand-deep` fade, panel `{opacity:0,y:-24}` `{220,28}`, links delayIn `120+i×70`.

## Assets
`https://api.getlayers.ai/storage/v1/object/public/public/assets/baseline-88535e4000` — `hero/hero-court.webp` + `1..5.webp` (reusadas em hero/trust/facilities). Hero eager, resto lazy.

Copyright 2026. Contato play@baseline.club / +1 (212) 555-0148 / 120 Court Lane, New York.
