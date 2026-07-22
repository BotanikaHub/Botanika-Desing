import "server-only";

/**
 * Cliente da Shopify Admin API (GraphQL), por marca.
 *
 * Cada marca (Botanika, VermeFree, ...) tem sua própria loja Shopify e seu
 * próprio token de acesso (obtido via OAuth). As funções abaixo recebem a
 * conexão da marca como parâmetro.
 */

export type ShopifyConnection = {
  shopDomain: string | null;
  accessToken: string | null;
  apiVersion?: string | null;
};

const DEFAULT_API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-01";

export function isShopifyConfigured(conn: ShopifyConnection | null | undefined): boolean {
  return Boolean(conn?.shopDomain && conn?.accessToken);
}

class ShopifyNotConfiguredError extends Error {
  constructor() {
    super("Loja Shopify desta marca ainda não conectada.");
    this.name = "ShopifyNotConfiguredError";
  }
}

async function shopifyGraphQL<T>(
  conn: ShopifyConnection,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  if (!isShopifyConfigured(conn)) throw new ShopifyNotConfiguredError();

  const apiVersion = conn.apiVersion || DEFAULT_API_VERSION;
  const res = await fetch(
    `https://${conn.shopDomain}/admin/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": conn.accessToken as string,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify API ${res.status}: ${text}`);
  }

  const json = (await res.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) {
    throw new Error(
      `Shopify GraphQL: ${json.errors.map((e) => e.message).join("; ")}`,
    );
  }
  return json.data as T;
}

export type CreatedDiscount = {
  code: string;
  priceRuleId: string;
  discountId: string;
};

