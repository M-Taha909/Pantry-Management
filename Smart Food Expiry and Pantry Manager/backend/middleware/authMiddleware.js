// middleware/authMiddleware.js

// Import jsonwebtoken so we can verify tokens that were signed with jwt.sign()
import jwt from "jsonwebtoken";

// "protect" is Express middleware — a function that runs BEFORE the actual
// route controller. It has access to (req, res, next):
//   - req:  the incoming request
//   - res:  used to send a response early if something's wrong
//   - next: a function we call to hand control over to the next
//           middleware/controller in line, if everything checks out
export const protect = (req, res, next) => {
  try {
    // The client is expected to send the token in the Authorization header,
    // in the format:  Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    // Check that the header exists AND starts with "Bearer "
    // If either is missing, there's no valid token to check
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // The header looks like "Bearer eyJhbGciOi...", so we split on the space
    // and take the second part — the actual token string
    const token = authHeader.split(" ")[1];

    // If somehow the token part is empty (e.g. header was just "Bearer "),
    // treat it the same as having no token
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // jwt.verify() checks two things at once:
    //   1. That the token's signature matches what we'd expect using our JWT_SECRET
    //      (proves it was created by us and hasn't been tampered with)
    //   2. That the token hasn't expired
    // If verification fails, it throws an error, which we catch below
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded now contains whatever we originally put in the token's payload
    // when we called jwt.sign({ userId }, ...) in generateToken.js
    // We attach it to req.user so that later controllers (like getCurrentUser)
    // can access the logged-in user's id via req.user.userId
    req.user = { userId: decoded.userId };

    // Everything checked out — call next() to pass control to the next
    // middleware or the actual route controller (e.g. getCurrentUser)
    next();
  } catch (error) {
    // This runs if jwt.verify() throws — meaning the token is invalid,
    // expired, or was tampered with
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
