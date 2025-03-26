import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import CategorySelector from "./CategorySelector";
import DescriptionBox from "./DescriptionBox";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ReportIssue = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate form fields
    if (!selectedCategory || !description || !address || !imageFile) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      // Create form data
      const formData = new FormData();
      formData.append("Issue_Type", selectedCategory);
      formData.append("Issue_Description", description);
      formData.append("address", address);
      formData.append("image", imageFile);

      if (selectedCategory === "Other") {
        formData.append("Custom_Issue_Type", description.split(" ")[0]); // Use first word as custom type
      }

      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError("You must be logged in to report an issue");
        setLoading(false);
        return;
      }

      console.log("Token from localStorage:", token); // Debug the raw token
      
      // Always format with Bearer prefix for API requests
      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      console.log("Authorization token for API:", authToken);

      // Send request to backend
      const response = await axios.post(
        `http://localhost:3500/api/v1/complaints/report`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": authToken
          },
          withCredentials: true, // For cookies
        }
      );

      // Handle success
      if (response.data.success) {
        setSuccess("Issue reported successfully!");
        // Reset form
        setSelectedCategory("");
        setDescription("");
        setImage(null);
        setImageFile(null);
        setAddress("");
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

        {/* Status messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <ImageUploader image={image} handleCapture={handleCapture} />

          {/* Category Selection */}
          <CategorySelector selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

          {/* Description */}
          <DescriptionBox description={description} setDescription={setDescription} />

          {/* Address Input */}
          <div className="mb-6">
            <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
              Location Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={handleAddressChange}
              placeholder="Enter the address of the issue"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0FA4AF]"
            />
          </div>

          {/* Submit Button */}
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
