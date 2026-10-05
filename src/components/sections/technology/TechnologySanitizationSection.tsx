import React from "react";
import { motion } from "framer-motion";

// Custom matching SVG icons for the 4 features
const UvcSunburstIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px] text-[#FF5500]" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
    <line x1="12" y1="2" x2="12" y2="5.5" />
    <line x1="12" y1="18.5" x2="12" y2="22" />
    <line x1="2" y1="12" x2="5.5" y2="12" />
    <line x1="18.5" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="7.4" y2="7.4" />
    <line x1="16.6" y1="16.6" x2="19.07" y2="19.07" />
    <line x1="4.93" y1="19.07" x2="7.4" y2="16.6" />
    <line x1="16.6" y1="7.4" x2="19.07" y2="4.93" />
  </svg>
);

const ReplaceableMouthpieceIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px] text-[#FF5500]" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 6.5h10a2 2 0 0 1 2 2v2a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3v-2a2 2 0 0 1 2-2z" />
    <path d="M9.5 13.5v3.5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3.5" />
    <line x1="4" y1="9.5" x2="6" y2="9.5" />
    <line x1="18" y1="9.5" x2="20" y2="9.5" />
  </svg>
);

const HighUseEnduranceIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px] text-[#FF5500]" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="2.4" />
    <path d="M6.5 20.5v-3.2a4 4 0 0 1 3.5-3.8h4a4 4 0 0 1 3.5 3.8v3.2" />
    <path d="M3.5 13.2l2.5-1.5" />
    <path d="M20.5 13.2l-2.5-1.5" />
  </svg>
);

const EasyMaintenanceIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px] text-[#FF5500]" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8.5" cy="8.5" r="3.2" />
    <circle cx="15.5" cy="8.5" r="3.2" />
    <circle cx="8.5" cy="15.5" r="3.2" />
    <circle cx="15.5" cy="15.5" r="3.2" />
  </svg>
);

