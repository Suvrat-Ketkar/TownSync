import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import HeroSection from "./HeroSection";
import PopularIssues from "./PopularIssues";
import AuthRequired from "../Components/AuthRequired"; // ⬅️ import your reusable component

const Home = () => {
  const { user } = useAuth(); // ✅ Use context directly

  if (!user) {
    return (
      <AuthRequired message="You must be logged in to view the homepage." />
    );
  }

  return (
    <>
      <HeroSection />
      <PopularIssues />
    </>
  );
};

export default Home;
