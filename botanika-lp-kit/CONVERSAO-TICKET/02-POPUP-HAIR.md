# Mudança 2 · Pop-up de diagnóstico — Hair (por página)

> Exclusivo de cada LP. Este é o da **Hair**. Estrutura e mecânica são o molde; **copy/dores/ângulos mudam por produto**.

## Como ficou (Hair)
Modal na identidade da página (creme + índigo + Fraunces + eyebrow lima + chip dourado), **3 passos**:
1. **Dor logo de cara (3 dores):** "O que mais te incomoda hoje?" → **Cabelo** (`cabelo`), **Unhas** (`unhas`) ou **Pele** (`pele`), cada um com subtítulo que bate na dor.
2. **Como o produto age NAquela dor + benefícios do dia a dia:** headline/parágrafo específico por dor (ANVISA-safe) + campo de e-mail + "Quero meu desconto" + micro-copy LGPD.
3. **Desconto (só depois do e-mail):** revela **BOTANIKA · 5% OFF** (copiável) + CTA "Ir para a oferta →" que fecha o modal e **rola pra `#oferta`** na própria LP.

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
- **3 dores** — Cabelo, Unhas e **Pele** — pra bater na dor logo de cara (passo 1).
- **Passo 2 = ação do produto naquela dor + benefícios do dia a dia** (não é só "resultado" genérico).
- **Desconto só no final**, depois do e-mail (passo 3); ao submeter, revela o cupom e o CTA leva pra `#oferta` na própria LP (melhor pra conversão; o desconto por quantidade dos kits já entra sozinho no checkout).
- Cupom `BOTANIKA` (5%).
- **Não** citamos frete no pop-up (evita depender do valor 349/399, pendente — só entra na barra de frete da Mudança 4).
- Modal com `max-height` + rolagem interna → cabe em telas curtas (testado 360×640).
