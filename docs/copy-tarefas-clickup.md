# COPIES — TAREFAS CLICKUP (rascunhos)

> ⚠️ As 4 são **versões preliminares**. Cada uma tem bloco "PENDÊNCIAS PARA FINALIZAR".
> Regras fixas aplicadas: sem "Dr. William", sem "barato", ANVISA-safe, `{{PRIMEIRO_NOME}}`, assinatura fixa em e-mail.
> Formato WhatsApp/API: blocos `{{n}}` + `BOTÃO:`. (Se a plataforma usar `%firstname%` em vez de `{{PRIMEIRO_NOME}}`, trocar na importação.)

---

# TAREFA 1 — Funil API WhatsApp · Recuperação de Carrinho

**Status:** rascunho — espelha a lógica do funil de e-mail (lembrete leve → cupom pequeno → cupom maior com prazo → prova social sem desconto), adaptado ao WhatsApp. **Revisar assim que o board do Miro (Gabriel) for extraído.**

### TOQUE 1 — ~1h após abandono (lembrete leve, sem cupom)
{{1}} Oi, {{PRIMEIRO_NOME}}! 🌿 Aqui é da Botanika.

{{2}} Vi que você começou seu pedido e ele ficou pela metade. Deu algum probleminha no checkout?

{{3}} Fica tranquila que seu carrinho está salvo — é só voltar de onde parou. 💙

BOTÃO: Voltar ao carrinho
BOTÃO: Tive um problema

### TOQUE 2 — ~13h (cupom BOTANIKA 5%, permanente, sem escassez)
{{1}} {{PRIMEIRO_NOME}}, seu carrinho ainda está te esperando 🌿

{{2}} Pra facilitar a decisão, um presente de quem é de casa: o cupom *BOTANIKA* dá *5% OFF* e aplica sozinho no checkout.

{{3}} Sem correria — ele é fixo, fica disponível pra você.

BOTÃO: Finalizar com 5%
BOTÃO: Agora não

### TOQUE 3 — ~37h (cupom RECUPERA10 10%, prazo real 24h)
{{1}} Essa é a melhor condição que eu consigo te oferecer, {{PRIMEIRO_NOME}}:

{{2}} 🎟 Cupom *RECUPERA10* → *10% OFF* no seu pedido. Só que ele vale apenas nas próximas *24 horas*.

{{3}} E se não sentir diferença, tem 7 dias de garantia pra pedir o reembolso. Risco zero.

BOTÃO: Aplicar RECUPERA10
BOTÃO: Não tenho interesse

### TOQUE 4 — ~60h (prova social, sem desconto, encerramento)
{{1}} {{PRIMEIRO_NOME}}, sem pressão — só um último recado. 🌿

{{2}} Milhares de pessoas já incluíram a Botanika na rotina e voltam justamente porque sentem diferença ao longo das semanas.

{{3}} Seu carrinho ainda está aberto. Se fizer sentido pra você agora, é só dar uma olhada.

{{4}} Esse é o último lembrete que mando por aqui. 💙

BOTÃO: Ver o carrinho

**PENDÊNCIAS PARA FINALIZAR:**
- Extração do board do Miro (Gabriel): nº exato de toques, **timing real** de cada disparo, se os cupons são estes mesmos (BOTANIKA / RECUPERA10) e o tom aprovado por toque.
- Confirmar se cabe variável de **produto abandonado** no WhatsApp (ex.: "seu {{PRODUTO}}") — hoje deixei genérico.
- Definir os **botões/quick replies** suportados pelo provedor de API (limite de caracteres e quantidade).
- Alinhar com o funil de e-mail pra os dois canais **não dispararem o mesmo cupom no mesmo cliente** em duplicidade.

---

# TAREFA 2 — Funil API WhatsApp · Recompra 30 dias

**Status:** rascunho — tom de **continuidade** (não de venda perdida). Público: já comprou, ~30 dias, janela de reposição. **Revisar após extração do board do Miro.**

### TOQUE 1 — ~dia 25–28 (lembrete de reposição)
{{1}} Oi, {{PRIMEIRO_NOME}}! 🌿 Passando pra um rápido check-in.

{{2}} Se você seguiu certinho, seu [PRODUTO] deve estar chegando ao fim por esses dias.

{{3}} A constância é o que faz o suplemento realmente apoiar a sua rotina — vale repor antes de acabar pra não perder o embalo.

BOTÃO: Repor meu produto
BOTÃO: Ainda tenho

### TOQUE 2 — ~dia 30 (benefício percebido + continuidade)
{{1}} {{PRIMEIRO_NOME}}, como você tem se sentido desde que começou? 💙

{{2}} O corpo responde à constância: o que você vem construindo nas últimas semanas se mantém enquanto o uso continua.

{{3}} Bora garantir a próxima leva antes que o pote esvazie?

