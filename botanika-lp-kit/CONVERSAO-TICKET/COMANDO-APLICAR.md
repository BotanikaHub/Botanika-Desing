# COMANDO — Aplicar "Conversão & Ticket" numa LP (playbook genérico)

> **Régua:** `landing-hair/index.html` (tudo abaixo já está implementado e testado lá).
> **O que este pacote faz numa LP:** captura de lead (popup→ActiveCampaign), seleção invertida de kit, seção de imagens de benefício, e **order bump premium** com a identidade da LP do produto ofertado (inclusive a animação-assinatura) + barra de frete grátis.
> **Detalhe de cada mudança:** `01-ACTIVECAMPAIGN.md` · `02-POPUP-HAIR.md` · `03-SELECAO-INVERTIDA.md` · `04-IMAGENS.md` · `05-ORDER-BUMP.md`.

---

## 0. Comando pra colar num chat novo (por LP)

> "Leia `PAGINAS.md`, `botanika-lp-superprompt.md` e a pasta `botanika-lp-kit/CONVERSAO-TICKET/` (comece pelo `COMANDO-APLICAR.md`) no repo `botanikahub/botanika-desing`. Vou aplicar o pacote **Conversão & Ticket** na LP do **[produto]** (`landing-<slug>`). Use a `landing-hair` como referência. **Antes de escrever qualquer preço/%**, confirme no Shopify os descontos reais e ATIVOS (`automaticDiscountNodes`) e o frete grátis (delivery profile). Me mande **preview** (branch de trabalho + raw.githack por SHA) e **só publique na `lp` depois do meu OK**."

---

## 1. Regras de ouro (não quebrar)

- **Preço é sagrado.** Nenhum número/% sem desconto **real e ATIVO** no Shopify. Não existir → não aparece. Pare e alinhe.
- **PDP = checkout.** O que a LP mostra tem que bater com o que o carrinho cobra. Descontos que aparecem juntos precisam **combinar** (`combinesWith.productDiscounts:true`).
- **Compliance Botanika (suplemento):** auxilia/contribui/apoia; nunca curar/tratar/diagnosticar. O "diagnóstico" do popup é **"qual seu foco/objetivo"**, nunca "você tem X".
- **Mobile-first.** Validar sempre: `node --check` nos `<script>` não-módulo + **balanço de tags** + **zero overflow em 390px** + `html{overflow-x:hidden}`.
- **Imagem de produto** vive no **Shopify CDN** (nunca cloudfront temporário; nunca só um PNG local que pode não propagar). Reaproveite a imagem que a LP de origem já usa quando possível.
- **Preview = branch de trabalho + raw.githack por SHA.** Publicar = push na `lp` (Cloudflare Pages faz o deploy). **Só publicar após OK.**
- **Nunca** colocar identificador de modelo em commit/PR/código.

---

## 2. Antes de tocar na LP — confirmar os dados reais (Shopify)

Rode e anote (substitua os GIDs/variants do produto da vez — mapa na seção 8):

```graphql
# preço do pote/frasco
query { productVariant(id:"gid://shopify/ProductVariant/<VARIANT>"){ price product{ id title } } }

# descontos automáticos: quais ESCADA/BUMP estão ATIVOS e se COMBINAM
query { automaticDiscountNodes(first:60){ nodes{ automaticDiscount{
  ... on DiscountAutomaticBasic { title status combinesWith{ productDiscounts } }
  ... on DiscountAutomaticBxgy  { title status startsAt endsAt } } } } }

# frete grátis REAL (não confie nos [FRETE]; eles podem estar expirados)
query { deliveryProfiles(first:5){ nodes{ profileLocationGroups{ locationGroupZones(first:20){ nodes{
  methodDefinitions(first:20){ nodes{ name active
    methodConditions{ field operator conditionCriteria{ ... on MoneyV2{ amount currencyCode } } } } } } } } } } }
```

