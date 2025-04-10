import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AuthRequired from "../Components/AuthRequired";

const NearbyComplaints = () => {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(3); // 3km radius by default

  if (!user) {
    return <AuthRequired message="You need to be logged in to view nearby complaints" />;
  }

  useEffect(() => {
    // First get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          fetchNearbyComplaints(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Unable to get your location. Please enable location services in your browser.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  const fetchNearbyComplaints = async (latitude, longitude) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("Authentication required - please log in");
        setLoading(false);
        return;
      }

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
      if (!apiBaseUrl) {
        setError("API Base URL is missing in environment variables");
        setLoading(false);
        return;
      }

      
      // Make API call to fetch nearby complaints with the current radius
      const response = await axios.get(`${apiBaseUrl}/api/v1/complaints/nearby-complaints`, {
        headers: { 
          Authorization: `Bearer ${accessToken}`
          },
        params: {
          latitude,
          longitude,
          maxDistance: radius * 1000 // Convert km to meters
        }
      });
      
      if (response.data.success) {
        setComplaints(response.data.complaints);
      } else {
        setError("Failed to fetch nearby complaints");
      }
    } catch (error) {
      console.error("Error fetching nearby complaints:", error);
      setError(error.response?.data?.message || "Failed to fetch nearby complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value);
    setRadius(newRadius);
    if (userLocation) {
      setLoading(true);
      fetchNearbyComplaints(userLocation.latitude, userLocation.longitude);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Locating nearby complaints...</p>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Location Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/home" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex flex-col items-center p-6 pt-20">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Nearby Complaints</h1>
        <p className="text-gray-600 text-center mb-8">
          {userLocation ? 
            `Showing complaints within ${radius}km of your location` : 
            "Location data not available"}
        </p>

        <div className="bg-white p-4 rounded-lg shadow-md mb-8 max-w-md mx-auto">
          <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-2">
            Distance radius: {radius} km
          </label>
          <input
            type="range"
            id="radius"
            name="radius"
            min="1"
            max="10"
            step="1"
            value={radius}
            onChange={handleRadiusChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1km</span>
            <span>5km</span>
            <span>10km</span>
          </div>
        </div>

        {complaints.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto text-center">
            <div className="text-gray-400 text-5xl mb-4">📍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Nearby Complaints</h2>
            <p className="text-gray-600 mb-6">There are no reported issues within {radius}km of your location.</p>
            <Link to="/report" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
              Report an Issue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((complaint) => (
              <Link 
                key={complaint._id}
                to={`/detail/${complaint._id}`} 
                className="block transform transition hover:scale-[1.02]"
              >
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  {/* Complaint Image */}
                  <div className="relative mb-4 h-48 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={complaint.Image}
                      alt={complaint.Issue_Type}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/800x400?text=No+Image+Available';
                      }}
                    />
                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-bold ${
                      complaint.Status === 'Resolved' ? 'bg-green-100 text-green-600' : 
                      complaint.Status === 'Rejected' ? 'bg-red-100 text-red-600' : 
                      complaint.Status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {complaint.Status}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white bg-opacity-80 px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                        View Details
                      </span>
                    </div>
                  </div>

                  {/* Complaint Info */}
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {complaint.Issue_Type === 'Other' ? complaint.Custom_Issue_Type || 'Other Issue' : complaint.Issue_Type}
                  </h2>
                  
                  <div className="text-gray-500 text-sm flex-grow">
                    <p className="mb-1 line-clamp-2">{complaint.Issue_Description}</p>
                    {complaint.address && (
                      <p className="mt-2 font-medium">
                        📍 {complaint.address.length > 30 ? complaint.address.substring(0, 30) + '...' : complaint.address}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {complaint.complaint_ID ? `#${complaint.complaint_ID}` : ''}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(complaint.createdAt || complaint.Date_of_report).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link 
            to="/report" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300"
          >
            Report New Issue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NearbyComplaints; 