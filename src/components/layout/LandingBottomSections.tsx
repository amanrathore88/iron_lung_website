import React from "react";
import BreathingCtaSection from "../sections/cta/BreathingCtaSection";
import PartnersSection from "../sections/partners/PartnersSection";
import Footer from "./Footer";

interface LandingBottomSectionsProps {
  onBookDemo?: () => void;
}

/**
 * LandingBottomSections
 * 
 * Drop-in wrapper component containing the bottom landing page sections:
 * 1. BreathingCtaSection - Minimal editorial CTA section ("Know Your Lungs, Train Better.")
 * 2. PartnersSection     - Infinite scrolling partner logos marquee
 * 3. Footer              - Cinematic GSAP animated footer with aurora glow
 */
export const LandingBottomSections: React.FC<LandingBottomSectionsProps> = ({
  onBookDemo,
}) => {
  return (
    <div className="w-full bg-background text-foreground overflow-x-hidden relative">
      {/* Upper Sections (relative z-10 with opaque background to curtain-reveal the footer) */}
      <div className="relative z-10 bg-background">
        {/* Editorial CTA Section directly above Partners & Supporters */}
        <BreathingCtaSection onBookDemo={onBookDemo} />

        {/* Partners & Supporters Infinite Marquee */}
        <PartnersSection />
      </div>

      {/* Cinematic Footer */}
      <Footer />
    </div>
  );
};

export default LandingBottomSections;
