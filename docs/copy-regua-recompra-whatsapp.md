# Régua de Recompra — Templates WhatsApp API (Botanika)

╔══════════════════════════════════════════════════════════════╗
║  ⚠️ SARAH, LEIA ANTES DE CADASTRAR                            ║
╚══════════════════════════════════════════════════════════════╝

**O corpo das 4 mensagens está PRONTO pra copiar e colar. Você só precisa fazer 2 coisas na plataforma:**

1. **Inserir o link do produto no BOTÃO dos toques 2, 3 e 4** — onde está escrito `[link do produto]`. O texto da mensagem NÃO muda; o link vai só na configuração do botão (URL). Use o link do SKU específico da régua.
2. **Cadastrar as variáveis do template:** `{{1}}` = primeiro nome do cliente · `{{2}}` = nome do produto. (É a configuração normal de variável do Meta — o texto já está com elas no lugar certo.)

**Nada mais precisa ser alterado no texto.** Toque 1 não tem link (é UTILITY).

---

## TOQUE 1 — D+N-5 · categoria UTILITY · sem cupom · SEM botão/link
**Copiar e colar:**

Oi, {{1}}! Passando pra avisar: seu {{2}} deve estar chegando ao fim nos próximos dias. Quando quiser repor e manter sua rotina em dia, a Botanika está por aqui. 💚

---

## TOQUE 2 — D+N · categoria MARKETING · sem cupom
**Copiar e colar:**

Oi, {{1}}! Hoje é o dia: seu {{2}} chegou ao fim. A constância é o que sustenta os resultados que você já começou a sentir — então que tal não deixar faltar? É só tocar no botão e repor o seu. 💚

**Botão:** texto = `Repor agora` · URL = `[link do produto]`  ← inserir link

---

## TOQUE 3 — D+N+7 · categoria MARKETING · cupom VOLTA5 (5%)
**Copiar e colar:**

Oi, {{1}}! Faz uma semaninha que seu {{2}} acabou, e a gente sentiu sua falta. Pra facilitar a sua volta, separamos 5% OFF com o cupom VOLTA5 — é só aplicar no checkout. Bora manter o ritmo? 💚

**Botão:** texto = `Repor com 5% OFF` · URL = `[link do produto]`  ← inserir link

---

## TOQUE 4 — D+N+15 · categoria MARKETING · cupom VOLTA10 (10%) · último toque
**Copiar e colar:**

Oi, {{1}}! Já são duas semanas sem o seu {{2}} — e esse é o nosso último toque por aqui. Pra te dar um empurrãozinho, liberamos 10% OFF com o cupom VOLTA10, válido pelos próximos 15 dias. Depois dele, volta o preço cheio. Se quiser retomar, esse é o melhor momento. 💚

**Botão:** texto = `Repor com 10% OFF` · URL = `[link do produto]`  ← inserir link

---

## Referência (contexto — não precisa mexer)
- Janela D+N por SKU: D+25 padrão (Tri[Mg], Ômega 3, Vit C, Whey, Creatina, Hair) · Sleep Inositol D+15 · TetraVit D fora (funil próprio).
- Metas: T2 R$18.000 · T3 R$8.000 · T4 R$4.000 = R$30.000.
- Compliance já resolvido na escrita: corpo não começa com variável (regra Meta) · sem "garante" (ANVISA) · sem citar Dr. William.
- 💡 O VOLTA10 promete "15 dias" mas não tem trava automática no Shopify — controlar a expiração pela data de disparo pra não gerar SAC.
