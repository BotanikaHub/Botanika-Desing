// Cloudflare Pages Function — captura de leads → ActiveCampaign
// Rota: POST /api/lead  (GENÉRICA — serve LPs e o pop-up do tema Shopify)
//
// Por que existe: a página é HTML estático. Não dá pra chamar a API do
// ActiveCampaign direto do navegador (exporia a chave). Esta função roda no
// servidor (Pages Functions), guarda a chave como secret e faz o proxy.
//
// Variáveis (Cloudflare Pages → Settings → Variables and Secrets):
//   AC_API_URL = https://botanika1.api-us1.com   (base da conta; SEM /api/3)
//   AC_API_KEY = <API key do ActiveCampaign>      (marcar como Secret/encrypted)
//
// Body (JSON) que a página envia:
//   { email (obrig.), nome?, produto? (slug), angulo?, origem? }
//   produto = slug → mapeia pra tag produto_* que JÁ existe no AC.
//   origem  = "site" → lead veio do pop-up do TEMA Shopify (lista + tag próprias).
//             (sem origem) → lead veio de uma LP (comportamento original).
//
// Efeito no AC:
//   - upsert do contato (contact/sync)
//   - LP:   adiciona à List 7 ("Site – Cupom Boas-vindas (Popup)") + tag lp_popup_lead + lp_<slug>
//   - Site: adiciona à lista "Site Shopify – Diagnóstico (Popup)" (criada pelo nome) + tag origem_shopify + site_<slug>
//   - Sempre: produto_<...> (interesse) + dor_<angulo> (quando houver)

const LIST_ID_LP = 7; // "Site – Cupom Boas-vindas (Popup)" — leads das LPs
const LIST_NAME_SITE = 'Site Shopify – Diagnóstico (Popup)'; // leads do pop-up do tema (criada sob demanda)

// slug → tag de produto existente no AC (ver 01-ACTIVECAMPAIGN.md)
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

    const isSite = String(body.origem || '').toLowerCase() === 'site';

    // 1) upsert do contato
    const sync = await fetch(base + '/contact/sync', {
      method: 'POST', headers: H,
      body: JSON.stringify({ contact: { email: email, firstName: body.nome || '' } })
    });
    const sj = await sync.json();
    const id = sj && sj.contact && sj.contact.id;
    if (!id) return new Response(JSON.stringify({ ok: false, error: 'sync falhou' }), { status: 502, headers });

    // 2) adiciona à lista (status 1 = ativo) — lista depende da origem
    let listId = LIST_ID_LP;
    if (isSite) {
      const sid = await ensureList(base, H, LIST_NAME_SITE);
      if (sid) listId = sid;
    }
    await fetch(base + '/contactLists', {
      method: 'POST', headers: H,
      body: JSON.stringify({ contactList: { list: listId, contact: id, status: 1 } })
    });

    // 3) tags: origem + qual página (site_/lp_<slug>) + produto + (opcional) dor do quiz
    const tags = [isSite ? 'origem_shopify' : 'lp_popup_lead'];
    if (body.produto) {
      const slug = String(body.produto).replace(/[^a-z0-9_]+/gi, '_').toLowerCase();
      tags.push((isSite ? 'site_' : 'lp_') + slug);          // qual página: site_hair / lp_hair
      if (PRODUCT_TAG[body.produto]) tags.push(PRODUCT_TAG[body.produto]); // interesse: produto_*
    }
    if (body.angulo) tags.push('dor_' + String(body.angulo).replace(/[^a-z0-9_]+/gi, '_').toLowerCase()); // dor_cabelo
    for (let i = 0; i < tags.length; i++) await tagContact(base, H, id, tags[i]);

    return new Response(JSON.stringify({ ok: true, list: listId }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String((e && e.message) || e) }), { status: 500, headers });
  }
}

// Resolve a lista pelo nome; cria se não existir. Retorna o id (ou null).
async function ensureList(base, H, name) {
  try {
    const r = await fetch(base + '/lists?filters%5Bname%5D=' + encodeURIComponent(name) + '&limit=100', { headers: H });
    const rj = await r.json();
    const found = (rj.lists || []).filter(function (l) { return l.name === name; })[0];
    if (found && found.id) return found.id;
    const c = await fetch(base + '/lists', {
      method: 'POST', headers: H,
      body: JSON.stringify({ list: {
        name: name,
        stringid: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        sender_url: 'https://botanikabrasil.com.br',
        sender_reminder: 'Você recebeu este e-mail porque fez o diagnóstico no site da Botanika.'
      } })
    });
    const cj = await c.json();
    return (cj && cj.list && cj.list.id) || null;
  } catch (e) {
    return null;
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
      body: JSON.stringify({ tag: { tag: tagName, tagType: 'contact', description: 'Lead via popup (site/LP)' } })
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
