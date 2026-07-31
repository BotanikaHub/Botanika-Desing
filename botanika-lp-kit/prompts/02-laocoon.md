# Laocoön — Bronze and Time

> **Fonte:** getlayers (recriação) · **Uso:** repertório de técnica — inspirar, nunca copiar direto numa LP Botanika.

## O que este prompt ensina (resumo)
Cena cinematográfica Three.js **r0.160** (cavalo de bronze GLB, página 900vh). Órbita de câmera 360° por scroll; shader de onda "bronze líquido" (paleta muda por scroll); 450 sparks aditivos com física; título reveal por letra com blur-up; grid de linhas com dots à deriva; barra "stories"; cursor duplo (anel interno instantâneo + externo com lerp).

## Núcleo técnico

### Setup
Importmap `three@0.160.0` + addon `GLTFLoader`. `<body>{min-height:900vh}`, canvas+overlay `position:fixed`, scrollbars ocultas, `cursor:none` global. Câmera `PerspectiveCamera(50, aspect, 0.1, 100)` em `(0,0.2,3.0)`. Renderer antialias, pixelRatio min(dpr,2), `PCFSoftShadowMap`, `ACESFilmicToneMapping`, exposure **2.2**. Scene bg `#000`, `FogExp2('#000',0.01)`.

### Luz chiaroscuro
ambient `#fff@0.1`; key SpotLight `#fff@18` em (4,6,3) angle PI/4 penumbra 0.9 castShadow map 2048² near1 far15 bias -0.001; rim DirectionalLight `#e3f2ff@10` em (-5,3,-4); fill DirectionalLight `#fff3e6@0.8` em (-2,-4,2).

### Sparks (450 pontos aditivos)
Textura procedural (gradiente radial branco→transparente 16×16). Posições em box (±3.25 x/z, y ±2.5-0.5). 60% laranja fogo / 40% azul gelo. `sparkData`/partícula: speedX/Y/Z, swaySpeed, swayRadius, phase. `PointsMaterial` size 0.025 opacity 0.85 additive depthWrite:false vertexColors. Reciclagem: `y>3|||x|>3.5|||z|>3.5`→respawn y=-2.5,x/z=±1.5. Velocidade ×scrollVelocity (turbulência no scroll rápido).

### Modelo GLB — auto-scale + recenter (padrão reutilizável)
```js
const box=new THREE.Box3().setFromObject(m); const s=box.getSize(new THREE.Vector3());
const maxDim=Math.max(s.x,s.y,s.z); m.scale.setScalar(3.5/(maxDim>0.0001?maxDim:1));
m.updateMatrixWorld(true);
const c=new THREE.Box3().setFromObject(m).getCenter(new THREE.Vector3());
m.position.sub(c); pivot.position.y=-0.4;
```
Material bronze: `roughness 0.42`, `metalness 0.92`, `flatShading false`, map anisotropy 16.

### Shader de fundo "bronze líquido" (plane filho da câmera, z=-8, renderOrder -10)
Fragment: noise hash-based 3D; `time=uTime*0.08`; 3 ondas (freqs 2.4/3.2/4.0, angles 0.6/-0.7/1.2, pesos 0.50/0.35/0.15); `scrollDeform=scroll*5.0` deforma UVs; paleta interpola **bronze→sapphire** por scroll; crest ×1.4; vignette `1-dot(uv,uv)*0.12`. Uniforms uTime/uResolution/uMouse/uScroll.

### Reveal de título por letra (blur-up)
`splitTitlesIntoChars()` envolve cada char em `<span class="char" style="transition-delay:${i*0.035}s">` preservando `<br>`/espaços. CSS `.char{opacity:0;transform:translateY(50px);filter:blur(12px);transition:.8s cubic-bezier(.25,1,.5,1)}` → ativo `opacity:1;transform:none;filter:blur(0)`.

### Loop — órbita por scroll (verbatim)
```js
currentScroll += (targetScroll-currentScroll)*0.025;
mouseX += (targetMouseX-mouseX)*0.05;
outerCursorX += (cursorX-outerCursorX)*0.2;
if(modelPivot){ modelPivot.rotation.y=mouseX*0.25; modelPivot.rotation.x=mouseY*0.15; }
const phi=currentScroll*Math.PI*2.0;
const y=0.35+Math.sin(currentScroll*Math.PI)*0.8;
const radius=4.2-Math.sin(currentScroll*Math.PI)*0.6;
const x=radius*Math.sin(phi), z=radius*Math.cos(phi);
let tp=Math.min(1,currentScroll/0.28); let ease=(Math.cos(tp*Math.PI)+1)*0.5;
camera.position.lerp(new THREE.Vector3(x,y,z),0.025);
camera.lookAt(new THREE.Vector3(-0.9*ease,-0.15,0));
```

### Grid dots à deriva
```js
dots.forEach((dot,i)=>{ let startY=(i*17)%80+10; let speed=90+(i*55)%180; if(i%2===0)speed=-speed;
  let y=startY+scroll*speed; y=((y%100)+100)%100; dot.style.top=y+'%'; });
```

### Slides + stories
Ativos por faixa: s1[-0.10,0.12] s2[0.28,0.40] s3[0.56,0.68] s4[0.84,1.05]. Nav targetScrolls [0,0.34,0.62,0.94]. Slide-2: imagem abre por `clip-path inset(0 0 100% 0)→0` + zoom 1.15→1.

## Cursor duplo
`.cursor-inner` 6px (snap instantâneo), `.cursor-outer` 40px (lerp 0.2).

## Fontes/cores
Italiana (títulos 116px `#fff6ed`) + Outfit (corpo 16px w300 `#d1d5db`) + Playfair Display italic. Padding `0 60px 40px`; colunas em grid 25vw.

## Assets
`ASSET_BASE_URL="https://api.getlayers.ai/storage/v1/object/public/public/assets/laocoon-59f84455c6"` — `bronze_horse.glb`, `1.png`. Textura dos sparks procedural.
