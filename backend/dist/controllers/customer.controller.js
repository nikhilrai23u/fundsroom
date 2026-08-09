"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomer = exports.getCustomerById = exports.getCustomers = exports.createCustomer = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
// =====================================
// CREATE CUSTOMER
// =====================================
const createCustomer = async (req, res) => {
    try {
        const { name, mobile, email, businessName, gstNumber, customerType, address, status, followUpDate, notes, } = req.body;
        // Validation
        if (!name ||
            !mobile ||
            !email ||
            !businessName ||
            !customerType ||
            !address ||
            !status) {
            return res.status(400).json({
                success: false,
                message: "Required customer fields are missing",
            });
        }
        const customer = await prisma_1.default.customer.create({
            data: {
                name,
                mobile,
                email,
                businessName,
                gstNumber: gstNumber || null,
                customerType,
                address,
                status,
                followUpDate: followUpDate
                    ? new Date(followUpDate)
                    : null,
                notes: notes || null,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Customer created successfully",
            customer,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create customer",
        });
    }
};
exports.createCustomer = createCustomer;
// =====================================
// GET ALL CUSTOMERS
// =====================================
const getCustomers = async (req, res) => {
    try {
        const search = typeof req.query.search === "string"
            ? req.query.search.trim()
            : "";
        const customers = await prisma_1.default.customer.findMany({
            where: search
                ? {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            businessName: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            mobile: {
                                contains: search,
                            },
                        },
                        {
                            email: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : undefined,
            include: {
                followUps: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });
        return res.json({
            success: true,
            customers,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch customers",
        });
    }
};
exports.getCustomers = getCustomers;
// =====================================
// GET CUSTOMER BY ID
// =====================================
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
            });
        }
        const customer = await prisma_1.default.customer.findUnique({
            where: {
                id,
            },
            include: {
                followUps: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                challans: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }
        return res.json({
            success: true,
            customer,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch customer",
        });
    }
};
exports.getCustomerById = getCustomerById;
// =====================================
// UPDATE CUSTOMER
// =====================================
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
            });
        }
        const { name, mobile, email, businessName, gstNumber, customerType, address, status, followUpDate, notes, } = req.body;
        const existingCustomer = await prisma_1.default.customer.findUnique({
            where: {
                id,
            },
        });
        if (!existingCustomer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }
        const customer = await prisma_1.default.customer.update({
            where: {
                id,
            },
            data: {
                ...(name !== undefined && { name }),
                ...(mobile !== undefined && { mobile }),
                ...(email !== undefined && { email }),
                ...(businessName !== undefined && {
                    businessName,
                }),
                ...(gstNumber !== undefined && {
                    gstNumber: gstNumber || null,
                }),
                ...(customerType !== undefined && {
                    customerType,
                }),
                ...(address !== undefined && {
                    address,
                }),
                ...(status !== undefined && {
                    status,
                }),
                ...(followUpDate !== undefined && {
                    followUpDate: followUpDate
                        ? new Date(followUpDate)
                        : null,
                }),
                ...(notes !== undefined && {
                    notes: notes || null,
                }),
            },
        });
        return res.json({
            success: true,
            message: "Customer updated successfully",
            customer,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update customer",
        });
    }
};
exports.updateCustomer = updateCustomer;
