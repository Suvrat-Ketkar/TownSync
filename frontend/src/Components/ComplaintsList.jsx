import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AuthRequired from "../Components/AuthRequired"; // ✅ Import the component

const ComplaintsList = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!user) {
        setError("not-authenticated");
        setLoading(false);
        return;
      }

      try {
        const token = user?.token || localStorage.getItem("accessToken");
        const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
        console.log(`${apiBaseUrl}/api/v1/complaints/user`);
        try {
          const res = await axios.get(`${apiBaseUrl}/api/v1/complaints/user`, {
            headers: { Authorization: authToken },
          });
          console.log(res.data);
          if (res.data.success) {
            setComplaints(res.data.data);
            setLoading(false);
            return;
          }
        } catch {
          console.log("User complaints fetch failed, trying nearby");
        }

        try {
          const res = await axios.get(`${apiBaseUrl}/api/v1/complaints/nearby-complaints`, {
            headers: { Authorization: authToken },
          });
          if (res.data.success) {
            setComplaints(res.data.complaints);
          } else {
            setError("Failed to fetch complaints");
          }
        } catch (err) {
          console.error("Error fetching nearby:", err);
          setError(err.response?.data?.message || "Failed to fetch nearby complaints");
        }
      } catch (err) {
        console.error("Error fetching complaints:", err);
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading complaints...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error === "not-authenticated") {
    return <AuthRequired message="You must be logged in to view your complaints." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Complaints</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
              Login Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-gray-400 text-5xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Complaints Found</h2>
            <p className="text-gray-600 mb-6">You haven't reported any complaints yet.</p>
            <Link to="/report" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
              Report an Issue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex flex-col items-center p-6 pt-20">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Complaints</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <Link
              key={complaint._id}
              to={`/detail/${complaint._id}`}
              className="block transform transition hover:scale-[1.02]"
            >
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="relative mb-4 h-48 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={complaint.Image}
                    alt={complaint.Issue_Type}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/800x400?text=No+Image+Available";
                    }}
                  />
                  <div
                    className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-bold ${
                      complaint.Status === "Resolved"
                        ? "bg-green-100 text-green-600"
                        : complaint.Status === "Rejected"
                        ? "bg-red-100 text-red-600"
                        : complaint.Status === "In Progress"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {complaint.Status}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white bg-opacity-80 px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                      View Details
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {complaint.Issue_Type === "Other" ? complaint.Custom_Issue_Type || "Other Issue" : complaint.Issue_Type}
                </h2>

                <div className="text-gray-500 text-sm flex-grow">
                  <p className="mb-1 line-clamp-2">{complaint.Issue_Description}</p>
                  {complaint.address && (
                    <p className="mt-2 font-medium">
                      📍 {complaint.address.length > 30 ? complaint.address.substring(0, 30) + "..." : complaint.address}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {complaint.complaint_ID ? `#${complaint.complaint_ID}` : ""}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(complaint.createdAt || complaint.Date_of_report).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

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

export default ComplaintsList;
