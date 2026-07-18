import express from "express";

import {
  getNotifications,
  getFinancialSummary,
  getCategoryStats,
  getStats,
  getConsumeFirst
} from "../controllers/dashboardController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/stats",
  protect,
  getStats
);

router.get(
  "/notifications",
  protect,
  getNotifications
);

router.get(
  "/financial-summary",
  protect,
  getFinancialSummary
);

router.get(
  "/category-stats",
  protect,
  getCategoryStats
);

router.get(
  "/consume-first",
  protect,
  getConsumeFirst
);

export default router;
