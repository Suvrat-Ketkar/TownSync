import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PopularIssues = () => {
  const [startIndex, setStartIndex] = useState(0);

  const issues = [
    { name: "Pothole", reports: 3456, img: "4c1f84c2-695d-4eba-bd85-2511c2dc7697.png" },
    { name: "Graffiti", reports: 2345, img: "0a102ca3-0295-4a87-9af7-9f3bad50b1c9.png" },
    { name: "Sidewalk Repair", reports: 1234, img: "c08abce3-e57e-4cae-bf2e-5d9974ab22ab.png" },
    { name: "Traffic Sign Repair", reports: 5678, img: "243bac1f-dc3e-4c09-b46e-ec4175c4ba92.png" },
    { name: "Street Light Issue", reports: 1890, img: "77407d4f-1483-4118-8987-e413b068ee3c.png" },
  ];

  const visibleIssues = [
    issues[startIndex % issues.length],
    issues[(startIndex + 1) % issues.length],
    issues[(startIndex + 2) % issues.length],
  ];

  const scroll = (direction) => {
    setStartIndex((prev) => {
      if (direction === "right") {
        return (prev + 1) % issues.length;
      } else {
        return (prev - 1 + issues.length) % issues.length;
      }
    });
  };

  return (
    <div className="w-full py-14 bg-sky-100">
      <h1 className="text-3xl font-extrabold text-center text-gray-900 drop-shadow-md mb-10">
        🔥 Popular Issues in Your City
      </h1>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center bg-white rounded-full shadow-xl hover:bg-gray-200 transition-all border border-gray-300 sm:left-6 sm:w-12 sm:h-12"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-7 h-7 text-gray-700" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center bg-white rounded-full shadow-xl hover:bg-gray-200 transition-all border border-gray-300 sm:right-6 sm:w-12 sm:h-12"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-7 h-7 text-gray-700" />
        </button>

        {/* Rotating Cards */}
        <div className="flex overflow-x-auto sm:overflow-hidden w-full justify-center items-center gap-6">
          {visibleIssues.map((issue, index) => (
            <div
              key={index}
              className="w-full sm:w-1/3 px-4 transform transition-transform duration-500 ease-in-out hover:scale-105"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                <div className="relative w-full h-48 sm:h-64">
                  <div
                    className="absolute inset-0 bg-center bg-cover transition-opacity duration-500"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url(https://cdn.usegalileo.ai/sdxl10/${issue.img})`,
                    }}
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800">{issue.name}</h3>
                  <p className="text-md text-blue-600 font-medium">{issue.reports.toLocaleString()} reports</p>
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
