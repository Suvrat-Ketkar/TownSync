import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const AuthStatisticsDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async (startDate = null, endDate = null) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Authentication required - please log in");
        setLoading(false);
        return;
      }
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      let url = `${apiBaseUrl}/api/v1/authority/authStatistics`;
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await axios.get(url, { headers: { Authorization: authToken } });

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

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchStatistics(dateRange.startDate, dateRange.endDate);
  };

  const totals = statistics || {
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    rejectedComplaints: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 pt-20 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Authority Statistics Dashboard</h1>

        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter by Date Range</h2>
          <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4">
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
              className="px-3 py-2 border rounded-md"
            />
            <button type="submit" className="px-4 py-2 bg-[#0FA4AF] text-white rounded-md">
              Apply Filter
            </button>
          </form>
        </div>

        {loading ? (
          <p>Loading statistics...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow border">
                <h3>Total Complaints</h3>
                <p>{totals.totalComplaints}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border">
                <h3>Pending</h3>
                <p>{totals.pendingComplaints}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border">
                <h3>Resolved</h3>
                <p>{totals.resolvedComplaints}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border">
                <h3>Rejected</h3>
                <p>{totals.rejectedComplaints}</p>
              </div>
            </div>

            {/* Statistics Table */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200 mb-8 overflow-x-auto">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Detailed Statistics</h2>
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border">Total</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border">Pending</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border">Resolved</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border">Rejected</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border">Avg Resolution (hrs)</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border">User Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics && Array.isArray(statistics) && statistics.length > 0 ? (
                    statistics.map((stat, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-2 text-sm text-gray-700 border">
                          {stat.date ? new Date(stat.date).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 border">{stat.totalComplaints || 0}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border">{stat.pendingComplaints || 0}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border">{stat.resolvedComplaints || 0}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border">{stat.rejectedComplaints || 0}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border">
                          {stat.averageResolutionTime ? stat.averageResolutionTime.toFixed(1) : "N/A"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 border">{stat.userGrowth || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-gray-500">
                        No statistics available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="text-center">
          <Link to="/authority-dashboard" className="px-6 py-3 bg-[#0FA4AF] text-white rounded-lg hover:bg-[#0E7490]">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
