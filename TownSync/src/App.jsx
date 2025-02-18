import React from "react";

const App = () => {
  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#f8fafb] overflow-x-hidden"
      style={{ fontFamily: 'Public Sans, Noto Sans, sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between border-b border-solid border-b-[#111] px-10 py-3 bg-emerald-500 ">
          <div className="flex items-center gap-4 text-[#0e141b] ">
            <h2 className="text-lg font-bold">TownSync</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-sm font-medium" href="#">Report Issue</a>
              <a className="text-sm font-medium" href="#">Track Issue</a>
            </div>
            <button className="flex h-10 px-2.5 rounded-xl bg-[#e8edf3] font-bold">?</button>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="relative flex flex-col min-h-[480px] bg-cover bg-center rounded-xl p-10 text-white"
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url('https://cdn.usegalileo.ai/sdxl10/dbcb05ef-1b43-4884-a06d-cfc9df0c622c.png')` }}>
              <h1 className="text-4xl font-black">Make your community a better place</h1>
              <h2 className="text-sm font-normal">Use CivicFeedback to report and track issues in your neighborhood.</h2>
              <div className="flex gap-3 mt-4">
                <button className="h-12 px-5 rounded-xl bg-[#3487e5] text-white">Report an issue</button>
                <button className="h-12 px-5 rounded-xl bg-[#e8edf3] text-[#0e141b]">Track an issue</button>
              </div>
            </div>
            <h1 className="text-[32px] font-bold text-center pt-6">Popular Issues</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4">
              {[
                { name: "Pothole", reports: 3456, img: "4c1f84c2-695d-4eba-bd85-2511c2dc7697.png" },
                { name: "Graffiti", reports: 2345, img: "0a102ca3-0295-4a87-9af7-9f3bad50b1c9.png" },
                { name: "Sidewalk Repair", reports: 1234, img: "c08abce3-e57e-4cae-bf2e-5d9974ab22ab.png" },
                { name: "Traffic Sign Repair", reports: 5678, img: "243bac1f-dc3e-4c09-b46e-ec4175c4ba92.png" }
              ].map((issue, index) => (
                <div key={index} className="flex flex-col gap-3 pb-3">
                  <div className="w-full aspect-square bg-cover rounded-xl"
                    style={{ backgroundImage: `url(https://cdn.usegalileo.ai/sdxl10/${issue.img})` }}></div>
                  <div>
                    <p className="text-base font-medium">{issue.name}</p>
                    <p className="text-sm font-normal text-[#4f7096]">{issue.reports} reports</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
