import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "./HeroSection";
import PopularIssues from "./PopularIssues";

const Home = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0FA4AF] to-sky-100">
        <div className="text-gray-600 text-lg font-medium">Checking authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">You must be logged in to view this page.</p>
            <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      <PopularIssues />
    </>
  );
};

export default Home;
