import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

interface BreathingCtaSectionProps {
  onBookDemo?: () => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const BreathingCtaSection: React.FC<BreathingCtaSectionProps> = ({
  onBookDemo,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });

  // Subtle few-pixel depth parallax while scrolling through the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const headlineParallaxY = useTransform(scrollYProgress, [0, 1], [6, -6]);
  const paragraphParallaxY = useTransform(scrollYProgress, [0, 1], [4, -4]);
  const buttonParallaxY = useTransform(scrollYProgress, [0, 1], [2.5, -2.5]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#FDFDFD] text-black overflow-hidden py-12 sm:py-14 md:py-16 border-t border-black/[0.04]"
    >
      {/* Main Centered Editorial Content Container */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-12 md:px-16 flex flex-col items-center text-center">
        {/* 1. Primary Display Headline: Line-by-line upward reveal (+120ms for line 2, delayed "Train Better.") */}
        <motion.div style={{ y: headlineParallaxY }}>
          <h2 className="text-[36px] xs:text-[40px] sm:text-[54px] md:text-[64px] lg:text-[72px] font-extrabold tracking-[-0.035em] leading-[1.06] text-black">
            <motion.span
              initial={{ opacity: 0, y: 35 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
              transition={{
                delay: 0.08,
                duration: 0.62,
                ease: EASE_OUT_EXPO,
              }}
              className="block"
            >
              Know Your
            </motion.span>
            <span className="block">
              <motion.span
                initial={{ opacity: 0, y: 35 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }
                }
                transition={{
                  delay: 0.2, // 120ms after "Know Your"
                  duration: 0.62,
                  ease: EASE_OUT_EXPO,
                }}
                className="inline-block"
              >
                Lungs,
              </motion.span>{' '}
              <motion.span
                initial={{ opacity: 0, y: 35 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }
                }
                transition={{
                  delay: 0.34, // Arrives slightly later so the orange text gets emphasis
                  duration: 0.64,
                  ease: EASE_OUT_EXPO,
                }}
                className="inline-block text-[#F53D00]"
              >
                Train Better.
              </motion.span>
            </span>
          </h2>
        </motion.div>

        {/* 2. Subtitle / Value Statement: Starts after headline completes, opacity 0->1, translateY(12px->0), ~0.5s */}
        <motion.div style={{ y: paragraphParallaxY }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              delay: 0.54,
              duration: 0.5,
              ease: EASE_OUT_EXPO,
            }}
            className="text-[16px] sm:text-[19px] md:text-[22px] text-[#1E1E1E] font-light leading-[1.45] tracking-[-0.01em] mt-5 sm:mt-6 mb-7 sm:mb-8 max-w-[580px] mx-auto"
          >
            Get deeper insights, track your progress
            <br className="hidden xs:inline" />{' '}
            and unlock a healthier, stronger you.
          </motion.p>
        </motion.div>

        {/* 3. Primary Pill CTA Button: Appears after paragraph, scale(0.96->1), opacity 0->1, slight upward movement */}
        <motion.div style={{ y: buttonParallaxY }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.96, y: 10 }
            }
            transition={{
              delay: 0.7,
              duration: 0.5,
              ease: EASE_OUT_EXPO,
            }}
            style={{ transformOrigin: 'center center' }}
            className="inline-block"
          >
            <button
              type="button"
              onClick={onBookDemo}
              className="group inline-flex items-center justify-between bg-[#F53D00] hover:bg-[#E03500] text-white rounded-full px-8 sm:px-10 py-3.5 sm:py-4.5 min-w-[225px] sm:min-w-[280px] md:min-w-[315px] transition-colors duration-200 shadow-[0_8px_22px_rgba(245,61,0,0.20)] cursor-pointer"
            >
              <span className="text-[17px] sm:text-[19.5px] md:text-[22px] font-medium tracking-[-0.01em] pl-1 sm:pl-2">
                Book a Demo
              </span>
              <svg
                viewBox="0 0 28 24"
                fill="none"
                className="w-5 h-4 sm:w-6 sm:h-5 md:w-7 md:h-5 text-white transition-transform duration-300 ease-out group-hover:translate-x-[6px]"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="2" y1="12" x2="24" y2="12" />
                <polyline points="17 5 24 12 17 19" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BreathingCtaSection;

