// server.js

// Import express, the framework we use to build our web server and API routes
import express from "express";

import authRoutes from "./routes/authRoutes.js";
import pantryRoutes from "./routes/pantryRoutes.js";

// Import dotenv, which lets us load variables from a .env file into process.env
import dotenv from "dotenv";

// Import cors, which allows our frontend (running on a different port/domain)
// to make requests to this backend without being blocked by the browser
import cors from "cors";

// Import our custom function that connects to MongoDB
import connectDB from "./config/db.js";

import dashboardRoutes from "./routes/dashboardRoutes.js";``
import consumptionRoutes from "./routes/consumptionRoutes.js";
// Load variables from the .env file into process.env
// This MUST run before we use any process.env values (like MONGO_URI or PORT)
dotenv.config();

// Connect to the database before we start handling requests
// Since connectDB is async, it runs in the background but MongoDB
// will typically be ready before any real request comes in
connectDB();

// Create the express application — this "app" object is our server
const app = express();

// Enable CORS for all routes, so browsers on other origins
// (e.g. a React app running on http://localhost:3000) can call this API
app.use(cors());

// Enable built-in middleware that parses incoming JSON request bodies
// This lets us access data sent in POST/PUT requests via req.body
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/consume", consumptionRoutes);
// A simple test route to confirm the server is running
// Visiting http://localhost:5000/ in a browser should show this message
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Use the PORT from environment variables if it's set (useful for deployment),
// otherwise default to 5000 for local development
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests on the chosen port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});