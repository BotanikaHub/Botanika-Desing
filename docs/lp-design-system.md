# Botanika — Design System & Motion Reference para Landing Pages

> Régua de qualidade das nossas LPs, destilada de 8 referências nível Awwwards.
> Este doc é a fonte de verdade: todo prompt de Lovable puxa daqui.
> Última atualização: 2026-07-08.

---

## 1. As referências e o que elas realmente são

| Site | O que é | Stack real |
|---|---|---|
| peachweb.io | O **builder** (Peach Worlds) — no-code de sites 3D WebGL | WebGL / Three.js |
| bmw.peachworlds.com | Demo feita no Peach | WebGL / Three.js |
| mongols.peachworlds.com | Demo feita no Peach | WebGL / Three.js |
| epiminds.com | Cliente real, **Honorable Mention Awwwards**, feito no PeachWeb Builder PRO | WebGL + vídeo |
| ascendmarketing.xyz | Studio marketing, scroll cinematográfico | GSAP + WebGL |
| tenbinlabs.xyz | Studio/portfolio | GSAP + smooth scroll |
| garrizmudze.com | Portfolio pessoal cinematográfico | GSAP + WebGL |
| curated.media | Studio, catálogo curado | GSAP + WebGL |

**Conclusão:** o "nível" desejado = **experiências 3D em WebGL com scroll-driven storytelling**. Não é HTML/CSS + fade-in. É GPU, câmera, profundidade, física de scroll.

---

## 2. DNA compartilhado dessas referências (o que copiar)

Padrões que aparecem em quase todos:

1. **Smooth scroll com inércia** (Lenis) — a página não "pula", ela desliza com física. Isso sozinho já muda 40% da percepção de qualidade.
2. **Scroll como timeline** — o scroll não só rola: ele controla câmera 3D, opacidade, escala, posição de objetos. GSAP ScrollTrigger + `scrub`.
3. **Hero com movimento contínuo** — 3D, vídeo em loop, ou shader animado. Nunca uma imagem estática.
4. **Pin / sticky sections** — a seção "trava" na tela enquanto o conteúdo interno anima com o scroll (storytelling sequencial).
5. **Reveal por máscara/clip, não fade simples** — texto sobe de trás de uma máscara (`clip-path` / `overflow:hidden` + translateY), letra por letra ou linha por linha (SplitText).
6. **Cursor customizado / magnético** — botões e links "puxam" o cursor; cursor vira um blob que reage a hover.
7. **Tipografia display gigante** — headlines ocupando 70–90% da largura, peso alto, tracking negativo. Contraste brutal entre display e corpo.
8. **Paleta reduzida + 1 acento** — fundo escuro ou creme monocromático, um único cor-acento vibrante. Muito respiro (whitespace).
9. **Transições de página** (Barba.js / view transitions) — troca de rota sem reload branco; sai por cima, entra por baixo.
10. **Grão / noise / grain overlay** — textura sutil sobre tudo, tira o "digital plástico".
11. **Números e labels monoespaçados** — `01 —`, `(scroll)`, contadores. Estética "editorial técnica".
12. **Easing lento e caro** — durations 0.8–1.4s, easing custom (`expo.out`, `power4.out`). Nada de 0.3s linear.

---

## 3. A decisão de stack (crítico)

Nossas LPs são feitas no **Lovable = React + Tailwind + Framer Motion**. Esse stack **não** faz WebGL/3D nativamente como o Peach. Existem 3 níveis de ambição:

### Tier 1 — "Cinematográfico 2D" (Framer Motion puro) ✅ default seguro
Alcança ~75% da sensação SEM 3D. Rápido, leve, mobile-safe.
- Lenis (smooth scroll) — funciona em React, 1 import.
- Framer Motion: `useScroll` + `useTransform` para parallax, sticky reveals, scale-on-scroll.
- Reveals por máscara (clip-path/overflow), SplitText manual.
- Vídeo em loop no hero (mp4/webm) ou Canvas 2D shader leve.
- Cursor magnético (Framer Motion springs).
- **Prós:** leve, LCP bom, funciona em celular fraco. **Contra:** sem profundidade 3D real.

### Tier 2 — "Híbrido 3D em momentos-chave" (React Three Fiber + GSAP) ⭐ recomendado p/ hero
Adiciona `@react-three/fiber` + `@react-three/drei` + GSAP ScrollTrigger só onde vale (hero, uma seção de ingrediente 3D). Resto é Tier 1.
- Ex: frasco do produto em 3D girando com o scroll; partículas de "ativos".
- **Prós:** o "wow" do Peach onde importa. **Contra:** peso, precisa de modelo 3D (.glb), cuidado no mobile.

