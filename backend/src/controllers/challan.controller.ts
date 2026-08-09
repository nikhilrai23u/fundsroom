import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

interface ChallanItemInput {
  productId: string;
  quantity: number;
}

export const createChallan = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      customerId,
      items,
      status = "DRAFT",
    } = req.body as {
      customerId: string;
      items: ChallanItemInput[];
      status?: "DRAFT" | "CONFIRMED";
    };

    // -----------------------------
    // Validation
    // -----------------------------

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer is required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product is required",
      });
    }

    for (const item of items) {
      if (!item.productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required",
        });
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a positive integer",
        });
      }
    }

    // -----------------------------
    // Check customer
    // -----------------------------

    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // -----------------------------
    // Transaction
    // -----------------------------

    const challan = await prisma.$transaction(
      async (tx) => {
        const challanNumber = `CH-${Date.now()}`;

        // Validate stock only when confirming
        if (status === "CONFIRMED") {
          for (const item of items) {
            const product =
              await tx.product.findUnique({
                where: {
                  id: item.productId,
                },
              });

            if (!product) {
              throw new Error(
                `Product not found: ${item.productId}`
              );
            }

            if (
              product.currentStock <
              item.quantity
            ) {
              throw new Error(
                `Insufficient stock for ${product.name}. Available: ${product.currentStock}, requested: ${item.quantity}`
              );
            }
          }
        }

        // Create challan
        const newChallan =
          await tx.challan.create({
            data: {
              challanNumber,
              customerId,
              status,
              createdById:
                req.user!.userId,
            },
          });

        // Create items
        for (const item of items) {
          const product =
            await tx.product.findUnique({
              where: {
                id: item.productId,
              },
            });

          if (!product) {
            throw new Error(
              `Product not found: ${item.productId}`
            );
          }

          // Save snapshot
          await tx.challanItem.create({
            data: {
              challanId:
                newChallan.id,
              productId:
                product.id,
              productNameSnapshot:
                product.name,
              skuSnapshot:
                product.sku,
              priceSnapshot:
                product.unitPrice,
              quantity:
                item.quantity,
            },
          });

          // Only confirmed challans reduce stock
          if (status === "CONFIRMED") {
            await tx.product.update({
              where: {
                id: product.id,
              },
              data: {
                currentStock: {
                  decrement:
                    item.quantity,
                },
              },
            });

            await tx.stockMovement.create({
              data: {
                productId:
                  product.id,
                quantity:
                  item.quantity,
                movementType: "OUT",
                reason:
                  `Sales Challan ${challanNumber}`,
                createdBy:
                  req.user!.userId,
              },
            });
          }
        }

        return newChallan;
      }
    );

    return res.status(201).json({
      success: true,
      message:
        status === "DRAFT"
          ? "Challan saved as draft"
          : "Challan confirmed successfully",
      challan,
    });
  } catch (error: any) {
    console.error(error);

    if (
      error.message?.startsWith(
        "Insufficient stock"
      )
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message?.startsWith(
        "Product not found"
      )
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create challan",
    });
  }
};

// =====================================
// GET ALL CHALLANS
// =====================================

export const getChallans = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const challans =
      await prisma.challan.findMany({
        include: {
          customer: true,

          items: true,

          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.json({
      success: true,
      challans,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch challans",
    });
  }
};

// =====================================
// GET CHALLAN BY ID
// =====================================

export const getChallanById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid challan ID",
      });
    }

    const challan =
      await prisma.challan.findUnique({
        where: {
          id,
        },
        include: {
          customer: true,
          items: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

    if (!challan) {
      return res.status(404).json({
        success: false,
        message: "Challan not found",
      });
    }

    return res.json({
      success: true,
      challan,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch challan",
    });
  }
};

export const updateDraftChallan = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { customerId, items } = req.body;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid challan ID",
      });
    }

    if (!customerId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer and items are required",
      });
    }

    const existingChallan =
      await prisma.challan.findUnique({
        where: { id },
      });

    if (!existingChallan) {
      return res.status(404).json({
        success: false,
        message: "Challan not found",
      });
    }

    if (existingChallan.status !== "DRAFT") {
      return res.status(400).json({
        success: false,
        message: "Only draft challans can be edited",
      });
    }

    const customer =
      await prisma.customer.findUnique({
        where: { id: customerId },
      });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const updatedChallan =
      await prisma.$transaction(async (tx) => {

        // Remove old items
        await tx.challanItem.deleteMany({
          where: {
            challanId: id,
          },
        });

        // Add new items
        for (const item of items) {
          const product =
            await tx.product.findUnique({
              where: {
                id: item.productId,
              },
            });

          if (!product) {
            throw new Error(
              `Product not found: ${item.productId}`
            );
          }

          if (
            !Number.isInteger(item.quantity) ||
            item.quantity <= 0
          ) {
            throw new Error(
              "Quantity must be a positive integer"
            );
          }

          await tx.challanItem.create({
            data: {
              challanId: id,
              productId: product.id,
              productNameSnapshot: product.name,
              skuSnapshot: product.sku,
              priceSnapshot: product.unitPrice,
              quantity: item.quantity,
            },
          });
        }

        return tx.challan.update({
          where: {
            id,
          },
          data: {
            customerId,
          },
          include: {
            customer: true,
            items: true,
          },
        });
      });

    return res.json({
      success: true,
      message: "Draft challan updated successfully",
      challan: updatedChallan,
    });

  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update draft challan",
    });
  }
};

