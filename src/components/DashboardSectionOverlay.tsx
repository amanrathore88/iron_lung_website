import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardSectionOverlayProps {
  scrollProgress: number; // 0.0 to 1.0
  onExploreDashboard?: () => void;
  onOpenVideo?: () => void;
}

interface WordItem {
  text: string;
  color: string;
}

interface DashboardSlide {
  id: string;
  image: string;
  label: string;
  topWords: WordItem[];
  bottomWords: WordItem[];
}

const DASHBOARD_SLIDES: DashboardSlide[] = [
  {
    id: 'overview',
    image: '/images/dashboard/1.png',
    label: 'Overview',
    topWords: [
      { text: 'YOUR', color: '#ff6900' },
      { text: 'BREATHING', color: '#000000' },
    ],
    bottomWords: [
      { text: 'IN ONE VIEW', color: '#ff6900' },
    ],
  },
  {
    id: 'progress',
    image: '/images/dashboard/2.png',
    label: 'Progress',
    topWords: [
      { text: 'TRACK', color: '#ff6900' },
      { text: 'EVERY', color: '#000000' },
    ],
    bottomWords: [
      { text: 'IMPROVEMENT', color: '#ff6900' },
    ],
  },
  {
    id: 'profile',
    image: '/images/dashboard/3.png',
    label: 'Profile',
    topWords: [
      { text: 'YOUR', color: '#ff6900' },
      { text: 'JOURNEY', color: '#000000' },
    ],
    bottomWords: [
      { text: 'YOUR WAY', color: '#ff6900' },
    ],
  },
];

const INITIAL_TOP_WORDS: WordItem[] = [
  { text: 'YOUR', color: '#ff6900' },
  { text: 'DASHBOARD', color: '#000000' },
];

const INITIAL_BOTTOM_WORDS: WordItem[] = [
  { text: 'AWAITS', color: '#ff6900' },
];

