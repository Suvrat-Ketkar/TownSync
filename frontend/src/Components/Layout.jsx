import React from "react";
import Navbar from "./Navbar"; 
import Footer from "./Footer"; 
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;