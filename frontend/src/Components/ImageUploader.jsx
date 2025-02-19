import React from "react";
import { Camera } from "lucide-react";

const ImageUploader = ({ image, handleCapture }) => {
  return (
    <div className="mb-6 text-center">
      {image ? (
        <img src={image} alt="Captured Issue" className="w-full h-64 object-cover rounded-lg shadow-md" />
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
          <Camera className="w-12 h-12 text-gray-500" />
          <span className="text-gray-600 mt-2">Capture or Upload an Image</span>
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
