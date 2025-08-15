import React from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import HeroSection from '../components/common/HeroSection.jsx';
import FeaturesSection from '../components/common/FeaturesSection.jsx';
import HowItWorksSection from '../components/common/HowItWorksSection.jsx';
import Footer from '../components/layout/Footer.jsx';
import ReflectBackground from '../components/background/ReflectBackground.jsx';
import ProgressGrowthChart from '../components/common/ProgressGrowthChart';

const HomePage = () => {
  return (
    <div>
      {/* The animated background is now fixed to the viewport, acting as a persistent visual layer */}
      <div className="fixed inset-0 -z-10">
        <ReflectBackground />
      </div>

      {/* The Navbar is also fixed and will float over all content */}
      <Navbar />

      {/* The main scrollable content of the page */}
      <main>
        <HeroSection />

        {/* This container holds all the content that scrolls over the background */}
        {/* The gradient creates a seamless blend from the hero into the content */}
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
