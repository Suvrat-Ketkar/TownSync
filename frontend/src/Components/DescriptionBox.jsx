import React from "react";

const DescriptionBox = ({ description, setDescription }) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-semibold mb-2">Description</label>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg resize-none h-28 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0FA4AF]"
        placeholder="Describe the issue in detail..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
};

export default DescriptionBox;
