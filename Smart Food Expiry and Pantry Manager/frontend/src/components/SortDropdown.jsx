import React from "react";

export default function SortDropdown({ sortBy, setSortBy }) {
  return (
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="rounded-lg border border-[#1F2A22]/15 bg-white px-4 py-2.5 outline-none focus:border-[#3F6C51] focus:ring-2 focus:ring-[#3F6C51]/30"
    >
      <option value="expiry">Expiry Date</option>
      <option value="priceLow">Price: Low to High</option>
      <option value="priceHigh">Price: High to Low</option>
      <option value="az">Alphabetical A-Z</option>
      <option value="za">Alphabetical Z-A</option>
    </select>
  );
}