// controllers/authController.js

// bcryptjs lets us hash passwords (turn them into scrambled text) so we never
// store plain text passwords in the database, and compare a plain password
// against a hashed one during login
import bcrypt from "bcryptjs";

// Our Mongoose User model, used to read/write user documents in MongoDB
import User from "../models/User.js";

// Our helper function that creates a signed JWT for a given userId
import generateToken from "../utils/generateToken.js";

// ------------------------------------------------------------------
// @desc    Register a new user
// @route   POST /api/auth/register
// ------------------------------------------------------------------
export const registerUser = async (req, res) => {
  try {
    // Pull the fields we expect out of the request body
    const { name, email, password } = req.body;

    // Basic validation — make sure none of the required fields are missing
    // If any field is falsy (undefined, empty string, etc.), stop and respond
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email and password" });
    }

    // Check if a user with this email already exists
    // We use findOne() instead of find() because we only need a single match
    const userExists = await User.findOne({ email });

    if (userExists) {
      // 400 = Bad Request — the client sent data that conflicts with existing data
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate a "salt" — random data added to the password before hashing,
    // which makes the hash harder to crack. 10 is a common, reasonable cost factor.
    const salt = await bcrypt.genSalt(10);

    // Hash the plain text password using the salt we just generated
    // From now on, we only ever store/compare this hashed version, never the raw password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user in MongoDB with the hashed password
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate a JWT for this new user, so they're logged in immediately after registering
    const token = generateToken(user._id);

    // Respond with 201 (Created) since a new resource (the user) was successfully created
    // We manually pick which fields to send back — notice we do NOT include user.password
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    // If anything unexpected goes wrong (e.g. database error), respond with 500
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ------------------------------------------------------------------
// @desc    Login an existing user
// @route   POST /api/auth/login
// ------------------------------------------------------------------
export const loginUser = async (req, res) => {
  try {
    // Pull email and password from the request body
    const { email, password } = req.body;
    console.log("Login request received:", req.body);

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Look up the user by email
    const user = await User.findOne({ email });

    // If no user was found with that email, the credentials are invalid
    // We use a generic message ("Invalid credentials") instead of "email not found"
    // so we don't reveal to attackers which emails are registered
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the plain text password from the request with the hashed password
    // stored in the database. bcrypt.compare() hashes the plain text internally
    // using the same algorithm and checks if it matches — it returns true/false
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // 401 = Unauthorized — authentication failed
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Credentials are correct — generate a fresh JWT for this login session
    const token = generateToken(user._id);

    // Respond with user info (excluding password) and the token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ------------------------------------------------------------------
// @desc    Get the currently logged-in user's info
// @route   GET /api/auth/me
// @access  Private (expects auth middleware to have run first)
// ------------------------------------------------------------------
export const getCurrentUser = async (req, res) => {
  try {
    // This function assumes an authentication middleware has already run
    // before this controller, verified the JWT from the request, and attached
    // the logged-in user's id to req.user (e.g. req.user = { userId: "..." })
    // If you haven't built that middleware yet, this is where it plugs in.
    const user = await User.findById(req.user.userId).select("-password");
    // .select("-password") tells Mongoose to return the user document
    // WITHOUT the password field, so we never accidentally leak it

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};