import React from "react";
import { motion } from "framer-motion";

interface FeatureItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    id: "01",
    number: "01",
    title: "Personalized User Profile",
    description: "Your training settings, goals and history stored securely.",
  },
  {
    id: "02",
    number: "02",
    title: "Easy Access to Training Data",
    description: "Tap and start — your data is instantly available.",
  },
  {
    id: "03",
    number: "03",
    title: "Tracks Progress Over Time",
    description: "See your improvement with every session.",
  },
];

export const TechnologySmartCardSection: React.FC = () => {
  return (
    <section 
      id="smart-card-experience"
      className="relative w-full bg-white text-neutral-900 overflow-hidden select-none"
    >
      {/* Background Soft Atmospheric Ambient Glow */}
      <div 
        className="absolute top-1/2 left-[15%] -translate-y-1/2 w-[460px] h-[460px] rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 85, 0, 0.035) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div 
        className="absolute bottom-0 right-[20%] w-[420px] h-[320px] rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 85, 0, 0.025) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Main Full-Width Content Container with generous bottom breathing room */}
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 pt-12 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 relative">
          
          {/* ================================================================= */}
          {/* LEFT COLUMN: REAL HTML/REACT TYPOGRAPHY & FEATURES (PROPORTIONAL) */}
          {/* ================================================================= */}
          <div className="w-full lg:w-[48%] xl:w-[46%] flex flex-col justify-center relative z-20 max-w-xl lg:max-w-[500px]">
            
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-black tracking-tight leading-[1.08] text-black">
                Your Training
                <span className="block text-[#FF5500] mt-1 sm:mt-1.5">
                  Always With You.
                </span>
              </h2>

              {/* Supporting Paragraph Description */}
              <p className="mt-4 sm:mt-5 text-sm sm:text-[15px] lg:text-base text-neutral-600 max-w-[460px] leading-relaxed">
                Every user gets a personalized smart card that stores their training details and{" "}
                <strong className="font-semibold text-neutral-900">
                  helps track their
                </strong>{" "}
                respiratory training journey.
              </p>
            </motion.div>

            {/* Feature List (3 Vertically Stacked Items with SVG Connector Curve) */}
            <div className="mt-8 sm:mt-10 relative">
              
              {/* Desktop Curved Connector SVG Line */}
              <div className="hidden lg:block absolute -right-6 xl:-right-10 top-0 bottom-0 w-[140px] pointer-events-none z-10">
                <svg 
                  className="w-full h-full overflow-visible" 
                  viewBox="0 0 140 240" 
                  fill="none"
                >
                  {/* Graceful flowing curve connecting nodes 1 -> 2 -> 3 -> console */}
                  <motion.path
                    d="M 10 24 C 36 24, 46 68, 46 102 C 46 140, 72 150, 72 180 C 72 215, 108 235, 145 250"
                    stroke="#FF5500"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
                  />

                  {/* Node 1: Connected to Item 01 */}
                  <motion.circle
                    cx="10"
                    cy="24"
                    r="3.5"
                    fill="#FF5500"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.3 }}
                  />

                  {/* Node 2: Connected to Item 02 */}
                  <motion.circle
                    cx="46"
                    cy="102"
                    r="3.5"
                    fill="#FF5500"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.55 }}
                  />

                  {/* Node 3: Connected to Item 03 */}
                  <motion.circle
                    cx="72"
                    cy="180"
                    r="3.5"
                    fill="#FF5500"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.8 }}
                  />
                </svg>
              </div>

              {/* Vertically Stacked Feature Items */}
              <div className="space-y-6 sm:space-y-7 lg:space-y-7">
                {features.map((feature, idx) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.12 + idx * 0.1, 
                      ease: [0.22, 1, 0.36, 1] 
                    }}
                    className="flex items-center min-h-[52px]"
                  >
                    {/* Large Soft Light Peach Number */}
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#FDCEB7] tracking-tight w-12 sm:w-14 flex-shrink-0 select-none">
                      {feature.number}
                    </span>

                    {/* Thin Vertical Orange Accent Line */}
                    <div className="w-[2.5px] h-9 sm:h-10 bg-[#FF5500] rounded-full flex-shrink-0 mx-3.5 sm:mx-4" />

                    {/* Feature Title and Description */}
                    <div className="flex-1 pr-2 sm:pr-4">
                      <h3 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight leading-snug">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-neutral-500 mt-0.5 leading-normal">
                        {feature.description}
                      </p>
                    </div>

                    {/* Horizontal Line Element with Central Orange Accent Pill */}
                    <div className="hidden sm:flex items-center w-20 lg:w-24 flex-shrink-0 relative">
                      <div className="h-[1.5px] w-full bg-neutral-200 relative flex items-center justify-center">
                        <div className="w-7 lg:w-8 h-[2.5px] bg-[#FF5500] rounded-full" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: HIGH-DEFINITION PRODUCT CONSOLE & SMART CARD VISUAL  */}
          {/* ================================================================= */}
          <div className="w-full lg:w-[52%] xl:w-[54%] flex items-center justify-center lg:justify-end relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[540px] sm:max-w-[600px] lg:max-w-none flex justify-center lg:justify-end"
            >
              <img
                src="/images/technology-smartcard-machine.png"
                alt="IRONLUNG Smart Card personal training touchscreen console and RFID interaction"
                className="w-full h-auto lg:h-[480px] xl:h-[530px] object-contain object-right-bottom select-none pointer-events-none drop-shadow-sm"
                loading="eager"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TechnologySmartCardSection;
