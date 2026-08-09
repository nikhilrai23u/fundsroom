import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import { protect, AuthRequest } from "./middleware/auth.middleware";
import customerRoutes from "./routes/customer.routes";

import productRoutes from "./routes/product.routes";
import challanRoutes from "./routes/challan.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import customerFollowUpRoutes from "./routes/customerFollowUp.routes";
import stockMovementRoutes from "./routes/stockMovement.routes";


const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fundsroom-eosin.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use(
  "/api/challans",
  challanRoutes
);
app.use("/api/dashboard", dashboardRoutes);
app.use(
  "/api",
  customerFollowUpRoutes
);
app.use("/api/stock-movements", stockMovementRoutes);

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "FundsRoom ERP API",
  });
});

app.get(
  "/profile",
  protect,
  (req: AuthRequest, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);

export default app;