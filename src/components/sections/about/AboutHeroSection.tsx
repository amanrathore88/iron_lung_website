import React from "react";
import { motion } from "framer-motion";

interface AboutHeroSectionProps {
  onExplore?: () => void;
}

export const AboutHeroSection: React.FC<AboutHeroSectionProps> = ({ onExplore }) => {
  return (
    <section className="w-full bg-white text-neutral-900 pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-14 sm:pb-18 md:pb-20 lg:pb-24 selection:bg-[#FF5500]/20 overflow-hidden">
      <div className="w-[92%] sm:w-[94%] max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-14 items-stretch">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN: TAGLINE, GIANT 4-LINE HEADLINE, & EXPLORE CTA BUTTON     */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 flex flex-col justify-between py-1 sm:py-2 md:py-3">
            
            {/* 1. TOP EDITORIAL TAGLINE */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg md:text-[19px] lg:text-[20px] font-sans font-normal text-neutral-900 leading-snug tracking-[-0.015em] max-w-[460px] select-none"
            >
              Every deeper breath fuels more energy, better endurance and a{" "}
              <span className="text-[#FF5500] font-medium">healthier tomorrow</span>.
            </motion.p>

            {/* 2. GIANT CONDENSED 4-LINE HEADLINE (SHIFTED DOWN & SLIGHTLY LARGER) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 mb-6 sm:mt-10 sm:mb-8 lg:mt-12 lg:mb-8 select-none"
            >
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[84px] xl:text-[96px] 2xl:text-[108px] font-black font-sans uppercase tracking-[-0.035em] leading-[0.91]">
                <span className="block text-[#FF5500]">THE</span>
                <span className="block text-[#FF5500]">POWER</span>
                <span className="block text-[#0B0F19]">OF EVERY</span>
                <span className="block text-[#0B0F19]">BREATH</span>
              </h1>
            </motion.div>

            {/* 3. BOTTOM PILL CTA BUTTON (EXPLORE) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="pt-2 sm:pt-4"
            >
              <button
                onClick={onExplore}
                type="button"
                className="w-full sm:w-auto px-10 py-3.5 sm:py-4 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-xs sm:text-sm tracking-[0.14em] uppercase shadow-lg shadow-[#FF5500]/25 hover:shadow-xl hover:shadow-[#FF5500]/35 active:scale-[0.98] transition-all duration-300 flex items-center justify-center cursor-pointer"
              >
                <span>EXPLORE</span>
              </button>
            </motion.div>

          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: HIGH-RES ROUNDED MOUNTAIN BREATH PHOTOGRAPH             */}
          {/* ===================================================================== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[600px] aspect-[485/536] rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] overflow-hidden bg-neutral-100 shadow-xl shadow-black/8 border border-neutral-100 select-none">
              <img
                src="/images/about/about-hero-man.jpg"
                alt="The Power of Every Breath - Athletic breath training at sunrise"
                className="w-full h-full object-cover block select-none pointer-events-none"
                loading="eager"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
