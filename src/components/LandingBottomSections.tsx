import React from "react";
import IntegratedSystemCapabilitiesSection from "./IntegratedSystemCapabilitiesSection";
import PollutionAlertSection from "./PollutionAlertSection";
import ProductVideoShowcase from "./ProductVideoShowcase";
import PartnersSection from "./PartnersSection";
import Footer from "./Footer";

/**
 * LandingBottomSections
 * 
 * Drop-in wrapper component containing all landing page sections
 * starting from "Integrated System Capabilities" down to the Footer.
 * 
 * Order of sections:
 * 1. IntegratedSystemCapabilitiesSection - 6 Core capability cards with 3D tilt & mobile carousel
 * 2. PollutionAlertSection               - Interactive AQI degradation telemetry & 3D lung modal
 * 3. ProductVideoShowcase                - Smooth container scroll video gallery & module player
 * 4. PartnersSection                     - Infinite scrolling partner logos marquee
 * 5. Footer                              - Cinematic GSAP animated footer with aurora glow
 */
export const LandingBottomSections: React.FC = () => {
  return (
    <div className="w-full bg-background text-foreground overflow-x-hidden relative">
      {/* Upper Sections (relative z-10 with opaque background to curtain-reveal the footer) */}
      <div className="relative z-10 bg-background">
        {/* 1. Integrated System Capabilities */}
        <IntegratedSystemCapabilitiesSection />

        {/* 2. Air Quality Impact & Dynamic 3D Lung Telemetry */}
        <PollutionAlertSection />

        {/* 3. Product Hardware & Software Video Showcase */}
        <ProductVideoShowcase />

        {/* 4. Partners & Supporters Infinite Marquee */}
        <PartnersSection />
      </div>

      {/* 5. Cinematic Footer */}
      <Footer />
    </div>
  );
};

export default LandingBottomSections;
