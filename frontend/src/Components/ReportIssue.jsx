import React, { useState, useEffect }from "react";
import ImageUploader from "./ImageUploader";
import CategorySelector from "./CategorySelector";
import DescriptionBox from "./DescriptionBox";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AuthRequired from "../Components/AuthRequired";
import {getApiBaseUrl} from '../utils/apiBase.jsx'
const ReportIssue = () => {
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!user) {
    return <AuthRequired message="You need to be logged in to report a complaint" />;
  }



  // Function to capture user's current location
  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        setError("Failed to capture location. Please enter the address manually.");
        console.error("Geolocation error:", error);
      }
    );
  };

  const handleCapture = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Limit to maximum 5 images total
    const availableSlots = 5 - images.length;
    const filesToProcess = files.slice(0, availableSlots);
    
    if (filesToProcess.length > 0) {
      const newImageFiles = [...imageFiles, ...filesToProcess];
      setImageFiles(newImageFiles);
      
      const newImageUrls = filesToProcess.map(file => URL.createObjectURL(file));
      setImages([...images, ...newImageUrls]);
    }
  };

  const removeImage = (index) => {
    // Create new arrays without the removed image
    const newImages = [...images];
    const newImageFiles = [...imageFiles];
    
    // Remove the image at the specified index
    newImages.splice(index, 1);
    newImageFiles.splice(index, 1);
    
    // Update state
    setImages(newImages);
    setImageFiles(newImageFiles);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!selectedCategory || !description || !location || !address || imageFiles.length === 0) {
      setError("All fields are required, including at least one image and location.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Issue_Type", selectedCategory);
      formData.append("Issue_Description", description);
      
      // Append all image files
      imageFiles.forEach((file, index) => {
        formData.append(`images`, file);
      });

      if (selectedCategory === "Other") {
        formData.append("Custom_Issue_Type", description.split(" ")[0]);
      }


      formData.append("latitude", location.latitude);
      formData.append("longitude", location.longitude);
      formData.append("address", address);
     

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError("You must be logged in to report an issue.");
        setLoading(false);
        return;
      }

      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

      const response = await axios.post(
        `${getApiBaseUrl()}/api/v1/complaints/report`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": authToken
          }
        }
      );

      if (response.data.success) {
        setSuccess("Issue reported successfully!");
        setSelectedCategory("");
        setDescription("");
        setImages([]);
        setImageFiles([]);
        setAddress("");
        setLocation(null);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to report issue");
      console.error("Error reporting issue:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Report an Issue</h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}

        <form onSubmit={handleSubmit}>
          <ImageUploader images={images} handleCapture={handleCapture} removeImage={removeImage} />
          <CategorySelector selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
          <DescriptionBox description={description} setDescription={setDescription} />

          <div className="mb-6">
            <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
              Location Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={handleAddressChange}
              placeholder="Enter the address (optional if location is captured)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0FA4AF]"
            />
            <button
              type="button"
              onClick={captureLocation}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              Use Current Location
            </button>
            {location && (
              <p className="text-green-700 mt-2">
                Location Captured: {location.latitude}, {location.longitude}
              </p>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full bg-[#0FA4AF] text-white font-semibold text-lg shadow-md hover:bg-[#0E7490] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;
