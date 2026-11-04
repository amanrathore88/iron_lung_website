import React, { useEffect, useRef, useState } from 'react';

const heroBannerImages = [
  '/images/about/gallery/gallery-1.jpg',
  '/images/about/gallery/gallery-2.jpg',
  '/images/about/gallery/gallery-3.jpg',
  '/images/about/gallery/gallery-4.jpg',
  '/images/about/gallery/gallery-5.jpg',
  '/images/about/gallery/gallery-6.jpg',
  '/images/about/gallery/gallery-7.jpg',
];

// Double the images to 14 so it forms an infinite, seamless continuous loop
const loopImages = [...heroBannerImages, ...heroBannerImages];

// Initial static angle styles for instant server/hydration alignment matching original layout
const initialAngleStyles: React.CSSProperties[] = [
  { transform: 'translate3d(-570px, 0, 0) rotateY(60deg) scale(1.10)', opacity: 1, zIndex: 5 },
  { transform: 'translate3d(-380px, 0, 0) rotateY(30deg) scale(0.95)', opacity: 1, zIndex: 6 },
  { transform: 'translate3d(-190px, 0, 0) rotateY(15deg) scale(0.90)', opacity: 1, zIndex: 7 },
  { transform: 'translate3d(0px, 0, 0) rotateY(0deg) scale(0.89)', opacity: 1, zIndex: 10 },
  { transform: 'translate3d(190px, 0, 0) rotateY(-15deg) scale(0.90)', opacity: 1, zIndex: 7 },
  { transform: 'translate3d(380px, 0, 0) rotateY(-30deg) scale(0.95)', opacity: 1, zIndex: 6 },
  { transform: 'translate3d(570px, 0, 0) rotateY(-60deg) scale(1.10)', opacity: 1, zIndex: 5 },
];

export const AboutHero: React.FC = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const offsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const animIdRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Keep ref synchronized with state without re-triggering effects
  useEffect(() => {
    isPausedRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    let lastTime = performance.now();
    const SPACING = 190;
    const TOTAL_CARDS = loopImages.length; // 14
    const LOOP_WIDTH = 7 * SPACING; // 1330px
    const HALF_LOOP = LOOP_WIDTH / 2; // 665px

    const tick = (currentTime: number) => {
      const delta = Math.min(currentTime - lastTime, 50); // cap delta against tab switch lag
      lastTime = currentTime;

      if (!isPausedRef.current) {
        // Smooth continuous cinematic glide (~38px per second)
        offsetRef.current = (offsetRef.current + delta * 0.038) % LOOP_WIDTH;
      }

      const currentOffset = offsetRef.current;

      for (let i = 0; i < TOTAL_CARDS; i++) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        // Compute relative horizontal offset centered at 0
        let x = i * SPACING - currentOffset;
        while (x < -HALF_LOOP) x += LOOP_WIDTH;
        while (x > HALF_LOOP) x -= LOOP_WIDTH;

        // Normalized coordinate across the 7 viewing slots (-1.0 to +1.0)
        const normX = x / 570;
        const clampedNorm = Math.max(-1.25, Math.min(1.25, normX));

        // Smooth continuous 3D curved arc matching the exact design
        const rotateY = -clampedNorm * 60;
        const scale = 0.89 + 0.21 * (clampedNorm * clampedNorm);

        // Smooth opacity falloff as cards exit and enter the viewing arc
        const absNorm = Math.abs(clampedNorm);
        let opacity = 1;
        if (absNorm > 0.95) {
          opacity = Math.max(0, 1 - (absNorm - 0.95) / 0.25);
        }

        const zIndex = Math.round((1.5 - absNorm) * 10);

        cardEl.style.transform = `translate3d(${x}px, 0, 0) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        cardEl.style.opacity = `${opacity.toFixed(2)}`;
        cardEl.style.zIndex = `${zIndex}`;
      }

      animIdRef.current = requestAnimationFrame(tick);
    };

    animIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white pt-24 sm:pt-28 md:pt-32 text-center overflow-hidden">
      <div className="px-4 sm:px-6">
        
        {/* ===================================================================== */}
        {/* DESKTOP VIEW: Continuous 3D Perspective Curved Arc Loop               */}
        {/* Exactly preserves the 3D perspective, angle & scale while looping     */}
        {/* ===================================================================== */}
        <div
          className="hidden sm:relative sm:flex justify-center items-center h-[300px] md:h-[340px] lg:h-[360px] w-full max-w-[1400px] mx-auto select-none"
          style={{ perspective: '1000px' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {loopImages.map((img, idx) => {
            const initialStyle = initialAngleStyles[idx % 7];
            return (
              <div
                key={idx}
                ref={(el) => { cardRefs.current[idx] = el; }}
                className="absolute w-40 h-64 md:w-48 md:h-72 transform-gpu will-change-transform rounded-xl overflow-hidden shadow-xl bg-neutral-100 cursor-pointer"
                style={{
                  ...initialStyle,
                  transformStyle: 'preserve-3d',
                }}
              >
                <img
                  src={img}
                  alt={`IRONLUNG gallery ${(idx % 7) + 1}`}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  loading="eager"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        {/* ===================================================================== */}
        {/* MOBILE VIEW: Continuous Infinite Horizontal Marquee Loop             */}
        {/* Smooth, seamless, non-stop horizontal conveyor loop on mobile        */}
        {/* ===================================================================== */}
        <div className="flex sm:hidden overflow-hidden py-4 relative select-none">
          {/* Subtle edge masks for seamless mobile entry/exit */}
          <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex gap-4 animate-marquee shrink-0">
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
          <div className="flex gap-4 animate-marquee shrink-0" aria-hidden="true">
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
