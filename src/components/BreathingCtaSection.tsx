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

  const eyebrowParallaxY = useTransform(scrollYProgress, [0, 1], [1.5, -1.5]);
  const headlineParallaxY = useTransform(scrollYProgress, [0, 1], [6, -6]);
  const paragraphParallaxY = useTransform(scrollYProgress, [0, 1], [4, -4]);
  const buttonParallaxY = useTransform(scrollYProgress, [0, 1], [2.5, -2.5]);
  const rightLineParallaxY = useTransform(scrollYProgress, [0, 1], [-4, 4]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#FDFDFD] text-black overflow-hidden py-8 sm:py-10 md:py-12 border-t border-black/[0.04]"
    >
      {/* 6. Right-Side Architectural Orange Line & Node (Vertical Line → Dot Pulse Once → Curved Line) */}
      <motion.div
        style={{ y: rightLineParallaxY }}
        className="absolute top-0 bottom-0 right-2 sm:right-6 md:right-10 lg:right-14 w-[38px] sm:w-[56px] md:w-[68px] pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 84 800"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          {/* Upper Vertical Segment: Draws downward from top to the orange dot */}
          <motion.path
            d="M 12 0 L 12 448"
            fill="none"
            stroke="#F53D00"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              isInView
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{
              pathLength: {
                delay: 0.14,
                duration: 0.64,
                ease: EASE_OUT_EXPO,
              },
              opacity: { delay: 0.14, duration: 0.12 },
            }}
          />

          {/* Lower Curved Segment: Continues smoothly from the dot to the bottom */}
          <motion.path
            d="M 12 448 Q 74 472 74 536 L 74 800"
            fill="none"
            stroke="#F53D00"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              isInView
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{
              pathLength: {
                delay: 0.86,
                duration: 0.68,
                ease: EASE_OUT_EXPO,
              },
              opacity: { delay: 0.86, duration: 0.08 },
            }}
          />
        </svg>

        {/* Subtle one-time halo pulse when the vertical line reaches the dot */}
        <motion.span
          className="absolute w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-[#F53D00] -translate-x-1/2 -translate-y-1/2"
          style={{ left: '14.285%', top: '56%' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isInView
              ? { opacity: [0, 0.45, 0], scale: [0.85, 2.05, 2.25] }
              : { opacity: 0, scale: 0.8 }
          }
          transition={{
            delay: 0.76,
            duration: 0.55,
            times: [0, 0.4, 1],
            ease: 'easeOut',
          }}
        />

        {/* Crisp Circular Orange Node at the Curve Vertex (x = 12/84 = 14.285%, y = 448/800 = 56%) */}
        <motion.span
          className="absolute w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#F53D00] -translate-x-1/2 -translate-y-1/2"
          style={{ left: '14.285%', top: '56%' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isInView
              ? { opacity: [0, 1, 1, 1], scale: [0, 1.24, 0.96, 1] }
              : { opacity: 0, scale: 0 }
          }
          transition={{
            delay: 0.74,
            duration: 0.48,
            times: [0, 0.45, 0.75, 1],
            ease: 'easeOut',
          }}
        />
      </motion.div>

      {/* Main Compact Editorial Content Container */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-12 md:px-16 lg:px-20 pr-12 sm:pr-20 md:pr-24">
        {/* 1. Top Kicker + Short Horizontal Orange Accent Rule */}
        <motion.div style={{ y: eyebrowParallaxY }}>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{
              delay: 0.05,
              duration: 0.55,
              ease: EASE_OUT_EXPO,
            }}
            className="text-[9.5px] sm:text-[11px] font-normal tracking-[0.26em] text-[#1E1E1E] uppercase leading-[1.55]"
          >
            TAKE CONTROL OF
            <br />
            YOUR BREATHING
          </motion.p>

          {/* Short Horizontal Orange Accent Rule: Draws from left to right */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={
              isInView
                ? { scaleX: 1, opacity: 1 }
                : { scaleX: 0, opacity: 0 }
            }
            transition={{
              scaleX: {
                delay: 0.18,
                duration: 0.52,
                ease: EASE_OUT_EXPO,
              },
              opacity: { delay: 0.18, duration: 0.15 },
            }}
            style={{ transformOrigin: 'left center' }}
            className="w-11 sm:w-14 h-[2px] bg-[#F53D00] mt-2.5 sm:mt-3 mb-3.5 sm:mb-4"
          />
        </motion.div>

        {/* 2. Primary Display Headline: Line-by-line upward reveal (+120ms for line 2, delayed "Train Better.") */}
        <motion.div style={{ y: headlineParallaxY }}>
          <h2 className="text-[28px] xs:text-[32px] sm:text-[42px] md:text-[50px] lg:text-[56px] font-extrabold tracking-[-0.035em] leading-[1.06] text-black">
            <motion.span
              initial={{ opacity: 0, y: 35 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
              transition={{
                delay: 0.22,
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
                  delay: 0.34, // 120ms after "Know Your"
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
                  delay: 0.48, // Arrives slightly later so the orange text gets emphasis
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

        {/* 3. Subtitle / Value Statement: Starts after headline completes, opacity 0->1, translateY(12px->0), ~0.5s */}
        <motion.div style={{ y: paragraphParallaxY }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              delay: 0.68,
              duration: 0.5,
              ease: EASE_OUT_EXPO,
            }}
            className="text-[13.5px] sm:text-[16px] md:text-[18px] text-[#1E1E1E] font-light leading-[1.42] tracking-[-0.01em] mt-3 sm:mt-4 mb-5 sm:mb-6 max-w-[460px]"
          >
            Get deeper insights, track your progress
            <br className="hidden xs:inline" />{' '}
            and unlock a healthier, stronger you.
          </motion.p>
        </motion.div>

        {/* 4. Primary Pill CTA Button: Appears after paragraph, scale(0.96->1), opacity 0->1, slight upward movement */}
        <motion.div style={{ y: buttonParallaxY }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.96, y: 10 }
            }
            transition={{
              delay: 0.85,
              duration: 0.5,
              ease: EASE_OUT_EXPO,
            }}
            style={{ transformOrigin: 'left center' }}
            className="inline-block"
          >
            <button
              type="button"
              onClick={onBookDemo}
              className="group inline-flex items-center justify-between bg-[#F53D00] hover:bg-[#E03500] text-white rounded-full px-6 sm:px-8 py-2.5 sm:py-3.5 min-w-[190px] sm:min-w-[240px] md:min-w-[265px] transition-colors duration-200 shadow-[0_8px_22px_rgba(245,61,0,0.20)] cursor-pointer"
            >
              <span className="text-[15px] sm:text-[17px] md:text-[19px] font-medium tracking-[-0.01em] pl-1 sm:pl-2">
                Book a Demo
              </span>
              <svg
                viewBox="0 0 28 24"
                fill="none"
                className="w-5 h-4 sm:w-6 sm:h-5 text-white transition-transform duration-300 ease-out group-hover:translate-x-[6px]"
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

        {/* 5. Bottom 3-Item Feature Strip: Sequential reveal (small orange line first, then label text) */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 md:gap-x-8">
          {BENEFIT_ITEMS.map((label, idx) => {
            const lineDelay = 1.02 + idx * 0.22;
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
                    className="w-5 sm:w-6 h-[1.5px] bg-[#F53D00] shrink-0"
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
                    className="text-[9px] sm:text-[10.5px] tracking-[0.20em] text-[#1A1A1A] font-normal uppercase whitespace-nowrap"
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

