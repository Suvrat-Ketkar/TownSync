import React, { useState } from "react";
import { Menu, X, LogOut, BarChart2, UserCircle } from "lucide-react"; // Added UserCircle icon
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AuthorityNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-3 bg-gradient-to-r from-[#0FA4AF] to-[#0E7490] shadow-lg">
      <h2 className="text-white text-2xl font-extrabold tracking-wide">Authority Panel</h2>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link to="/authority-dashboard" className="text-white text-base font-semibold transition-transform duration-300 hover:scale-110 hover:text-yellow-400">
          Dashboard
        </Link>
        <Link to="/authority-dashboard/statistics" className="text-white text-base font-semibold transition-transform duration-300 hover:scale-110 hover:text-yellow-400">
          Statistics
        </Link>
        {user && (
          <Link to="/authority-dashboard/profile" className="text-white text-base font-semibold transition-transform duration-300 hover:scale-110 hover:text-yellow-400 flex items-center gap-2">
            <UserCircle className="w-5 h-5" />
            Profile
          </Link>
        )}
      </nav>

      {/* Login/Profile Button (Visible on Desktop) */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-blue-900 px-4 py-2 rounded-full font-semibold text-base shadow-md transition-all duration-300 hover:bg-yellow-400 hover:text-black"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-white text-blue-900 px-6 py-2 rounded-full font-semibold text-base shadow-md transition-all duration-300 hover:bg-yellow-400 hover:text-black">
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-blue-900 shadow-lg flex flex-col items-center py-4 space-y-4 md:hidden">
          <Link to="/authority-dashboard" className="text-white text-lg font-semibold" onClick={() => setIsOpen(false)}>
            Dashboard
          </Link>
          <Link to="/authority-dashboard/statistics" className="text-white text-lg font-semibold flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <BarChart2 className="w-5 h-5" />
            <span>Statistics</span>
          </Link>
          {user && (
            <Link to="/authority-dashboard/profile" className="flex items-center gap-2 text-white hover:text-yellow-400" onClick={() => setIsOpen(false)}>
              <UserCircle className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          )}
          {user && (
            <button 
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 bg-white text-blue-900 px-4 py-2 rounded-full font-semibold text-base shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default AuthorityNavbar;
