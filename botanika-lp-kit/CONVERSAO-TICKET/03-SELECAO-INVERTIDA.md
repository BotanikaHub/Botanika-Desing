# Mudança 3 · Seleção invertida 3→2→1 + barra que regride — Hair

## Como ficou (Hair)
- **Seletor invertido:** ordem **3 potes → 2 potes → 1 pote**, com **3 potes pré-selecionado** (default = kit 3).
- **Barra de evolução** abaixo do seletor: preenche mais em 3 potes (índigo→dourado, 100%), **regride** ao escolher menos (2 potes = 67%, 1 pote = 34%) — o dourado (recompensa) só aparece cheio no melhor valor.
- **Mensagem dinâmica** que mostra o que se ganha/perde:
  - 3 potes → "🔥 Melhor valor — −10% no total e ciclo completo (≈6 meses). Menor preço por pote."
  - 2 potes → "−5% ativo. Falta 1 pote pra destravar o melhor valor: −10% e o ciclo completo."
  - 1 pote → "Preço cheio, sem desconto. Levando 2 potes você já garante −5% — e o ciclo não trava no meio."
- Preço/economia por opção seguem os **descontos reais** (HAIR5 −5% em 2un, HAIR10 −10% em 3un): 1 pote R$ 99,40 · 2 potes R$ 188,86 (econ. R$ 9,94) · 3 potes R$ 268,38 (econ. R$ 29,82). O leque de potes e o pop no preço continuam.

## Onde está (`landing-hair/index.html`)
- CSS: bloco `/* barra de evolução do kit */` (classes `.kit-bar*`), perto do `.kit-stage`.
- Markup: `.toggle` reordenado (3,2,1; `active` no 3) + `<div class="kit-bar">` logo abaixo, dentro de `.offer-top`.
- JS: `KITS` ganhou `bar` (nível %) e `barmsg`; `applyKit` seta `#kit-bar-fill` (width) + `#kit-bar-msg`; default `currentKit='3'` e `applyKit('3')`.

## Testado (headless)
- Default = kit 3 (barra 100%, R$ 268,38); kit 1 → barra 34% (R$ 99,40); kit 2 → 67% (R$ 188,86). Ordem do seletor 3,2,1.
- Sem overflow em 390px · `node --check` + tags OK.

## ⚠️ Cuidado de conversão (do epic)
É a única das 4 mudanças que **pode piorar** resultado (afasta quem quer só experimentar 1). **Acompanhar ticket médio E conversão juntos** após publicar. Kit 1 continua acessível (só deixou de ser o default).

## Export p/ as outras LPs
> "Replique a seleção invertida da Hair (`03-SELECAO-INVERTIDA.md`): inverta o `.toggle` pra 3→2→1 (maior pré-selecionado), adicione `.kit-bar` e os campos `bar`/`barmsg` no `KITS`, e faça `applyKit` setar a barra. Use **os descontos reais da SUA LP** (confirme `automaticDiscountNodes` no Shopify) pros níveis/mensagens. Só inverta se houver desconto de volume real; a barra não pode mentir."
