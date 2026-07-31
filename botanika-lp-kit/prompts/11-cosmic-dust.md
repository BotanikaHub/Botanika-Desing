# Cosmic Dust — poeira/embers (Three.js r0.143)

> **Fonte:** getlayers (recriação) · **Uso:** repertório. **Pipeline compartilhado:** ver `06-tunnel.md` (FinalPass, motes, composers). Aqui só o que muda.
> A cena **mais calma/leve** — sem scroll, sem interação. Boa de fundo discreto.

## O que ensina
Fly-through lento e infinito de motes brilhantes (embers vermelho-ferrugem e âmbar) vindo em direção à câmera e dando wrap perfeito, sobre vazio marrom-preto com corner flames laranja/dourado. Fade-in suave no load, drift calmo.

## Constantes (verbatim)
```
bg #1a0a04 ; flameA #ff7a2a (orange), flameB #ffce5a (gold), flameAmt 0.2
dust cool #b3401f (ferrugem), dust warm #ffc46b (âmbar) ; dust alpha alvo 0.68
count 940 ; field depth (half) 3.7 ; drift speed 0.4 (multiplicador do shift por frame)
```
Câmera `(0,0,3)` far 80, `fog(0,22)`. `html,body{overflow:hidden}` (sem scroll). Bloom torus `0.3,0.3`, principal `0.5,0.7`.

## Geometria (940 pontos)
```js
const count=940, positions=[], sizes=[];
for(let i=0;i<count;i++){ positions.push(2*Math.random()-1,2*Math.random()-1,2*Math.random()-1); sizes.push(25+25*Math.random()); }
// points.position.set(0,0,-1)
```
Attrs: position(3), size.

## Material — vertex (verbatim, wrap via fract)
```glsl
attribute float size; uniform float iTime; uniform vec3 iShift; uniform vec2 iResolution; uniform vec3 iAnimation; uniform float uDepth;
varying float transparency,warmness;
vec3 warp3d(vec3 pos,float t){ float curv=0.9,a=1.9,b=0.25,b2=0.03,c=0.02; pos*=2.;
  pos.x+=curv*sin(c*t+a*pos.y)+t*b2; pos.y+=curv*cos(c*t+a*pos.x); pos.z+=curv*cos(c*t+a*pos.y);
  pos.z+=curv*sin(c*t+a*pos.x)+t*b; pos.z=abs(pos.z); return pos.xyz; }
void main(){ vec3 v=warp3d(position,iTime);
  v=uDepth*(2.*fract(v+iShift)-1.)+iAnimation;                  // fract → wrap contínuo
  vec4 vpos=modelViewMatrix*vec4(v,1.); transparency=step(length(v),uDepth);
  warmness=step(.75,fract(size*7.13));
  gl_PointSize=size*iResolution.y/1000./-vpos.z; gl_Position=projectionMatrix*vpos; }
```
Frag: `vec3 color=mix(uCool*.8,uWarm*.8,warmness); float tex=smoothstep(1.,.3,length(2.*gl_PointCoord-1.)); gl_FragColor=vec4(tex*color, tex*transparency*iAlpha);`
Uniforms: iTime, iShift(vec3), iAlpha, iAnimation(vec3), iResolution, uDepth 3.7, uCool #b3401f, uWarm #ffc46b. Material `transparent:true; stencil=false`.

## Animação (verbatim)
```js
// fade-in 2200ms smootherstep: eased=t*t*t*(t*(t*6-15)+10); iAlpha=eased*0.68
uniforms.iTime.value=performance.now()/1000;
uniforms.iShift.value.add(camera.position.clone().multiplyScalar(0.0022*0.4)); // drift pela posição da câmera
finalPass.uniforms.iTime.value=performance.now()/1000;
```

## Assets
Nenhum — procedural.
