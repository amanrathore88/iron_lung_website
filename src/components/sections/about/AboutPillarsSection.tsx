import React from "react";
import { motion } from "framer-motion";

interface PillarItem {
  id: string;
  iconSrc: string;
  title: string;
  description: string;
}

const PILLARS: PillarItem[] = [
  {
    id: "structured",
    iconSrc: "/images/about/icons/about-icon-1.png",
    title: "STRUCTURED",
    description: "A guided approach to systematic respiratory training",
  },
  {
    id: "measurable",
    iconSrc: "/images/about/icons/about-icon-2.png",
    title: "MEASURABLE",
    description: "Track your progress with data driven respiratory insights",
  },
  {
    id: "accessible",
    iconSrc: "/images/about/icons/about-icon-3.png",
    title: "ACCESSIBLE",
    description: "Respiratory training designed for everyone, everywhere",
  },
];

export const AboutPillarsSection: React.FC = () => {
  return (
    <section className="w-full bg-white text-neutral-900 py-12 sm:py-16 md:py-20 lg:py-24 selection:bg-[#FF5500]/20 overflow-hidden">
      <div className="w-[92%] sm:w-[94%] max-w-[1360px] mx-auto">
        
        {/* ===================================================================== */}
        {/* SECTION HEADER: MORE OXYGEN | MORE LIFE & SUPPORTING MANIFESTO       */}
        {/* ===================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          {/* Main Headline with Split Colors & Dual-Tone Divider Bar */}
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-black font-sans tracking-[-0.03em] leading-none uppercase inline-flex flex-wrap items-center select-none">
            <span className="text-[#FF5500]">MORE OXYGEN</span>
            {/* Two-Tone Vertical Divider Accent Bar (|) */}
            <span
              aria-hidden="true"
              className="inline-flex h-[0.82em] w-[6px] xs:w-[7px] sm:w-[9px] md:w-[11px] rounded-xs overflow-hidden mx-2 xs:mx-2.5 sm:mx-3.5 md:mx-4.5 shrink-0 self-center"
            >
              <span className="w-1/2 h-full bg-[#0F172A]" />
              <span className="w-1/2 h-full bg-[#FF5500]" />
            </span>
            <span className="text-[#0F172A]">MORE LIFE</span>
          </h2>

          {/* Editorial Supporting Manifesto */}
          <p className="mt-4 sm:mt-5 md:mt-6 font-sans text-neutral-800 sm:text-neutral-900 text-base sm:text-lg md:text-[20px] lg:text-[21px] leading-[1.4] tracking-[-0.015em] max-w-[780px] select-none">
            We believe Better Breathing is the foundation of Better performance, therefore IRONLUNG makes Respiratory training,
          </p>
        </motion.div>

        {/* ===================================================================== */}
        {/* 3 VALUE CARDS: STRUCTURED, MEASURABLE, ACCESSIBLE                    */}
        {/* ===================================================================== */}
        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 items-stretch">
          {PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative bg-[#FFF3E6] rounded-[22px] sm:rounded-[26px] lg:rounded-[30px] p-6 sm:p-7 md:p-8 lg:p-9 flex flex-col justify-between min-h-[290px] sm:min-h-[310px] md:min-h-[330px] border border-[#FFE7CF]/80 shadow-sm hover:shadow-xl hover:shadow-[#FF5500]/5 hover:-translate-y-1 transition-all duration-300 select-none"
            >
              {/* Card Top: High-Res Line Art Icon */}
              <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] flex items-center justify-start">
                <img
                  src={pillar.iconSrc}
                  alt={`${pillar.title} Icon`}
                  className="w-full h-full object-contain block select-none pointer-events-none group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Card Bottom: Orange Uppercase Title & Description */}
              <div className="mt-8 sm:mt-10 md:mt-12">
                <h3 className="text-xl sm:text-2xl md:text-[25px] font-bold font-sans uppercase tracking-[-0.01em] text-[#FF5500]">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 sm:mt-3 text-neutral-900 font-sans text-sm sm:text-base md:text-[17px] leading-snug sm:leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutPillarsSection;
