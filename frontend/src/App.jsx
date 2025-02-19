import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar.jsx'
import HeroSection from './Components/Herosection.jsx'
import PopularIssues from './Components/PopularIssues.jsx'
import Footer from './Components/Footer.jsx'
import ReportIssue from "./Components/ReportIssue.jsx";

// const App = () => {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         {/* Home Page */}
//         <Route path="/" element={
//           <>
//             <HeroSection />
//             <PopularIssues />
//           </>
//         } />
        
//         {/* Report Issue Page */}
//         <Route path="/report" element={<ReportIssue />} />

//       </Routes>
//       <Footer />
//     </Router>
//   );
// };

// export default App;
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<>
          <HeroSection />
          <PopularIssues />
        </>} />
        <Route path="/report" element={<ReportIssue />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
