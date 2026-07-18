// config/db.js
 
// Import mongoose, the library we use to talk to MongoDB from Node.js
import mongoose from "mongoose";
 
// This is an async function because connecting to a database takes time
// and we need to "await" the result instead of blocking the whole app
const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise, so we "await" it.
    // process.env.MONGO_URI reads the connection string from our .env file
    // (keeping it in an environment variable means we never hardcode secrets in code)
    const conn = await mongoose.connect(process.env.MONGO_URI);
 
    // If we reach this line, the connection succeeded.
    // conn.connection.host tells us which database host we connected to,
    // which is handy for confirming we're pointed at the right database (local vs cloud, etc.)
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If mongoose.connect() throws an error, we land here instead of crashing silently.
    // Logging the error message helps us debug what went wrong (bad URI, network issue, etc.)
    console.error(`Error connecting to MongoDB: ${error.message}`);
 
    // process.exit(1) stops the Node.js process immediately.
    // Exit code 1 means "something went wrong" (as opposed to 0, which means success).
    // We do this because the app can't function without a database connection,
    // so it's better to fail fast than to keep running in a broken state.
    process.exit(1);
  }
};

export default connectDB;