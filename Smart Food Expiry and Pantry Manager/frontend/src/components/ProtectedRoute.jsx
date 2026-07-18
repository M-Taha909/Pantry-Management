import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // No token -> send user back to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists -> allow access
  return children;
}