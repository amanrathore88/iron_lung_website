import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface AboutSectionOverlayProps {
  scrollProgress: number; // 0.0 to 1.0
  onOpenVideo?: () => void;
  onExploreAbout?: () => void;
}

interface StatCounterProps {
  target: number;
  suffix: string;
  isTriggered: boolean;
  delayMs?: number;
  durationMs?: number;
}

const StatCounter: React.FC<StatCounterProps> = ({
  target,
  suffix,
  isTriggered,
  delayMs = 0,
  durationMs = 500,
}) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!isTriggered) {
      setCount(0);
      return;
    }

    let frameId: number;
    const timerId = setTimeout(() => {
      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 2);
        setCount(Math.round(eased * target));
        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        }
      };
      frameId = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      clearTimeout(timerId);
      cancelAnimationFrame(frameId);
    };
  }, [isTriggered, target, delayMs, durationMs]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

export const AboutSectionOverlay: React.FC<AboutSectionOverlayProps> = ({
  scrollProgress,
  onOpenVideo,
}) => {
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;

  // Pacing:
  // Starts fading in smoothly at 0.73 as the 3D model descends from Section 03
  // 100% visible & locked between 0.80 and 0.88
  // Between 0.88 and 0.98, fades/wipes out alongside the 3D model sweep to User Dashboard
  if (scrollProgress < 0.73 || scrollProgress >= (isDesktop ? 0.98 : 0.925)) {
    return null;
  }

  // 1. Full-Bleed Cream Backdrop Entry (0.73 - 0.78):
  // Smoothly takes over from StudioRoomBackground as user leaves Section 03
  const backdropEntryProgress = Math.min(1, Math.max(0, (scrollProgress - 0.73) / 0.05));
  const backdropEntryEase = backdropEntryProgress < 0.5
    ? 2 * backdropEntryProgress * backdropEntryProgress
    : 1 - Math.pow(-2 * backdropEntryProgress + 2, 2) / 2;

  // 2. Editorial Content Entry (0.78 - 0.82):
  // Fades in right as the 3D model arrives and settles on the left side,
  // preventing any collision between the descending model and the headline/copy
  const contentEntryProgress = Math.min(1, Math.max(0, (scrollProgress - 0.78) / 0.04));
  const contentEntryEase = contentEntryProgress < 0.5
    ? 4 * contentEntryProgress * contentEntryProgress * contentEntryProgress
    : 1 - Math.pow(-2 * contentEntryProgress + 2, 3) / 2;
  const contentTranslateY = (1 - contentEntryEase) * 16;

  // Seamless exit opacity:
  // On desktop, exits alongside horizontal model sweep between 0.88 and 0.94
  // On mobile (< 1024px), exits cleanly between 0.88 and 0.91 before dashboard cards rise in
  const exitDuration = isDesktop ? 0.06 : 0.03;
  const exitProgress = Math.min(1, Math.max(0, (scrollProgress - 0.88) / exitDuration));
  const exitOpacity = scrollProgress >= 0.88 ? 1 - exitProgress : 1.0;

  // Keep backdrop steady on mobile so warm cream tone seamlessly continues into the dashboard
  const currentBackdropOpacity = backdropEntryEase * (isDesktop ? exitOpacity : 1.0);
  const currentContentOpacity = contentEntryEase * exitOpacity;

  // Left column accents (quotes) fade out immediately at start of sweep (0.88 - 0.905)
  // so they never clash or overlap with the User Dashboard cards
  const leftAccentsOpacity = scrollProgress >= 0.88
    ? Math.max(0, 1 - (scrollProgress - 0.88) / 0.025)
    : 1.0;

  // The overlay is interactive when fully in view
  const isInteractive = scrollProgress >= 0.81 && scrollProgress <= 0.88;

  // Seamless Airplane-Style Wipe: As the 3D model sweeps left-to-right into User Dashboard (0.88 - 0.98),
  // wipe out 'Our Story' behind the leading edge so zero ghosting or card overlap ever occurs (desktop only)
  let maskStyle: React.CSSProperties = {};
  if (isDesktop && scrollProgress >= 0.88) {
    const t = Math.min(1, Math.max(0, (scrollProgress - 0.88) / 0.10));
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const wipePct = ease * 100;
    const wipeStart = Math.max(0, wipePct - 6);
    const wipeEnd = Math.min(100, wipePct + 8);
    const mask = `linear-gradient(to right, transparent 0%, transparent ${wipeStart}%, rgba(0,0,0,0.3) ${wipePct}%, #000 ${wipeEnd}%, #000 100%)`;
    maskStyle = {
      maskImage: mask,
      WebkitMaskImage: mask,
    };
  }

  // Section entrance trigger for staggered motion animations
  const isEntered = scrollProgress >= 0.77;

  // Subtle parallax calculation for mountain image (-5px to +5px as user scrolls)
  const mountainParallaxY = Math.max(-5, Math.min(5, (scrollProgress - 0.83) * 60));

  // Architectural circle subtle rotation as user scrolls
  const circleRotation = (scrollProgress - 0.78) * 160;

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden z-[10] pointer-events-none select-none"
      style={{
        ...maskStyle,
      }}
    >
      {/* ======================================================== */}
      {/* 1. Backdrop: Warm Ivory / Alabaster Editorial Canvas     */}
      {/* Full-bleed across the entire screen from left to right    */}
      {/* ======================================================== */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: currentBackdropOpacity,
          backgroundColor: '#FAF7F2',
          backgroundImage:
            'radial-gradient(ellipse at 85% 20%, rgba(255, 255, 255, 0.75) 0%, rgba(250, 247, 242, 0) 70%), radial-gradient(ellipse at 18% 65%, rgba(255, 255, 255, 0.55) 0%, rgba(250, 247, 242, 0) 65%)',
        }}
      />

      {/* Subtle Architectural Circle behind the 3D Model (from Reference media_1790144361870.png) - Desktop only */}
      <div
        className="hidden lg:block absolute top-1/2 left-[18vw] -translate-x-1/2 -translate-y-1/2 w-[34vw] h-[34vw] rounded-full border border-slate-300/35 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: currentContentOpacity,
          maskImage: 'radial-gradient(circle, #000 65%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle, #000 65%, transparent 100%)',
        }}
      />

      {/* Faint Architectural Wall Typography behind 3D Model - Desktop only */}
      <div
        className="hidden lg:flex absolute top-[26%] left-[23vw] -translate-x-1/2 flex-col items-center pointer-events-none select-none z-0 transition-opacity duration-200"
        style={{
          opacity: currentContentOpacity * 0.20,
        }}
      >
        <div className="flex flex-col font-manrope font-extrabold text-[20px] lg:text-[24px] tracking-[0.35em] text-slate-400 uppercase leading-[1.3] text-center">
          <span>STRONGER</span>
          <span>LUNGS</span>
          <span>BRIGHTER</span>
          <span>TOMORROW</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. Left Column Accents (Surrounding the 3D Model) - Desktop only */}
      {/* ======================================================== */}
      {/* Top Left Quote Block (Left Margin) */}
      <div
        className="hidden lg:flex absolute top-24 sm:top-28 left-6 sm:left-10 lg:left-14 flex-col items-start gap-1 pointer-events-none transition-all duration-200"
        style={{
          opacity: currentContentOpacity * leftAccentsOpacity,
          transform: `translateY(${contentTranslateY}px)`,
        }}
      >
        <span className="text-sm font-serif text-slate-400 font-bold leading-none">“</span>
        <div className="flex flex-col text-[9px] sm:text-[10px] font-manrope font-medium tracking-[0.25em] text-slate-600 uppercase leading-relaxed mt-0.5">
          <span>HUMAN</span>
          <span>CENTRED</span>
          <span>RESPIRATORY</span>
          <span>WELLNESS</span>
        </div>
        <div className="w-5 h-[1.5px] bg-[#FF5E1E] mt-2 rounded-full" />
      </div>

      {/* Bottom Left Index & Quote Block (Left Margin) */}
      <div
        className="hidden lg:flex absolute bottom-8 sm:bottom-10 left-6 sm:left-10 lg:left-14 flex-col items-start gap-1 pointer-events-none transition-all duration-200"
        style={{
          opacity: currentContentOpacity * leftAccentsOpacity,
          transform: `translateY(${contentTranslateY}px)`,
        }}
      >
        <div className="flex flex-col text-[9px] sm:text-[10px] font-manrope font-medium tracking-[0.25em] text-slate-500 uppercase leading-relaxed">
          <span>SCIENCE</span>
          <span>DESIGN</span>
          <span>A BRIGHTER</span>
          <span>TOMORROW</span>
        </div>
        <div className="w-5 h-[1.5px] bg-[#FF5E1E] my-2 rounded-full" />
        <span className="text-xs sm:text-sm font-manrope font-medium tracking-widest text-slate-900">
          01 <span className="text-slate-400 font-normal">/</span> 04
        </span>
      </div>

      {/* ======================================================== */}
      {/* 3. Main About Editorial Canvas                           */}
      {/* Mobile/Tablet: Full-width fluid container with scroll    */}
      {/* ======================================================== */}
      {/* 3. Main About Editorial Canvas                           */}
      {/* Mobile/Tablet: Full-width fluid container with scroll    */}
      {/* Desktop: Pinned to left: 36.3vw matching reference       */}
      {/* ======================================================== */}
      <div
        className="absolute top-0 bottom-0 left-0 lg:left-[36.3vw] right-0 overflow-y-auto lg:overflow-visible"
        style={{
          opacity: currentContentOpacity,
          pointerEvents: isInteractive ? 'auto' : 'none',
          transform: `translateY(${contentTranslateY}px)`,
        }}
      >
        {/* Responsive Content Wrapper: Single-column on mobile, 2-column grid on tablet, absolute canvas on desktop */}
        <div className="w-full min-h-full flex flex-col md:grid md:grid-cols-12 md:gap-8 lg:block lg:gap-0 pt-20 sm:pt-24 lg:pt-0 px-4 sm:px-8 lg:px-0 pb-12 lg:pb-0 pointer-events-auto">
          
          {/* ======================================================== */}
          {/* LEFT SUB-COLUMN: Story marker, Headline, Paragraph, Video */}
          {/* ======================================================== */}
          <div className="w-full md:col-span-5 flex flex-col items-start justify-between z-10 lg:absolute lg:top-[76px] xl:top-[82px] lg:bottom-8 sm:lg:bottom-10 lg:left-[4.5%] xl:left-[5%] lg:w-[28%] lg:max-w-[285px] xl:max-w-[325px]">
            {/* Top Group: Marker, Headline, Paragraph */}
            <div className="flex flex-col items-start">
              {/* Section Chapter Marker */}
              <div className="flex items-center gap-2 mb-2.5 lg:mb-3 z-20 pointer-events-none">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isEntered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="w-1.5 h-1.5 rounded-full bg-[#0A1118]"
                  />
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={isEntered ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1], delay: 0.05 }}
                    style={{ transformOrigin: 'top' }}
                    className="w-[1px] h-3 bg-[#0A1118]/30 origin-top"
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 7 }}
                  animate={isEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 7 }}
                  transition={{ duration: 0.35, ease: 'easeOut', delay: 0.18 }}
                  className="flex flex-col font-manrope font-medium text-[9px] lg:text-[9.5px] xl:text-[10px] tracking-[0.28em] text-[#0A1118] uppercase leading-[1.25]"
                >
                  <span>OUR</span>
                  <span>STORY</span>
                </motion.div>
              </div>

              {/* Primary Editorial Headline Stack */}
              <h2
                className="flex flex-col items-start tracking-tight text-[#0A1118] select-none"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                <div className="overflow-hidden">
                  <motion.span
                    initial={{ opacity: 0, y: 26 }}
                    animate={isEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
                    transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1], delay: 0.22 }}
                    className="italic font-normal text-[34px] xs:text-[38px] sm:text-[42px] lg:text-[44px] xl:text-[52px] text-[#0A1118] leading-[0.88] mb-0.5 block"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    People
                  </motion.span>
                </div>
                <div className="overflow-hidden">
                  <motion.span
                    initial={{ opacity: 0, y: 26 }}
                    animate={isEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
                    transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1], delay: 0.34 }}
                    className="font-bold text-[26px] xs:text-[30px] sm:text-[34px] lg:text-[36px] xl:text-[42px] text-[#0A1118] leading-[0.88] tracking-[-0.025em] block"
                  >
                    Breathe
                  </motion.span>
                </div>
                <div className="overflow-hidden">
                  <motion.span
                    initial={{ opacity: 0, y: 26 }}
                    animate={isEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
                    transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1], delay: 0.46 }}
                    className="font-bold text-[26px] xs:text-[30px] sm:text-[34px] lg:text-[36px] xl:text-[42px] text-[#0A1118] leading-[0.88] tracking-[-0.025em] block"
                  >
                    Brighter
                  </motion.span>
                </div>
                <div className="overflow-hidden">
                  <motion.span
                    initial={{ opacity: 0, y: 26 }}
                    animate={isEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
                    transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1], delay: 0.58 }}
                    className="font-bold text-[26px] xs:text-[30px] sm:text-[34px] lg:text-[36px] xl:text-[42px] text-[#0A1118] leading-[0.88] tracking-[-0.025em] inline-flex items-baseline"
                  >
                    Lives
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isEntered ? { opacity: 1, scale: [0, 1.45, 1] } : { opacity: 0, scale: 0 }}
                      transition={{ duration: 0.45, ease: 'easeOut', delay: 0.74 }}
                      className="text-[#FF5E1E] inline-block origin-center"
                    >
                      .
                    </motion.span>
                  </motion.span>
                </div>
              </h2>

              {/* Narrative Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={isEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1], delay: 0.82 }}
                className="font-manrope font-normal text-[10.5px] sm:text-[11px] lg:text-[11.5px] xl:text-[12.5px] text-[#4A5568] leading-[1.48] max-w-xl lg:max-w-[270px] xl:max-w-[310px] mt-2.5 sm:mt-3 xl:mt-3.5"
              >
                Iron Lung was born from a simple belief — better breathing creates a brighter, healthier, more human future. We combine science, design and technology to make respiratory wellness accessible to everyone.
              </motion.p>
            </div>

            {/* Video Trigger (Anchored in bottom zone of left column) */}
            <div className="mt-4 lg:mt-auto pt-2 z-10 pointer-events-auto">
              <motion.button
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={isEntered ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 8 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.92 }}
                onClick={onOpenVideo}
                aria-label="Play Our Story Video"
                className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer focus:outline-none"
              >
                <div className="w-[32px] h-[32px] sm:w-[35px] sm:h-[35px] lg:w-[36px] lg:h-[36px] xl:w-[40px] xl:h-[40px] rounded-full bg-[#0A1118] text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#FF5E1E] transition-all duration-300 shrink-0">
                  <Play size={11} className="fill-white translate-x-[1px] group-hover:translate-x-[3px] text-white transition-transform duration-300" />
                </div>
                <span className="whitespace-nowrap font-manrope font-semibold text-[9.5px] sm:text-[10px] lg:text-[10.5px] xl:text-[11px] uppercase tracking-[0.18em] text-[#0A1118] group-hover:text-[#FF5E1E] transition-colors">
                  OUR STORY
                </span>
                <div className="w-8 sm:w-10 lg:w-12 xl:w-14 h-[1.5px] bg-[#0A1118]/40 transition-all duration-300 group-hover:w-14 sm:group-hover:w-16 group-hover:bg-[#FF5E1E]" />
              </motion.button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT SECTION: Structured 4-Row Editorial Grid            */}
          {/* ======================================================== */}
          <div className="w-full md:col-span-7 flex flex-col justify-between z-10 lg:absolute lg:top-[76px] xl:top-[82px] lg:bottom-8 sm:lg:bottom-10 lg:left-[34%] xl:left-[33%] lg:right-[3.5%] lg:w-auto lg:max-w-[640px] xl:max-w-[700px] mt-6 md:mt-0">
            
            {/* ROW 1: Mountain Image + Right Rail (Flexibly expands to fill upper vertical space) */}
            <div className="flex-1 min-h-[140px] grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:gap-x-4 lg:gap-x-5 xl:gap-x-6 items-stretch mb-2 lg:mb-2.5 xl:mb-3.5">
              {/* Upper Mountain Landscape Image */}
              <div className="relative w-full h-full min-h-[140px] rounded-[4px] overflow-hidden shadow-sm border border-slate-200/50 bg-[#EFECE6] group select-none">
                <motion.div
                  initial={{ clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }}
                  animate={
                    isEntered
                      ? { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }
                      : { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }
                  }
                  transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
                  className="w-full h-full relative overflow-hidden"
                >
                  <img
                    src="/images/about-mountain-hq.png"
                    alt="A clearer tomorrow for everyone"
                    className="w-full h-full object-cover block will-change-transform"
                    style={{
                      transform: `translateY(${mountainParallaxY}px) scale(1.06)`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none z-10" />
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={isEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.9 }}
                    className="absolute bottom-2 left-2.5 sm:bottom-2.5 sm:left-3.5 lg:bottom-3 lg:left-4 pointer-events-none z-20 flex flex-col items-start"
                  >
                    <span className="font-manrope font-semibold text-[7.5px] sm:text-[8px] lg:text-[9px] xl:text-[10px] tracking-[0.22em] text-white uppercase leading-[1.35] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      A CLEARER <br />
                      TOMORROW <br />
                      FOR EVERYONE
                    </span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Right Rail: Healthier People + Inspired by Nature */}
              <div className="w-full sm:w-[110px] lg:w-[125px] xl:w-[140px] flex flex-row sm:flex-col items-start justify-between self-stretch gap-4 sm:gap-0">
                {/* Top: "Healthier People, Brighter Tomorrows" */}
                <div className="flex flex-col items-start gap-0.5 xl:gap-1">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={isEntered ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.35 }}
                    className="text-xs sm:text-sm xl:text-base font-serif text-slate-400 font-bold leading-none"
                  >
                    "
                  </motion.span>
                  <div className="flex flex-col font-manrope font-semibold text-[8px] sm:text-[8.5px] lg:text-[9px] xl:text-[10.5px] tracking-[0.22em] text-[#0A1118] uppercase leading-[1.38]">
                    {['HEALTHIER', 'PEOPLE', 'BRIGHTER', 'TOMORROWS'].map((word, i) => (
                      <div key={word} className="overflow-hidden">
                        <motion.span
                          initial={{ opacity: 0, y: 12 }}
                          animate={isEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                          transition={{ duration: 0.38, ease: [0.215, 0.61, 0.355, 1], delay: 0.4 + i * 0.11 }}
                          className="block"
                        >
                          {word}
                        </motion.span>
                      </div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isEntered ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1], delay: 0.4 + 4 * 0.11 + 0.05 }}
                    style={{ transformOrigin: 'left' }}
                    className="w-4 sm:w-5 h-[1.5px] bg-[#FF5E1E] mt-1 rounded-full origin-left"
                  />
                </div>

                {/* Bottom: "Inspired by Nature, Built by People..." */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={isEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.95 }}
                  className="flex flex-col items-start sm:mt-auto"
                >
                  <div className="font-manrope font-normal text-[7px] sm:text-[7.5px] lg:text-[7.5px] xl:text-[8.5px] tracking-[0.16em] text-slate-500 uppercase leading-[1.55]">
                    INSPIRED BY NATURE. <br className="hidden sm:inline" />
                    BUILT BY PEOPLE. <br className="hidden sm:inline" />
                    DRIVEN BY A HEALTHIER <br className="hidden sm:inline" />
                    TOMORROW.
                  </div>
                  <span className="font-manrope font-medium text-[8px] sm:text-[8.5px] lg:text-[8.5px] xl:text-[9.5px] tracking-widest text-slate-800 mt-1">
                    01 ―
                  </span>
                </motion.div>
              </div>
            </div>

            {/* ROW 2: Face Image — full width (Flexibly fills middle vertical space) */}
            <div className="flex-[0.78] min-h-[110px] relative mb-2 lg:mb-2.5 xl:mb-3.5">
              <div className="relative w-full h-full min-h-[110px] rounded-[4px] overflow-hidden shadow-sm border border-slate-200/50 bg-[#EFECE6] group select-none">
                <motion.div
                  initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                  animate={
                    isEntered
                      ? { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }
                      : { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }
                  }
                  transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1], delay: 0.42 }}
                  className="w-full h-full relative overflow-hidden"
                >
                  <motion.img
                    src="/images/about-face-hq.png"
                    alt="Breath fuels possibility"
                    initial={{ scale: 1.05 }}
                    animate={isEntered ? { scale: 1.0 } : { scale: 1.05 }}
                    transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1], delay: 0.42 }}
                    className="w-full h-full object-cover object-[center_36%] block will-change-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent pointer-events-none z-10" />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isEntered ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.85 }}
                    className="absolute bottom-1.5 left-2.5 sm:bottom-2 sm:left-3.5 lg:bottom-2.5 lg:left-4 pointer-events-none z-20"
                  >
                    <span className="font-manrope font-semibold text-[7.5px] sm:text-[8px] lg:text-[9px] xl:text-[10px] tracking-[0.24em] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      02 ―
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isEntered ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.85 }}
                    className="absolute bottom-1.5 right-2.5 sm:bottom-2 sm:right-3.5 lg:bottom-2.5 lg:right-4 pointer-events-none z-20 text-right"
                  >
                    <span className="font-manrope font-semibold text-[6.5px] sm:text-[7.5px] lg:text-[8px] xl:text-[9px] tracking-[0.20em] text-white uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      BREATH FUELS POSSIBILITY
                    </span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Architectural Circle Overlay bridging Mountain and Face photos */}
              <div
                className="hidden sm:block absolute top-[-40px] xl:top-[-50px] right-[10px] sm:right-[15px] lg:right-[20px] w-[150px] h-[150px] lg:w-[170px] lg:h-[170px] xl:w-[210px] xl:h-[210px] rounded-full border border-white/45 pointer-events-none z-25 transition-transform duration-100 ease-out will-change-transform"
                style={{
                  transform: `rotate(${circleRotation}deg)`,
                  maskImage: 'radial-gradient(circle, #000 70%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(circle, #000 70%, transparent 100%)',
                }}
              />
            </div>

            {/* ROW 3: Stats with Times New Roman + Animated Lung Seal */}
            <div className="shrink-0 flex flex-col sm:grid sm:grid-cols-[1fr_auto] gap-3 sm:gap-x-4 lg:gap-x-5 xl:gap-x-6 items-center pointer-events-auto py-1">
              
              {/* 4 Key Metrics */}
              <div className="grid grid-cols-4 sm:flex items-center justify-between w-full py-0.5 gap-1.5 sm:gap-0">
                {/* Stat 1: 10K+ */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={isEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{ duration: 0.45, ease: [0.215, 0.61, 0.355, 1], delay: 0.65 }}
                  className="flex flex-col text-center sm:text-left"
                >
                  <span
                    className="font-bold text-[16px] sm:text-[19px] lg:text-[21px] xl:text-[26px] text-[#0A1118] tracking-tight leading-none"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    <StatCounter target={10} suffix="K+" isTriggered={isEntered} delayMs={650} durationMs={450} />
                  </span>
                  <span className="font-manrope font-medium text-[5.5px] sm:text-[6.5px] lg:text-[7px] xl:text-[8px] tracking-[0.14em] text-slate-500 uppercase leading-tight mt-0.5 xl:mt-1">
                    PEOPLE <br />
                    BREATHING BETTER
                  </span>
                </motion.div>

                <div className="hidden sm:block w-[1px] h-5 lg:h-6 xl:h-7 bg-slate-300/80 mx-1 sm:mx-1.5 lg:mx-2" />

                {/* Stat 2: 5+ */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={isEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{ duration: 0.45, ease: [0.215, 0.61, 0.355, 1], delay: 0.77 }}
                  className="flex flex-col text-center sm:text-left"
                >
                  <span
                    className="font-bold text-[16px] sm:text-[19px] lg:text-[21px] xl:text-[26px] text-[#0A1118] tracking-tight leading-none"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    <StatCounter target={5} suffix="+" isTriggered={isEntered} delayMs={770} durationMs={400} />
                  </span>
                  <span className="font-manrope font-medium text-[5.5px] sm:text-[6.5px] lg:text-[7px] xl:text-[8px] tracking-[0.14em] text-slate-500 uppercase leading-tight mt-0.5 xl:mt-1">
                    YEARS OF <br />
                    INNOVATION
                  </span>
                </motion.div>

                <div className="hidden sm:block w-[1px] h-5 lg:h-6 xl:h-7 bg-slate-300/80 mx-1 sm:mx-1.5 lg:mx-2" />

                {/* Stat 3: 20+ */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={isEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{ duration: 0.45, ease: [0.215, 0.61, 0.355, 1], delay: 0.89 }}
                  className="flex flex-col text-center sm:text-left"
                >
                  <span
                    className="font-bold text-[16px] sm:text-[19px] lg:text-[21px] xl:text-[26px] text-[#0A1118] tracking-tight leading-none"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    <StatCounter target={20} suffix="+" isTriggered={isEntered} delayMs={890} durationMs={450} />
                  </span>
                  <span className="font-manrope font-medium text-[5.5px] sm:text-[6.5px] lg:text-[7px] xl:text-[8px] tracking-[0.14em] text-slate-500 uppercase leading-tight mt-0.5 xl:mt-1">
                    COUNTRIES <br />
                    AND GROWING
                  </span>
                </motion.div>

                <div className="hidden sm:block w-[1px] h-5 lg:h-6 xl:h-7 bg-slate-300/80 mx-1 sm:mx-1.5 lg:mx-2" />

                {/* Stat 4: 100% */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={isEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{ duration: 0.45, ease: [0.215, 0.61, 0.355, 1], delay: 1.01 }}
                  className="flex flex-col text-center sm:text-left"
                >
                  <span
                    className="font-bold text-[16px] sm:text-[19px] lg:text-[21px] xl:text-[26px] text-[#0A1118] tracking-tight leading-none"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    <StatCounter target={100} suffix="%" isTriggered={isEntered} delayMs={1010} durationMs={500} />
                  </span>
                  <span className="font-manrope font-medium text-[5.5px] sm:text-[6.5px] lg:text-[7px] xl:text-[8px] tracking-[0.14em] text-slate-500 uppercase leading-tight mt-0.5 xl:mt-1">
                    COMMITTED TO <br />
                    A HEALTHIER YOU
                  </span>
                </motion.div>
              </div>

              {/* Lung Seal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isEntered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.9 }}
                className="w-auto sm:w-[110px] lg:w-[125px] xl:w-[140px] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0"
              >
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-[50px] lg:h-[50px] xl:w-[62px] xl:h-[62px] flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_28s_linear_infinite]">
                    <defs>
                      <path
                        id="sealCirclePath"
                        d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                      />
                    </defs>
                    <text className="font-manrope text-[7px] font-medium uppercase tracking-[0.24em] fill-[#FF5E1E]">
                      <textPath href="#sealCirclePath" startOffset="0%">
                        • SAME BREATH • A BRIGHTER TOMORROW •
                      </textPath>
                    </text>
                  </svg>
                  {/* Center Animated Orange Lung Icon */}
                  <div className="absolute inset-0 flex items-center justify-center text-[#FF5E1E] pointer-events-none">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px] xl:w-5 xl:h-5 fill-none stroke-[#FF5E1E] animate-pulse" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v9" />
                      <path d="M9 7l-3 3" />
                      <path d="M15 7l3 3" />
                      <path d="M7 10c-2.5 0-4 2-4 5.5s2 4.5 4 3.5c1.2-.5 1.7-1.5 1.7-3.2V10z" />
                      <path d="M17 10c2.5 0 4 2 4 5.5s-2 4.5-4 3.5c-1.2-.5-1.7-1.5-1.7-3.2V10z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ROW 4: Bottom Purpose Editorial Rule (Anchored at the bottom baseline, aligned with 01 / 04) */}
            <div className="shrink-0 flex items-center gap-2 sm:gap-4 pt-1.5 lg:pt-2 pointer-events-none z-10 w-full">
              <motion.span
                initial={{ opacity: 0 }}
                animate={isEntered ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="font-manrope font-medium text-[6.5px] sm:text-[7px] lg:text-[7.5px] xl:text-[8.5px] tracking-[0.22em] text-[#0A1118] uppercase shrink-0"
              >
                OUR PURPOSE
              </motion.span>
              <div className="h-[1px] flex-1 overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isEntered ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1], delay: 0.55 }}
                  style={{ transformOrigin: 'left' }}
                  className="h-[1px] w-full bg-slate-300/70 origin-left"
                />
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={isEntered ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: 1.22 }}
                className="font-manrope font-medium text-[6.5px] sm:text-[7px] lg:text-[7.5px] xl:text-[8.5px] tracking-[0.22em] text-slate-500 uppercase shrink-0"
              >
                TECHNOLOGY FOR A BRIGHTER TOMORROW
              </motion.span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
