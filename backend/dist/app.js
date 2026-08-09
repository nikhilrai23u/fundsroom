"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const challan_routes_1 = __importDefault(require("./routes/challan.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const customerFollowUp_routes_1 = __importDefault(require("./routes/customerFollowUp.routes"));
const stockMovement_routes_1 = __importDefault(require("./routes/stockMovement.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/customers", customer_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/challans", challan_routes_1.default);
app.use("/api/dashboard", dashboard_routes_1.default);
app.use("/api", customerFollowUp_routes_1.default);
app.use("/api/stock-movements", stockMovement_routes_1.default);
app.get("/", (_, res) => {
    res.json({
        success: true,
        message: "FundsRoom ERP API",
    });
});
app.get("/profile", auth_middleware_1.protect, (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});
exports.default = app;
