import React, { useState, useEffect } from 'react';
import { PopcornText } from './PopcornText';
import type { AnimationOptions } from 'framer-motion';

// Global single-play lifecycle guard:
// Ensures the tagline text animation plays STRICTLY ONCE at the moment
// the 3D model moves and the text appears, and never again while zooming or scrolling.
let hasDashboardTextAnimatedGlobal = false;

const POPCORN_SPRING_TRANSITION: AnimationOptions = {
  type: 'spring',
  stiffness: 380,
  damping: 18,
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
  // 2. Scroll-Driven Text Off-Screen Exit & Image Zoom Transition (0.925 - 0.965)
  // ---------------------------------------------------------------------------
  // - Popcorn Text plays strictly ONCE on section entry (0.88+)
  // - When scrollProgress <= 0.925:
  //   "YOUR DASHBOARD AWAITS" is centered, solid, and completely finished animating.
  // - As user scrolls between 0.925 and 0.965:
  //   - "YOUR DASHBOARD" accelerates UPWARDS and exits completely off-screen at the top.
  //   - "AWAITS" accelerates DOWNWARDS and exits completely off-screen at the bottom.
  //   - The User Dashboard image appears and zooms in between them (scale 0.76 -> 1.0, opacity 0 -> 1).
  // - When scrollProgress >= 0.965:
  //   Text is 100% off-screen and hidden.
  //   User Dashboard image is fully centered, uncropped, and prominent.
  const splitT = Math.min(1, Math.max(0, (scrollProgress - 0.925) / 0.045));
  const splitEase =
    splitT < 0.5 ? 4 * splitT * splitT * splitT : 1 - Math.pow(-2 * splitT + 2, 3) / 2;

  // Distance required to guarantee complete off-screen exit beyond viewport edges
  const exitTravelDistance = windowDimensions.height * 0.52 + 180;
  const topExitOffset = splitEase * exitTravelDistance;
  const bottomExitOffset = splitEase * exitTravelDistance;
  // Keep text sharp and clearly readable as it separates, fading smoothly as it approaches viewport bounds
  const textOpacity = splitEase < 0.75 ? 1 : Math.max(0, 1 - (splitEase - 0.75) / 0.25);

  // Image zoom scale: zooms in from 0.76 up to 1.00
  const imageScale = 0.76 + 0.24 * splitEase;

  // Reset only if user navigates all the way back to the very top Hero section (< 0.15)
  if (scrollProgress < 0.15) {
    hasDashboardTextAnimatedGlobal = false;
  }

  // The 3D model moves to the side and the sweep reveals the text between 0.88 and 0.925
  // Trigger the text animation specifically at the moment the 3D model moves and the text appears
  const isSweepRevealingText = scrollProgress >= 0.885;
  const isTextActive = isSweepRevealingText;
  const isInteractive = scrollProgress >= 0.92;

  // Once the text appears, mark the global flag as true so it never re-animates on subsequent scrolling/zooming
  useEffect(() => {
    if (isSweepRevealingText && !hasDashboardTextAnimatedGlobal) {
      hasDashboardTextAnimatedGlobal = true;
    }
  }, [isSweepRevealingText]);

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
          display: textOpacity > 0.005 ? 'flex' : 'none',
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
              startY={35}
              startScale={0}
              startOpacity={0}
              rotationRange={22}
              stagger={0.03}
              transition={POPCORN_SPRING_TRANSITION}
              appearTrigger="default"
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
              startY={35}
              startScale={0}
              startOpacity={0}
              rotationRange={22}
              stagger={0.03}
              transition={POPCORN_SPRING_TRANSITION}
              appearTrigger="default"
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
      {/* LAYER 2: THE USER DASHBOARD IMAGE (Appears & Zooms in between)        */}
      {/* ===================================================================== */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4 sm:px-6 md:px-10 pt-16 sm:pt-20 md:pt-22 pb-8 sm:pb-10"
        style={{
          opacity: splitEase,
          pointerEvents: splitEase >= 0.85 ? 'auto' : 'none',
        }}
      >
        <div
          className="relative w-full max-w-5xl xl:max-w-6xl max-h-[78vh] flex items-center justify-center transition-transform duration-75 will-change-transform"
          style={{
            transform: `scale(${imageScale})`,
          }}
        >
          {/* Ambient Warm Theme-Orange Backlight Glow */}
          <div
            className="absolute -inset-4 sm:-inset-8 md:-inset-14 rounded-[2rem] md:rounded-[3.5rem] pointer-events-none -z-10 transition-opacity duration-700"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255, 105, 0, 0.32) 0%, rgba(255, 105, 0, 0.12) 50%, transparent 72%)',
              filter: 'blur(42px)',
              opacity: splitEase,
            }}
          />

          {/* Full Uncropped Dashboard Mockup */}
          <div
            className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-white shadow-2xl border border-black/10 transition-transform duration-300 hover:scale-[1.008]"
            style={{
              boxShadow:
                '0 0 90px -10px rgba(255, 105, 0, 0.28), 0 25px 60px -15px rgba(0, 0, 0, 0.14), 0 10px 20px -5px rgba(0, 0, 0, 0.05)',
            }}
          >
            <img
              src="/images/dashboard/1.png"
              alt="Iron Lung User Dashboard"
              className="w-full h-auto max-h-[74vh] object-contain block select-none pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSectionOverlay;
