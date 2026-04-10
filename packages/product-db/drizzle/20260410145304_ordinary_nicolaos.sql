CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"short_description" text NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"sizes" text[],
	"colors" text[],
	"images" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"category_slug" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_slug_categories_slug_fk" FOREIGN KEY ("category_slug") REFERENCES "public"."categories"("slug") ON DELETE no action ON UPDATE no action;