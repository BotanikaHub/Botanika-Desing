# Loopstack — footer hero

> **Fonte:** getlayers (recriação) · **Uso:** repertório de técnica — inspirar, nunca copiar direto numa LP Botanika.

## O que este prompt ensina (resumo)
"Footer hero" full-screen, fundo preto, **zero libs** (vanilla JS+CSS). Vídeo de flor no fundo (90vh) + gradiente preto do topo; headline serif + botão pill com dot neon pulsante; bloco de rodapé centralizado; wordmark gigante colada embaixo. **Reveal palavra-a-palavra e letra-a-letra com máscara + blur**; **cursor custom** (anel instantâneo + pill "SAY HELLO!" com lerp). Acento `#39FF14`.

## Núcleo técnico

### Fontes
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
@import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap');
```
Playfair (headline), Outfit (botão/links), General Sans (títulos rodapé, wordmark, pill). `body{overflow:hidden}` (tela única).

### Camadas (z-index)
top-gradient 0 · vídeo -1 · hero 2 · rodapé/wordmark 3 · anel 99998 · pill 99999.

### Reveal palavra-a-palavra (máscara + blur) — verbatim
```css
.word-wrapper{display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.15em;margin-bottom:-.15em}
.word-inner{display:inline-block;opacity:0;transform:translateY(105%);filter:blur(20px);
  animation:word-reveal-mask 1.3s cubic-bezier(0.05,0.9,0.1,1) forwards}
@keyframes word-reveal-mask{0%{opacity:0;transform:translateY(105%);filter:blur(20px)}30%{opacity:1}100%{opacity:1;transform:translateY(0);filter:blur(0)}}
```
JS: split por `/(\s+|<br\s*\/?>)/i` preservando `<br>`; `animationDelay = i*0.1s`.

### Reveal letra-a-letra (slide da esquerda + blur) — verbatim
```css
.letter-wrapper{display:inline-block;overflow:hidden;vertical-align:bottom;line-height:.8}
.letter-inner{display:inline-block;opacity:0;transform:translateX(-105%);filter:blur(20px);
  animation:letter-reveal-mask 1.2s cubic-bezier(0.05,0.9,0.1,1) forwards}
@keyframes letter-reveal-mask{0%{opacity:0;transform:translateX(-105%);filter:blur(20px)}25%{opacity:1}100%{opacity:.95;transform:translateX(0);filter:blur(0)}}
```
JS: `[...text].forEach((char,i)=>{ inner.style.animationDelay = i*0.09+'s' })`.

### Cursor custom (LERP física) — verbatim do loop
```js
cardX += (mouseX-cardX)*0.08;   // pill lag
cardY += (mouseY-cardY)*0.08;
ringX = mouseX; ringY = mouseY; // anel instantâneo
scale += (targetScale-scale)*0.15;
const ringScale = cursorRing.classList.contains('expanded') ? 1.6*scale : scale;
glassCard.style.transform=`translate3d(${cardX}px,${cardY}px,0) translate(-50%,-50%) scale(${scale})`;
cursorRing.style.transform=`translate3d(${ringX}px,${ringY}px,0) translate(-50%,-50%) scale(${ringScale})`;
```
Ao passar no botão: pill some (`targetScale=0`) + anel expande (`.expanded` → 1.6×). Pill glass `backdrop-filter:blur(12px)`.

### Dot neon pulsante
```css
.blinking-dot{width:10px;height:10px;background:#39FF14;border-radius:50%;animation:pulse-glow 2s infinite}
.blinking-dot::after{content:'';inset:-5px;position:absolute;background:rgba(57,255,20,.45);border-radius:50%;animation:wave-expand 2s infinite}
```
`pulse-glow` (scale .85↔1.1, glow), `wave-expand` (scale 0.6→2.3, opacity 0.9→0).

### Vídeo + gradiente
`.video-container{position:fixed;bottom:0;height:90vh;z-index:-1}` `#bg-video{height:110%;object-fit:cover;loop autoplay muted playsinline}`. `#top-gradient{position:fixed;top:-30vh;z-index:0}` (SVG blob que funde o vídeo no preto). Wordmark `21.9vw` colada embaixo.

## Assets
`ASSET_BASE_URL=https://api.getlayers.ai/storage/v1/object/public/public/assets/loopstack-f8c64439bf` — `flower.mp4`, `black_gradient.svg`.

> **Aplicação Botanika:** os reveals mask+blur e o cursor custom são reutilizáveis em qualquer LP; vídeo de fundo funciona bem para produtos com "vibe" (ex.: fluidez/natureza).
