import React, { useState, useEffect } from 'react';
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
  // ---------------------------------------------------------------------------
  // 2. Text Popcorn Animation on 3D Model Exit & Subsequent Scroll Separation
  // ---------------------------------------------------------------------------
  // - When the 3D model sweeps completely out to the right (scrollProgress >= 0.920),
  //   the text "YOUR DASHBOARD AWAITS" appears with the Popcorn Text animation.
  // - It plays strictly once.
  // - After that (scrollProgress >= 0.935), "YOUR DASHBOARD" simply moves UP,
  //   "AWAITS" simply moves DOWN, and the User Dashboard image zooms in between them.
  const isModelExitRight = scrollProgress >= 0.920;
  const isTextActive = isModelExitRight;
  const isInteractive = scrollProgress >= 0.920;

  // Separation progress: begins once the text has appeared and settled (0.930 - 0.955)
  const splitT = Math.min(1, Math.max(0, (scrollProgress - 0.930) / 0.025));
  const splitEase =
    splitT < 0.5 ? 4 * splitT * splitT * splitT : 1 - Math.pow(-2 * splitT + 2, 3) / 2;

  // Distance required to guarantee complete off-screen exit beyond viewport edges
  const exitTravelDistance = windowDimensions.height * 0.52 + 180;
  const topExitOffset = splitEase * exitTravelDistance;
  const bottomExitOffset = splitEase * exitTravelDistance;
  // Keep text sharp and clearly readable as it separates, fading smoothly as it approaches viewport bounds
  const textOpacity = splitEase < 0.75 ? 1 : Math.max(0, 1 - (splitEase - 0.75) / 0.25);

  // Desktop zoom-in scale: zooms in from 0.76 up to 1.00
  const baseDesktopScale = 0.76 + 0.24 * splitEase;

  // ---------------------------------------------------------------------------
  // 3. Desktop Zoom-Out Fade & Phone Slide-Up Transition (0.968 - 0.992)
  // ---------------------------------------------------------------------------
  // As the user scrolls down past the desktop view:
  // - The desktop image fades out into the background via a "zoom-out" animation.
  // - The phone image slides up from the bottom into the center.
  const phoneT = Math.min(1, Math.max(0, (scrollProgress - 0.968) / 0.024));
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
      {/* LAYER 2: THE DESKTOP DASHBOARD MOCKUP (Zooms in, then zooms out/fades) */}
      {/* ===================================================================== */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4 sm:px-6 md:px-10 pt-16 sm:pt-20 md:pt-22 pb-4 sm:pb-6"
        style={{
          opacity: desktopOpacity,
          pointerEvents: splitEase >= 0.85 && phoneT < 0.2 ? 'auto' : 'none',
        }}
      >
        <div
          className="relative w-full max-w-5xl xl:max-w-6xl max-h-[82vh] flex items-center justify-center will-change-transform"
          style={{
            transform: `scale(${desktopScale})`,
            filter: desktopBlur > 0.1 ? `blur(${desktopBlur.toFixed(2)}px)` : undefined,
          }}
        >
          {/* Ambient Warm Theme-Orange Backlight Glow */}
          <div
            className="absolute -inset-4 sm:-inset-8 md:-inset-14 rounded-[2rem] md:rounded-[3.5rem] pointer-events-none -z-10"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255, 105, 0, 0.28) 0%, rgba(255, 105, 0, 0.10) 50%, transparent 72%)',
              filter: 'blur(42px)',
              opacity: desktopOpacity,
            }}
          />

          {/* Full Uncropped Desktop Monitor Mockup */}
          <img
            src="/images/dashboard/desktop-mockup.png"
            alt="Iron Lung User Dashboard Desktop Mockup"
            className="w-auto h-auto max-w-full max-h-[80vh] object-contain block select-none pointer-events-none"
            style={{
              filter:
                'drop-shadow(0 28px 48px rgba(0, 0, 0, 0.16)) drop-shadow(0 8px 20px rgba(255, 105, 0, 0.12))',
            }}
          />
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
