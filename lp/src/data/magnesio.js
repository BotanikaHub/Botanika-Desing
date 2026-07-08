// Conteúdo da LP do Tri [Mg] Complex (Magnésio 2 em 1).
// COPY = rascunho ANVISA-safe (auxilia/contribui/apoia). Refinar com Copy/PDP oficial.
// LINKS = placeholder até termos os variant_id reais (etapa 1 do fluxo).

const DOMAIN = 'https://botanikabrasil.com.br'
// Mesmo variant_id, quantidade 1/2/3 (o :N é a quantidade no checkout do Shopify).
const VARIANT = 48115368558824
export const checkout = {
  un1: `${DOMAIN}/cart/${VARIANT}:1`,
  un2: `${DOMAIN}/cart/${VARIANT}:2`,
  un3: `${DOMAIN}/cart/${VARIANT}:3`,
}

// Metadados usados pelos pixels (Meta + GA4). value = preço base 1 un.
export const tracking = {
  contentId: String(VARIANT),
  contentName: 'Tri [Mg] Complex',
  category: 'Suplementos',
  currency: 'BRL',
  basePrice: 129.9,
}

export const product = {
  brand: 'Botanika',
  name: 'Tri [Mg] Complex',
  subtitle: 'Magnésio 2 em 1',
  tagline: 'Você mais saudável',
  hero: {
    eyebrow: 'Magnésio Dimalato + Citrato',
    lines: ['Dois magnésios.', 'Uma cápsula.', 'Seu corpo em equilíbrio.'],
    sub: 'O magnésio participa de mais de 300 reações no corpo. O Tri [Mg] Complex reúne duas formas em uma cápsula para auxiliar no relaxamento, na energia e no bem-estar do seu dia a dia.',
    cta: 'Quero meu equilíbrio',
  },
  urgency: 'SÓ HOJE — 8% OFF em todo o site',
  paraVoce: {
    eyebrow: 'Isso é pra você que...',
    items: [
      'Acorda cansado mesmo dormindo a noite toda',
      'Sente cãibras ou tensão muscular com frequência',
      'Vive no modo estresse e não desliga a mente',
      'Quer mais energia e disposição sem estimulante',
    ],
  },
  causaRaiz: {
    eyebrow: 'A causa raiz',
    title: 'A maioria dos brasileiros consome menos magnésio do que precisa.',
    steps: [
      {
        n: '01',
        t: 'Solo empobrecido',
        d: 'Alimentos cada vez mais pobres em minerais essenciais.',
      },
      {
        n: '02',
        t: 'Rotina que drena',
        d: 'Estresse, cafeína e ultraprocessados aceleram a perda de magnésio.',
      },
      {
        n: '03',
        t: 'Corpo em desequilíbrio',
        d: 'Cansaço, tensão e sono ruim podem ser sinais de baixa reserva.',
      },
    ],
  },
  ingredientes: {
    eyebrow: 'O que tem dentro',
    title: 'Transparência radical. Só o que funciona.',
    items: [
      {
        t: 'Magnésio Dimalato',
        d: 'Forma ligada ao ácido málico. Contribui para o metabolismo energético e a redução do cansaço.',
        tag: 'Energia',
      },
      {
        t: 'Magnésio Citrato',
        d: 'Alta biodisponibilidade. Auxilia no relaxamento muscular e no funcionamento normal do corpo.',
        tag: 'Relaxamento',
      },
      {
        t: 'Sem enrolação',
        d: 'Sem corantes, sem excipientes desnecessários. Rótulo aberto, dose clara.',
        tag: 'Limpo',
      },
    ],
  },
  prova: {
    eyebrow: 'Quem já vive isso',
    items: [
      { q: 'Voltei a dormir a noite inteira. Simples assim.', a: 'Marina R.' },
      { q: 'As cãibras noturnas sumiram nas primeiras semanas.', a: 'Carlos T.' },
      { q: 'Mais disposição no treino sem depender de café.', a: 'Juliana P.' },
      { q: 'Finalmente um rótulo que eu entendo o que estou tomando.', a: 'André M.' },
    ],
  },
  economia: {
    eyebrow: 'Kit inteligente',
    title: 'Escolha por quantos meses você quer cuidar de você.',
    rows: [
      { label: '1 unidade', foco: '1 mês de uso', preco: 129.9, un: 129.9, best: false },
      { label: '2 unidades', foco: '2 meses de uso', preco: 259.8, un: 129.9, best: false },
      { label: '3 unidades', foco: '3 meses de uso', preco: 389.7, un: 129.9, best: true },
    ],
  },
  timeline: {
    eyebrow: 'O que esperar',
    title: 'Consistência é o que muda o jogo.',
    disclaimer:
      'Resultados variam de pessoa para pessoa. Suplemento alimentar não substitui uma alimentação equilibrada e hábitos saudáveis.',
    steps: [
      { t: 'Semana 1–2', d: 'Seu corpo começa a repor as reservas de magnésio.' },
      { t: 'Semana 3–4', d: 'Muitas pessoas relatam sono e relaxamento mais consistentes.' },
      { t: 'Mês 2+', d: 'Rotina de bem-estar sustentada, dia após dia.' },
    ],
  },
  pricing: {
    eyebrow: 'Escolha seu plano',
    title: 'Comece seu equilíbrio hoje.',
    plans: [
      { label: '1 unidade', foco: '1 mês de uso', preco: 129.9, parc: '12x R$ 10,82', link: checkout.un1, qty: 1, best: false },
      { label: '3 unidades', foco: '3 meses · mais escolhido', preco: 389.7, parc: '12x R$ 32,48', link: checkout.un3, qty: 3, best: true },
      { label: '2 unidades', foco: '2 meses de uso', preco: 259.8, parc: '12x R$ 21,65', link: checkout.un2, qty: 2, best: false },
    ],
  },
  garantia: {
    eyebrow: 'Risco zero',
    title: 'Garantia de 7 dias.',
    d: 'Experimente. Se não sentir que é pra você, devolvemos seu dinheiro. Sem letra miúda.',
  },
  institucional: {
    eyebrow: 'Por que confiar',
    items: ['Testado em laboratório', 'Rastreável do lote à sua casa', 'Fórmula natural', 'Registro conforme ANVISA'],
  },
  faq: {
    eyebrow: 'Perguntas frequentes',
    items: [
      { q: 'Quantas cápsulas por dia?', a: 'A recomendação de uso está no rótulo. Em geral, 1 a 2 cápsulas ao dia, ou conforme orientação de profissional de saúde.' },
      { q: 'Posso tomar todo dia?', a: 'Sim, o Tri [Mg] Complex foi pensado para uso contínuo como parte da sua rotina de bem-estar.' },
      { q: 'Tem contraindicação?', a: 'Gestantes, lactantes e pessoas com condições de saúde devem consultar um profissional antes de usar.' },
      { q: 'Qual a diferença dos dois magnésios?', a: 'Dimalato é associado ao metabolismo energético; citrato tem alta absorção e auxilia no relaxamento. Juntos, cobrem os dois lados.' },
      { q: 'Em quanto tempo chega?', a: 'Enviamos para todo o Brasil. O prazo aparece no checkout conforme seu CEP.' },
    ],
  },
  ctaFinal: {
    lines: ['Seu equilíbrio', 'começa hoje.'],
    cta: 'Quero aproveitar 8% OFF',
  },
}
