import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PopcornText } from './PopcornText';
import type { AnimationOptions } from 'framer-motion';

// Global single-play lifecycle guard:
// Ensures the tagline text animation plays STRICTLY ONCE at the moment
// the 3D model moves and the text appears, and never again while zooming or scrolling.
let hasDashboardTextAnimatedGlobal = false;

const POPCORN_SPRING_TRANSITION: AnimationOptions = {
  type: 'spring',
  stiffness: 350,
  damping: 14,
  mass: 1,
};

interface DashboardSectionOverlayProps {
  scrollProgress: number; // 0.0 to 1.0
  onExploreDashboard?: () => void;
  onOpenVideo?: () => void;
}

const TOP_WORDS = [
  { text: 'YOUR', color: '#ff6900' },
  { text: 'DASHBOARD', color: '#000000' },
];

const BOTTOM_WORDS = [
  { text: 'AWAITS', color: '#ff6900' },
];

const DESKTOP_FONT: React.CSSProperties = {
  fontFamily: "'Space Grotesk', 'Inter', -apple-system, sans-serif",
  fontWeight: 800,
  fontSize: 'clamp(48px, 7.5vw, 108px)',
  lineHeight: '1.12em',
  letterSpacing: '-0.03em',
  textAlign: 'center',
};

const MOBILE_FONT: React.CSSProperties = {
  fontFamily: "'Space Grotesk', 'Inter', -apple-system, sans-serif",
  fontWeight: 800,
  fontSize: 'clamp(38px, 9.5vw, 68px)',
  lineHeight: '1.12em',
  letterSpacing: '-0.03em',
  textAlign: 'center',
};

// Custom SVG Icons matching the reference design
const GridDashboardIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[56%] h-[56%]" stroke="#D94E0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="3.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </svg>
);

const BarChartScoreIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[56%] h-[56%]" stroke="#D94E0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="13" width="3.8" height="7" rx="1" />
    <rect x="10.1" y="9" width="3.8" height="11" rx="1" />
    <rect x="16.2" y="4" width="3.8" height="16" rx="1" />
  </svg>
);

const LungsHealthIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[58%] h-[58%]" stroke="#D94E0F" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v7" />
    <path d="M12 8c-1.8 0-3.2 1.2-3.8 2.5" />
    <path d="M12 8c1.8 0 3.2 1.2 3.8 2.5" />
    <path d="M9.2 5.5C6.2 5.5 3.5 8.8 3.5 14c0 3.2 1.6 5.5 3.8 5.5 1.8 0 3.2-1.2 3.2-3.2V9.5c0-2.2-.5-4-1.3-4z" />
    <path d="M14.8 5.5c3 0 5.7 3.3 5.7 8.5 0 3.2-1.6 5.5-3.8 5.5-1.8 0-3.2-1.2-3.2-3.2V9.5c0-2.2.5-4 1.3-4z" />
  </svg>
);

