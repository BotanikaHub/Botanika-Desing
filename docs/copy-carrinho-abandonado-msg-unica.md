# CARRINHO ABANDONADO — MENSAGEM ÚNICA (API) · Botanika

> Mensagem automática única, disparada no evento de abandono de carrinho (mesmo padrão da VermeFree). Não é o funil de 3 toques (esse está em `copy-whatsapp-funis-final.md`).
> Variáveis: `{{1}}` = primeiro nome · `{{2}}` = produto do carrinho. Incentivo: cupom BOTANIKA (5%, permanente).
> Regras: sem "Dr. William", sem "barato", ANVISA-safe, tom confidente que estudou, sem cobrança/urgência agressiva.

## Texto pronto pra cadastrar
Oi, {{1}}! 🌿 Aqui é da Botanika. Vi que o seu {{2}} ficou no carrinho — parece que faltou só finalizar. Fica tranquila, guardei ele pra você. Se bateu alguma dúvida antes de fechar, me responde por aqui que eu te ajudo a escolher com calma, sem pressa. E pra facilitar, o cupom *BOTANIKA* te dá 5% de desconto e aplica sozinho no checkout — ele é fixo, então fica disponível pra quando você quiser voltar de onde parou. 💙

[Botão: Voltar ao carrinho]

## Pendências
- Confirmar desconto: usei BOTANIKA 5% (equivalente ao 5% da VF). Se for outro, troco.
- Implementação técnica (evento de carrinho abandonado não-nativo no Shopify) é da Sarah — não trava a copy.
- Se a variável de produto `{{2}}` não estiver disponível na automação, dá pra usar versão genérica ("o seu pedido ficou no carrinho").
