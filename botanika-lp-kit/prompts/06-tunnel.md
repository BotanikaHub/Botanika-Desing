# Tunnel — wormhole (Three.js r0.143)

> **Fonte:** getlayers (recriação) · **Uso:** repertório de técnica — inspirar, nunca copiar direto numa LP Botanika.
> **Esta é a cena canônica** — o pipeline (3 composers, FinalPass, snoise, motes, ponteiro, scroll) se repete em 07–11.

## O que ensina
Tubo cilíndrico de pontos aditivos cuja parede ondula/gira com **simplex noise 3D**; câmera dentro do tubo faz **warp-fly** por scroll; corner flames violeta; ponteiro "abre" a parede onde aponta; motes cyan à deriva.

## PIPELINE CANÔNICO (reutilizável em todas as cenas 06–11)

### Boilerplate
```js
// importmap: three→unpkg three@0.143.0/build/three.module.js ; three/addons/→ .../examples/jsm/
// imports: EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, GammaCorrectionShader, CopyShader
const renderer = new THREE.WebGL1Renderer({ canvas, antialias:true });
renderer.setPixelRatio(devicePixelRatio);
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.VSMShadowMap;
scene.background = new THREE.Color(0x000000); scene.fog = new THREE.Fog(0x000000,0,15);
const LAYERS={NONE:0,TORUS_SCENE:1,BLOOM_SCENE:2,ENTIRE_SCENE:3};
// camera habilita layers 1,2,3; todo THREE.Points habilita ENTIRE_SCENE(3)
function hexToVec3(hex){const n=parseInt(hex.slice(1),16);return new THREE.Vector3(((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255);}
const Lerp=(a,b,t)=>a+(b-a)*t; const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
```

### 3 composers (compartilham um RenderPass) — render por troca de layer
```js
const renderScene=new RenderPass(scene,camera);
const torusComposer=new EffectComposer(renderer); torusComposer.renderToScreen=false;
torusComposer.addPass(renderScene); torusComposer.addPass(new ShaderPass(GammaCorrectionShader));
torusComposer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),0.22,0.2,0));
torusComposer.addPass(new ShaderPass(CopyShader));
const bloomComposer=new EffectComposer(renderer); bloomComposer.renderToScreen=false;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),0.7,0.6,0)); // 07-11 usam 0.4,0.55
bloomComposer.addPass(new ShaderPass(GammaCorrectionShader));
const finalPass=new ShaderPass(FinalPass);
finalPass.uniforms.bloomTexture.value=bloomComposer.renderTarget1.texture;
finalPass.uniforms.torusTexture.value=torusComposer.renderTarget1.texture;
const finalComposer=new EffectComposer(renderer); finalComposer.addPass(renderScene); finalComposer.addPass(finalPass);
// por frame:
camera.layers.set(LAYERS.TORUS_SCENE);  torusComposer.render();
camera.layers.set(LAYERS.BLOOM_SCENE);  bloomComposer.render();
camera.layers.set(LAYERS.ENTIRE_SCENE); finalComposer.render();
```

### FinalPass (composite bg + corner flames) — fragment verbatim
```glsl
uniform float iTime; uniform sampler2D tDiffuse,bloomTexture,torusTexture,haloTexture;
uniform vec3 uBg,uFlameA,uFlameB; uniform float uFlameAmt; varying vec2 vUv;
vec3 warp3d(vec3 pos,float t){ float curv=.8,a=1.9,b=0.7; pos*=2.;
  pos.x+=curv*sin(t+a*pos.y)+t*b; pos.y+=curv*cos(t+a*pos.x);
  pos.y+=curv*sin(t+a*pos.z)+t*b; pos.z+=curv*cos(t+a*pos.y);
  pos.z+=curv*sin(t+a*pos.x)+t*b; pos.x+=curv*cos(t+a*pos.z);
  return 0.5+0.5*cos(pos.xyz+vec3(1,2,4)); }
void main(){
  vec2 uv=2.*vUv-1.;
  vec3 w=pow(warp3d(vec3(uv.x,sin(uv.y),uv.y),iTime*1.5),vec3(1.5));
  vec3 flame=1.5*uFlameA*w.x; flame*=w.y; flame+=uFlameB*w.z;
  flame*=smoothstep(0.25,1.,abs(uv.y));
  float md=smoothstep(-0.7,1.,-uv.y*uv.x); flame*=md*md;
  vec3 bg=uBg*(1.0-0.4*length(uv));
  vec3 halo=texture2D(haloTexture,vUv).xyz;
  gl_FragColor=vec4(bg+flame*uFlameAmt+texture2D(bloomTexture,vUv).xyz+texture2D(torusTexture,vUv).xyz+texture2D(tDiffuse,vUv).xyz+halo,1.);
}
```
Vertex: `varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position,1.0);}`. `haloTexture` fica null (lê preto). Uniforms iTime/tDiffuse/torusTexture/bloomTexture/haloTexture + uBg/uFlameA/uFlameB/uFlameAmt.

