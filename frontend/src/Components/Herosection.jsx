import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="px-6 md:px-20 lg:px-40 flex justify-center py-10 bg-gradient-to-b from-[#0FA4AF] to-sky-100 pt-20">
      <div className="layout-content-container flex flex-col max-w-[1500px] w-full">
        <div 
          className="flex min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex-col gap-4 md:gap-6 bg-cover bg-center bg-no-repeat items-start justify-end px-6 pb-12 rounded-2xl shadow-lg" 
          style={{ 
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url('https://cdn.usegalileo.ai/sdxl10/dbcb05ef-1b43-4884-a06d-cfc9df0c622c.png')",
          }}
        >
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-[-0.033em] drop-shadow-lg">
            Make your community a better place
          </h1>
          <h2 className="text-white text-lg md:text-2xl font-light leading-normal drop-shadow-md">
            Use TownSync to report and track issues in your neighborhood.
          </h2>
          
          <div className="flex flex-wrap gap-4 mt-4 md:mt-6">
            <Link to="/report">
              <button className="h-12 px-6 rounded-full bg-[#2F80ED] text-white font-semibold text-lg shadow-md hover:bg-[#1C66C1] transition-all">
                Report an issue
              </button>
            </Link>
            <Link to = "/detail">
            <button className="h-12 px-6 rounded-full bg-white text-[#0e141b] font-semibold text-lg shadow-md hover:bg-gray-200 transition-all">
              Track an issue
            </button>
            </Link>
          </div> 
        </div> 
      </div>
    </div>
  );
};

export default HeroSection;
