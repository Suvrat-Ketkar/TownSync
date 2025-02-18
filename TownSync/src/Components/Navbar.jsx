import React from "react";
const Navbar = () => {
    return (
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e8edf3] px-10 py-5 bg-[#0FA4AF]">
        <div className="flex items-center gap-4 text-[#0e141b]">
          <h2 className="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em]">TownSync</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <a className="text-[#0e141b] text-sm font-medium leading-normal" href="#">Report Issue</a>
            <a className="text-[#0e141b] text-sm font-medium leading-normal" href="#">Track Issue</a>
            <a className="text-[#0e141b] text-sm font-medium leading-normal" href="#">Login</a>
          </div>
        </div>
      </header>
    );
  };

  export default Navbar;