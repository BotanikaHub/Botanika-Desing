# Mudança 1 · ActiveCampaign — captura de lead (camada GENÉRICA)

> Serve **todas** as LPs. Feita uma vez, cada LP só pluga o form + o slug do produto.

## Decisão de arquitetura
A LP é HTML estático em **Cloudflare Pages**. Chamar a API do AC no navegador exporia a chave.
→ Captura via **Cloudflare Pages Function** `POST /api/lead` (arquivo `functions/api/lead.js`, na raiz do repo).
A função roda no servidor, guarda a chave como secret e faz o proxy pro AC.

**Alternativa (fallback):** form embed do AC (`proc.php`). Descartada por precisar criar um Form no painel do AC
(o MCP é read/write de contatos/listas/tags, mas não cria Form) e por não permitir lógica de tag por produto.

## Dados reais no AC (conta `botanika1`, id 4144392)
- **Lista destino:** id **7** — "Site – Cupom Boas-vindas (Popup)" (já existe, feita pra isso).
- **Tags de produto (já existem):** `produto_hair_botanika` (114), `produto_super_omega3_coq10` (121),
  `produto_trimg_complex` (117), `produto_sleep_inositol` (115), `produto_super_vitamina_c` (120),
  `produto_tetravit_d` (126), `produto_creatina_magnesio_taurato` (119), `produto_whey_balance_chocolate` (118).
- **Tags aplicadas pela função (criadas on-the-fly):**
  - `lp_popup_lead` — veio de um popup de LP (qualquer).
  - **`lp_<slug>`** — **qual LP** (ex.: `lp_hair`, `lp_omega3`). ← é a que identifica a origem.
  - `produto_<...>` — interesse no produto (reaproveita as tags que já existem).
  - `dor_<angulo>` — a dor escolhida no quiz (ex.: `dor_cabelo`, `dor_unhas`, `dor_pele`).
- **Segmento sugerido no AC:** List 7 **+** tag `lp_hair` = leads que vieram só da LP da Hair (funciona como "lista por LP" sem criar lista nova).

## Setup no Cloudflare (passo ÚNICO — serve todas as LPs)
No projeto Pages `botanika-desing` → **Settings → Variables and Secrets**, adicionar:
- `AC_API_URL` = `https://botanika1.api-us1.com`  (base da conta, **sem** `/api/3`)
- `AC_API_KEY` = *(a API key do AC — Settings → Developer)* → marcar como **Secret (encrypted)**

A rota `/api/lead` sobe automática no próximo deploy da `lp` (Pages detecta `functions/`). Sem tocar em DNS.
> Enquanto a chave não estiver setada, a função responde erro — mas a LP **degrada com segurança**
> (segue pro cupom/redirect mesmo assim). Nada quebra.

## Contrato da função (`functions/api/lead.js`)
`POST /api/lead`  · body JSON:
```json
{ "email": "obrigatorio@ex.com", "nome": "opcional", "produto": "hair", "angulo": "queda" }
```
Efeito: upsert do contato → adiciona à **List 7** → aplica `lp_popup_lead` + `produto_<slug>` + (opcional) `lp_<angulo>`.
Resposta: `{ "ok": true }` (ou `{ ok:false, error }`).

## Snippet reutilizável na LP (vai dentro do popup — Mudança 2)
```html
<form id="lp-lead-form" data-angulo="">
  <input type="email" name="email" inputmode="email" autocomplete="email" required placeholder="seu melhor e-mail">
  <button type="submit">Quero meu cupom</button>
</form>
<script>
(function(){
  var PRODUTO='hair';                 // ← slug desta LP (troca por página)
  var CUPOM='BOTANIKA';               // cupom oficial do popup (5% OFF)
  var DESTINO='https://botanikabrasil.com.br'; // destino pós-captura (loja ou PDP)
  var f=document.getElementById('lp-lead-form'); if(!f) return;
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var email=(f.email.value||'').trim();
    var angulo=f.getAttribute('data-angulo')||'';
    // captura não-bloqueante: se falhar (ex.: preview raw.githack), o redirect acontece igual
    try{ fetch('/api/lead',{method:'POST',keepalive:true,headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email:email,produto:PRODUTO,angulo:angulo})}); }catch(_){}
    try{ localStorage.setItem('lp_popup_done','1'); }catch(_){}
    // aplica cupom + leva ao destino num passo só
    var url='https://botanikabrasil.com.br/discount/'+encodeURIComponent(CUPOM)+'?redirect='+encodeURIComponent(DESTINO);
    setTimeout(function(){ location.href=url; }, 150);
  });
})();
</script>
```
- **Cookie/flag anti-reexibição:** `localStorage 'lp_popup_done'` (o popup checa antes de abrir).
- **Consentimento:** o form deve deixar claro que é opt-in de e-mail (LGPD) — micro-copy embaixo do campo.

## Export p/ as outras LPs (colar no chat do agente de cada página)
> "A captura de lead (ActiveCampaign) já é genérica: `functions/api/lead.js` + List 7 + tags `produto_*`.
> Nesta LP, use o snippet de `01-ACTIVECAMPAIGN.md` com `PRODUTO='<slug>'` e `data-angulo` conforme o quiz.
> Não precisa criar nada no AC — só plugar o form no popup e apontar `POST /api/lead`."

## Checklist da Mudança 1
- [ ] `functions/api/lead.js` no repo (feito).
- [ ] `AC_API_URL` + `AC_API_KEY` setados no Cloudflare Pages (**pendente — usuário**).
- [ ] Form plugado no popup da Hair com `PRODUTO='hair'` (na Mudança 2).
- [ ] Teste em produção: 1 lead entra na List 7 com as tags certas.
- [ ] Segmento `lp_popup_lead` criado no AC + automação de boas-vindas (opcional, time de CRM).
