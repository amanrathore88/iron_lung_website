import React from 'react';
import { PopcornText } from './PopcornText';

interface DashboardSectionOverlayProps {
  scrollProgress: number; // 0.0 to 1.0 (controls reveal sweep from 0.88 to 0.98)
  onExploreDashboard?: () => void;
  onOpenVideo?: () => void;
}

export const DashboardSectionOverlay: React.FC<DashboardSectionOverlayProps> = ({
  scrollProgress,
}) => {
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;

  // ---------------------------------------------------------------------------
  // 1. Physical Airplane-Style Sweep Reveal Architecture (0.88 - 0.98)
  // ---------------------------------------------------------------------------
  // Synchronized in lockstep with the 3D model's flight trajectory across the screen.
  // Stage 4 chair center: 15.5vw (s4X = 0.345)
  // Stage 5 exit: ~120vw (s5X = -0.70)
  const t = Math.min(1, Math.max(0, (scrollProgress - 0.88) / 0.10));
  const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const modelCenterPct = 15.5 + ease * 104.5;
  const revealPct = Math.min(116, Math.max(0, modelCenterPct + 2));

  // Mobile / Tablet Elevation Reveal (0.885 - 0.98)
  const mobileProgress = Math.min(1, Math.max(0, (scrollProgress - 0.885) / 0.095));
  const mobileEase =
    mobileProgress < 0.5
      ? 4 * mobileProgress * mobileProgress * mobileProgress
      : 1 - Math.pow(-2 * mobileProgress + 2, 3) / 2;

  // Soft Gradient / Cloudy Edge Transition (Desktop sweep)
  const feather = 18;
  const fadeStart = Math.max(0, revealPct - feather);
  const fadeMid1 = Math.max(0, revealPct - feather * 0.60);
  const fadeMid2 = Math.max(0, revealPct - feather * 0.25);
  const fadeEnd = Math.min(100, revealPct);

  // When fully revealed (revealPct >= 99.5) or on mobile/tablet, disable CSS mask to avoid GPU lag
  const maskGradient =
    revealPct >= 99.5 || !isDesktop
      ? undefined
      : `linear-gradient(to right, #000 0%, #000 ${fadeStart}%, rgba(0, 0, 0, 0.88) ${fadeMid1}%, rgba(0, 0, 0, 0.42) ${fadeMid2}%, rgba(0, 0, 0, 0.08) ${
          fadeMid2 + (fadeEnd - fadeMid2) * 0.7
        }%, transparent ${fadeEnd}%, transparent 100%)`;

  const isInteractive = scrollProgress >= 0.95;

  if (scrollProgress < 0.86) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden ${
        isInteractive ? 'z-[30]' : 'z-[15]'
      } bg-[#01090F] text-white`}
      style={{
        maskImage: maskGradient,
        WebkitMaskImage: maskGradient,
        opacity: isDesktop ? 1.0 : mobileEase,
        transform: isDesktop ? undefined : `translateY(${(1 - mobileEase) * 20}px)`,
        pointerEvents: isInteractive ? 'auto' : 'none',
      }}
    >
      {/* Soft Atmospheric Cloudy Mist along the leading transition edge (Desktop only) */}
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

      {/* Atmospheric Aurora Glow in the Center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] rounded-full pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255, 105, 0, 0.18) 0%, rgba(255, 105, 0, 0.06) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Subtle Tech Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)',
        }}
      />

      {/* Top Header Soft Gradient Fade */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#01090F]/80 via-[#01090F]/40 to-transparent pointer-events-none z-[10]" />

      {/* ===================================================================== */}
      {/* PROMINENT CENTERED TAGLINE WITH POPCORN ANIMATION                      */}
      {/* ===================================================================== */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-4 sm:px-8 text-center pointer-events-auto">
        {/* Small Elegant Pill Above Tagline */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8 opacity-80">
          <span className="w-6 sm:w-8 h-[2px] bg-[#ff6900]" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] text-[#ff6900] uppercase font-mono">
            USER DASHBOARD
          </span>
          <span className="w-6 sm:w-8 h-[2px] bg-[#ff6900]" />
        </div>

        {/* The Large Prominently Centered Tagline with Originkit Popcorn Pop Animation */}
        <div className="w-full max-w-6xl mx-auto flex items-center justify-center">
          <PopcornText
            text="YOUR DASHBOARD AWAITS"
            color="#FFFFFF"
            startY={35}
            startScale={0}
            startOpacity={0}
            rotationRange={20}
            stagger={0.035}
            transition={{ type: 'spring', stiffness: 350, damping: 14, mass: 1 }}
            appearTrigger="default"
            isActive={isInteractive}
          />
        </div>

        {/* Subtitle / Tagline Beneath */}
        <p className="mt-6 sm:mt-8 text-xs sm:text-sm md:text-base text-slate-400 font-mono tracking-[0.25em] uppercase opacity-75">
          SAME BREATH, A BRIGHTER TOMORROW.
        </p>
      </div>
    </div>
  );
};

export default DashboardSectionOverlay;
