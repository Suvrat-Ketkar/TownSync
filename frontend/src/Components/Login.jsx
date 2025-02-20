import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    setSubmitStatus({ type: 'success', message: 'Login successful!' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0FA4AF] to-sky-100 px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white shadow-lg rounded-2xl p-6 sm:p-8 md:p-10">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address"
                }
              })}
              className="mt-2 block w-full rounded-lg border-gray-300 shadow-md px-4 py-3 sm:py-3.5 focus:border-[#0E7490] focus:ring-2 focus:ring-[#0FA4AF] outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                {...register("password", { required: "Password is required" })}
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-[#0FA4AF] focus:ring-[#0E7490] border-gray-300 rounded" />
              <label className="ml-2 text-gray-900">Remember me</label>
            </div>
            <Link to="#" className="text-[#0FA4AF] hover:text-[#0E7490]">Forgot your password?</Link>
          </div>

          {/* Sign in Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#0FA4AF] to-[#0E7490] hover:from-[#0E7490] hover:to-[#0FA4AF] text-white font-semibold py-3 sm:py-3.5 rounded-lg shadow-md transition duration-300"
          >
            Sign in
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center text-sm mt-4">
          <span className="text-gray-600">New user? </span>
          <Link to="/register" className="text-[#0FA4AF] hover:text-[#0E7490] font-medium">Register now</Link>
        </div>

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

export default Login;
