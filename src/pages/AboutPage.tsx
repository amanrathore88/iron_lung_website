import React from "react";
import { HeroNavbar } from "../components/layout/HeroNavbar";
import Footer from "../components/layout/Footer";
import AboutHeroSection from "../components/sections/about/AboutHeroSection";
import AboutPillarsSection from "../components/sections/about/AboutPillarsSection";
import AboutTeamSection from "../components/sections/about/AboutTeamSection";
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
        {/* Dedicated About Hero Section matching reference */}
        <AboutHeroSection onExplore={() => onNavigateSection('how-it-works')} />

        {/* Pillars Section: MORE OXYGEN | MORE LIFE matching reference */}
        <AboutPillarsSection />

        {/* Our Team Section matching reference */}
        <AboutTeamSection onEmailClick={() => onContactUs()} />

        {/* FAQs Section with animated boxes and athlete visual */}
        <AboutFaqSection />
      </main>

      {/* Cinematic Shared Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;
