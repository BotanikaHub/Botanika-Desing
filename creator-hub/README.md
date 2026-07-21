# Creator Club — Botanika & VermeFree

Hub de afiliados **multi-marca**. Creators (influenciadores, médicos, nutricionistas…)
se cadastram por marca, a equipe aprova, e cada aprovado recebe um painel com
**cupom + link de afiliado** exclusivos, acompanhando vendas e comissões da sua
loja Shopify. Cada marca (Botanika, VermeFree, …) é totalmente isolada: própria
loja, próprios creators, próprios cupons e painel.

## Tecnologias

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4**
- **Prisma** + **PostgreSQL (Supabase)**
- **Shopify Admin API** (GraphQL) por marca, conectada via **OAuth**
- Autenticação por sessão (cookies assinados com JWT)

## Estrutura de rotas

- `/` — escolha da marca
- `/[marca]` — landing da marca (ex.: `/botanika`, `/vermfree`)
- `/[marca]/apply` — cadastro de creator
- `/[marca]/login` — login do creator
- `/[marca]/dashboard` — painel do afiliado
- `/admin` — painel da equipe (todas as marcas, com filtro por marca)
- `/r/CUPOM` — link de afiliado: registra clique e leva ao checkout com o cupom

## Rodar localmente

```bash
cd creator-hub
npm install
cp .env.example .env         # preencha DATABASE_URL/DIRECT_URL do Supabase
npx prisma migrate deploy    # aplica as tabelas no banco
npm run seed-brands          # cria as marcas Botanika e VermeFree
npm run create-admin "voce@empresa.com" "suasenha" "Seu Nome"
npm run dev                  # http://localhost:3000
```

## Banco de dados (Supabase)

Projeto `creator-hub`. A connection string fica em **Supabase → creator-hub →
Connect → ORMs**. Use o pooler (porta 6543) em `DATABASE_URL` e o direct (5432)
em `DIRECT_URL`.

## Conexão Shopify (por marca, via OAuth)

Cada marca tem sua loja Shopify e seu app no **Dev Dashboard**. A conexão é feita
por OAuth: configura-se `shopifyApiKey`/`shopifyApiSecret` da marca, o admin clica
em "conectar", instala na loja e o token de acesso é salvo no banco. Scopes:
`read_orders`, `write_discounts`, `read_discounts`.

Enquanto a marca não estiver conectada, o fluxo funciona e o painel mostra um
aviso de que as vendas aparecem após a conexão.

## Deploy

- **Vercel** (deploy nativo de Next.js, a partir do GitHub).
- Variáveis de ambiente: `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET`,
  `NEXT_PUBLIC_APP_URL` (URL pública do hub), `SHOPIFY_API_VERSION`.

## Segurança

- `.env` **não** é versionado. Nunca comite senhas de banco ou secrets da Shopify.
