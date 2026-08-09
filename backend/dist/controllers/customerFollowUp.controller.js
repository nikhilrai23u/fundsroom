"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowUps = exports.createFollowUp = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createFollowUp = async (req, res) => {
    try {
        const customerId = String(req.params.id);
        const { note } = req.body;
        if (!note || !note.trim()) {
            return res.status(400).json({
                success: false,
                message: "Follow-up note is required",
            });
        }
        const customer = await prisma_1.default.customer.findUnique({
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
        const followUp = await prisma_1.default.customerFollowUp.create({
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
    }
    catch (error) {
        console.error("CREATE FOLLOW-UP ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add follow-up",
        });
    }
};
exports.createFollowUp = createFollowUp;
const getFollowUps = async (req, res) => {
    try {
        const customerId = String(req.params.id);
        const followUps = await prisma_1.default.customerFollowUp.findMany({
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
    }
    catch (error) {
        console.error("GET FOLLOW-UPS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch follow-ups",
        });
    }
};
exports.getFollowUps = getFollowUps;
