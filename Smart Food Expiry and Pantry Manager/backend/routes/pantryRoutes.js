// routes/pantryRoutes.js
//
// This file wires up URLs (like "POST /api/pantry") to the
// controller functions that handle them. Every route here uses
// the "protect" middleware first, so a valid JWT is required
// before any pantry logic runs.

import express from "express";

const router = express.Router();

import {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem,
} from "../controllers/pantryController.js";

import { protect } from "../middleware/authMiddleware.js";

// POST /api/pantry -> create a new pantry item
router.post("/", protect, createItem);

// GET /api/pantry -> get all pantry items for the logged-in user
router.get("/", protect, getItems);

// GET /api/pantry/:id -> get one specific pantry item
router.get("/:id", protect, getItem);

// PUT /api/pantry/:id -> update one specific pantry item
router.put("/:id", protect, updateItem);

// DELETE /api/pantry/:id -> delete one specific pantry item
router.delete("/:id", protect, deleteItem);

export default router;