/** Cria um cupom percentual, aplicável a toda a ordem, uso ilimitado. */
export async function createDiscountCode(
  conn: ShopifyConnection,
  params: { code: string; percentage: number; title?: string },
): Promise<CreatedDiscount> {
  const { code, percentage } = params;
  const title = params.title || `Creator ${code}`;

  const mutation = `
    mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
        codeDiscountNode {
          id
          codeDiscount {
            ... on DiscountCodeBasic {
              codes(first: 1) { nodes { code } }
            }
          }
        }
        userErrors { field message }
      }
    }
  `;

  const variables = {
    basicCodeDiscount: {
      title,
      code,
      startsAt: new Date().toISOString(),
      customerSelection: { all: true },
      customerGets: {
        value: { percentage },
        items: { all: true },
      },
      appliesOncePerCustomer: false,
    },
  };

  const data = await shopifyGraphQL<{
    discountCodeBasicCreate: {
      codeDiscountNode: {
        id: string;
        codeDiscount: { codes?: { nodes: { code: string }[] } };
      } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(conn, mutation, variables);

  const result = data.discountCodeBasicCreate;
  if (result.userErrors?.length) {
    throw new Error(
      result.userErrors.map((e) => e.message).join("; ") ||
        "Erro ao criar cupom na Shopify",
    );
  }

  const node = result.codeDiscountNode;
  if (!node) throw new Error("Shopify não retornou o cupom criado");

  return {
    code: node.codeDiscount.codes?.nodes?.[0]?.code || code,
    priceRuleId: node.id,
    discountId: node.id,
  };
}

/**
 * Atualiza o percentual de desconto de um cupom já existente na loja,
 * localizando-o pelo código. Funciona para cupons criados pelo app e para
 * cupons importados/vinculados. `percentage` é fração (0.05 = 5%).
 */
export async function setDiscountPercentageByCode(
  conn: ShopifyConnection,
  code: string,
  percentage: number,
): Promise<string> {
  const findQuery = `
    query byCode($code: String!) {
      codeDiscountNodeByCode(code: $code) {
        id
        codeDiscount { __typename }
      }
    }
  `;
  const found = await shopifyGraphQL<{
    codeDiscountNodeByCode: {
      id: string;
      codeDiscount: { __typename: string };
    } | null;
  }>(conn, findQuery, { code });

  const node = found.codeDiscountNodeByCode;
  if (!node) {
    throw new Error(`Cupom "${code}" não encontrado na Shopify desta marca.`);
  }
  if (node.codeDiscount.__typename !== "DiscountCodeBasic") {
    throw new Error(
      `O cupom "${code}" não é um desconto percentual editável por aqui.`,
    );
  }

  const mutation = `
    mutation updateDiscount($id: ID!, $input: DiscountCodeBasicInput!) {
      discountCodeBasicUpdate(id: $id, basicCodeDiscount: $input) {
        codeDiscountNode { id }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyGraphQL<{
    discountCodeBasicUpdate: {
      codeDiscountNode: { id: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(conn, mutation, {
    id: node.id,
    input: { customerGets: { value: { percentage } } },
  });

  const result = data.discountCodeBasicUpdate;
  if (result.userErrors?.length) {
    throw new Error(
      result.userErrors.map((e) => e.message).join("; ") ||
        "Erro ao atualizar o desconto na Shopify",
    );
  }
  return node.id;
}

// ───────────────────────── Configuração de cupom ─────────────────────────

export type CouponConfig = {
  kind: "amount" | "free_shipping";
  valueType: "percentage" | "fixed"; // relevante quando kind = amount
  value: number; // fração (0.05) p/ percentage; valor em R$ p/ fixed
  appliesTo: "order" | "products" | "collections";
  productIds: string[]; // GIDs (gid://shopify/Product/…)
  collectionIds: string[]; // GIDs (gid://shopify/Collection/…)
  minSubtotal: number | null; // R$ mínimo de compra
  usageLimit: number | null; // limite total de usos
  oncePerCustomer: boolean;
};

export function defaultCouponConfig(percentage: number): CouponConfig {
  return {
    kind: "amount",
    valueType: "percentage",
    value: percentage,
    appliesTo: "order",
    productIds: [],
    collectionIds: [],
    minSubtotal: null,
    usageLimit: null,
    oncePerCustomer: false,
  };
}

export type PickItem = { id: string; title: string };

/** Busca produtos da loja para o seletor (por título). */
export async function searchProducts(
  conn: ShopifyConnection,
  term: string,
  first = 20,
): Promise<PickItem[]> {
  const query = `
    query searchProducts($q: String!, $first: Int!) {
      products(first: $first, query: $q) {
        nodes { id title }
      }
    }
  `;
  const q = term.trim() ? `title:*${term.trim()}*` : "";
  const data = await shopifyGraphQL<{ products: { nodes: PickItem[] } }>(
    conn,
    query,
    { q, first },
  );
  return data.products.nodes;
}

/** Busca coleções da loja para o seletor (por título). */
export async function searchCollections(
  conn: ShopifyConnection,
  term: string,
  first = 20,
): Promise<PickItem[]> {
  const query = `
    query searchCollections($q: String!, $first: Int!) {
      collections(first: $first, query: $q) {
        nodes { id title }
      }
    }
  `;
  const q = term.trim() ? `title:*${term.trim()}*` : "";
  const data = await shopifyGraphQL<{ collections: { nodes: PickItem[] } }>(
    conn,
    query,
    { q, first },
  );
  return data.collections.nodes;
}

type FoundDiscount = {
  id: string;
  typename: string;
  title: string;
  config: CouponConfig | null;
  productLabels: PickItem[];
  collectionLabels: PickItem[];
};

/**
 * Lê a configuração atual de um cupom na Shopify (pelo código), para pré-preencher
 * o editor. Retorna null se o cupom não existir.
 */
export async function readDiscountConfigByCode(
  conn: ShopifyConnection,
  code: string,
): Promise<FoundDiscount | null> {
  const query = `
    query byCode($code: String!) {
      codeDiscountNodeByCode(code: $code) {
        id
        codeDiscount {
          __typename
          ... on DiscountCodeBasic {
            title
            usageLimit
            appliesOncePerCustomer
            customerGets {
              value {
                __typename
                ... on DiscountPercentage { percentage }
                ... on DiscountAmount { amount { amount } }
              }
              items {
                __typename
                ... on DiscountProducts { products(first: 250) { nodes { id title } } }
                ... on DiscountCollections { collections(first: 250) { nodes { id title } } }
              }
            }
            minimumRequirement {
              __typename
              ... on DiscountMinimumSubtotal { greaterThanOrEqualToSubtotal { amount } }
            }
          }
          ... on DiscountCodeFreeShipping {
            title
            usageLimit
            appliesOncePerCustomer
            minimumRequirement {
              __typename
              ... on DiscountMinimumSubtotal { greaterThanOrEqualToSubtotal { amount } }
            }
          }
        }
      }
    }
  `;

  type Value = { __typename: string; percentage?: number; amount?: { amount: string } };
  type Items = {
    __typename: string;
    products?: { nodes: PickItem[] };
    collections?: { nodes: PickItem[] };
  };
  type Minimum = {
    __typename: string;
    greaterThanOrEqualToSubtotal?: { amount: string };
  } | null;

  const data = await shopifyGraphQL<{
    codeDiscountNodeByCode: {
      id: string;
      codeDiscount: {
        __typename: string;
        title?: string;
        usageLimit?: number | null;
        appliesOncePerCustomer?: boolean;
        customerGets?: { value?: Value; items?: Items };
        minimumRequirement?: Minimum;
      };
    } | null;
  }>(conn, query, { code });

  const node = data.codeDiscountNodeByCode;
  if (!node) return null;
  const cd = node.codeDiscount;

  const minSubtotal =
    cd.minimumRequirement?.__typename === "DiscountMinimumSubtotal"
      ? parseFloat(cd.minimumRequirement.greaterThanOrEqualToSubtotal?.amount || "0") || null
      : null;

  if (cd.__typename === "DiscountCodeFreeShipping") {
    return {
      id: node.id,
      typename: cd.__typename,
      title: cd.title || code,
      productLabels: [],
      collectionLabels: [],
      config: {
        kind: "free_shipping",
        valueType: "percentage",
        value: 0,
        appliesTo: "order",
        productIds: [],
        collectionIds: [],
        minSubtotal,
        usageLimit: cd.usageLimit ?? null,
        oncePerCustomer: Boolean(cd.appliesOncePerCustomer),
      },
    };
  }

  if (cd.__typename === "DiscountCodeBasic") {
    const value = cd.customerGets?.value;
    const isPct = value?.__typename === "DiscountPercentage";
    const items = cd.customerGets?.items;
    const products = items?.products?.nodes ?? [];
    const collections = items?.collections?.nodes ?? [];
    const appliesTo: CouponConfig["appliesTo"] =
      items?.__typename === "DiscountProducts"
        ? "products"
        : items?.__typename === "DiscountCollections"
          ? "collections"
          : "order";
    return {
      id: node.id,
      typename: cd.__typename,
      title: cd.title || code,
      productLabels: products,
      collectionLabels: collections,
      config: {
        kind: "amount",
        valueType: isPct ? "percentage" : "fixed",
        value: isPct
          ? value?.percentage ?? 0
          : parseFloat(value?.amount?.amount || "0") || 0,
        appliesTo,
        productIds: products.map((p) => p.id),
        collectionIds: collections.map((c) => c.id),
        minSubtotal,
        usageLimit: cd.usageLimit ?? null,
        oncePerCustomer: Boolean(cd.appliesOncePerCustomer),
      },
    };
  }

  // Tipo não editável por aqui (BxGy etc.)
  return {
    id: node.id,
    typename: cd.__typename,
    title: cd.title || code,
    config: null,
    productLabels: [],
    collectionLabels: [],
  };
}

function basicValue(cfg: CouponConfig) {
  return cfg.valueType === "fixed"
    ? { discountAmount: { amount: cfg.value.toFixed(2), appliesOnEachItem: false } }
    : { percentage: cfg.value };
}

function buildBasicInput(code: string, title: string, cfg: CouponConfig) {
  const value = basicValue(cfg);

  const items =
    cfg.appliesTo === "products"
      ? { products: { productsToAdd: cfg.productIds } }
      : cfg.appliesTo === "collections"
        ? { collections: { add: cfg.collectionIds } }
        : { all: true };

  const input: Record<string, unknown> = {
    title,
    code,
    startsAt: new Date().toISOString(),
    customerSelection: { all: true },
    customerGets: { value, items },
    appliesOncePerCustomer: cfg.oncePerCustomer,
  };
  if (cfg.minSubtotal != null && cfg.minSubtotal > 0) {
    input.minimumRequirement = {
      subtotal: { greaterThanOrEqualToSubtotal: cfg.minSubtotal.toFixed(2) },
    };
  }
  if (cfg.usageLimit != null && cfg.usageLimit > 0) {
    input.usageLimit = cfg.usageLimit;
  }
  return input;
}

function buildFreeShippingInput(code: string, title: string, cfg: CouponConfig) {
  const input: Record<string, unknown> = {
    title,
    code,
    startsAt: new Date().toISOString(),
    customerSelection: { all: true },
    destination: { all: true },
    appliesOncePerCustomer: cfg.oncePerCustomer,
  };
  if (cfg.minSubtotal != null && cfg.minSubtotal > 0) {
    input.minimumRequirement = {
      subtotal: { greaterThanOrEqualToSubtotal: cfg.minSubtotal.toFixed(2) },
    };
  }
  if (cfg.usageLimit != null && cfg.usageLimit > 0) {
    input.usageLimit = cfg.usageLimit;
  }
  return input;
}

function checkUserErrors(errs: { message: string }[] | undefined, ctx: string) {
  if (errs?.length) throw new Error(`${ctx}: ${errs.map((e) => e.message).join("; ")}`);
}

async function deleteDiscount(conn: ShopifyConnection, id: string) {
  const mutation = `
    mutation del($id: ID!) {
      discountCodeDelete(id: $id) { deletedCodeDiscountId userErrors { message } }
    }
  `;
  const data = await shopifyGraphQL<{
    discountCodeDelete: { userErrors: { message: string }[] };
  }>(conn, mutation, { id });
  checkUserErrors(data.discountCodeDelete.userErrors, "Erro ao remover cupom");
}

async function createBasic(conn: ShopifyConnection, code: string, title: string, cfg: CouponConfig) {
  const mutation = `
    mutation create($input: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $input) {
        codeDiscountNode { id }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyGraphQL<{
    discountCodeBasicCreate: {
      codeDiscountNode: { id: string } | null;
      userErrors: { message: string }[];
    };
  }>(conn, mutation, { input: buildBasicInput(code, title, cfg) });
  checkUserErrors(data.discountCodeBasicCreate.userErrors, "Erro ao criar cupom");
  return data.discountCodeBasicCreate.codeDiscountNode?.id ?? "";
}

async function createFreeShipping(conn: ShopifyConnection, code: string, title: string, cfg: CouponConfig) {
  const mutation = `
    mutation create($input: DiscountCodeFreeShippingInput!) {
      discountCodeFreeShippingCreate(freeShippingCodeDiscount: $input) {
        codeDiscountNode { id }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyGraphQL<{
    discountCodeFreeShippingCreate: {
      codeDiscountNode: { id: string } | null;
      userErrors: { message: string }[];
    };
  }>(conn, mutation, { input: buildFreeShippingInput(code, title, cfg) });
  checkUserErrors(data.discountCodeFreeShippingCreate.userErrors, "Erro ao criar frete grátis");
  return data.discountCodeFreeShippingCreate.codeDiscountNode?.id ?? "";
}

// Monta o bloco `items` de um UPDATE, usando add/remove a partir do estado atual
// (para preservar o cupom em vez de recriar).
function buildItemsUpdate(next: CouponConfig, current: CouponConfig) {
  if (next.appliesTo === "order") return { all: true };

  if (next.appliesTo === "products") {
    const cur = current.appliesTo === "products" ? current.productIds : [];
    const items: Record<string, unknown> = {
      products: {
        productsToAdd: next.productIds.filter((id) => !cur.includes(id)),
        productsToRemove: cur.filter((id) => !next.productIds.includes(id)),
      },
    };
    if (current.appliesTo === "collections" && current.collectionIds.length) {
      items.collections = { remove: current.collectionIds };
    }
    return items;
  }

  // collections
  const cur = current.appliesTo === "collections" ? current.collectionIds : [];
  const items: Record<string, unknown> = {
    collections: {
      add: next.collectionIds.filter((id) => !cur.includes(id)),
      remove: cur.filter((id) => !next.collectionIds.includes(id)),
    },
  };
  if (current.appliesTo === "products" && current.productIds.length) {
    items.products = { productsToRemove: current.productIds };
  }
  return items;
}

async function updateBasic(
  conn: ShopifyConnection,
  id: string,
  next: CouponConfig,
  current: CouponConfig,
) {
  const input: Record<string, unknown> = {
    customerGets: { value: basicValue(next), items: buildItemsUpdate(next, current) },
    appliesOncePerCustomer: next.oncePerCustomer,
    usageLimit: next.usageLimit != null && next.usageLimit > 0 ? next.usageLimit : null,
  };
  if (next.minSubtotal != null && next.minSubtotal > 0) {
    input.minimumRequirement = {
      subtotal: { greaterThanOrEqualToSubtotal: next.minSubtotal.toFixed(2) },
    };
  }
  const mutation = `
    mutation update($id: ID!, $input: DiscountCodeBasicInput!) {
      discountCodeBasicUpdate(id: $id, basicCodeDiscount: $input) {
        codeDiscountNode { id }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyGraphQL<{
    discountCodeBasicUpdate: {
      codeDiscountNode: { id: string } | null;
      userErrors: { message: string }[];
    };
  }>(conn, mutation, { id, input });
  checkUserErrors(data.discountCodeBasicUpdate.userErrors, "Erro ao atualizar cupom");
  return data.discountCodeBasicUpdate.codeDiscountNode?.id ?? id;
}

async function updateFreeShipping(conn: ShopifyConnection, id: string, next: CouponConfig) {
  const input: Record<string, unknown> = {
    appliesOncePerCustomer: next.oncePerCustomer,
    usageLimit: next.usageLimit != null && next.usageLimit > 0 ? next.usageLimit : null,
  };
  if (next.minSubtotal != null && next.minSubtotal > 0) {
    input.minimumRequirement = {
      subtotal: { greaterThanOrEqualToSubtotal: next.minSubtotal.toFixed(2) },
    };
  }
  const mutation = `
    mutation update($id: ID!, $input: DiscountCodeFreeShippingInput!) {
      discountCodeFreeShippingUpdate(id: $id, freeShippingCodeDiscount: $input) {
        codeDiscountNode { id }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyGraphQL<{
    discountCodeFreeShippingUpdate: {
      codeDiscountNode: { id: string } | null;
      userErrors: { message: string }[];
    };
  }>(conn, mutation, { id, input });
  checkUserErrors(data.discountCodeFreeShippingUpdate.userErrors, "Erro ao atualizar frete grátis");
  return data.discountCodeFreeShippingUpdate.codeDiscountNode?.id ?? id;
}

/**
 * Cria ou aplica a configuração do cupom `code` na Shopify.
 *
 * Preserva o cupom (e o contador "vezes usado") sempre que possível: quando o
 * cupom já existe e continua do mesmo tipo, faz UPDATE no lugar. Só recria
 * (deletar + criar) quando é inevitável — ao trocar entre desconto e frete
 * grátis, ou ao remover por completo um mínimo que já existia. Recriar não
 * afeta o histórico de vendas (rastreado pelo código nos pedidos).
 */
export async function saveDiscountByCode(
  conn: ShopifyConnection,
  params: { code: string; title: string; config: CouponConfig },
): Promise<string> {
  const { code, title, config } = params;
  const existing = await readDiscountConfigByCode(conn, code);

  const desiredType =
    config.kind === "free_shipping" ? "DiscountCodeFreeShipping" : "DiscountCodeBasic";

  const createFresh = () =>
    config.kind === "free_shipping"
      ? createFreeShipping(conn, code, title, config)
      : createBasic(conn, code, title, config);

  // Não existe, ou tipo/estrutura não editável → cria do zero.
  if (!existing || !existing.config) {
    if (existing) await deleteDiscount(conn, existing.id);
    return createFresh();
  }

  // Troca de tipo (desconto ↔ frete grátis) → precisa recriar.
  if (existing.typename !== desiredType) {
    await deleteDiscount(conn, existing.id);
    return createFresh();
  }

  // Remover totalmente um mínimo que existia não é confiável via update → recria.
  const removingMinimum =
    existing.config.minSubtotal != null &&
    (config.minSubtotal == null || config.minSubtotal <= 0);
  if (removingMinimum) {
    await deleteDiscount(conn, existing.id);
    return createFresh();
  }

  // Mesmo tipo → atualiza no lugar (preserva o contador de usos).
  return config.kind === "free_shipping"
    ? updateFreeShipping(conn, existing.id, config)
    : updateBasic(conn, existing.id, config, existing.config);
}

export type OrderStats = {
  orderCount: number;
  totalSales: number;
  currency: string;
  orders: Array<{
    id: string;
    name: string;
    createdAt: string;
    total: number;
    customer: string | null;
    financialStatus: string | null;
  }>;
};

/** Pedidos que usaram um código de desconto. */
export async function getOrdersByDiscountCode(
  conn: ShopifyConnection,
  code: string,
  opts: { since?: string | null; until?: string | null; maxOrders?: number } = {},
): Promise<OrderStats> {
  const maxOrders = opts.maxOrders ?? 250;
  const q = `discount_code:${code}` + (opts.since ? ` created_at:>=${opts.since}` : "") + (opts.until ? ` created_at:<=${opts.until}` : "");
  // Obs: NÃO pedimos dados do cliente (customer{}), pois isso exigiria o scope
  // `read_customers` (dados protegidos, com aprovação da Shopify). Para vendas e
  // comissões não é necessário.
  const query = `
    query ordersByDiscount($q: String!, $first: Int!) {
      orders(first: $first, query: $q, sortKey: CREATED_AT, reverse: true) {
        nodes {
          id
          name
          createdAt
          displayFinancialStatus
          currentTotalPriceSet { shopMoney { amount currencyCode } }
        }
      }
    }
  `;

  const data = await shopifyGraphQL<{
    orders: {
      nodes: Array<{
        id: string;
        name: string;
        createdAt: string;
        displayFinancialStatus: string | null;
        currentTotalPriceSet: {
          shopMoney: { amount: string; currencyCode: string };
        };
      }>;
    };
  }>(conn, query, { q, first: maxOrders });

  const nodes = data.orders.nodes;
  let totalSales = 0;
  let currency = "BRL";

  const orders = nodes.map((o) => {
    const total = parseFloat(o.currentTotalPriceSet.shopMoney.amount || "0");
    totalSales += total;
    currency = o.currentTotalPriceSet.shopMoney.currencyCode || currency;
    return {
      id: o.id,
      name: o.name,
      createdAt: o.createdAt,
      total,
      customer: null,
      financialStatus: o.displayFinancialStatus,
    };
  });

  return { orderCount: orders.length, totalSales, currency, orders };
}

export type CreatorSales = {
  orderCount: number;
  totalSales: number;
  currency: string;
  topProducts: Array<{ title: string; quantity: number; revenue: number }>;
  orders: Array<{
    id: string;
    name: string;
    createdAt: string;
    total: number;
    financialStatus: string | null;
  }>;
};

/** Vendas + produtos mais vendidos de UM cupom (uma influencer). */
export async function getCreatorSales(
  conn: ShopifyConnection,
  code: string,
  opts: { since?: string | null; until?: string | null; maxOrders?: number } = {},
): Promise<CreatorSales> {
  const maxOrders = opts.maxOrders ?? 250;
  const q = `discount_code:${code}` + (opts.since ? ` created_at:>=${opts.since}` : "") + (opts.until ? ` created_at:<=${opts.until}` : "");
  const query = `
    query creatorSales($q: String!, $first: Int!) {
      orders(first: $first, query: $q, sortKey: CREATED_AT, reverse: true) {
        nodes {
          id
          name
          createdAt
          displayFinancialStatus
          currentTotalPriceSet { shopMoney { amount currencyCode } }
          lineItems(first: 50) {
            nodes {
              title
              quantity
              discountedTotalSet { shopMoney { amount } }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyGraphQL<{
    orders: {
      nodes: Array<{
        id: string;
        name: string;
        createdAt: string;
        displayFinancialStatus: string | null;
        currentTotalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
        lineItems: {
          nodes: Array<{
            title: string;
            quantity: number;
            discountedTotalSet: { shopMoney: { amount: string } } | null;
          }>;
        };
      }>;
    };
  }>(conn, query, { q, first: maxOrders });

  let totalSales = 0;
  let currency = "BRL";
  const products = new Map<string, { quantity: number; revenue: number }>();

  const orders = data.orders.nodes.map((o) => {
    const total = parseFloat(o.currentTotalPriceSet.shopMoney.amount || "0");
    totalSales += total;
    currency = o.currentTotalPriceSet.shopMoney.currencyCode || currency;
    for (const li of o.lineItems.nodes) {
      const rev = parseFloat(li.discountedTotalSet?.shopMoney?.amount || "0");
      const p = products.get(li.title) || { quantity: 0, revenue: 0 };
      p.quantity += li.quantity;
      p.revenue += rev;
      products.set(li.title, p);
    }
    return {
      id: o.id,
      name: o.name,
      createdAt: o.createdAt,
      total,
      financialStatus: o.displayFinancialStatus,
    };
  });

  const topProducts = [...products.entries()]
    .map(([title, v]) => ({ title, quantity: v.quantity, revenue: v.revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  return { orderCount: orders.length, totalSales, currency, topProducts, orders };
}

export type BrandAnalytics = {
  ordersScanned: number;
  trackedOrders: number;
  trackedSales: number;
  topInfluencers: Array<{
    code: string;
    name: string;
    orders: number;
    sales: number;
    commission: number;
  }>;
  topProducts: Array<{ title: string; quantity: number; revenue: number }>;
};

/**
 * Analisa os pedidos da loja e agrega:
 *  - vendas por cupom (→ ranking de influencers)
 *  - produtos mais vendidos nos pedidos que usaram um cupom de influencer
 *
 * creatorsByCode: mapa CODIGO(maiúsculo) → { name, rate } dos afiliados da marca.
 */
export async function getBrandAnalytics(
  conn: ShopifyConnection,
  creatorsByCode: Record<string, { name: string; rate: number }>,
  opts: { maxOrders?: number; since?: string | null; until?: string | null } = {},
): Promise<BrandAnalytics> {
  const maxOrders = opts.maxOrders ?? 1000;
  const q = [
    opts.since ? `created_at:>=${opts.since}` : "",
    opts.until ? `created_at:<=${opts.until}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const query = `
    query brandOrders($first: Int!, $after: String, $q: String) {
      orders(first: $first, after: $after, query: $q, sortKey: CREATED_AT, reverse: true) {
        pageInfo { hasNextPage endCursor }
        nodes {
          discountCodes
          currentTotalPriceSet { shopMoney { amount } }
          lineItems(first: 50) {
            nodes {
              title
              quantity
              discountedTotalSet { shopMoney { amount } }
            }
          }
        }
      }
    }
  `;

  type OrderNode = {
    discountCodes: string[];
    currentTotalPriceSet: { shopMoney: { amount: string } };
    lineItems: {
      nodes: Array<{
        title: string;
        quantity: number;
        discountedTotalSet: { shopMoney: { amount: string } } | null;
      }>;
    };
  };

  const salesByCode = new Map<string, { orders: number; sales: number }>();
  const products = new Map<string, { quantity: number; revenue: number }>();
  let ordersScanned = 0;
  let trackedOrders = 0;
  let trackedSales = 0;
  let after: string | null = null;

  while (ordersScanned < maxOrders) {
    const data: {
      orders: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        nodes: OrderNode[];
      };
    } = await shopifyGraphQL(conn, query, { first: 100, after, q });

    for (const o of data.orders.nodes) {
      ordersScanned += 1;
      const codes = (o.discountCodes || []).map((c) => c.toUpperCase());
      const tracked = codes.filter((c) => creatorsByCode[c]);
      if (tracked.length === 0) continue;

      const primary = tracked[0];
      const total = parseFloat(o.currentTotalPriceSet.shopMoney.amount || "0");
      trackedOrders += 1;
      trackedSales += total;

      const s = salesByCode.get(primary) || { orders: 0, sales: 0 };
      s.orders += 1;
      s.sales += total;
      salesByCode.set(primary, s);

      for (const li of o.lineItems.nodes) {
        const rev = parseFloat(li.discountedTotalSet?.shopMoney?.amount || "0");
        const p = products.get(li.title) || { quantity: 0, revenue: 0 };
        p.quantity += li.quantity;
        p.revenue += rev;
        products.set(li.title, p);
      }
    }

    if (!data.orders.pageInfo.hasNextPage) break;
    after = data.orders.pageInfo.endCursor;
    if (!after) break;
  }

  const topInfluencers = [...salesByCode.entries()]
    .map(([code, v]) => ({
      code,
      name: creatorsByCode[code]?.name || code,
      orders: v.orders,
      sales: v.sales,
      commission: v.sales * (creatorsByCode[code]?.rate ?? 0),
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);

  const topProducts = [...products.entries()]
    .map(([title, v]) => ({ title, quantity: v.quantity, revenue: v.revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return { ordersScanned, trackedOrders, trackedSales, topInfluencers, topProducts };
}

export type ShopifyDiscount = {
  code: string;
  title: string;
  status: string;
  percentage: number | null; // 0.1 = 10% (quando é desconto percentual)
};

/**
 * Lista todos os cupons de desconto (code discounts) da loja, paginando.
 */
export async function listDiscountCodes(
  conn: ShopifyConnection,
  max = 1000,
): Promise<ShopifyDiscount[]> {
  const query = `
    query allCodeDiscounts($first: Int!, $after: String) {
      codeDiscountNodes(first: $first, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes {
          codeDiscount {
            __typename
            ... on DiscountCodeBasic {
              title
              status
              codes(first: 1) { nodes { code } }
              customerGets { value { __typename ... on DiscountPercentage { percentage } } }
            }
            ... on DiscountCodeBxgy { title status codes(first: 1) { nodes { code } } }
            ... on DiscountCodeFreeShipping { title status codes(first: 1) { nodes { code } } }
          }
        }
      }
    }
  `;

  type Node = {
    codeDiscount: {
      __typename: string;
      title?: string;
      status?: string;
      codes?: { nodes: { code: string }[] };
      customerGets?: { value?: { __typename?: string; percentage?: number } };
    };
  };

  const out: ShopifyDiscount[] = [];
  let after: string | null = null;

  while (out.length < max) {
    const data: {
      codeDiscountNodes: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        nodes: Node[];
      };
    } = await shopifyGraphQL(conn, query, { first: 100, after });

    for (const n of data.codeDiscountNodes.nodes) {
      const cd = n.codeDiscount;
      const code = cd.codes?.nodes?.[0]?.code;
      if (!code) continue;
      const pct =
        cd.customerGets?.value?.__typename === "DiscountPercentage"
          ? cd.customerGets.value.percentage ?? null
          : null;
      out.push({
        code,
        title: cd.title || code,
        status: cd.status || "UNKNOWN",
        percentage: pct,
      });
    }

    if (!data.codeDiscountNodes.pageInfo.hasNextPage) break;
    after = data.codeDiscountNodes.pageInfo.endCursor;
    if (!after) break;
  }

  return out;
}

/**
 * Troca o `code` do OAuth por um access token offline.
 * Usado no callback de instalação da loja.
 */
export async function exchangeOAuthCode(params: {
  shopDomain: string;
  apiKey: string;
  apiSecret: string;
  code: string;
}): Promise<{ accessToken: string; scope: string }> {
  const res = await fetch(
    `https://${params.shopDomain}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: params.apiKey,
        client_secret: params.apiSecret,
        code: params.code,
      }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OAuth token exchange falhou (${res.status}): ${text}`);
  }

  const json = (await res.json()) as { access_token: string; scope: string };
  return { accessToken: json.access_token, scope: json.scope };
}
