import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const PopularIssues = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [issueStats, setIssueStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Images for each issue type
  const issueImages = {
    "Potholes": "4c1f84c2-695d-4eba-bd85-2511c2dc7697.png",
    "Street Lights": "77407d4f-1483-4118-8987-e413b068ee3c.png",
    "Garbage Collection": "0a102ca3-0295-4a87-9af7-9f3bad50b1c9.png",
    "Water Supply": "c08abce3-e57e-4cae-bf2e-5d9974ab22ab.png",
    "Electricity Issues": "243bac1f-dc3e-4c09-b46e-ec4175c4ba92.png",
    "Other": "0a102ca3-0295-4a87-9af7-9f3bad50b1c9.png"
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      // Use API without authentication for public statistics if user is not logged in
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
      let headers = {};
      
      if (token) {
        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        headers = { Authorization: authToken };
      }

      const response = await axios.get(`${apiBaseUrl}/api/v1/complaints/statistics`, { headers });

      if (response.data.success && response.data.data.length > 0) {
        // Process issue type data
        processIssueStatistics(response.data.data);
      } else {
        // Use fallback data if no statistics are available
        useFallbackData();
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      useFallbackData();
    } finally {
      setLoading(false);
    }
  };

  // Process statistics data to extract issue type counts
  const processIssueStatistics = (statisticsData) => {
    // Combine data from all date ranges to get total counts
    const totalCounts = {
      "Potholes": 0,
      "Street Lights": 0,
      "Garbage Collection": 0,
      "Water Supply": 0,
      "Electricity Issues": 0,
      "Other": 0
    };

    // Sum counts across all date entries
    statisticsData.forEach(stat => {
      if (stat.issueTypeDistribution) {
        totalCounts["Potholes"] += stat.issueTypeDistribution.Potholes || 0;
        totalCounts["Street Lights"] += stat.issueTypeDistribution.StreetLights || 0;
        totalCounts["Garbage Collection"] += stat.issueTypeDistribution.GarbageCollection || 0;
        totalCounts["Water Supply"] += stat.issueTypeDistribution.WaterSupply || 0;
        totalCounts["Electricity Issues"] += stat.issueTypeDistribution.ElectricityIssues || 0;
        totalCounts["Other"] += stat.issueTypeDistribution.Other || 0;
      }
    });

    // Convert to array format for display
    const issueData = Object.entries(totalCounts).map(([name, reports]) => ({
      name,
      reports,
      img: issueImages[name] || issueImages["Other"]
    }));

    // Sort by number of reports (descending)
    const sortedIssues = issueData.sort((a, b) => b.reports - a.reports);
    
    setIssueStats(sortedIssues);
  };

  // Fallback to static data if API fails
  const useFallbackData = () => {
    setIssueStats([
      { name: "Potholes", reports: 3456, img: issueImages["Potholes"] },
      { name: "Street Lights", reports: 1890, img: issueImages["Street Lights"] },
      { name: "Garbage Collection", reports: 2345, img: issueImages["Garbage Collection"] },
      { name: "Water Supply", reports: 1234, img: issueImages["Water Supply"] },
      { name: "Electricity Issues", reports: 1678, img: issueImages["Electricity Issues"] },
    ]);
  };

  // Get visible issues for carousel
  const getVisibleIssues = () => {
    if (issueStats.length === 0) return [];
    
    return [
      issueStats[startIndex % issueStats.length],
      issueStats[(startIndex + 1) % issueStats.length],
      issueStats[(startIndex + 2) % issueStats.length],
    ];
  };

  const scroll = (direction) => {
    setStartIndex((prev) => {
      if (direction === "right") {
        return (prev + 1) % issueStats.length;
      } else {
        return (prev - 1 + issueStats.length) % issueStats.length;
      }
    });
  };

  // Wait for data to load
  if (loading) {
    return (
      <div className="w-full py-14 bg-sky-100 min-h-[300px] flex items-center justify-center">
        <div className="text-gray-600">Loading popular issues...</div>
      </div>
    );
  }

  // Get the visible issues for carousel
  const visibleIssues = getVisibleIssues();

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