export const DashboardSectionOverlay: React.FC<DashboardSectionOverlayProps> = ({
  scrollProgress,
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [hasSettled, setHasSettled] = useState<boolean>(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDesktop = windowDimensions.width >= 1024;
  const isTablet = windowDimensions.width >= 768 && windowDimensions.width < 1024;
  const isMobile = windowDimensions.width < 768;

  // ---------------------------------------------------------------------------
  // 1. Physical Airplane-Style Sweep Reveal Architecture (0.88 - 0.93)
  // ---------------------------------------------------------------------------
  // Synchronized in lockstep with the 3D model flight across to user dashboard.
  const sweepT = Math.min(1, Math.max(0, (scrollProgress - 0.88) / 0.05));
  const sweepEase = sweepT < 0.5 ? 4 * sweepT * sweepT * sweepT : 1 - Math.pow(-2 * sweepT + 2, 3) / 2;
  const modelCenterPct = 15.5 + sweepEase * 104.5;
  const revealPct = Math.min(116, Math.max(0, modelCenterPct + 2));

  // Mobile elevation reveal (0.885 - 0.93)
  const mobileProgress = Math.min(1, Math.max(0, (scrollProgress - 0.885) / 0.045));
  const mobileEase =
    mobileProgress < 0.5
      ? 4 * mobileProgress * mobileProgress * mobileProgress
      : 1 - Math.pow(-2 * mobileProgress + 2, 3) / 2;

  // Mask gradient for desktop sweep
  const feather = 18;
  const fadeStart = Math.max(0, revealPct - feather);
  const fadeMid1 = Math.max(0, revealPct - feather * 0.60);
  const fadeMid2 = Math.max(0, revealPct - feather * 0.25);
  const fadeEnd = Math.min(100, revealPct);

  const maskGradient =
    revealPct >= 99.5 || !isDesktop
      ? undefined
      : `linear-gradient(to right, #000 0%, #000 ${fadeStart}%, rgba(0, 0, 0, 0.88) ${fadeMid1}%, rgba(0, 0, 0, 0.42) ${fadeMid2}%, rgba(0, 0, 0, 0.08) ${
          fadeMid2 + (fadeEnd - fadeMid2) * 0.7
        }%, transparent ${fadeEnd}%, transparent 100%)`;

  // ---------------------------------------------------------------------------
  // 2. Scroll-Driven Text Split & Image Fade-In (0.925 - 0.965)
  // ---------------------------------------------------------------------------
  // As the user scrolls:
  // "YOUR DASHBOARD" moves upwards
  // "AWAITS" moves downwards
  // The dashboard image gradually blooms in from the center with scale and opacity
  const splitT = Math.min(1, Math.max(0, (scrollProgress - 0.925) / 0.040));
  const splitEase =
    splitT < 0.5 ? 4 * splitT * splitT * splitT : 1 - Math.pow(-2 * splitT + 2, 3) / 2;

  // Once the image is fully in place, trigger text transformation & interactive cursor prompt
  useEffect(() => {
    if (splitT >= 0.97 && !hasSettled) {
      setHasSettled(true);
    } else if (splitT < 0.82 && hasSettled) {
      setHasSettled(false);
      setActiveSlide(0);
    }
  }, [splitT, hasSettled]);

  const isInteractive = scrollProgress >= 0.94;

  if (scrollProgress < 0.86) {
    return null;
  }

  // Calculate dynamic vertical travel offset for text split
  const cardHalfHeight = isMobile ? 120 : isTablet ? 170 : 210;
  const topYOffset = (1 - splitEase) * cardHalfHeight;
  const bottomYOffset = -(1 - splitEase) * cardHalfHeight;

  // Current active text words
  const currentTopWords = hasSettled
    ? DASHBOARD_SLIDES[activeSlide].topWords
    : INITIAL_TOP_WORDS;

  const currentBottomWords = hasSettled
    ? DASHBOARD_SLIDES[activeSlide].bottomWords
    : INITIAL_BOTTOM_WORDS;

  const handleCardClick = () => {
    if (!hasSettled) return;
    setActiveSlide((prev) => (prev + 1) % DASHBOARD_SLIDES.length);
  };

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden ${
        isInteractive ? 'z-[30]' : 'z-[15]'
      }`}
      style={{
        backgroundColor: '#FAF7F2',
        backgroundImage:
          'radial-gradient(ellipse at 85% 20%, rgba(255, 255, 255, 0.75) 0%, rgba(250, 247, 242, 0) 70%), radial-gradient(ellipse at 18% 65%, rgba(255, 255, 255, 0.55) 0%, rgba(250, 247, 242, 0) 65%), radial-gradient(ellipse at center, rgba(255, 105, 0, 0.06) 0%, rgba(250, 247, 242, 0) 60%)',
        maskImage: maskGradient,
        WebkitMaskImage: maskGradient,
        opacity: isDesktop ? 1.0 : mobileEase,
        transform: isDesktop ? undefined : `translateY(${(1 - mobileEase) * 20}px)`,
        pointerEvents: isInteractive ? 'auto' : 'none',
      }}
    >
      {/* Soft atmospheric cloudy mist along the leading edge (Desktop sweep) */}
      {isDesktop && revealPct > 5 && revealPct < 105 && (
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-30"
          style={{
            left: `${fadeMid1}%`,
            width: '240px',
            transform: 'translateX(-50%)',
            background:
              'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.48) 0%, rgba(254, 251, 247, 0.22) 50%, transparent 80%)',
            filter: 'blur(24px)',
          }}
        />
      )}

      {/* Top Header Soft Gradient Fade beneath Navbar */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAF7F2]/95 via-[#FAF7F2]/50 to-transparent pointer-events-none z-[10]" />

      {/* ===================================================================== */}
      {/* CENTERED SCROLLYTELLING CONTAINER                                     */}
      {/* ===================================================================== */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-between pt-16 sm:pt-20 md:pt-22 pb-6 sm:pb-8 md:pb-10 px-4 sm:px-8 text-center pointer-events-auto">
        
        {/* =================================================================== */}
        {/* TOP LINE: "YOUR DASHBOARD" -> transforms to "YOUR BREATHING" etc.   */}
        {/* =================================================================== */}
        <div
          className="w-full flex items-center justify-center transition-transform duration-75 will-change-transform z-20"
          style={{
            transform: `translateY(${topYOffset}px)`,
          }}
        >
          <div className="h-12 sm:h-14 md:h-16 lg:h-20 flex items-center justify-center overflow-visible">
            <AnimatePresence mode="wait">
              <motion.h2
                key={hasSettled ? `top-slide-${activeSlide}` : 'top-initial'}
                initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -18, filter: 'blur(5px)' }}
                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase flex items-center justify-center gap-2 sm:gap-3.5 whitespace-nowrap"
                style={{ fontFamily: "'Space Grotesk', 'Inter', -apple-system, sans-serif" }}
              >
                {currentTopWords.map((word, i) => (
                  <span key={i} style={{ color: word.color }}>
                    {word.text}
                  </span>
                ))}
              </motion.h2>
            </AnimatePresence>
          </div>
        </div>

        {/* =================================================================== */}
        {/* CENTER DASHBOARD CARD: Fades and scales in from center on scroll    */}
        {/* =================================================================== */}
        <div
          className="relative w-full max-w-4xl lg:max-w-5xl px-2 sm:px-4 flex items-center justify-center my-auto z-10"
          style={{
            opacity: splitEase,
            transform: `scale(${0.90 + 0.10 * splitEase})`,
            pointerEvents: splitEase >= 0.90 ? 'auto' : 'none',
          }}
        >
          {/* Ambient Warm Orange Halo Backlight radiating behind the card */}
          <div
            className="absolute -inset-4 sm:-inset-8 md:-inset-12 rounded-[2rem] md:rounded-[3rem] pointer-events-none -z-10 transition-opacity duration-700"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255, 105, 0, 0.32) 0%, rgba(255, 105, 0, 0.12) 50%, transparent 72%)',
              filter: 'blur(36px)',
              opacity: splitEase,
            }}
          />

          {/* The Interactive Rounded Dashboard Card */}
          <div
            onClick={handleCardClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick();
              }
            }}
            tabIndex={hasSettled ? 0 : -1}
            role="button"
            aria-label={`Interactive dashboard view: ${DASHBOARD_SLIDES[activeSlide].label}. Click to switch view.`}
            className="relative w-full aspect-[16/9] max-h-[46vh] sm:max-h-[50vh] rounded-2xl md:rounded-3xl overflow-hidden bg-white shadow-2xl border border-black/10 cursor-pointer group transition-all duration-300 hover:scale-[1.01] active:scale-[0.995] focus:outline-none focus:ring-2 focus:ring-[#ff6900]/50"
            style={{
              boxShadow:
                '0 0 80px -10px rgba(255, 105, 0, 0.26), 0 25px 60px -15px rgba(0, 0, 0, 0.14), 0 10px 20px -5px rgba(0, 0, 0, 0.05)',
            }}
          >
            {/* Stacked Images for Seamless Zero-Flash Crossfade */}
            {DASHBOARD_SLIDES.map((slide, idx) => (
              <motion.img
                key={slide.id}
                src={slide.image}
                alt={slide.label}
                className="absolute inset-0 w-full h-full object-cover object-left-top select-none pointer-events-none"
                initial={false}
                animate={{
                  opacity: activeSlide === idx ? 1 : 0,
                  scale: activeSlide === idx ? 1 : 1.015,
                }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
              />
            ))}

            {/* Subtle Gradient Vignette along bottom to elevate controls */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none z-10" />

            {/* Step Indicator Pills at Bottom-Left of Card */}
            <div className="absolute bottom-2.5 left-2.5 sm:bottom-4 sm:left-4 z-20 flex items-center gap-1 sm:gap-2 bg-black/45 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-white/15 pointer-events-auto">
              {DASHBOARD_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlide(idx);
                  }}
                  className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-mono font-semibold transition-all duration-300 ${
                    activeSlide === idx
                      ? 'bg-[#ff6900] text-white shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="sm:hidden">0{idx + 1}</span>
                  <span className="hidden sm:inline">0{idx + 1} {s.label}</span>
                </button>
              ))}
            </div>

            {/* =============================================================== */}
            {/* ANIMATED CURSOR PROMPT: Appears once image is settled in place   */}
            {/* =============================================================== */}
            <AnimatePresence>
              {hasSettled && isInteractive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.75, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.75, y: 12 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 z-30 pointer-events-none select-none flex items-center gap-2 sm:gap-3"
                >
                  {/* Modern Sleek Pointer with Pulse Ripples */}
                  <div className="relative">
                    {/* Concentric Pulse Ripples */}
                    <motion.span
                      className="absolute -top-1 -left-1 w-6 h-6 rounded-full border-2 border-[#ff6900] pointer-events-none"
                      animate={{ scale: [0.6, 2.4], opacity: [0.9, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                    />
                    <motion.span
                      className="absolute -top-1 -left-1 w-6 h-6 rounded-full border border-white pointer-events-none"
                      animate={{ scale: [0.6, 1.8], opacity: [0.7, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                    />

                    {/* Animated Floating Cursor SVG */}
                    <motion.div
                      animate={{
                        y: [0, -6, 0],
                        x: [0, 4, 0],
                        scale: [1, 0.90, 1],
                      }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                      >
                        <path
                          d="M3 2L10.5 20L13.8 12.8L21 9.5L3 2Z"
                          fill="#0F172A"
                          stroke="#FFFFFF"
                          strokeWidth="1.75"
                          strokeLinejoin="round"
                        />
                        <circle cx="4.5" cy="3.5" r="2" fill="#ff6900" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Pulsing Pill Badge */}
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white shadow-2xl border border-white/20 select-none"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#ff6900] animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-wider uppercase text-slate-100">
                      {activeSlide === 0
                        ? 'Click for Progress'
                        : activeSlide === 1
                        ? 'Click for Profile'
                        : 'Click to Restart'}
                    </span>
                    <span className="text-slate-400 text-[10px] font-mono hidden sm:inline">
                      {activeSlide + 1}/3
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* =================================================================== */}
        {/* BOTTOM LINE: "AWAITS" -> transforms to "IN ONE VIEW" etc.           */}
        {/* =================================================================== */}
        <div
          className="w-full flex items-center justify-center transition-transform duration-75 will-change-transform z-20"
          style={{
            transform: `translateY(${bottomYOffset}px)`,
          }}
        >
          <div className="h-12 sm:h-14 md:h-16 lg:h-20 flex items-center justify-center overflow-visible">
            <AnimatePresence mode="wait">
              <motion.h2
                key={hasSettled ? `bottom-slide-${activeSlide}` : 'bottom-initial'}
                initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -18, filter: 'blur(5px)' }}
                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase flex items-center justify-center gap-2 sm:gap-3.5 whitespace-nowrap"
                style={{ fontFamily: "'Space Grotesk', 'Inter', -apple-system, sans-serif" }}
              >
                {currentBottomWords.map((word, i) => (
                  <span key={i} style={{ color: word.color }}>
                    {word.text}
                  </span>
                ))}
              </motion.h2>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardSectionOverlay;
