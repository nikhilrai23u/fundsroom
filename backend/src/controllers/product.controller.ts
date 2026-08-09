import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const createProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const { sku } = req.body;

    const existingProduct =
      await prisma.product.findUnique({
        where: { sku },
      });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message:
          "A product with this SKU already exists",
      });
    }

    const product =
      await prisma.product.create({
        data: req.body,
      });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to create product",
    });
  }
};

export const getProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const products =
      await prisma.product.findMany();

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};