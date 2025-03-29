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
import ComplaintDetails from "./Components/ComplaintDetails.jsx";
import Profile from "./Components/Profile.jsx";
import StatisticsDashboard from "./Components/StatisticsDashboard.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const App = () => {
  return (
    <AuthProvider>
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
          <Route path="/nearby-complaints" element={<ComplaintDetails />} />
          <Route path="/all" element={<TopIssues />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/statistics" element={<StatisticsDashboard />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;