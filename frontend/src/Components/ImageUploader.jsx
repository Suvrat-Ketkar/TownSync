import React, { useState } from "react";
import { Camera, X, Plus } from "lucide-react";

const ImageUploader = ({ images, handleCapture, removeImage }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState(0);

  const toggleExpand = (index = 0) => {
    setExpandedImageIndex(index);
    setIsExpanded(!isExpanded);
  };

  if (isExpanded && images && images.length > 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4" onClick={() => toggleExpand()}>
        <div className="relative max-w-full max-h-full">
          <img 
            src={images[expandedImageIndex]} 
            alt={`Full size preview ${expandedImageIndex + 1}`} 
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button 
            className="absolute top-4 right-4 bg-white bg-opacity-70 rounded-full p-2 text-black hover:bg-opacity-100"
            onClick={() => toggleExpand()}
          >
            <X size={24} />
          </button>
          
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button 
                  key={index} 
                  className={`w-3 h-3 rounded-full ${index === expandedImageIndex ? 'bg-white' : 'bg-gray-400'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedImageIndex(index);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 text-center">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Render uploaded images */}
          {images && images.length > 0 ? (
            <>
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`Captured Issue ${index + 1}`} 
                    className="w-full h-48 object-contain bg-gray-100 rounded-lg shadow-md cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => toggleExpand(index)}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleExpand(index)}
                      className="p-2 bg-white bg-opacity-75 hover:bg-opacity-100 transition-all rounded-full shadow-md text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"/>
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 bg-white bg-opacity-75 hover:bg-opacity-100 transition-all rounded-full shadow-md text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Add more images button (if less than max allowed) */}
              {images.length < 5 && (
                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    <Plus className="w-12 h-12 text-gray-500" />
                    <span className="text-gray-600 text-sm mt-2">Add More Images</span>
                    <span className="text-gray-400 text-xs mt-1">({5 - images.length} remaining)</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    className="hidden" 
                    onChange={handleCapture} 
                    multiple
                  />
                </label>
              )}
            </>
          ) : (
            // Initial upload state
            <div className="md:col-span-3">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <Camera className="w-12 h-12 text-gray-500" />
                  <span className="text-gray-600 mt-2 font-medium">Capture or Upload Images</span>
                  <span className="text-gray-400 text-sm mt-1">Upload up to 5 images</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                  onChange={handleCapture} 
                  multiple
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
