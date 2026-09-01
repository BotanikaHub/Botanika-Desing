# Mudança 5 · Order bump + barra de frete grátis — Hair

> Adaptação do "carrinho contínuo" pra LP estática: a página redireciona pro `/cart/`, então o análogo é
> **1 order bump contextual + barra de progresso de frete grátis + cart permalink multi-item**.

## Como ficou (Hair) — no bloco da oferta (`.offer-cta`)
- **Barra de frete grátis (R$349, real):** `Faltam R$ X pra frete grátis` → enche → **"🎉 Frete grátis desbloqueado!"** (verde) ao cruzar R$349.
- **Order bump — Super Vitamina C** (VARIANT `48115368460520`, **R$ 89,52/pote**): card premium (estrutura `bt-*`) **vestido com a identidade da LP da Super Vitamina C** (`landing-super-vitamina-c`) — laranja cítrico, **seletor de potes (1/2/3) com sub-rótulos** ("preço cheio" / "−5% · popular" / "−10% · melhor valor"), **leque de potes**, **laranjas orbitando o pote** (animação portada da LP da Vit C), selo circular `−5%/−10%`, preço grande `3× de R$ X` (número em **laranja**) + `ou R$ Y à vista` + `economize R$ Z` (pill verde/lima, cheio riscado). Botão **"Adicionar ao meu pedido"** (opcional) — ao adicionar entra no checkout, move a barra de frete pelo **total do kit** e o CTA principal vira `COMPRAR KIT + SUPER VIT C (N POTES)`.
  - 1 pote: R$ 89,52 · `3× de R$ 29,84` (preço cheio)
  - 2 potes: R$ 170,09 (−5%, economize R$ 8,95) · `3× de R$ 56,70`
  - 3 potes: R$ 241,70 (−10%, economize R$ 26,86) · `3× de R$ 80,57`
  - **Pré-seleção:** o seletor do bump começa no **maior kit (3 potes)**, igual ao seletor invertido do kit principal (`btSel='3'`).
  - Preços/economia = **escada REAL e ATIVA da Vit C** (`[ESCADA] Super Vitamina C 5% 2un`, `10% 3un`) — os mesmos números da página da Vit C. Imagem do pote reaproveitada do Shopify CDN da própria LP da Vit C (`hf_20260805_161803_...png`, transparente).
  - **Reuso do design entre LPs (princípio-chave):** o card do bump **veste a identidade da LP do produto ofertado** — inclusive a **animação-assinatura** dela (aqui as laranjas). Estrutura: base `bt-*` (do `.buy-card` do Tri) + modificador `.bump-<produto>` (`.bump-vitc` = laranja) que redefine gradiente/números/selo/botão; a animação vem por classes `.bt-orbit/.bt-orb` + um IIFE de órbita portado da LP de origem. Trocar o produto do bump = trocar VARIANT + `BUMPS` + imagem + classe de tema (+ animação, se a LP tiver).
- **Cart permalink multi-item:** `#buy` vira `/cart/48650670670056:<kit>,48115368460520:<potes>` (potes = 1/2/3 do card). Kit 1 mantém `?discount=BOTANIKA`. As escadas (Hair e Vit C) são **automáticas** e **combinam** (`combinesWith.productDiscounts:true` nas duas) — aplicam sozinhas, sem code, sem uma cancelar a outra (PDP = checkout).

## Desconto real criado (BxGy)
- **`[BUMP] Hair → Tri[Mg] 5%`** — `DiscountAutomaticNode/1576169505000`, **ACTIVE**, sem data de fim.
- Compra 1× Hair (`Product/9525143896296`) → ganha 1× Tri[Mg] (`Product/9347154968808`) a **−5%**.
- `combinesWith {productDiscounts:true, orderDiscounts:true, shippingDiscounts:true}` — verificado que os `[ESCADA] Hair 5%/10%` (kit 2/3) também combinam com productDiscounts, então o desconto do kit **não é cancelado** pelo bump (PDP = checkout).

