import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const createFollowUp = async (
  req: Request,
  res: Response
) => {
  try {
    const customerId = String(req.params.id);
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: "Follow-up note is required",
      });
    }

    const customer =
      await prisma.customer.findUnique({
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

    const followUp =
      await prisma.customerFollowUp.create({
        data: {
          customerId,
          note: note.trim(),
        },
      });

    res.status(201).json({
      success: true,
      message: "Follow-up added successfully",
      followUp,
    });
  } catch (error) {
    console.error(
      "CREATE FOLLOW-UP ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to add follow-up",
    });
  }
};

export const getFollowUps = async (
  req: Request,
  res: Response
) => {
  try {
    const customerId = String(req.params.id);

    const followUps =
      await prisma.customerFollowUp.findMany({
        where: {
          customerId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json({
      success: true,
      followUps,
    });
  } catch (error) {
    console.error(
      "GET FOLLOW-UPS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch follow-ups",
    });
  }
};