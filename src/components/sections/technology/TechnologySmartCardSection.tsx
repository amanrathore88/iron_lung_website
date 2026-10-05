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
      {/* ===================================================================== */}
      {/* DESKTOP & TABLET VIEW (md and up): EXACT PIXEL-PERFECT TARGET DESIGN  */}
      {/* Zero boundary gaps: Machine flush against top, right, and bottom.     */}
      {/* ===================================================================== */}
      <div className="hidden md:block relative w-full bg-white">
        <div className="w-full max-w-[1920px] mx-auto relative flex justify-end">
          {/* Main Visual Banner (100% matched to target design reference) */}
          <div className="relative w-full aspect-[1270/555] max-h-[720px] overflow-hidden flex justify-end">
            <img
              src="/images/technology-smartcard-banner@2x.png"
              srcSet="/images/technology-smartcard-banner.png 1x, /images/technology-smartcard-banner@2x.png 2x"
              alt="IRONLUNG - Your Training Always With You. Personalized Smart Card Training Experience"
              className="w-full h-full object-cover object-right pointer-events-none select-none"
              loading="eager"
            />
          </div>
        </div>

        {/* Semantic Content for SEO and Screen Readers */}
        <div className="sr-only">
          <h2>Your Training Always With You.</h2>
          <p>
            Every user gets a personalized smart card that stores their training details and helps track their respiratory training journey.
          </p>
          <ul>
            {features.map((feature) => (
              <li key={feature.id}>
                <strong>{feature.number} — {feature.title}:</strong> {feature.description}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MOBILE VIEW (< md): DEDICATED TOUCH-FRIENDLY & READABLE CARD STACK    */}
      {/* ===================================================================== */}
      <div className="block md:hidden w-full px-5 py-10 sm:py-12 bg-white">
        <div className="max-w-md mx-auto">
          {/* Mobile Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-[1.08] text-black">
              Your Training
              <span className="block text-[#FF5500] mt-1">
                Always With You.
              </span>
            </h2>

            <p className="mt-3.5 text-sm text-neutral-600 leading-relaxed">
              Every user gets a personalized smart card that stores their training details and{" "}
              <strong className="font-semibold text-neutral-900">
                helps track their
              </strong>{" "}
              respiratory training journey.
            </p>
          </motion.div>

          {/* Mobile Feature Stack */}
          <div className="mt-7 space-y-5">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-start"
              >
                {/* Number */}
                <span className="text-2xl font-extrabold text-[#FDCEB7] tracking-tight w-10 flex-shrink-0 pt-0.5">
                  {feature.number}
                </span>

                {/* Vertical Orange Accent Bar */}
                <div className="w-[2.5px] h-8 bg-[#FF5500] rounded-full flex-shrink-0 mx-3 mt-1" />

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-neutral-900 tracking-tight leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-normal">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Machine & Smart Card Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="mt-8 rounded-2xl overflow-hidden border border-neutral-100 shadow-sm bg-neutral-50"
          >
            <img
              src="/images/technology-smartcard-machine.png"
              alt="IRONLUNG Touchscreen Console with Smart Card Tap Interaction"
              className="w-full h-auto object-contain object-bottom"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySmartCardSection;
