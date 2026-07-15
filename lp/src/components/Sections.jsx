import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { RevealLines, Eyebrow, MagneticButton, CountUp, Section } from './ui'
import { fadeUp, scaleIn, stagger, viewport, EASE } from '../lib/motion'
import Hero3D from './Hero3D'
import { trackAddToCart } from '../lib/tracking'
import { StarRating, TrustBadges, GuaranteeLine, ScarcityMeter, CepFrete } from './Cro'
import { product } from '../data/magnesio'

const BRL = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// (3) HERO
export function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <Section id="hero" className="min-h-[100svh] overflow-hidden">
      {/* fundo mesh gradient orgânico */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-creme" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 55% at 78% 40%, rgba(48,56,144,0.35), transparent 60%),' +
              'radial-gradient(45% 45% at 90% 75%, rgba(32,38,107,0.55), transparent 55%),' +
              'radial-gradient(40% 40% at 65% 20%, rgba(208,224,136,0.35), transparent 60%),' +
              'radial-gradient(30% 30% at 85% 30%, rgba(248,200,64,0.25), transparent 60%)',
          }}
        />
      </div>

      {/* 3D à direita / fallback */}
      <motion.div
        style={{ opacity }}
        className="pointer-events-none absolute inset-y-0 right-0 w-[62%] sm:w-[55%]"
      >
        <Hero3D />
      </motion.div>

      {/* scrim de legibilidade: creme da esquerda cobrindo até o meio */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, var(--creme) 12%, rgba(248,240,232,0.85) 34%, rgba(248,240,232,0) 62%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 sm:hidden"
        style={{ background: 'linear-gradient(0deg, var(--creme) 20%, transparent)' }}
      />

      <motion.div
        style={{ y }}
        className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 pt-32 pb-20"
      >
        <Eyebrow className="text-azul">{'01 — ' + product.hero.eyebrow}</Eyebrow>
        <RevealLines
          as="h1"
          lines={product.hero.lines}
          className="font-display mt-5 max-w-[15ch] text-[clamp(2.6rem,7vw,6.2rem)] font-semibold leading-[0.98] text-azul-escuro"
        />
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={fadeUp}
          className="mt-7 max-w-[46ch] text-lg leading-relaxed text-preto/75"
        >
          {product.hero.sub}
        </motion.p>
        <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={fadeUp} className="mt-9">
          <MagneticButton
            href="#pricing"
            className="rounded-full bg-azul-escuro px-8 py-4 text-base font-semibold text-creme-claro shadow-xl shadow-azul-escuro/20"
          >
            {product.hero.cta} →
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.2em] text-preto/40"
      >
        role ↓
      </motion.div>
    </Section>
  )
}

