import { Router } from "express";

import {
  createChallan,
  getChallans,
  getChallanById,
  updateDraftChallan,
  confirmChallan,
  cancelChallan
} from "../controllers/challan.controller";

import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  protect,
  createChallan
);

router.get(
  "/",
  protect,
  getChallans
);

router.get(
  "/:id",
  protect,
  getChallanById
);

router.put(
  "/:id",
  protect,
  updateDraftChallan
);

router.post(
  "/:id/confirm",
  protect,
  confirmChallan
);

router.post(
  "/:id/cancel",
  protect,
  cancelChallan
);

export default router;