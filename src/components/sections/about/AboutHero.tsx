import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const heroBannerImages = [
  '/images/about/gallery/gallery-1.jpg',
  '/images/about/gallery/gallery-2.jpg',
  '/images/about/gallery/gallery-3.jpg',
  '/images/about/gallery/gallery-4.jpg',
  '/images/about/gallery/gallery-5.jpg',
  '/images/about/gallery/gallery-6.jpg',
  '/images/about/gallery/gallery-7.jpg',
];

const angleStyles: React.CSSProperties[] = [
  { transform: 'rotateY(60deg) scale(1.10)' },
  { transform: 'rotateY(30deg) scale(0.95)' },
  { transform: 'rotateY(15deg) scale(0.90)' },
  { transform: 'rotateY(0deg) scale(0.89)' },
  { transform: 'rotateY(-15deg) scale(0.90)' },
  { transform: 'rotateY(-30deg) scale(0.95)' },
  { transform: 'rotateY(-60deg) scale(1.10)' },
];

export const AboutHero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play continuous loop every 2.6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroBannerImages.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="bg-white pt-24 sm:pt-28 md:pt-32 text-center overflow-hidden">
      <div className="px-4 sm:px-6">
        
        {/* ===================================================================== */}
        {/* DESKTOP VIEW: Exact Original Flexbox Spacing (gap-4 md:gap-6)         */}
        {/* 100% Preserved 3D Arc, Zero Cut Marks, Zero Glitches, Smooth Loop     */}
        {/* ===================================================================== */}
        <div
          className="hidden sm:flex justify-center items-center gap-4 md:gap-6 py-4 select-none"
          style={{ perspective: '1000px' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {angleStyles.map((angleStyle, slotIdx) => {
            const imgIdx = (slotIdx + currentIndex) % heroBannerImages.length;
            const img = heroBannerImages[imgIdx];

            return (
              <div
                key={slotIdx}
                className="w-40 h-64 md:w-48 md:h-72 transform-gpu rounded-xl overflow-hidden shadow-xl bg-neutral-100 relative cursor-pointer"
                style={{ ...angleStyle, transformStyle: 'preserve-3d' }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={img}
                    src={img}
                    alt={`IRONLUNG gallery ${imgIdx + 1}`}
                    initial={{ x: '100%', opacity: 0.85 }}
                    animate={{ x: '0%', opacity: 1 }}
                    exit={{ x: '-100%', opacity: 0.85 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                    loading="eager"
                  />
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* ===================================================================== */}
        {/* MOBILE VIEW: Continuous Infinite Horizontal Marquee Loop             */}
        {/* Smooth, continuous, exact gap-4 spacing, zero cut marks              */}
        {/* ===================================================================== */}
        <div className="flex sm:hidden overflow-hidden py-4 select-none">
          <div 
            className="flex gap-4 animate-marquee shrink-0"
            style={{ "--gap": "1rem" } as React.CSSProperties}
          >
            {heroBannerImages.map((img, idx) => (
              <div key={`m1-${idx}`} className="flex-none w-40 h-60 shrink-0 rounded-xl overflow-hidden shadow-md bg-neutral-100">
                <img
                  src={img}
                  alt={`IRONLUNG gallery ${idx + 1}`}
                  className="w-full h-full object-cover pointer-events-none"
                  loading="eager"
                />
              </div>
            ))}
          </div>
          <div 
            className="flex gap-4 animate-marquee shrink-0" 
            style={{ "--gap": "1rem" } as React.CSSProperties}
            aria-hidden="true"
          >
            {heroBannerImages.map((img, idx) => (
              <div key={`m2-${idx}`} className="flex-none w-40 h-60 shrink-0 rounded-xl overflow-hidden shadow-md bg-neutral-100">
                <img
                  src={img}
                  alt={`IRONLUNG gallery ${idx + 1}`}
                  className="w-full h-full object-cover pointer-events-none"
                  loading="eager"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Paragraph below gallery — kept 100% exact and unchanged */}
      <p className="mt-10 sm:mt-12 text-base sm:text-xl text-neutral-600 font-normal max-w-4xl mx-auto px-4 leading-relaxed">
        At IRONLUNG, we believe better breathing leads to better performance. Our respiratory muscle training technology helps you train your breathing muscles with controlled resistance, so you can build breathing strength, improve endurance, and push your limits.
      </p>
    </div>
  );
};

export default AboutHero;
