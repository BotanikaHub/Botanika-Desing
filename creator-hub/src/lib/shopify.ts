import "server-only";

/**
 * Cliente da Shopify Admin API (GraphQL).
 *
 * Usos principais:
 *  - Criar um cupom de desconto único quando um creator é aprovado
 *  - Buscar os pedidos que usaram aquele cupom (para calcular vendas/comissão)
 *
 * Configuração via .env:
 *  SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
 *  SHOPIFY_ADMIN_TOKEN=shpat_...
 *  SHOPIFY_API_VERSION=2025-01
 */

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-01";

export function isShopifyConfigured(): boolean {
  return Boolean(DOMAIN && TOKEN);
}

class ShopifyNotConfiguredError extends Error {
  constructor() {
    super(
      "Shopify não configurada. Defina SHOPIFY_STORE_DOMAIN e SHOPIFY_ADMIN_TOKEN no .env",
    );
    this.name = "ShopifyNotConfiguredError";
  }
}

async function shopifyGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  if (!isShopifyConfigured()) throw new ShopifyNotConfiguredError();

  const res = await fetch(
    `https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": TOKEN as string,
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

/**
 * Cria um cupom de desconto de valor percentual, aplicável a toda a ordem,
 * usável infinitas vezes. Retorna os IDs para gerenciamento futuro.
 */
export async function createDiscountCode(params: {
  code: string;
  percentage: number; // 0.10 = 10%
  title?: string;
}): Promise<CreatedDiscount> {
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
  }>(mutation, variables);

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
  totalSales: number; // soma dos totais dos pedidos
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

/**
 * Busca pedidos que usaram um determinado código de desconto.
 * Usa a busca por `discount_code:` da Admin API.
 */
export async function getOrdersByDiscountCode(
  code: string,
  maxOrders = 100,
): Promise<OrderStats> {
  const query = `
    query ordersByDiscount($q: String!, $first: Int!) {
      orders(first: $first, query: $q, sortKey: CREATED_AT, reverse: true) {
        nodes {
          id
          name
          createdAt
          displayFinancialStatus
          currentTotalPriceSet { shopMoney { amount currencyCode } }
          customer { displayName }
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
        customer: { displayName: string | null } | null;
      }>;
    };
  }>(query, { q: `discount_code:${code}`, first: maxOrders });

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
      customer: o.customer?.displayName || null,
      financialStatus: o.displayFinancialStatus,
    };
  });

  return {
    orderCount: orders.length,
    totalSales,
    currency,
    orders,
  };
}
