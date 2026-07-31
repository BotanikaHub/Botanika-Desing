# Elliptical Galaxy — céu de galáxias (Three.js r0.143)

> **Fonte:** getlayers (recriação) · **Uso:** repertório. **Pipeline compartilhado:** ver `06-tunnel.md`. Aqui só o que muda.

## O que ensina
Céu de pequenas galáxias-lente elípticas inclinadas (núcleo dourado denso → borda marrom quase-preta), espalhadas em orientações aleatórias; campo tumbla devagar, cada estrela com wobble + twinkle rosa; scroll mergulha/gira/expande. **Sereno — sem interação de mouse.**

## FinalPass desta cena (corner flames dourado/vermelho, bg indigo) — fragment
```glsl
uniform float iTime; uniform sampler2D tDiffuse,bloomTexture,torusTexture,haloTexture;
uniform vec3 iCornerBlue,iCornerOrange; varying vec2 vUv;
vec3 warp3d(vec3 pos,float t){ float curv=.8,a=1.9,b=0.7; pos*=2.;
  pos.x+=curv*sin(t+a*pos.y)+t*b; pos.y+=curv*cos(t+a*pos.x); pos.y+=curv*sin(t+a*pos.z)+t*b;
  pos.z+=curv*cos(t+a*pos.y); pos.z+=curv*sin(t+a*pos.x)+t*b; pos.x+=curv*cos(t+a*pos.z);
  return 0.5+0.5*cos(pos.xyz+vec3(1,2,4)); }
void main(){ vec2 uv=2.*vUv-1.;
  vec3 w=pow(warp3d(vec3(uv.x,sin(uv.y),uv.y),iTime*1.5),vec3(1.5));
  vec3 col=1.5*iCornerBlue*w.x; col*=w.y; col+=iCornerOrange*w.z;
  col*=smoothstep(0.6,1.,abs(uv.y)); col*=smoothstep(-.5,1.,-uv.y*uv.x); col*=smoothstep(-.5,1.,-uv.y*uv.x);
  vec3 halo=texture2D(haloTexture,vUv).xyz; vec3 atmoBg=vec3(0.02,0.03,0.10)*(1.0-0.4*length(uv));
  gl_FragColor=vec4(atmoBg+col*0.2+texture2D(bloomTexture,vUv).xyz+texture2D(torusTexture,vUv).xyz+texture2D(tDiffuse,vUv).xyz+halo,1.); }
```
`iCornerBlue #ffcf2a` (gold), `iCornerOrange #ff3b1f` (red).

## Constantes (verbatim)
```js
const coreColor='#fff3b0', midColor='#ffb52a', rimColor='#3a1402', twinkleColor='#ff5e8a';
const galaxyCount=79, spread=13, tumbleSpeed=0.2, wobbleAmount=0.205, wobbleSpeed=0.35;
const gradientPow=0.2, twinkleAmount=0.71, twinkleSpeed=2.45;
const scrollDiveZ=4, scrollSpin=2.62, scrollExpand=1;
const atmoColor='#ffd9a0', atmoCount=350, atmoSize=14, atmoSpeed=0.8;
```
Câmera `(0,0,14)`. Bloom torus `0.22,0.2`, principal `0.35,0.5`. Cloud **só na layer ENTIRE_SCENE** (não bloom).

## Geometria (90.000 estrelas em 79 "frames" elípticos girados)
```js
const N=90000, R=1.7, K=79, SP=13; const frames=[];
for(let k=0;k<K;k++) frames.push({ m:new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI)),
  size:0.18+0.34*Math.random(), ecc:0.45+0.42*Math.random(), thick:0.06+0.05*Math.random(),
  ox:(Math.random()-0.5)*2*SP, oy:(Math.random()-0.5)*2*SP, oz:(Math.random()-0.5)*2*SP*0.6 });
for(let i=0;i<N;i++){ const f=frames[i%K]; const th=Math.random()*2*Math.PI; const rad=Math.pow(Math.random(),1.4);
  const rx=f.size*R*rad, rz=f.size*R*f.ecc*rad, y=(Math.random()-0.5)*2*f.thick*R*rad;
  tmp.set(rx*Math.cos(th),y,rz*Math.sin(th)).applyMatrix4(f.m); tmp.x+=f.ox;tmp.y+=f.oy;tmp.z+=f.oz;
  positions[i*3]=tmp.x;...; shells[i]=rad; sizes[i]=6+9*Math.random(); ids[i]=Math.random(); }
```
Attrs: position(3), shell, size, id.

## Vertex/Frag (verbatim, resumido)
Vertex: wobble `vec3(sin,cos,sin)*uWobbleAmount` × `uExpand`, `gl_PointSize=size/-mv.z*(0.5+0.5*iAnimate)`, `res.xy *= clamp(2*pow(iAnimate,0.6)+pow(id,0.7)-1,0,1)` (appear).
Frag: gradiente 3-stops `grad3(uCore,uMid,uRim,pow(shell,uGradientPow))`, twinkle `mix(col,uTwinkle, tw*uTwinkleAmount*(1-t))`, `col*=(0.45+0.85*(1-t))`, disco suave × uOpacity.

## Animação
Appear-in: 2000ms iAnimate 0→1 (smoothstep); grupo z -20→0 (dur 1500 delay 500, `1-(1-t)^4`), uOpacity 0→1. Loop: `uExpand=1+scroll*scrollExpand`; `spin=0.2*(1+scroll*2.62)*dt`; `cloud.rotation.y+=spin; cloud.rotation.x+=spin*0.35`; `camera.position.z=14-scroll*4`. Sem mouse.

## Assets
Nenhum — procedural.
