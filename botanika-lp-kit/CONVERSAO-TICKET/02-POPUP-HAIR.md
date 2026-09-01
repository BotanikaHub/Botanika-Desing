# Mudança 2 · Pop-up de diagnóstico — Hair (por página)

> Exclusivo de cada LP. Este é o da **Hair**. Estrutura e mecânica são o molde; **copy/dores/ângulos mudam por produto**.

## Como ficou (Hair)
Modal na identidade da página (creme + índigo + Fraunces + eyebrow lima + chip dourado), **3 passos**:
1. **Diagnóstico (2 dores):** "O que você mais quer cuidar?" → **Cabelo** (`angulo=cabelo`) ou **Unhas** (`angulo=unhas`).
2. **Resultado + captura:** headline/parágrafo por dor (linguagem ANVISA-safe) + campo de e-mail + "Quero meu cupom" + micro-copy LGPD.
3. **Cupom (só depois do e-mail):** revela **BOTANIKA · 5% OFF** (copiável) + CTA "Ver meus kits →" que fecha e rola pra `#oferta`.

## Mecânica (o molde reutilizável)
- **Gatilho:** abre em **8s OU** ao rolar **>45%** (o que vier antes). Nunca imediato.
- **Anti-reexibição:** `localStorage 'lp_popup_done'` (após captura, não abre mais) + `sessionStorage 'lp_popup_seen'` (fechou sem converter → não reabre na sessão).
- **Captura:** no envio → `POST /api/lead {email, produto:'hair', angulo}` (não-bloqueante) → cai na **List 7** + tags `lp_popup_lead` + `produto_hair_botanika` + `lp_<angulo>` (ver `01-ACTIVECAMPAIGN.md`).
- **Degradação segura:** em preview raw.githack (sem a function) o `POST` falha silencioso, mas o fluxo segue e o cupom aparece igual. Em produção (Cloudflare) grava no AC.
- **Fechar:** X, clique no overlay, ou Esc.
- Testado headless: abre no scroll, troca de passo, envia payload correto por HTTP, seta a flag, **zero overflow em 390px**.

## Compliance (ANVISA)
- Pergunta é de **objetivo/foco** ("o que você quer cuidar"), nunca diagnóstico ("você tem X").
- Resultados usam **auxiliam na manutenção de cabelos normais**, **componentes da queratina** — sem curar/tratar/prometer.

## Onde está no arquivo (`landing-hair/index.html`)
- CSS: bloco `/* Pop-up de diagnóstico */` no fim do `<style>` (classes `.lpq*`).
- Markup: `<div class="lpq-ov" id="lpq">` logo após a `.buybar`.
- JS: `<script>` "Pop-up de diagnóstico: fluxo + captura" antes de `</body>`.

## Export p/ as outras LPs (colar no chat do agente da página)
> "Replique o pop-up de diagnóstico da Hair (`02-POPUP-HAIR.md` + código em `landing-hair/index.html`, classes `.lpq*`).
> Troque só: (a) as **2 dores** e os `data-angulo` conforme o produto; (b) os textos de **resultado** (ANVISA-safe da categoria); (c) `produto:'<slug>'` no `POST /api/lead`; (d) o cupom se for diferente de `BOTANIKA`.
> Mantenha: gatilho 8s/45%, flags anti-reexibição, cupom só no passo 3 (após e-mail), CTA rolando pra `#oferta`. Valide overflow 390px."

## Decisões desta rodada (Hair)
- **2 dores** (não 3): Cabelo e Unhas (pele fica implícita no produto).
- **Cupom só no final**, depois do e-mail (passo 3).
- Cupom `BOTANIKA` (5%). Destino: **fica na própria LP** (CTA rola pra `#oferta`) — melhor pra conversão; o desconto por quantidade dos kits já entra sozinho no checkout.
- **Não** citamos frete no pop-up (evita depender do valor 349/399, que segue pendente de confirmação — só será usado na barra de frete da Mudança 4).
