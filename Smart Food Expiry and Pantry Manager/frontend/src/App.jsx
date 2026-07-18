import React from "react";
// Routes and Route let us define which page shows for which URL.
// Navigate lets us redirect from one path to another.
import { Routes, Route, Navigate } from "react-router-dom";


// Import the three pages we built for the app.
import Pantry from "./pages/Pantry";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import ProtectedRoute from "./components/ProtectedRoute";

// App is the top-level component that controls page routing.
// Note: in React Router v7, this <Routes> tree usually sits inside
// a <BrowserRouter> that wraps <App /> in your main.jsx / index.jsx file.
export default function App() {
  return (
    <Routes>
      {/* "/" is the home path. When someone visits the site root,
          send them straight to the login page instead of showing
          a blank page. "replace" avoids adding an extra step to
          the browser's back button history. */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* "/login" shows the Login page, where users sign in. */}
      <Route path="/login" element={<Login />} />

      {/* "/register" shows the Register page, where new users
          create an account. */}
      <Route path="/register" element={<Register />} />

      {/* "/dashboard" shows the Dashboard page, the main screen
          users see after logging in. */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pantry"
        element={
          <ProtectedRoute>
            <Pantry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pantry/add"
        element={
          <ProtectedRoute>
            <AddItem />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pantry/edit/:id"
        element={
          <ProtectedRoute>
            <EditItem />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}