"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerFollowUp_controller_1 = require("../controllers/customerFollowUp.controller");
const router = (0, express_1.Router)();
router.post("/customers/:id/followups", customerFollowUp_controller_1.createFollowUp);
router.get("/customers/:id/followups", customerFollowUp_controller_1.getFollowUps);
exports.default = router;
