// Variantes e helpers de motion reutilizáveis. Easing "caro" padrão.
export const EASE = [0.16, 1, 0.3, 1]

// Reveal por linha (usar dentro de .line-mask com overflow hidden)
export const lineReveal = {
  hidden: { y: '110%' },
  show: (i = 0) => ({
    y: '0%',
    transition: { duration: 1, ease: EASE, delay: 0.06 * i },
  }),
}

// Fade + subida sutil
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: 0.08 * i },
  }),
}

// Container com stagger nos filhos
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: EASE, delay: 0.08 * i },
  }),
}

export const viewport = { once: true, amount: 0.35 }