Hoje (confirmado): **frete grátis = R$ 349** (regra do delivery profile `TOTAL_PRICE ≥ 349`, não é desconto). Escadas por produto **5% em 2un / 10% em 3un** ATIVAS e todas `combinesWith.productDiscounts:true`.

---

## 3. As 5 mudanças

### 3.1 ActiveCampaign (genérica — já serve todas)
- A função `functions/api/lead.js` (Cloudflare Pages Function, rota `/api/lead`) já existe e é única pra todas as LPs. A LP só precisa do form do popup e do `POST /api/lead {email, produto:'<slug>', angulo}`.
- Variáveis no Cloudflare Pages (uma vez, serve todas): `AC_API_URL`, `AC_API_KEY` (encriptadas). Ver `01-ACTIVECAMPAIGN.md`. Lead entra na Lista 7 + tags `lp_popup_lead`, `lp_<slug>`, `produto_*`, `dor_<angulo>`.

### 3.2 Pop-up de diagnóstico (por página)
- 3 "focos" da categoria → e-mail → cupom `BOTANIKA` (5%) no fim. Trigger ~4s **ou** scroll >35%. `localStorage lp_popup_done`. Copy ANVISA-safe ("qual seu foco", nunca "você tem X"). Ver `02-POPUP-HAIR.md`.

### 3.3 Seleção invertida 3→2→1 + barra que regride (por página)
- Inverta o `.toggle` pra 3→2→1 (maior pré-selecionado), `.kit-bar` com `bar`/`barmsg` no `KITS`, `applyKit` seta a barra. Preços/economia = **escada real da SUA LP**. Só inverta se houver desconto de volume real. Ver `03-SELECAO-INVERTIDA.md`.
- ⚠️ É a única mudança que **pode piorar** conversão (afasta quem quer 1). Acompanhar ticket **e** conversão juntos.

### 3.4 Imagens de benefício/objeção (por página)
- Seção `#resultados` (cards 4:5, `.bcards/.bcard`). Gere no Higgsfield (`soul_2`, 4:5, editorial, sem rótulo), **ingira no Shopify** (`fileCreate`) e use URLs `cdn.shopify.com`. Copy ANVISA-safe. Ver `04-IMAGENS.md`.

### 3.5 Order bump + barra de frete grátis (por página) — **o mais elaborado**
Ver seção 4 abaixo (é o coração do pacote).

---

## 4. Order bump — sistema reutilizável (o que fizemos na Hair)

**Conceito:** o card do bump **veste a identidade da LP do produto ofertado** — cores, tipografia e **a animação-assinatura** daquela LP. Na Hair o bump é a **Super Vitamina C** (laranja + laranjas orbitando). Antes foi o Tri[Mg] (índigo + menta) — guardado na branch `bump-tri-magnesio` como backup.

**Estrutura (classes `bt-*`, base copiada do `.buy-card` do `landing-tri`):**
- `.bumptri` (contêiner, `data-on="0|1"`) + modificador de tema `.bump-<slug>` (ex.: `.bump-vitc` = laranja) que redefine **gradiente, número do preço, selo, botão, borda ativa**.
- Seletor `.bt-qty` (pill deslizante, 1/2/3 un) — pode ter **sub-rótulos** (`preço cheio` / `−5% · popular` / `−10% · melhor valor`).
- Palco `.bt-stage` → `.bt-vis[data-n]` com **leque de potes** (3 `<img>` transparentes) + `.bt-badge` (selo circular −5%/−10%) + `.bt-orbit`/`.bt-orb` (animação).
- Info `.bt-info`: `.bt-tag`, `.bt-price` (`3× de R$ X`, número na cor do produto) + `.bt-pm`, `.bt-cash` (`ou R$ Y à vista`), `.bt-save` (`economize R$ Z`, cheio riscado) e botão `.bt-add` ("Adicionar ao meu pedido").

