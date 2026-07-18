// authService.js
// This file talks to our backend's authentication API.
// It uses Axios (a library for making HTTP requests) instead of
// the built-in fetch(), because Axios has a simpler syntax and
// some handy features like easily setting headers.

import axios from "axios";

// Create a reusable Axios "instance" that already knows the base
// URL of our auth API. This means in the functions below we only
// need to write the extra part of the path, like "/login",
// instead of the full URL every time.
const authApi = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// registerUser sends the new user's info to the backend so it
// can create an account for them.
// userData is expected to look something like:
// { name: "Jane Doe", email: "jane@example.com", password: "secret123" }
export async function registerUser(userData) {
  // POST means we are sending data to the server to create something new.
  const response = await authApi.post("/register", userData);

  // The actual useful info from the server lives in response.data,
  // so that's what we return instead of the whole response object.
  return response.data;
}

// loginUser sends the user's email and password to the backend
// so it can check them and log the user in.
// userData is expected to look something like:
// { email: "jane@example.com", password: "secret123" }
export async function loginUser(userData) {
  // POST because we are sending login credentials to be checked.
  const response = await authApi.post("/login", userData);

  // Return just the data part of the response (often includes
  // a token and/or user info).
  return response.data;
}

// getCurrentUser asks the backend "who is currently logged in?"
// It needs a token (usually saved after login) to prove the
// request is coming from an authenticated user.
export async function getCurrentUser(token) {
  // GET because we are only asking for information, not sending any.
  const response = await authApi.get("/me", {
    // Headers give the server extra information about the request.
    // Here we attach the token using the standard "Bearer" format,
    // which tells the server "trust this request, here's my proof
    // that I'm logged in."
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Return just the data part of the response (usually the
  // logged-in user's profile info).
  return response.data;
}