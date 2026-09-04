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

## Convenções fixas (não quebrar)

- **Uma pasta por produto:** `landing-<slug>/index.html` — HTML **autocontido** (CSS+JS inline, sem build).
- Deve funcionar no **Safari mobile via URL ao vivo**. `html{overflow-x:hidden}` na raiz (não só no body).
- Validar antes de commitar: `node --check` nos blocos `<script>` não-módulo + checagem de balanço de tags.
- **Branch de publicação:** `lp`. Link fixo: `https://raw.githack.com/BotanikaHub/Botanika-Desing/lp/landing-<slug>/index.html`.
- **Checkout Shopify:** `https://botanikabrasil.com.br/cart/<VARIANT_ID>:<QTD>`. Cupom `BOTANIKA` 5% OFF. Frete grátis > R$349.
- **Fonte da verdade do produto:** Shopify (variant/preço) + Google Drive (rótulo/caixa/depoimentos). Cada produto DEVE ter identidade própria (paleta/fundo/fonte/assinatura).
- **Nunca** colocar o identificador do modelo em commits, PRs ou código.

## Tarefa de tráfego: criativo antes de campanha (regra fixa)

Toda tarefa que envolva **subir campanha, subir criativo ou preparar tráfego** começa conferindo se as imagens e vídeos **já existem**. Nunca monte campanha assumindo que a arte apareceu.

**1. Procure as peças, nesta ordem:**
- anexos da tarefa que cria as artes (`clickup_get_task` com `include: ["attachments"]`)
- comentários dessa tarefa
- `clickup_search` pelo nome da campanha e por "arte", "criativo", "estático"
- pergunte ao Pedro e ao Ítalo

Tarefa marcada como **feito não significa arte entregue** — já aconteceu mais de uma vez de a tarefa fechar com o checklist pedindo anexo e ficar sem nenhum.

**2. Se as peças não existirem, PARE.** Não monte a campanha, não improvise criativo genérico, não reaproveite arte de outra ação só trocando o link. A tarefa vira duas etapas, nesta ordem:
1. criar as imagens (e vídeos, quando houver)
2. só então criar a campanha

Reporte o bloqueio em vez de entregar campanha pela metade.

**3. Se existirem, confira o formato antes de subir.** O gerenciador do Meta recusa **`.webp`** em anúncio de imagem — converta para JPG ou PNG, uma vez só, direto do original. As artes do Ítalo costumam vir em webp. Para o site (tema Shopify) o webp serve normalmente.

**4. Confira também se as peças cobrem os ângulos do briefing.** Vieram 5 quando o briefing pedia 4? Diga qual é o quinto. Faltou um ângulo? Isso é lacuna, não sobra.

## Como o usuário edita uma LP específica (comando pra colar em chat novo)

> "Leia o `PAGINAS.md`, o `botanika-lp-superprompt.md` e a pasta `botanika-lp-kit/` no repo `botanikahub/botanika-desing`. Vou editar a LP do **[produto]**. Me confirma qual pasta/arquivo você vai mexer antes de começar."
