import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    const [
      customers,
      products,
      challans,
      lowStockProducts,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.product.count(),
      prisma.challan.count(),
      prisma.product.count({
        where: {
          currentStock: {
            lte: 10,
          },
        },
      }),
    ]);

    res.json({
      success: true,
      stats: {
        customers,
        products,
        challans,
        lowStockProducts,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};