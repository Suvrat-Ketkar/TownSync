import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from './Components/Navbar.jsx';
import WelcomeNavbar from './Components/WelcomeNavbar.jsx';
import AuthorityNavbar from './Components/AuthorityNavbar.jsx'; // New Navbar for authorities
import Footer from './Components/Footer.jsx';
import ReportIssue from "./Components/ReportIssue.jsx";
import Login from "./Components/Login.jsx";
import Register from "./Components/Registration.jsx";
import TopIssues from "./Components/TopIssues.jsx";
import ComplaintDetails from "./Components/ComplaintDetails.jsx";
import ComplaintsList from "./Components/ComplaintsList.jsx";
import NearbyComplaints from "./Components/NearbyComplaints.jsx";
import Profile from "./Components/Profile.jsx";
import StatisticsDashboard from "./Components/StatisticsDashboard.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import WelcomePage from "./Components/WelcomePage.jsx";
import Home from "./Components/Home.jsx";
import { AuthorityDashboard } from "./Components/AuthorityDashboard.jsx"
import { AuthStatisticsDashboard } from "./Components/AuthStatisticsDashboard.jsx"
import { AuthProfile } from "./Components/AuthProfile.jsx"

// Wrapper for conditional navbar rendering
const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthorityPage = location.pathname.startsWith("/authority-dashboard");
  const welcomeNavbarRoutes = ["/", "/about-us", "/testimonials", "/contact-us"];
  const showWelcomeNavbar = welcomeNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showWelcomeNavbar ? <WelcomeNavbar /> : isAuthorityPage? <AuthorityNavbar /> : <Navbar />}
      {children}
      <Footer />
    </>
  );
};

// Protected HomeRoute component
const HomeRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // or a spinner
  return user ? <Home /> : <Navigate to="/" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/home" element={<HomeRoute />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/complaints" element={<ComplaintsList />} />
            <Route path="/detail/:complaintId" element={<ComplaintDetails />} />
            <Route path="/nearby-complaints" element={<NearbyComplaints />} />
            <Route path="/all" element={<TopIssues />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/statistics" element={<StatisticsDashboard />} />
            <Route path="/authority-dashboard" element={<AuthorityDashboard />} />
            <Route path="/authority-dashboard/statistics" element={<AuthStatisticsDashboard />} />
            <Route path="/authority-dashboard/profile" element={<AuthProfile />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
