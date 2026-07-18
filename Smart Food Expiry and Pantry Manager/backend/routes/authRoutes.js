// routes/authRoutes.js

// Import Express so we can use its Router feature
import express from "express";

// Import the controller functions that contain the actual logic
// for each route (we keep routes and logic separate for cleaner code)
import { registerUser, loginUser, getCurrentUser } from "../controllers/authController.js";

// Import our authentication middleware, which checks the JWT on protected routes
// and attaches the logged-in user's info to req.user before letting the request continue
// NOTE: this file (middleware/authMiddleware.js) needs to exist for GET /me to work —
// let me know if you'd like me to create it next
import { protect } from "../middleware/authMiddleware.js";

// A "Router" is a mini version of an Express app — it lets us group related
// routes together (all our auth routes) and later plug them into the main app
const router = express.Router();

// ------------------------------------------------------------------
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public — anyone can call this, no login required
// ------------------------------------------------------------------
// When a POST request hits "/register", Express calls registerUser(req, res)
router.post("/register", registerUser);

// ------------------------------------------------------------------
// @route   POST /api/auth/login
// @desc    Log in an existing user
// @access  Public
// ------------------------------------------------------------------
router.post("/login", loginUser);

// ------------------------------------------------------------------
// @route   GET /api/auth/me
// @desc    Get the currently logged-in user's info
// @access  Private — requires a valid JWT
// ------------------------------------------------------------------
// Notice this route has TWO functions: "protect" runs first as middleware.
// If the token is valid, it calls next() and Express moves on to getCurrentUser.
// If the token is missing/invalid, protect stops the request and sends an error response,
// so getCurrentUser never even runs.
router.get("/me", protect, getCurrentUser);

// Export the router so it can be imported and mounted in server.js
// (e.g. in server.js: app.use("/api/auth", authRoutes);)
export default router;