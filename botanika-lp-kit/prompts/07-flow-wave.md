# Flow Wave — mar de partículas (Three.js r0.143)

> **Fonte:** getlayers (recriação) · **Uso:** repertório de técnica. **Pipeline compartilhado:** ver `06-tunnel.md` (3 composers, FinalPass, snoise, motes, ponteiro, scroll). Aqui só o que muda.
> **⭐ Melhor candidato para "cabelo/tecido/seiva fluindo"** — usei como base (recriada) para a assinatura de fios do Hair Botanika.

## O que ensina
Folha larga de pontos verdes ondulando sob 2 octaves de simplex noise; câmera mergulha de cima p/ dentro do campo por scroll enquanto o swell cresce e as colinas fluem em direção à câmera; ponteiro afasta a superfície.

## Constantes (verbatim)
```js
const bgColor='#02160c', flameColor='#0aff7f', flameColor2='#aef0c0', flameAmt=0.2;
const atmoColor='#7affbf', atmoCount=300, atmoSize=24, atmoSpeed=1.0;
const colorLow='#02160c', colorHigh='#34e89a';
const opacity=0.26, pointSize=5.5, brightness=0.45;
const waveHeight=3, flow=1, tilt=0, scale=0.275, scrollRise=1.0;
const camStartY=7,camStartZ=16, camEndY=0.8,camEndZ=-2, lookStartZ=2,lookEndZ=-16;
const parallax=1.2, pointerRadius=7.0, pointerStrength=0.9;
```
Câmera `(0,7,16)`. Scroll host `620vh`. Bloom principal `0.4,0.55`. Torus bloom `0.22,0.2`.

## Geometria
`SphereGeometry(4.2,200,600)` reshaped no vertex numa folha plana. `frustumCulled=false`, dentro de Group (`rotation.x=-tilt=0`, `rotation.y=0`).

## Vertex shader (verbatim — injeta `${SNOISE}` do 06)
```glsl
uniform float uTime,uStream,uSize,uWaveHeight,uFlow,uScale;
uniform vec3 uColLow,uColHigh; uniform vec3 uCursor; uniform float uRepelRadius,uRepelStrength,uActivity;
varying float vFade; varying vec3 vColor;
${SNOISE}
void main(){
  vec3 wp=vec3(position.x*13.0,0.0,position.z*25.0); wp.x+=position.y*6.0;
  float zc=wp.z+uStream;
  float wn=snoise(vec3(wp.x*0.08,zc*0.08,uTime*0.15*uFlow))*2.0;
  wn+=snoise(vec3(wp.x*0.16,zc*0.16,uTime*0.3*uFlow))*0.8;
  wp.y+=wn*uWaveHeight;
  vec3 finalPos=wp*uScale;
  vec4 modelPosition=modelMatrix*vec4(finalPos,1.0);
  vec3 toP=modelPosition.xyz-uCursor; float cd=length(toP);
  float fall=smoothstep(uRepelRadius,0.0,cd);
  modelPosition.xyz+=normalize(toP+vec3(0.0001))*fall*uRepelStrength*uActivity;
  vec4 mvPosition=viewMatrix*modelPosition;
  float colMix=smoothstep(-3.0,3.0,position.y+position.x*0.5);
  vColor=mix(uColLow,uColHigh,clamp(colMix,0.0,1.0)); vFade=1.0;
  gl_PointSize=uSize*(10.0/-mvPosition.z); gl_PointSize=max(gl_PointSize,1.5);
  gl_Position=projectionMatrix*mvPosition;
}
```
Frag: `vec2 xy=gl_PointCoord-0.5; float ll=length(xy); if(ll>0.5)discard; float a=smoothstep(0.5,0.1,ll); gl_FragColor=vec4(vColor*uBrightness, vFade*a*uOpacity*uAppear);`

## Loop (verbatim — o "stream" faz as colinas virem)
```js
this.stream += dt*(flow*2.0)*4.0; uniforms.uStream.value=this.stream;
uniforms.uWaveHeight.value=waveHeight*(1+scroll*scrollRise);
const ea=Math.min(scroll/0.35,1.0); const e=ea*ea*(3-2*ea);   // smoothstep nos 1ºs 35%
const camY=Lerp(camStartY,camEndY,e), camZ=Lerp(camStartZ,camEndZ,e);
camera.position.set(m.x*parallax, camY+m.y*parallax*0.3, camZ);
camera.lookAt(m.x*parallax*0.5, Lerp(0.0,0.6,e), Lerp(lookStartZ,lookEndZ,e));
uniforms.uAppear.value=clamp((elapsed-0.2)/1.4,0,1);
```

## Assets
Nenhum — procedural.
