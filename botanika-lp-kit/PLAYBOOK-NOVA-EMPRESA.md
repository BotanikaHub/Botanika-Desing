# Playbook portátil — montar o "LP Kit" para uma nova empresa

> Cole o bloco **SUPERPROMPT** abaixo num chat novo do Claude Code, **dentro do repositório da nova
> empresa** (ex.: VermeFree). A sessão vai recriar a mesma estrutura que a Botanika tem: base de
> conhecimento no repo + estrutura no Google Drive + `CLAUDE.md` que carrega tudo sozinho.
>
> Antes de colar, troque os campos `[PREENCHER]`.

---

## ▼▼▼ SUPERPROMPT (copie deste "SUPERPROMPT — INÍCIO" até o "SUPERPROMPT — FIM") ▼▼▼

**SUPERPROMPT — INÍCIO**

Você vai montar, neste repositório, uma **base de conhecimento para criar landing pages (LPs)** da
empresa, igual ao sistema que já existe na Botanika. Siga exatamente os passos abaixo. Não construa
nenhuma LP agora — só monte a fundação.

### Contexto da empresa (preencha e use como verdade)
- **Empresa / marca:** `[PREENCHER: ex. VermeFree]`
- **Repositório GitHub:** `[PREENCHER: owner/repo]`
- **Loja (checkout):** `[PREENCHER: ex. https://loja.com.br]` · cupom `[PREENCHER]` · frete grátis acima de `[PREENCHER]`
- **Branch de publicação:** `[PREENCHER: ex. lp]` · link ao vivo via raw.githack:
  `https://raw.githack.com/[owner]/[repo]/[branch]/landing-<slug>/index.html`
- **Fonte da verdade do produto:** Shopify/loja (variant/preço) + Google Drive (rótulo/caixa/depoimentos).
- **Tom de voz / regras de conteúdo:** `[PREENCHER: como a marca fala + o que pode/não pode dizer,
  regras de compliance ANVISA se for suplemento/saúde]`

### Convenções fixas (não quebrar)
- **Uma pasta por produto:** `landing-<slug>/index.html` — HTML **autocontido** (CSS+JS inline, sem build).
- Deve funcionar no **Safari mobile via URL ao vivo**. `html{overflow-x:hidden}` na raiz.
- **Cada produto tem identidade própria** (paleta, fundo, fonte, assinatura). **NUNCA clonar** uma LP
  para outro produto, nem copiar código de referência 1:1.
- Validar antes de commitar: `node --check` nos blocos `<script>` não-módulo + checagem de balanço de tags.
- **Nunca** colocar o identificador do modelo de IA em commits, PRs ou código.
- Checkout: `[loja]/cart/<VARIANT_ID>:<QTD>`.

### Passo 1 — Criar `CLAUDE.md` na raiz do repositório
Conteúdo (ajuste os nomes da marca):
```md
# [EMPRESA] — repositório de Landing Pages

Landing pages premium da [EMPRESA]. Cada produto tem sua própria pasta e identidade visual — nunca clonar.

## LEIA ANTES DE CRIAR OU EDITAR QUALQUER LP
1. `PAGINAS.md` — mapa das LPs (pasta, link, VARIANT_ID, preço, identidade, status).
2. `[empresa]-lp-superprompt.md` — design system + regras.
3. `[empresa]-lp-kit/` — base de conhecimento:
   - `prompts/` — repertório de técnica (inspiração; NUNCA copiar direto).
   - `zips/` e `FONTES.md` — matéria-prima (Drive) + índice.

## Convenções fixas
(as mesmas listadas acima)

## Comando pra editar uma LP (colar em chat novo)
> "Leia o `CLAUDE.md`, o `PAGINAS.md`, o `[empresa]-lp-superprompt.md` e a pasta `[empresa]-lp-kit/`.
> Vou criar/editar a LP do [produto]. Me confirma a pasta e a identidade própria antes de começar."
```

### Passo 2 — Criar a pasta-kit `[empresa]-lp-kit/`
Estrutura:
```
[empresa]-lp-kit/
├── README.md          (como o kit funciona)
├── COMO-USAR.md       (fluxo + o que subir vs não subir + limites do GitHub)
├── FONTES.md          (ponte pro Google Drive: IDs das pastas + índice de destilação)
├── prompts/
│   └── 00-INDEX.md    (catálogo de técnicas reutilizáveis)
└── zips/
    └── README.md      (onde vão assets em arquivo)
```
No `COMO-USAR.md` deixe claro: **subir só o pequeno e essencial** (foto do produto transparente,
depoimentos, logo — <25MB, vão direto pelo site do GitHub). **NÃO** subir pacotes pesados (>25MB o
GitHub web recusa) — usar Drive/Release para bruto.

