# ✅ Checklist Técnico — Botanika (handoff dev / CRM)
*Gerado 16/08/2026 pelo gestor de tráfego. 3 frentes que hoje travam atribuição e receita. Prioridade: A > B > C.*

---

## 🅰️ FRENTE A — Publicar a correção de UTM no site (⏱️ ~5 min, SEM código)
**Problema:** ~30% dos pedidos entram sem `utm_source` → ROAS real da mídia paga fica subcontado e cega a decisão de escala.

**Status:** a correção **já está aplicada** num tema não publicado. Falta só pré-visualizar e publicar.

- [ ] Shopify admin → **Loja virtual → Temas**
- [ ] Localizar o tema **`Copy of Tema Padrão`** (ID `158480433384`, role UNPUBLISHED)
- [ ] **Visualizar** e testar: abrir a home com `?utm_source=teste&utm_campaign=x&utm_content=y` no fim da URL → adicionar produto ao carrinho → ir ao checkout
- [ ] Confirmar que nada quebrou visualmente (header, popup, carrinho, checkout)
- [ ] **Publicar** o tema

**O que foi alterado (pra revisão):**
1. Novo snippet `snippets/botanika-utm-capture.liquid` — captura UTM da URL, guarda em `localStorage` e grava como **atributo do carrinho** (`/cart/update.js`) → vira **atributo do pedido**. Chaves: `utm_source, utm_medium, utm_campaign, utm_content, utm_term, utm_id, fbclid, gclid`.
2. 1 linha em `layout/theme.liquid`, antes de `</body>`, junto dos outros renders: `{%- render 'botanika-utm-capture' -%}`.

**Validação pós-publicação:**
- [ ] Fazer um pedido de teste vindo de uma URL com UTM → conferir em **Pedido → Detalhes adicionais** (note_attributes) se os UTMs aparecem
- [ ] Acompanhar no Utmify/Supabase se a fatia "sem tag" cai bem abaixo dos 30%

---

## 🅱️ FRENTE B — Religar o pipeline de dados (Supabase)
**Problema:** a tabela `public.compra_aprovada` **parou de receber pedidos em 08/08/2026**. Último registro é de 08/08 (cobertura 23/06→08/08, 1.483 pedidos). Estamos cegos numa das fontes de atribuição.

- [ ] Identificar o que popula `public.compra_aprovada` (webhook Shopify/Utmify → Supabase, ou workflow n8n de ingestão)
- [ ] Checar logs/execuções desse fluxo a partir de ~08/08 — procurar erro de auth, schema, endpoint ou credencial expirada
- [ ] Verificar se algum webhook (Shopify "order paid" / Utmify) foi desativado ou mudou de URL
- [ ] Reprocessar/backfill dos pedidos de 09/08→hoje se a fonte permitir (evita buraco no histórico)
- [ ] Confirmar que voltou a gravar em tempo real (pedido de teste → aparece na tabela)

**⚠️ Segurança (reportado pelo advisor do Supabase):** 5 tabelas estão com **Row Level Security DESABILITADO**, expostas à `anon key`:
- [ ] `chat_messages`
- [ ] `dados_cliente`  ← contém dado de cliente, prioridade
- [ ] `chats`
- [ ] `documents`
- [ ] `n8n_chat_histories`

→ Avaliar habilitar RLS + policies adequadas (ou restringir a `service_role`).

---

## 🅲️ FRENTE C — E-mail / CRM (ActiveCampaign)
**Problema 1 — Entregabilidade:** as últimas campanhas (07–08/08) tiveram **abertura de 0,75%–4,25%** (padrão saudável é 15%+). Cheira a problema de reputação/entregabilidade, não de conteúdo.

- [ ] Verificar autenticação de domínio: **SPF, DKIM e DMARC** configurados e válidos
- [ ] Checar reputação do domínio/IP de envio (blacklists, taxa de bounce, spam complaints)
- [ ] Avaliar higienização da lista (remover inativos/hard bounces) e warmup se necessário
- [ ] Confirmar que o rastreamento de abertura (pixel do AC) não está sendo bloqueado

**Problema 2 — Automações de recuperação desligadas:** os fluxos de **carrinho abandonado por produto** estão **INATIVOS e com 0 entradas** — recuperação de venda sem custo de mídia parada.

- [ ] Reativar as automações de carrinho abandonado por produto: **Kit Imunidade, Hair Botanika, Whey Balance, Sleep Inositol, Creatina, Tri[Mg], Super Vitamina C**
- [ ] Confirmar que a automação genérica **"Carrinho Abandonado"** está de fato disparando (tem entrada?)
- [ ] Validar que o gatilho de carrinho abandonado recebe evento do Shopify (integração ativa)
- [ ] Reativar cadência de e-mail marketing (sem disparo desde 08/08)

---

### 📌 Resumo de prioridade
1. **A (publicar tema)** — 5 min, destrava a atribuição de toda a mídia paga. Fazer primeiro.
2. **B (Supabase)** — restaura visibilidade de dados + fecha brecha de segurança de dado de cliente.
3. **C (ActiveCampaign)** — recupera receita parada (carrinho) e conserta entregabilidade.