BOTÃO: Repor agora
BOTÃO: Falar com a gente

### TOQUE 3 — ~dia 33 (facilitador: kit + frete + cupom de casa)
{{1}} Pra não deixar faltar, {{PRIMEIRO_NOME}} 🌿

{{2}} Já deixa reposto — e, se quiser aproveitar, montando kit com 2 ou 3 produtos o frete sai grátis acima de R$349.

{{3}} O cupom *BOTANIKA* segue com 5% OFF sempre que você precisar. 💙

BOTÃO: Repor agora

**PENDÊNCIAS PARA FINALIZAR:**
- Extração do board do Miro: nº de toques, **timing exato** (dia 25? 30? 35?), e se há cupom/oferta específica de recompra (ou só lembrete + BOTANIKA).
- Variável de **produto comprado** e **data da compra** disponíveis na API? (pra personalizar "[PRODUTO]" e o cálculo dos ~30 dias).
- Definir se a régua é **por SKU** (Sleep 30 dias, TetraVit ~10 meses tem janela bem diferente!) — produtos de duração longa precisam de janela própria.
- Confirmar tom: manter "você" próximo ou incluir dado de resultado percebido.

---

# TAREFA 3 — Divulgação dos ganhadores dos bônus (lançamento 23/06)

**Status:** rascunho genérico com placeholders — **só finaliza depois dos dados** (quem ganhou, qual bônus, como resgatar).

## E-MAIL
**Assunto A:** 🎉 {{PRIMEIRO_NOME}}, você é um dos ganhadores!
**Assunto B:** Seu bônus do lançamento saiu — vem ver
**Pré-header:** O resultado dos bônus da oferta de 23 de junho chegou.

Oi, {{PRIMEIRO_NOME}} 🌿

Temos uma ótima notícia: você está na lista de ganhadores do **[NOME DO BÔNUS]** da nossa oferta de lançamento de **23 de junho**! 🎉

[BREVE DESCRIÇÃO DO BÔNUS — o que é e por que vale a pena]

**Como resgatar:**
[COMO RESGATAR — passo a passo / link / prazo]

Obrigado por ter feito parte dessa história com a gente desde o começo. É por gente como você que a Botanika existe. 💙

`→ [CTA: Resgatar meu bônus]`

Equipe Botanika · botanika.com.br

## API (WhatsApp)
{{1}} 🎉 *{{PRIMEIRO_NOME}}, você ganhou!*

{{2}} Você é um dos ganhadores do *[NOME DO BÔNUS]* da nossa oferta de lançamento de 23/06.

{{3}} Pra resgatar é simples: [COMO RESGATAR / PRAZO]

BOTÃO: Resgatar agora
BOTÃO: Falar com a gente

**PENDÊNCIAS PARA FINALIZAR:**
- **Lista de ganhadores** (nomes/quantidade) e se o disparo é segmentado só pra eles ou geral com "confira se você ganhou".
- **Qual era o bônus** exatamente (Manual da Suplementação? voucher 10%? outro?) → preenche `[NOME DO BÔNUS]` e a descrição.
- **Mecânica de resgate** e **prazo** → preenche `[COMO RESGATAR]`.
- Definir se há e-mail/API **separado para quem NÃO ganhou** (agradecimento + próxima chance), pra não gerar frustração na base.

---

# TAREFA 4 — Voucher pós-compra para postagem no Instagram

**Status:** rascunho — **percentual e valor do voucher em aberto** (não gerar cupom/valor sem definição).

## API (WhatsApp)
{{1}} Oi, {{PRIMEIRO_NOME}}! 🌿 Seu pedido já chegou, né? Esperamos que você esteja curtindo.

{{2}} Que tal ganhar um presente por isso? Poste seu Botanika no Instagram — Stories ou foto — marcando *@botanikabrasil* [e/ou usando *#Botanika* — confirmar].

{{3}} Em troca, você recebe um voucher de *[X]% de desconto* na sua próxima compra. 💙

{{4}} Depois de postar, é só responder aqui que a gente te envia seu cupom.

BOTÃO: Já postei
BOTÃO: Como funciona?

**PENDÊNCIAS PARA FINALIZAR:**
- **% e valor do voucher** (`[X]%`) — decisão principal em aberto no nome da tarefa.
- Mecânica de participação: **marcar @**, **usar hashtag**, ou os dois? Precisa ser **story** que expira ou **post** permanente? (muda a instrução).
- Como o cliente **recebe o cupom** depois de postar: envio manual pela equipe, automático, ou código fixo genérico?
- Há **prazo** pra participar / **validade** do voucher?
- Confirmar o **@ oficial** (usei @botanikabrasil, do rodapé da marca) e se há hashtag de campanha própria.
- Cuidado LGPD/direito de imagem: se a Botanika for **repostar** o conteúdo do cliente, incluir pedido de autorização.
