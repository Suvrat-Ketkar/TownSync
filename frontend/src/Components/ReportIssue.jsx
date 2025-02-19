import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import CategorySelector from "./CategorySelector";
import DescriptionBox from "./DescriptionBox";

const ReportIssue = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Report an Issue</h1>

        {/* Image Upload */}
        <ImageUploader image={image} handleCapture={handleCapture} />

        {/* Category Selection */}
        <CategorySelector selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        {/* Description */}
        <DescriptionBox description={description} setDescription={setDescription} />

        {/* Submit Button */}
        <div className="text-center">
          <button className="h-12 w-full rounded-full bg-[#0FA4AF] text-white font-semibold text-lg shadow-md hover:bg-[#0E7490] transition-all">
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
