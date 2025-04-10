import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
  
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Add location to registration data
          const registrationData = { ...data, latitude, longitude };
  
          try {
            const response = await fetch("http://localhost:3500/api/v1/user-register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(registrationData),
            });

            if (response.ok) {
              setSubmitStatus({ type: "success", message: "Registration successful!" });
              const result = await response.json();

              if (result.accessToken) {
                login(
                  { email: data.email, fullName: data.fullName },
                  { accessToken: result.accessToken, refreshToken: result.refreshToken }
                );
  
                setTimeout(() => navigate("/"), 1500);
              }
            } else {
              setSubmitStatus({ type: "error", message: result.message || "Registration failed!" });
            }
          } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus({ type: "error", message: "Something went wrong. Please try again." });
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setSubmitStatus({ type: "error", message: "Location permission denied. Please enable location." });
          setIsLoading(false);
        }
      );
    } else {
      setSubmitStatus({ type: "error", message: "Geolocation is not supported by this browser." });
      setIsLoading(false);
    }
  };
  


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0FA4AF] to-sky-100 px-4 sm:px-6 lg:px-8 py-8 mt-9">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white shadow-lg rounded-2xl p-6 sm:p-8 md:p-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-6">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              {...register("fullName", {
                required: "Full name is required",
                minLength: { value: 3, message: "Must be at least 3 characters" }
              })}
              className="mt-2 block w-full rounded-lg border-gray-300 shadow-md px-4 py-3 sm:py-3.5 focus:border-[#0E7490] focus:ring-2 focus:ring-[#0FA4AF] outline-none"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
              })}
              className="mt-2 block w-full rounded-lg border-gray-300 shadow-md px-4 py-3 sm:py-3.5 focus:border-[#0E7490] focus:ring-2 focus:ring-[#0FA4AF] outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Address</label>
            <textarea
              {...register("current_address", { required: "Address is required" })}
              rows="2"
              className="mt-2 block w-full rounded-lg border-gray-300 shadow-md px-4 py-3 sm:py-3.5 focus:border-[#0E7490] focus:ring-2 focus:ring-[#0FA4AF] outline-none"
            />
            {errors.current_address && <p className="text-red-500 text-sm mt-1">{errors.current_address.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Must be at least 8 characters" }
                })}
                type={showPassword ? "text" : "password"}
                className="mt-2 block w-full rounded-lg border-gray-300 shadow-md px-4 py-3 sm:py-3.5 focus:border-[#0E7490] focus:ring-2 focus:ring-[#0FA4AF] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: value => value === password || "Passwords do not match"
              })}
              type="password"
              className="mt-2 block w-full rounded-lg border-gray-300 shadow-md px-4 py-3 sm:py-3.5 focus:border-[#0E7490] focus:ring-2 focus:ring-[#0FA4AF] outline-none"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#0FA4AF] to-[#0E7490] hover:from-[#0E7490] hover:to-[#0FA4AF] text-white font-semibold py-3 sm:py-3.5 rounded-lg shadow-md transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Status Messages */}
        {submitStatus.message && (
          <div className={`mt-4 p-4 rounded-md text-center ${
            submitStatus.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            {submitStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
