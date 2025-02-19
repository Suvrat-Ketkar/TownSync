import React from "react";
import { BrowserRouter as Router , Routes , Route } from "react-router-dom";
import Navbar from './Components/Navbar.jsx'
import HeroSection from './Components/Herosection.jsx'
import PopularIssues from './Components/PopularIsuues.jsx'
import Footer from './Components/Footer.jsx'
import Register from "./Components/Registration.jsx";
import Login from "./Components/Login.jsx";
import Layout from "./Components/Layout.jsx";
const App = () => {
  return (
    // <div>
    //   {/* <Navbar />
    //   <HeroSection />
    //   <PopularIssues />
    //   <Footer /> */}
    //   <Navbar />
    //   <Login />
    //   <Footer></Footer>
    // </div>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
