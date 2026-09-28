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

      {/* Top Header Soft Gradient Fade (smooth blend beneath navbar) */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#FAF7F2]/90 via-[#FAF7F2]/40 to-transparent pointer-events-none z-[10]" />

      {/* ===================================================================== */}
      {/* PROMINENT CENTERED TAGLINE: "YOUR DASHBOARD AWAITS"                   */}
      {/* "YOUR" & "AWAITS" in theme orange (#ff6900), "DASHBOARD" in black     */}
      {/* ===================================================================== */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-4 sm:px-8 text-center pointer-events-auto">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-center">
          <PopcornText
            wordsConfig={[
              { text: 'YOUR', color: '#ff6900' },
              { text: 'DASHBOARD', color: '#000000' },
              { text: 'AWAITS', color: '#ff6900' },
            ]}
            startY={35}
            startScale={0}
            startOpacity={0}
            rotationRange={22}
            stagger={0.03}
            transition={{ type: 'spring', stiffness: 380, damping: 18, mass: 1 }}
            appearTrigger="default"
            isActive={isInteractive}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardSectionOverlay;
