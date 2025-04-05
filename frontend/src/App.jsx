import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from './Components/Navbar.jsx';
import WelcomeNavbar from './Components/WelcomeNavbar.jsx';
import Footer from './Components/Footer.jsx';
import ReportIssue from "./Components/ReportIssue.jsx";
import Login from "./Components/Login.jsx";
import Register from "./Components/Registration.jsx";
import Complaints from "./Complaints.jsx";
import TopIssues from "./Components/TopIssues.jsx";
import ComplaintDetails from "./Components/ComplaintDetails.jsx";
import ComplaintsList from "./Components/ComplaintsList.jsx";
import NearbyComplaints from "./Components/NearbyComplaints.jsx";
import Profile from "./Components/Profile.jsx";
import StatisticsDashboard from "./Components/StatisticsDashboard.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import WelcomePage from "./Components/WelcomePage.jsx";
import Home from "./Components/Home.jsx";

// Wrapper for conditional navbar rendering
const Layout = ({ children }) => {
  const location = useLocation();

  // Show WelcomeNavbar only on "/"
  const showWelcomeNavbar = location.pathname === "/";

  return (
    <>
      {showWelcomeNavbar ? <WelcomeNavbar /> : <Navbar />}
      {children}
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* <Route path="/home" element={
              <>
                <HeroSection />
                <PopularIssues />
              </>
            } /> */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/complaint" element={<Complaints />} />
            <Route path="/complaints" element={<ComplaintsList />} />
            <Route path="/detail/:complaintId" element={<ComplaintDetails />} />
            <Route path="/nearby-complaints" element={<NearbyComplaints />} />
            <Route path="/all" element={<TopIssues />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/statistics" element={<StatisticsDashboard />} />     
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