export const TechnologySanitizationSection: React.FC = () => {
  return (
    <section className="relative w-full bg-[#050505] text-white overflow-hidden border-t border-white/[0.07] select-none">
      {/* Background Soft Atmospheric Ambient Glows */}
      <div 
        className="absolute top-1/2 left-[28%] -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(130, 60, 255, 0.14) 0%, rgba(80, 25, 200, 0.05) 45%, transparent 72%)',
          filter: 'blur(54px)',
        }}
      />
      <div 
        className="absolute top-1/2 right-[20%] -translate-y-1/2 w-[460px] h-[460px] rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 85, 0, 0.06) 0%, transparent 68%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Main Full-Width 2-Column Banner Container */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-12 sm:py-16 lg:py-0 min-h-[520px] lg:h-[560px] xl:h-[590px] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12 relative z-10">
        
        {/* ================================================================= */}
        {/* LEFT COLUMN: FLOATING PRODUCT VISUAL (52% - 55% WIDTH)            */}
        {/* ================================================================= */}
        <div className="w-full lg:w-[53%] xl:w-[54%] flex items-center justify-center lg:justify-start relative">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[500px] sm:max-w-[540px] lg:max-w-none flex items-center justify-center"
          >
            {/* Localized chamber UV glow behind the transparent nozzle window */}
            <div 
              className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[320px] aspect-square rounded-full pointer-events-none -z-10"
              style={{
                background: 'radial-gradient(circle, rgba(145, 75, 255, 0.28) 0%, rgba(95, 30, 220, 0.10) 45%, transparent 70%)',
                filter: 'blur(32px)',
              }}
            />

            {/* Subtle soft grounding shadow */}
            <div 
              className="absolute -bottom-4 left-[36%] -translate-x-1/2 w-[240px] sm:w-[300px] h-7 rounded-full pointer-events-none -z-10"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.25) 55%, transparent 75%)',
                filter: 'blur(12px)',
              }}
            />

            {/* Anti-Gravity Floating Foreground Element (Stable, slow natural elevation) */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-full flex items-center justify-center lg:justify-start"
            >
              <img
                src="/images/technology-uvc-clean@2x.png"
                alt="Iron Lung UV-C Sanitization Chamber & Precision Nozzle"
                className="w-full h-auto max-h-[340px] sm:max-h-[390px] lg:max-h-[430px] xl:max-h-[460px] object-contain select-none pointer-events-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: TECHNOLOGY MESSAGING & 2x2 FEATURE GRID (45% - 48%) */}
        {/* ================================================================= */}
        <div className="w-full lg:w-[47%] xl:w-[46%] flex flex-col justify-center text-left max-w-xl lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Small Uppercase Technology Label */}
            <div className="text-[10px] xs:text-[11px] sm:text-xs font-mono font-bold tracking-[0.22em] text-neutral-400 uppercase mb-2.5 sm:mb-3">
              PRECISION BREATHING TECHNOLOGY
            </div>

            {/* Primary Headline Split Across Two Lines */}
            <h2 className="text-3xl xs:text-4xl sm:text-[44px] lg:text-[46px] xl:text-[52px] font-black font-display tracking-[-0.03em] leading-[1.07] mb-3 sm:mb-4">
              <span className="block text-white">A Cleaner Session</span>
              <span className="block text-[#FF5500]">Every Time.</span>
            </h2>

            {/* Short Supporting Statement */}
            <p className="text-neutral-300 text-sm sm:text-base lg:text-[16.5px] font-normal leading-relaxed max-w-lg mb-8 sm:mb-9 lg:mb-10">
              Hygienic, safe and designed for multi-user environments.
            </p>

            {/* 2 × 2 Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 lg:gap-x-10 gap-y-5 sm:gap-y-6 lg:gap-y-7">
              {/* Feature 1: UV-C Sanitization */}
              <div className="flex items-start gap-3 sm:gap-3.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-[1.75px] border-[#FF5500] flex items-center justify-center shrink-0 bg-[#FF5500]/[0.08] shadow-[0_0_12px_rgba(255,85,0,0.16)]">
                  <UvcSunburstIcon />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-white text-sm sm:text-[15px] font-bold tracking-tight leading-snug">
                    UV-C Sanitization
                  </h4>
                  <p className="text-neutral-400 text-xs sm:text-[12.5px] leading-relaxed mt-0.5">
                    Keeps every session hygienic.
                  </p>
                </div>
              </div>

              {/* Feature 2: Replaceable Mouthpiece */}
              <div className="flex items-start gap-3 sm:gap-3.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-[1.75px] border-[#FF5500] flex items-center justify-center shrink-0 bg-[#FF5500]/[0.08] shadow-[0_0_12px_rgba(255,85,0,0.16)]">
                  <ReplaceableMouthpieceIcon />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-white text-sm sm:text-[15px] font-bold tracking-tight leading-snug">
                    Replaceable Mouthpiece
                  </h4>
                  <p className="text-neutral-400 text-xs sm:text-[12.5px] leading-relaxed mt-0.5">
                    Clean. Safe. Hassle-free.
                  </p>
                </div>
              </div>

              {/* Feature 3: Built for High-Use */}
              <div className="flex items-start gap-3 sm:gap-3.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-[1.75px] border-[#FF5500] flex items-center justify-center shrink-0 bg-[#FF5500]/[0.08] shadow-[0_0_12px_rgba(255,85,0,0.16)]">
                  <HighUseEnduranceIcon />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-white text-sm sm:text-[15px] font-bold tracking-tight leading-snug">
                    Built for High-Use
                  </h4>
                  <p className="text-neutral-400 text-xs sm:text-[12.5px] leading-relaxed mt-0.5">
                    Ideal for gyms & wellness centers
                  </p>
                </div>
              </div>

              {/* Feature 4: Easy Maintenance */}
              <div className="flex items-start gap-3 sm:gap-3.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-[1.75px] border-[#FF5500] flex items-center justify-center shrink-0 bg-[#FF5500]/[0.08] shadow-[0_0_12px_rgba(255,85,0,0.16)]">
                  <EasyMaintenanceIcon />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-white text-sm sm:text-[15px] font-bold tracking-tight leading-snug">
                    Easy Maintenance
                  </h4>
                  <p className="text-neutral-400 text-xs sm:text-[12.5px] leading-relaxed mt-0.5">
                    Designed for long-term use
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default TechnologySanitizationSection;
