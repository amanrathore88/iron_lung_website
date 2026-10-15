import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Zap, TrendingUp } from "lucide-react";

export const TechnologyWhatsAppReportSection: React.FC = () => {
  return (
    <section className="w-full bg-[#fcfaf7] text-neutral-900 py-14 sm:py-18 md:py-22 lg:py-26 selection:bg-[#FF5500]/20 overflow-hidden relative">
      <div className="w-[92%] sm:w-[94%] max-w-[1280px] mx-auto flex flex-col items-center">
        
        {/* ===================================================================== */}
        {/* 1. HEADING FIRST (Centered, Responsive Clamped Typography)            */}
        {/* ===================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto px-4"
        >
          {/* Subtle Category Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/80 shadow-xs mb-4 sm:mb-5">
            <span className="w-2 h-2 rounded-full bg-[#14A536] animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Instant Delivery
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[74px] font-black font-sans tracking-[-0.035em] leading-[1.05] select-none text-center">
            <span className="text-black">Your </span>
            <span className="text-[#FF5500]">Progress</span>
            <span className="block mt-1 sm:mt-2 text-black">
              Right on <span className="text-[#14A536]">WhatsApp</span>
            </span>
          </h2>
        </motion.div>

        {/* ===================================================================== */}
        {/* 2. IMAGE SECOND (Phone Mockup Showcase with Smooth Rounded Borders)   */}
        {/* ===================================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[360px] xs:max-w-[420px] sm:max-w-[500px] md:max-w-[580px] lg:max-w-[640px] xl:max-w-[680px] mx-auto mt-8 sm:mt-10 md:mt-12 mb-8 sm:mb-10 md:mb-12 px-3 sm:px-0"
        >
          <div className="relative w-full aspect-square rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden bg-white select-none shadow-[0_16px_50px_rgba(0,0,0,0.08)] border border-neutral-200/80 group">
            <img
              src="/images/technology-whatsapp-report.png"
              alt="IRONLUNG WhatsApp Performance Report Demo"
              className="w-full h-full object-cover block select-none pointer-events-none transition-transform duration-700 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* ===================================================================== */}
        {/* 3. PARAGRAPH THIRD (Centered Editorial Description & Feature Badges)  */}
        {/* ===================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-[660px] mx-auto px-4"
        >
          {/* Exact User Copy with Clean Modern Sans Typography */}
          <p className="font-sans font-normal text-neutral-700 sm:text-neutral-800 text-base xs:text-lg sm:text-xl lg:text-[22px] leading-[1.6] sm:leading-[1.65] tracking-[-0.01em] select-none text-center">
            After every training session, you’ll automatically receive a detailed
            performance report on WhatsApp - simple, personalized, and easy to understand.
          </p>

          {/* Feature Highlights Matching Report Graphic */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-6 sm:mt-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white border border-neutral-200/90 shadow-2xs text-xs sm:text-sm font-semibold text-neutral-800">
              <BarChart3 className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Session Performance Report</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white border border-neutral-200/90 shadow-2xs text-xs sm:text-sm font-semibold text-neutral-800">
              <Zap className="w-3.5 h-3.5 text-[#14A536]" />
              <span>Key Metrics at a Glance</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white border border-neutral-200/90 shadow-2xs text-xs sm:text-sm font-semibold text-neutral-800">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Personalized Next Steps</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default TechnologyWhatsAppReportSection;
