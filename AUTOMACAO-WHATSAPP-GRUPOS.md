# AUTOMAÇÃO DE CAMPANHAS WHATSAPP (GRUPOS) — BOTANIKA
*Canal: SendFlow (grupos) · Rastreio: UTM → Utmify · Destino: Shopify (botanikabrasil.com.br). Gerado 03/08/2026.*
*Objetivo: 3 campanhas/semana nos grupos (arquitetura até 5/sem), cada envio mensurável por UTM.*

---

## 0. ⚠️ REALIDADE DA BASE (ler primeiro)
A meta é "ativar ~25.000 leads via grupos". **Hoje os grupos somam ~1.590 pessoas** (16 grupos). Os 25k leads da base (e-mail/CRM) **ainda não estão dentro dos grupos de WhatsApp.**
- **Consequência:** o disparo automático (abaixo) já funciona e escala, mas hoje alcança ~1.590, não 25k.
- **Ação paralela necessária (crescimento):** puxar os 25k pra dentro dos grupos — link de convite nos rodapés de e-mail, no pós-compra do Shopify, SMS e no bio/stories do Instagram. Sem isso, o teto do canal é ~1,6k.

---

## 1. INVENTÁRIO CONECTADO (SendFlow)

**Contas de disparo (WhatsApp) — todas autenticadas:**
| Conta | ID | Número | Uso |
|---|---|---|---|
| Botanika – Disparador 1 (B) | `aq2Dt3HdZdzwO3wHRXkn` | 5531 72545228 | disparo (Business) |
| Botanika – Disparador 2 (B) | `XCaWTVpVhu0XjIU6Y4W4` | 5531 96093305 | disparo (Business) |
| Botanika – Gestor 1 (P) | `AqaNpdKwunL96p9gZnLc` | 5531 97471868 | admin (reserva) |
> Os 2 "Disparadores" são admins em todos os grupos → broadcast limpo (grupos com `onlyAdminsSpeak`). Rodar alternando as 2 contas reduz risco de bloqueio.

**Releases (coleções de grupos) e GIDs pra envio:**

**A) Release `Botanika` (geral) — `CgBSiGPTf0zghHviSOsa`** — 10 grupos, ~1.075 pessoas
| Grupo | GID (numérico) | Pessoas |
|---|---|---|
| #4 | 120363409080575761 | 162 |
| #2 | 120363427921843549 | 158 |
| #3 | 120363427273673060 | 155 |
| #1 | 120363411142023718 | 149 |
| #6 | 120363408268391478 | 140 |
| #7 | 120363429676518065 | 121 |
| #5 | 120363426194709819 | 94 |
| #8 | 120363409435834415 | 88 |
| #9 | 120363411134539333 | 4 |
| #10 | 120363427027887506 | 4 |

**B) Release `Botanika - Alunos` — `Dft9wNn5iMazQxpNT2zx`** — 4 grupos, ~505 pessoas
| Grupo | GID | Pessoas |
|---|---|---|
| #1 | 120363429018287898 | 246 |
| #3 | 120363409159035009 | 183 |
| #4 | 120363409105796425 | 71 |
| #5 | 120363428529049450 | 5 |

**C) Release `Botanika - Grupo VIP` — `FtdhQ0oq76N5m82qtwHV`** — 2 grupos, ~10 pessoas (novos)
| Grupo | GID | Pessoas |
|---|---|---|
| #1 VIP | 120363410961609360 | 5 |
| #2 VIP | 120363429128217169 | 5 |

> No SendFlow o disparo pode mirar `to.type:"release"` (todos os grupos da release de uma vez) — mais simples que listar GID a GID. Uso os GIDs só se quiser segmentar.

---

