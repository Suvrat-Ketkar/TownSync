import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar.jsx'
import HeroSection from './Components/Herosection.jsx'
import PopularIssues from './Components/PopularIssues.jsx'
import Footer from './Components/Footer.jsx'
import ReportIssue from "./Components/ReportIssue.jsx";
import Login from "./Components/Login.jsx";
import Register from "./Components/Registration.jsx";
import ComplaintsTracking from "./Components/Complaints.jsx";
import Complaints from "./Complaints.jsx";
import TopIssues from "./Components/TopIssues.jsx";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <PopularIssues />
          </>
        } />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complaint" element={<Complaints />} />
        <Route path="/all" element={<TopIssues />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;