### Tier 3 — "100% WebGL" (Peach Worlds direto)
Se a meta é literalmente igual ao Epiminds, o caminho honesto é **usar o próprio Peach Worlds** (é no-code, foi feito pra isso) e embutir/linkar, OU contratar dev Three.js. Lovable não é a ferramenta certa pra isso.

> **Guardrail mobile-first (público Botanika):** 3D pesado mata conversão em 3G/celular fraco. Regra: 3D só no hero, com fallback de imagem/vídeo em mobile e `prefers-reduced-motion`. LCP < 2.5s sempre. A LP existe pra **vender**, não pra ganhar Awwwards.

---

## 4. Tradução pro brandbook Botanika

O visual das referências é dark/tech/frio. O nosso é **mineral, orgânico, quente**. Traduzimos as *técnicas*, não a *estética*.

### Cores (fixo — brandbook)
```css
--azul:#303890; --azul-escuro:#20266B; --azul-claro:#4a52b8;
--verde-lima:#D0E088; --amarelo:#F8C840;
--preto:#181010; --preto-deep:#050404; --creme:#F8F0E8; --creme-claro:#FCF7EE;
```
**Uso cinematográfico:**
- Fundo base: `--creme` / `--creme-claro` (light, orgânico) OU `--preto-deep` em seções "hero drama".
- Acento único por LP: normalmente `--verde-lima` (CTA, highlights) com `--amarelo` como spark.
- `--azul` para blocos institucionais / prova / confiança.
- Gradientes de mesh suaves entre azul→verde-lima para fundos de seção (orgânico, não flat).

### Tipografia (fixo — brandbook)
```
Fraunces (display) 500–600, opsz 144, letter-spacing -0.02em
Inter (corpo) 400–800
```
Import:
```
https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap
```
**Uso cinematográfico:**
- Headlines Fraunces gigantes (clamp 2.5rem → 7rem), reveal por linha com máscara.
- Labels/números em Inter 600 uppercase, tracking +0.08em, `01 —`, `(role)`.
- Corpo Inter 400/500, max-width ~60ch, muito respiro.

### Formas
- Curvas orgânicas (blobs, seções com `border-radius` grande ou clip-path ondulado).
- Grain overlay sutil (SVG noise, opacity 0.03–0.05) sobre a página toda.
- Nada de cantos duros "farmacêutico frio".

---

## 5. Catálogo de técnicas → como fazer no Lovable

| Técnica | Biblioteca | Nota mobile |
|---|---|---|
| Smooth scroll inércia | `lenis` | ✅ ok, desligar em `reduced-motion` |
| Parallax on scroll | Framer `useScroll`+`useTransform` | ✅ ok |
| Sticky/pin storytelling | `position:sticky` + Framer scroll | ✅ ok |
| Reveal texto por linha (máscara) | `overflow:hidden` + `motion` stagger | ✅ ok |
| Split letra-por-letra | manual split + stagger | ⚠️ usar com moderação |
| Cursor magnético | Framer springs (desktop only) | ❌ esconder no touch |
| Hero 3D (frasco girando) | `@react-three/fiber` + `.glb` | ⚠️ fallback vídeo/img |
| Partículas / shader hero | R3F + shader OU Canvas 2D | ⚠️ fallback |
| Vídeo hero loop | `<video autoplay muted loop playsinline>` | ✅ preferir webm leve |
| Grain overlay | SVG feTurbulence fixed | ✅ ok |
| Number counter on view | Framer `useInView` + animate | ✅ ok |
| Page transition | Framer `AnimatePresence` | ✅ ok |
| Mesh gradient fundo | CSS radial-gradients animados | ✅ ok |

---

## 6. Motion spec sobre o esqueleto de 15 seções

