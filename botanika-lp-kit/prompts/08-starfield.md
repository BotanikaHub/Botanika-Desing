# Starfield Close — túnel de estrelas (Three.js r0.143)

> **Fonte:** getlayers (recriação) · **Uso:** repertório. **Pipeline compartilhado:** ver `06-tunnel.md`. Aqui só o que muda.

## O que ensina
Volume denso de estrelas envolvendo a câmera, com **wrap por mod-Z** (drift infinito), twinkle por fase, barrel-roll lento; scroll surge o drift e mergulha a câmera; cursor guia e empurra estrelas próximas.

## Config (verbatim)
```js
const CONFIG={ bgColor:'#0a0a24', flameColor:'#aee9ff', flameColor2:'#c79bff', flameAmt:0.2,
  colorA:'#aef6cf', colorB:'#5fe6a0', colorC:'#eafff2', opacity:2, pointSize:50, brightness:1.85,
  drift:2.35, twinkle:1, spin:0.03, repelRadius:5, repelStrength:0.35,
  scrollPush:8, scrollDrift:6, scrollSpin:0.1, parallax:0.6 };
```
Câmera `(0,0,5)` far 80. Scroll host `300vh`. Bloom torus `0.22,0.2`; principal `0.4,0.55`.

## Geometria (count 4200, depth 30)
```js
positions[i3]=(Math.random()-0.5)*24;   // x box 24
positions[i3+1]=(Math.random()-0.5)*16; // y 16
positions[i3+2]=(Math.random()-0.5)*30; // z 30 (=depth, wrap perfeito)
palette[i]=Math.floor(Math.random()*3); bright[i]=0.7+Math.random()*0.6;
scales[i]=0.5+Math.pow(Math.random(),1.4)*2.5; phases[i]=Math.random();
```
Attrs: position(3), aScale, aPhase, aPalette, aBright.

## Vertex (verbatim)
```glsl
uniform float uTime,uSize,uDrift,uDepth,uTwinkle; uniform vec3 uCursor; uniform float uRepelRadius,uRepelStrength,uActivity;
uniform vec3 uColorA,uColorB,uColorC; attribute float aScale,aPhase,aPalette,aBright;
varying vec3 vColor; varying float vTwinkle;
void main(){
  vec3 pos=position;
  pos.z=mod(pos.z+uDrift+(uDepth*0.5),uDepth)-(uDepth*0.5);      // drift +Z com wrap
  float tw=sin(uTime*1.6+aPhase*6.2831); vTwinkle=(1.0-uTwinkle)+uTwinkle*(0.55+0.45*tw);
  vec4 modelPosition=modelMatrix*vec4(pos,1.0);
  vec3 toParticle=modelPosition.xyz-uCursor; float dist=length(toParticle);
  float falloff=smoothstep(uRepelRadius,0.0,dist);
  modelPosition.xyz+=normalize(toParticle+vec3(0.0001))*falloff*uRepelStrength*uActivity;
  vec4 viewPosition=viewMatrix*modelPosition; gl_Position=projectionMatrix*viewPosition;
  gl_PointSize=uSize*aScale; gl_PointSize*=(1.0/-viewPosition.z);
  vec3 base=aPalette<0.5?uColorA:(aPalette<1.5?uColorB:uColorC); vColor=base*aBright;
}
```
Frag: `float strength=pow(1.0-d*2.0,4.0); vec3 color=mix(vec3(0.0),vColor,strength); gl_FragColor=vec4(color*uBrightness, strength*uOpacity*vTwinkle);`

## Loop (verbatim)
```js
uDrift += dt*(2.35 + scroll*6);
camera.position.set(m.x*0.6,m.y*0.6,5-scroll*8); camera.lookAt(m.x*0.6,m.y*0.6,-10);
uOpacity = clamp((elapsed-300)/1400,0,1)*2;   // appear
group.rotation.z += dt*(0.03 + scroll*0.1);
```

## Assets
Nenhum — procedural.
