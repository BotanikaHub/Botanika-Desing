# COMANDO — Pacote de melhorias premium para LP (Botanika)

> Aplicado e validado nas LPs **Ômega 3** e **Tri[Mg]** (feitas aqui). Este comando leva o
> mesmo pacote de melhorias para as demais LPs — **cada uma na sua própria identidade**.
>
> **Referências pra ver o alvo de qualidade (abra e inspecione):**
> - Ômega 3 (gauges + cápsulas na órbita): https://ofertas.botanikabrasil.com.br/omega3
> - Tri[Mg] (molécula + leque de frascos na oferta): https://ofertas.botanikabrasil.com.br/trimagnesio
> - **Animação da oferta (padrão-régua):** `landing-tetravit/index.html` — classes `.kit-stage`/`.kit-bottle` + função `setKit`.
> - Fonte pra estudar: `https://raw.githack.com/BotanikaHub/Botanika-Desing/lp/landing-<slug>/index.html`

---

## ⚠️ REGRA DE OURO
**MELHORAR a página que existe — NÃO recriar, NÃO clonar outra LP.** Preserve paleta, fontes,
fundo, ilustrações e estrutura da sua página. Cada produto tem identidade própria: só adicione/ajuste
os itens abaixo **na linguagem visual da sua LP** (suas cores, sua fonte, seu clima). Se a sua página
já tem um item (ex.: hero com selos, oferta com seletor), **apenas refine** — não substitua pelo de outra.

---

## CHECKLIST DAS MELHORIAS (faça o que ainda falta na sua LP)

### 1) Oferta com animação de "leque" (padrão Tetra Vit) — PRIORIDADE
Na seção de oferta, o seletor de kit (1/2/3) deve trocar um **palco animado** com os potes/frascos,
não reconstruir o HTML. Use elementos **fixos** `b1`, `b2`, `b3` (3 cópias da imagem do pote), posicionados
absolutos e alinhados na base, que **abrem em leque** ao trocar o kit:
- CSS: `transition: transform .55s cubic-bezier(.16,1,.3,1), opacity .45s ease;` nos potes.
- `b2`/`b3` começam com `opacity:0`; no estado `[data-n="2"]`/`[data-n="3"]` ganham `opacity:1` e
  `translateX/rotate/scale` (ex.: kit 2 → ±20%/±4°; kit 3 → ±32%/±9°, laterais em `scale(.9)`).
- "Pop" a cada troca: adicione `.pop { transform: scale(1.04) }` no palco e no preço por ~420 ms.
- **Preço dinâmico** ao trocar: parcelado em destaque (fonte-título), à vista em 2º plano, "de–por"
  riscado, selo "economize R$ x", selo "−5%/−10% automático", e o bônus (🎁 Manual) só no kit maior.
- **Frascos com fundo transparente** e o palco **sem `overflow:hidden`** (senão corta o pote num retângulo — use `overflow:visible`).

### 2) Barra de compra fixa no mobile (sticky buy bar)
Barra fixa no rodapé, **só em ≤760px**, na identidade da sua LP: à esquerda o preço do kit selecionado
("3x R$ …") + rótulo curto ("2 kits · R$ … à vista"); à direita um botão. **Sincronize** com o seletor
de kit (atualiza junto). Dê `padding-bottom` no body no mobile e suba o botão de WhatsApp pra não sobrepor.

### 3) Hero com vida (na sua identidade)
- Pote **flutuando** + uma **órbita** de partículas ao redor (no Ômega viraram **cápsulas de ômega**;
  adapte ao seu produto — cápsula, gota, mineral, o que combinar). **Importante:** prenda a órbita à
  **borda do pote** (baseie o raio na largura do pote, não na largura do hero) pra não cortar em telas médias.
- 1–2 **selos flutuantes** (ex.: dose do ativo principal / nº de ativos), em vidro na sua paleta.
- Se a sua página já tem selos/molécula/animação no hero, **só refine** — não troque.

### 4) Faixa (band) + Scrollytelling
- Uma **faixa full-width** com uma frase de impacto (destaques na cor de acento).
- Um **scrollytelling** curto (2–3 estágios) contando a lógica do produto, com barra de progresso.
  No mobile deve desempilhar sem overflow.

### 5) Fórmula com destaque visual dos ativos
Mostre os ativos com um visual próprio: **medidores circulares (gauges)** com o número contando,
OU uma **composição/molécula** — o que combinar com a sua identidade. Não use gauge genérico se a sua
página já tem um visual melhor (ex.: molécula).

### 6) Todos os botões de compra = ÂNCORA para a oferta
Todo botão "Comprar/Quero…" (header, hero, escassez, **barra fixa do mobile**) deve **rolar suave até a
seção de oferta** (`href="#comprar"` / `#oferta`). **Só o botão dentro da oferta** (`#mainBuy`) vai ao
checkout — assim o cliente sempre escolhe o kit antes.