## 2. PADRÃO DE UTM (fixo, reutilizável)
```
utm_source=whatsapp
utm_medium=grupo         (grupo_vip para o VIP)
utm_campaign=<slug_da_campanha>   (ex.: sono_oferta)
utm_content=<AAAAMMDD do envio>   (ex.: 20260818)
```
> ✅ **Vantagem deste canal:** o link vai **direto pro Shopify**, sem passar pela LP Lovable — então **a UTM NÃO se perde** (o bug de atribuição do tráfego pago não afeta o WhatsApp). O Utmify captura clique→venda limpo. Este é o canal mais mensurável que temos.

**VARIANT_IDs (para montar os links de carrinho):**
| Produto | VARIANT_ID | Handle | Preço |
|---|---|---|---|
| Tri[Mg] Complex | 48115368558824 | tri-mg-complex | R$87,50 |
| Sleep Inositol | 48115368853736 | sleep-inositol | R$119,70 |
| Hair Botanika | 48650670670056 | hair-botanika | R$99,40 |
| TetraVit D | 48115367936232 | tetravit-d | R$117,12 |
| Super Ômega 3 | 48115368034536 | super-omega-3-coq10 | R$163,12 |
| Super Vitamina C | 48115368460520 | super-vitamina-c | R$89,52 |
| Whey Balance | 48115368919272 | whey-balance-chocolate | R$147,30 |
| Creatina + Taurato | 48115368820968 | creatina-l-carnitina | R$128,30 |
| Kit Imunidade | 48769157300456 | kit-da-imunidade | R$361,71 |

---

## 3. MODELOS DE LINK RASTREÁVEL (um por campanha)

**Builder genérico:**
- **PDP (educativa):** `https://botanikabrasil.com.br/products/<HANDLE>?utm_source=whatsapp&utm_medium=grupo&utm_campaign=<slug>&utm_content=<AAAAMMDD>`
- **Carrinho direto (oferta):** `https://botanikabrasil.com.br/cart/<VARIANT>:1?utm_source=whatsapp&utm_medium=grupo&utm_campaign=<slug>&utm_content=<AAAAMMDD>`
- **Carrinho + cupom BOTANIKA já aplicado (prova/urgência):** `https://botanikabrasil.com.br/discount/BOTANIKA?redirect=/cart/<VARIANT>:1&utm_source=whatsapp&utm_medium=grupo&utm_campaign=<slug>&utm_content=<AAAAMMDD>`
- **Kit no link (2 itens):** `.../cart/<VARIANT1>:1,<VARIANT2>:1?...`

**Exemplo pronto — "Semana Sono" (Sleep + Tri[Mg]):**
- **A · Educativa:** `https://botanikabrasil.com.br/products/tri-mg-complex?utm_source=whatsapp&utm_medium=grupo&utm_campaign=sono_educativa&utm_content=20260818`
- **B · Oferta (Kit Sleep+Tri, cupom aplicado):** `https://botanikabrasil.com.br/discount/BOTANIKA?redirect=/cart/48115368853736:1,48115368558824:1&utm_source=whatsapp&utm_medium=grupo&utm_campaign=sono_oferta&utm_content=20260820`
- **C · Prova social/urgência (Sleep, cupom):** `https://botanikabrasil.com.br/discount/BOTANIKA?redirect=/cart/48115368853736:1&utm_source=whatsapp&utm_medium=grupo&utm_campaign=sono_prova&utm_content=20260821`
> Encurtar (opcional) só depois de montar com a UTM — encurtador que preserve a query. Não filtrar parâmetros.

---

## 4. O TRILHO — 3 CAMPANHAS SEMANAIS (copy reutilizável, ANVISA-safe)

> Regras fixas: cupom permanente **BOTANIKA = 5% OFF** · frete grátis > **R$349**. Linguagem segura: "apoia / contribui / auxilia / cuida" — nunca "trata / cura / previne".

### A — Educativa (conteúdo + CTA suave) — *tema: [TEMA_A]*
```
🌿 Você sabia?
[gancho educativo do TEMA_A — 2-3 linhas de valor real]
No [PRODUTO_A] a gente [benefício ANVISA-safe].
👉 Entenda como funciona: [LINK_A]
Equipe Botanika 💙
```

