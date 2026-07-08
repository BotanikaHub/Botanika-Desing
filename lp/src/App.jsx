import { useLenis } from './lib/useLenis'
import { UrgencyBar, Header, Footer } from './components/Chrome'
import {
  Hero,
  ParaVoce,
  CausaRaiz,
  Ingredientes,
  ProvaSocial,
  Economia,
  Timeline,
  Pricing,
  GarantiaInstitucional,
  FAQ,
  CtaFinal,
} from './components/Sections'

export default function App() {
  useLenis()
  return (
    <div className="relative">
      <div className="grain" />
      <UrgencyBar />
      <Header />
      <main>
        <Hero />
        <ParaVoce />
        <CausaRaiz />
        <Ingredientes />
        <ProvaSocial />
        <Economia />
        <Timeline />
        <Pricing />
        <GarantiaInstitucional />
        <FAQ />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  )
}
