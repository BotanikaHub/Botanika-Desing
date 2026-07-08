import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { lineReveal, fadeUp, viewport, EASE } from '../lib/motion'

// Headline com reveal por linha via máscara. `lines` = array de strings.
export function RevealLines({ lines, className = '', as = 'h2' }) {
  const Tag = motion[as] || motion.h2
  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={className}
    >
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <motion.span
            style={{ display: 'block' }}
            variants={lineReveal}
            custom={i}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function Eyebrow({ children, className = '' }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={fadeUp}
      className={`eyebrow ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Botão magnético (desktop only). No touch, comporta normal.
export function MagneticButton({ children, href, className = '', onClick }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 })
  const sy = useSpring(y, { stiffness: 200, damping: 15 })

  function onMove(e) {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const r = ref.current.getBoundingClientRect()
    const mx = e.clientX - (r.left + r.width / 2)
    const my = e.clientY - (r.top + r.height / 2)
    x.set(mx * 0.3)
    y.set(my * 0.3)
  }
  function onLeave() {
    x.set(0)
    y.set(0)
  }

  const Comp = href ? motion.a : motion.button
  return (
    <Comp
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`magnetic inline-flex items-center justify-center gap-2 ${className}`}
    >
      {children}
    </Comp>
  )
}

// Contador que anima quando entra na viewport
export function CountUp({ to, prefix = '', suffix = '', decimals = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  )
}

// Section wrapper com id e padding padrão
export function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`relative w-full ${className}`}>
      {children}
    </section>
  )
}
