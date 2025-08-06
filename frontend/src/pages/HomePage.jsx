import React from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import HeroSection from '../components/common/HeroSection.jsx';
import FeaturesSection from '../components/common/FeaturesSection.jsx';
// --- CHANGE HERE: Import HowItWorksSection instead of TestimonialsSection ---
import HowItWorksSection from '../components/common/HowItWorksSection.jsx';
import Footer from '../components/layout/Footer.jsx';
import heroImage from '../assets/images/hero-image.webp';
import AnimatedSection from '../components/animations/AnimatedSection.jsx';

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
        
        <AnimatedSection>
          <FeaturesSection />
        </AnimatedSection>

        {/* --- CHANGE HERE: Use HowItWorksSection instead of TestimonialsSection --- */}
        <AnimatedSection>
          <HowItWorksSection />
        </AnimatedSection>

      </main>
      <Footer />
    </div>
  );
};

export default HomePage;