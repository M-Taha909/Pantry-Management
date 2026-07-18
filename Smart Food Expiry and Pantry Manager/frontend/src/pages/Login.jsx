import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

// Small leaf-in-circle "freshness dial" icon.
// This is the signature mark reused on Login, Register, and Dashboard
// so the app feels like one connected product.
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
        {/* Simple leaf shape to represent "fresh" food */}
        <path d="M4 14c0-6 4-10 10-10 1 6-1 10-4 12-3 2-6 1-6-2z" />
        <path d="M6 18c2-3 5-5 8-7" />
      </svg>
    </div>
  );
}

// Login page for the Smart Food Expiry and Pantry Manager app.
// This is a functional component that keeps track of the email
// and password fields using the useState hook.
export default function Login() {
  // These two pieces of state hold whatever the user types in.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // This function runs when the user submits the form.
  // Right now it just prevents the page from reloading and
  // logs the values, since there is no backend connected yet.
    const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
        const data = await loginUser({
        email,
        password,
        });

        localStorage.setItem(
        "token",
        data.token
        );

        localStorage.setItem(
        "user",
        JSON.stringify({
        name: data.name,
        email: data.email
        })
        );

        navigate("/dashboard");
    } catch (err) {
        console.error(err);

        setError(
        err.response?.data?.message ||
        "Login failed. Please try again."
        );
    } finally {
        setIsLoading(false);
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
            Welcome back
          </h1>
          <p className="text-center text-sm text-[#1F2A22]/60 mt-1 mb-8">
            Log in to keep your pantry fresh
          </p>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
            </div>
            )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Login button */}
            <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#3F6C51] py-2.5 font-medium text-white shadow-sm hover:bg-[#345A43] active:bg-[#2C4B39] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
            {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Link to the register page */}
          <p className="text-center text-sm text-[#1F2A22]/60 mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register"
              className="font-medium text-[#3F6C51] hover:text-[#E3A542] transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}