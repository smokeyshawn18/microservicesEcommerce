import { prisma, Prisma } from "@repo/products-db";

import { Request, Response } from "express";

export const createCategory = async (req: Request, res: Response) => {
  const data: Prisma.CategoryCreateInput = req.body;
  if (!data.name || typeof data.name !== "string") {
    return res.status(400).json({
      message: "Category name is required and must be a string",
    });
  }

  const category = await prisma.category.create({ data });
  res.status(201).json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: Prisma.CategoryUpdateInput = req.body;

  if (!data.name || typeof data.name !== "string") {
    return res.status(400).json({
      message: "Category name is required and must be a string",
    });
  }

  const category = await prisma.category.update({
    where: { id: Number(id) },
    data,
  });

  return res.status(200).json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // ✅ Validate ID
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    // 🔍 Find category first
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // 🧹 Delete all related products
    await prisma.product.deleteMany({
      where: { categorySlug: category.slug },
    });

    // 🗑️ Delete the category
    const deletedCategory = await prisma.category.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany();

  return res.status(200).json(categories);
};
