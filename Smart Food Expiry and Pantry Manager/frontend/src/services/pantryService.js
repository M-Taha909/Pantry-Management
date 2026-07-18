// src/services/pantryService.js
//
// This file talks to our backend's pantry API. It uses Axios and
// attaches the logged-in user's JWT token (saved in localStorage
// during login) to every request, so the backend knows who is asking.

import axios from "axios";

// Create a reusable Axios instance that already knows the base URL
// of our pantry API, so we only write the extra path (like "/:id")
// in the functions below.
const pantryApi = axios.create({
  baseURL: "http://localhost:5000/api/pantry",
});

// Small helper that builds the Authorization header using whatever
// token is currently saved in localStorage. We call this fresh
// inside every function (instead of once at the top of the file)
// so it always picks up the latest token, even if the user logs
// in or out without refreshing the page.
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

// createItem sends a new pantry item to the backend.
// itemData should look like:
// { name, category, quantity, unit, purchaseDate, expiryDate, estimatedPrice }
export async function createItem(itemData) {
  const response = await pantryApi.post("/", itemData, getAuthHeaders());
  return response.data;
}

// getItems fetches every pantry item that belongs to the logged-in user.
export async function getItems() {
  const response = await pantryApi.get("/", getAuthHeaders());
  return response.data;
}

// getItem fetches a single pantry item by its id.
export async function getItem(id) {
  const response = await pantryApi.get(`/${id}`, getAuthHeaders());
  return response.data;
}

// updateItem sends changes for an existing pantry item to the backend.
export async function updateItem(id, itemData) {
  const response = await pantryApi.put(`/${id}`, itemData, getAuthHeaders());
  return response.data;
}

// deleteItem removes a pantry item by its id.
export async function deleteItem(id) {
  const response = await pantryApi.delete(`/${id}`, getAuthHeaders());
  return response.data;
}