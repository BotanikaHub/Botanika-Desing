# Soda — Diet Soda hero 3D

> **Fonte:** getlayers (recriação) · **Uso:** repertório de técnica — inspirar, nunca copiar direto numa LP Botanika.

## O que este prompt ensina (resumo)
Hero full-viewport (sem scroll) com **GSAP + Google `<model-viewer>`**. Lata 3D que inclina p/ o cursor; dezenas de modelos 3D (cherry/leaf) com parallax e **repelidos pelo ponteiro**; bolhas PNG subindo; troca de sabor coreografada (bg morph + spin 720° + swap de textura no pico + implode/explode das berries). Paleta teal/blue + rosa `#fbcfe8`.

## Libs
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
```
Fontes Inter (corpo) / Galada cursiva (títulos) / Manrope (nav). `body{overflow:hidden;height:100vh}`.

## Núcleo técnico

### Fundo dinâmico por CSS vars
`body{background:radial-gradient(circle at center,var(--bg-inner) 0%,var(--bg-mid) 50%,var(--bg-outer) 100%);transition:background 1.2s cubic-bezier(.4,0,.2,1)}`. Classic teal `#0b8a78/#044e3b/#011411`; `.blue-theme` `#0b4f8a/#04294e/#010c14`. Morph com `gsap.to(body,{'--bg-inner':...,duration:1.5,ease:'power2.inOut'})`.

### Lata `<model-viewer>` que segue o cursor
`camera-orbit="0deg 90deg 380%"` `field-of-view="30deg"` `exposure="1.5"` `camera-controls disable-zoom shadow-intensity="0"`. Por frame:
```js
currentMouse.x += (mouse.x-currentMouse.x)*0.05;   // lerp
modelViewer.cameraOrbit = `${currentMouse.x*40 + switchSpin}deg ${90+currentMouse.y*20}deg 380%`;
```

### Parallax multicamada
```js
berriesFG.style.transform=`translate(${cx*60}px,${cy*60}px)`;   // frente
berriesBG.style.transform=`translate(${cx*-30}px,${cy*-30}px)`; // fundo
leavesBG.style.transform =`translate(${cx*-15}px,${cy*-15}px)`;
```

### Repulsão do ponteiro (força de campo) — padrão reutilizável
```js
const d=Math.sqrt(diffX*diffX+diffY*diffY);
if(d<400){ const force=(400-d)/400; targetRx=(diffX/d)*force*-80; targetRy=(diffY/d)*force*-80; speedMult=1+force*5; }
rx += (targetRx-rx)*0.1; ry += (targetRy-ry)*0.1;   // lerp
// float senoidal por índice: dur=[5,7,6,8,5.5,6.5,9,11,10][i%9]
```

### Troca de sabor coreografada (GSAP timeline)
1. bg morph 1.5s. 2. spin: fase1 `val 0→360, blur 0→15, dur 0.6 power2.in`; no pico troca textura (`material.pbrMetallicRoughness.baseColorTexture.setTexture(...)`) + `body.classList.toggle('blue-theme')`; fase2 `val→720, blur→0, dur 1.5 back.out(0.7)`. 3. berries implode (`x/y→centro, scale 0.1, opacity 0, dur 0.5 power2.in`) → troca `.src` do modelo → explode (`x/y→±100 random, scale 1, dur 0.9 back.out(1.5)`).

### Preload de texturas (warm-up de shader)
No `load` do model-viewer: `createTexture(BLUE)`, `createTexture(GREEN)`, aplica blue→green num frame p/ compilar shaders (1ª troca instantânea).

### Bolhas
`setInterval(createBubble,400)`; `<img>` bubble.png, size 10–30px, opacity 0.2–0.6, `animation:floatUpImg 4–10s` (sobe -110vh, drift +30px, rotate 360°), remove após dur.

## Assets
`ASSET_BASE_URL=https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d` — `leaves.glb`, `cherry.glb`, `blueberry.glb`, `deit_soda2.glb` (lata central), `Green Soda.png`, `Blue Soda.png`, `green base color.jpg`, `blue base color.jpg`, `bubble.png` (espaços → %20 se preciso).

> **Aplicação Botanika:** ótimo para seletor de sabor/kit com produto 3D e partículas (ex.: cápsulas/moléculas repelidas pelo cursor). Precisa de GLB do pote — hoje não temos; usar `<model-viewer>` só quando houver o asset.
