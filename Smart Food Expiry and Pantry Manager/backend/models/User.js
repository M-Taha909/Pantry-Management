// models/User.js

// Import mongoose so we can define a schema and create a model from it
import mongoose from "mongoose";

// A "Schema" is like a blueprint that describes the shape of a document
// in a MongoDB collection — what fields it has, their types, and rules for each field
const userSchema = new mongoose.Schema(
  {
    // The user's name
    name: {
      type: String, // must be a string
      required: true, // this field must be provided, or Mongoose will throw a validation error
    },

    // The user's email address
    email: {
      type: String,
      required: true, // email must be provided
      unique: true, // no two users in the database can have the same email
      lowercase: true, // automatically converts the email to lowercase before saving
      // (helps avoid duplicate accounts like "Test@mail.com" vs "test@mail.com")
    },

    // The user's password
    // Note: in a real app, you should hash this (e.g. with bcrypt) before saving it —
    // never store plain text passwords in the database
    password: {
      type: String,
      required: true,
    },
  },
  {
    // The "timestamps" option tells Mongoose to automatically add and manage
    // two extra fields for us:
    //   - createdAt: set once, when the document is first created
    //   - updatedAt: updated automatically every time the document is modified
    timestamps: true,
  }
);

// A "Model" is a wrapper around the schema that gives us the actual tools
// to interact with the database — things like User.find(), User.create(), etc.
// mongoose.model(name, schema) will:
//   - use "User" as the model name
//   - create/use a MongoDB collection called "users" (Mongoose lowercases and pluralizes it)
const User = mongoose.model("User", userSchema);

// Export the model so we can import it in other files
// (e.g. in a controller: import User from "../models/User.js";)
export default User;