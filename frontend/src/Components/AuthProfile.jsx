import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
export const AuthProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Authentication required - please log in");
        setLoading(false);
        return;
      }

      const userData = decodeToken(token);
      if (!userData || !userData.email) {
        setError("Invalid token data.");
        setLoading(false);
        return;
      }

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      const response = await axios.get(`${apiBaseUrl}/api/v1/authority/profile`, {
        headers: { Authorization: authToken },
      });

      if (response.data.success) {
        setUser(response.data.data);
      } else {
        setError("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError(`Failed to fetch profile: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0FA4AF] to-sky-100 px-4">
        <h2 className="text-2xl font-semibold text-white mb-4">{error}</h2>
        <Link to="/login" className="bg-white text-[#0E7490] px-6 py-2 rounded-full font-semibold text-base shadow-md transition-all duration-300 hover:bg-[#FFD700] hover:text-[#0E141B] hover:shadow-lg">
          Go to Login
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen pt-24 pb-10 bg-gradient-to-b from-[#0FA4AF] to-sky-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#0FA4AF] to-[#0E7490] px-6 py-8 text-center">
          <div className="inline-block bg-white p-2 rounded-full mb-4">
            <div className="bg-gray-200 h-24 w-24 rounded-full flex items-center justify-center">
              <span className="text-4xl text-blue-500 font-semibold">
                {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">{user.contactEmail || 'User'}</h1>
        </div>
        
        <div className="p-6 sm:p-10">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Account Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{user.contactEmail || 'Not available'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Department</span>
                  <span className="font-medium">{user.department || 'Not assigned'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Role</span>
                  <span className="font-medium">{user.role || 'Not assigned'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Account Status</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Active</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-center">
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow transition-colors duration-300 flex items-center gap-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
