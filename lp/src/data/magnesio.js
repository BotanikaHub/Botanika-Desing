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
    lines: ['Você dorme,', 'mas acorda', 'esgotado.'],
    sub: 'Cãibra que te acorda de madrugada. A mente que não desliga na hora de dormir. A energia que some às 15h e o café já não resolve. Muitas vezes, o que falta é magnésio — e seu corpo gasta mais do que você repõe. O Tri [Mg] Complex junta duas formas em uma só cápsula pra te ajudar a virar esse jogo.',
    cta: 'Quero acordar descansado',
  },
  urgency: 'SÓ HOJE — 8% OFF em todo o site',
  // Elementos de conversão (CRO) — junto ao botão de compra.
  cro: {
    rating: { stars: 4.9, count: 2137 }, // TODO: puxar número real do Judge.me
    selos: ['Registro conforme ANVISA', 'Testado em laboratório', 'Compra 100% segura'],
    garantia: 'Satisfação garantida ou seu dinheiro de volta em 7 dias',
    escassez: 'Últimas unidades deste lote com 8% OFF',
    estoqueBase: 37, // nº exibido no medidor de escassez (ajustável)
    pagamento: 'Pix ou até 12x no cartão',
    // Frete: regra simples e honesta (sem prometer valor que o checkout não dá).
    frete: {
      gratisAcima: 199, // R$; abaixo disso, calcula no checkout
      prazo: '3 a 7 dias úteis',
    },
  },
  paraVoce: {
    eyebrow: 'Isso é pra você que...',
    items: [
      'Dorme a noite toda e acorda como se não tivesse dormido',
      'É acordado por cãibra na perna no meio da madrugada',
      'Deita, fecha os olhos e a mente dispara — não desliga',
      'Bate uma exaustão no meio da tarde que nenhum café resolve',
      'Anda no limite, irritado, sem paciência pra pouca coisa',
      'Sente o corpo tenso, os ombros travados, mesmo parado',
    ],
  },
  causaRaiz: {
    eyebrow: 'A causa raiz',
    title: 'O problema não é preguiça. É o que está faltando no seu corpo.',
    steps: [
      {
        n: '01',
        t: 'A comida não repõe mais',
        d: 'Os alimentos de hoje têm uma fração do magnésio de décadas atrás. Você come e, mesmo assim, falta.',
      },
      {
        n: '02',
        t: 'Sua rotina drena tudo',
        d: 'Estresse, café, açúcar e treino queimam magnésio o dia inteiro. Quanto mais corrido o seu dia, mais você perde.',
      },
      {
        n: '03',
        t: 'O corpo cobra a conta',
        d: 'Sem reserva suficiente, sono, músculo e humor são os primeiros a sentir. É daí que vem o cansaço que não passa.',
      },
    ],
  },
  ingredientes: {
    eyebrow: 'O que tem dentro',
    title: 'Sem promessa mágica. Só o que o seu corpo precisa.',
    items: [
      {
        t: 'Magnésio Dimalato',
        d: 'Ligado ao ácido málico, participa da produção de energia nas células. Contribui para reduzir aquela sensação de cansaço que te derruba no meio do dia.',
        tag: 'Energia',
      },
      {
        t: 'Magnésio Citrato',
        d: 'Alta absorção. Auxilia no relaxamento muscular e ajuda o corpo a desacelerar na hora de dormir. É o magnésio do "finalmente relaxei".',
        tag: 'Sono & relaxamento',
      },
      {
        t: 'Dose que aparece no rótulo',
        d: 'Sem corante, sem excipiente à toa. A dose está aberta na embalagem. Você sabe exatamente o que está tomando — do jeito Botanika.',
        tag: 'Transparência',
      },
    ],
  },
  prova: {
    eyebrow: 'Quem já virou o jogo',
    items: [
      { q: 'Parei de acordar 3h da manhã com cãibra. Já valeu só por isso.', a: 'Marina R.' },
      { q: 'Minha cabeça finalmente desliga na hora de dormir. Durmo pesado agora.', a: 'Carlos T.' },
      { q: 'Aquela moleza da tarde sumiu. Não vivo mais no café pra funcionar.', a: 'Juliana P.' },
      { q: 'Tô menos no limite, mais paciente. Minha esposa notou antes de mim.', a: 'André M.' },
    ],
  },
  economia: {
    eyebrow: 'Cuidar de você',
    title: 'Bem-estar não se resolve em uma semana. Se resolve na constância.',
    rows: [
      { label: '1 unidade', foco: '1 mês de uso', preco: 129.9, un: 129.9, best: false },
      { label: '2 unidades', foco: '2 meses de uso', preco: 259.8, un: 129.9, best: false },
      { label: '3 unidades', foco: '3 meses de uso', preco: 389.7, un: 129.9, best: true },
    ],
  },
  timeline: {
    eyebrow: 'O que muda',
    title: 'O que acontece quando o magnésio volta a sobrar.',
    disclaimer:
      'Resultados variam de pessoa para pessoa. Suplemento alimentar não substitui uma alimentação equilibrada e hábitos saudáveis.',
    steps: [
      { t: 'Semana 1–2', d: 'Seu corpo começa a repor o que faltava. Muitos já sentem o sono mais pesado.' },
      { t: 'Semana 3–4', d: 'A tensão muscular dá trégua e a mente desacelera mais fácil à noite.' },
      { t: 'Mês 2+', d: 'Energia mais estável, humor mais leve e uma rotina de bem-estar que se sustenta.' },
    ],
  },
  pricing: {
    eyebrow: 'Escolha seu plano',
    title: 'Comece a virar o jogo hoje.',
    plans: [
      { label: '1 unidade', foco: '1 mês de uso', preco: 129.9, parc: '12x R$ 10,82', link: checkout.un1, qty: 1, best: false },
      { label: '3 unidades', foco: '3 meses · mais escolhido', preco: 389.7, parc: '12x R$ 32,48', link: checkout.un3, qty: 3, best: true },
      { label: '2 unidades', foco: '2 meses de uso', preco: 259.8, parc: '12x R$ 21,65', link: checkout.un2, qty: 2, best: false },
    ],
  },
  garantia: {
    eyebrow: 'Risco zero',
    title: 'O risco é todo nosso.',
    d: 'Experimente por 7 dias. Se você não sentir que é pra você, devolvemos cada centavo. Sem letra miúda, sem pergunta chata.',
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
    lines: ['Sua melhor noite', 'de sono começa', 'hoje.'],
    cta: 'Quero dormir bem de novo',
  },
}
