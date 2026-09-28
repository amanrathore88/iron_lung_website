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
        {/* Centered Phone Mockup directly underneath the Desktop Dashboard Mockup */}
        <section
          className="relative w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 pt-4 sm:pt-6 md:pt-8 pb-16 sm:pb-20 md:pb-28 overflow-hidden"
          style={{
            backgroundColor: "#FAF7F2",
            backgroundImage:
              "radial-gradient(ellipse at 50% 45%, rgba(255, 105, 0, 0.08) 0%, rgba(250, 247, 242, 0) 65%)",
          }}
        >
          <div className="relative flex items-center justify-center w-full max-w-md mx-auto">
            {/* Ambient Warm Theme-Orange Backlight Glow */}
            <div
              className="absolute -inset-6 sm:-inset-10 md:-inset-14 rounded-[3rem] pointer-events-none -z-10"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255, 105, 0, 0.26) 0%, rgba(255, 105, 0, 0.10) 50%, transparent 72%)",
                filter: "blur(38px)",
              }}
            />

            {/* Full Uncropped Phone Mockup */}
            <img
              src="/images/dashboard/phone-mockup.png"
              alt="Iron Lung Mobile App Session Report Mockup"
              className="w-[260px] sm:w-[300px] md:w-[340px] lg:w-[370px] h-auto max-h-[78vh] object-contain block select-none pointer-events-none mx-auto"
              style={{
                filter:
                  "drop-shadow(0 26px 44px rgba(0, 0, 0, 0.16)) drop-shadow(0 8px 18px rgba(255, 105, 0, 0.12))",
              }}
            />
          </div>
        </section>

        {/* Partners & Supporters Infinite Marquee */}
        <PartnersSection />
      </div>

      {/* Cinematic Footer */}
      <Footer />
    </div>
  );
};

export default LandingBottomSections;
