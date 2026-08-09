"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getDashboardStats = async (req, res) => {
    try {
        const [customers, products, challans, lowStockProducts,] = await Promise.all([
            prisma_1.default.customer.count(),
            prisma_1.default.product.count(),
            prisma_1.default.challan.count(),
            prisma_1.default.product.count({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch stats",
        });
    }
};
exports.getDashboardStats = getDashboardStats;
