import "server-only";

/**
 * Cliente da Shopify Admin API (GraphQL), por marca.
 *
 * Cada marca (Botanika, Vermfree, ...) tem sua própria loja Shopify e seu
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
  const title = params.title || `Afiliado ${code}`;

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
  maxOrders = 100,
): Promise<OrderStats> {
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
  }>(conn, query, { q: `discount_code:${code}`, first: maxOrders });

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
