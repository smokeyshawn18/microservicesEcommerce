import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
/* =========================
   CATEGORY TABLE
========================= */

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

/* =========================
   PRODUCT TABLE
========================= */

export const products = pgTable("products", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),

  price: integer("price").notNull(),

  sizes: text("sizes").array(), // String[]
  colors: text("colors").array(), // String[]

  images: jsonb("images").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  categorySlug: text("category_slug")
    .notNull()
    .references(() => categories.slug),
});

/* =========================
   RELATIONS
========================= */

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categorySlug],
    references: [categories.slug],
  }),
}));

/* =========================
   TYPES (🔥 VERY IMPORTANT)
========================= */

// CATEGORY TYPES
export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

// PRODUCT TYPES
export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;
