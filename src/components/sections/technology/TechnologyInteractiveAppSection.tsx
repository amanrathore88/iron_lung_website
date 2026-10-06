import React from "react";
import { motion } from "framer-motion";

export const TechnologyInteractiveAppSection: React.FC = () => {
  return (
    <section className="w-full bg-white text-neutral-900 py-16 sm:py-20 md:py-24 lg:py-28 selection:bg-[#FF5500]/20 overflow-hidden relative">
      <div className="w-[92%] sm:w-[94%] max-w-[1360px] mx-auto flex flex-col items-center">
        
        {/* ===================================================================== */}
        {/* TOP HEADLINE (Exact Title Case, Colors & Punctuation)                 */}
        {/* ===================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[76px] font-black font-sans tracking-[-0.035em] leading-[1.08] select-none">
            <span className="block text-[#0F172A]">
              Interactive App for
            </span>
            <span className="block text-[#FF5500] mt-1 sm:mt-2">
              Users & Admins.
            </span>
          </h2>
        </motion.div>

        {/* ===================================================================== */}
        {/* CENTER COMPOSITION: DESKTOP & MOBILE MOCKUPS WITH AURA GLOW           */}
        {/* ===================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[1080px] mt-10 sm:mt-14 md:mt-16 lg:mt-20 flex items-center justify-center"
        >
          {/* Subtle warm orange aura background */}
          <div 
            className="absolute -inset-4 sm:-inset-8 md:-inset-12 rounded-full pointer-events-none select-none opacity-80"
            style={{
              background: "radial-gradient(ellipse 70% 55% at 42% 50%, rgba(255, 106, 26, 0.15) 0%, rgba(255, 140, 50, 0.05) 55%, transparent 75%)",
            }}
          />

          {/* Subtle curved dashed accent ring */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-30"
            viewBox="0 0 1000 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="450"
              cy="250"
              rx="420"
              ry="210"
              stroke="#FF6A1A"
              strokeWidth="1.5"
              strokeDasharray="6 8"
            />
          </svg>

          {/* High-Resolution Dual Device Mockup (Desktop Monitor + iPhone) */}
          <div className="relative z-10 w-full flex items-center justify-center">
            <img
              src="/images/technology/interactive-app-mockup.png"
              alt="IronLung Interactive App for Users and Admins on Desktop and Mobile"
              className="w-full h-auto max-w-[1000px] object-contain select-none pointer-events-none drop-shadow-[0_16px_36px_rgba(0,0,0,0.06)]"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* ===================================================================== */}
        {/* BOTTOM PARAGRAPH (Exact Editorial Copy, Width & Typography)           */}
        {/* ===================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 text-center max-w-[840px] mx-auto px-4"
        >
          <p className="font-sans font-normal text-[#334155] sm:text-[#475569] text-base sm:text-lg md:text-[19px] lg:text-[20px] leading-[1.62] sm:leading-[1.68] tracking-[-0.01em] select-none">
            The interactive app makes it easy for users to follow their training and for admins to manage and monitor sessions. Users can view their training data, track progress and performance, admins can manage user profiles, and get easy access to all training information.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default TechnologyInteractiveAppSection;