### B — Oferta / gatilho de venda — *tema: [TEMA_B]*
```
⚡ Oferta da semana pra você do grupo
[TEMA_B] — [PRODUTO_B / KIT]
✅ cupom BOTANIKA = 5% OFF (já aplicado no link)
✅ frete grátis acima de R$349
👉 Garanta o seu: [LINK_B]
Estoque roda rápido 💙
```

### C — Prova social / urgência — *tema: [TEMA_C]*
```
💬 "[depoimento curto real de cliente]"
Todo dia chegam mensagens assim. 🥹
Se você ainda não experimentou, essa é a hora:
⏳ últimas unidades da semana com o cupom BOTANIKA (5% OFF)
👉 [LINK_C]
Qualquer dúvida, responde aqui 💙
```

---

## 5. CONFIGURAÇÃO DO DISPARO (pronto pra executar no seu OK)
Cada campanha = 1 `send-messages-action` agendada (`scheduledTo`), por release:
- **releaseId:** `CgBSiGPTf0zghHviSOsa` (geral) + `Dft9wNn5iMazQxpNT2zx` (alunos) — VIP à parte com `utm_medium=grupo_vip`.
- **accountsFrom:** `accounts` alternando Disparador 1 e 2 · **to:** `{type:"release"}` (todos os grupos) ou GIDs específicos.
- **Anti-bloqueio (options):** `shippingSpeed:"normal"` (40-60s entre msgs, pacotes de 100, 20-30min entre pacotes). Como são ~16 grupos, roda rápido e seguro.
- **Recorrência:** o SendFlow agenda 1 envio por vez. Pra "toda semana" eu crio uma **rotina semanal** que, no dia, agenda os 3 disparos da semana (só troco tema/link). Escala pra 5/sem só adicionando 2 slots.

---

## 6. PAINEL DE ROI (layout)
Planilha "Campanhas WhatsApp — ROI" (1 linha por envio):
| Campanha | Slug (utm_campaign) | Data (utm_content) | Tipo (A/B/C) | Grupos atingidos | Pessoas | Cliques (Utmify) | Pedidos | Receita | ROI |
|---|---|---|---|---|---|---|---|---|---|
| Semana Sono – Oferta | sono_oferta | 2026-08-20 | B | 14 | 1.580 | — | — | — | — |

- **Cliques/Pedidos/Receita:** puxo do Utmify filtrando `utm_source=whatsapp` + o `utm_campaign` da semana (custo do canal ≈ R$0 → ROI = receita ÷ custo operacional).
- Comparativo vs e-mail (hoje ~R$1.962/mês) pra provar que o grupo é mais barato.
- Posso gerar essa planilha (.xlsx) e atualizá-la a cada semana com os números reais do Utmify.

---

## 7. PROCESSO SEMANAL (replicar trocando só tema/link)
1. Definir TEMA_A/B/C e produtos da semana (2 min).
2. Eu gero os 3 links UTM (builder da seção 3) e preencho os 3 templates (seção 4).
3. Eu agendo os 3 disparos (seção 5) nos dias/horários fixos.
4. No fim da semana eu puxo o Utmify e atualizo o painel (seção 6).

---

## 8. PENDÊNCIAS (preciso de você)
1. **Dias e horários dos 3 disparos.** Sugestão pelos dados (picos de venda): **Ter/Qui/Dom**, às **10h** (ou **20h**). Seg–Qui e Dom vendem; Sex/Sáb são fracos.
2. **Temas A/B/C da 1ª semana** + produtos em foco (posso propor: A=magnésio/sono, B=Kit Sleep+Tri, C=depoimento Sleep — alinhado à Semana Sono 17-21/08).
3. **Crescer os grupos** (25k → hoje 1,6k): topo dos e-mails, pós-compra Shopify, bio/stories IG. Quer que eu prepare os convites?
4. **Go-live:** confirmo que só **agendo os disparos reais depois do seu OK** — nada sai sem aprovação.
