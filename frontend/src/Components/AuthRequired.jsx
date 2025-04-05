import React from "react";
import { Link } from "react-router-dom";

const AuthRequired = ({ message = "You need to be logged in to access this page" }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0FA4AF] to-sky-100 px-4">
      <h2 className="text-2xl font-semibold text-white mb-4">{message}</h2>
      <Link
        to="/login"
        className="bg-white text-[#0E7490] px-6 py-2 rounded-full font-semibold text-base shadow-md transition-all duration-300 hover:bg-[#FFD700] hover:text-[#0E141B] hover:shadow-lg"
      >
        Go to Login
      </Link>
    </div>
  );
};

export default AuthRequired;
