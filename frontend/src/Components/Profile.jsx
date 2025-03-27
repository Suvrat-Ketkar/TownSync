import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0FA4AF] to-sky-100 px-4">
        <h2 className="text-2xl font-semibold text-white mb-4">You need to be logged in to view your profile</h2>
        <Link to="/login" className="bg-white text-[#0E7490] px-6 py-2 rounded-full font-semibold text-base shadow-md transition-all duration-300 hover:bg-[#FFD700] hover:text-[#0E141B] hover:shadow-lg">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-10 bg-gradient-to-b from-[#0FA4AF] to-sky-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#0FA4AF] to-[#0E7490] px-6 py-8 text-center">
          <div className="inline-block bg-white p-2 rounded-full mb-4">
            <div className="bg-gray-200 h-24 w-24 rounded-full flex items-center justify-center">
              <span className="text-4xl text-blue-500 font-semibold">
                {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">{user.email || 'User'}</h1>
        </div>
        
        <div className="p-6 sm:p-10">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Account Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{user.email || 'Not available'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Account Status</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Active</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">My Complaints</h2>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-500">Your reported complaints will appear here</p>
                <Link to="/complaint" className="mt-4 inline-block text-[#0FA4AF] hover:text-[#0E7490] font-medium">
                  View All Complaints
                </Link>
              </div>
            </div>
            
            <div className="pt-4 flex justify-center">
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow transition-colors duration-300 flex items-center gap-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 