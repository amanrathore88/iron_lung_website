import React from "react";
import { HeroNavbar } from "../components/layout/HeroNavbar";
import Footer from "../components/layout/Footer";
import AboutHero from "../components/sections/about/AboutHero";
import AboutWhoWeAre from "../components/sections/about/AboutWhoWeAre";
import AboutFounders from "../components/sections/about/AboutFounders";
import AboutMentors from "../components/sections/about/AboutMentors";
import AboutCoreValues from "../components/sections/about/AboutCoreValues";
import AboutFaqSection from "../components/sections/about/AboutFaqSection";

interface AboutPageProps {
  onBookDemo: () => void;
  onContactUs: () => void;
  onNavigateSection: (section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about' | 'how-it-works' | 'book-demo' | 'contact' | 'technology') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBookDemo,
  onContactUs,
  onNavigateSection,
}) => {
  const handleNavbarNavigate = (section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about' | 'how-it-works' | 'book-demo' | 'contact' | 'technology') => {
    if (section === 'about') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigateSection(section);
    }
  };

  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-[#ff6900]/20 relative">
      {/* Website Brand Navigation Bar */}
      <HeroNavbar
        onBookDemo={onBookDemo}
        onContactUs={onContactUs}
        onNavigateSection={handleNavbarNavigate}
        activeSection="about"
      />

      <main className="flex-1">
        {/* 1. Hero 3D Product Carousel */}
        <AboutHero />

        {/* 2. Who We Are & Innovation Stats */}
        <AboutWhoWeAre />

        {/* 3. Leadership & Founders */}
        <AboutFounders />

        {/* 4. Mentors & Advisory Board */}
        <AboutMentors />

        {/* 5. Core Values */}
        <AboutCoreValues />

        {/* 6. Retained FAQs Section from existing website */}
        <AboutFaqSection />
      </main>

      {/* Retained Cinematic Shared Footer from existing website */}
      <Footer />
    </div>
  );
};

export default AboutPage;
