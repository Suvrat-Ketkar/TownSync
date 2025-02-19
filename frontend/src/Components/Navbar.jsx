// import React from "react";

// const Navbar = () => {
//   return (
//     <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-10 py-3 bg-gradient-to-r from-[#0FA4AF] to-[#0E7490] shadow-lg">
//       {/* Logo Section */}
//       <div className="flex items-center gap-4">
//         <h2 className="text-white text-2xl font-extrabold tracking-wide">TownSync</h2>
//       </div>

//       {/* Navigation Links */}
//       <nav className="flex items-center gap-8">
//         <a
//           href="#"
//           className="text-white text-base font-semibold transition-transform duration-300 hover:scale-110 hover:text-[#FFD700]"
//         >
//           Report Issue
//         </a>
//         <a
//           href="#"
//           className="text-white text-base font-semibold transition-transform duration-300 hover:scale-110 hover:text-[#FFD700]"
//         >
//           Track Issue
//         </a>
//       </nav>

//       {/* Right Side (Login Button) */}
//       <div>
//         <a
//           href="#"
//           className="bg-white text-[#0E7490] px-6 py-2 rounded-full font-semibold text-base shadow-md transition-all duration-300 hover:bg-[#FFD700] hover:text-[#0E141B] hover:shadow-lg"
//         >
//           Login
//         </a>
//       </div>
//     </header>
//   );
// };

// export default Navbar;


import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Icons for mobile menu

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-3 bg-gradient-to-r from-[#0FA4AF] to-[#0E7490] shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center gap-4">
        <h2 className="text-white text-2xl font-extrabold tracking-wide">TownSync</h2>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <a href="#" className="text-white text-base font-semibold transition-transform duration-300 hover:scale-110 hover:text-[#FFD700]">
          Report Issue
        </a>
        <a href="#" className="text-white text-base font-semibold transition-transform duration-300 hover:scale-110 hover:text-[#FFD700]">
          Track Issue
        </a>
      </nav>

      {/* Login Button (Visible on Desktop) */}
      <div className="hidden md:block">
        <a href="#" className="bg-white text-[#0E7490] px-6 py-2 rounded-full font-semibold text-base shadow-md transition-all duration-300 hover:bg-[#FFD700] hover:text-[#0E141B] hover:shadow-lg">
          Login
        </a>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-[#0E7490] shadow-lg flex flex-col items-center py-4 space-y-4 md:hidden">
          <a href="#" className="text-white text-lg font-semibold" onClick={() => setIsOpen(false)}>
            Report Issue
          </a>
          <a href="#" className="text-white text-lg font-semibold" onClick={() => setIsOpen(false)}>
            Track Issue
          </a>
          <a href="#" className="bg-white text-[#0E7490] px-6 py-2 rounded-full font-semibold text-base shadow-md transition-all duration-300 hover:bg-[#FFD700] hover:text-[#0E141B] hover:shadow-lg" onClick={() => setIsOpen(false)}>
            Login
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
