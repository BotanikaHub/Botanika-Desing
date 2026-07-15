import { useState } from 'react'
import { motion } from 'framer-motion'
import { product } from '../data/magnesio'

const cro = product.cro
const BRL = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Avaliação: estrelas + contagem (prova social resumida)
export function StarRating({ dark = false }) {
  const { stars, count } = cro.rating
  const full = Math.floor(stars)
  return (
    <div className="flex items-center gap-2">
      <div className="flex text-amarelo" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < full ? 'opacity-100' : 'opacity-30'}>★</span>
        ))}
      </div>
      <span className={`text-sm font-semibold ${dark ? 'text-creme-claro' : 'text-preto'}`}>
        {stars.toFixed(1).replace('.', ',')}
      </span>
      <span className={`text-sm ${dark ? 'text-creme-claro/60' : 'text-preto/50'}`}>
        ({count.toLocaleString('pt-BR')} avaliações)
      </span>
    </div>
  )
}

// Gatilho de confiança: selos (Anvisa etc.) + pagamento — junto ao botão
export function TrustBadges({ dark = false }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs ${dark ? 'text-creme-claro/70' : 'text-preto/60'}`}>
      {cro.selos.map((s, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-verde-lima">
            <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {s}
        </span>
      ))}
      <span className="opacity-70">· {cro.pagamento}</span>
    </div>
  )
}

// Garantia explícita — microcopy junto ao CTA
export function GuaranteeLine({ dark = false }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-sm font-medium ${dark ? 'text-verde-lima' : 'text-azul'}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5l-8-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      {cro.garantia}
    </div>
  )
}

// Escassez: medidor de "últimas unidades" com barra
export function ScarcityMeter({ dark = false }) {
  const total = 100
  const left = cro.estoqueBase
  const pct = Math.max(8, Math.min(100, (left / total) * 100))
  return (
    <div className="w-full">
      <div className={`mb-1.5 flex items-center justify-between text-xs font-semibold ${dark ? 'text-creme-claro' : 'text-preto'}`}>
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amarelo opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amarelo" />
          </span>
          {cro.escassez}
        </span>
        <span className={dark ? 'text-amarelo' : 'text-azul-escuro'}>{left} restantes</span>
      </div>
      <div className={`h-2 w-full overflow-hidden rounded-full ${dark ? 'bg-creme-claro/15' : 'bg-preto/10'}`}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-amarelo to-verde-lima"
        />
      </div>
    </div>
  )
}

// Calculadora de frete por CEP (usa ViaCEP no navegador do cliente).
export function CepFrete({ dark = false }) {
  const [cep, setCep] = useState('')
  const [state, setState] = useState({ status: 'idle', msg: '' })
  const frete = cro.frete

  function mask(v) {
    const d = v.replace(/\D/g, '').slice(0, 8)
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
  }

  async function calcular(e) {
    e.preventDefault()
    const digits = cep.replace(/\D/g, '')
    if (digits.length !== 8) {
      setState({ status: 'error', msg: 'Digite um CEP válido (8 dígitos).' })
      return
    }
    setState({ status: 'loading', msg: '' })
    try {
      const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await r.json()
      if (data.erro) throw new Error('cep')
      setState({
        status: 'ok',
        msg: `Enviamos para ${data.localidade}/${data.uf} · Frete grátis acima de ${BRL(frete.gratisAcima)} · chega em ${frete.prazo}.`,
      })
    } catch {
      // Fallback (sem internet/CEP inexistente): ainda mostra a regra honesta.
      setState({
        status: 'ok',
        msg: `Frete grátis acima de ${BRL(frete.gratisAcima)} para todo o Brasil · chega em ${frete.prazo}. O valor exato aparece no checkout.`,
      })
    }
  }

  const label = dark ? 'text-creme-claro' : 'text-preto'
  const sub = dark ? 'text-creme-claro/60' : 'text-preto/50'
  return (
    <div className={`rounded-2xl p-5 ring-1 ${dark ? 'bg-creme-claro/[0.05] ring-creme-claro/10' : 'bg-creme ring-preto/10'}`}>
      <div className={`mb-3 flex items-center gap-2 text-sm font-semibold ${label}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-verde-lima">
          <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="2" />
        </svg>
        Calcular frete e prazo
      </div>
      <form onSubmit={calcular} className="flex gap-2">
        <input
          inputMode="numeric"
          value={cep}
          onChange={(e) => setCep(mask(e.target.value))}
          placeholder="Digite seu CEP"
          className={`flex-1 rounded-full border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-verde-lima ${
            dark ? 'border-creme-claro/20 bg-transparent text-creme-claro placeholder:text-creme-claro/40' : 'border-preto/15 bg-white text-preto placeholder:text-preto/40'
          }`}
        />
        <button
          type="submit"
          className="rounded-full bg-azul-escuro px-5 py-2.5 text-sm font-semibold text-creme-claro transition hover:opacity-90"
        >
          {state.status === 'loading' ? '...' : 'Calcular'}
        </button>
      </form>
      {state.msg && (
        <p className={`mt-3 text-sm ${state.status === 'error' ? 'text-red-500' : sub}`}>{state.msg}</p>
      )}
      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-2 inline-block text-xs underline ${sub}`}
      >
        Não sei meu CEP
      </a>
    </div>
  )
}
