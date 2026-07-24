# Gerador de Links UTM · Botanika

Ferramenta pública e standalone para gerar links com parâmetros UTM.
A pessoa cola o link, escolhe **onde vai usar** (e-mail, WhatsApp, link na bio,
stories, feed, Facebook, TikTok, SMS) e o link já sai pronto para copiar.

- **Um único arquivo** (`index.html`), com CSS, JavaScript e a fonte da marca
  (Instrument Sans) embutidos. Não precisa de build, servidor nem banco.
- O histórico de links fica salvo apenas no navegador da própria pessoa
  (`localStorage`).
- `utm_source` e `utm_medium` são preenchidos automaticamente conforme o canal
  escolhido; `campaign`, `content` e `term` são editáveis. Tudo é padronizado
  (minúsculas, sem acento, espaços viram `_`) para manter consistência.

## Publicar no Vercel

Como este projeto vive dentro do repositório do tema Shopify, aponte o Vercel
para esta subpasta.

### Opção A — Importar o repositório (recomendado)

1. Acesse https://vercel.com/new e importe o repositório
   `botanikahub/botanika-desing`.
2. Em **Root Directory**, clique em *Edit* e selecione a pasta `utm-tracker`.
3. **Framework Preset**: `Other` (site estático — sem build).
   Deixe *Build Command* e *Output Directory* em branco.
4. Clique em **Deploy**. Pronto — a URL pública é gerada na hora.

### Opção B — Vercel CLI

```bash
cd utm-tracker
npx vercel        # pré-visualização
npx vercel --prod # produção
```

### Domínio

Depois do deploy, em **Settings → Domains** você pode apontar um domínio ou
subdomínio próprio (ex.: `utm.botanika.com.br`) para divulgar.

## Editar

Todo o conteúdo está em `index.html`:

- **Canais** (onde o link é usado): edite o array `CHANNELS` no `<script>` —
  cada item define `name`, `source` e `medium`.
- **Cores / tipografia**: variáveis CSS no bloco `:root` (tema claro e escuro).
