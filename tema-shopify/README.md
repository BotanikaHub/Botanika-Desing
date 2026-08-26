# tema-shopify — arquivos de template do tema (espelho)

Espelho dos arquivos de template que subimos no tema Shopify por API.
Serve como registro do que foi enviado e como fonte para o `themeFilesUpsert`
via `URL` (o Shopify baixa o arquivo cru direto do GitHub).

## templates/product.json

Template **padrao de produto — vale para TODOS os produtos** que nao tenham
`templateSuffix`. Escada real da loja: **0% / 5% / 10%** (1 / 2 / 3 unidades).

Nao mexer nos `tier*_discount` daqui para rodar campanha de um produto so:
isso faz toda PDP da loja anunciar o desconto (o Hair chegou a mostrar
"10% OFF · R$ 89,46" com preco real de R$ 99,40).

## templates/product.creatina.json

Template **exclusivo da Creatina** (produto com `templateSuffix: creatina`).
Identico ao padrao, mudando so os tres tiers para **10% / 10% / 10%**,
porque o desconto automatico da campanha da Creatina e 10% liso em
qualquer quantidade (conferido no `draftOrderCalculate`: 1un, 2un e 3un
saem todas a R$ 115,47/un).

> **Depois que a campanha da Creatina acabar (sexta 28/08):** voltar os tiers
> deste arquivo para `0 / 5 / 10` ou tirar o `templateSuffix` do produto,
> senao a PDP da Creatina passa a prometer 10% que nao existe mais.
