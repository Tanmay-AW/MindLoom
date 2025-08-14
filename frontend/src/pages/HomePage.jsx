import React from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import HeroSection from '../components/common/HeroSection.jsx';
import FeaturesSection from '../components/common/FeaturesSection.jsx';
import HowItWorksSection from '../components/common/HowItWorksSection.jsx';
import Footer from '../components/layout/Footer.jsx';
import VideoBackground from "../components/background/VideoBackground";
import ProgressGrowthChart from '../components/common/ProgressGrowthChart';

const HomePage = () => {
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <VideoBackground />
      <Navbar />
      <main>
        <HeroSection />
        <div className="relative bg-gradient-to-b from-transparent via-gray-900/80 to-gray-900/95 pt-1">
          <FeaturesSection />
          <ProgressGrowthChart />
          <HowItWorksSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
