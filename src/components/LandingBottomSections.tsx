import React from "react";
import PartnersSection from "./PartnersSection";
import Footer from "./Footer";

/**
 * LandingBottomSections
 * 
 * Drop-in wrapper component containing the bottom landing page sections:
 * 1. PartnersSection - Infinite scrolling partner logos marquee
 * 2. Footer          - Cinematic GSAP animated footer with aurora glow
 */
export const LandingBottomSections: React.FC = () => {
  return (
    <div className="w-full bg-background text-foreground overflow-x-hidden relative">
      {/* Upper Sections (relative z-10 with opaque background to curtain-reveal the footer) */}
      <div className="relative z-10 bg-background">
        {/* Partners & Supporters Infinite Marquee */}
        <PartnersSection />
      </div>

      {/* Cinematic Footer */}
      <Footer />
    </div>
  );
};

export default LandingBottomSections;
