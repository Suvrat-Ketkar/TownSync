import React from "react";

const HeroSection = () => {
    return (
      <div className="px-40 flex flex-1 justify-center py-5 bg-gradient-to-b from-sky-100 to-sky-50">
        <div className="layout-content-container flex flex-col max-w-[1500px] flex-1">
          <div className="flex min-h-[600px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-start justify-end px-4 pb-10" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url('https://cdn.usegalileo.ai/sdxl10/dbcb05ef-1b43-4884-a06d-cfc9df0c622c.png')" }}>
            <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em]">Make your community a better place</h1>
            <h2 className="text-white text-2xl font-normal leading-normal">Use CivicFeedback to report and track issues in your neighborhood.</h2>
            <div className="flex gap-3 mt-4">
                <button className="h-12 px-5 rounded-xl bg-[#3487e5] text-white">Report an issue</button>
                <button className="h-12 px-5 rounded-xl bg-[#e8edf3] text-[#0e141b]">Track an issue</button>
          </div> 
          </div> 
        </div>
        
      </div>
    );
  };

export default HeroSection;