import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  shortDescription: z.string().min(1),
  description: z.string().min(10),
  price: z.number().int().nonnegative(),

  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).min(1, "Colors required"),

  images: z.record(z.string(), z.string()), // { black: "url" }

  categorySlug: z.string().min(1),
});