**JS:** `BUMPV` (variante) + `BUMPS={'1':{n,total,inst,cash,tag,save,badge},'2':…,'3':…}` (números **reais da escada**), `btSel`/`btOn`/`bumpQty`. IIFE faz `render()` (preço/selo/leque), `pill()` (desliza sob o ativo), `apply()` (liga/desliga → `data-on`, texto do `.bt-add`, `bumpQty`, href, frete **e o CTA principal**). Trocar quantidade pré-visualiza; adicionar aplica.

**Barra de frete grátis:** `updateFrete()` soma `KITS[kit].now + BUMPS[bumpQty].total` e compara com **R$ 349**; enche a barra e mostra "Faltam R$ X" → "🎉 Frete grátis desbloqueado!". Escolha o produto/quantidade do bump de modo que o **melhor kit + bump cruze R$ 349** (gancho do frete).

**CTA principal reage:** ao adicionar, `#buy` vira `COMPRAR KIT + <PRODUTO> (N un)`; ao remover, volta a `COMPRAR AGORA`. Sem isso, o usuário adiciona e nada muda → confuso.

**Checkout multi-item:** `#buy` → `/cart/<VARIANT_KIT>:<kit>,<VARIANT_BUMP>:<un>`. Kit 1 mantém `?discount=BOTANIKA`. As escadas (do kit e do bump) são **automáticas** e **combinam** — aplicam sozinhas, sem code, sem cancelar uma à outra.

**Desconto do bump — na ordem de preferência:**
1. **Escada real do próprio produto do bump** (`[ESCADA] <produto> 5%/10%`, ATIVA) → mostra economia honesta nos kits 2/3. (Foi o que usamos na Vit C e no Tri.)
2. **Par BxGy `[BUMP]` real e ATIVO** da loja, se existir e casar com o produto principal.
3. Não havendo desconto real → **preço cheio real** (sem inventar %).
> Só crie/ative um BxGy novo no Shopify com **OK do dono** (é write). Se criar e depois trocar o produto do bump, **desative o órfão** (`discountAutomaticDeactivate`).

**Animação-assinatura:** porte a animação da LP de origem, **localizada no card** (não no fundo da página inteira). Ex.: Vit C = laranjas orbitando (`.bt-orbit`/`.bt-orb` + IIFE de órbita adaptado pra `.bt-stage`/`.bt-vis`, com repulsão do mouse e profundidade). Respeite `prefers-reduced-motion`.

---

## 5. Hospedar a imagem do bump no Shopify CDN (quando precisar de um pote transparente novo)

```
1) stagedUploadsCreate(input:[{resource:FILE, filename, mimeType:"image/png", httpMethod:POST}])
2) POST multipart no target retornado (params antes, campo "file" por último) → HTTP 201
3) fileCreate(files:[{originalSource:<resourceUrl>, contentType:IMAGE, alt:"..."}])
4) poll node(id) até fileStatus READY → use image.url (cdn.shopify.com)
```
Prefira **reaproveitar** a imagem que a LP de origem já usa (ex.: a Vit C já tinha um pote transparente no CDN — reusamos a URL, sem upload).

---

## 6. Gotchas reais (já mordemos)

- **Pote em leque some (0×0):** reset global `img{max-width:100%}` + `.bt-vis` sem largura (filhos `position:absolute` → largura 0) faz `max-width:100%`=0 e colapsa o pote. Fix: **`.bt-vis{width:100%}` + `.bt-vis img{max-width:none}`**. (Não é a imagem — é CSS.)
- **`git rm`/asset local não propaga no preview** → hospede no Shopify CDN.
- **Não confie nos `[FRETE]` automáticos** (podem estar expirados e com valor antigo) — o frete real está no **delivery profile**.
- **Higgsfield** gera URL cloudfront **temporária** → sempre reingira no Shopify (`fileCreate`).
- **Pill do seletor "torto":** `pill()` mede `offsetLeft/offsetWidth` que mudam quando o layout assenta tarde (fontes/reveal/imagens). Fix: `ResizeObserver` no seletor + `pill()` no `load`/`rAF`.
- **Animação-assinatura escapando pro resto do card:** contenha com `overflow:hidden` na camada da animação (`.bt-orbit`) e raio moderado.
- **CTA e buybar têm que reagir ao bump** (`COMPRAR KIT + <PRODUTO>` e total kit+bump na barra fixa) — senão o usuário adiciona e nada muda visualmente.
- Ao rodar teste headless, **não use `pkill -f "http.server"`** no mesmo comando: o padrão casa a própria linha do shell e mata o processo (SIGTERM/exit 144). Mate por **PID** (`SRV=$!; kill $SRV`).

