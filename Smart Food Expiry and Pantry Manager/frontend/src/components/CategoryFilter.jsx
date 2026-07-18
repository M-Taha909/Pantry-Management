import React from "react";

export default function CategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="rounded-lg border border-[#1F2A22]/15 bg-white px-4 py-2.5 outline-none focus:border-[#3F6C51] focus:ring-2 focus:ring-[#3F6C51]/30"
    >
      <option value="All">All Categories</option>

      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}