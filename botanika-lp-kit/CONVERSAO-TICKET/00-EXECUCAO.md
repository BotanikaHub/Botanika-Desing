# Conversão & Ticket — Execução (log vivo + método reutilizável)

> **Escopo:** aplicar as 4 melhorias de conversão **nas LPs** (HTML autocontido em `landing-<slug>/`), **não** no tema Shopify.
> **Piloto:** `landing-hair`. Depois este doc vira **prompt genérico** pros agentes das outras LPs.
> **Referências de UX (capturas):** lojas Blessy (`useblessy.com.br`) e Bigens (`www.bigens.com.br`) — bundle/seleção invertida + popup.

## Estado (marcar conforme avança)
| # | Mudança | Genérica ou por-página | Status Hair |
|---|---------|------------------------|-------------|
| 1 | **ActiveCampaign** (captura de lead) | **Genérica** (mesma p/ todas) | ✅ código pronto (`functions/api/lead.js`) · ⏳ falta setar `AC_API_KEY`/`AC_API_URL` no Cloudflare — ver `01-ACTIVECAMPAIGN.md` |
| 2 | Pop-up de diagnóstico (2 dores → e-mail → cupom) | **Por página** (exclusivo) | ✅ Hair pronto e testado — ver `02-POPUP-HAIR.md` |
| 3 | Seleção invertida 3→2→1 (barra que regride) | Por página (usa descontos reais) | ✅ Hair pronto e testado (preview) — ver `03-SELECAO-INVERTIDA.md` · ⏳ aguardando OK p/ publicar (muda conversão) |
| 4 | Imagens de benefício/objeção | Por página (depende de arte) | ⬜ |
| 5 | "Carrinho contínuo" → na LP vira order bump + barra de frete + cart multi-item | Por página | ⬜ |

## Regras de ouro (herdadas da execução VermeFree, adaptadas à LP)
- **Preço é sagrado:** nenhum número sem desconto **real e ativo** no Shopify (`automaticDiscountNodes`). Não existir → não aparece; **pare e alinhe**.
- **PDP = LP:** as vantagens mostradas têm que bater com a loja.
- **Mobile-first.** Validar: `node --check` nos `<script>` + balanço de tags + **zero overflow em 390px**.
- **Compliance Botanika (suplemento):** linguagem honesta (auxilia/contribui/apoia), sem curar/tratar/diagnosticar; o "diagnóstico" do popup é **"qual seu foco/objetivo"**, nunca "você tem X".
- **Preview = branch de trabalho + raw.githack por SHA.** Publicar = push na `lp` → Cloudflare Pages (`ofertas.botanikabrasil.com.br`). Só publicar após OK.

## Método (o que replicar em cada LP)
1. Ler `PAGINAS.md` (produto, VARIANT_ID, descontos reais, identidade da LP).
2. **Mudança 1 (AC):** já é genérica — a LP só precisa do form + `POST /api/lead` com o `produto` (slug). Ver `01-ACTIVECAMPAIGN.md`.
3. **Mudança 2 (seleção invertida):** inverter o seletor de kit existente (3 pré-selecionado → 2 → 1) + barra de evolução que **regride**; preços/economia honestos por desconto real.
4. **Mudança 3 (imagens):** seção de cards 4:5 (foto do produto 1º, benefício/objeção antes das secundárias); artes hospedadas no Shopify/local.
5. **Mudança 4 (order bump):** 1 add-on contextual por vez + barra de frete grátis + `cart` permalink multi-item (`/cart/VAR1:q,VAR2:q`).
6. Validar → SHA de preview → aprovação → push `lp`.

## Dados reais da Botanika (fonte: `PAGINAS.md` + Shopify)
Mapa **slug LP → produto → VARIANT_ID → tag AC**:
| slug | produto | VARIANT_ID | tag AC (existe) |
|------|---------|------------|-----------------|
| hair | Hair Botanika | 48650670670056 | `produto_hair_botanika` |
| omega3 | Super Ômega 3 + CoQ10 | 48115368034536 | `produto_super_omega3_coq10` |
| trimagnesio | Tri[Mg] Complex | 48115368558824 | `produto_trimg_complex` |
| sleep | Sleep Inositol | 48115368853736 | `produto_sleep_inositol` |
| vitaminac | Super Vitamina C | 48115368460520 | `produto_super_vitamina_c` |
| tetravit | TetraVit D | 48115367936232 | `produto_tetravit_d` |
| creatina | Creatina + Taurato | 48115368820968 | `produto_creatina_magnesio_taurato` |
| whey | Whey Balance Chocolate | 48115368919272 | `produto_whey_balance_chocolate` |

Descontos por quantidade (confirmar ativo antes de exibir): Hair `HAIR5`/`HAIR10`; Super C `SUPER5`/`SUPER10`; demais kits 2 (−5%) / 3 (−10%). Cupom do popup: `BOTANIKA` (5%). Frete grátis: **confirmar R$349 vs R$399**.

## Pendências / dependências de terceiros
- **AC:** setar `AC_API_KEY` + `AC_API_URL` como variáveis no Cloudflare Pages (passo único, serve todas). Ver `01-ACTIVECAMPAIGN.md`.
- **Arte** (Mudança 3): designer.
- **ClickUp** estava offline — não deu pra ler a epic; escopo veio do prompt + repo.
- Confirmar: frete grátis (349/399), destino do redirect do popup (loja vs PDP), ângulos do quiz da Hair.
