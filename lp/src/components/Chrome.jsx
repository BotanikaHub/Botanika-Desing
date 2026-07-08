import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MagneticButton } from './ui'
import { product, checkout } from '../data/magnesio'

// (1) Barra de urgência com contador 24h
export function UrgencyBar() {
  const [left, setLeft] = useState(24 * 3600)
  useEffect(() => {
    const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])
  const h = String(Math.floor(left / 3600)).padStart(2, '0')
  const m = String(Math.floor((left % 3600) / 60)).padStart(2, '0')
  const s = String(left % 60).padStart(2, '0')
  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 z-50 w-full bg-azul-escuro text-creme-claro"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-2 text-center text-[0.72rem] font-semibold uppercase tracking-[0.08em] sm:text-sm">
        <span>🔥 {product.urgency}</span>
        <span className="hidden items-center gap-1 tabular-nums text-verde-lima sm:inline-flex">
          {h}:{m}:{s}
        </span>
      </div>
    </motion.div>
  )
}

// (2) Header logo + CTA — encolhe no scroll
export function Header() {
  const [shrunk, setShrunk] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (v) => setShrunk(v > 60))
  return (
    <motion.header
      className="fixed left-0 z-40 w-full"
      style={{ top: 36 }}
      animate={{ paddingTop: shrunk ? 8 : 16, paddingBottom: shrunk ? 8 : 16 }}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 transition-all duration-500 ${
          shrunk ? 'bg-creme-claro/80 py-2 shadow-lg backdrop-blur-md' : 'py-3'
        }`}
      >
        <span className="font-display text-2xl font-semibold text-azul-escuro">
          {product.brand}
        </span>
        <MagneticButton
          href={checkout.un3}
          className="rounded-full bg-azul-escuro px-5 py-2.5 text-sm font-semibold text-creme-claro"
        >
          Comprar agora
        </MagneticButton>
      </div>
    </motion.header>
  )
}

// (15) Rodapé
export function Footer() {
  return (
    <footer className="bg-preto-deep px-6 py-16 text-creme-claro/70">
      <div className="mx-auto max-w-6xl">
        <div className="font-display text-3xl font-semibold text-creme-claro">
          {product.brand}
        </div>
        <p className="mt-2 max-w-md text-sm">{product.tagline}. Suplemento alimentar.</p>
        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-creme-claro/40">
          Este produto não é medicamento. Suplemento alimentar não substitui uma
          alimentação equilibrada. Não trata, não cura e não previne doenças.
          Resultados variam de pessoa para pessoa. © {new Date().getFullYear()}{' '}
          Botanika Brasil.
        </p>
      </div>
    </footer>
  )
}
