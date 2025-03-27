import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const ComplaintDetails = () => {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { complaintId } = useParams();

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          setError('Authentication required - please log in');
          setLoading(false);
          return;
        }
        
        // Get the API base URL from environment variables
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
        
        // Include the token in the request headers
        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        
        const response = await axios.get(`${apiBaseUrl}/api/v1/complaints/details/${complaintId}`, {
          headers: {
            Authorization: authToken
          }
        });
        
        if (response.data.success) {
          setComplaint(response.data.data);
        } else {
          setError('Failed to fetch complaint details: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error fetching complaint details:', error);
        setError(`Failed to fetch complaint details: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [complaintId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex items-center justify-center p-6 mt-10">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center animate-slideDown">
            Loading Complaint Details...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex items-center justify-center p-6 mt-10">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-red-600 mb-6 text-center animate-slideDown">
            Error
          </h1>
          <p className="text-center text-lg">{error}</p>
          <div className="mt-8 text-center">
            <Link 
              to="/complaint" 
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 animate-bounceOnce"
            >
              Back to Complaints
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex items-center justify-center p-6 mt-10">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center animate-slideDown">
            Complaint Not Found
          </h1>
          <div className="mt-8 text-center">
            <Link 
              to="/complaint" 
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 animate-bounceOnce"
            >
              Back to Complaints
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format date for display
  const formattedDate = complaint.Date_of_report 
    ? new Date(complaint.Date_of_report).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    : new Date(complaint.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex items-center justify-center p-6 mt-10">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl transform transition-all duration-300 hover:shadow-3xl">
        {/* Header with slide-in animation */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center animate-slideDown">
          Complaint Details
        </h1>

        {/* Complaint Details Grid (2-column layout for most fields, full-width for photo) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Complaint ID */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fadeInLeft">
              <p className="text-gray-600 font-medium text-lg">Complaint ID</p>
              <p className="text-gray-800 font-semibold text-xl">#{complaint.complaint_ID}</p>
            </div>

            {/* Issue Type */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fadeInLeft delay-200">
              <p className="text-gray-600 font-medium text-lg">Issue Type</p>
              <p className="text-gray-800 font-semibold text-xl">
                {complaint.Issue_Type === 'Other' 
                  ? complaint.Custom_Issue_Type || 'Other' 
                  : complaint.Issue_Type}
              </p>
            </div>

            {/* Location */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fadeInLeft delay-400">
              <p className="text-gray-600 font-medium text-lg">Location</p>
              <p className="text-gray-800 font-semibold text-xl">{complaint.address}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Date Reported */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fadeInRight">
              <p className="text-gray-600 font-medium text-lg">Date Reported</p>
              <p className="text-gray-800 font-semibold text-xl">{formattedDate}</p>
            </div>

            {/* Status */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fadeInRight delay-200">
              <p className="text-gray-600 font-medium text-lg">Status</p>
              <p className={`text-gray-800 font-semibold text-xl ${complaint.Status === 'Resolved' ? 'text-green-600' : complaint.Status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                {complaint.Status}
              </p>
            </div>
            
            {/* Upvotes (if present) */}
            {complaint.upvotes !== undefined && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fadeInRight delay-300">
                <p className="text-gray-600 font-medium text-lg">Upvotes</p>
                <p className="text-gray-800 font-semibold text-xl">{complaint.upvotes}</p>
              </div>
            )}
          </div>

          {/* Photo (full-width across both columns) */}
          <div className="col-span-1 md:col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fadeInUp delay-400">
            <p className="text-gray-600 font-medium text-lg">Photo</p>
            <img 
              src={complaint.Image} 
              alt="Complaint" 
              className="w-full h-64 object-cover rounded-md shadow-md mt-2 transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Description (full-width at bottom for emphasis) */}
          <div className="col-span-1 md:col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fadeInUp delay-600">
            <p className="text-gray-600 font-medium text-lg">Description</p>
            <p className="text-gray-800 font-medium text-lg mt-2">{complaint.Issue_Description}</p>
          </div>
        </div>

        {/* Back Button with bounce animation */}
        <div className="mt-8 text-center">
          <Link 
            to="/complaint" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 animate-bounceOnce"
          >
            Back to Complaints
          </Link>
        </div>
      </div>
    </div>
  );
};

// CSS for animations (added inline for simplicity, move to CSS file if preferred)
const styles = `
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounceOnce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  .animate-slideDown { animation: slideDown 0.5s ease-out; }
  .animate-fadeInLeft { animation: fadeInLeft 0.5s ease-out; }
  .animate-fadeInRight { animation: fadeInRight 0.5s ease-out; }
  .animate-fadeInUp { animation: fadeInUp 0.5s ease-out; }
  .animate-bounceOnce { animation: bounceOnce 0.5s ease-out; }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ComplaintDetails;