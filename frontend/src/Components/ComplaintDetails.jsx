import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ComplaintDetails = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Authentication required - please log in");
          setLoading(false);
          return;
        }

        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        if (!apiBaseUrl) {
          setError("API Base URL is missing in environment variables");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${apiBaseUrl}/api/v1/complaints/nearby-complaints`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setComplaints(response.data.complaints);
        } else {
          setError("Failed to fetch complaints");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <div className="text-center text-lg mt-10">Loading complaints...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Complaints List</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {complaints.map((complaint) => (
          <div
            key={complaint.complaint_ID}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            {/* Complaint Image */}
            <img
              src={complaint.Image}
              alt="Complaint"
              className="w-full h-48 object-cover rounded-lg mb-3"
              onError={(e) => (e.target.style.display = "none")} // Hide image if broken
            />

            {/* Complaint Info */}
            <h2 className="text-xl font-semibold text-gray-800">{complaint.Issue_Type}</h2>
            <p className="text-gray-600">Location: {complaint.address || "Not Provided"}</p>
            <p className={`font-semibold ${complaint.Status === "Resolved" ? "text-green-600" : "text-yellow-600"}`}>
              Status: {complaint.Status}
            </p>

            {/* View Details Button */}
            <Link
              to={`/complaints/${complaint.complaint_ID}`}
              className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintDetails;
