# FONTES — onde mora a matéria-prima (Google Drive)

> **A ponte entre o "cofre" (Drive) e o "kit" (este repo).** Toda sessão lê este arquivo
> automaticamente (via `CLAUDE.md`). Ele diz **onde** buscar referências brutas e **o que já foi
> destilado** para dentro de `botanika-lp-kit/prompts/`.

## Princípio
- **Drive = matéria-prima** (zips do getlayers, PDFs, assets brutos). Pesado, fica fora do git.
- **Kit (este repo) = técnica destilada** (arquivos `.md` pequenos que a sessão lê sempre).
- Fluxo: usuário joga arquivos no Drive → numa sessão **com o conector Google Drive ligado**, a
  sessão abre, **destila a técnica** para `prompts/NN-nome.md` e marca abaixo como ✅.
- Sem o conector do Drive ligado, a sessão ainda funciona 100% com o que já está destilado no kit.

## Estrutura no Google Drive
Pasta-mãe **`Botanika/LP-KIT/`** — https://drive.google.com/drive/folders/1uIdhNeu4bNdQAY6GSsbpJgk1dfYyKyni

| Pasta | Para quê | ID / link |
|-------|----------|-----------|
| `01_getlayers-zips/` | zips brutos do getlayers (LPs sem prompt) | `1iB0B2p8E2nDD60E5A83bo66ZUy9TPXbq` · [abrir](https://drive.google.com/drive/folders/1iB0B2p8E2nDD60E5A83bo66ZUy9TPXbq) |
| `02_referencias/` | PDFs, prints, inspirações soltas | `1X-L-nLsqZ4_3YZTiQVMcIQ1UH7lSUs_d` · [abrir](https://drive.google.com/drive/folders/1X-L-nLsqZ4_3YZTiQVMcIQ1UH7lSUs_d) |
| `03_assets-produtos/` | assets da Botanika por produto | `1x6QCPwF5xwl0AH2jJ76lLM1upkzWNkN-` · [abrir](https://drive.google.com/drive/folders/1x6QCPwF5xwl0AH2jJ76lLM1upkzWNkN-) |
| `03_assets-produtos/hair/` | pote transparente, rótulo, depoimentos do Hair | `1ltTfVb90c0W_dFB8i7_qDeTxkHUqGJCi` |
| `03_assets-produtos/omega/` | assets do Ômega | `1xdmJlWRE1x7oUwgW07wprbOii76LZ06n` |
| `03_assets-produtos/tri/` | assets do Tri | `1GC9WMa6xqvNqoR3TXknoIJXwZmwMeFe3` |

> Assets de produto (ex.: **PNG transparente do pote**) ficam em `03_assets-produtos/<produto>/` como
> staging. Na hora de construir a LP, a sessão move a imagem para `landing-<slug>/` no GitHub (a LP é
> autocontida e servida ao vivo).

## Índice de zips getlayers (preencher ao destilar)
> Formato: `arquivo.zip` → o que é → técnica nova? → destilado em `prompts/NN-*.md`?

| Zip (nome no Drive) | O que é (LP) | Técnica | Destilado? |
|---------------------|--------------|---------|------------|
| _(aguardando 1º lote em `01_getlayers-zips/`)_ | — | — | — |

## Como acionar numa sessão nova
> "Leia o `CLAUDE.md` e `botanika-lp-kit/FONTES.md`. Tem zips novos em `01_getlayers-zips/` no Drive —
> abre, cataloga no índice e destila só a técnica nova pra `botanika-lp-kit/prompts/`."

E para construir/editar uma LP:
> "Vou criar a LP do **[produto]**. Usa os assets em `03_assets-produtos/[produto]/` (Drive) e o
> repertório em `botanika-lp-kit/`. Identidade própria, não clonar."
