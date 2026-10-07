import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "what-is-ironlung",
    question: "What is IRONLUNG?",
    answer: "It is a smart Respiratory training device, engineered by IIT Kanpur",
  },
  {
    id: "who-can-use",
    question: "Who can use IRONLUNG?",
    answer: "Athletes, fitness enthusiasts, and everyday users alike.",
  },
  {
    id: "how-does-it-work",
    question: "How does IRONLUNG work?",
    answer: "It challenges breathing muscles through adjustable resistance",
  },
  {
    id: "how-often",
    question: "How often should I use IRONLUNG?",
    answer: "Use consistently according to your training protocol.",
  },
];

export const AboutFaqSection: React.FC = () => {
  // Initially null so only the questions are visible, matching the user's requirement
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-white text-neutral-900 py-14 sm:py-18 md:py-20 lg:py-24 selection:bg-[#FF5500]/20 overflow-hidden">
      <div className="w-[92%] sm:w-[94%] max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-10 xl:gap-14 items-center">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN: FAQs HEADING & ANIMATED FAQ ACCORDION BOXES              */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            
            {/* 1. FAQs Section Heading (Slightly larger, reduced spacing to boxes) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 sm:mb-5 md:mb-6 lg:mb-7"
            >
              <h2 className="text-5xl sm:text-6xl md:text-[68px] lg:text-[76px] xl:text-[82px] font-black font-sans tracking-tight text-[#FF5500] leading-none select-none">
                FAQs
              </h2>
            </motion.div>

            {/* 2. Stack of Interactive FAQ Cards */}
            <div className="space-y-3.5 sm:space-y-4 md:space-y-4.5 w-full">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      opacity: { duration: 0.5, delay: index * 0.08 },
                      y: { duration: 0.5, delay: index * 0.08 },
                      layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                    }}
                    onClick={() => toggleItem(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleItem(item.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    className={`group w-full bg-[#FFF3E6] hover:bg-[#FFEBD6] transition-colors duration-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-6.5 cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(255,85,0,0.08)] select-none border border-transparent hover:border-[#FF5500]/20 active:scale-[0.995]`}
                  >
                    {/* Header Row: Question and Animated Chevron Indicator */}
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-bold text-neutral-900 text-base sm:text-lg md:text-[18px] leading-snug group-hover:text-neutral-950 transition-colors">
                        {item.question}
                      </h3>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="shrink-0 text-neutral-500 group-hover:text-[#FF5500] transition-colors"
                      >
                        <ChevronDown className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                      </motion.div>
                    </div>

                    {/* Collapsible Answer Animated with Height & Opacity */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="faq-answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pt-2.5 sm:pt-3 text-neutral-700 sm:text-neutral-800 text-sm sm:text-base leading-relaxed font-normal">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: HIGH QUALITY ATHLETE & IRONLUNG DEVICE VISUAL           */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 w-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="w-full aspect-[4/4.2] sm:aspect-[4/3.8] lg:aspect-[4/4.4] xl:aspect-[4/4.3] max-h-[580px] rounded-2xl sm:rounded-3xl lg:rounded-[28px] overflow-hidden bg-[#101724] shadow-2xl relative"
            >
              <img
                src="/images/about/about-faq-athlete.jpg"
                alt="Athlete using IRONLUNG respiratory training device with double thumbs up"
                className="w-full h-full object-cover object-center block select-none pointer-events-none"
                loading="lazy"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutFaqSection;
