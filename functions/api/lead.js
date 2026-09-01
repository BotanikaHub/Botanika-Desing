// Cloudflare Pages Function — captura de leads das LPs → ActiveCampaign
// Rota: POST /api/lead  (GENÉRICA — serve TODAS as landing pages)
//
// Por que existe: a LP é HTML estático (Cloudflare Pages). Não dá pra chamar a API
// do ActiveCampaign direto do navegador (exporia a chave). Esta função roda no
// servidor (Pages Functions), guarda a chave como secret e faz o proxy.
//
// Variáveis (Cloudflare Pages → Settings → Variables and Secrets):
//   AC_API_URL = https://botanika1.api-us1.com   (base da conta; SEM /api/3)
//   AC_API_KEY = <API key do ActiveCampaign>      (marcar como Secret/encrypted)
//
// Body (JSON) que a LP envia:
//   { email (obrig.), nome?, produto? (slug), angulo? }
//   produto = slug da LP → mapeia pra tag produto_* que JÁ existe no AC.
//
// Efeito no AC: upsert do contato → adiciona à List 7 ("Site – Cupom Boas-vindas
// (Popup)") → aplica tags: lp_popup_lead (origem) + produto_<...> + (opcional) lp_<angulo>.

const LIST_ID = 7; // "Site – Cupom Boas-vindas (Popup)" — destino oficial dos leads de LP

// slug da LP → tag de produto existente no AC (ver 01-ACTIVECAMPAIGN.md)
const PRODUCT_TAG = {
  hair: 'produto_hair_botanika',
  omega3: 'produto_super_omega3_coq10',
  trimagnesio: 'produto_trimg_complex',
  sleep: 'produto_sleep_inositol',
  vitaminac: 'produto_super_vitamina_c',
  tetravit: 'produto_tetravit_d',
  creatina: 'produto_creatina_magnesio_taurato',
  whey: 'produto_whey_balance_chocolate'
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost({ request, env }) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, CORS);
  try {
    if (!env.AC_API_URL || !env.AC_API_KEY) {
      return new Response(JSON.stringify({ ok: false, error: 'AC nao configurado' }), { status: 500, headers });
    }
    const body = await request.json().catch(function () { return {}; });
    const email = String(body.email || '').trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: 'email invalido' }), { status: 400, headers });
    }
    const base = env.AC_API_URL.replace(/\/+$/, '') + '/api/3';
    const H = { 'Api-Token': env.AC_API_KEY, 'Content-Type': 'application/json' };

    // 1) upsert do contato
    const sync = await fetch(base + '/contact/sync', {
      method: 'POST', headers: H,
      body: JSON.stringify({ contact: { email: email, firstName: body.nome || '' } })
    });
    const sj = await sync.json();
    const id = sj && sj.contact && sj.contact.id;
    if (!id) return new Response(JSON.stringify({ ok: false, error: 'sync falhou' }), { status: 502, headers });

    // 2) adiciona à lista (status 1 = ativo)
    await fetch(base + '/contactLists', {
      method: 'POST', headers: H,
      body: JSON.stringify({ contactList: { list: LIST_ID, contact: id, status: 1 } })
    });

    // 3) tags: origem + QUAL LP (lp_<slug>) + produto + (opcional) dor do quiz
    const tags = ['lp_popup_lead'];
    if (body.produto) {
      tags.push('lp_' + String(body.produto).replace(/[^a-z0-9_]+/gi, '_').toLowerCase()); // qual LP: lp_hair
      if (PRODUCT_TAG[body.produto]) tags.push(PRODUCT_TAG[body.produto]);                 // interesse: produto_*
    }
    if (body.angulo) tags.push('dor_' + String(body.angulo).replace(/[^a-z0-9_]+/gi, '_').toLowerCase()); // dor_cabelo
    for (let i = 0; i < tags.length; i++) await tagContact(base, H, id, tags[i]);

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String((e && e.message) || e) }), { status: 500, headers });
  }
}

async function tagContact(base, H, contactId, tagName) {
  let tagId;
  const s = await fetch(base + '/tags?search=' + encodeURIComponent(tagName), { headers: H });
  const sj = await s.json();
  const found = (sj.tags || []).filter(function (t) { return t.tag === tagName; })[0];
  tagId = found && found.id;
  if (!tagId) {
    const c = await fetch(base + '/tags', {
      method: 'POST', headers: H,
      body: JSON.stringify({ tag: { tag: tagName, tagType: 'contact', description: 'Lead via popup de LP' } })
    });
    const cj = await c.json();
    tagId = cj && cj.tag && cj.tag.id;
  }
  if (tagId) {
    await fetch(base + '/contactTags', {
      method: 'POST', headers: H,
      body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } })
    });
  }
}
