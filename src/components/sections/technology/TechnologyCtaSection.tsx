import React from "react";
import { motion } from "framer-motion";

interface TechnologyCtaSectionProps {
  onBookDemo?: () => void;
  onContactUs?: () => void;
}

export const TechnologyCtaSection: React.FC<TechnologyCtaSectionProps> = ({
  onBookDemo,
  onContactUs,
}) => {
  return (
    <section className="w-full bg-white text-neutral-900 py-14 sm:py-16 md:py-20 lg:py-24 selection:bg-[#FF5500]/20 relative">
      <div className="w-[92%] sm:w-[94%] max-w-[1100px] mx-auto flex flex-col items-center text-center">
        
        {/* ===================================================================== */}
        {/* HEADLINE: TWO LINES (Ready to Begin / Your Respiratory Training?)     */}
        {/* ===================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl sm:text-5xl md:text-[56px] lg:text-[64px] xl:text-[70px] font-black font-sans tracking-[-0.03em] select-none flex flex-col items-center gap-2 sm:gap-3 md:gap-3.5">
            <span className="text-[#0F172A] leading-[1.12]">
              Ready to Begin
            </span>
            <span className="text-[#FF5500] leading-[1.12]">
              Your Respiratory Training?
            </span>
          </h2>
        </motion.div>

        {/* ===================================================================== */}
        {/* SUPPORTING TEXT                                                       */}
        {/* ===================================================================== */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 sm:mt-6 max-w-[620px] text-center font-sans text-neutral-600 sm:text-neutral-700 text-base sm:text-lg md:text-[18.5px] leading-relaxed tracking-[-0.01em] select-none px-4"
        >
          Discover how IRONLUNG can elevate your performance and bring respiratory training to your fitness or wellness center.
        </motion.p>

        {/* ===================================================================== */}
        {/* CALL TO ACTION BUTTONS                                                */}
        {/* ===================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4.5 w-full sm:w-auto"
        >
          {/* Primary Action: Book a Demo */}
          <button
            onClick={onBookDemo}
            type="button"
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white font-semibold text-base sm:text-[16px] tracking-[-0.01em] shadow-md shadow-[#FF5500]/25 hover:shadow-lg hover:shadow-[#FF5500]/35 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Book a Demo</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          {/* Secondary Action: Contact Us */}
          <button
            onClick={onContactUs}
            type="button"
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-base sm:text-[16px] tracking-[-0.01em] border border-neutral-200/90 hover:border-neutral-300 shadow-xs active:scale-[0.98] transition-all duration-300 flex items-center justify-center cursor-pointer"
          >
            <span>Contact Us</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default TechnologyCtaSection;
