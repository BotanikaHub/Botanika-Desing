# Botanika — repositório de Landing Pages

Este repositório contém as **landing pages premium da Botanika** (marca brasileira de suplementos).
Cada produto tem sua **própria pasta** e sua **própria identidade visual** — nunca clonar uma LP para outro produto.

## ⚠️ LEIA ANTES DE CRIAR OU EDITAR QUALQUER LP

Sempre que a tarefa envolver **criar ou editar uma landing page**, leia primeiro, nesta ordem:

1. **`PAGINAS.md`** — mapa de todas as LPs (pasta, link, VARIANT_ID, preço, identidade, status). Confirme com o usuário qual pasta vai mexer antes de começar.
2. **`botanika-lp-superprompt.md`** — guia de construção: design system, interações, regras de commerce, publicação.
3. **`botanika-lp-kit/`** — base de conhecimento para criação:
   - `botanika-lp-kit/prompts/` — repertório de referência (recreações getlayers e outros prompts). **Use só como inspiração de técnica** (shaders, canvas de partículas, reveals, grids em rem, springs). **NUNCA copiar** um desses direto para uma LP da Botanika — cada produto precisa de identidade própria.
   - `botanika-lp-kit/zips/` — arquivos `.zip` que o usuário deixa como base de conhecimento (assets, referências, exports). Se houver zips relevantes ao produto, descompacte/leia antes de construir.

## Referência de sites externos

Para modelar uma LP com base em outro site, use `ferramentas/baixar-site/baixar.sh`
(wget + Chromium: baixa HTML, CSS, JS, imagens, fontes, DOM renderizado e screenshots).
O resultado vai para `capturas/<host>/` — leia sempre o `RELATORIO.md` de lá primeiro.
Referência serve para **técnica e estrutura**, nunca para copiar identidade.

Referências já analisadas ficam em `botanika-lp-kit/referencias/<site>/ANALISE.md`
(hoje: `useblessy` — concorrente direto em greens/superfoods).

## Convenções fixas (não quebrar)

- **Uma pasta por produto:** `landing-<slug>/index.html` — HTML **autocontido** (CSS+JS inline, sem build).
- Deve funcionar no **Safari mobile via URL ao vivo**. `html{overflow-x:hidden}` na raiz (não só no body).
- Validar antes de commitar: `node --check` nos blocos `<script>` não-módulo + checagem de balanço de tags.
- **Branch de publicação:** `lp`. Link fixo: `https://raw.githack.com/BotanikaHub/Botanika-Desing/lp/landing-<slug>/index.html`.
- **Checkout Shopify:** `https://botanikabrasil.com.br/cart/<VARIANT_ID>:<QTD>`. Cupom `BOTANIKA` 5% OFF. Frete grátis > R$349.
- **Fonte da verdade do produto:** Shopify (variant/preço) + Google Drive (rótulo/caixa/depoimentos). Cada produto DEVE ter identidade própria (paleta/fundo/fonte/assinatura).
- **Nunca** colocar o identificador do modelo em commits, PRs ou código.

## Como o usuário edita uma LP específica (comando pra colar em chat novo)

> "Leia o `PAGINAS.md`, o `botanika-lp-superprompt.md` e a pasta `botanika-lp-kit/` no repo `botanikahub/botanika-desing`. Vou editar a LP do **[produto]**. Me confirma qual pasta/arquivo você vai mexer antes de começar."