export const DashboardSectionOverlay: React.FC<DashboardSectionOverlayProps> = ({
  scrollProgress,
}) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
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
  const isMobile = windowDimensions.width < 768;

  // ---------------------------------------------------------------------------
  // 1. Physical Airplane-Style Sweep Reveal Architecture (0.88 - 0.925)
  // ---------------------------------------------------------------------------
  const sweepT = Math.min(1, Math.max(0, (scrollProgress - 0.88) / 0.045));
  const sweepEase =
    sweepT < 0.5 ? 4 * sweepT * sweepT * sweepT : 1 - Math.pow(-2 * sweepT + 2, 3) / 2;
  const modelCenterPct = 15.5 + sweepEase * 104.5;
  const revealPct = Math.min(116, Math.max(0, modelCenterPct + 2));

  // Mobile elevation reveal (0.885 - 0.925)
  const mobileProgress = Math.min(1, Math.max(0, (scrollProgress - 0.885) / 0.040));
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
  // 2. Text Popcorn Animation on 3D Model Exit & Subsequent Scroll Separation
  // ---------------------------------------------------------------------------
  const isModelExitRight = scrollProgress >= 0.920;
  const isTextActive = isModelExitRight;
  const isInteractive = scrollProgress >= 0.920;

  // Separation progress: begins once the text has appeared and settled (0.930 - 0.952)
  const splitT = Math.min(1, Math.max(0, (scrollProgress - 0.930) / 0.022));
  const splitEase =
    splitT < 0.5 ? 4 * splitT * splitT * splitT : 1 - Math.pow(-2 * splitT + 2, 3) / 2;

  // Distance required to guarantee complete off-screen exit beyond viewport edges
  const exitTravelDistance = windowDimensions.height * 0.52 + 180;
  const topExitOffset = splitEase * exitTravelDistance;
  const bottomExitOffset = splitEase * exitTravelDistance;
  const textOpacity = splitEase < 0.75 ? 1 : Math.max(0, 1 - (splitEase - 0.75) / 0.25);

  // Desktop zoom-in scale: zooms in from 0.76 up to 1.00
  const baseDesktopScale = 0.76 + 0.24 * splitEase;

  // Pointers activation: triggers once the desktop screen has zoomed into place
  // and remains attached to the desktop stage as it zooms out for the phone transition
  const arePointersActive = scrollProgress >= 0.948;

  // ---------------------------------------------------------------------------
  // 3. Desktop Zoom-Out Fade & Phone Slide-Up Transition (0.972 - 0.994)
  // ---------------------------------------------------------------------------
  const phoneT = Math.min(1, Math.max(0, (scrollProgress - 0.972) / 0.022));
  const phoneEase =
    phoneT < 0.5 ? 4 * phoneT * phoneT * phoneT : 1 - Math.pow(-2 * phoneT + 2, 3) / 2;

  // Desktop zooms out (1.00 -> 0.64), blurs into depth, and fades out (1.0 -> 0.0)
  const desktopScale = baseDesktopScale * (1 - 0.36 * phoneEase);
  const desktopOpacity = splitEase * (1 - phoneEase);
  const desktopBlur = phoneEase * 6;

  // Phone slides up from the bottom edge to the center (translateY: +100vh -> 0px)
  const phoneTravelDistance = windowDimensions.height * 0.92 + 100;
  const phoneTranslateY = (1 - phoneEase) * phoneTravelDistance;
  const phoneOpacity = phoneT <= 0.005 ? 0 : Math.min(1, phoneT / 0.28);
  const phoneScale = 0.94 + 0.06 * phoneEase;

  // Reset only if user navigates all the way back to the very top Hero section (< 0.15)
  if (scrollProgress < 0.15) {
    hasDashboardTextAnimatedGlobal = false;
  }

  // Once the 3D model moves out to the right and text appears, mark the global flag as true so it never re-animates
  useEffect(() => {
    if (isModelExitRight && !hasDashboardTextAnimatedGlobal) {
      hasDashboardTextAnimatedGlobal = true;
    }
  }, [isModelExitRight]);

  if (scrollProgress < 0.86) {
    return null;
  }

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
      {/* Soft Atmospheric Cloudy Mist along the leading transition edge (Desktop sweep) */}
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
      {/* LAYER 1: POPCORN TEXT (Plays ONCE on entry, then glides off-screen)   */}
      {/* ===================================================================== */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 px-4 sm:px-8"
        style={{
          display:
            textOpacity > 0.005 && isModelExitRight
              ? 'flex'
              : 'none',
        }}
      >
        {/* Top Line: "YOUR DASHBOARD" -> moves up and out of view */}
        <div
          className="w-full flex items-center justify-center transition-transform duration-75 will-change-transform"
          style={{
            transform: `translateY(-${topExitOffset}px)`,
            opacity: textOpacity,
          }}
        >
          <div className="w-full max-w-6xl mx-auto flex items-center justify-center">
            <PopcornText
              wordsConfig={TOP_WORDS}
              font={isMobile ? MOBILE_FONT : DESKTOP_FONT}
              startY={30}
              startScale={0}
              startOpacity={0}
              rotationRange={20}
              stagger={0.04}
              transition={POPCORN_SPRING_TRANSITION}
              charIndexOffset={0}
              totalCharsOverall={19}
              isActive={isTextActive}
              hasAppearedAlready={hasDashboardTextAnimatedGlobal}
              onAnimationComplete={() => {
                hasDashboardTextAnimatedGlobal = true;
              }}
            />
          </div>
        </div>

        {/* Bottom Line: "AWAITS" -> moves down and out of view */}
        <div
          className="w-full flex items-center justify-center transition-transform duration-75 will-change-transform mt-2 sm:mt-4 md:mt-6"
          style={{
            transform: `translateY(${bottomExitOffset}px)`,
            opacity: textOpacity,
          }}
        >
          <div className="w-full max-w-6xl mx-auto flex items-center justify-center">
            <PopcornText
              wordsConfig={BOTTOM_WORDS}
              font={isMobile ? MOBILE_FONT : DESKTOP_FONT}
              startY={30}
              startScale={0}
              startOpacity={0}
              rotationRange={20}
              stagger={0.04}
              transition={POPCORN_SPRING_TRANSITION}
              charIndexOffset={13}
              totalCharsOverall={19}
              isActive={isTextActive}
              hasAppearedAlready={hasDashboardTextAnimatedGlobal}
              onAnimationComplete={() => {
                hasDashboardTextAnimatedGlobal = true;
              }}
            />
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* LAYER 2: DESKTOP DASHBOARD MOCKUP + ANIMATED CALLOUT POINTERS         */}
      {/* ===================================================================== */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-2 sm:px-6 md:px-10 pt-14 sm:pt-16 md:pt-20 pb-2 sm:pb-4"
        style={{
          opacity: desktopOpacity,
          pointerEvents: splitEase >= 0.85 && phoneT < 0.2 ? 'auto' : 'none',
        }}
      >
        <div
          className="relative w-full max-w-[1380px] aspect-[1024/484] max-h-[84vh] flex items-center justify-center will-change-transform mx-auto"
          style={{
            transform: `scale(${desktopScale})`,
            filter: desktopBlur > 0.1 ? `blur(${desktopBlur.toFixed(2)}px)` : undefined,
          }}
        >
          {/* Ambient Warm Theme-Orange Backlight Glow behind Monitor */}
          <div
            className="absolute left-[22%] right-[22%] top-[10%] bottom-[10%] rounded-[3rem] pointer-events-none -z-10"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255, 105, 0, 0.26) 0%, rgba(255, 105, 0, 0.09) 52%, transparent 74%)',
              filter: 'blur(40px)',
              opacity: desktopOpacity,
            }}
          />

          {/* Centered Desktop Monitor Mockup locked to reference stage coordinates */}
          <div
            className="absolute"
            style={{
              left: '23.15%',
              top: '9.8%',
              width: '52.8%',
              height: '84.8%',
            }}
          >
            <img
              src="/images/dashboard/desktop-mockup.png"
              alt="Iron Lung User Dashboard Desktop Mockup"
              className="w-full h-full object-contain block select-none pointer-events-none"
              style={{
                filter:
                  'drop-shadow(0 26px 44px rgba(0, 0, 0, 0.15)) drop-shadow(0 8px 18px rgba(255, 105, 0, 0.10))',
              }}
            />
          </div>

          {/* ================================================================= */}
          {/* SVG POINTER LINES & PULSING TARGET DOTS (viewBox 0 0 1024 484)    */}
          {/* ================================================================= */}
          <svg
            viewBox="0 0 1024 484"
            className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
          >
            {/* 1. Top-Left Pointer Line: (328, 146) -> (238, 146) -> (205, 117) -> (81, 117) */}
            <motion.path
              d="M 328 146 L 238 146 L 205 117 L 81 117"
              fill="none"
              stroke="#FF5500"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                arePointersActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
            />

            {/* 2. Bottom-Left Pointer Line: (306, 313) -> (252, 313) -> (238, 301) -> (81, 301) */}
            <motion.path
              d="M 306 313 L 252 313 L 238 301 L 81 301"
              fill="none"
              stroke="#FF5500"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                arePointersActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.55, delay: 0.18, ease: 'easeOut' }}
            />

            {/* 3. Top-Right Pointer Line: (682, 165) -> (756, 165) -> (804, 124) -> (858, 124) */}
            <motion.path
              d="M 682 165 L 756 165 L 804 124 L 858 124"
              fill="none"
              stroke="#FF5500"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                arePointersActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.55, delay: 0.13, ease: 'easeOut' }}
            />
            {/* Top-Right Title Short Accent Line */}
            <motion.line
              x1="873"
              y1="117"
              x2="914"
              y2="117"
              stroke="#FF5500"
              strokeWidth="1.8"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                arePointersActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.35, delay: 0.38, ease: 'easeOut' }}
            />

            {/* 4. Bottom-Right Pointer Line: (736, 276) -> (768, 276) -> (807, 310) -> (858, 310) */}
            <motion.path
              d="M 736 276 L 768 276 L 807 310 L 858 310"
              fill="none"
              stroke="#FF5500"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                arePointersActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.55, delay: 0.23, ease: 'easeOut' }}
            />
            {/* Bottom-Right Title Short Accent Line */}
            <motion.line
              x1="873"
              y1="303"
              x2="914"
              y2="303"
              stroke="#FF5500"
              strokeWidth="1.8"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                arePointersActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.35, delay: 0.46, ease: 'easeOut' }}
            />

            {/* Target Dots with Sonar Pulse Rings */}
            {[
              { cx: 328, cy: 146, delay: 0.02 },
              { cx: 306, cy: 313, delay: 0.12 },
              { cx: 682, cy: 165, delay: 0.07 },
              { cx: 736, cy: 276, delay: 0.17 },
            ].map((dot, idx) => (
              <g key={idx}>
                {/* Radiating Sonar Pulse Ring */}
                {arePointersActive && (
                  <motion.circle
                    cx={dot.cx}
                    cy={dot.cy}
                    r="6"
                    fill="none"
                    stroke="#FF5500"
                    strokeWidth="1.5"
                    initial={{ r: 5.5, opacity: 0.75 }}
                    animate={{ r: 14, opacity: 0 }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: dot.delay + 0.3,
                      ease: 'easeOut',
                    }}
                  />
                )}
                {/* Outer Orange Ring + White Core */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={
                    arePointersActive
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0, opacity: 0 }
                  }
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 16,
                    delay: dot.delay,
                  }}
                  style={{ transformOrigin: `${dot.cx}px ${dot.cy}px` }}
                >
                  <circle cx={dot.cx} cy={dot.cy} r="5.5" fill="#FF5500" />
                  <circle cx={dot.cx} cy={dot.cy} r="2.1" fill="#FFFFFF" />
                </motion.g>
              </g>
            ))}
          </svg>

          {/* ================================================================= */}
          {/* 4 ANIMATED CALLOUT BLOCKS (Locked to 1024x484 percentage coords)  */}
          {/* ================================================================= */}

          {/* 1. TOP-LEFT: PERSONALISED DASHBOARD */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{
              left: '2.73%',
              top: '15.8%',
              width: '19.5%',
            }}
            initial={{ opacity: 0, x: -16, y: 6 }}
            animate={
              arePointersActive
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, x: -16, y: 6 }
            }
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
              delay: 0.22,
            }}
          >
            <div className="flex items-start gap-[6.5%]">
              <div className="w-[19%] aspect-square rounded-[22%] bg-[#F7E8DE] flex items-center justify-center shrink-0 shadow-sm">
                <GridDashboardIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="text-[#FF5500] font-bold uppercase tracking-[0.02em] leading-[1.18] whitespace-nowrap"
                  style={{ fontSize: 'clamp(9px, 1.06vw, 14.8px)' }}
                >
                  PERSONALISED
                  <br />
                  DASHBOARD
                </h4>
                <p
                  className="text-[#23272F] font-normal leading-[1.42] mt-[15%] whitespace-nowrap"
                  style={{ fontSize: 'clamp(8px, 0.84vw, 12px)' }}
                >
                  Get a clear overview of
                  <br />
                  your daily plan, tasks and
                  <br />
                  session progress.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2. BOTTOM-LEFT: TRACK YOUR LUNG SCORE */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{
              left: '2.73%',
              top: '53.8%',
              width: '19.5%',
            }}
            initial={{ opacity: 0, x: -16, y: 6 }}
            animate={
              arePointersActive
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, x: -16, y: 6 }
            }
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
              delay: 0.32,
            }}
          >
            <div className="flex items-start gap-[6.5%]">
              <div className="w-[19%] aspect-square rounded-[22%] bg-[#F7E8DE] flex items-center justify-center shrink-0 shadow-sm">
                <BarChartScoreIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="text-[#FF5500] font-bold uppercase tracking-[0.02em] leading-[1.18] whitespace-nowrap"
                  style={{ fontSize: 'clamp(9px, 1.06vw, 14.8px)' }}
                >
                  TRACK YOUR
                  <br />
                  LUNG SCORE
                </h4>
                <p
                  className="text-[#23272F] font-normal leading-[1.42] mt-[15%] whitespace-nowrap"
                  style={{ fontSize: 'clamp(8px, 0.84vw, 12px)' }}
                >
                  Monitor your performance
                  <br />
                  with detailed session data
                  <br />
                  and track improvement
                  <br />
                  over time.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 3. TOP-RIGHT: REAL-TIME LUNG HEALTH METRICS */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{
              left: '80.08%',
              top: '15.8%',
              width: '19.5%',
            }}
            initial={{ opacity: 0, x: 16, y: 6 }}
            animate={
              arePointersActive
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, x: 16, y: 6 }
            }
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
              delay: 0.27,
            }}
          >
            <div className="flex items-start gap-[6.5%]">
              <div className="w-[19%] aspect-square rounded-[22%] bg-[#F7E8DE] flex items-center justify-center shrink-0 shadow-sm">
                <LungsHealthIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="text-[#FF5500] font-bold uppercase tracking-[0.02em] leading-[1.18] whitespace-nowrap"
                  style={{ fontSize: 'clamp(9px, 1.06vw, 14.8px)' }}
                >
                  REAL-TIME
                  <br />
                  LUNG HEALTH METRICS
                </h4>
                <p
                  className="text-[#23272F] font-normal leading-[1.42] mt-[15%] whitespace-nowrap"
                  style={{ fontSize: 'clamp(8px, 0.84vw, 12px)' }}
                >
                  See your lung capacity,
                  <br />
                  workouts and breathing
                  <br />
                  volume at a glance.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 4. BOTTOM-RIGHT: TRAIN AT YOUR OWN PACE */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{
              left: '80.08%',
              top: '54.1%',
              width: '19.5%',
            }}
            initial={{ opacity: 0, x: 16, y: 6 }}
            animate={
              arePointersActive
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, x: 16, y: 6 }
            }
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
              delay: 0.37,
            }}
          >
            <div className="flex items-start gap-[6.5%]">
              <div className="w-[19%] aspect-square rounded-[22%] bg-[#F7E8DE] flex items-center justify-center shrink-0 shadow-sm">
                <BarChartScoreIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="text-[#FF5500] font-bold uppercase tracking-[0.02em] leading-[1.18] whitespace-nowrap"
                  style={{ fontSize: 'clamp(9px, 1.06vw, 14.8px)' }}
                >
                  TRAIN AT
                  <br />
                  YOUR OWN PACE
                </h4>
                <p
                  className="text-[#23272F] font-normal leading-[1.42] mt-[15%] whitespace-nowrap"
                  style={{ fontSize: 'clamp(8px, 0.84vw, 12px)' }}
                >
                  Choose your difficulty level
                  <br />
                  and track your training
                  <br />
                  sessions with clear progress
                  <br />
                  indicators.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* LAYER 3: THE PHONE MOCKUP (Slides up from bottom as Desktop zooms out) */}
      {/* ===================================================================== */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[15] px-4 sm:px-6 md:px-10 pt-16 sm:pt-20 md:pt-22 pb-4 sm:pb-6"
        style={{
          opacity: phoneOpacity,
          pointerEvents: phoneEase >= 0.85 ? 'auto' : 'none',
        }}
      >
        <div
          className="relative flex items-center justify-center will-change-transform"
          style={{
            transform: `translateY(${phoneTranslateY}px) scale(${phoneScale})`,
          }}
        >
          {/* Ambient Warm Theme-Orange Backlight Glow for Phone */}
          <div
            className="absolute -inset-6 sm:-inset-10 md:-inset-14 rounded-[3rem] pointer-events-none -z-10"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255, 105, 0, 0.28) 0%, rgba(255, 105, 0, 0.10) 50%, transparent 72%)',
              filter: 'blur(38px)',
              opacity: phoneEase,
            }}
          />

          {/* Full Uncropped Phone Mockup */}
          <img
            src="/images/dashboard/phone-mockup.png"
            alt="Iron Lung Mobile App Session Report Mockup"
            className="w-auto h-auto max-w-[82vw] sm:max-w-[340px] md:max-w-[370px] max-h-[78vh] object-contain block select-none pointer-events-none"
            style={{
              filter:
                'drop-shadow(0 26px 44px rgba(0, 0, 0, 0.18)) drop-shadow(0 8px 18px rgba(255, 105, 0, 0.12))',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardSectionOverlay;