## Matemática (frete)
Frete grátis = **R$349** (confirmado: não é um desconto — é uma regra de frete no *delivery profile*, `TOTAL_PRICE ≥ 349 BRL → MeuCorreios grátis`). Os `[FRETE]` de R$199 estão todos EXPIRADOS; o frete vivo é a regra de R$349.
- A preço cheio, o Tri é **R$87,50** → **kit3 (268,38) + Tri = 355,88 ≥ 349** → o bump **desbloqueia o frete** no melhor kit (com folga). O gancho "adicione e ganhe frete grátis" entrega sem depender de nenhum desconto.
- (Existe o BxGy `[BUMP] Hair → Tri[Mg] 5%` ativo no Shopify — foi criado a 5% justamente pra que, **se** aplicasse, o kit3+Tri ainda ficasse ≥349. Como não aplicou no teste do dono, a LP usa o preço cheio e não anuncia %.)

## Pares BxGy da loja (contexto)
`[BUMP]` ativos hoje (todos 10%): `Whey → Creatina`, `Hair → Vitamina C`, `Tri[Mg] → TetraVit D`, `Vit C/Ômega → TetraVit D`, `Sleep → Tri[Mg]`, `Creatina → Whey`. O `Hair → Vitamina C 10%` continua ativo (inofensivo; a LP só deixou de destacar a Vit C). Criei o `Hair → Tri[Mg] 5%` pra casar com o bump escolhido nesta LP.

**Regra pras LPs:** o produto do bump deve seguir um **par BxGy real e ATIVO** (`automaticDiscountNodes`, rótulo `[BUMP]`). Se o par que você quer não existe, **crie o BxGy** no Shopify (write — só com OK do dono) antes de exibir qualquer %/preço com desconto; escolha a % pensando no gancho do frete (deve manter o melhor kit ≥ R$349 se o objetivo é desbloquear frete). Sem desconto criado, o bump entra a **preço cheio real** (sem inventar desconto).

## Onde está (`landing-hair/index.html`)
- Asset: frasco transparente do Tri hospedado no **Shopify CDN** — `cdn.shopify.com/.../bottle-tri-transparente.png` (MediaImage `40551848444136`). O PNG transparente do `landing-tri/` foi ingerido no Shopify via `stagedUploadsCreate` + `fileCreate` (não referenciar cópia local — na convenção da LP, imagem de produto vive no Shopify CDN; o commit local não propagava no preview).
- CSS: bloco `/* order bump — réplica do card de oferta da página do Tri[Mg] */` (`.bumptri`, `.bt-qty`/`.bt-pill`, `.bt-card`, `.bt-stage`/`.bt-shelf`/`.bt-vis`/`.b1/.b2/.b3`, `.bt-badge`, `.bt-info`/`.bt-tag`/`.bt-price`/`.bt-pm`/`.bt-cash`/`.bt-save`, `.bt-add`) — adaptado do `.buy-card` do Tri com os tokens do Hair (`--indigo`=mint, `--indigo-soft`=violet, `--gold`=champ).
- Markup: `.frete` + `<div class="bumptri" id="bumptri" data-on>` (heading + `.bt-qty` pill 1/2/3 + `.bt-card` [stage com 3× `bottle-tri.png` + `#bt-badge`] [info: `#bt-tag`/`#bt-price`/`#bt-cash`/`#bt-save` + botão `#bt-add`]) no `.offer-cta`, antes do `#buy`.
- JS: `BUMPV` + `BUMPS={'1':{n,total,inst,cash,tag,save,badge},...}` (números REAIS da escada do Tri) + `btSel` (frasco selecionado), `btOn` (adicionado?), `bumpQty` (0 ou frascos). IIFE `#bumptri`: `render()` (atualiza tag/preço/cash/save/badge/leque), `pill()` (desliza sob o botão ativo), `apply()` (liga/desliga o bump → `data-on`, texto do botão, `bumpQty`, href, frete). `checkout()` anexa `,BUMPV:bumpQty`; `updateFrete()` soma `BUMPS[bumpQty].total`.

