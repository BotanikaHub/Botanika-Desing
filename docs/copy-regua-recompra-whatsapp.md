# Régua de Recompra — Templates WhatsApp API (Botanika)

Sequência única de 4 toques, tom evoluindo do lembrete gentil (T1) à última chance generosa (T4).
Variáveis Meta em todos: **`{{1}}` = nome · `{{2}}` = produto**. Janela D+N por SKU (D+25 padrão · Sleep Inositol D+15 · TetraVit D fora, funil próprio).
Regras aplicadas: ANVISA-safe (sem "garante"/"cura"), sem "barato", sem citar Dr. William.

## Compliance Meta (ler antes de submeter)
- Corpo **não pode começar nem terminar com variável** → todos abrem com "Oi, {{1}}!" (texto antes da variável). ✔
- **T1 = categoria UTILITY** (lembrete de reposição, sem CTA comercial, sem link). **T2, T3, T4 = MARKETING** (com botão URL).
- Botão URL dinâmico por SKU: base do produto + sufixo variável (ex.: `botanikabrasil.com.br/products/{{1}}`).
- Amostras p/ aprovação: nome = "Marina" · produto = "Tri[Mg] Complex".

---

## TOQUE 1 — D+N-5 · UTILITY · sem cupom · sem link
Oi, {{1}}! Passando pra avisar: seu {{2}} deve estar chegando ao fim nos próximos dias. Quando quiser repor e manter sua rotina em dia, a Botanika está por aqui. 💚

(sem botão)

---

## TOQUE 2 — D+N · MARKETING · sem cupom · meta R$ 18.000
Oi, {{1}}! Hoje é o dia: seu {{2}} chegou ao fim. A constância é o que sustenta os resultados que você já começou a sentir — então que tal não deixar faltar? É só tocar no botão e repor o seu. 💚

Botão (URL): Repor agora → [link do produto]

---

## TOQUE 3 — D+N+7 · MARKETING · VOLTA5 (5%) · meta R$ 8.000
Oi, {{1}}! Faz uma semaninha que seu {{2}} acabou, e a gente sentiu sua falta. Pra facilitar a sua volta, separamos 5% OFF com o cupom VOLTA5 — é só aplicar no checkout. Bora manter o ritmo? 💚

Botão (URL): Repor com 5% OFF → [link do produto]

---

## TOQUE 4 — D+N+15 · MARKETING · VOLTA10 (10%, 15 dias) · meta R$ 4.000 · último toque
Oi, {{1}}! Já são duas semanas sem o seu {{2}} — e esse é o nosso último toque por aqui. Pra te dar um empurrãozinho, liberamos 10% OFF com o cupom VOLTA10, válido pelos próximos 15 dias. Depois dele, volta o preço cheio. Se quiser retomar, esse é o melhor momento. 💚

Botão (URL): Repor com 10% OFF → [link do produto]

---

## 💡 Insight (extra)
As metas somam certinho: 18k + 8k + 4k = R$ 30.000 (T1 é utilidade, sem meta de receita). Como o T4 tem validade real de 15 dias sem trava no Shopify, vale a Sarah agendar a **expiração do VOLTA10 por controle de data de disparo** (ou revisão manual) pra não deixar o cupom valer indefinidamente — a copy promete "15 dias", e a promessa precisa bater com a prática pra não gerar SAC.
