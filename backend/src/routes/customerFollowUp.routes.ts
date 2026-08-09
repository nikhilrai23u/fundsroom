import { Router } from "express";

import {
  createFollowUp,
  getFollowUps,
} from "../controllers/customerFollowUp.controller";

const router = Router();

router.post(
  "/customers/:id/followups",
  createFollowUp
);

router.get(
  "/customers/:id/followups",
  getFollowUps
);

export default router;