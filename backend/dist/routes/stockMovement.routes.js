"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stockMovement_controller_1 = require("../controllers/stockMovement.controller");
const router = (0, express_1.Router)();
router.get("/", stockMovement_controller_1.getStockMovements);
exports.default = router;
