// models/PantryItem.js
//
// This file defines the shape of a "pantry item" document in MongoDB,
// using Mongoose. Each pantry item belongs to exactly one user.

import mongoose from "mongoose";
const { Schema } = mongoose;

const pantryItemSchema = new Schema(
  {
    // Reference to the User who owns this pantry item.
    // "ref: User" lets us later populate() this field with the
    // full user document if we ever need it.
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true, // speeds up queries like "find all items for this user"
    },

    // The name of the pantry item, e.g. "Milk", "Rice".
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // A free-text or enum-like category, e.g. "Dairy", "Grains".
    category: {
      type: String,
      trim: true,
      default: "Uncategorized",
    },

    // How much of the item is in stock. Must be greater than 0.
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      validate: {
        validator: (value) => value > 0,
        message: "Quantity must be greater than 0",
      },
    },

    // The unit that quantity is measured in, e.g. "kg", "pcs", "liters".
    unit: {
      type: String,
      trim: true,
      default: "pcs",
    },

    // When the item was purchased.
    purchaseDate: {
      type: Date,
      required: [true, "Purchase date is required"],
    },

    // When the item is expected to expire.
    // We validate that this is strictly after purchaseDate below,
    // since "this" only works reliably with a regular function
    // (not an arrow function) inside a Mongoose validator.
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
      validate: {
        validator: function (value) {
          // "this" refers to the document being validated.
          // Skip the check if purchaseDate isn't set yet (required
          // will already catch that case separately).
          if (!this.purchaseDate) return true;
          return value > this.purchaseDate;
        },
        message: "Expiry date must be after purchase date",
      },
    },

    // How much the item cost. Can be 0 (e.g. free sample) but not negative.
    estimatedPrice: {
      type: Number,
      required: [true, "Estimated price is required"],
      min: [0, "Estimated price cannot be negative"],
    },


  consumedQuantity: {
      type: Number,
      default: 0
  },

  remainingQuantity: {
      type: Number,
      default: function () {
          return this.quantity;
      }
  },

  lastConsumedAt: {
      type: Date,
      default: null
  },

  consumptionHistory: [
      {
          quantity: Number,
          consumedAt: {
              type: Date,
              default: Date.now
          }
      }
  ],
  },
  {
    // Automatically adds createdAt and updatedAt fields,
    // and keeps them updated whenever a document changes.
    timestamps: true,
  }
);

const PantryItem = mongoose.model(
    "PantryItem",
    pantryItemSchema
);

export default PantryItem;
