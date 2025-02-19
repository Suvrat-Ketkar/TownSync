import React from "react";

const CategorySelect = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    "Potholes",
    "Street Lights",
    "Garbage Collection",
    "Water Supply",
    "Electricity Issues",
    "Other"
  ];

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-gray-700 font-semibold">Select Issue Category:</label>
      <select
        className="border border-gray-300 rounded-md p-2"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Choose a category</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>{category}</option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;
