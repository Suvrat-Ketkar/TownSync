import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Severity Icon Component
const SeverityIcon = ({ severity }) => {
  const colors = {
    high: 'text-red-500 bg-red-100',
    medium: 'text-yellow-500 bg-yellow-100',
    low: 'text-green-500 bg-green-100'
  };

  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${colors[severity]}`}>
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v5a1 1 0 002 0V5zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    </span>
  );
};

// Main Component
function TopIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          setError('Unable to retrieve your location. Showing default issues.');
          fetchDefaultIssues();
        },
        { timeout: 10000 }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      fetchDefaultIssues();
    }
  }, []);

  // Fetch issues based on location
  useEffect(() => {
    if (userLocation) {
      fetchNearbyIssues(userLocation);
    }
  }, [userLocation]);

  // Function to fetch nearby issues (replace with real API call)
  const fetchNearbyIssues = async ({ lat, lng }) => {
    try {
      setLoading(true);
      const mockResponse = [
        { id: 1, title: "Potholes", reports: 45, severity: "high", location: "0.5 mi away", lastReported: "2025-02-20" },
        { id: 2, title: "Broken Streetlights", reports: 38, severity: "medium", location: "1 mi away", lastReported: "2025-02-19" },
        { id: 3, title: "Garbage Overflow", reports: 32, severity: "medium", location: "0.3 mi away", lastReported: "2025-02-20" },
        { id: 4, title: "Water Leakage", reports: 29, severity: "high", location: "2 mi away", lastReported: "2025-02-18" },
        { id: 5, title: "Traffic Signal Failure", reports: 25, severity: "high", location: "0.8 mi away", lastReported: "2025-02-20" },
        // { id: 6, title: "Sidewalk Damage", reports: 22, severity: "medium", location: "1.2 mi away", lastReported: "2025-02-19" },
        // { id: 7, title: "Noise Pollution", reports: 19, severity: "low", location: "0.7 mi away", lastReported: "2025-02-17" },
        // { id: 8, title: "Street Flooding", reports: 16, severity: "high", location: "1.5 mi away", lastReported: "2025-02-20" },
        // { id: 9, title: "Abandoned Vehicles", reports: 14, severity: "low", location: "0.9 mi away", lastReported: "2025-02-18" },
        // { id: 10, title: "Graffiti", reports: 12, severity: "low", location: "1.1 mi away", lastReported: "2025-02-19" },
      ];
      setIssues(mockResponse);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch nearby issues.');
      setLoading(false);
    }
  };

  // Fallback function for default issues
  const fetchDefaultIssues = () => {
    setIssues([
      { id: 1, title: "Potholes on Main St", reports: 45, severity: "high", location: "Downtown", lastReported: "2025-02-20" },
      { id: 2, title: "Broken Streetlights", reports: 38, severity: "medium", location: "West End", lastReported: "2025-02-19" },
      // ... other default issues ...
    ]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 font-sans antialiased mt-8">
      {/* Header */}
      {/* <header className="">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
              </svg>
              <h1 className="text-2xl font-bold">TownSync</h1>
            </div>
            <nav className="space-x-6">
              <a href="#" className="text-sm font-medium hover:text-gray-200">Home</a>
              <a href="#" className="text-sm font-medium hover:text-gray-200">Track Issue</a>
              <button className="px-4 py-2 bg-white text-teal-600 rounded-full hover:bg-gray-100 font-medium text-sm transition-colors">
                Login
              </button>
            </nav>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Issues List Header */}
          <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Top 10 Current Issues Near You
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {userLocation ? `Showing issues near your location` : 'Location unavailable, showing sample issues'}
            </p>
          </div>

          {/* Loading/Error State */}
          {loading && (
            <div className="p-4 text-center text-gray-500">Loading nearby issues...</div>
          )}
          {error && !loading && (
            <div className="p-4 text-center text-red-500">{error}</div>
          )}

          {/* Issues List */}
          {!loading && !error && issues.length > 0 && (
            <div className="grid gap-4 p-4">
              {issues.map((issue, index) => (
                <div
                  key={issue.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 text-center text-sm font-medium text-gray-500">
                      {index + 1}
                    </span>
                    <SeverityIcon severity={issue.severity} />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {issue.title}
                      </h3>
                      <div className="mt-1 text-sm text-gray-600 flex flex-col gap-1">
                        <span>{issue.location}</span>
                        <span className="flex items-center gap-2">
                          <span>{issue.reports} reports</span>
                          <span className="text-gray-400">•</span>
                          <span>Last reported: {new Date(issue.lastReported).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                    <button className="ml-3 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Info */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Want to report an issue?{' '}
              <Link to="/report" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                Submit a new complaint
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TopIssues;