## Gotchas (bugs reais que apareceram)
- **Frasco em leque some (0×0):** o reset global `img,video{max-width:100%}` + `.bt-vis` sem largura (filhos `position:absolute` → largura 0) fazia `max-width:100%` = 0px e o frasco colapsava. Fix: `.bt-vis{width:100%}` + `.bt-vis img{max-width:none}`. **Não era problema da imagem** (local nem CDN) — era CSS. Replicar esse fix em qualquer LP que usar o leque.
- **CTA principal reage ao bump:** ao adicionar, o `#buy` vira `COMPRAR KIT + <PRODUTO> (N un)`; ao remover, volta a `COMPRAR AGORA`. Sem isso o usuário adiciona e o botão não muda → confuso.
- **Buybar (barra fixa):** na Hair ficou **só a imagem dos potes do kit** (transparente, `#bar-img` = `KITS[kit].img`, sem texto de preço/rótulo) ao lado do "Escolher meu kit" — `updateBar()` troca a imagem conforme o kit. (Variante: se quiser preço na barra, `updateBar()` pode em vez disso mostrar o **total kit+bump**.)
- **Pill do seletor "torto"/deslocado:** o `pill()` (que posiciona o destaque via `offsetLeft/offsetWidth`) pode medir **antes do layout assentar** (fontes/reveal/imagens mudam a largura depois). Fix: **`ResizeObserver` no `#bt-qty`** + `pill()` no `load` e num `requestAnimationFrame` — realinha sempre que o seletor muda de tamanho.
- **Laranjas "saindo pra lado"/por cima do seletor:** a órbita não pode invadir o resto do card. Fix: **`.bt-orbit{overflow:hidden}`** (recorta ao palco) + raio da órbita moderado (`bt.width*0.34`). A animação-assinatura fica contida no `.bt-stage`.
- **Selo circular (−5%/−10%) "sai pra lado":** `right:2px` gruda na borda direita (no mobile o palco é full-width). Fix: puxar pra dentro sobre o leque (`top:12px; right:16%`, ~46px). Fica como um sticker no produto, longe da borda e do seletor.
- **CTA com as duas quantidades:** o botão mostra `Comprar · kit <LP> N potes + <PRODUTO> M potes` (atualiza ao trocar o kit **e** o bump — função `setCTA()` chamada no `applyKit` e no `apply()`). Como fica longo e `.btn{white-space:nowrap}` é global, **libere a quebra só no CTA**: `#buy{white-space:normal;line-height:1.18;text-align:center}` (fonte um pouco menor) — quebra em 2 linhas em vez de cortar na lateral. Sem bump: `COMPRAR AGORA`.

## Testado (headless)
- Trocar frasco (sem adicionar) **pré-visualiza** tag/preço/selo (qty3 → "Menor preço · 10% OFF", R$78,75, selo −10%, "economize R$26,25") sem mexer no frete/checkout. **Adicionar** → `data-on=1`, botão "✓ Adicionado", frete kit3+3fr **"desbloqueado!"** (100%), href `...:3,48115368558824:3`. Trocar p/ 2 frascos com o bump ligado atualiza href `...:3,...:2` ao vivo. **Remover** volta pra 77%/kit3. `bottle-tri.png` carrega; leque + pill deslizante OK. Sem overflow 390px · `node --check` + tags OK.

## Export p/ as outras LPs
> "Order bump + barra de frete (`05-ORDER-BUMP.md`). O add-on pode ser **kit de quantidade do MESMO produto** (1/2/3 frascos, escolha única) aproveitando a **escada real do produto** (`[ESCADA] <produto> 5%/10%`, `automaticDiscountNodes` ATIVO → economia honesta nos kits 2/3), **ou** um cross-sell via **par BxGy real e ATIVO** (`[BUMP]`). Só exiba %/economia se houver desconto real e ativo; senão, **preço cheio real confirmado no Shopify** (sem riscar). Ponha o **parcelado em evidência** (padrão do preço da LP). Frete grátis = confirme no *delivery profile* (`TOTAL_PRICE ≥ X`), não nos `[FRETE]` (podem estar expirados) — na loja hoje é **R$349**. Cards com o **tema do produto do bump** (`.bump-<slug>`). `checkout()` anexa `,<variant>:<qtd>`; `updateFrete()` soma o total do kit escolhido; single-select — **nunca empilhar** mais de um add-on. Confirme que a escada do add-on **combina** (`combinesWith.productDiscounts:true`) com a escada do produto principal antes de mostrar os dois descontos juntos."
