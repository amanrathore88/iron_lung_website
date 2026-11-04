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

// Double to 14 cards so wrapping occurs far off-screen in total darkness (zero in/out glitch)
const loopImages = [...heroBannerImages, ...heroBannerImages];

// Initial static styles for desktop hydration matching exact original spacing (192px card + 24px gap = 216px centers)
const initialDesktopStyles: React.CSSProperties[] = [
  { transform: 'translate3d(-648px, 0, 0) rotateY(60deg) scale(1.10)', opacity: 1, zIndex: 5 },
  { transform: 'translate3d(-432px, 0, 0) rotateY(30deg) scale(0.95)', opacity: 1, zIndex: 6 },
  { transform: 'translate3d(-216px, 0, 0) rotateY(15deg) scale(0.90)', opacity: 1, zIndex: 7 },
  { transform: 'translate3d(0px, 0, 0) rotateY(0deg) scale(0.89)', opacity: 1, zIndex: 10 },
  { transform: 'translate3d(216px, 0, 0) rotateY(-15deg) scale(0.90)', opacity: 1, zIndex: 7 },
  { transform: 'translate3d(432px, 0, 0) rotateY(-30deg) scale(0.95)', opacity: 1, zIndex: 6 },
  { transform: 'translate3d(648px, 0, 0) rotateY(-60deg) scale(1.10)', opacity: 1, zIndex: 5 },
];

export const AboutHero: React.FC = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const offsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const animIdRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    isPausedRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    let lastTime = performance.now();
    const TOTAL_CARDS = loopImages.length; // 14

    const tick = (currentTime: number) => {
      const delta = Math.min(currentTime - lastTime, 50); // cap delta against background tab lag
      lastTime = currentTime;

      // Dynamically calculate exact spacing matching the original Tailwind classes
      // md: card width is 192px (w-48), gap is 24px (gap-6) => spacing = 216px (gap between cards = 24px)
      // sm: card width is 160px (w-40), gap is 16px (gap-4) => spacing = 176px (gap between cards = 16px)
      const isMd = window.innerWidth >= 768;
      const cardWidth = isMd ? 192 : 160;
      const gap = isMd ? 24 : 16;
      const SPACING = cardWidth + gap; // 216px on md+, 176px on sm
      const MAX_X = SPACING * 3; // 648px on md+, 528px on sm
      const LOOP_WIDTH = TOTAL_CARDS * SPACING; // 3024px on md+
      const HALF_LOOP = LOOP_WIDTH / 2; // 1512px on md+ (far outside any screen)

      if (!isPausedRef.current) {
        // Smooth, gentle continuous glide (~40px per second)
        offsetRef.current = (offsetRef.current + delta * 0.04) % (7 * SPACING);
      }

      const currentOffset = offsetRef.current;

      for (let i = 0; i < TOTAL_CARDS; i++) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        // Calculate card's horizontal center coordinate relative to viewport center
        let x = i * SPACING - currentOffset;
        while (x < -HALF_LOOP) x += LOOP_WIDTH;
        while (x > HALF_LOOP) x -= LOOP_WIDTH;

        // Normalized coordinate relative to the 7 visible slots (-1.0 to +1.0)
        const u = x / MAX_X;
        const absU = Math.abs(u);
        const sign = u >= 0 ? -1.0 : 1.0;

        // Exact piecewise 3D perspective curve matching the original angleStyles perfectly:
        // Slot 0 (u = -1.0): rotateY = +60deg, scale = 1.10
        // Slot 1 (u = -0.67): rotateY = +30deg, scale = 0.95
        // Slot 2 (u = -0.33): rotateY = +15deg, scale = 0.90
        // Slot 3 (u =  0.0): rotateY =   0deg, scale = 0.89
        // Slot 4 (u = +0.33): rotateY = -15deg, scale = 0.90
        // Slot 5 (u = +0.67): rotateY = -30deg, scale = 0.95
        // Slot 6 (u = +1.0): rotateY = -60deg, scale = 1.10
        let rotateY: number;
        let scale: number;

        if (absU <= 1.0 / 3.0) {
          const t = absU / (1.0 / 3.0);
          rotateY = sign * t * 15.0;
          scale = 0.89 + t * 0.01;
        } else if (absU <= 2.0 / 3.0) {
          const t = (absU - 1.0 / 3.0) / (1.0 / 3.0);
          rotateY = sign * (15.0 + t * 15.0);
          scale = 0.90 + t * 0.05;
        } else if (absU <= 1.0) {
          const t = (absU - 2.0 / 3.0) / (1.0 / 3.0);
          rotateY = sign * (30.0 + t * 30.0);
          scale = 0.95 + t * 0.15;
        } else {
          // Outside visible arc: gently taper off
          rotateY = sign * 60.0;
          scale = 1.10;
        }

        // Flawless in/out transition:
        // Inside visible arc (|x| <= MAX_X), opacity is 100% full (1.0).
        // Beyond MAX_X, opacity smoothly fades to 0 before |x| reaches MAX_X + 160px.
        // Wrapping occurs way out at HALF_LOOP (1512px), hundreds of pixels in total darkness!
        // This completely eliminates any pop, flicker or glitch on the edges.
        let opacity = 1;
        const absX = Math.abs(x);
        if (absX > MAX_X) {
          opacity = Math.max(0, 1 - (absX - MAX_X) / 140);
        }

        const zIndex = Math.round((1.5 - Math.min(1.5, absU)) * 10);

        cardEl.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        cardEl.style.opacity = `${opacity.toFixed(3)}`;
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
        {/* Exact original spacing (gap-4/gap-6), zero in/out edge glitch        */}
        {/* ===================================================================== */}
        <div
          className="hidden sm:relative sm:flex justify-center items-center h-[310px] md:h-[350px] lg:h-[370px] w-full max-w-[1500px] mx-auto select-none"
          style={{ perspective: '1100px' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle soft edge gradient masks on left and right for seamless in/out */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-36 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-36 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

          {loopImages.map((img, idx) => {
            const isInitialVisible = idx < 7;
            const initialStyle = isInitialVisible
              ? initialDesktopStyles[idx]
              : { opacity: 0, transform: 'translate3d(1500px, 0, 0) scale(1)' };

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
        {/* Exact original gap-4 spacing, smooth seamless loop, zero glitch      */}
        {/* ===================================================================== */}
        <div className="flex sm:hidden overflow-hidden py-4 relative select-none">
          {/* Subtle edge masks for seamless mobile entry/exit */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

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