// (4) "Isso é pra você que..."
export function ParaVoce() {
  const d = product.paraVoce
  return (
    <Section className="bg-creme-claro px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Eyebrow className="text-azul">{d.eyebrow}</Eyebrow>
        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-10 grid gap-4 sm:grid-cols-2"
        >
          {d.items.map((it, i) => (
            <motion.li
              key={i}
              variants={fadeUp}
              custom={i}
              className="flex items-start gap-4 rounded-3xl bg-creme p-6 text-lg text-preto/80"
            >
              <span className="mt-1 text-verde-lima">◆</span>
              {it}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Section>
  )
}

// (5) Causa raiz — sticky pin
export function CausaRaiz() {
  const d = product.causaRaiz
  return (
    <Section className="bg-preto-deep px-6 py-28 text-creme-claro">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow className="text-verde-lima">{d.eyebrow}</Eyebrow>
          <RevealLines
            lines={d.title.split('. ').map((s, i, a) => (i < a.length - 1 ? s + '.' : s))}
            className="font-display mt-5 text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.05]"
          />
        </div>
        <div className="space-y-6">
          {d.steps.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              className="rounded-3xl border border-creme-claro/10 bg-creme-claro/[0.04] p-8"
            >
              <div className="font-display text-4xl font-semibold text-verde-lima">{s.n}</div>
              <h3 className="mt-3 text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-creme-claro/70">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// (6) Ingredientes
export function Ingredientes() {
  const d = product.ingredientes
  return (
    <Section id="ingredientes" className="bg-creme px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Eyebrow className="text-azul">{d.eyebrow}</Eyebrow>
        <RevealLines
          lines={[d.title]}
          className="font-display mt-4 max-w-[20ch] text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-[1.02] text-azul-escuro"
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {d.items.map((it, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
              className="group rounded-[2rem] bg-creme-claro p-8 shadow-sm ring-1 ring-preto/5"
            >
              <span className="eyebrow inline-block rounded-full bg-verde-lima px-3 py-1 text-azul-escuro">
                {it.tag}
              </span>
              <h3 className="font-display mt-6 text-2xl font-semibold text-azul-escuro">{it.t}</h3>
              <p className="mt-3 leading-relaxed text-preto/70">{it.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}

// (7) Prova social — marquee
export function ProvaSocial() {
  const d = product.prova
  const items = [...d.items, ...d.items]
  return (
    <Section className="overflow-hidden bg-azul-escuro py-28 text-creme-claro">
      <div className="mx-auto mb-12 max-w-6xl px-6">
        <Eyebrow className="text-verde-lima">{d.eyebrow}</Eyebrow>
      </div>
      <motion.div
        className="flex gap-6"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((it, i) => (
          <div
            key={i}
            className="w-[320px] shrink-0 rounded-3xl border border-creme-claro/10 bg-creme-claro/[0.05] p-8"
          >
            <p className="font-display text-xl leading-snug">“{it.q}”</p>
            <p className="mt-4 text-sm text-verde-lima">— {it.a}</p>
          </div>
        ))}
      </motion.div>
    </Section>
  )
}

// (8) Tabela de economia
export function Economia() {
  const d = product.economia
  return (
    <Section className="bg-creme-claro px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <Eyebrow className="text-azul">{d.eyebrow}</Eyebrow>
        <RevealLines
          lines={[d.title]}
          className="font-display mt-4 text-[clamp(1.8rem,4vw,3rem)] font-semibold text-azul-escuro"
        />
        <div className="mt-12 overflow-hidden rounded-3xl ring-1 ring-preto/10">
          {d.rows.map((r, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              className={`flex items-center justify-between gap-4 px-6 py-5 sm:px-8 ${
                r.best ? 'bg-azul-escuro text-creme-claro' : 'bg-creme text-preto'
              } ${i > 0 ? 'border-t border-preto/5' : ''}`}
            >
              <div>
                <div className="text-lg font-semibold">{r.label}</div>
                <div className={`text-sm ${r.best ? 'text-verde-lima' : 'text-preto/50'}`}>{r.foco}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">
                  <CountUp to={r.un} prefix="R$ " decimals={2} />
                  <span className="text-sm font-normal opacity-60"> /un</span>
                </div>
                <div className={`text-sm ${r.best ? 'text-creme-claro/70' : 'text-preto/50'}`}>
                  total {BRL(r.preco)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// (9) Timeline + disclaimer
export function Timeline() {
  const d = product.timeline
  return (
    <Section className="bg-creme px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <Eyebrow className="text-azul">{d.eyebrow}</Eyebrow>
        <RevealLines
          lines={[d.title]}
          className="font-display mt-4 text-[clamp(1.8rem,4vw,3rem)] font-semibold text-azul-escuro"
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {d.steps.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              className="relative rounded-3xl bg-creme-claro p-8 ring-1 ring-preto/5"
            >
              <div className="mb-4 h-1 w-12 rounded-full bg-verde-lima" />
              <h3 className="font-display text-xl font-semibold text-azul-escuro">{s.t}</h3>
              <p className="mt-2 text-preto/70">{s.d}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 text-sm italic text-preto/50">{d.disclaimer}</p>
      </div>
    </Section>
  )
}

// (10) Pricing
export function Pricing() {
  const d = product.pricing
  return (
    <Section id="pricing" className="bg-preto-deep px-6 py-28 text-creme-claro">
      <div className="mx-auto max-w-6xl">
        <Eyebrow className="text-verde-lima">{d.eyebrow}</Eyebrow>
        <RevealLines
          lines={[d.title]}
          className="font-display mt-4 text-[clamp(2rem,4.5vw,3.6rem)] font-semibold"
        />
        <div className="mt-5">
          <StarRating dark />
        </div>

        {/* Escassez logo acima dos planos */}
        <div className="mx-auto mt-10 max-w-md">
          <ScarcityMeter dark />
        </div>

        <div className="mt-8 grid items-center gap-6 md:grid-cols-3">
          {d.plans.map((p, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              className={`relative rounded-[2rem] p-8 ${
                p.best
                  ? 'bg-creme-claro text-preto shadow-2xl shadow-verde-lima/20 ring-2 ring-verde-lima md:-my-4 md:py-12'
                  : 'bg-creme-claro/[0.05] ring-1 ring-creme-claro/10'
              }`}
            >
              {p.best && (
                <span className="eyebrow absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-verde-lima px-4 py-1 text-azul-escuro">
                  Mais vendido
                </span>
              )}
              <div className={`text-lg font-semibold ${p.best ? 'text-azul-escuro' : ''}`}>{p.label}</div>
              <div className={`text-sm ${p.best ? 'text-preto/50' : 'text-creme-claro/50'}`}>{p.foco}</div>
              <div className="font-display mt-6 text-4xl font-semibold">{BRL(p.preco)}</div>
              <div className={`text-sm ${p.best ? 'text-preto/50' : 'text-creme-claro/50'}`}>{p.parc}</div>
              <MagneticButton
                href={p.link}
                onClick={() => trackAddToCart(p.qty, p.preco)}
                className={`mt-8 w-full rounded-full px-6 py-3.5 text-sm font-semibold ${
                  p.best ? 'bg-azul-escuro text-creme-claro' : 'bg-verde-lima text-azul-escuro'
                }`}
              >
                Comprar
              </MagneticButton>
              {/* Garantia explícita junto ao botão (gatilho de confiança) */}
              <div className="mt-4">
                <GuaranteeLine dark={!p.best} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selos de confiança (Anvisa etc.) + pagamento, logo abaixo dos botões */}
        <div className="mt-10">
          <TrustBadges dark />
        </div>

        {/* Calculadora de frete por CEP */}
        <div className="mx-auto mt-10 max-w-xl">
          <CepFrete dark />
        </div>
      </div>
    </Section>
  )
}

// (11) Garantia + (12) Institucional
export function GarantiaInstitucional() {
  const g = product.garantia
  const inst = product.institucional
  return (
    <Section className="bg-creme px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="flex flex-col items-center gap-8 rounded-[2.5rem] bg-verde-lima px-8 py-16 text-center text-azul-escuro sm:flex-row sm:text-left"
        >
          <motion.div
            animate={{ rotate: [0, -4, 4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-azul-escuro font-display text-lg font-semibold text-creme-claro"
          >
            7 dias
          </motion.div>
          <div>
            <Eyebrow>{g.eyebrow}</Eyebrow>
            <h3 className="font-display mt-2 text-3xl font-semibold">{g.title}</h3>
            <p className="mt-2 max-w-md text-azul-escuro/80">{g.d}</p>
          </div>
        </motion.div>

        <div className="mt-10">
          <Eyebrow className="text-center text-azul">{inst.eyebrow}</Eyebrow>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {inst.items.map((it, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl bg-creme-claro p-5 text-center text-sm font-medium text-preto/70 ring-1 ring-preto/5"
              >
                {it}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  )
}

// (13) FAQ
export function FAQ() {
  const d = product.faq
  const [open, setOpen] = useState(0)
  return (
    <Section className="bg-creme-claro px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <Eyebrow className="text-azul">{d.eyebrow}</Eyebrow>
        <div className="mt-10 divide-y divide-preto/10">
          {d.items.map((f, i) => (
            <div key={i} className="py-2">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-lg font-semibold text-azul-escuro">{f.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-2xl text-verde-lima">
                  +
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="overflow-hidden"
              >
                <p className="pb-5 text-preto/70">{f.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// (14) CTA final
export function CtaFinal() {
  const d = product.ctaFinal
  return (
    <Section className="relative overflow-hidden bg-azul-escuro px-6 py-32 text-creme-claro">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(50% 60% at 20% 30%, rgba(208,224,136,0.25), transparent 60%),' +
            'radial-gradient(45% 50% at 85% 70%, rgba(48,56,144,0.6), transparent 60%)',
        }}
      />
      <div className="mx-auto max-w-4xl text-center">
        <RevealLines
          lines={d.lines}
          className="font-display text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[0.98]"
        />
        <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={fadeUp} className="mt-10">
          <MagneticButton
            href="#pricing"
            className="rounded-full bg-verde-lima px-10 py-5 text-lg font-semibold text-azul-escuro shadow-2xl shadow-verde-lima/30"
          >
            {d.cta} →
          </MagneticButton>
        </motion.div>
      </div>
    </Section>
  )
}