### Passo 3 — Estrutura no Google Drive (peça o conector Google Drive ligado)
Dentro da pasta raiz da empresa no Drive, criar:
```
[EMPRESA]/LP-KIT/
├── 01_referencias-zips/   (zips/pacotes de referência — bruto)
├── 02_referencias/        (PDFs, prints, inspirações)
└── 03_assets-produtos/    (assets da marca por produto: <produto1>/, <produto2>/ ...)
```
Registrar os **IDs e links** dessas pastas no `[empresa]-lp-kit/FONTES.md`, com um índice
"cada arquivo → o que é → já destilado? (sim/não)". Princípio: **Drive = matéria-prima; kit = técnica
destilada** (o que a sessão lê sempre). Só destilar em sessão com o conector do Drive ligado.

### Passo 4 — Criar `PAGINAS.md` e `[empresa]-lp-superprompt.md`
- `PAGINAS.md`: mapa das LPs. Modelo por produto: Pasta · Link · Shopify(handle/VARIANT_ID) · Preço/kits
  · Identidade(paleta/fundo/assinatura/fonte — própria) · Status.
- `[empresa]-lp-superprompt.md`: o design system e as regras de construção/commerce/publicação
  (tokens de cor, tipografia, componentes, interações padrão, regras de checkout, como validar e publicar).

### Passo 5 — Fiação na branch padrão
Coloque `CLAUDE.md` + `[empresa]-lp-kit/` + `PAGINAS.md` + `[empresa]-lp-superprompt.md` na **branch
padrão** do repositório (via PR), para que toda sessão nova os carregue automaticamente.

### Repertório de técnica que já dominamos (reusar como inspiração, nunca copiar)
Motores prontos, aprendidos de LPs de referência (getlayers) e das LPs Botanika:
- **Grid rem adaptativo:** root font-size por `vw` em media-queries + JS que escala acima de 1920px. Tudo em `rem`.
- **Spring helper JS puro:** `v += (-tension*(x-target) - friction*v)*dt; x += v*dt`. Substitui react-spring.
- **Reveals com clip-mask:** palavra/linha em `overflow:hidden`, inner `translateY(115%→0)`+opacity (+blur pra "blur-up"), com stagger; dispara 1x no viewport (IntersectionObserver).
- **Loader com contador** 000→100 (easeInOutCubic) + cortina que sobe.
- **Assinatura em canvas próprio:** campo de partículas/fios/ondas reagindo ao mouse (recriar do zero, tingido na paleta do produto — inspirado em "Flow Wave"/"Storm"/"Cosmic Dust" do getlayers).
- **Hero "liquid reveal":** before/after com pincel no canvas seguindo o cursor.
- **3D:** Google `<model-viewer>` inclinando p/ o cursor + partículas repelidas pelo ponteiro (só se houver GLB do produto).
- **Pipeline Three.js procedural:** 3 EffectComposer (torus/bloom/final) por layer + FinalPass (bg + corner flames) + simplex noise + motes presos à câmera + scroll double-damped.
- **Commerce/UX:** toggle de kit com painel dinâmico, count-up de números, botões magnéticos (gsap.quickTo), tilt+glow em cards, barra de compra fixa no mobile.
- **Fluxo mobile:** `overflow-x:hidden` no `html` (não só body); imagens `max-width:100%`.

### Fluxo de criação de uma LP (do briefing ao publish)
1. Ler `PAGINAS.md` + kit + assets do produto (Drive `03_assets-produtos/<produto>/`).
2. Confirmar com o usuário: pasta `landing-<slug>/` + identidade própria (paleta/fundo/fonte/assinatura).
3. Puxar verdade do produto (loja: variant/preço; Drive: rótulo/depoimentos).
4. Construir `landing-<slug>/index.html` autocontido, com assinatura única.
5. Validar (`node --check` + balanço de tags), commitar, publicar na branch de publicação.
6. Atualizar `PAGINAS.md`.

Comece executando os Passos 1 a 5 (só a fundação). Ao terminar, me mostre a estrutura criada e o
comando de acionamento para eu usar nos próximos chats.

**SUPERPROMPT — FIM**

---

## Observações pra você (fora do superprompt)
- **Ajuste o tom/compliance da VermeFree.** Produto de desparasitação toca em alegação de saúde —
  defina no superprompt o que a marca pode/não pode afirmar (evitar "cura/trata/elimina doença" se
  seguir padrão ANVISA; usar "auxilia/contribui"). Isso protege a marca.
- **O repo da VermeFree é outro** — por isso este superprompt roda lá (não aqui). Os prompts de técnica
  do getlayers são os mesmos; se quiser, copie os arquivos `[empresa]-lp-kit/prompts/*.md` da Botanika
  como ponto de partida (é técnica genérica, reutilizável).
- **A parte do Drive** eu consigo criar pra você mesmo daqui (o Drive é o mesmo), se me disser onde fica
  a pasta raiz da VermeFree no Drive.
