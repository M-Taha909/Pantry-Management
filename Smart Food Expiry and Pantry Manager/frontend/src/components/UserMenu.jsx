import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-[#1F2A22]">
        {user?.name || "User"}
      </span>

      <button
        onClick={handleLogout}
        className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        Logout
      </button>
    </div>
  );
}