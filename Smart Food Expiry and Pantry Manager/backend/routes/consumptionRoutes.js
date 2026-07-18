import express from "express";
import { consumeItem } from "../controllers/consumptionController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/:id",
    protect,
    consumeItem
);

export default router;