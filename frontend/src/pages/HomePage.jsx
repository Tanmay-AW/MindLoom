import React from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import HeroSection from '../components/common/HeroSection.jsx';
import FeaturesSection from '../components/common/FeaturesSection.jsx';
import TestimonialsSection from '../components/common/TestimonialsSection.jsx';
import Footer from '../components/layout/Footer.jsx';
import heroImage from '../assets/images/hero-image.jpg';
import AnimatedSection from '../components/animations/AnimatedSection.jsx'; // 1. Import the animation component

const HomePage = () => {
  return (
    <div>
      <div 
        className="fixed top-0 left-0 w-full h-screen bg-cover bg-center -z-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      <div className="fixed top-0 left-0 w-full h-screen bg-primary-blue bg-opacity-30 -z-10"></div>
      
      <Navbar />
      <main>
        <HeroSection />
        
        {/* 2. Wrap the FeaturesSection with the animation component */}
        <AnimatedSection>
          <FeaturesSection />
        </AnimatedSection>

        {/* 3. Wrap the TestimonialsSection with the animation component */}
        <AnimatedSection>
          <TestimonialsSection />
        </AnimatedSection>

      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
