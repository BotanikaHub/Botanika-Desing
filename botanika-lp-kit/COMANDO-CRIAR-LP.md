# COMANDO — criar uma nova LP Botanika

Copie o bloco abaixo, cole num **chat novo** (com o **Google Drive ligado**) e troque `[PRODUTO]`.

---

**COMANDO — INÍCIO**

Você vai criar uma **landing page premium da Botanika** para o produto **[PRODUTO]**, com **identidade
visual 100% própria** (paleta, fonte, fundo e assinatura únicos desse produto), no **mesmo nível — ou
melhor — que as LPs já existentes** `landing-omega/` (Ômega, oceano navy+dourado) e `landing-tri/`
(Tri, meia-noite mineral). **Não pode ser inferior a elas.**

### 1) Leia antes de começar (nesta ordem)
1. `CLAUDE.md`, `PAGINAS.md`, `botanika-lp-superprompt.md`.
2. O kit inteiro `botanika-lp-kit/` — especialmente `prompts/00-INDEX.md` (repertório de técnica) e `FONTES.md`.
3. Abra `landing-omega/index.html` e `landing-tri/index.html` e use como **régua de qualidade**
   (nível de interação, polimento, número e riqueza das seções).
4. Com o **Google Drive ligado**, vasculhe `Botanika/LP-KIT/` (as fontes `01_getlayers` e
   `02_meez.design`) e selecione **3–5 referências** de técnica/fundo que combinem com o produto.
   Trate como **inspiração** e **recrie do zero** na identidade do produto.
   **NUNCA** copie o código do getlayers nem reutilize os vídeos/mídia do meez.design. Se quiser fundo
   animado, **crie um próprio** (canvas/WebGL) ou um asset novo.

### 2) Verdade do produto (não inventar)
- **Shopify:** handle, **VARIANT_ID**, preço e kits. (Se o conector não estiver ligado, me peça para
  rodar o comando de console `/products/<handle>.js`.)
- **Google Drive:** rótulo/caixa, ativos/composição e **depoimentos reais** do produto.

### 3) Identidade — me proponha e eu confirmo ANTES de codar
- Paleta (distinta de navy/dourado do Ômega e do índigo/menta do Tri), fonte(s), e a **assinatura de
  fundo** (efeito interativo único do produto). Diga também quais referências do Drive inspiraram.

### 4) Construção — nível mínimo (igual/melhor que omega+tri), em `landing-<slug>/index.html` autocontido
- **Fundo-assinatura interativo** (canvas/WebGL próprio) reagindo ao mouse — a "cara" do produto.
- **Hero:** pote + H1 com **reveal por scroll (clip-mask)** + CTA + prova rápida.
- **Seções ricas:** benefícios/ativos (com a composição real), **prova social** (depoimentos reais),
  **oferta com toggle de kit** + painel dinâmico de preço, FAQ, e **barra de compra fixa no mobile**.
- **Interações:** reveal on scroll, **tilt+glow** nos cards, **count-up** de números, **botões
  magnéticos** (gsap.quickTo), pote flutuando.
- **Commerce:** checkout `https://botanikabrasil.com.br/cart/<VARIANT_ID>:<QTD>`, cupom **BOTANIKA**
  (5% OFF), frete grátis > R$349. Kits 2 (5% OFF) e 3 (10% OFF).
- **Mobile:** `html{overflow-x:hidden}` na raiz, imagens `max-width:100%`. Tem que funcionar no
  **Safari mobile via URL ao vivo**.

### 5) Validar e publicar
- `node --check` nos blocos `<script>` não-módulo + checagem de balanço de tags.
- Commit; publicar na branch **`lp`**; atualizar `PAGINAS.md` (pasta, link, VARIANT_ID, identidade, status).
- **Nunca** colocar o identificador do modelo de IA em commits/PR/código.

### 6) Comece assim
Primeiro me responda com: **(a)** a pasta `landing-<slug>/`, **(b)** a identidade proposta
(paleta/fonte/assinatura) e **(c)** as 3–5 referências que puxou do Drive. **Só construa depois que eu aprovar.**

**COMANDO — FIM**

---

> Dica: se quiser, no fim do comando adicione o VARIANT_ID e o preço já prontos, pra pular a etapa da Shopify.
