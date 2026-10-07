import React from "react";
import { motion } from "framer-motion";

export const TechnologyWhatsAppReportSection: React.FC = () => {
  return (
    <section className="w-full bg-[#fcfaf7] text-neutral-900 py-12 sm:py-16 md:py-20 lg:py-24 selection:bg-[#FF5500]/20 overflow-hidden">
      <div className="w-[92%] sm:w-[94%] max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-start">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN: 1:1 SQUARE ROUNDED PRODUCT DEMO IMAGE                   */}
          {/* ===================================================================== */}
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

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: RIGHT-ALIGNED HEADLINE & EDITORIAL SERIF PARAGRAPH     */}
          {/* ===================================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 xl:col-span-6 flex flex-col items-end text-right pt-2 sm:pt-4 lg:pt-6 xl:pt-8"
          >
            {/* Main Headline (Exact Title Case & Color Palette) */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[58px] xl:text-[72px] 2xl:text-[80px] font-black font-sans tracking-[-0.035em] leading-[1.02] text-right select-none">
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
            <p className="mt-6 sm:mt-8 md:mt-10 text-right font-['Times_New_Roman',_'Times',_'Cormorant_Garamond',_Georgia,_serif] text-black text-lg sm:text-xl lg:text-[22px] xl:text-[25px] leading-[1.32] sm:leading-[1.36] max-w-[480px] xl:max-w-[500px] select-none">
              After every training session, you’ll
              <br className="hidden sm:inline" /> automatically receive a detailed
              <br className="hidden sm:inline" /> performance report on WhatsApp - simple,
              <br className="hidden sm:inline" /> personalized, and easy to understand.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default TechnologyWhatsAppReportSection;
