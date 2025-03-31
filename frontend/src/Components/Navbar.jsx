import React, { useState } from "react";
import { Menu, X, UserCircle, LogOut, BarChart2, FileText, AlertTriangle, MapPin } from "lucide-react"; // Added map pin icon
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-3 bg-gradient-to-r from-[#0FA4AF] to-[#0E7490] shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center gap-4">
        <h2 className="text-white text-2xl font-extrabold tracking-wide">TownSync</h2>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link to="/" className="text-white text-base font-semibold transition-transform duration-300 hover:scale-110 hover:text-[#FFD700]">
          Home
        </Link>
        <Link to="/complaints" className="text-white text-base font-semibold transition-transform duration-300 hover:scale-110 hover:text-[#FFD700]">
          My Complaints
        </Link>
        <Link to="/nearby-complaints" className="text-white text-base font-semibold transition-transform duration-300 hover:scale-110 hover:text-[#FFD700]">
          Nearby Issues
        </Link>
        <Link to="/report" className="text-white text-base font-semibold transition-transform duration-300 hover:scale-110 hover:text-[#FFD700]">
          Report Issue
        </Link>
        {user && (
          <Link to="/statistics" className="text-white text-base font-semibold transition-transform duration-300 hover:scale-110 hover:text-[#FFD700]">
            Statistics
          </Link>
        )}
      </nav>

      {/* Login/Profile Button (Visible on Desktop) */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <Link to="/profile" className="flex items-center gap-2 text-white hover:text-[#FFD700] transition-colors duration-300">
              <UserCircle className="w-5 h-5" />
              <span>Profile</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-[#0E7490] px-4 py-2 rounded-full font-semibold text-base shadow-md transition-all duration-300 hover:bg-[#FFD700] hover:text-[#0E141B] hover:shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-white text-[#0E7490] px-6 py-2 rounded-full font-semibold text-base shadow-md transition-all duration-300 hover:bg-[#FFD700] hover:text-[#0E141B] hover:shadow-lg">
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
        <div className="absolute top-14 left-0 w-full bg-[#0E7490] shadow-lg flex flex-col items-center py-4 space-y-4 md:hidden">
          <Link to="/" className="text-white text-lg font-semibold" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/complaints" className="text-white text-lg font-semibold flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <FileText className="w-5 h-5" />
            <span>My Complaints</span>
          </Link>
          <Link to="/nearby-complaints" className="text-white text-lg font-semibold flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <MapPin className="w-5 h-5" />
            <span>Nearby Issues</span>
          </Link>
          <Link to="/report" className="text-white text-lg font-semibold flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <AlertTriangle className="w-5 h-5" />
            <span>Report Issue</span>
          </Link>
          
          {user && (
            <Link to="/statistics" className="text-white text-lg font-semibold flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <BarChart2 className="w-5 h-5" />
              <span>Statistics</span>
            </Link>
          )}
          
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 text-white hover:text-[#FFD700]" onClick={() => setIsOpen(false)}>
                <UserCircle className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 bg-white text-[#0E7490] px-4 py-2 rounded-full font-semibold text-base shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-white text-[#0E7490] px-6 py-2 rounded-full font-semibold text-base shadow-md" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