### 7) Contagem regressiva "só hoje"
Se houver cronômetro: comece no acesso e termine à **meia-noite (00h) local**, recalculando sozinho.
Sem caixa de "DIAS" (deixe HORAS · MIN · SEG). Nada de data fixa.

### 8) Rastreamento — Meta Pixel + GA4 (hierarquia de eventos)
Confirme (ou instale) logo após `<body>`:
- **Carregamento:** `PageView` + `ViewContent` (Meta) · `view_item` (GA4)
- **Clique em `/cart/`:** `AddToCart` + `InitiateCheckout` (Meta) · `add_to_cart` + `begin_checkout` (GA4)
- IDs: **Meta Pixel `828186133708463`** · **GA4 `G-2JFV5TGHCV`**. Listener de clique no `document` em
  fase de captura pegando `a[href*="/cart/"]`. (Bloco pronto em `botanika-lp-kit/COMANDO-PIXEL.md`.)

### 9) Peso e performance
Se a página tiver **imagens em base64 inline** (uma linha gigante no HTML), **externalize** para arquivos
(`.png`) e referencie por caminho. Meta: HTML **< ~200 KB**. Zero mudança visual.

### 10) Responsividade (Safari mobile) — obrigatório
- `html { overflow-x: hidden }` na **raiz** (não só no body).
- **Zero overflow horizontal em 390 px** — teste: `document.scrollWidth <= window.innerWidth`.
- Botões com texto longo devem **quebrar linha** no mobile (`white-space:normal; max-width:100%`), não cortar.
- Palcos/órbitas com `overflow:visible` pra não cortar potes/partículas.

---

## DADOS REAIS POR PRODUTO (use os SEUS — não invente)
- **VARIANT_ID:** use o que já está no link de checkout da sua página (`/cart/<VARIANT>:1`).
- **Kits 2 e 3:** o desconto é **automático por quantidade** na loja (aplica sozinho) → **NÃO** passe
  `?discount=` na URL desses kits. **Kit 1** usa o cupom **BOTANIKA** (`/cart/<VARIANT>:1?discount=BOTANIKA`).
- Descontos automáticos por produto já existentes na loja (confirme o do seu): `OMEGA5/10`, `TRIMG5/10`,
  `HAIR5/10`, `WHEY5/10`, `SLEEP5/10`, `CREATINA5/10`, `SUPER5/10` (Super Vitamina C), `TETRAVIT5/10`.
- **Preços, doses e ativos:** só dados reais (Shopify + rótulo). Sem fonte → placeholder visível + pendência.

---

## REGRAS INVIOLÁVEIS
- HTML **autocontido** (CSS+JS inline, sem build). Identidade **própria** — não clonar outra LP.
- **Compliance ANVISA:** nada de "cura/trata/previne doença", "milagre", "resultado garantido".
- **VALIDAR** antes de publicar: `node --check` em cada `<script>` não-módulo + conferir balanço de tags
  (div/section/svg/details abrindo e fechando igual) + testar overflow em 390 px.
- Commit com mensagem clara. **NÃO abrir Pull Request** sem pedido. Publicar no fluxo/branch da sua página.

## ENTREGA
Link ao vivo atualizado + resumo do que mudou por item (1–10) + pendências (valores que faltaram).

---

## COMANDO PRONTO PRA COLAR (versão curta)
> Você mantém esta landing page da Botanika. **Melhore-a (não recrie, não clone outra LP)**, mantendo
> a identidade dela. Aplique o que ainda falta deste pacote — cada item na linguagem visual desta página:
> (1) **oferta com animação de leque** estilo Tetra Vit (seletor 1/2/3 + potes fixos b1/b2/b3 que abrem
> em leque com transição + "pop"; preço dinâmico com parcelado em destaque, de–por, "economize", selo de
> desconto automático e bônus só no kit maior; potes transparentes e palco `overflow:visible`);
> (2) **barra de compra fixa no mobile** sincronizada com o kit; (3) **hero** com pote flutuando + órbita
> de partículas presa à borda do pote + 1–2 selos; (4) **faixa** + **scrollytelling** curto; (5) **fórmula**
> com destaque visual dos ativos (gauges ou molécula, no seu estilo); (6) **todos os botões de compra
> como âncora** pra oferta (só o botão dentro da oferta vai ao checkout); (7) **cronômetro "só hoje"**
> (meia-noite local, sem caixa de dias); (8) **Meta Pixel 828186133708463 + GA4 G-2JFV5TGHCV** com
> PageView+ViewContent no load e AddToCart+InitiateCheckout no clique de `/cart/`; (9) **externalizar
> imagens base64** se houver (HTML < ~200 KB); (10) **responsividade**: `html{overflow-x:hidden}`, zero
> overflow horizontal em 390 px, botões longos quebram linha.
> Kits 2/3 usam desconto automático da loja (sem `?discount=` na URL); kit 1 usa cupom BOTANIKA. Só dados
> reais. Compliance ANVISA. Valide (`node --check` + balanço de tags + overflow 390 px), commite, publique
> e me devolva o link + resumo. **Não abrir PR.**
