# zips/ — bases de conhecimento em arquivo

Solte aqui os `.zip` que servem de base para criar as LPs: pacotes de assets, exports de
referência, PDFs de produto, kits de marca, screenshots, etc.

## Boas práticas
- Nomeie o zip de forma clara: `hair-assets.zip`, `omega-referencias.zip`, `marca-botanika.zip`.
- Ao lado de cada zip, deixe (opcional mas recomendado) um `.md`/`.txt` curto dizendo:
  - o que tem dentro
  - a qual produto/LP se aplica
  - o que é para usar (paleta? foto do pote transparente? tom de voz?)

## Como a sessão usa
Ao criar/editar uma LP, a sessão verifica esta pasta. Se houver um zip relevante ao produto,
ele é descompactado e lido antes da construção (fotos de pote transparente, paleta oficial,
referências de layout, etc.).

> Dica: para o **pote transparente** de cada produto (que hoje falta em alguns), coloque o PNG
> transparente dentro de um zip aqui ou direto na pasta `landing-<slug>/` — é o que evita o
> "pote inventado".