(1) **Barra urgência+contador** — entra deslizando do topo, contador tick suave.
(2) **Header logo+CTA** — fixo, encolhe no scroll, CTA magnético.
(3) **Hero** — o momento cinematográfico: 3D/vídeo/shader + headline Fraunces reveal por linha + scroll-cue animado. Mobile = imagem/vídeo estático + reveal.
(4) **"Isso é pra você que..."** — cards que entram em stagger, sticky opcional.
(5) **Causa raiz** — sticky pin, texto troca conforme scroll (storytelling).
(6) **Ingredientes (cards)** — grid com reveal escalonado, hover eleva + acento verde-lima. (Opção Tier 2: 1 ingrediente em 3D.)
(7) **Prova social** — carrossel/marquee horizontal com inércia.
(8) **Tabela economia (kit)** — números counter-up, linha destaque pulsa.
(9) **Timeline + disclaimer** — reveal progressivo linha do tempo, disclaimer ANVISA sempre visível.
(10) **Pricing 1/2/3 un** — cards com scale-in, "mais vendido" com glow verde-lima, CTA magnético → link checkout.
(11) **Garantia 7 dias** — selo com micro-rotação, entra com bounce sutil.
(12) **Prova institucional** — logos/certificações fade sequencial.
(13) **FAQ acordeão** — height animada, ícone rotaciona, conteúdo real da PDP.
(14) **CTA final + urgência** — fundo dramático (preto-deep ou mesh azul→lima), headline grande, contador repetido.
(15) **Rodapé** — reveal simples, links, disclaimers legais.

**Regras transversais:**
- Toda seção respeita `prefers-reduced-motion` (corta animação, mantém conteúdo).
- Easing padrão: `[0.16, 1, 0.3, 1]` (expo.out) — durations 0.8–1.2s.
- Stagger padrão entre filhos: 0.08–0.12s.
- Copy e claims **sempre da PDP/Copy** (ANVISA: auxilia/contribui/apoia).

---

## 7. Preâmbulo mestre pra prompts do Lovable

> Cole este bloco no topo de todo prompt de LP nova no Lovable, antes do conteúdo específico do produto:

```
STACK: React + Tailwind + Framer Motion. Adicione `lenis` para smooth scroll
com inércia (respeitando prefers-reduced-motion). Mobile-first de verdade.

DESIGN SYSTEM BOTANIKA:
Cores: --azul:#303890 --azul-escuro:#20266B --azul-claro:#4a52b8
--verde-lima:#D0E088 --amarelo:#F8C840 --preto:#181010 --preto-deep:#050404
--creme:#F8F0E8 --creme-claro:#FCF7EE
Fontes: Fraunces (display 500-600, opsz144, letter-spacing -0.02em) + Inter (400-800).
Import Google Fonts as duas.
Acento único desta LP: verde-lima (CTA/highlights), amarelo como spark, azul p/ blocos institucionais.
Formas orgânicas/curvas, grain overlay sutil (SVG noise opacity 0.04), muito whitespace.

MOTION (nível cinematográfico, referência Awwwards):
- Smooth scroll Lenis.
- Reveals de texto por LINHA com máscara (overflow hidden + translateY stagger 0.1s), não fade simples.
- Headlines Fraunces gigantes (clamp 2.5rem→7rem), reveal por linha.
- Labels/números Inter 600 uppercase tracking +0.08em, formato "01 —".
- Parallax e sticky pin nas seções de storytelling (useScroll + useTransform).
- Cursor magnético nos CTAs (desktop only, esconder no touch).
- Easing padrão cubic-bezier(0.16,1,0.3,1), durations 0.8-1.2s, stagger 0.08-0.12s.
- Hero com movimento contínuo (vídeo loop OU shader/canvas OU mesh gradient animado).
- Counters animam on-view. Acordeão FAQ com height animada.
- Guardrail: LCP<2.5s, tudo degrada com prefers-reduced-motion, 3D pesado só no hero com fallback.

ESQUELETO: 15 seções padrão Botanika (ver doc). Reaproveitar componentes-base
(header, footer, cards oferta, callouts, FAQ) entre LPs — só copy/imagem/acento mudam.

COPY/CLAIMS: virão do briefing do produto (linguagem ANVISA: auxilia/contribui/apoia,
nunca trata/cura/previne). Não inventar claim.
```

---

## 8. Próximos passos

1. Definir o **Tier** (1 puro / 2 híbrido 3D no hero) — decisão do operador.
2. Se Tier 2: precisamos de **modelo 3D (.glb)** do frasco ou renders — gerar/produzir.
3. Escolher o **primeiro produto** e pegar os `variant_id` (3 variações → 3 links checkout).
4. Rodar o fluxo padrão por produto (links → LP Lovable → pixel Meta → GA4/Ads).

---

### Fontes
- Peach Worlds (builder WebGL no-code): https://threejsresources.com/tool/peach-worlds · https://www.peachweb.io/features
- Epiminds (Awwwards, feito no PeachWeb): https://www.awwwards.com/sites/epiminds-ai
- GSAP + Three.js + ScrollTrigger (técnica de scroll cinematográfico): https://gsap.com/ · https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/
