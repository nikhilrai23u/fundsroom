"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockMovements = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getStockMovements = async (req, res) => {
    try {
        const movements = await prisma_1.default.stockMovement.findMany({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch stock movements",
        });
    }
};
exports.getStockMovements = getStockMovements;
