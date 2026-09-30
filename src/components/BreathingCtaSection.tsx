import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

interface BreathingCtaSectionProps {
  onBookDemo?: () => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const BENEFIT_ITEMS = [
  'TRACK PROGRESS',
  'BUILD STRENGTH',
  'BREATHE BETTER',
] as const;

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
      className="relative w-full bg-[#FDFDFD] text-black overflow-hidden py-10 sm:py-12 md:py-14 border-t border-black/[0.04]"
    >
      {/* Main Centered Editorial Content Container */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-12 md:px-16 flex flex-col items-center text-center">
        {/* 1. Primary Display Headline: Line-by-line upward reveal (+120ms for line 2, delayed "Train Better.") */}
        <motion.div style={{ y: headlineParallaxY }}>
          <h2 className="text-[32px] xs:text-[36px] sm:text-[48px] md:text-[58px] lg:text-[64px] font-extrabold tracking-[-0.035em] leading-[1.06] text-black">
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
            className="text-[15px] sm:text-[17.5px] md:text-[20px] text-[#1E1E1E] font-light leading-[1.45] tracking-[-0.01em] mt-4 sm:mt-5 mb-6 sm:mb-7 max-w-[520px] mx-auto"
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
              className="group inline-flex items-center justify-between bg-[#F53D00] hover:bg-[#E03500] text-white rounded-full px-7 sm:px-9 py-3 sm:py-4 min-w-[210px] sm:min-w-[260px] md:min-w-[290px] transition-colors duration-200 shadow-[0_8px_22px_rgba(245,61,0,0.20)] cursor-pointer"
            >
              <span className="text-[16px] sm:text-[18.5px] md:text-[21px] font-medium tracking-[-0.01em] pl-1 sm:pl-2">
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

        {/* 4. Bottom 3-Item Feature Strip: Sequential reveal (small orange line first, then label text) */}
        <div className="mt-7 sm:mt-9 flex flex-wrap items-center justify-center gap-y-2.5 gap-x-5 sm:gap-x-7 md:gap-x-9">
          {BENEFIT_ITEMS.map((label, idx) => {
            const lineDelay = 0.86 + idx * 0.22;
            const textDelay = lineDelay + 0.1;
            const dividerDelay = textDelay + 0.08;

            return (
              <React.Fragment key={label}>
                <div className="inline-flex items-center gap-2.5 sm:gap-3">
                  <motion.span
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={
                      isInView
                        ? { scaleX: 1, opacity: 1 }
                        : { scaleX: 0, opacity: 0 }
                    }
                    transition={{
                      scaleX: {
                        delay: lineDelay,
                        duration: 0.34,
                        ease: EASE_OUT_EXPO,
                      },
                      opacity: { delay: lineDelay, duration: 0.12 },
                    }}
                    style={{ transformOrigin: 'left center' }}
                    className="w-6 sm:w-7 h-[1.5px] bg-[#F53D00] shrink-0"
                  />
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
                    }
                    transition={{
                      delay: textDelay,
                      duration: 0.38,
                      ease: EASE_OUT_EXPO,
                    }}
                    className="text-[10px] sm:text-[11.5px] md:text-[12px] tracking-[0.21em] text-[#1A1A1A] font-normal uppercase whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                </div>

                {idx < BENEFIT_ITEMS.length - 1 && (
                  <motion.span
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={
                      isInView
                        ? { opacity: 1, scaleY: 1 }
                        : { opacity: 0, scaleY: 0 }
                    }
                    transition={{
                      delay: dividerDelay,
                      duration: 0.28,
                      ease: EASE_OUT_EXPO,
                    }}
                    className="hidden sm:inline-block h-4 w-[1px] bg-black/30"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BreathingCtaSection;