### Simplex noise 3D (`snoise`) — injetar no vertex do campo de pontos
```glsl
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){ const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+1.0*C.xxx; vec3 x2=x0-i2+2.0*C.xxx; vec3 x3=x0-1.0+3.0*C.xxx; i=mod(i,289.0);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0; vec3 ns=n_*D.wyz-D.xzx; vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_); vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw); vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3))); p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3))); }
```

### Motes de atmosfera (presos à câmera, dirigem iTime) — verbatim
`N=300` pontos; `positions` random [-1,1]³, `size=24*(0.4+random())`, `seed`. Material additive/transparent/depthWrite:false/depthTest:false. Vertex faz `warp(position,uTime)` (c=0.9,a=1.9,b=0.02,s=0.05) + `farF*nearF`; frag = disco suave × `vA*0.6`. `onBeforeRender`: `t=performance.now()/1000; uTime=t*atmoSpeed*8.0; pts.position.copy(camera.position); finalPass.uniforms.iTime.value=t`.

### Ponteiro → vazio no mundo (repel) — verbatim
```js
function updatePointerWorld(){ _tgt.set(0,0,0);
  if(POINTER.active){ _ndc.set(mouse.x,mouse.y,0.5).unproject(camera); _dir.copy(_ndc).sub(camera.position).normalize();
    const dn=_dir.z; if(Math.abs(dn)>1e-4){const tt=-camera.position.z/dn; if(tt>0&&Number.isFinite(tt)) _tgt.copy(camera.position).addScaledVector(_dir,tt);} }
  POINTER.world.lerp(_tgt,0.12);
  const idle=(performance.now()-POINTER.lastMove)/1000;
  POINTER.activity+=(((POINTER.active&&idle<3)?1:0)-POINTER.activity)*0.06; }
```
No vertex do campo: `vec3 toP=modelPosition.xyz-uCursor; float fall=smoothstep(uRepelRadius,0.0,length(toP)); modelPosition.xyz+=normalize(toP+vec3(0.0001))*fall*uRepelStrength*uActivity;`

### Scroll double-damped
`scrollTarget=clamp(scrollY/(scrollHeight-innerHeight),0,1)`; `scrollSmooth=Lerp(scrollSmooth,scrollTarget,0.10)`; `scrollCurrent=Lerp(scrollCurrent,scrollSmooth,0.06)`. Mouse: `mouse.x=Lerp(mouse.x,mouseTarget.x,0.06)`.

## O QUE É ÚNICO DO TUNNEL

### Constantes
bg `#0a0524`; flameA `#2bf0ff`, flameB `#7a3cff`, flameAmt 0.2; motes `#8fe6ff`×300 size24 speed1; parede `colorLow #180a3a`→`colorHigh #2bf0ff`; opacity 1.44, pointSize 5, brightness 0.4; swirl 0.39, spin 0.065, scale 0.17; scrollFly 34, scrollSwirl 1.5, scrollRoll 0.05; steer 0.6, parallax 0.12, pointerRadius 2.4, pointerStrength 0.8. Scroll host `560vh`. Câmera em `(0,0,20)`.

### Geometria + vertex (tubo)
`SphereGeometry(4.2,200,600)` reusada como grade; `frustumCulled=false`, dentro de um Group (barrel-roll em rotation.z). Vertex remapeia cada vértice p/ tubo cilíndrico usando `wp=(position.x*7,0,position.z*25)`, `wp.x+=position.y*6`, ruído `wn` de 2 octaves de snoise; `tunnelR=12`, ângulo por `normalizedX*PI`, jitter/ambientSwirl por snoise, `dynamicR=tunnelR-wn`, `tunnelPos=(dynamicR*sin,-dynamicR*cos, wp.z+jitterZ)*uScale`; cor `mix(uColLow,uColHigh, smoothstep(-3,3, position.y+position.x*0.5))`; `gl_PointSize=uSize*(10/-mvPosition.z)`. Frag: disco suave × `uOpacity*uAppear`.

### Loop (render(scroll,m))
```js
camera.position.set(m.x*0.12,m.y*0.12,20-scroll*34);
camera.lookAt(m.x*0.6,m.y*0.6,camera.position.z-12);
uniforms.uSwirl.value=0.39*(1+scroll*1.5);
this.rollPhase+=dt*(0.065+scroll*0.05); group.rotation.z=this.rollPhase;
uniforms.uAppear.value=clamp((elapsed-0.2)/1.4,0,1);
```
Bloom principal aqui é **0.7/0.6** (nas 07-11 costuma ser 0.4/0.55).

## Assets
Nenhum — totalmente procedural.
