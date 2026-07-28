# Botanika LP Kit — base de conhecimento para criar landing pages

Este kit é lido **automaticamente** em toda sessão (via `CLAUDE.md` na raiz do repo) sempre que a
tarefa for criar/editar uma landing page da Botanika.

## O que tem aqui

```
botanika-lp-kit/
├── README.md          ← este arquivo
├── prompts/
│   ├── 00-INDEX.md    ← catálogo destilado (o que cada prompt ensina de técnica)
│   ├── 01-lumora.md ... 11-cosmic-dust.md   ← prompts de referência (getlayers)
│   └── (adicione aqui novos prompts que você achar — 1 arquivo por prompt)
└── zips/
    └── (jogue aqui os .zip: assets, exports, PDFs, referências)
```

## Como usar (para o usuário)

1. **Adicionar um prompt novo:** crie um arquivo `botanika-lp-kit/prompts/NN-nome.md` e cole o prompt.
   Depois adicione uma linha no `00-INDEX.md` resumindo o que ele ensina.
2. **Adicionar uma base de conhecimento em zip:** solte o `.zip` em `botanika-lp-kit/zips/`.
   Se possível, deixe um `.txt` ou `.md` do lado explicando o que é o zip e a qual produto se aplica.
3. **Criar/editar uma LP:** abra um chat e cole o comando do `CLAUDE.md`. A sessão vai ler
   `PAGINAS.md` + `botanika-lp-superprompt.md` + este kit sozinha.

## Regra de ouro

Os prompts em `prompts/` são **repertório de técnica** (WebGL, canvas de partículas, reveals,
grids em rem, springs, cursores custom). Servem para **inspirar a construção com identidade
própria** — **nunca** para copiar direto numa LP da Botanika. Cada produto = paleta, fundo,
fonte e assinatura próprios.
