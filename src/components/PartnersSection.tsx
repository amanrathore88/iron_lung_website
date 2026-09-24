import React from "react";
import { KineticText } from "./ui/kinetic-text";

const logos = [
  { src: "https://medantrik.com/assets/BrandLogo3-B8OFufPX.png", alt: "Partner 1" },
  { src: "https://medantrik.com/assets/BrandLogo2-3Ee97OAL.png", alt: "Partner 2" },
  { src: "https://medantrik.com/assets/BrandLogo4-93-SMUOf.png", alt: "Partner 3" },
  { src: "https://medantrik.com/assets/BrandLogo5-DcE8G5E6.png", alt: "Partner 4" },
  { src: "https://medantrik.com/assets/BrandLogo6-D8_26e3Q.png", alt: "Partner 5" },
  { src: "https://medantrik.com/assets/BrandLogo7-WMmXLgoM.png", alt: "Partner 6" },
  { src: "https://medantrik.com/logo/logo.png", alt: "Partner 7" },
];

const PartnersSection = () => {
  return (
    <section className="py-16 sm:py-20 bg-background border-t border-border/50 overflow-hidden relative">
      <div className="container px-4 md:px-6 mx-auto mb-12 text-center">
        <div className="mb-4">
          <KineticText 
            text="Our Partners & Supporters" 
            as="h2" 
            className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground" 
          />
        </div>
        <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
          Revolutionary smart respiration technology for healthier lungs and better breathing.
        </p>
      </div>

      <div className="container-fluid relative max-w-[100vw] overflow-hidden">
        {/* Gradients for smooth fade out at edges */}
        <div className="absolute inset-y-0 left-0 w-1/6 md:w-1/4 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-1/6 md:w-1/4 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

        <div 
          className="flex gap-8 sm:gap-14 md:gap-24 overflow-hidden py-4"
          style={{ "--gap": "2rem", "--md-gap": "6rem" } as React.CSSProperties}
        >
          <div className="flex shrink-0 items-center justify-around gap-8 sm:gap-14 md:gap-24 animate-marquee">
            {logos.map((logo, i) => (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                className="h-10 sm:h-14 md:h-16 w-auto object-contain transition-all duration-300 opacity-90 hover:opacity-100"
                loading="lazy"
              />
            ))}
          </div>
          <div className="flex shrink-0 items-center justify-around gap-8 sm:gap-14 md:gap-24 animate-marquee" aria-hidden="true">
            {logos.map((logo, i) => (
              <img
                key={`duplicate-${i}`}
                src={logo.src}
                alt={logo.alt}
                className="h-10 sm:h-14 md:h-16 w-auto object-contain transition-all duration-300 opacity-90 hover:opacity-100"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
