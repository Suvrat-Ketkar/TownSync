import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StatisticsDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async (startDate = null, endDate = null) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required - please log in');
        setLoading(false);
        return;
      }

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      let url = `${apiBaseUrl}/api/v1/complaints/statistics`;
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: authToken
        }
      });

      if (response.data.success) {
        setStatistics(response.data.data);
      } else {
        setError('Failed to fetch statistics: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError(`Failed to fetch statistics: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchStatistics(dateRange.startDate, dateRange.endDate);
  };

  // Function to calculate totals across all date periods
  const calculateTotals = () => {
    if (!statistics || statistics.length === 0) return null;

    // Initialize totals object
    const totals = {
      totalComplaints: 0,
      pendingComplaints: 0,
      inProgressComplaints: 0,
      resolvedComplaints: 0,
      rejectedComplaints: 0,
      issueTypeDistribution: {
        Potholes: 0,
        StreetLights: 0,
        GarbageCollection: 0,
        WaterSupply: 0,
        ElectricityIssues: 0,
        Other: 0
      },
      userGrowth: 0
    };

    // Sum up all values
    statistics.forEach(stat => {
      totals.totalComplaints += stat.totalComplaints || 0;
      totals.pendingComplaints += stat.pendingComplaints || 0;
      totals.inProgressComplaints += stat.inProgressComplaints || 0;
      totals.resolvedComplaints += stat.resolvedComplaints || 0;
      totals.rejectedComplaints += stat.rejectedComplaints || 0;
      
      // Sum issue types
      if (stat.issueTypeDistribution) {
        totals.issueTypeDistribution.Potholes += stat.issueTypeDistribution.Potholes || 0;
        totals.issueTypeDistribution.StreetLights += stat.issueTypeDistribution.StreetLights || 0;
        totals.issueTypeDistribution.GarbageCollection += stat.issueTypeDistribution.GarbageCollection || 0;
        totals.issueTypeDistribution.WaterSupply += stat.issueTypeDistribution.WaterSupply || 0;
        totals.issueTypeDistribution.ElectricityIssues += stat.issueTypeDistribution.ElectricityIssues || 0;
        totals.issueTypeDistribution.Other += stat.issueTypeDistribution.Other || 0;
      }
      
      totals.userGrowth += stat.userGrowth || 0;
    });

    return totals;
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 pt-20 px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Statistics Dashboard</h1>
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Loading statistics...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 pt-20 px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Statistics Dashboard</h1>
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 pt-20 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 ">Statistics Dashboard</h1>

        {/* Date Range Filter */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter by Date Range</h2>
          <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4">
            <div className="flex flex-col">
              <label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                className="px-4 py-2 bg-[#0FA4AF] text-white rounded-md hover:bg-[#0E7490] transition-colors"
              >
                Apply Filter
              </button>
            </div>
          </form>
        </div>

        {!statistics || statistics.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No statistics available for the selected date range.</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow border border-blue-100">
                <h3 className="text-sm font-medium text-gray-500">Total Complaints</h3>
                <p className="text-3xl font-bold text-blue-600">{totals.totalComplaints}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border border-yellow-100">
                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                <p className="text-3xl font-bold text-yellow-500">{totals.pendingComplaints}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border border-green-100">
                <h3 className="text-sm font-medium text-gray-500">Resolved</h3>
                <p className="text-3xl font-bold text-green-600">{totals.resolvedComplaints}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border border-red-100">
                <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
                <p className="text-3xl font-bold text-red-600">{totals.rejectedComplaints}</p>
              </div>
            </div>

            {/* Issue Type Distribution */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Issue Type Distribution</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{totals.issueTypeDistribution.Potholes}</div>
                  <div className="text-sm text-gray-600">Potholes</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">{totals.issueTypeDistribution.StreetLights}</div>
                  <div className="text-sm text-gray-600">Street Lights</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{totals.issueTypeDistribution.GarbageCollection}</div>
                  <div className="text-sm text-gray-600">Garbage</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{totals.issueTypeDistribution.WaterSupply}</div>
                  <div className="text-sm text-gray-600">Water Supply</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{totals.issueTypeDistribution.ElectricityIssues}</div>
                  <div className="text-sm text-gray-600">Electricity</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-600">{totals.issueTypeDistribution.Other}</div>
                  <div className="text-sm text-gray-600">Other</div>
                </div>
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
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border">In Progress</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border">Resolved</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border">Rejected</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border">Avg Resolution (hrs)</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border">User Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.map((stat, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 text-sm text-gray-700 border">
                        {new Date(stat.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 border">{stat.totalComplaints}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 border">{stat.pendingComplaints}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 border">{stat.inProgressComplaints}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 border">{stat.resolvedComplaints}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 border">{stat.rejectedComplaints}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 border">
                        {stat.averageResolutionTime ? stat.averageResolutionTime.toFixed(1) : 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 border">{stat.userGrowth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Back Button */}
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-[#0FA4AF] text-white rounded-lg font-medium hover:bg-[#0E7490] transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard; 