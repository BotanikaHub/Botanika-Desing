import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Float, Cylinder } from '@react-three/drei'
import { Suspense, useRef, useState, useEffect, Component } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'

// Se o WebGL/3D falhar por qualquer motivo, cai no fundo gradiente (nunca quebra a página).
class GLBoundary extends Component {
  constructor(p) {
    super(p)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

// Frasco placeholder (cápsula/pote) no visual da marca: azul-marinho + tampa dourada.
// Substituir por <primitive object={gltf.scene}/> quando tivermos o .glb real.
function Bottle({ scrollRef }) {
  const group = useRef()
  useFrame((_, delta) => {
    if (!group.current) return
    // idle: rotação lenta contínua + rotação controlada pelo scroll do hero
    group.current.rotation.y += delta * 0.35 + (scrollRef.current || 0) * 0.02
  })
  return (
    <group ref={group}>
      {/* corpo do pote */}
      <Cylinder args={[0.85, 0.85, 2.1, 64]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#20266B" roughness={0.25} metalness={0.15} />
      </Cylinder>
      {/* rótulo (faixa clara) */}
      <Cylinder args={[0.87, 0.87, 1.1, 64]} position={[0, -0.15, 0]}>
        <meshStandardMaterial color="#F8F0E8" roughness={0.6} />
      </Cylinder>
      {/* tampa dourada */}
      <Cylinder args={[0.9, 0.9, 0.5, 64]} position={[0, 1.15, 0]}>
        <meshStandardMaterial color="#F8C840" roughness={0.2} metalness={0.6} />
      </Cylinder>
    </group>
  )
}

function supportsWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

export default function Hero3D({ fallbackSrc }) {
  const [use3D, setUse3D] = useState(false)
  const scrollRef = useRef(0)
  const { scrollY } = useScroll()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    // 3D só em desktop com WebGL e sem reduced-motion. Mobile/touch = fallback.
    setUse3D(supportsWebGL() && !reduce && !coarse)
  }, [])

  useMotionValueEvent(scrollY, 'change', (v) => {
    scrollRef.current = v
  })

  const Fallback = (
    <div className="absolute inset-0">
      {fallbackSrc && (
        <img src={fallbackSrc} alt="Tri Mg Complex" className="h-full w-full object-cover" loading="eager" />
      )}
    </div>
  )

  if (!use3D) return Fallback

  return (
    <GLBoundary fallback={Fallback}>
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 35 }} dpr={[1, 1.8]}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[4, 6, 4]} intensity={1.6} />
            <directionalLight position={[-4, 2, -2]} intensity={0.6} color="#D0E088" />
            <pointLight position={[0, 2, 4]} intensity={0.8} color="#F8C840" />
            <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
              <Bottle scrollRef={scrollRef} />
            </Float>
            <ContactShadows position={[0, -1.4, 0]} opacity={0.35} scale={6} blur={2.4} />
          </Suspense>
        </Canvas>
      </div>
    </GLBoundary>
  )
}