export const confirmChallan = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid challan ID",
      });
    }

    const confirmedChallan =
      await prisma.$transaction(
        async (tx) => {
          // 1. Find challan
          const challan =
            await tx.challan.findUnique({
              where: {
                id,
              },
              include: {
                items: true,
              },
            });

          if (!challan) {
            throw new Error(
              "Challan not found"
            );
          }

          // 2. Only drafts can be confirmed
          if (challan.status !== "DRAFT") {
            throw new Error(
              "Only draft challans can be confirmed"
            );
          }

          // 3. Check stock
          for (const item of challan.items) {
            const product =
              await tx.product.findUnique({
                where: {
                  id: item.productId,
                },
              });

            if (!product) {
              throw new Error(
                `Product not found: ${item.productId}`
              );
            }

            if (
              product.currentStock <
              item.quantity
            ) {
              throw new Error(
                `Insufficient stock for ${product.name}. Available: ${product.currentStock}, requested: ${item.quantity}`
              );
            }
          }

          // 4. Deduct stock + create movements
          for (const item of challan.items) {
            const product =
              await tx.product.findUnique({
                where: {
                  id: item.productId,
                },
              });

            if (!product) {
              throw new Error(
                `Product not found: ${item.productId}`
              );
            }

            await tx.product.update({
              where: {
                id: product.id,
              },
              data: {
                currentStock: {
                  decrement: item.quantity,
                },
              },
            });

            await tx.stockMovement.create({
              data: {
                productId: product.id,
                quantity: item.quantity,
                movementType: "OUT",
                reason: `Sales Challan ${challan.challanNumber}`,
                createdBy: req.user!.userId,
              },
            });
          }

          // 5. Change status
          return tx.challan.update({
            where: {
              id,
            },
            data: {
              status: "CONFIRMED",
            },
            include: {
              customer: true,
              items: true,
              createdBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          });
        },
        {
          timeout: 15000,
        }
      );

    return res.json({
      success: true,
      message: "Challan confirmed successfully",
      challan: confirmedChallan,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to confirm challan",
    });
  }
};

// =====================================
// CANCEL CHALLAN
// =====================================

export const cancelChallan = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid challan ID",
      });
    }

    const challan = await prisma.challan.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
      },
    });

    if (!challan) {
      return res.status(404).json({
        success: false,
        message: "Challan not found",
      });
    }

    if (challan.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Challan is already cancelled",
      });
    }

    /*
     * If a CONFIRMED challan is cancelled,
     * restore the stock.
     */
    const cancelledChallan = await prisma.$transaction(
      async (tx) => {
        if (challan.status === "CONFIRMED") {
          for (const item of challan.items) {
            const product = await tx.product.findUnique({
              where: {
                id: item.productId,
              },
            });

            if (!product) {
              throw new Error(
                `Product not found: ${item.productId}`
              );
            }

            await tx.product.update({
              where: {
                id: product.id,
              },
              data: {
                currentStock: {
                  increment: item.quantity,
                },
              },
            });

            await tx.stockMovement.create({
              data: {
                productId: product.id,
                quantity: item.quantity,
                movementType: "IN",
                reason: `Cancelled Sales Challan ${challan.challanNumber}`,
                createdBy: req.user!.userId,
              },
            });
          }
        }

        return tx.challan.update({
          where: {
            id,
          },
          data: {
            status: "CANCELLED",
          },
          include: {
            customer: true,
            items: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        });
      }
    );

    return res.json({
      success: true,
      message: "Challan cancelled successfully",
      challan: cancelledChallan,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to cancel challan",
    });
  }
};