# Bônus — Guia da Imunidade Infantil

PDF-bônus educativo para pais, na **identidade oficial da Botanika** (guiada pelo ICP Research / brandbook):
azul-índigo profundo + creme + amarelo-dourado, sotaque verde (natureza), wordmark **"botanika · você mais saudável"**,
tipografia **Poppins** (títulos/marca) + **Inter** (corpo), layout editorial premium "ciência + natureza"
(regras douradas sob títulos índigo, tabelas com cabeçalho índigo, callouts com borda dourada, muito respiro).

## Arquivos
- `index.html` — versão **editável** (HTML autocontido, fontes embutidas; 10 páginas A4). Edite o texto e regenere o PDF.
- `Guia-da-Imunidade-Infantil-Botanika.pdf` — **PDF final** (10 páginas, A4, ~0,5 MB, mobile-friendly).

## Regenerar o PDF a partir do HTML
```bash
chrome --headless=new --no-pdf-header-footer --print-to-pdf="Guia-da-Imunidade-Infantil-Botanika.pdf" \
  --run-all-compositor-stages-before-draw --virtual-time-budget=10000 index.html
# opcional: comprimir (Ghostscript)
gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dColorImageResolution=110 -dNOPAUSE -dBATCH \
   -sOutputFile=out.pdf Guia-da-Imunidade-Infantil-Botanika.pdf
```

## Estrutura (10 páginas)
1. Capa + boas-vindas · 2. Boas-vindas/como usar + disclaimer · 3. O que sustenta a imunidade infantil ·
4. Os 6 pilares (sono, alimentação, hidratação, sol/vit D, atividade, rotina) · 5. Nutrientes + fontes no prato ·
6. Quando suplementar / sinais de alerta pro pediatra · 7. Uso seguro (dose por idade, horário, constância) ·
8. Botanika como apoio DOS PAIS (produtos adultos) · 9. Checklist "Semana da Imunidade" + FAQ · 10. Encerramento + disclaimer + canais.

## Decisões e pendências (revisar)
- **Produtos infantis:** a Botanika **não tem linha registrada para crianças**. O rótulo do **TetraVit D** diz "não para menores de 19 anos / manter fora do alcance de crianças". Por isso, a pág. 8 apresenta os produtos (TetraVit D, Super Vitamina C, Super Ômega 3, Kit Imunidade) **como apoio à rotina dos ADULTOS da família**, com aviso explícito de que **não são para crianças** — conforme decisão do cliente. **Confirmar** se essa é a linha desejada quando/se houver uma linha Kids registrada.
- **Claims:** todo o conteúdo usa linguagem de "contribui para o funcionamento normal do sistema imune" (sem cura/tratamento). Disclaimer educativo + "consulte o pediatra" presentes. **Revisão regulatória (ANVISA) recomendada** antes de publicar.
- **Preços:** puxados do Shopify em 2026-08-09 — reconferir na loja antes de divulgar.
