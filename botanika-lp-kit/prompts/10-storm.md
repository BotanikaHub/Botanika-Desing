# Storm — orbe de plasma (Three.js r0.143)

> **Fonte:** getlayers (recriação) · **Uso:** repertório. **Pipeline compartilhado:** ver `06-tunnel.md`. Aqui só o que muda.

## O que ensina
Esfera de ~50.000 pontos aditivos — orbe de plasma que "respira" (pump in/out) e gira devagar; gradiente radial 3-stops (núcleo carmim → magenta → dourado) sobre fundo ameixa com corner flames rosa-dourado; scroll mergulha e cresce até engolir; cursor cava um vazio móvel.

## Config (verbatim)
```js
const CONFIG={ bgColor:'#1a0418', flameColor:'#ff2d6b', flameColor2:'#ffd36b', flameAmt:0.2,
  atmoColor:'#ff7ab0', atmoCount:300, atmoSize:24, atmoSpeed:1.0,
  coreColor:'#6a0a2a', midColor:'#ff2d6b', rimColor:'#ffd36b',
  opacity:2, pointSize:80, brightness:1.6, spin:0.03, blowUp:0,
  repelRadius:1.4, repelStrength:4, scrollDive:3, scrollGrow:0.5, scrollSpin:0.6, parallax:0.7 };
```
Câmera `(0,0,7)`. Scroll host `300vh`. Bloom torus `0.22,0.2`, principal `0.4,0.55`.

## Geometria (50k pontos na casca de uma esfera)
```js
const count=50000, radius=2.5;
for(let i=0;i<count;i++){ let u,v,s; do{u=Math.random()*2-1;v=Math.random()*2-1;s=u*u+v*v}while(s>=1||s===0);
  const f=2*Math.sqrt(1-s); const dx=u*f,dy=v*f,dz=1-2*s;
  const rN=Math.pow(Math.random(),0.4); const r=radius*(0.55+rN*0.45);
  positions[i3]=dx*r; positions[i3+1]=dy*r; positions[i3+2]=dz*r;
  mixv[i]=rN; scales[i]=0.45+Math.random()*0.8; noises[i]=Math.random(); radialPush[i]=0.4+rN*1.1; }
```
Attrs: position(3), aScale, aNoise, aRadialPush, aMix.

## Vertex (verbatim — wobble + swirl + blow-up + repel)
```glsl
void main(){ vec3 pos=position;
  float t=uTime*1.4+aNoise*6.2831; float wobble=sin(t)*0.1*aRadialPush; pos*=1.0+wobble;
  float sa=uTime*0.05+aNoise*6.2831; mat2 sw=mat2(cos(sa),-sin(sa),sin(sa),cos(sa)); pos.xz=sw*pos.xz;
  vec3 outward=normalize(pos+vec3(0.0001)); float blow=uBlowUp*uBlowUp; pos+=outward*blow*(10.0+aNoise*18.0)*aRadialPush;
  vec4 modelPosition=modelMatrix*vec4(pos,1.0);
  vec3 toP=modelPosition.xyz-uCursor; float fall=smoothstep(uRepelRadius,0.0,length(toP));
  modelPosition.xyz+=normalize(toP+vec3(0.0001))*fall*uRepelStrength*uActivity;
  vec4 vp=viewMatrix*modelPosition; gl_Position=projectionMatrix*vp;
  gl_PointSize=uSize*aScale; gl_PointSize*=(1.0/-vp.z);
  float t1=smoothstep(0.25,0.85,aMix); vec3 mix1=mix(uCore,uMid,t1);
  float t2=clamp((aMix-0.7)*3.0,0.0,1.0); vColor=mix(mix1,uRim,t2); vBlowUp=uBlowUp; }
```
Frag: `float strength=pow(1.0-d*2.0,4.5); float blowFade=1.0-smoothstep(0.15,1.0,vBlowUp); gl_FragColor=vec4(color*uBrightness, strength*uOpacity*blowFade);`

## Loop (verbatim)
```js
camera.position.set(m.x*0.7,m.y*0.7,7-scroll*3); camera.lookAt(0,0,0);
this.group.scale.setScalar(1+scroll*0.5);
this.uniforms.uOpacity.value=clamp((elapsed-300)/1400,0,1)*2; this.uniforms.uBlowUp.value=0;
this.group.rotation.y+=dt*(0.03+scroll*0.6); this.group.rotation.x+=dt*0.03*0.33;
```

## Assets
Nenhum — procedural.
