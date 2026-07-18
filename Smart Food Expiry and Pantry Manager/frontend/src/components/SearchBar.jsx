import React from "react";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <input
      type="text"
      placeholder="Search pantry items..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full sm:w-72 rounded-lg border border-[#1F2A22]/15 bg-white px-4 py-2.5 text-[#1F2A22] placeholder-[#1F2A22]/35 outline-none focus:border-[#3F6C51] focus:ring-2 focus:ring-[#3F6C51]/30 transition"
    />
  );
}