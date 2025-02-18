import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PopularIssues = () => {
  const [startIndex, setStartIndex] = useState(0);

  const issues = [
    { name: "Pothole", reports: 3456, img: "4c1f84c2-695d-4eba-bd85-2511c2dc7697.png" },
    { name: "Graffiti", reports: 2345, img: "0a102ca3-0295-4a87-9af7-9f3bad50b1c9.png" },
    { name: "Sidewalk Repair", reports: 1234, img: "c08abce3-e57e-4cae-bf2e-5d9974ab22ab.png" },
    { name: "Traffic Sign Repair", reports: 5678, img: "243bac1f-dc3e-4c09-b46e-ec4175c4ba92.png" },
    { name: "Street Light Issue", reports: 1890, img: "e6e92a64-d6e8-4d3a-84a8-fb2dd5c283f9.png" },
  ];

  const visibleIssues = [
    issues[startIndex % issues.length],
    issues[(startIndex + 1) % issues.length],
    issues[(startIndex + 2) % issues.length],
  ];

  const scroll = (direction) => {
    setStartIndex((prev) => {
      if (direction === "right") {
        return (prev + 1) % issues.length; // Wrap around correctly
      } else {
        return (prev - 1 + issues.length) % issues.length; // Ensure no negative index
      }
    });
  };
  
  return (
    <div className="w-full bg-gradient-to-b from-sky-100 to-sky-50 py-8">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">Popular Issues</h1>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>

        {/* Rotating Cards */}
        <div className="flex overflow-hidden w-full justify-center items-center">
          {visibleIssues.map((issue, index) => (
            <div
              key={index}
              className="w-1/3 px-3 transform transition-transform duration-500 ease-in-out"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative w-full h-56">
                  <div
                    className="absolute inset-0 bg-center bg-cover"
                    style={{ backgroundImage: `url(https://cdn.usegalileo.ai/sdxl10/${issue.img})` }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{issue.name}</h3>
                  <p className="text-sm text-blue-600">{issue.reports.toLocaleString()} reports</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularIssues;
