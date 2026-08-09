import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getStockMovements = async (
  req: Request,
  res: Response
) => {
  try {
    const movements = await prisma.stockMovement.findMany({
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      movements,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stock movements",
    });
  }
};