import React from "react";
import { motion } from "framer-motion";

export const TechnologyWhatsAppReportSection: React.FC = () => {
  return (
    <section className="w-full bg-[#fcfaf7] text-neutral-900 py-12 sm:py-16 md:py-20 lg:py-24 selection:bg-[#FF5500]/20 overflow-hidden">
      <div className="w-[92%] sm:w-[94%] max-w-[1360px] mx-auto">
        
        {/* ===================================================================== */}
        {/* DESKTOP VIEW (lg: and up)                                             */}
        {/* Exact original 2-column layout preserved line-for-line                */}
        {/* ===================================================================== */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          
          {/* LEFT COLUMN: 1:1 SQUARE ROUNDED PRODUCT DEMO IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 xl:col-span-6 w-full"
          >
            <div className="relative w-full aspect-square rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden bg-neutral-100 select-none shadow-sm">
              <img
                src="/images/technology-whatsapp-report.png"
                alt="IRONLUNG WhatsApp Performance Report Demo"
                className="w-full h-full object-cover block select-none pointer-events-none"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* RIGHT COLUMN: RIGHT-ALIGNED HEADLINE & EDITORIAL SERIF PARAGRAPH */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 xl:col-span-6 flex flex-col items-end text-right pt-2 sm:pt-4 lg:pt-6 xl:pt-8"
          >
            {/* Main Headline (Exact Title Case & Color Palette) */}
            <h2 className="text-[32px] xs:text-4xl sm:text-5xl md:text-6xl lg:text-[58px] xl:text-[72px] 2xl:text-[80px] font-black font-sans tracking-[-0.035em] leading-[1.02] text-right select-none">
              <span className="block">
                <span className="text-black">Your </span>
                <span className="text-[#FF5500]">Progress</span>
              </span>
              <span className="block text-black mt-1 sm:mt-1.5 md:mt-2">
                Right on
              </span>
              <span className="block text-[#14A536] mt-1 sm:mt-1.5 md:mt-2">
                WhatsApp
              </span>
            </h2>

            {/* Editorial Serif Description Paragraph */}
            <p className="mt-5 sm:mt-8 md:mt-10 text-right font-['Times_New_Roman',_'Times',_'Cormorant_Garamond',_Georgia,_serif] text-black text-base xs:text-lg sm:text-xl lg:text-[22px] xl:text-[25px] leading-[1.32] sm:leading-[1.36] max-w-[480px] xl:max-w-[500px] select-none">
              After every training session, you’ll
              <br className="hidden sm:inline" /> automatically receive a detailed
              <br className="hidden sm:inline" /> performance report on WhatsApp - simple,
              <br className="hidden sm:inline" /> personalized, and easy to understand.
            </p>
          </motion.div>

        </div>

        {/* ===================================================================== */}
        {/* MOBILE VIEW (< lg)                                                    */}
        {/* Responsive Reordered Stack: 1. Heading -> 2. Image -> 3. Paragraph    */}
        {/* ===================================================================== */}
        <div className="block lg:hidden flex flex-col items-center">
          
          {/* 1. HEADING FIRST */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center w-full max-w-[460px] mx-auto px-2"
          >
            <h2 className="text-[34px] xs:text-4xl sm:text-5xl font-black font-sans tracking-[-0.035em] leading-[1.04] text-center select-none">
              <span className="block">
                <span className="text-black">Your </span>
                <span className="text-[#FF5500]">Progress</span>
              </span>
              <span className="block mt-1 sm:mt-1.5 text-black">
                Right on <span className="text-[#14A536]">WhatsApp</span>
              </span>
            </h2>
          </motion.div>

          {/* 2. IMAGE SECOND */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[380px] xs:max-w-[440px] sm:max-w-[500px] mx-auto my-6 sm:my-8 px-2"
          >
            <div className="relative w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 select-none shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-neutral-200/80">
              <img
                src="/images/technology-whatsapp-report.png"
                alt="IRONLUNG WhatsApp Performance Report Demo"
                className="w-full h-full object-cover block select-none pointer-events-none"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* 3. PARAGRAPH THIRD */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="text-center w-full max-w-[480px] mx-auto px-4"
          >
            <p className="font-sans font-normal text-neutral-700 text-base xs:text-lg sm:text-xl leading-[1.55] select-none text-center">
              After every training session, you’ll automatically receive a detailed performance report on WhatsApp - simple, personalized, and easy to understand.
            </p>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default TechnologyWhatsAppReportSection;
