# NepCart Monorepo

Turborepo workspace for NepCart services and apps.

## Stack

- Monorepo: Turborepo + pnpm workspaces
- Frontend: Next.js (`apps/client`, `apps/admin`)
- Services:
  - `apps/product-service` (Express)
  - `apps/order-service` (Fastify)
  - `apps/payment-service` (Hono)
- Shared packages:
  - `packages/types`
  - `packages/kafka`
  - `packages/order-db`
  - `packages/products-db` (Prisma)

## Prerequisites

- Node.js 20 LTS (recommended)
- Corepack enabled
- pnpm 9

Setup:

```bash
corepack enable
corepack prepare pnpm@9.0.0 --activate
node -v
pnpm -v
```

## Clone and install

```bash
git clone <your-repo-url> nepcart
cd nepcart
pnpm install
```

## Environment setup

Create these files and fill values.

### `apps/client/.env`

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:8002
```

### `apps/product-service/.env`

```env
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
```

### `apps/order-service/.env`

```env
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
MONGO_URL=
```

### `apps/payment-service/.env`

```env
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### `packages/products-db/.env`

```env
DATABASE_URL=
```

## Database bootstrap

Run from repository root:

```bash
pnpm --filter @repo/products-db db:generate
pnpm --filter @repo/products-db db:migrate
```

If migration history already exists in the target DB:

```bash
pnpm --filter @repo/products-db db:deploy
```

## Start the workspace

Run all dev tasks:

```bash
pnpm dev
```

Expected ports:

- Client: `3002`
- Admin: `3003`
- Product service: `8000`
- Order service: `8001`
- Payment service: `8002`

## Health checks

```bash
curl http://localhost:8000/health
curl http://localhost:8001/health
curl http://localhost:8002/health
```

Then open:

- `http://localhost:3002`
- `http://localhost:3003`

## Common issues

- Port in use: stop existing process using the same port.
- Clerk auth failures: verify all Clerk keys in app and service `.env` files.
- Client payment request fails: verify `NEXT_PUBLIC_PAYMENT_SERVICE_URL` in `apps/client/.env`.
- Stripe webhook verification fails: verify `STRIPE_WEBHOOK_SECRET` in `apps/payment-service/.env`.
- Prisma connection errors: verify `DATABASE_URL` in `packages/products-db/.env`.

## Useful commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm check-types
```
