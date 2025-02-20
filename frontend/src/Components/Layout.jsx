import React from "react";
import Navbar from "./Navbar"; // Import your Navbar component
import Footer from "./Footer"; // Import your Footer component
import { Outlet } from "react-router-dom"; // Outlet renders the child routes

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;