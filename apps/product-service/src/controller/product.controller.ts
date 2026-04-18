import { Request, Response } from "express";
import { prisma, Prisma } from "@repo/products-db";
import { productSchema } from "../schema/productSchema";
import { producer } from "../utils/kafka";
import { StripeProductType } from "@repo/types";

const updateProductSchema = productSchema.partial();

export const createProduct = async (req: Request, res: Response) => {
  // Validate input
  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten(),
    });
  }

  const data = result.data;

  const missingColors = data.colors.filter((color) => !(color in data.images));

  if (missingColors.length > 0) {
    return res.status(400).json({
      message: "Missing images for colors!",
      missingColors,
    });
  }

  const product = await prisma.product.create({
    data,
  });

  const stripeProduct: StripeProductType = {
    id: product.id.toString(),
    name: product.name,

    price: product.price,
  };

  producer.send("product.created", { value: stripeProduct });

  return res.status(201).json({
    success: true,
    data: product,
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  //  Validate ID
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }

  //  Validate body
  const result = updateProductSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten(),
    });
  }

  const data = result.data;

  //  Check if product exists
  const existing = await prisma.product.findUnique({
    where: { id },
  });

  if (!existing) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  //  Optional business rule: images vs colors
  if (data.colors && data.images) {
    const missingColors = data.colors.filter(
      (color) => !(color in data.images!),
    );

    if (missingColors.length > 0) {
      return res.status(400).json({
        message: "Missing images for colors",
        missingColors,
      });
    }
  }

  //  Update product
  const updatedProduct = await prisma.product.update({
    where: { id },
    data,
  });

  return res.status(200).json({
    success: true,
    data: updatedProduct,
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedProduct = await prisma.product.delete({
    where: { id: Number(id) },
  });

  return res.status(200).json(deletedProduct);
};

export const getProducts = async (req: Request, res: Response) => {
  const { sort, category, search, limit } = req.query;

  const orderBy = (() => {
    switch (sort) {
      case "asc":
        return { price: Prisma.SortOrder.asc };
        break;
      case "desc":
        return { price: Prisma.SortOrder.desc };
        break;
      case "oldest":
        return { createdAt: Prisma.SortOrder.asc };
        break;
      default:
        return { createdAt: Prisma.SortOrder.desc };
        break;
    }
  })();

  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: category as string,
      },
      name: {
        contains: search as string,
        mode: "insensitive",
      },
    },
    orderBy,
    take: limit ? Number(limit) : undefined,
  });

  res.status(200).json(products);
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  return res.status(200).json(product);
};
