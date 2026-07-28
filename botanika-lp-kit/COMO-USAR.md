# Como usar o kit para criar/editar LPs (guia definitivo)

## TL;DR — o fluxo que você quer
1. Abra um **chat novo** no repositório `botanikahub/botanika-desing`.
2. Cole o **comando de acionamento** (abaixo) dizendo qual LP quer criar/editar.
3. Deixe os **assets pequenos da Botanika** (foto do pote transparente, depoimentos) no repo — o resto a sessão constrói.

### Comando de acionamento (copia e cola no chat novo)
> **Leia o `CLAUDE.md`, o `PAGINAS.md`, o `botanika-lp-superprompt.md` e a pasta `botanika-lp-kit/` (prompts + zips). Vou [criar / editar] a LP do [PRODUTO]. Antes de começar, me confirme a pasta/arquivo e a identidade visual que vai usar (própria, não clonar outra LP).**

Se o `CLAUDE.md` já estiver na branch padrão (ver seção "Fiação"), você nem precisa colar tudo isso —
basta: *"Vou criar a LP do [PRODUTO]"* — a sessão lê o kit sozinha.

---

## O que você PRECISA subir vs. o que NÃO precisa

### ✅ Sobe (pequeno, essencial)
- **PNG transparente do pote** do produto → em `landing-<slug>/` ou num zip em `botanika-lp-kit/zips/`.
  É isso que evita o "pote inventado".
- **Fotos de depoimento / prova social** (JPG/PNG pequenos) → `landing-<slug>/proof/`.
- **Logo/rótulo oficial** se quiser usar de detalhe.
- **Prompts novos** que você achar → `botanika-lp-kit/prompts/NN-nome.md` (texto, KB).

> Todos esses ficam **muito abaixo de 25MB** e sobem direto pelo site do GitHub (botão "Add file → Upload files").

### 🚫 NÃO precisa subir (grande, dispensável)
- **Pacotes de asset do getlayers** (`.glb`, `.mp4`, texturas — muitos >30MB).
  São assets dos **sites de referência**, usados só pra recriar aqueles sites idênticos.
  As LPs da Botanika têm **identidade própria** e **não usam** esses arquivos.
- Qualquer vídeo/modelo 3D pesado que não seja da Botanika.

### ⚠️ Limites do GitHub (por que os grandes dão trabalho)
- **Upload pelo navegador:** máx. **25 MB por arquivo**. Acima disso, o site recusa.
- **Limite duro:** 100 MB/arquivo (bloqueado); aviso a partir de 50 MB.
- Arquivos entre 25–100 MB só sobem por **Git LFS** ou **linha de comando** — não vale a pena pra construir LP.
- **Se algum dia precisar mesmo de um vídeo/3D pesado numa LP:** hospede fora (ex.: um bucket/CDN) e
  referencie por URL no HTML — não jogue no git.

---

## Onde cada coisa mora
```
botanika-lp-kit/
├── prompts/      ← repertório de técnica (texto). Adicione novos aqui.
├── zips/         ← assets/bases em arquivo da Botanika (pequenos).
├── COMO-USAR.md  ← este guia
└── README.md
landing-<slug>/   ← a LP em si (index.html autocontido) + imagens do produto
PAGINAS.md        ← mapa das LPs (link, variant, preço, status)
botanika-lp-superprompt.md ← design system + regras
CLAUDE.md         ← faz toda sessão ler tudo isso automaticamente
```

## Regra de ouro
Os prompts em `prompts/` são **inspiração de técnica** — nunca copiar direto. Cada produto = paleta,
fundo, fonte e assinatura próprios. A "verdade" do produto vem da Shopify (variant/preço) + Drive
(rótulo/caixa/depoimentos) + os assets que você subir aqui.
