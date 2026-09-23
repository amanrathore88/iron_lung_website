import React from 'react';
import { BarChart3, Heart, Settings, ArrowRight, Play } from 'lucide-react';

interface DashboardSectionOverlayProps {
  scrollProgress: number; // 0.0 to 1.0
  onExploreDashboard?: () => void;
  onOpenVideo?: () => void;
}

export const DashboardSectionOverlay: React.FC<DashboardSectionOverlayProps> = ({
  scrollProgress,
  onExploreDashboard,
  onOpenVideo,
}) => {
  // Physical Airplane-Style Sweep Reveal Architecture:
  // Starts revealing at 0.88 as the full 3D Iron Lung sweeps from left to right past About Us.
  // By 0.98, the model has exited past the right border and Section 04 is 100% revealed.
  const t = Math.min(1, Math.max(0, (scrollProgress - 0.88) / 0.10));
  const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  // Dynamic Reveal Percentage (0% to 100%)
  const revealPct = ease * 100;

  // Soft Gradient / Cloudy Edge Transition:
  // Replaces the harsh, sharp cut line with an ultra-smooth feathered mask gradient (~16% / 220px width)
  const feather = 16; // Generous 16% soft transition zone
  const fadeStart = Math.max(0, revealPct - feather);
  const fadeMid1 = Math.max(0, revealPct - feather * 0.65);
  const fadeMid2 = Math.max(0, revealPct - feather * 0.30);
  const fadeEnd = Math.min(100, revealPct);

  // When fully revealed (revealPct >= 99.5), clear mask to none
  // When in progress, apply high-fidelity smooth alpha gradient
  const maskGradient =
    revealPct >= 99.5
      ? 'none'
      : `linear-gradient(to right, #000 0%, #000 ${fadeStart}%, rgba(0, 0, 0, 0.88) ${fadeMid1}%, rgba(0, 0, 0, 0.42) ${fadeMid2}%, rgba(0, 0, 0, 0.08) ${fadeMid2 + (fadeEnd - fadeMid2) * 0.7}%, transparent ${fadeEnd}%, transparent 100%)`;

  const isInteractive = scrollProgress >= 0.98;

  if (scrollProgress < 0.86) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden z-[25] lg:z-[15] bg-[#FAF7F2] lg:bg-transparent"
      style={{
        maskImage: maskGradient,
        WebkitMaskImage: maskGradient,
        pointerEvents: isInteractive ? 'auto' : 'none',
      }}
    >
      {/* Soft Atmospheric Cloudy Mist along the leading transition edge */}
      {revealPct > 2 && revealPct < 99 && (
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-20"
          style={{
            left: `${fadeMid1}%`,
            width: '200px',
            transform: 'translateX(-50%)',
            background:
              'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.48) 0%, rgba(254, 251, 247, 0.22) 50%, transparent 80%)',
            filter: 'blur(24px)',
          }}
        />
      )}
      {/* ============================================================ */}
      {/* Layer 1: High-Quality Full-Viewport Background Scene         */}
      {/* Using the pristine high-resolution asset provided by user    */}
      {/* (Zero baked-in text, authentic lighting & shadows)           */}
      {/* ============================================================ */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/images/dashboard-section4.png')",
          backgroundPosition: 'right center',
          backgroundSize: 'cover',
        }}
      />

      {/* Daylight wash on left to guarantee 100% contrast across devices */}
      <div
        className="absolute inset-y-0 left-0 w-full sm:w-[60vw] max-w-[800px] pointer-events-none bg-[#FAF7F2] sm:bg-transparent"
        style={{
          background: 'linear-gradient(to right, rgba(250,247,242,0.98) 0%, rgba(250,247,242,0.92) 55%, rgba(250,247,242,0.30) 85%, transparent 100%)',
        }}
      />

      {/* Top Header Soft Fade (smooth blend beneath white navbar) */}
      <div className="absolute inset-x-0 top-0 h-20 sm:h-24 bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none z-[1]" />

      {/* ============================================================ */}
      {/* Layer 2: HTML Content Overlay (Shifted Over to Left Border)   */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full h-full px-4 sm:px-10 lg:px-16 xl:px-20 flex flex-col justify-between pt-20 sm:pt-28 pb-4 sm:pb-8">
        {/* Left Column Text & Feature Cards Stack */}
        <div className="w-full max-w-md lg:max-w-[460px] flex flex-col items-start gap-2.5 sm:gap-4.5 pointer-events-auto">
          {/* Section Kicker */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-5 sm:w-6 h-[2.5px] bg-[#FF5E1E] rounded-full" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.20em] sm:tracking-[0.22em] text-slate-500 uppercase font-space font-['Space_Grotesk',sans-serif]">
              USER DASHBOARD
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-black tracking-tight leading-[1.08] text-slate-950">
            More Than Data. <br />
            <span className="text-[#FF5E1E]">A Healthier You.</span>
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm lg:text-[15px] text-slate-600 leading-relaxed font-normal max-w-md">
            Your personal dashboard brings everything together — track your sessions, analyze your progress and stay motivated on your journey to better breathing.
          </p>

          {/* 3 Value Cards Stack */}
          <div className="flex flex-col gap-2 sm:gap-3 w-full max-w-md mt-0.5">
            {/* Card 1: Track Progress */}
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_6px_20px_rgba(0,0,0,0.03)] backdrop-blur-md flex items-center gap-2.5 sm:gap-3.5 hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(255,94,30,0.08)] transition-all">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-50 text-[#FF5E1E] flex items-center justify-center shrink-0 shadow-sm">
                <BarChart3 size={16} className="text-[#FF5E1E] sm:w-[19px] sm:h-[19px]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  Track Progress
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-normal mt-0.5 leading-snug">
                  View session history, performance trends and improvements over time.
                </span>
              </div>
            </div>

            {/* Card 2: Health Insights */}
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_6px_20px_rgba(0,0,0,0.03)] backdrop-blur-md flex items-center gap-2.5 sm:gap-3.5 hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(59,130,246,0.08)] transition-all">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                <Heart size={16} className="text-blue-500 stroke-[2.2] sm:w-[19px] sm:h-[19px]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  Health Insights
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-normal mt-0.5 leading-snug">
                  Understand your breathing patterns with easy-to-read analytics.
                </span>
              </div>
            </div>

            {/* Card 3: Personalized Experience */}
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_6px_20px_rgba(0,0,0,0.03)] backdrop-blur-md flex items-center gap-2.5 sm:gap-3.5 hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(16,185,129,0.08)] transition-all">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                <Settings size={16} className="text-emerald-600 stroke-[2.2] sm:w-[19px] sm:h-[19px]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  Personalized Experience
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-normal mt-0.5 leading-snug">
                  Set goals, customize settings and make the program your own.
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3.5 pt-1">
            <button
              onClick={onExploreDashboard}
              className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-slate-900/10 transition-all transform active:scale-95"
            >
              <span>Explore Dashboard</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onOpenVideo}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-3 rounded-full hover:bg-slate-100/80 text-slate-800 font-semibold text-xs sm:text-sm transition-all"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 text-white flex items-center justify-center">
                <Play size={9} className="fill-white translate-x-0.5" />
              </div>
              <span>Watch Video</span>
            </button>
          </div>
        </div>

        {/* Bottom Tag */}
        <div className="flex items-center gap-2.5 pt-2 pointer-events-none">
          <div className="w-6 h-[2px] bg-[#FF5E1E] rounded-full" />
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.20em] text-slate-500 uppercase font-space font-['Space_Grotesk',sans-serif]">
            SAME BREATH. A BRIGHTER TOMORROW.
          </span>
        </div>
      </div>
    </div>
  );
};
