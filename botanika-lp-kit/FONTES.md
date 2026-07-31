# FONTES — onde mora a matéria-prima (Google Drive)

> **A ponte entre o "cofre" (Drive) e o "kit" (este repo).** Toda sessão lê este arquivo
> automaticamente (via `CLAUDE.md`). Diz **onde** buscar referências e **como cada fonte funciona**.

## Princípio
- **Drive = matéria-prima** (prompts, zips, vídeos de fundo). Pesado, fica fora do git.
- **Kit (este repo) = técnica destilada** (`.md` pequenos que a sessão lê sempre).
- Só dá pra ler o Drive numa sessão **com o conector Google Drive ligado**. Sem ele, a sessão ainda
  funciona 100% com o que já está destilado em `botanika-lp-kit/prompts/`.
- **Regra de ouro:** tudo aqui é **inspiração de técnica** — nunca clonar/copiar 1:1 numa LP Botanika.

## Estrutura real no Google Drive
Organizada **por site de origem**, e dentro de cada um pelos **filtros/categorias do próprio site**.
Pasta-mãe **`Botanika/LP-KIT/`** — https://drive.google.com/drive/folders/1uIdhNeu4bNdQAY6GSsbpJgk1dfYyKyni

### 01_getlayers — biblioteca de página inteira (prompt + zip de assets)
`1iB0B2p8E2nDD60E5A83bo66ZUy9TPXbq`
| Sub | Conteúdo | ID |
|-----|----------|----|
| `Zips/` | pacotes de assets das LPs (GLB, vídeo, texturas) | `1BH_cYtR3-Lgubr4KGZxAVdlQrVM6_bF4` |
| `Zips/Backgrounds/` | fundos | `1uYepEFkCq9Uca6acfEBPP3OD6Oc8gbht` |
| `Prompts/` | prompts de página inteira | `1ILyzW3bituM-y6eBt1XYA4YFYepx-6Nd` |
| `Prompts/3D Scenes/` | cenas 3D (Three.js) | `1iTy2a8uuCzKSIVzXhK9EnOHQ9QIBo40S` |
| `Prompts/Templates/` | templates de página | `18JSHPwFKAAi9yoaR5NlLrWrji7qmgccR` |

### 02_meez.design — biblioteca por peça (prompt + vídeo + embed)
`1Pz35rOyGg7XarciyXXb8uVGsFFSJNu6M`
| Sub | Conteúdo | ID |
|-----|----------|----|
| `Backgrounds/` | por fundo: **prompt** (Doc) + **vídeo `.mp4`** + **embed** (Doc `embed_*`) | `1d8agyKGvyv1VUbqpFB3wn-XocUpnL4UA` |
| `Sections/` | prompts de **seção** (montar página por blocos) | `17jalZq2yOyZ1AL71izxmohcGshJqtlju` |
| `WebSites/` | sites completos | `1Quvh9EpUgH2ErhrZia0LvNuL28qGeQpJ` |
| `WebSites/Prompts/` | prompts de site inteiro | `1yfJRSR205g-tWCy1NWnMyMVZM-M-6_6K` |

> **Como usar cada fonte ao construir uma LP:**
> - **getlayers** → repertório de *página inteira* e de *cenas 3D*. Inspiração de motor/efeito.
> - **meez.design/Backgrounds** → cada fundo tem prompt + `.mp4` + snippet `<video autoplay muted loop…>`.
>   O vídeo pode virar a **assinatura de fundo** de uma LP (recriar/reinterpretar na paleta do produto).
> - **meez.design/Sections** → blocos de seção pra compor a página (hero, pricing, etc.).
>
> ⚠️ **Licenciamento:** os prompts do meez.design apontam para mídia hospedada em
> `https://meez.design/web/media/...` (webp/mp4). Antes de usar **a mídia deles** (ou o CDN) numa LP
> comercial da Botanika, confirmar se a licença permite. A **técnica** é sempre livre pra recriar;
> a **mídia/CDN de terceiros** não necessariamente. Na dúvida, recriar o fundo com asset próprio.

## Índice de destilação (preencher ao processar)
> Formato: fonte · categoria · arquivo → o que é → técnica → destilado em `prompts/NN-*.md`?

| Fonte | Categoria | Arquivo | O que é | Técnica | Destilado? |
|-------|-----------|---------|---------|---------|------------|
| _(a preencher conforme eu catalogar os lotes)_ | | | | | |

## Assets de produto Botanika
As pastas de assets por produto (pote transparente, depoimentos) **não existem mais** nesta árvore —
foram removidas na reorganização. Quando formos construir uma LP, o asset do produto vai **direto para
`landing-<slug>/` no GitHub** (a LP é autocontida e servida ao vivo). Se preferir uma área de staging
no Drive pra eles, é só pedir que eu crio.

## Como acionar numa sessão nova
Catalogar/destilar:
> "Leia `CLAUDE.md` e `botanika-lp-kit/FONTES.md`. Abre o `02_meez.design/Sections` (ou o lote que eu
> apontar) no Drive, cataloga no índice e destila só a técnica nova pra `botanika-lp-kit/prompts/`."

Construir/editar LP:
> "Vou criar a LP do **[produto]**. Usa o repertório em `botanika-lp-kit/` (e, se aplicável, os fundos
> do `02_meez.design/Backgrounds`). Identidade própria, não clonar."
