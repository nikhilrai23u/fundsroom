import { Router } from "express";
import {
  createProduct,
  getProducts,
} from "../controllers/product.controller";

import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, createProduct);
router.get("/", protect, getProducts);

export default router;