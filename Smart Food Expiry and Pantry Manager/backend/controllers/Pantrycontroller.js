// controllers/pantryController.js
//
// This file contains the actual logic for each pantry endpoint:
// create, read (all + single), update, and delete.
// Every function here assumes the "protect" auth middleware has
// already run, so req.user.userId is available and trustworthy.

import mongoose from "mongoose";
import PantryItem from "../models/PantryItem.js";

// Small helper to turn Mongoose validation errors into a simple,
// readable list of messages for the client.
function formatValidationError(error) {
  return Object.values(error.errors).map((err) => err.message);
}

// Small helper to check whether a string is a valid MongoDB ObjectId.
// This lets us return a clean 400 instead of a confusing 500 when
// someone passes a badly formatted :id in the URL.
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// @desc    Create a new pantry item for the logged-in user
// @route   POST /api/pantry
// @access  Private
async function createItem(req, res) {
  try {
    const {
      name,
      category,
      quantity,
      unit,
      purchaseDate,
      expiryDate,
      estimatedPrice,
    } = req.body;

    // Create the item, forcing "user" to be the logged-in user's id.
    // We never trust a "user" field from the request body, so that
    // one person can't create items on behalf of someone else.
  const item = await PantryItem.create({
    user: req.user.userId,
    name,
    category,
    quantity,
    remainingQuantity: quantity,
    consumedQuantity: 0,
    unit,
    purchaseDate,
    expiryDate,
    estimatedPrice,
  });

    // 201 Created: a new resource now exists.
    return res.status(201).json({ data: item });
  } catch (error) {
    // Mongoose validation errors (bad quantity, bad dates, etc.)
    // come through as error.name === "ValidationError".
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: formatValidationError(error) });
    }

    console.error("createItem error:", error);
    return res.status(500).json({ message: "Something went wrong creating the item" });
  }
}

// @desc    Get all pantry items belonging to the logged-in user
// @route   GET /api/pantry
// @access  Private
async function getItems(req, res) {
  try {
    // Only fetch items where "user" matches the logged-in user,
    // so nobody can see anyone else's pantry.
    const items = await PantryItem.find({ user: req.user.userId }).sort({
      expiryDate: 1, // soonest-to-expire items first
    });

    return res.status(200).json({ data: items });
  } catch (error) {
    console.error("getItems error:", error);
    return res.status(500).json({ message: "Something went wrong fetching items" });
  }
}

// @desc    Get a single pantry item by id
// @route   GET /api/pantry/:id
// @access  Private
async function getItem(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const item = await PantryItem.findById(id);

    // 404: the item simply doesn't exist.
    if (!item) {
      return res.status(404).json({ message: "Pantry item not found" });
    }

    // 403: the item exists, but it belongs to someone else.
    if (item.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You do not have access to this item" });
    }

    return res.status(200).json({ data: item });
  } catch (error) {
    console.error("getItem error:", error);
    return res.status(500).json({ message: "Something went wrong fetching the item" });
  }
}

// @desc    Update a pantry item by id
// @route   PUT /api/pantry/:id
// @access  Private
async function updateItem(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const item = await PantryItem.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Pantry item not found" });
    }

    if (item.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You do not have access to this item" });
    }

    // Only update fields that were actually sent in the request body,
    // so a partial update doesn't accidentally wipe other fields.
    const editableFields = [
      "name",
      "category",
      "quantity",
      "unit",
      "purchaseDate",
      "expiryDate",
      "estimatedPrice",
    ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      item[field] = req.body[field];
    }
  });

  /*
    Keep inventory consistency:

    remainingQuantity =
        quantity - consumedQuantity
  */

  if (
    item.quantity <
    (item.consumedQuantity || 0)
  ) {
    return res.status(400).json({
      message:
        `Quantity cannot be less than already consumed quantity (${item.consumedQuantity || 0}).`
    });
  }

  item.remainingQuantity =
    item.quantity -
    (item.consumedQuantity || 0);

  const updatedItem = await item.save();

    return res.status(200).json({ data: updatedItem });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: formatValidationError(error) });
    }

    console.error("updateItem error:", error);
    return res.status(500).json({ message: "Something went wrong updating the item" });
  }
}

// @desc    Delete a pantry item by id
// @route   DELETE /api/pantry/:id
// @access  Private
async function deleteItem(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const item = await PantryItem.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Pantry item not found" });
    }

    if (item.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You do not have access to this item" });
    }

    await item.deleteOne();

    // 204 No Content: the delete worked, and there's nothing to send back.
    return res.status(204).send();
  } catch (error) {
    console.error("deleteItem error:", error);
    return res.status(500).json({ message: "Something went wrong deleting the item" });
  }
}

export {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem
};