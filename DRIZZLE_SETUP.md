# Drizzle ORM Migration Complete

## What Changed

### Replaced Prisma with Drizzle ORM

- **ORM**: Prisma → Drizzle ORM v0.31
- **Driver**: Prisma Postgres adapter → `postgres` package
- **Neon support**: Full compatibility with Neon PostgreSQL

## File Structure

### Database Package (`packages/product-db/`)

- **src/schema.ts** - Drizzle schema definitions using pgTable
  - `category` table - with id (serial), name, slug (unique)
  - `product` table - with id, price, images (JSON), sizes/colors arrays, categorySlug FK
  - Relations: productRelations, categoryRelations
  - Types exported: `Product`, `ProductInsert`, `Category`, `CategoryInsert`

- **src/client.ts** - Drizzle client instance
  - Uses `DATABASE_URL` environment variable
  - Singleton pattern for dev/production
  - Configured with postgre-js adapter

- **src/index.ts** - Package exports
  - Exports: `db`, schema tables, types

- **drizzle.config.ts** - Drizzle kit configuration (replaces prisma.config.ts)
  - Schema path: `src/schema.ts`
  - Migrations output: `drizzle/` folder

### Service Layer (`apps/product-service/`)

Controller files updated to use Drizzle queries:

- `src/controller/product.controller.ts` - CRUD operations with Drizzle
- `src/controller/category.controller.ts` - Category management with Drizzle

**Usage Pattern**:

```typescript
import { db, product, ProductInsert } from "@repo/product-db";
import { eq } from "drizzle-orm";

// Insert
const result = await db.insert(product).values(data).returning();

// Update
await db.update(product).set(data).where(eq(product.id, id)).returning();

// Delete
await db.delete(product).where(eq(product.id, id));

// Select
const allProducts = await db.select().from(product);
const one = await db.select().from(product).where(eq(product.id, id));
```

## NPM Scripts

### Product-DB

- `pnpm db:generate` - Generate Drizzle migrations from schema
- `pnpm db:migrate` - Apply pending migrations
- `pnpm db:studio` - Open Drizzle Studio UI

## Next Steps

1. **Database Setup**:

   ```bash
   export DATABASE_URL="postgresql://user:password@host/database"
   pnpm install  # At root
   pnpm db:generate  # Generate migrations
   pnpm db:migrate   # Apply to database
   ```

2. **Environment Variables**:
   - `DATABASE_URL` - Neon connection string
   - Optional `DIRECT_URL` - Direct connection for migrations (if using Neon with pgBouncer)

3. **Development**:
   ```bash
   pnpm dev  # Runs all services including product-service
   ```

## Type Safety

All database operations are fully type-safe with TypeScript:

- Schema changes automatically update types
- Insert/select/update/delete operations require correct types
- Relations provide type-checked joins

## Migration from Prisma

If you need to run migrations:

1. Old Prisma migrations remain in `prisma/migrations/` (can be archived)
2. New Drizzle migrations will be in `drizzle/` folder
3. For existing databases, consider using Drizzle introspect if needed
