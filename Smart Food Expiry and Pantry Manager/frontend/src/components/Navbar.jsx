import React from "react";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-[#3F6C51]/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Left Side */}
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-xl font-bold text-[#3F6C51]"
          >
            Pantry Manager
          </Link>

          <Link
            to="/dashboard"
            className="text-[#1F2A22]/70 hover:text-[#3F6C51]"
          >
            Dashboard
          </Link>

          <Link
            to="/pantry"
            className="text-[#1F2A22]/70 hover:text-[#3F6C51]"
          >
            Pantry
          </Link>
          
          <Link
            to="/pantry/add"
            className="text-[#1F2A22]/70 hover:text-[#3F6C51]"
          >
            Add Item
          </Link>
        </div>

        {/* Right Side */}
        <UserMenu />
      </div>
    </nav>
  );
}