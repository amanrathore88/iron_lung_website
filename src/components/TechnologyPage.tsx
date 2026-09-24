import React from "react";
import { HeroNavbar } from "./HeroNavbar";
import Footer from "./Footer";
import ConsoleInteractiveSection from "./ConsoleInteractiveSection";
import HardwareSpecsMatrixSection from "./HardwareSpecsMatrixSection";
import DeviceSpecsSection from "./DeviceSpecsSection";
import DeviceAnatomySection from "./DeviceAnatomySection";

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
    if (section === 'technology' || section === 'screen') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigateSection(section);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-[#ff6900]/20 relative">
      {/* Website's Existing Brand Navigation Bar */}
      <HeroNavbar
        onBookDemo={onBookDemo}
        onContactUs={onContactUs}
        onNavigateSection={handleNavbarNavigate}
        activeSection="technology"
      />

      <main className="flex-1 pt-20 sm:pt-24 md:pt-28">
        {/* 1. 22-Inch Interactive Console Showcase (5 Live UI Screen Modes) */}
        <ConsoleInteractiveSection />

        {/* 2. Unified Hardware Specifications, Dimensions, Weight & Pricing Matrix */}
        <HardwareSpecsMatrixSection onReserve={onContactUs} reserveUrl="#contact" />

        {/* 3. Detailed Hardware Specs & Lineup Comparison Card */}
        <DeviceSpecsSection onReserve={onContactUs} reserveUrl="#contact" />

        {/* 4. Multi-Stage Scroll-Linked Device Anatomy (Display, Hub, UV Chamber) */}
        <DeviceAnatomySection />
      </main>

      {/* Cinematic Shared Footer */}
      <Footer />
    </div>
  );
};

export default TechnologyPage;
