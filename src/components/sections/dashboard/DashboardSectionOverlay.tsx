import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PopcornText } from '../../ui/PopcornText';
import type { AnimationOptions } from 'framer-motion';

// Global single-play lifecycle guard:
// Ensures the tagline text animation plays STRICTLY ONCE at the moment
// the 3D model moves and the text appears, and never again while zooming or scrolling.
let hasDashboardTextAnimatedGlobal = false;

const POPCORN_SPRING_TRANSITION: AnimationOptions = {
  type: 'spring',
  stiffness: 210,
  damping: 18,
  mass: 1.05,
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

const MOBILE_ROW1_WORDS = [
  { text: 'YOUR', color: '#ff6900' },
];

const MOBILE_ROW2_WORDS = [
  { text: 'DASHBOARD', color: '#0A1118' },
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
  fontSize: 'clamp(40px, 11vw, 54px)',
  lineHeight: '1.06em',
  letterSpacing: '-0.03em',
  textAlign: 'center',
};

// Custom SVG Icons matching the reference design
const GridDashboardIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[52%] h-[52%]" stroke="#D94E0F" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="3.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </svg>
);

const BarChartScoreIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[52%] h-[52%]" stroke="#D94E0F" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="13" width="3.8" height="7" rx="1" />
    <rect x="10.1" y="9" width="3.8" height="11" rx="1" />
    <rect x="16.2" y="4" width="3.8" height="16" rx="1" />
  </svg>
);

const LungsHealthIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[54%] h-[54%]" stroke="#D94E0F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v7" />
    <path d="M12 8c-1.8 0-3.2 1.2-3.8 2.5" />
    <path d="M12 8c1.8 0 3.2 1.2 3.8 2.5" />
    <path d="M9.2 5.5C6.2 5.5 3.5 8.8 3.5 14c0 3.2 1.6 5.5 3.8 5.5 1.8 0 3.2-1.2 3.2-3.2V9.5c0-2.2-.5-4-1.3-4z" />
    <path d="M14.8 5.5c3 0 5.7 3.3 5.7 8.5 0 3.2-1.6 5.5-3.8 5.5-1.8 0-3.2-1.2-3.2-3.2V9.5c0-2.2.5-4 1.3-4z" />
  </svg>
);

const CalendarSessionIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[52%] h-[52%]" stroke="#FF5500" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <line x1="8" y1="2.8" x2="8" y2="6.8" />
    <line x1="16" y1="2.8" x2="16" y2="6.8" />
    <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
    <circle cx="12.5" cy="13.5" r="1.1" fill="#FF5500" stroke="none" />
    <circle cx="16.2" cy="13.5" r="1.1" fill="#FF5500" stroke="none" />
    <rect x="6.8" y="15.6" width="4.5" height="2" rx="0.8" fill="#FF5500" stroke="none" />
  </svg>
);

const SolidBarChartIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="#FF5500" className="w-[52%] h-[52%]">
    <rect x="4" y="13" width="3.8" height="7" rx="1.2" />
    <rect x="10.1" y="9" width="3.8" height="11" rx="1.2" />
    <rect x="16.2" y="4" width="3.8" height="16" rx="1.2" />
  </svg>
);

const PdfReportIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[52%] h-[52%]" stroke="#FF5500" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 3h7.8L19 7.7V19a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M14 3v4.8h4.8" />
    <path d="M11.5 10.5v4.2" />
    <path d="M11.5 14.7l-3 2.3" />
    <path d="M11.5 14.7l3.8.4" />
  </svg>
);

const SessionDocIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[52%] h-[52%]" stroke="#FF5500" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 3h7.8L19 7.7V19a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M14 3v4.8h4.8" />
    <line x1="8" y1="11" x2="14.5" y2="11" />
    <line x1="8" y1="14" x2="15.5" y2="14" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </svg>
);

const SaveReportDownloadIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[52%] h-[52%]" stroke="#FF5500" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 3h7.8L19 7.7V19a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M14 3v4.8h4.8" />
    <path d="M12 10.5v6" />
    <path d="M9.5 14.2L12 16.7l2.5-2.5" />
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
    let lastWidth = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768 && Math.abs(window.innerWidth - lastWidth) < 20) {
        return;
      }
      lastWidth = window.innerWidth;
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
  // 1. Physical Airplane-Style Sweep Reveal Architecture (0.855 - 0.925)
  // ---------------------------------------------------------------------------
  const sweepT = Math.min(1, Math.max(0, (scrollProgress - 0.855) / 0.070));
  const sweepEase = sweepT * sweepT * (3 - 2 * sweepT);
  const modelCenterPct = 15.5 + sweepEase * 104.5;
  const revealPct = Math.min(116, Math.max(0, modelCenterPct + 2));

  // Mobile elevation reveal (0.860 - 0.896): hands off smoothly from About Us
  const mobileProgress = Math.min(1, Math.max(0, (scrollProgress - 0.860) / 0.036));
  const mobileEase = mobileProgress * mobileProgress * (3 - 2 * mobileProgress);

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
  const isModelExitRight = isMobile ? scrollProgress >= 0.882 : scrollProgress >= 0.912;
  const isTextActive = isModelExitRight;
  const isInteractive = isMobile ? scrollProgress >= 0.882 : scrollProgress >= 0.912;

  // Separation progress:
  // Desktop: 0.946 -> 0.966 (gives generous hold time on 'YOUR DASHBOARD AWAITS' before splitting)
  // Mobile: 0.916 -> 0.938 (gives generous hold time on Stage 1 text before splitting)
  const splitStart = isMobile ? 0.916 : 0.946;
  const splitSpan = isMobile ? 0.022 : 0.020;
  const splitT = Math.min(1, Math.max(0, (scrollProgress - splitStart) / splitSpan));
  const splitEase =
    splitT < 0.5 ? 4 * splitT * splitT * splitT : 1 - Math.pow(-2 * splitT + 2, 3) / 2;

  // Distance required to guarantee complete off-screen exit beyond viewport edges
  const exitTravelDistance = windowDimensions.height * 0.52 + 180;
  const topExitOffset = splitEase * exitTravelDistance;
  const bottomExitOffset = splitEase * exitTravelDistance;
  const textOpacity = splitEase < 0.75 ? 1 : Math.max(0, 1 - (splitEase - 0.75) / 0.25);

  // Desktop zoom-in scale: zooms in from 0.76 (or 0.84 on mobile) up to 1.00
  const baseDesktopScale = (isMobile ? 0.84 : 0.76) + (isMobile ? 0.16 : 0.24) * splitEase;

  // Pointers activation: triggers once the desktop screen has zoomed into place
  // and remains attached to the desktop stage as it zooms out for the phone transition
  const arePointersActive = isMobile ? scrollProgress >= 0.932 : scrollProgress >= 0.963;

  // ---------------------------------------------------------------------------
  // 3. Desktop Zoom-Out Fade & Phone Slide-Up Transition
  // Desktop: 0.978 -> 0.996
  // Mobile: 0.956 -> 0.978 (leaves a generous 0.978 -> 1.000 hold window for the Phone stage)
  // ---------------------------------------------------------------------------
  const phoneStart = isMobile ? 0.956 : 0.978;
  const phoneSpan = isMobile ? 0.022 : 0.018;
  const phoneT = Math.min(1, Math.max(0, (scrollProgress - phoneStart) / phoneSpan));
  const phoneEase =
    phoneT < 0.5 ? 4 * phoneT * phoneT * phoneT : 1 - Math.pow(-2 * phoneT + 2, 3) / 2;

  // Desktop zooms out (1.00 -> 0.64), blurs into depth, and fades out (1.0 -> 0.0)
  const desktopScale = baseDesktopScale * (1 - 0.36 * phoneEase);
  const desktopOpacity = splitEase * (1 - phoneEase);
  const desktopBlur = phoneEase * 6;

  // Phone slides up from the bottom edge to the center (translateY: +100vh -> 0px)
  const phoneTravelDistance = windowDimensions.height * (isMobile ? 0.78 : 0.92) + 80;
  const phoneTranslateY = (1 - phoneEase) * phoneTravelDistance;
  const phoneOpacity = phoneT <= 0.005 ? 0 : Math.min(1, phoneT / 0.28);
  const phoneScale = 0.94 + 0.06 * phoneEase;

  // Phone pointers activation: triggers once the phone mockup settles into the center
  const arePhonePointersActive = isMobile ? scrollProgress >= 0.974 : scrollProgress >= 0.991;

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

  if (scrollProgress < 0.85) {
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
        {/* Mobile Background Decorative Concentric Rings & Warm Glow */}
        {isMobile && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
            style={{ opacity: textOpacity }}
          >
            <div className="w-[310px] h-[310px] rounded-full border border-[#FF5500]/[0.10] flex items-center justify-center">
              <div className="w-[220px] h-[220px] rounded-full border border-dashed border-[#FF5500]/[0.16] flex items-center justify-center">
                <div className="w-[140px] h-[140px] rounded-full bg-[#FF5500]/[0.06] blur-2xl" />
              </div>
            </div>
          </div>
        )}

        {/* Top Split Group: Kicker (Mobile) + "YOUR DASHBOARD" -> moves up and out of view */}
        <div
          className="w-full flex flex-col items-center justify-center transition-transform duration-75 will-change-transform"
          style={{
            transform: `translateY(-${topExitOffset}px)`,
            opacity: textOpacity,
          }}
        >
          {isMobile && (
            <div className="flex flex-col items-center mb-4">
              <div className="w-[1px] h-8 bg-gradient-to-b from-transparent to-[#FF5500]/40 mb-2.5" />
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/90 border border-[#FF5500]/20 shadow-[0_4px_16px_rgba(255,85,0,0.08)] backdrop-blur-sm">
                <span className="text-[9.5px] font-extrabold tracking-[0.22em] text-[#0A1118] uppercase">
                  CONNECTED ECOSYSTEM
                </span>
              </div>
            </div>
          )}

          {isMobile ? (
            <div className="w-full flex flex-col items-center justify-center gap-1">
              <div className="w-full flex items-center justify-center">
                <PopcornText
                  wordsConfig={MOBILE_ROW1_WORDS}
                  font={MOBILE_FONT}
                  startY={30}
                  startScale={0}
                  startOpacity={0}
                  rotationRange={20}
                  stagger={0.055}
                  transition={POPCORN_SPRING_TRANSITION}
                  charIndexOffset={0}
                  totalCharsOverall={19}
                  isActive={isTextActive}
                  hasAppearedAlready={hasDashboardTextAnimatedGlobal}
                />
              </div>
              <div className="w-full flex items-center justify-center">
                <PopcornText
                  wordsConfig={MOBILE_ROW2_WORDS}
                  font={MOBILE_FONT}
                  startY={30}
                  startScale={0}
                  startOpacity={0}
                  rotationRange={20}
                  stagger={0.055}
                  transition={POPCORN_SPRING_TRANSITION}
                  charIndexOffset={4}
                  totalCharsOverall={19}
                  isActive={isTextActive}
                  hasAppearedAlready={hasDashboardTextAnimatedGlobal}
                  onAnimationComplete={() => {
                    hasDashboardTextAnimatedGlobal = true;
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-6xl mx-auto flex items-center justify-center">
              <PopcornText
                wordsConfig={TOP_WORDS}
                font={DESKTOP_FONT}
                startY={30}
                startScale={0}
                startOpacity={0}
                rotationRange={20}
                stagger={0.055}
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
          )}
        </div>

        {/* Bottom Split Group: "AWAITS" + Subtitle & Device Pills (Mobile) -> moves down and out of view */}
        <div
          className="w-full flex flex-col items-center justify-center transition-transform duration-75 will-change-transform mt-1 sm:mt-4 md:mt-6"
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
              stagger={0.055}
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

          {isMobile && (
            <div className="flex flex-col items-center mt-4 px-2">
              <div className="w-10 h-[2px] bg-[#FF5500] rounded-full mb-3.5" />
              <p className="text-[12.5px] text-slate-600 leading-[1.55] max-w-[295px] text-center font-medium">
                Real-time respiratory telemetry, guided session feedback, and clinical progress tracking across all your devices.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-white/85 border border-slate-200/90 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
                  <span className="text-[9.5px] font-bold tracking-[0.08em] text-slate-800 uppercase">
                    Web Command Center
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-white/85 border border-slate-200/90 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
                  <span className="text-[9.5px] font-bold tracking-[0.08em] text-slate-800 uppercase">
                    Mobile Companion
                  </span>
                </div>
              </div>
              <div className="w-[1px] h-8 bg-gradient-to-t from-transparent to-[#FF5500]/40 mt-3" />
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* LAYER 2: DESKTOP DASHBOARD MOCKUP + ANIMATED CALLOUT POINTERS         */}
      {/* ===================================================================== */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-3 sm:px-6 md:px-10 pt-[56px] sm:pt-16 md:pt-20 pb-2 sm:pb-4"
        style={{
          opacity: desktopOpacity,
          pointerEvents: splitEase >= 0.85 && phoneT < 0.2 ? 'auto' : 'none',
        }}
      >
        {/* ================================================================= */}
        {/* MOBILE PORTRAIT LAYOUT FOR DESKTOP DASHBOARD VIEW (< 768px)       */}
        {/* REDESIGNED MATCHING REFERENCE DESIGN (FULL HEIGHT, BALANCED PADDING) */}
        {/* ================================================================= */}
        <div
          className="flex md:hidden flex-col justify-between items-center w-full max-w-[430px] h-full mx-auto will-change-transform pt-1 pb-3 px-1 xs:px-2 relative pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          style={{
            filter: desktopBlur > 0.1 ? `blur(${desktopBlur.toFixed(2)}px)` : undefined,
          }}
        >
          {/* TOP SECTION: Kicker, Headline, Subtitle, Indicators + Top 2 Cards */}
          <div className="w-full flex flex-col items-center shrink-0 z-20">
            {/* Kicker, 2-Line Headline & Subtitle */}
            <div className="flex flex-col items-center text-center pb-1.5 px-2">
              <div className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full bg-white border border-[#FF5500]/50 shadow-[0_2px_8px_rgba(255,85,0,0.06)] mb-1.5">
                <span className="text-[9.5px] xs:text-[10px] font-bold tracking-[0.16em] text-[#FF5500] uppercase">
                  DESKTOP WEB PORTAL
                </span>
              </div>
              <h3 className="text-[22px] xs:text-[25px] font-black tracking-[-0.03em] leading-[1.08] text-[#0A1118]">
                Personalised
                <span className="block text-[#FF4800]">Command Center</span>
              </h3>
              <p className="text-[11px] xs:text-[12px] text-[#5A6578] font-normal leading-[1.32] max-w-[310px] mt-1">
                A powerful desktop portal to track, understand and improve your respiratory performance.
              </p>
              {/* Dual accent indicators matching reference */}
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <div className="w-5 h-[2.5px] bg-[#FF4800] rounded-full" />
                <div className="w-5 h-[2.5px] bg-[#FFD8BE] rounded-full" />
              </div>
            </div>

            {/* Top 2 Callout Cards (Personalised Dashboard & Real-Time Lung Metrics) */}
            <div className="grid grid-cols-2 gap-2.5 xs:gap-3 w-full mt-1.5">
              {/* Top-Left Card */}
              <div className="rounded-2xl bg-white backdrop-blur-md border border-white/80 p-2.5 xs:p-3 shadow-[0_6px_20px_rgba(0,0,0,0.05)] flex items-start gap-2 xs:gap-2.5">
                <div className="w-8 h-8 xs:w-9 xs:h-9 rounded-xl bg-[#FFF1E8] flex items-center justify-center shrink-0">
                  <GridDashboardIcon />
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-start">
                  <h4 className="text-[#0A1118] font-black text-[10px] xs:text-[11px] uppercase tracking-[0.01em] leading-[1.16]">
                    PERSONALISED
                    <br />
                    <span className="text-[#FF4800]">DASHBOARD</span>
                  </h4>
                  <div className="w-5 h-[2px] bg-[#FF4800] my-1 rounded-full" />
                  <p className="text-[#4B5563] text-[9px] xs:text-[10px] leading-[1.32] font-normal">
                    Get a complete view of your lung health and progress.
                  </p>
                </div>
              </div>

              {/* Top-Right Card */}
              <div className="rounded-2xl bg-white backdrop-blur-md border border-white/80 p-2.5 xs:p-3 shadow-[0_6px_20px_rgba(0,0,0,0.05)] flex items-start gap-2 xs:gap-2.5">
                <div className="w-8 h-8 xs:w-9 xs:h-9 rounded-xl bg-[#FFF1E8] flex items-center justify-center shrink-0">
                  <LungsHealthIcon />
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-start">
                  <h4 className="text-[#0A1118] font-black text-[10px] xs:text-[11px] uppercase tracking-[0.01em] leading-[1.16]">
                    REAL-TIME
                    <br />
                    <span className="text-[#FF4800]">LUNG METRICS</span>
                  </h4>
                  <div className="w-5 h-[2px] bg-[#FF4800] my-1 rounded-full" />
                  <p className="text-[#4B5563] text-[9px] xs:text-[10px] leading-[1.32] font-normal">
                    Monitor your respiratory data instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER SECTION: Desktop Monitor + Halo + Bezel/Chin Connectors */}
          <div className="flex-1 w-full min-h-[220px] max-h-[400px] xs:max-h-[440px] relative flex items-center justify-center my-0.5 shrink min-w-0">
            {/* Concentric Soft Warm Peach Disk behind Monitor (Matches Reference) */}
            <div className="absolute w-[92%] aspect-square rounded-full bg-[#FFE7D6]/50 border border-[#FF5500]/[0.08] pointer-events-none -z-10 flex items-center justify-center">
              <div className="w-[80%] aspect-square rounded-full bg-[#FFDEC9]/40" />
            </div>

            {/* Ambient Warm Theme-Orange Backlight Glow behind Monitor */}
            <div
              className="absolute inset-x-[10%] inset-y-[10%] rounded-full pointer-events-none -z-10"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(255, 105, 0, 0.26) 0%, rgba(255, 105, 0, 0.08) 56%, transparent 74%)',
                filter: 'blur(22px)',
              }}
            />

            {/* Monitor Mockup Wrapper with Synchronized SVG Overlay */}
            <div
              className="relative z-10 w-[92%] max-w-[360px] aspect-[360/240] flex items-center justify-center will-change-transform"
              style={{
                transform: phoneEase > 0.02 ? `scale(${1 - 0.25 * phoneEase})` : undefined,
              }}
            >
              <img
                src="/images/dashboard/desktop-mockup.png"
                alt="Iron Lung User Dashboard Desktop Mockup"
                className="w-full h-full object-contain block select-none pointer-events-none drop-shadow-[0_16px_32px_rgba(0,0,0,0.16)] drop-shadow-[0_6px_14px_rgba(255,105,0,0.10)]"
              />

              {/* SVG Foreground Pointer Lines & Target Dots locked to monitor coordinates (viewBox 0 0 360 240) */}
              <svg
                viewBox="0 0 360 240"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
              >
                {/* 1. Top-Left Connector: from bottom of Card 1 down to (12, 0) then to dot at (22, 18) */}
                <path
                  d="M 12 -28 L 12 0 L 22 18"
                  fill="none"
                  stroke="#FF4800"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* 2. Top-Right Connector: from bottom of Card 2 down to (348, 0) then to dot at (338, 18) */}
                <path
                  d="M 348 -28 L 348 0 L 338 18"
                  fill="none"
                  stroke="#FF4800"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* 3. Bottom-Left Connector: from dot at (22, 186) to (12, 204) then down to top of Card 3 */}
                <path
                  d="M 22 186 L 12 204 L 12 268"
                  fill="none"
                  stroke="#FF4800"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* 4. Bottom-Right Connector: from dot at (338, 186) to (348, 204) then down to top of Card 4 */}
                <path
                  d="M 338 186 L 348 204 L 348 268"
                  fill="none"
                  stroke="#FF4800"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Pulsing Target Dots on Monitor Bezel Corners matching reference */}
                {[
                  { cx: 22, cy: 18, delay: 0.02 },
                  { cx: 338, cy: 18, delay: 0.08 },
                  { cx: 22, cy: 186, delay: 0.14 },
                  { cx: 338, cy: 186, delay: 0.20 },
                ].map((dot, idx) => (
                  <g key={idx}>
                    <motion.circle
                      cx={dot.cx}
                      cy={dot.cy}
                      r="6.5"
                      fill="none"
                      stroke="#FF4800"
                      strokeWidth="1.5"
                      initial={{ r: 6.5, opacity: 0.75 }}
                      animate={{ r: 13, opacity: 0 }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        delay: dot.delay + 0.3,
                        ease: 'easeOut',
                      }}
                    />
                    <g>
                      <circle cx={dot.cx} cy={dot.cy} r="6.5" fill="#FF4800" />
                      <circle cx={dot.cx} cy={dot.cy} r="2.8" fill="#FFFFFF" />
                    </g>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* BOTTOM SECTION: Bottom 2 Callout Cards (Grouped at Bottom) */}
          <div className="w-full shrink-0 z-20 pb-1">
            <div className="grid grid-cols-2 gap-2.5 xs:gap-3 w-full">
              {/* Bottom-Left Card */}
              <div className="rounded-2xl bg-white backdrop-blur-md border border-white/80 p-2.5 xs:p-3 shadow-[0_6px_20px_rgba(0,0,0,0.05)] flex items-start gap-2 xs:gap-2.5">
                <div className="w-8 h-8 xs:w-9 xs:h-9 rounded-xl bg-[#FFF1E8] flex items-center justify-center shrink-0">
                  <BarChartScoreIcon />
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-start">
                  <h4 className="text-[#0A1118] font-black text-[10px] xs:text-[11px] uppercase tracking-[0.01em] leading-[1.16]">
                    TRACK YOUR
                    <br />
                    <span className="text-[#FF4800]">LUNG SCORE</span>
                  </h4>
                  <div className="w-5 h-[2px] bg-[#FF4800] my-1 rounded-full" />
                  <p className="text-[#4B5563] text-[9px] xs:text-[10px] leading-[1.32] font-normal">
                    Visualize your progress and improvements over time.
                  </p>
                </div>
              </div>

              {/* Bottom-Right Card */}
              <div className="rounded-2xl bg-white backdrop-blur-md border border-white/80 p-2.5 xs:p-3 shadow-[0_6px_20px_rgba(0,0,0,0.05)] flex items-start gap-2 xs:gap-2.5">
                <div className="w-8 h-8 xs:w-9 xs:h-9 rounded-xl bg-[#FFF1E8] flex items-center justify-center shrink-0">
                  <BarChartScoreIcon />
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-start">
                  <h4 className="text-[#0A1118] font-black text-[10px] xs:text-[11px] uppercase tracking-[0.01em] leading-[1.16]">
                    TRAIN AT
                    <br />
                    <span className="text-[#FF4800]">YOUR OWN PACE</span>
                  </h4>
                  <div className="w-5 h-[2px] bg-[#FF4800] my-1 rounded-full" />
                  <p className="text-[#4B5563] text-[9px] xs:text-[10px] leading-[1.32] font-normal">
                    Personalized workout plans for better respiratory health.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle Ambient Golden-Orange Flowing Waves at Bottom (Matches Reference) */}
          <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none -z-10 overflow-hidden opacity-55">
            <svg viewBox="0 0 458 120" preserveAspectRatio="none" className="w-full h-full">
              <path d="M -40 70 C 80 130, 180 40, 280 100 C 370 155, 430 75, 500 90" fill="none" stroke="#FF7A30" strokeWidth="1.2" opacity="0.35" />
              <path d="M -40 85 C 90 145, 190 55, 290 115 C 380 170, 440 90, 500 105" fill="none" stroke="#FF5500" strokeWidth="1" opacity="0.25" />
              <path d="M -40 100 C 70 155, 170 70, 270 128 C 360 180, 420 105, 500 120" fill="none" stroke="#FFA060" strokeWidth="0.8" opacity="0.2" />
            </svg>
          </div>
        </div>

        {/* ================================================================= */}
        {/* DESKTOP & TABLET LANDSCAPE STAGE (>= 768px — 100% UNCHANGED)      */}
        {/* ================================================================= */}
        <div
          className="hidden md:flex relative items-center justify-center will-change-transform mx-auto"
          style={{
            width: 'min(95vw, 1380px, calc((100vh - 6.5rem) * 1024 / 484))',
            aspectRatio: '1024 / 484',
            containerType: 'inline-size',
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
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
          >
            {/* 1. Top-Left Pointer Line: extends all the way to the left edge of the heading (x=79) */}
            <motion.path
              d="M 328 146 L 238 146 L 205 117 L 79 117"
              fill="none"
              stroke="#FF5500"
              strokeWidth="1.25"
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

            {/* 2. Bottom-Left Pointer Line: extends all the way to the left edge of the heading (x=79) */}
            <motion.path
              d="M 306 313 L 252 313 L 238 301 L 79 301"
              fill="none"
              stroke="#FF5500"
              strokeWidth="1.25"
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

            {/* 3. Top-Right Pointer Line: (682, 165) -> (756, 165) -> (804, 117) -> (858, 117) */}
            <motion.path
              d="M 682 165 L 756 165 L 804 117 L 858 117"
              fill="none"
              stroke="#FF5500"
              strokeWidth="1.25"
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
            {/* Top-Right Title Short Accent Line directly underneath heading (x=871..916, y=117) */}
            <motion.line
              x1="871"
              y1="117"
              x2="916"
              y2="117"
              stroke="#FF5500"
              strokeWidth="1.25"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                arePointersActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.35, delay: 0.38, ease: 'easeOut' }}
            />

            {/* 4. Bottom-Right Pointer Line: (736, 276) -> (768, 276) -> (807, 301) -> (858, 301) */}
            <motion.path
              d="M 736 276 L 768 276 L 807 301 L 858 301"
              fill="none"
              stroke="#FF5500"
              strokeWidth="1.25"
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
            {/* Bottom-Right Title Short Accent Line directly underneath heading (x=871..916, y=301) */}
            <motion.line
              x1="871"
              y1="301"
              x2="916"
              y2="301"
              stroke="#FF5500"
              strokeWidth="1.25"
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
                    r="4.8"
                    fill="none"
                    stroke="#FF5500"
                    strokeWidth="1.15"
                    initial={{ r: 4.5, opacity: 0.7 }}
                    animate={{ r: 11.5, opacity: 0 }}
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
                  <circle cx={dot.cx} cy={dot.cy} r="4.3" fill="#FF5500" />
                  <circle cx={dot.cx} cy={dot.cy} r="1.7" fill="#FFFFFF" />
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
              left: '3.45%',
              top: '15.8%',
              width: '19.531%',
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
            <div className="flex items-center gap-[6.0%]">
              <div className="w-[15.5%] aspect-square rounded-[22%] bg-[#F7E8DE] flex items-center justify-center shrink-0 shadow-sm">
                <GridDashboardIcon />
              </div>
              <div className="flex-1 min-w-0 flex items-center">
                <h4
                  className="text-[#FF5500] font-bold uppercase tracking-[0.02em] leading-[1.18] whitespace-nowrap"
                  style={{ fontSize: '1.18cqw' }}
                >
                  PERSONALISED
                  <br />
                  DASHBOARD
                </h4>
              </div>
            </div>
          </motion.div>

          {/* 2. BOTTOM-LEFT: TRACK YOUR LUNG SCORE */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{
              left: '3.45%',
              top: '53.8%',
              width: '19.531%',
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
            <div className="flex items-center gap-[6.0%]">
              <div className="w-[15.5%] aspect-square rounded-[22%] bg-[#F7E8DE] flex items-center justify-center shrink-0 shadow-sm">
                <BarChartScoreIcon />
              </div>
              <div className="flex-1 min-w-0 flex items-center">
                <h4
                  className="text-[#FF5500] font-bold uppercase tracking-[0.02em] leading-[1.18] whitespace-nowrap"
                  style={{ fontSize: '1.18cqw' }}
                >
                  TRACK YOUR
                  <br />
                  LUNG SCORE
                </h4>
              </div>
            </div>
          </motion.div>

          {/* 3. TOP-RIGHT: REAL-TIME LUNG HEALTH METRICS */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{
              left: '80.75%',
              top: '15.8%',
              width: '19.531%',
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
            <div className="flex items-center gap-[6.0%]">
              <div className="w-[15.5%] aspect-square rounded-[22%] bg-[#F7E8DE] flex items-center justify-center shrink-0 shadow-sm">
                <LungsHealthIcon />
              </div>
              <div className="flex-1 min-w-0 flex items-center">
                <h4
                  className="text-[#FF5500] font-bold uppercase tracking-[0.02em] leading-[1.18] whitespace-nowrap"
                  style={{ fontSize: '1.18cqw' }}
                >
                  REAL-TIME
                  <br />
                  LUNG HEALTH METRICS
                </h4>
              </div>
            </div>
          </motion.div>

          {/* 4. BOTTOM-RIGHT: TRAIN AT YOUR OWN PACE */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{
              left: '80.75%',
              top: '53.8%',
              width: '19.531%',
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
            <div className="flex items-center gap-[6.0%]">
              <div className="w-[15.5%] aspect-square rounded-[22%] bg-[#F7E8DE] flex items-center justify-center shrink-0 shadow-sm">
                <BarChartScoreIcon />
              </div>
              <div className="flex-1 min-w-0 flex items-center">
                <h4
                  className="text-[#FF5500] font-bold uppercase tracking-[0.02em] leading-[1.18] whitespace-nowrap"
                  style={{ fontSize: '1.18cqw' }}
                >
                  TRAIN AT
                  <br />
                  YOUR OWN PACE
                </h4>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* LAYER 3: THE PHONE MOCKUP + ANIMATED CALLOUT POINTERS                 */}
      {/* (Slides up from bottom as Desktop zooms out, then animates pointers)  */}
      {/* ===================================================================== */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[15] px-3 sm:px-6 md:px-10 pt-[58px] sm:pt-16 md:pt-20 pb-2 sm:pb-4"
        style={{
          opacity: phoneOpacity,
          pointerEvents: phoneEase >= 0.85 ? 'auto' : 'none',
        }}
      >
        {/* ================================================================= */}
        {/* MOBILE PORTRAIT LAYOUT FOR PHONE COMPANION APP VIEW (< 768px)     */}
        {/* REDESIGNED MATCHING REFERENCE DESIGN (FULL HEIGHT, BALANCED PADDING) */}
        {/* ================================================================= */}
        <div
          className="flex md:hidden flex-col justify-between items-center w-full max-w-[430px] h-full mx-auto will-change-transform pt-1 pb-3 px-1 xs:px-2"
          style={{
            transform: `translateY(${phoneTranslateY}px) scale(${phoneScale})`,
          }}
        >
          {/* TOP SECTION: Kicker, Headline, Subtitle + Top 2 Cards (Grouped Together) */}
          <div className="w-full flex flex-col items-center shrink-0 z-20">
            {/* Kicker, 2-Line Headline & Subtitle */}
            <div className="flex flex-col items-center text-center pb-2 px-2">
              <div className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full bg-white border border-[#FF5500]/50 shadow-[0_2px_8px_rgba(255,85,0,0.06)] mb-1.5">
                <span className="text-[9.5px] xs:text-[10px] font-bold tracking-[0.16em] text-[#FF5500] uppercase">
                  MOBILE COMPANION APP
                </span>
              </div>
              <h3 className="text-[22px] xs:text-[25px] font-black tracking-[-0.03em] leading-[1.08] text-[#0A1118]">
                Session Reports
                <span className="block text-[#FF4800]">On The Go</span>
              </h3>
              <p className="text-[11px] xs:text-[12px] text-[#5A6578] font-normal leading-[1.32] max-w-[310px] mt-1">
                Track your progress, analyse your sessions and stay motivated — anytime, anywhere.
              </p>
            </div>

            {/* Top 2 Callout Cards (Session Details & Training Performance) */}
            <div className="grid grid-cols-2 gap-2.5 xs:gap-3 w-full">
              {/* Top-Left Card */}
              <div className="rounded-2xl bg-white backdrop-blur-md border border-white/80 p-2.5 xs:p-3 shadow-[0_6px_20px_rgba(0,0,0,0.05)] flex items-start gap-2 xs:gap-2.5">
                <div className="w-8 h-8 xs:w-9 xs:h-9 rounded-xl bg-[#FFF1E8] flex items-center justify-center shrink-0">
                  <SessionDocIcon />
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-start">
                  <h4 className="text-[#0A1118] font-black text-[10px] xs:text-[11px] uppercase tracking-[0.01em] leading-[1.16]">
                    SESSION
                    <br />
                    DETAILS
                  </h4>
                  <div className="w-5 h-[2px] bg-[#FF4800] my-1 rounded-full" />
                  <p className="text-[#4B5563] text-[9px] xs:text-[10px] leading-[1.32] font-normal">
                    View the date, time and status of your training session at a glance.
                  </p>
                </div>
              </div>

              {/* Top-Right Card */}
              <div className="rounded-2xl bg-white backdrop-blur-md border border-white/80 p-2.5 xs:p-3 shadow-[0_6px_20px_rgba(0,0,0,0.05)] flex items-start gap-2 xs:gap-2.5">
                <div className="w-8 h-8 xs:w-9 xs:h-9 rounded-xl bg-[#FFF1E8] flex items-center justify-center shrink-0">
                  <SolidBarChartIcon />
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-start">
                  <h4 className="text-[#0A1118] font-black text-[10px] xs:text-[11px] uppercase tracking-[0.01em] leading-[1.16]">
                    TRAINING
                    <br />
                    PERFORMANCE
                  </h4>
                  <div className="w-5 h-[2px] bg-[#FF4800] my-1 rounded-full" />
                  <p className="text-[#4B5563] text-[9px] xs:text-[10px] leading-[1.32] font-normal">
                    Check session duration, achieved volume and target completion live.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER SECTION: Prominent Phone Mockup + Concentric Halo Rings + SVG Pointer Lines & Target Dots */}
          <div className="flex-1 w-full min-h-[220px] max-h-[420px] xs:max-h-[460px] relative flex items-center justify-center my-1 shrink min-w-0">
            {/* Ambient Warm Theme-Orange Backlight Glow behind Phone */}
            <div
              className="absolute inset-x-[16%] inset-y-[8%] rounded-full pointer-events-none -z-10"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(255, 105, 0, 0.28) 0%, rgba(255, 105, 0, 0.10) 54%, transparent 76%)',
                filter: 'blur(24px)',
                opacity: phoneEase,
              }}
            />

            {/* Warm Elliptical Floor Shadow beneath Phone */}
            <div
              className="absolute left-[24%] right-[24%] bottom-[2%] h-[6%] rounded-full pointer-events-none -z-10"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(235, 85, 15, 0.34) 0%, rgba(255, 105, 0, 0.12) 54%, transparent 78%)',
                filter: 'blur(8px)',
                opacity: phoneEase,
              }}
            />

            {/* Centered Phone Mockup (Fills available center height) */}
            <div className="relative z-10 h-full max-h-[96%] aspect-[9/18.8] flex items-center justify-center">
              <img
                src="/images/dashboard/phone-mockup.png"
                alt="Iron Lung Mobile App Session Report Mockup"
                className="w-full h-full object-contain block select-none pointer-events-none drop-shadow-[0_16px_30px_rgba(0,0,0,0.18)] drop-shadow-[0_4px_12px_rgba(255,105,0,0.12)]"
              />
            </div>

            {/* SVG Concentric Warm Radar Rings behind Phone (viewBox 0 0 360 280) */}
            <svg
              viewBox="0 0 360 280"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
            >
              <circle
                cx="180"
                cy="140"
                r="82"
                fill="rgba(255, 206, 172, 0.28)"
                stroke="rgba(255, 95, 20, 0.14)"
                strokeWidth="1"
              />
              <circle
                cx="180"
                cy="140"
                r="114"
                fill="rgba(255, 220, 194, 0.20)"
                stroke="rgba(255, 95, 20, 0.12)"
                strokeWidth="1"
              />
              <circle
                cx="180"
                cy="140"
                r="142"
                fill="rgba(255, 232, 214, 0.14)"
                stroke="rgba(255, 95, 20, 0.22)"
                strokeWidth="1.1"
                strokeDasharray="4 5"
              />
            </svg>

            {/* SVG Foreground Pointer Lines & Target Dots matching reference (viewBox 0 0 360 280) */}
            <svg
              viewBox="0 0 360 280"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
            >
              {/* 1. Top-Left Connector: from bottom of Card 1 (46, 0) down to (46, 32) then to dot at (90, 75) */}
              <path
                d="M 46 0 L 46 32 L 90 75"
                fill="none"
                stroke="#FF4800"
                strokeWidth="1.6"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* 2. Top-Right Connector: from bottom of Card 2 (314, 0) down to (314, 32) then to dot at (270, 75) */}
              <path
                d="M 314 0 L 314 32 L 270 75"
                fill="none"
                stroke="#FF4800"
                strokeWidth="1.6"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* 3. Bottom-Left Connector: from dot at (90, 205) to (46, 248) then down to top of Card 3 (46, 280) */}
              <path
                d="M 90 205 L 46 248 L 46 280"
                fill="none"
                stroke="#FF4800"
                strokeWidth="1.6"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* 4. Bottom-Right Connector: from dot at (270, 205) to (314, 248) then down to top of Card 4 (314, 280) */}
              <path
                d="M 270 205 L 314 248 L 314 280"
                fill="none"
                stroke="#FF4800"
                strokeWidth="1.6"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Pulsing Target Dots on Phone Screen & Bezel matching reference */}
              {[
                { cx: 90, cy: 75, delay: 0.02 },
                { cx: 270, cy: 75, delay: 0.08 },
                { cx: 90, cy: 205, delay: 0.14 },
                { cx: 270, cy: 205, delay: 0.20 },
              ].map((dot, idx) => (
                <g key={idx}>
                  <motion.circle
                    cx={dot.cx}
                    cy={dot.cy}
                    r="6.5"
                    fill="none"
                    stroke="#FF4800"
                    strokeWidth="1.5"
                    initial={{ r: 6.5, opacity: 0.75 }}
                    animate={{ r: 13, opacity: 0 }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: dot.delay + 0.3,
                      ease: 'easeOut',
                    }}
                  />
                  <g>
                    <circle cx={dot.cx} cy={dot.cy} r="6.5" fill="#FF4800" />
                    <circle cx={dot.cx} cy={dot.cy} r="2.8" fill="#FFFFFF" />
                  </g>
                </g>
              ))}
            </svg>
          </div>

          {/* BOTTOM SECTION: Bottom 2 Callout Cards (Grouped at Bottom) */}
          <div className="grid grid-cols-2 gap-2.5 xs:gap-3 w-full shrink-0 z-20 pb-0.5">
            {/* Bottom-Left Card */}
            <div className="rounded-2xl bg-white backdrop-blur-md border border-white/80 p-2.5 xs:p-3 shadow-[0_6px_20px_rgba(0,0,0,0.05)] flex items-start gap-2 xs:gap-2.5">
              <div className="w-8 h-8 xs:w-9 xs:h-9 rounded-xl bg-[#FFF1E8] flex items-center justify-center shrink-0">
                <LungsHealthIcon />
              </div>
              <div className="flex-1 min-w-0 flex flex-col items-start">
                <h4 className="text-[#0A1118] font-black text-[10px] xs:text-[11px] uppercase tracking-[0.01em] leading-[1.16]">
                  VISUAL BREATHING
                  <br />
                  FEEDBACK
                </h4>
                <div className="w-5 h-[2px] bg-[#FF4800] my-1 rounded-full" />
                <p className="text-[#4B5563] text-[9px] xs:text-[10px] leading-[1.32] font-normal">
                  See your breathing pattern with clear visual insights and real-time feedback.
                </p>
              </div>
            </div>

            {/* Bottom-Right Card */}
            <div className="rounded-2xl bg-white backdrop-blur-md border border-white/80 p-2.5 xs:p-3 shadow-[0_6px_20px_rgba(0,0,0,0.05)] flex items-start gap-2 xs:gap-2.5">
              <div className="w-8 h-8 xs:w-9 xs:h-9 rounded-xl bg-[#FFF1E8] flex items-center justify-center shrink-0">
                <SaveReportDownloadIcon />
              </div>
              <div className="flex-1 min-w-0 flex flex-col items-start">
                <h4 className="text-[#0A1118] font-black text-[10px] xs:text-[11px] uppercase tracking-[0.01em] leading-[1.16]">
                  SAVE YOUR
                  <br />
                  PROGRESS
                </h4>
                <div className="w-5 h-[2px] bg-[#FF4800] my-1 rounded-full" />
                <p className="text-[#4B5563] text-[9px] xs:text-[10px] leading-[1.32] font-normal">
                  All your session data is saved securely so you can track your improvement over time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* DESKTOP & TABLET LANDSCAPE STAGE (>= 768px — 100% UNCHANGED)      */}
        {/* ================================================================= */}
        <div
          className="hidden md:flex relative items-center justify-center will-change-transform mx-auto"
          style={{
            width: 'min(95vw, 1380px, calc((100vh - 6.5rem) * 1024 / 485))',
            aspectRatio: '1024 / 485',
            containerType: 'inline-size',
            transform: `translateY(${phoneTranslateY}px) scale(${phoneScale})`,
          }}
        >
          {/* Ambient Warm Theme-Orange Backlight Glow behind Phone */}
          <div
            className="absolute left-[31%] right-[31%] top-[12%] bottom-[12%] rounded-full pointer-events-none -z-10"
            style={{
              background:
                'radial-gradient(circle at center, rgba(255, 105, 0, 0.30) 0%, rgba(255, 105, 0, 0.12) 48%, transparent 72%)',
              filter: 'blur(32px)',
              opacity: phoneEase,
            }}
          />

          {/* Warm Elliptical Floor Shadow/Glow beneath the Phone */}
          <div
            className="absolute left-[33%] right-[33%] bottom-[3.2%] h-[4.5%] rounded-full pointer-events-none -z-10"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(235, 85, 15, 0.38) 0%, rgba(255, 105, 0, 0.14) 52%, transparent 78%)',
              filter: 'blur(10px)',
              opacity: phoneEase,
            }}
          />

          {/* Centered Phone Mockup locked to 1024x485 stage coordinates */}
          <div
            className="absolute z-10"
            style={{
              left: '39.65%',
              top: '3.92%',
              width: '20.70%',
              height: '89.69%',
            }}
          >
            <img
              src="/images/dashboard/phone-mockup.png"
              alt="Iron Lung Mobile App Session Report Mockup"
              className="w-full h-full object-contain block select-none pointer-events-none"
              style={{
                filter:
                  'drop-shadow(0 24px 38px rgba(0, 0, 0, 0.18)) drop-shadow(0 8px 18px rgba(255, 105, 0, 0.12))',
              }}
            />
          </div>

          {/* ================================================================= */}
          {/* SVG CONCENTRIC RINGS, POINTER LINES & TARGET DOTS (1024 x 485)    */}
          {/* ================================================================= */}
          <svg
            viewBox="0 0 1024 485"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
          >
            {/* Concentric Radar Rings behind Phone (centered at 512, 242) */}
            <motion.circle
              cx="512"
              cy="242"
              r="128"
              fill="none"
              stroke="rgba(255, 95, 20, 0.16)"
              strokeWidth="1"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={
                arePhonePointersActive
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0.85, opacity: 0 }
              }
              transition={{ duration: 0.6, delay: 0.02, ease: 'easeOut' }}
              style={{ transformOrigin: '512px 242px' }}
            />
            <motion.circle
              cx="512"
              cy="242"
              r="158"
              fill="none"
              stroke="rgba(255, 95, 20, 0.12)"
              strokeWidth="1"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={
                arePhonePointersActive
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0.85, opacity: 0 }
              }
              transition={{ duration: 0.65, delay: 0.08, ease: 'easeOut' }}
              style={{ transformOrigin: '512px 242px' }}
            />
            <motion.circle
              cx="512"
              cy="242"
              r="186"
              fill="none"
              stroke="rgba(255, 95, 20, 0.22)"
              strokeWidth="1.1"
              strokeDasharray="4 5"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={
                arePhonePointersActive
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0.88, opacity: 0 }
              }
              transition={{ duration: 0.7, delay: 0.14, ease: 'easeOut' }}
              style={{ transformOrigin: '512px 242px' }}
            />

            {/* 1. Top-Left Pointer Line: (409, 98) -> (371, 83) -> (288, 83) */}
            <motion.path
              d="M 409 98 L 371 83 L 288 83"
              fill="none"
              stroke="#FF5500"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                arePhonePointersActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
            />
            {/* Top-Left Heading Short Underline (x=154..198, y=94) */}
            <motion.line
              x1="154"
              y1="94"
              x2="198"
              y2="94"
              stroke="#FF5500"
              strokeWidth="1.25"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                arePhonePointersActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.35, delay: 0.32, ease: 'easeOut' }}
            />

            {/* 2. Bottom-Left Pointer Line: (445, 313) -> (326, 313) */}
            <motion.path
              d="M 445 313 L 326 313"
              fill="none"
              stroke="#FF5500"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                arePhonePointersActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.5, delay: 0.18, ease: 'easeOut' }}
            />
            {/* Bottom-Left Heading Short Underline (x=122..166, y=313) */}
            <motion.line
              x1="122"
              y1="313"
              x2="166"
              y2="313"
              stroke="#FF5500"
              strokeWidth="1.25"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                arePhonePointersActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.35, delay: 0.40, ease: 'easeOut' }}
            />

            {/* 3. Top-Right Pointer Line: (517, 175) -> (657, 175) -> (709, 127) -> (745, 127) */}
            <motion.path
              d="M 517 175 L 657 175 L 709 127 L 745 127"
              fill="none"
              stroke="#FF5500"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                arePhonePointersActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.55, delay: 0.13, ease: 'easeOut' }}
            />
            {/* Top-Right Heading Short Underline (x=801..845, y=127) */}
            <motion.line
              x1="801"
              y1="127"
              x2="845"
              y2="127"
              stroke="#FF5500"
              strokeWidth="1.25"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                arePhonePointersActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.35, delay: 0.36, ease: 'easeOut' }}
            />

            {/* 4. Bottom-Right Pointer Line: (594, 238) -> (620, 254) -> (713, 254) -> (749, 295) -> (764, 295) */}
            <motion.path
              d="M 594 238 L 620 254 L 713 254 L 749 295 L 764 295"
              fill="none"
              stroke="#FF5500"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                arePhonePointersActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.55, delay: 0.23, ease: 'easeOut' }}
            />
            {/* Bottom-Right Heading Short Underline (x=820..864, y=305) */}
            <motion.line
              x1="820"
              y1="305"
              x2="864"
              y2="305"
              stroke="#FF5500"
              strokeWidth="1.25"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                arePhonePointersActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.35, delay: 0.44, ease: 'easeOut' }}
            />

            {/* Target Dots with Sonar Pulse Rings & White Halo */}
            {[
              { cx: 409, cy: 98, delay: 0.02 },
              { cx: 445, cy: 313, delay: 0.12 },
              { cx: 517, cy: 175, delay: 0.07 },
              { cx: 594, cy: 238, delay: 0.17 },
            ].map((dot, idx) => (
              <g key={idx}>
                {/* Radiating Sonar Pulse Ring */}
                {arePhonePointersActive && (
                  <motion.circle
                    cx={dot.cx}
                    cy={dot.cy}
                    r="4.8"
                    fill="none"
                    stroke="#FF5500"
                    strokeWidth="1.15"
                    initial={{ r: 4.5, opacity: 0.7 }}
                    animate={{ r: 11.5, opacity: 0 }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: dot.delay + 0.3,
                      ease: 'easeOut',
                    }}
                  />
                )}
                {/* Soft White Outer Halo + Orange Ring + White Core */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={
                    arePhonePointersActive
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
                  <circle cx={dot.cx} cy={dot.cy} r="6.2" fill="rgba(255, 255, 255, 0.85)" />
                  <circle cx={dot.cx} cy={dot.cy} r="4.3" fill="#FF5500" />
                  <circle cx={dot.cx} cy={dot.cy} r="1.7" fill="#FFFFFF" />
                </motion.g>
              </g>
            ))}
          </svg>

          {/* ================================================================= */}
          {/* 4 ANIMATED PHONE CALLOUT BLOCKS (Locked to 1024x485 coords)       */}
          {/* ================================================================= */}

          {/* 1. TOP-LEFT: SESSION DETAILS */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{
              left: '10.65%',
              top: '13.6%',
              width: '20.996%',
            }}
            initial={{ opacity: 0, x: -16, y: 6 }}
            animate={
              arePhonePointersActive
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, x: -16, y: 6 }
            }
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
              delay: 0.20,
            }}
          >
            <div className="flex items-start gap-[6.0%]">
              <div className="w-[14.5%] aspect-square rounded-[22%] bg-[#F7E8DE] flex items-center justify-center shrink-0 shadow-sm">
                <CalendarSessionIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="text-[#FF5500] font-bold uppercase tracking-[0.02em] leading-[1.16] whitespace-nowrap"
                  style={{ fontSize: '1.18cqw' }}
                >
                  SESSION DETAILS
                </h4>
                <p
                  className="text-[#23272F] font-normal leading-[1.42] mt-[17%] whitespace-nowrap"
                  style={{ fontSize: '1.04cqw' }}
                >
                  View the date, time and
                  <br />
                  status of your training
                  <br />
                  session at a glance.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2. BOTTOM-LEFT: VISUAL BREATHING FEEDBACK */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{
              left: '7.52%',
              top: '58.8%',
              width: '24.512%',
            }}
            initial={{ opacity: 0, x: -16, y: 6 }}
            animate={
              arePhonePointersActive
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, x: -16, y: 6 }
            }
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
              delay: 0.30,
            }}
          >
            <div className="flex items-start gap-[5.5%]">
              <div className="w-[12.4%] aspect-square rounded-[22%] bg-[#F7E8DE] flex items-center justify-center shrink-0 shadow-sm">
                <LungsHealthIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="text-[#FF5500] font-bold uppercase tracking-[0.02em] leading-[1.16] whitespace-nowrap"
                  style={{ fontSize: '1.18cqw' }}
                >
                  VISUAL BREATHING FEEDBACK
                </h4>
                <p
                  className="text-[#23272F] font-normal leading-[1.42] mt-[15%] whitespace-nowrap"
                  style={{ fontSize: '1.04cqw' }}
                >
                  See your lung capacity
                  <br />
                  visualised and follow guided
                  <br />
                  inhale and exhale sessions.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 3. TOP-RIGHT: TRAINING PERFORMANCE */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{
              left: '73.8%',
              top: '20.7%',
              width: '22.461%',
            }}
            initial={{ opacity: 0, x: 16, y: 6 }}
            animate={
              arePhonePointersActive
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, x: 16, y: 6 }
            }
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
              delay: 0.25,
            }}
          >
            <div className="flex items-start gap-[6.0%]">
              <div className="w-[13.5%] aspect-square rounded-[22%] bg-[#F7E8DE] flex items-center justify-center shrink-0 shadow-sm">
                <SolidBarChartIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="text-[#FF5500] font-bold uppercase tracking-[0.02em] leading-[1.16] whitespace-nowrap"
                  style={{ fontSize: '1.18cqw' }}
                >
                  TRAINING PERFORMANCE
                </h4>
                <p
                  className="text-[#23272F] font-normal leading-[1.42] mt-[16%] whitespace-nowrap"
                  style={{ fontSize: '1.04cqw' }}
                >
                  Check your session duration,
                  <br />
                  achieved volume and target
                  <br />
                  completion in real time.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 4. BOTTOM-RIGHT: SAVE YOUR PROGRESS */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{
              left: '75.68%',
              top: '57.2%',
              width: '21.484%',
            }}
            initial={{ opacity: 0, x: 16, y: 6 }}
            animate={
              arePhonePointersActive
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, x: 16, y: 6 }
            }
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
              delay: 0.35,
            }}
          >
            <div className="flex items-start gap-[6.36%]">
              <div className="w-[14.1%] aspect-square rounded-[22%] bg-[#F7E8DE] flex items-center justify-center shrink-0 shadow-sm">
                <PdfReportIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="text-[#FF5500] font-bold uppercase tracking-[0.02em] leading-[1.16] whitespace-nowrap"
                  style={{ fontSize: '1.18cqw' }}
                >
                  SAVE YOUR PROGRESS
                </h4>
                <p
                  className="text-[#23272F] font-normal leading-[1.42] mt-[17%] whitespace-nowrap"
                  style={{ fontSize: '1.04cqw' }}
                >
                  Download detailed session
                  <br />
                  reports to track your
                  <br />
                  improvement over time.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSectionOverlay;
