# Botanika Creator Hub

Hub de creators/afiliados da Botanika. Creators se cadastram por um formulário,
a equipe aprova, e cada aprovado recebe um painel com **cupom + link de afiliado**
exclusivos, além de acompanhar vendas e comissões vindas do seu cupom (via Shopify).

## Tecnologias

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4**
- **Prisma** + **SQLite** (trocável por PostgreSQL em produção)
- **Shopify Admin API** (GraphQL) para criar cupons e ler pedidos
- Autenticação por sessão (cookies assinados com JWT)

## Fluxo

1. **/apply** — creator se cadastra (fica com status `PENDING`).
2. **/admin** — a equipe vê os pendentes e **aprova** (define cupom + % de comissão).
   Ao aprovar, o cupom é criado de verdade na Shopify.
3. **/dashboard** — o creator aprovado vê cupom, link, cliques, pedidos e comissão.
4. **/r/CUPOM** — link de afiliado: registra o clique e leva o cliente ao checkout
   com o cupom já aplicado (`/discount/CUPOM`).

## Como rodar localmente

```bash
cd creator-hub
npm install
cp .env.example .env      # preencha os valores
npx prisma migrate dev    # cria o banco local
npm run create-admin "voce@botanika.com" "suasenha" "Seu Nome"
npm run dev               # http://localhost:3000
```

- Painel admin: `http://localhost:3000/admin/login`
- Cadastro de creator: `http://localhost:3000/apply`

## Conectar a Shopify

No `.env`, preencha:

```
NEXT_PUBLIC_STORE_URL="https://botanika.com.br"   # domínio público da loja
SHOPIFY_STORE_DOMAIN="sua-loja.myshopify.com"      # domínio Admin API
SHOPIFY_ADMIN_TOKEN="shpat_..."                    # Admin API access token
SHOPIFY_API_VERSION="2025-01"
```

Como gerar o token: **Admin da Shopify → Configurações → Apps e canais de vendas →
Desenvolver apps → Criar um app → Admin API**. Permissões (scopes) necessárias:

- `write_discounts`, `read_discounts` — criar/ler os cupons dos creators
- `read_orders` — ler os pedidos para calcular vendas e comissões

Enquanto o token não estiver configurado, todo o fluxo funciona normalmente e o
painel mostra um aviso de que as vendas aparecerão quando a loja for conectada.

## Produção

- Trocar `provider = "sqlite"` por `"postgresql"` no `prisma/schema.prisma` e apontar
  `DATABASE_URL` para um Postgres (ex.: Neon, Supabase, Railway).
- Definir um `SESSION_SECRET` aleatório e longo.
- Recomendado hospedar na **Vercel** (deploy nativo de Next.js).

## Segurança

- `.env` e o banco local (`prisma/*.db`) **não** são versionados.
- Nunca comite o `SHOPIFY_ADMIN_TOKEN`.
