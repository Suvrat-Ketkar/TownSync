import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';

const WelcomeNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-3 bg-gradient-to-r from-[#0FA4AF] to-[#0E7490] shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <h2 className="text-white text-2xl font-extrabold tracking-wide">TownSync</h2>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link to="/about-us" className="text-white text-base font-semibold transition-transform duration-300 hover:scale-110 hover:text-[#FFD700]">
          About Us
        </Link>
        <Link to="/contact-us" className="text-white text-base font-semibold transition-transform duration-300 hover:scale-110 hover:text-[#FFD700]">
          Contact Us
        </Link>
        <Link to="/testimonials" className="text-white text-base font-semibold transition-transform duration-300 hover:scale-110 hover:text-[#FFD700]">
          Testimonials
        </Link>
      </nav>

      {/* Login Button */}
      <div className="hidden md:flex">
        <Link to="/login" className="bg-white text-[#0E7490] px-6 py-2 rounded-full font-semibold text-base shadow-md transition-all duration-300 hover:bg-[#FFD700] hover:text-[#0E141B] hover:shadow-lg">
          Login
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button className="md:hidden text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-[#0E7490] shadow-lg flex flex-col items-center py-4 space-y-4 md:hidden">
          <Link to="/about-us" className="text-white text-lg font-semibold" onClick={() => setIsOpen(false)}>
            About Us
          </Link>
          <Link to="/contact-us" className="text-white text-lg font-semibold" onClick={() => setIsOpen(false)}>
            Contact Us
          </Link>
          <Link to="/testimonials" className="text-white text-lg font-semibold" onClick={() => setIsOpen(false)}>
            Testimonials
          </Link>
          <Link to="/login" className="bg-white text-[#0E7490] px-6 py-2 rounded-full font-semibold text-base shadow-md" onClick={() => setIsOpen(false)}>
            Login
          </Link>
        </div>
      )}
    </header>
  );
};

export default WelcomeNavbar;
