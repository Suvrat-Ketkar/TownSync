import React from "react";
import Navbar from './Components/Navbar.jsx'
import HeroSection from './Components/Herosection.jsx'
import PopularIssues from './Components/PopularIsuues.jsx'
import Footer from './Components/Footer.jsx'
const App = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <PopularIssues />
      <Footer />
    </div>
  );
};

export default App;
