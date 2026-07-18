import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

// Same signature "freshness dial" icon used on the Login page,
// so both auth screens feel like part of the same app.
function FreshnessMark() {
  return (
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#3F6C51] shadow-md shadow-[#3F6C51]/30">
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="none"
        stroke="#EEF3EA"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 14c0-6 4-10 10-10 1 6-1 10-4 12-3 2-6 1-6-2z" />
        <path d="M6 18c2-3 5-5 8-7" />
      </svg>
    </div>
  );
}

// Register page for the Smart Food Expiry and Pantry Manager app.
// This is a functional component that stores the name, email,
// and password fields in state using the useState hook.
export default function Register() {
  // One piece of state per form field.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // This function runs when the user submits the registration form.
  // It currently just prevents a page reload and logs the values,
  // since there is no backend connected yet.
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = await registerUser({
        name,
        email,
        password,
      });

      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    // Full-height, centered layout so the card always sits
    // in the middle of the screen on any device size.
    <div className="min-h-screen w-full bg-[#EEF3EA] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Card container: white background, soft shadow, rounded corners */}
        <div className="bg-white rounded-2xl shadow-xl shadow-[#3F6C51]/10 border border-[#3F6C51]/10 px-8 py-10">
          <FreshnessMark />

          <h1 className="text-center font-serif text-2xl font-semibold text-[#1F2A22]">
            Create your account
          </h1>
          <p className="text-center text-sm text-[#1F2A22]/60 mt-1 mb-8">
            Start tracking your pantry today
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#1F2A22] mb-1"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-[#1F2A22]/15 bg-[#FAFBF8] px-4 py-2.5 text-[#1F2A22] placeholder-[#1F2A22]/35 outline-none focus:border-[#3F6C51] focus:ring-2 focus:ring-[#3F6C51]/30 transition"
              />
            </div>

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1F2A22] mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#1F2A22]/15 bg-[#FAFBF8] px-4 py-2.5 text-[#1F2A22] placeholder-[#1F2A22]/35 outline-none focus:border-[#3F6C51] focus:ring-2 focus:ring-[#3F6C51]/30 transition"
              />
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1F2A22] mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#1F2A22]/15 bg-[#FAFBF8] px-4 py-2.5 text-[#1F2A22] placeholder-[#1F2A22]/35 outline-none focus:border-[#3F6C51] focus:ring-2 focus:ring-[#3F6C51]/30 transition"
              />
            </div>

            {/* Register button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#3F6C51] py-2.5 font-medium text-white shadow-sm hover:bg-[#345A43] active:bg-[#2C4B39] transition-colors"
            >
              Register
            </button>
          </form>

          {/* Link to the login page */}
          <p className="text-center text-sm text-[#1F2A22]/60 mt-6">
            Already have an account?{" "}
            <Link to="/login"
              className="font-medium text-[#3F6C51] hover:text-[#E3A542] transition-colors"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}