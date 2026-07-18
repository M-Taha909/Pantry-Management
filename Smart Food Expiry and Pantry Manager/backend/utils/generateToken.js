// utils/generateToken.js

// Import jsonwebtoken, the library used to create and verify JWTs (JSON Web Tokens)
// A JWT is a secure, compact way to represent a user's identity so they don't
// have to log in again on every request — the client sends this token instead
import jwt from "jsonwebtoken";

// This function creates a new JWT for a given user
// We only pass in the userId — we don't put sensitive info (like passwords) in the token,
// since the token's contents can be decoded (though not modified) by anyone who has it
const generateToken = (userId) => {
  // jwt.sign() creates and signs a new token. It takes three main things:
  //   1. Payload: the data we want to store inside the token (here, just the userId)
  //   2. Secret: a private key used to sign the token, so we can verify later
  //      that it wasn't tampered with. This should NEVER be shared or hardcoded —
  //      that's why we read it from process.env.JWT_SECRET
  //   3. Options: extra settings, like how long the token should stay valid
  const token = jwt.sign(
    { userId }, // payload — shorthand for { userId: userId }
    process.env.JWT_SECRET, // secret key used to sign the token
    { expiresIn: "30d" } // token will automatically become invalid after 30 days
  );

  // Return the signed token string so it can be sent back to the client
  // (usually included in the response after login/register, or set as a cookie)
  return token;
};

// Export the function so it can be used in other files
// (e.g. in an auth controller: import generateToken from "../utils/generateToken.js";)
export default generateToken;