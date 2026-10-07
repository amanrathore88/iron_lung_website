import React from "react";
import { HeroNavbar } from "../components/layout/HeroNavbar";
import Footer from "../components/layout/Footer";

import TechnologyHeroSection from "../components/sections/technology/TechnologyHeroSection";
import TechnologyWhatsAppReportSection from "../components/sections/technology/TechnologyWhatsAppReportSection";
import TechnologyInteractiveAppSection from "../components/sections/technology/TechnologyInteractiveAppSection";
import TechnologyCtaSection from "../components/sections/technology/TechnologyCtaSection";

interface TechnologyPageProps {
  onBookDemo: () => void;
  onContactUs: () => void;
  onNavigateSection: (section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about' | 'how-it-works' | 'book-demo' | 'contact' | 'technology') => void;
}

export const TechnologyPage: React.FC<TechnologyPageProps> = ({
  onBookDemo,
  onContactUs,
  onNavigateSection,
}) => {
  const handleNavbarNavigate = (section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about' | 'how-it-works' | 'book-demo' | 'contact' | 'technology') => {
    if (section === 'technology' || section === 'how-it-works') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigateSection(section);
    }
  };

  return (
    <div className="bg-[#fcfaf7] text-foreground min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-[#ff6900]/20 relative">
      {/* Website's Existing Brand Navigation Bar */}
      <HeroNavbar
        onBookDemo={onBookDemo}
        onContactUs={onContactUs}
        onNavigateSection={handleNavbarNavigate}
        activeSection="how-it-works"
      />

      <main className="flex-1">
        {/* Technology Hero Section matching reference layout with video */}
        <TechnologyHeroSection />

        {/* WhatsApp Performance Report Section matching exact design replica */}
        <TechnologyWhatsAppReportSection />

        {/* Interactive App for Users & Admins Section matching exact design replica */}
        <TechnologyInteractiveAppSection />

        {/* Ready to Begin Your Respiratory Training CTA Section */}
        <TechnologyCtaSection
          onBookDemo={onBookDemo}
          onContactUs={onContactUs}
        />
      </main>

      {/* Cinematic Shared Footer */}
      <Footer />
    </div>
  );
};

export default TechnologyPage;
