# -------- Base --------
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# -------- Dependencies --------
FROM base AS deps
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --frozen-lockfile

# -------- Generate Prisma Client --------
FROM deps AS generator
RUN DATABASE_URL="postgresql://dummy:dummy@dummy.neon.tech/dummy?sslmode=require" \
    pnpm --filter @repo/products-db exec prisma generate

# -------- Build --------
FROM generator AS builder
RUN pnpm turbo run build --filter=product-service...

# -------- Prune --------
FROM builder AS pruner
RUN pnpm deploy --filter=product-service --prod /app/out
RUN cp -r /app/packages/products-db/generated /app/out/node_modules/@repo/products-db/generated

# -------- Runtime --------
FROM node:20-alpine AS runner
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
ENV KAFKA_BROKERS=kafka-broker-1:9094,kafka-broker-2:9095,kafka-broker-3:9096
COPY --from=pruner /app/out ./
EXPOSE 8000
CMD ["node", "dist/bootstrap.js"]