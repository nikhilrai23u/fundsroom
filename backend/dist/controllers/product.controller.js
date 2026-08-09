"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = exports.createProduct = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createProduct = async (req, res) => {
    try {
        const { sku } = req.body;
        const existingProduct = await prisma_1.default.product.findUnique({
            where: { sku },
        });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "A product with this SKU already exists",
            });
        }
        const product = await prisma_1.default.product.create({
            data: req.body,
        });
        res.status(201).json({
            success: true,
            product,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create product",
        });
    }
};
exports.createProduct = createProduct;
const getProducts = async (req, res) => {
    try {
        const products = await prisma_1.default.product.findMany();
        res.json({
            success: true,
            products,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
};
exports.getProducts = getProducts;
