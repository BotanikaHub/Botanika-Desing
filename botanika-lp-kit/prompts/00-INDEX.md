# Índice de prompts — repertório de técnica

> **Uso:** inspiração de técnica para construir LPs Botanika **com identidade própria**.
> **Nunca** copiar um destes direto para um produto. Cada arquivo tem o prompt completo.

| # | Arquivo | O que é | Técnica reutilizável (o "ouro") |
|---|---------|---------|--------------------------------|
| 01 | `01-lumora.md` | Site studio light, 1 lib (Lenis) | **Grid rem adaptativo** (font-size por vw), **spring helper em JS puro** (tension/friction→rAF), **loader com contador 000→100**, **reveal por linha/palavra com clip-mask**, **hero before/after com "liquid reveal"** (pincel no canvas revelando 2ª imagem), relógio ao vivo, modal stub, count-up por scroll-progress. |
| 02 | `02-laocoon.md` | Cena cinematográfica Three.js (cavalo de bronze) | **Órbita de câmera 360° por scroll**, **shader de onda "bronze líquido"** (paleta muda por scroll), **sparks aditivos** (450 partículas com física), **reveal de título por letra com blur-up**, cursor duplo (anel que faz lerp), auto-scale/recenter de GLB. |
| 03 | `03-baseline.md` | LP editorial clube de tênis (Lenis) | **Loader cortina que sobe**, **hero parallax de foto por scroll**, **ghost words gigantes** com reveal + parallax X, **carrosséis com re-fire de animação**, modal contato + menu fullscreen, grid rem adaptativo, componentes (pill/eyebrow/dots). |
| 04 | `04-soda.md` | Hero 3D de lata (GSAP + model-viewer) | **`<model-viewer>` que inclina p/ o cursor**, **partículas 3D repelidas pelo ponteiro** (força de campo), **troca de tema coreografada** (spin 720° + swap de textura no pico + implode/explode), **bolhas subindo** em loop, parallax multicamada. |
| 05 | `05-loopstack.md` | "Footer hero" full-screen, vanilla | **Reveal palavra-a-palavra e letra-a-letra com máscara + blur**, **cursor custom** (anel instantâneo + pill com lerp 0.08), vídeo de fundo com gradiente, dot neon pulsante. Zero libs. |
| 06 | `06-tunnel.md` | Wormhole Three.js r0.143 (procedural) | **Tubo de pontos aditivos** deformado por **simplex noise 3D**, **warp-fly por scroll**, **FinalPass composite** (bg + corner flames), **motes de atmosfera** presos à câmera, ponteiro que "abre" a parede (repel no vertex shader), 3 composers por layer. |
| 07 | `07-flow-wave.md` | Mar de partículas verde Three.js | **Folha de pontos ondulando** com 2 oitavas de simplex, **stream por scroll** (colinas vindo em direção à câmera), câmera mergulha, mesmo FinalPass/motes/repel. **Ótimo p/ "cabelo/tecido fluindo".** |
| 08 | `08-starfield.md` | Túnel de estrelas Three.js | **Campo de estrelas com wrap por mod-Z** (drift infinito), twinkle por fase, barrel-roll, dive por scroll, repel do cursor. Mesmo pipeline de composers/flames. |
| 09 | `09-elliptical.md` | Céu de galáxias-lente Three.js | **90k pontos em N "frames" elípticos** girados aleatoriamente (gradiente núcleo→borda), wobble + twinkle, appear-in animado, sem interação de mouse (sereno). |
| 10 | `10-storm.md` | Orbe de plasma Three.js | **Esfera de 50k pontos "respirando"** (wobble radial + swirl), gradiente 3-stops, dive+grow por scroll, **cursor cava um vazio** na nuvem. |
| 11 | `11-cosmic-dust.md` | Poeira/embers Three.js | **Fly-through de motes** com wrap `fract()` no vertex, fade-in suave, drift pela posição da câmera, corner flames. O mais calmo/leve. |

## Padrões que se repetem (aprender uma vez, usar em todas)

- **Grid rem adaptativo** (01, 03): `font-size` da raiz por media-queries em `vw` + JS que escala acima de 1920px. Todo tamanho vira `rem` → design proporcional em qualquer tela.
- **Spring helper em JS puro** (01, 03): `v += (-tension*(x-target) - friction*v)*dt; x += v*dt`. Substitui react-spring. Configs `{tension,friction}` → curvas cubic-bezier equivalentes.
- **Reveal com clip-mask** (01, 03, 05): palavra/linha dentro de `overflow:hidden`, inner translada `Y 115%→0` + `opacity`, com stagger. Blur-up = adicionar `filter:blur(20px)→0`.
- **Pipeline Three.js procedural** (06–11): `WebGL1Renderer` + 3 `EffectComposer` (torus/bloom/final) trocando `camera.layers` por frame; **FinalPass** desenha bg + corner flames e soma bloom/torus/diffuse; **motes** presos à câmera dirigem `iTime`; **repel do ponteiro** projetado no plano z=0 e aplicado no vertex shader; **scroll double-damped** (dois lerps).
- **Interação com ponteiro** (04, 06–08, 10): repulsão/atração por distância com falloff `smoothstep`, sempre com `activity` que decai após ocioso.
- **Commerce/UX Botanika** (nossas LPs): toggle de kit com painel dinâmico, count-up de números, botões magnéticos (gsap.quickTo), tilt+glow em cards, barra de compra fixa no mobile.
