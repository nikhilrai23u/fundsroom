"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.protect, product_controller_1.createProduct);
router.get("/", auth_middleware_1.protect, product_controller_1.getProducts);
exports.default = router;
