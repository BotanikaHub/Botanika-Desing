# FUNIS WHATSAPP BUSINESS API — VERSÃO FINAL

> Variáveis Meta em todos os templates: `{{1}}` = primeiro nome · `{{2}}` = nome do produto. Header = imagem dinâmica do produto. 1 imagem + 1 corpo + 1 botão por template.
> Regra de divergência: **número do fluxograma = versão principal**; divergências repetidas no fim de cada funil.
> Regras Botanika: sem "Dr. William", sem "barato", ANVISA-safe.

---

# TAREFA 1 — RECUPERAÇÃO DE CARRINHO (3 toques)

Gatilho `checkout_started` (webhook Shopify). Só entra com opt-in de WhatsApp e sem blocklist.

### WA1 — Lembrete · 30min · sem cupom · template `botanika_carrinho_1`
> Tom consultivo, **não comercial** — objetivo é só abrir o canal. Header: imagem do produto abandonado.

Oi, {{1}}! 🌿 Aqui é da Botanika. Vi que você começou seu pedido do {{2}} e ele ficou pela metade — deu algum probleminha no checkout? Seu carrinho está salvo, e se precisar de uma mãozinha pra finalizar é só me responder por aqui. 💙

`[Botão: Retomar meu pedido]`

---

### WA2 — Empurrão · ~20h · cupom BOTANIKA 5% (sem prazo) · template `botanika_carrinho_2`
> Baixa fricção, **não é escassez** — é bônus, não pressão de tempo.

{{1}}, seu {{2}} ainda está te esperando no carrinho 🌿 Pra deixar a decisão mais leve, um presente de quem é de casa: o cupom BOTANIKA dá 5% de desconto e aplica sozinho no checkout. Sem pressa e sem prazo — ele fica disponível pra quando você quiser finalizar. 💙

`[Botão: Finalizar com 5%]`

---

### WA3 — Última chance · ~46h · cupom RECUPERA10 10% (24h reais, 1 uso) · template `botanika_carrinho_3`
> Urgência **real** (o prazo é verdadeiro). Alvo ~290 caracteres — a mais enxuta do funil. Botão com link técnico já definido (checkout + cart_token + discount=RECUPERA10).

{{1}}, essa é a melhor condição pro seu {{2}}: 10% OFF com o cupom RECUPERA10. Ele é de verdade e expira em 24h — depois não volta. E se não sentir diferença, você tem 7 dias de garantia pra reembolso. 🌿

`[Botão: Aplicar 10% OFF]`

*(≈ 215 caracteres no corpo do template, dentro do alvo de ~290.)*

---

### DIVERGÊNCIAS SINALIZADAS NESTE FUNIL
- ⚠️ **WA1 — timing:** fluxograma = **30min** · brief = 45min. Entreguei assumindo **30min** (fluxograma). *Confirmar antes do disparo.*
- 🔎 **Compliance Meta (atenção, não é divergência):** WA1 é compatível com categoria **UTILITY**. WA2 e WA3 carregam desconto/promoção e, na prática, tendem a ser classificados como **MARKETING** na aprovação do template — vale submeter já nessa categoria pra não reprovar.

---

# TAREFA 2 — RECOMPRA 30 DIAS (4 toques)

Gatilho `order/paid` (Shopify). Tom de **continuidade/manutenção do resultado** — não é recuperação de venda perdida. Base abaixo em **D+25**; ajustar automaticamente para **D+15** no Sleep Inositol.

### WA1 — Aviso de reposição · D+25 · sem cupom (categoria Utility)
> Aviso responsável, sem venda — estabelece confiança.

Oi, {{1}}! 🌿 Passando pra um lembrete de reposição: se você tem seguido certinho, seu {{2}} deve estar chegando ao fim por esses dias. A constância é o que faz o suplemento apoiar a sua rotina de verdade — então, se quiser, já deixa a próxima leva garantida pra não ficar sem. 💙

`[Botão: Recomprar agora]`

---

### WA2 — Educativo · D+30 · **sem cupom** (fluxograma)
> Vende o hábito de manutenção, não o produto: quem sente resultado não precisa de desconto pra continuar.

{{1}}, uma coisa que a gente aprende com quem mantém a rotina: o resultado não vem de um pote só, vem da continuidade. 🌿 Quando o uso do {{2}} não trava, o corpo tem tempo de responder — e o que você vem construindo nas últimas semanas se mantém. Se o seu está acabando, vale repor antes de abrir uma janela sem ele.

`[Botão: Recomprar agora]`

---

### WA3 — Reconhecimento · D+37 · cupom **VOLTA5 5%** (fluxograma) · 15 dias de validade, 1 uso
> "O cliente sumiu": desconto pequeno como porta aberta pro diálogo, convidando resposta.

{{1}}, senti sua falta por aqui. 🌿 Faz um tempinho que seu {{2}} não é reposto, e eu queria deixar a porta aberta: o cupom VOLTA5 te dá 5% de desconto pra retomar quando fizer sentido. E se rolou alguma dúvida ou algo não saiu como você esperava, me conta respondendo aqui — quero te ajudar. 💙

`[Botão: Aplicar cupom]`

---

### WA4 — Respeito · D+45 · cupom VOLTA10 10% (último toque) · 15 dias de validade, 1 uso
> Última mensagem: reconhece e respeita a decisão do cliente, sem insistência. (Único toque em que fluxograma e brief concordam.)

{{1}}, esse é o meu último toque por aqui sobre o {{2}} — prometo respeitar a sua decisão. 🌿 Se em algum momento quiser retomar, deixo com você o cupom VOLTA10, com 10% de desconto, valendo pelos próximos dias. De qualquer forma, obrigado por ter confiado na Botanika. 💙

`[Botão: Aplicar cupom]`

---

### DIVERGÊNCIAS SINALIZADAS NESTE FUNIL
- ⚠️ **WA2 — cupom:** fluxograma = **sem cupom** · brief = cupom **VOLTA8 (8%)**, mas o próprio brief se **contradiz internamente** (o ângulo diz "SEM desconto"). Entreguei **sem cupom** (fluxograma). *Resolver a contradição do brief antes do disparo.*
- ⚠️ **WA3 — cupom:** fluxograma = **VOLTA5 (5%)** · brief = VOLTA10 (10%). Entreguei **VOLTA5**. *Nota técnica: VOLTA5 e VOLTA10 existem no Shopify (1 uso, 15 dias) — os dois são válidos, só não está claro qual pertence a este toque.* *Confirmar.*

### AJUSTES DE TIMING POR SKU (aplicar na régua, não muda a copy)
- **D+25 (base):** Tri[Mg] Complex, Super Ômega 3, Super Vitamina C, Whey Balance, Creatina+L-Carnitina, Clean Focus (frasco ~30 dias).
- **D+15:** Sleep Inositol (frasco ~19 dias) — mesma copy, gatilho antecipado.
- **TetraVit D:** **não entra** neste funil (frasco ~10 meses → funil próprio em D+270, fora do escopo).
- **2+ frascos do mesmo SKU:** multiplicar → D+(N × quantidade).

> 🔎 Observação de catálogo: o board lista **"Creatina+L-Carnitina"** e **"Clean Focus"** como SKUs. Nas copies anteriores o produto era **"Creatina + Taurato"** e Clean Focus não aparecia na linha dos 8. *Confirmar os nomes oficiais atuais do catálogo* (não afeta estes textos, que usam a variável `{{2}}`).
