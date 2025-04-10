import React, { useState, useEffect } from "react";
import axios from "axios";

export const AuthorityDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); // "active" or "resolved"

  useEffect(() => {
    fetchStatistics();
  }, []);

  const acknowledgeComplaint = async (complaintId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

      const response = await axios.post(
        `${apiBaseUrl}/api/v1/authority/acknowledgeComplaint`,
        { complaintId },
        { headers: { Authorization: authToken } }
      );

      if (response.data.success) {
        // Refetch complaints after update
        fetchStatistics();
      } else {
        console.error("Failed to acknowledge complaint:", response.data.message);
      }
    } catch (error) {
      console.error("Error acknowledging complaint:", error);
    }
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Authentication required - please log in");
        setLoading(false);
        return;
      }

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

      const response = await axios.get(`${apiBaseUrl}/api/v1/authority/authDashboard`, {
        headers: { Authorization: authToken },
      });

      if (response.data.success) {
        setStatistics(response.data.data);
      } else {
        setError("Failed to fetch statistics: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setError(`Failed to fetch statistics: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 p-6 mt-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Authority Dashboard</h1>

        {loading ? (
          <p>Loading statistics...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div>
            {/* Buttons to display counts */}
            <div className="flex gap-4 mb-6">
              <button
                className="px-6 py-3 bg-[#0E7490] text-white rounded-lg font-semibold hover:bg-[#0FA4AF] transition-all"
                onClick={() => setSelectedCategory("active")}
              >
                Active Complaints ({statistics.active.count})
              </button>
              <button
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                onClick={() => setSelectedCategory("resolved")}
              >
                Resolved Complaints ({statistics.resolved.count})
              </button>
            </div>

            {/* Complaints Display as Cards */}
            {selectedCategory && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  {selectedCategory === "active" ? "Active Complaints" : "Resolved Complaints"}
                </h2>

                {statistics[selectedCategory].complaints.length > 0 ? (
                  statistics[selectedCategory].complaints.map((complaint) => (
                    <div
                      key={complaint._id}
                      className="p-5 bg-white rounded-lg shadow-md border border-gray-200"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {complaint.Issue_Type}
                      </h3>
                      <div key={complaint._id} className="bg-gray-50 p-4 rounded-lg shadow">
                        {/* Display Issue Image */}
                        {complaint.Image && (
                          <img
                            src={complaint.Image}
                            alt="Complaint Issue"
                            className="align-center w-full h-58 object-cover rounded-lg mb-4"
                          />
                        )}
                      </div>
                      <p className="text-gray-700">
                        <strong>ID:</strong> {complaint.complaint_ID}
                      </p>
                      <p className="text-gray-700">
                        <strong>Issue Description:</strong> {complaint.Issue_Description}
                      </p>
                      <p className="text-gray-700">
                        <strong>Location:</strong>{" "}
                        {complaint.Location?.coordinates?.join(", ") || "N/A"}
                      </p>
                      <p className="text-gray-700">
                        <strong>Address:</strong> {complaint.address}
                      </p>
                      <p className="text-gray-700">
                        <strong>Date Created:</strong>{" "}
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">
                        <strong>Issue Reported By:</strong> {complaint.user.fullName}
                      </p>
                      <p className="text-gray-700">
                        <strong>Address of Citizen:</strong> {complaint.user.current_address}
                      </p>
                      <p className="text-gray-700">
                        <strong>Email of Citizen:</strong> {complaint.user.email}
                      </p>

                      {/* Status Button */}
                      <div className="mt-3">
                        <button
                          className={`px-4 py-2 rounded-lg font-semibold text-white ${
                            complaint.Status === "Pending"
                              ? "bg-[#0E7490] hover:bg-[#0FA4AF]"
                              : "bg-green-600 hover:bg-green-700"
                          } transition-all`}
                        >
                          {complaint.Status}
                        </button>

                        {/* Show "Acknowledge & Start Work" button only if complaint is Pending */}
                        {complaint.Status === "Pending" && (
                          <button
                            onClick={() => acknowledgeComplaint(complaint._id)}
                            className="ml-10 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
                          >
                            Acknowledge & Start Work
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600">No complaints found.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