---

## 7. Validar → preview → publicar

```bash
# 1) node --check em cada <script> não-módulo + balanço de tags + overflow 390 (headless)
# 2) commit na branch de trabalho da LP → git push -u origin <branch>
# 3) preview: https://raw.githack.com/BotanikaHub/Botanika-Desing/<SHA>/landing-<slug>/index.html
# 4) SÓ após OK → publicar na lp:  git push origin <SHA>:lp   (é fast-forward; Cloudflare Pages faz o deploy)
# link vivo: https://raw.githack.com/BotanikaHub/Botanika-Desing/lp/landing-<slug>/index.html  |  ofertas.botanikabrasil.com.br/<slug>
```
Quer preservar uma variação (ex.: outro produto no bump)? Salve numa **branch dedicada** (ex.: `bump-<produto>`) — não se perde e dá pra restaurar depois.

---

## 8. Dados reais por LP (slug → produto → VARIANT → tag AC)

| slug | produto | VARIANT_ID | tag AC | escada ativa |
|------|---------|------------|--------|--------------|
| hair | Hair Botanika | 48650670670056 | `produto_hair_botanika` | 5%/10% ✅ |
| omega3 | Super Ômega 3 + CoQ10 | 48115368034536 | `produto_super_omega3_coq10` | 5%/10% ✅ |
| trimagnesio | Tri[Mg] Complex | 48115368558824 | `produto_trimg_complex` | 5%/10% ✅ |
| sleep | Sleep Inositol | 48115368853736 | `produto_sleep_inositol` | 5%/10% ✅ |
| vitaminac | Super Vitamina C | 48115368460520 | `produto_super_vitamina_c` | 5%/10% ✅ |
| tetravit | TetraVit D | 48115367936232 | `produto_tetravit_d` | 5%/10% ✅ |
| creatina | Creatina + Taurato | 48115368820968 | `produto_creatina_magnesio_taurato` | 5%/10% ✅ |
| whey | Whey Balance Chocolate | 48115368919272 | `produto_whey_balance_chocolate` | 5%/10% ✅ |

GIDs de produto confirmados: Hair `9525143896296` · Tri[Mg] `9347154968808` · Super Vitamina C `9347154870504`. (Os demais: pegue via `productVariant(id){product{id}}`.) Cupom do popup: `BOTANIKA` (5%). Frete grátis: **R$ 349** (delivery profile). Pixel `828186133708463` + GA4 `G-2JFV5TGHCV` (funil PageView→…→Purchase).

---

## 9. Checklist por LP

- [ ] Confirmei preço + escada ATIVA + `combinesWith` + frete R$349 no Shopify.
- [ ] Popup (3 focos ANVISA-safe) → `/api/lead` com `produto:'<slug>'`.
- [ ] Seleção invertida 3→2→1 + barra, com economia da escada real.
- [ ] Seção `#resultados` (imagens Higgsfield → Shopify CDN).
- [ ] Order bump premium com a identidade da LP do produto ofertado + animação-assinatura + barra de frete + CTA que reage.
- [ ] Imagem do bump no Shopify CDN; `.bt-vis` com o fix do `max-width`.
- [ ] `node --check` + tags + overflow 390 OK.
- [ ] Preview enviado (SHA). Publicado na `lp` só após OK.
- [ ] Se criei BxGy e troquei o produto do bump → desativei o órfão.
