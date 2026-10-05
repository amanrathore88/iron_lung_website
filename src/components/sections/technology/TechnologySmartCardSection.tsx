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
      className="relative w-full bg-white text-neutral-900 overflow-hidden select-none border-t border-neutral-100"
    >
      {/* Subtle atmospheric ambient glow on clean white background */}
      <div 
        className="absolute top-1/2 left-[10%] -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 85, 0, 0.035) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div 
        className="absolute bottom-0 right-[25%] w-[450px] h-[350px] rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 85, 0, 0.03) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Main Full-Width 2-Column Section Container */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-12 sm:py-16 lg:py-0 min-h-[580px] lg:h-[640px] xl:h-[680px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6 relative">
        
        {/* ================================================================= */}
        {/* LEFT COLUMN: TEXT CONTENT & FEATURE LIST (45% - 48% WIDTH)        */}
        {/* ================================================================= */}
        <div className="w-full lg:w-[47%] xl:w-[46%] flex flex-col justify-center relative z-20 py-4 lg:py-8">
          
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-[2.85rem] xl:text-[3.35rem] font-black tracking-tight leading-[1.06] text-black">
              Your Training
              <span className="block text-[#FF5500] mt-0.5 sm:mt-1">
                Always With You.
              </span>
            </h2>

            {/* Supporting Description */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-neutral-600 max-w-[480px] leading-relaxed">
              Every user gets a personalized smart card that stores their training details and{" "}
              <span className="font-semibold text-neutral-900">
                helps track their
              </span>{" "}
              respiratory training journey.
            </p>
          </motion.div>

          {/* Feature List (3 Vertically Stacked Items) */}
          <div className="mt-8 sm:mt-10 lg:mt-11 relative">
            
            {/* Desktop Dynamic SVG Connector Curve */}
            <div className="hidden lg:block absolute -right-10 xl:-right-16 top-0 bottom-0 w-[120px] xl:w-[150px] pointer-events-none z-10">
              <svg 
                className="w-full h-full overflow-visible" 
                viewBox="0 0 120 280" 
                fill="none"
              >
                {/* Flowing curve from item 01 -> item 02 -> item 03 -> machine console */}
                <motion.path
                  d="M 12 36 C 45 36, 56 90, 56 126 C 56 165, 78 214, 118 244"
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
                  cx="12"
                  cy="36"
                  r="3.5"
                  fill="#FF5500"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.3 }}
                />

                {/* Node 2: Connected to Item 02 */}
                <motion.circle
                  cx="56"
                  cy="126"
                  r="3.5"
                  fill="#FF5500"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.6 }}
                />

                {/* Node 3: Flowing toward smart-card reader */}
                <motion.circle
                  cx="90"
                  cy="226"
                  r="3.5"
                  fill="#FF5500"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.9 }}
                />
              </svg>
            </div>

            {/* Vertically Stacked Feature Items */}
            <div className="space-y-6 sm:space-y-7 lg:space-y-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ 
                    duration: 0.55, 
                    delay: 0.15 + idx * 0.12, 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  className="flex items-center group"
                >
                  {/* Large Light Orange Sequential Number */}
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

                  {/* Subtle Horizontal Line Element with Orange Dash */}
                  <div className="hidden sm:flex items-center w-20 lg:w-28 flex-shrink-0 relative">
                    {/* Background Light Gray Horizontal Track */}
                    <div className="h-[1.5px] w-full bg-neutral-200 relative flex items-center justify-center">
                      {/* Orange Central Highlight Pill */}
                      <div className="w-7 lg:w-8 h-[2.5px] bg-[#FF5500] rounded-full" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: DOMINANT PRODUCT & DISPLAY VISUAL (52% - 55% WIDTH) */}
        {/* ================================================================= */}
        <div className="w-full lg:w-[53%] xl:w-[54%] h-full flex items-center lg:items-end justify-center lg:justify-end relative z-10 self-stretch mt-4 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full flex items-center lg:items-end justify-center lg:justify-end overflow-visible"
          >
            {/* High-Definition Machine Console Visual with Smart Card & Hand Interaction */}
            <div className="relative w-full max-w-[620px] lg:max-w-none flex justify-center lg:justify-end">
              <img
                src="/images/technology-smartcard-machine.png"
                alt="IRONLUNG Smart Card personalized training console and RFID card interaction"
                className="w-full lg:w-auto h-auto lg:h-[520px] xl:h-[590px] object-contain object-bottom select-none pointer-events-none drop-shadow-sm lg:translate-x-3 xl:translate-x-6 lg:translate-y-2 xl:translate-y-4"
                loading="eager"
              />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default TechnologySmartCardSection;
