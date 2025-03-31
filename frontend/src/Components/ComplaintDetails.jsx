import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const ComplaintDetails = () => {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFullscreen, setImageFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { complaintId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem("accessToken");
        
        if (!token) {
          setError("Authentication required - please log in");
          setLoading(false);
          return;
        }
        
        // Get the API base URL from environment variables
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
        
        // Include the token in the request headers
        const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
        
        const response = await axios.get(`${apiBaseUrl}/api/v1/complaints/details/${complaintId}`, {
          headers: {
            Authorization: authToken
          }
        });
        
        if (response.data.success) {
          setComplaint(response.data.data);
          console.log("Complaint details loaded:", response.data.data);
        } else {
          setError("Failed to fetch complaint details: " + response.data.message);
        }
      } catch (error) {
        console.error("Error fetching complaint details:", error);
        setError(`Failed to fetch complaint details: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (complaintId) {
      fetchComplaintDetails();
    } else {
      setError("Complaint ID not provided");
      setLoading(false);
    }
  }, [complaintId]);

  const toggleFullscreen = () => {
    setImageFullscreen(!imageFullscreen);
  };

  const getImages = () => {
    if (!complaint) return [];
    
    // Check if Images array exists and has items
    if (complaint.Images && complaint.Images.length > 0) {
      return complaint.Images;
    }
    
    // Fallback to the single Image field if Images array is empty
    if (complaint.Image) {
      return [complaint.Image];
    }
    
    return [];
  };

  const nextImage = (e) => {
    e.stopPropagation();
    const images = getImages();
    if (images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    const images = getImages();
    if (images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex items-center justify-center p-6 pt-20">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl">
          <div className="flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-4 text-center animate-pulse">
            Loading Complaint Details...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex items-center justify-center p-6 pt-20">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">
            Error
          </h1>
          <p className="text-center text-lg">{error}</p>
          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate(-1)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = getImages();

  // Render fullscreen image overlay if active
  if (imageFullscreen && images.length > 0) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
        onClick={toggleFullscreen}
      >
        <div className="relative max-w-full max-h-full">
          <img 
            src={images[currentImageIndex]} 
            alt={`Complaint image ${currentImageIndex + 1}`} 
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button 
            className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 text-black hover:bg-opacity-100"
            onClick={toggleFullscreen}
          >
            ✕
          </button>
          
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage} 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-black hover:bg-opacity-100"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextImage} 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-black hover:bg-opacity-100"
              >
                <ChevronRight size={24} />
              </button>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button 
                    key={index} 
                    className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-400'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex items-center justify-center p-6 pt-20">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl relative">
        {/* Back button at top right */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {complaint && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {complaint.Issue_Type === 'Other' ? complaint.Custom_Issue_Type || 'Other Issue' : complaint.Issue_Type}
              </h1>
              <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                complaint.Status === 'Resolved' ? 'bg-green-100 text-green-600' : 
                complaint.Status === 'Rejected' ? 'bg-red-100 text-red-600' : 
                complaint.Status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 
                'bg-yellow-100 text-yellow-600'
              }`}>
                {complaint.Status}
              </span>
            </div>

            {/* Complaint Images */}
            {images.length > 0 && (
              <div className="mb-8 relative">
                <div className="w-full rounded-lg overflow-hidden bg-gray-100 shadow-md">
                  <img 
                    src={images[currentImageIndex]} 
                    alt={complaint.Issue_Type} 
                    className="w-full h-auto object-contain max-h-[400px] cursor-pointer"
                    onClick={toggleFullscreen}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800x400?text=No+Image+Available';
                    }}
                  />
                  
                  {images.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage} 
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-black hover:bg-opacity-100"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={nextImage} 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-black hover:bg-opacity-100"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>
                
                {images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-2">
                    {images.map((_, index) => (
                      <button 
                        key={index} 
                        className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
                
                <button 
                  className="absolute bottom-3 right-3 bg-white bg-opacity-70 rounded-full p-2 px-4 text-black hover:bg-opacity-100 shadow-md text-sm"
                  onClick={toggleFullscreen}
                >
                  View Full Image
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Complaint ID</h3>
                  <p className="text-lg font-medium">{complaint.complaint_ID || "Not Available"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Issue Type</h3>
                  <p className="text-lg font-medium">{complaint.Issue_Type === 'Other' ? complaint.Custom_Issue_Type || 'Other Issue' : complaint.Issue_Type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="text-lg font-medium">{complaint.address || "Location details not available"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date Reported</h3>
                  <p className="text-lg font-medium">
                    {new Date(complaint.Date_of_report || complaint.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className={`text-lg font-medium ${
                    complaint.Status === 'Resolved' ? 'text-green-600' : 
                    complaint.Status === 'Rejected' ? 'text-red-600' : 
                    complaint.Status === 'In Progress' ? 'text-blue-600' : 
                    'text-yellow-600'
                  }`}>
                    {complaint.Status}
                  </p>
                </div>
                {complaint.upvotes !== undefined && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Upvotes</h3>
                    <p className="text-lg font-medium">{complaint.upvotes || 0}</p>
                  </div>
                )}
                {complaint.coordinates && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">GPS Coordinates</h3>
                    <p className="text-lg font-medium">
                      {complaint.coordinates.coordinates ? 
                        `${complaint.coordinates.coordinates[1].toFixed(6)}, ${complaint.coordinates.coordinates[0].toFixed(6)}` :
                        "Not available"}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Images</h3>
                  <p className="text-lg font-medium">{images.length} image(s)</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{complaint.Issue_Description || "No description provided"}</p>
              </div>
            </div>

            {/* Additional Comments - if available */}
            {complaint.Admin_Comment && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Admin Comment</h3>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-700">{complaint.Admin_Comment}</p>
                </div>
              </div>
            )}

            {/* Back Button */}
            <div className="flex justify-between mt-8">
              <button 
                onClick={() => navigate(-1)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Go Back
              </button>
              
              <Link 
                to="/report"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Report New Issue
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetails;
