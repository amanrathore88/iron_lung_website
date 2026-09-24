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
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;

  // Physical Airplane-Style Sweep Reveal Architecture:
  // Starts revealing at 0.88 as the full 3D Iron Lung sweeps past About Us.
  // Desktop Horizontal Sweep Reveal (0.88 - 0.98)
  const t = Math.min(1, Math.max(0, (scrollProgress - 0.88) / 0.10));
  const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const revealPct = ease * 100;

  // Mobile / Tablet Elevation Reveal (0.885 - 0.98):
  // Fades and elevates the dashboard into place as the 3D model sweeps and rotates across
  const mobileProgress = Math.min(1, Math.max(0, (scrollProgress - 0.885) / 0.095));
  const mobileEase =
    mobileProgress < 0.5
      ? 4 * mobileProgress * mobileProgress * mobileProgress
      : 1 - Math.pow(-2 * mobileProgress + 2, 3) / 2;

  // Soft Gradient / Cloudy Edge Transition (Desktop sweep):
  // Replaces the harsh, sharp cut line with an ultra-smooth feathered mask gradient (~16% / 220px width)
  const feather = 16;
  const fadeStart = Math.max(0, revealPct - feather);
  const fadeMid1 = Math.max(0, revealPct - feather * 0.65);
  const fadeMid2 = Math.max(0, revealPct - feather * 0.30);
  const fadeEnd = Math.min(100, revealPct);

  // When fully revealed (revealPct >= 99.5) or on mobile/tablet, disable CSS mask to avoid GPU lag
  const maskGradient =
    revealPct >= 99.5 || !isDesktop
      ? undefined
      : `linear-gradient(to right, #000 0%, #000 ${fadeStart}%, rgba(0, 0, 0, 0.88) ${fadeMid1}%, rgba(0, 0, 0, 0.42) ${fadeMid2}%, rgba(0, 0, 0, 0.08) ${fadeMid2 + (fadeEnd - fadeMid2) * 0.7}%, transparent ${fadeEnd}%, transparent 100%)`;

  const isInteractive = scrollProgress >= 0.98;

  if (scrollProgress < 0.86) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden ${
        isInteractive ? 'z-[30]' : 'z-[15]'
      } bg-[#FAF7F2]`}
      style={{
        maskImage: maskGradient,
        WebkitMaskImage: maskGradient,
        opacity: isDesktop ? 1.0 : mobileEase,
        transform: isDesktop ? undefined : `translateY(${(1 - mobileEase) * 20}px)`,
        pointerEvents: isInteractive ? 'auto' : 'none',
      }}
    >
      {/* Soft Atmospheric Cloudy Mist along the leading transition edge (Desktop only) */}
      {isDesktop && revealPct > 2 && revealPct < 99 && (
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

      {/* Top Header Soft Fade (smooth blend beneath white navbar) */}
      <div className="absolute inset-x-0 top-0 h-16 sm:h-20 bg-gradient-to-b from-white/80 via-white/30 to-transparent pointer-events-none z-[5]" />

      {/* ============================================================ */}
      {/* 1. DESKTOP LAYOUT (lg: and up - screens >= 1024px)           */}
      {/* Full-bleed authentic architectural background scene with     */}
      {/* calibrated daylight wash on left that never covers devices   */}
      {/* ============================================================ */}
      <div className="hidden lg:block absolute inset-0 w-full h-full">
        {/* Full-Viewport Background Scene */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: "url('/images/dashboard-section4.png')",
            backgroundPosition: 'right center',
            backgroundSize: 'cover',
          }}
        />

        {/* Calibrated daylight wash: stops strictly at 42vw so phone/monitor remain 100% crisp */}
        <div
          className="absolute inset-y-0 left-0 w-[44vw] max-w-[600px] pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(250,247,242,0.98) 0%, rgba(250,247,242,0.94) 50%, rgba(250,247,242,0.40) 80%, transparent 100%)',
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 w-full h-full px-10 lg:px-14 xl:px-20 flex flex-col justify-between pt-20 lg:pt-24 xl:pt-28 pb-4 lg:pb-6 xl:pb-8">
          {/* Left Column Stack */}
          <div className="w-full max-w-[420px] lg:max-w-[440px] xl:max-w-[470px] flex flex-col items-start gap-2.5 lg:gap-3.5 xl:gap-4 pointer-events-auto">
            {/* Section Kicker */}
            <div className="flex items-center gap-2.5">
              <div className="w-5 lg:w-6 h-[2.5px] bg-[#FF5E1E] rounded-full" />
              <span className="text-[10px] lg:text-xs font-bold tracking-[0.22em] text-slate-500 uppercase font-mono">
                USER DASHBOARD
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl lg:text-[40px] xl:text-[46px] font-black tracking-tight leading-[1.08] text-slate-950">
              More Than Data. <br />
              <span className="text-[#FF5E1E]">A Healthier You.</span>
            </h2>

            {/* Description */}
            <p className="text-xs lg:text-[13.5px] xl:text-[14.5px] text-slate-600 leading-relaxed font-normal max-w-md">
              Your personal dashboard brings everything together — track your sessions, analyze your progress and stay motivated on your journey to better breathing.
            </p>

            {/* 3 Value Cards Stack */}
            <div className="flex flex-col gap-2 lg:gap-2.5 w-full max-w-md mt-0.5">
              {/* Card 1: Track Progress */}
              <div className="p-2 lg:p-2.5 xl:p-3 rounded-xl lg:rounded-2xl bg-white/92 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] backdrop-blur-md flex items-center gap-2.5 lg:gap-3.5 hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(255,94,30,0.08)] transition-all">
                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl bg-orange-50 text-[#FF5E1E] flex items-center justify-center shrink-0 shadow-sm">
                  <BarChart3 size={16} className="text-[#FF5E1E] lg:w-[18px] lg:h-[18px]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs lg:text-sm font-bold text-slate-900 leading-tight">
                    Track Progress
                  </span>
                  <span className="text-[10px] lg:text-[11.5px] text-slate-500 font-normal mt-0.5 leading-snug">
                    View session history, performance trends and improvements over time.
                  </span>
                </div>
              </div>

              {/* Card 2: Health Insights */}
              <div className="p-2 lg:p-2.5 xl:p-3 rounded-xl lg:rounded-2xl bg-white/92 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] backdrop-blur-md flex items-center gap-2.5 lg:gap-3.5 hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(59,130,246,0.08)] transition-all">
                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                  <Heart size={16} className="text-blue-500 stroke-[2.2] lg:w-[18px] lg:h-[18px]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs lg:text-sm font-bold text-slate-900 leading-tight">
                    Health Insights
                  </span>
                  <span className="text-[10px] lg:text-[11.5px] text-slate-500 font-normal mt-0.5 leading-snug">
                    Understand your breathing patterns with easy-to-read analytics.
                  </span>
                </div>
              </div>

              {/* Card 3: Personalized Experience */}
              <div className="p-2 lg:p-2.5 xl:p-3 rounded-xl lg:rounded-2xl bg-white/92 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] backdrop-blur-md flex items-center gap-2.5 lg:gap-3.5 hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(16,185,129,0.08)] transition-all">
                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Settings size={16} className="text-emerald-600 stroke-[2.2] lg:w-[18px] lg:h-[18px]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs lg:text-sm font-bold text-slate-900 leading-tight">
                    Personalized Experience
                  </span>
                  <span className="text-[10px] lg:text-[11.5px] text-slate-500 font-normal mt-0.5 leading-snug">
                    Set goals, customize settings and make the program your own.
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={onExploreDashboard}
                className="group inline-flex items-center gap-2 px-5 lg:px-6 py-2 lg:py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs lg:text-sm shadow-md shadow-slate-900/10 transition-all transform active:scale-95 cursor-pointer"
              >
                <span>Explore Dashboard</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onOpenVideo}
                className="inline-flex items-center gap-2 px-3.5 py-2 lg:py-2.5 rounded-full hover:bg-white/80 text-slate-800 font-semibold text-xs lg:text-sm transition-all cursor-pointer"
              >
                <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-slate-900 text-white flex items-center justify-center">
                  <Play size={9} className="fill-white translate-x-0.5" />
                </div>
                <span>Watch Video</span>
              </button>
            </div>
          </div>

          {/* Bottom Tag */}
          <div className="flex items-center gap-2.5 pt-2 pointer-events-none">
            <div className="w-5 h-[2px] bg-[#FF5E1E] rounded-full" />
            <span className="text-[10px] lg:text-xs font-bold tracking-[0.20em] text-slate-500 uppercase font-mono">
              SAME BREATH. A BRIGHTER TOMORROW.
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. TABLET LAYOUT (md: to lg: - screens 768px to 1023px)      */}
      {/* Side-by-side balanced 2-column layout where text and devices */}
      {/* NEVER collide or obscure each other                         */}
      {/* ============================================================ */}
      <div className="hidden md:flex lg:hidden absolute inset-0 w-full h-full flex-col justify-between pt-20 pb-5 px-6 sm:px-8 max-w-5xl mx-auto">
        {/* Main 2-Column Content */}
        <div className="flex-1 flex items-center justify-between gap-6 pointer-events-auto">
          {/* Left Column Text (48%) */}
          <div className="w-[48%] flex flex-col items-start gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-[2px] bg-[#FF5E1E] rounded-full" />
              <span className="text-[10px] font-bold tracking-[0.20em] text-slate-500 uppercase font-mono">
                USER DASHBOARD
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-[1.1] text-slate-950">
              More Than Data. <br />
              <span className="text-[#FF5E1E]">A Healthier You.</span>
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Your personal dashboard brings everything together — track sessions, analyze trends and stay motivated on your journey to better breathing.
            </p>

            {/* 3 Compact Feature Rows */}
            <div className="flex flex-col gap-2 w-full mt-1">
              <div className="p-2 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FF5E1E] flex items-center justify-center shrink-0">
                  <BarChart3 size={14} className="text-[#FF5E1E]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 leading-tight">Track Progress</span>
                  <span className="text-[10px] text-slate-500 leading-tight">Session history & performance metrics</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <Heart size={14} className="text-blue-500 stroke-[2.2]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 leading-tight">Health Insights</span>
                  <span className="text-[10px] text-slate-500 leading-tight">Breathing waveforms & 60Hz biofeedback</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Settings size={14} className="text-emerald-600 stroke-[2.2]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 leading-tight">Personalized Goals</span>
                  <span className="text-[10px] text-slate-500 leading-tight">Customized targets & RFID athlete sync</span>
                </div>
              </div>
            </div>

            {/* Tablet Action Buttons */}
            <div className="flex items-center gap-2.5 pt-1.5">
              <button
                onClick={onExploreDashboard}
                className="group inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Explore Dashboard</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={onOpenVideo}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-white text-slate-800 font-semibold text-xs border border-slate-200/70 shadow-xs transition-all cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center">
                  <Play size={8} className="fill-white translate-x-0.5" />
                </div>
                <span>Watch Video</span>
              </button>
            </div>
          </div>

          {/* Right Column Showcase (52%) */}
          <div className="w-[52%] flex items-center justify-center">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.08)] border border-slate-200/80 bg-white/50 backdrop-blur-sm group">
              <img
                src="/images/dashboard-showcase.png"
                alt="Iron Lung Dashboard and Smartphone App"
                className="w-full h-auto object-contain block transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[9.5px] font-mono tracking-wider uppercase font-semibold">
                Telemetry 60Hz
              </div>
            </div>
          </div>
        </div>

        {/* Tablet Bottom Tag */}
        <div className="flex items-center gap-2 pt-2 pointer-events-none">
          <div className="w-5 h-[2px] bg-[#FF5E1E] rounded-full" />
          <span className="text-[10px] font-bold tracking-[0.20em] text-slate-400 uppercase font-mono">
            SAME BREATH. A BRIGHTER TOMORROW.
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. MOBILE LAYOUT (< md - screens under 768px)                */}
      {/* Purpose-built vertical flow: crisp heading, crystal-clear    */}
      {/* devices preview card, 3 mini-badges, action buttons, & tag.  */}
      {/* Harmonious spacing, unified alignment across all elements.    */}
      {/* ============================================================ */}
      <div className="flex md:hidden absolute inset-0 w-full h-full flex-col justify-between pt-16 sm:pt-20 pb-4 px-4.5 xs:px-5 pointer-events-auto">
        {/* Unified Cohesive Column (Centered Vertically in Available Space) */}
        <div className="my-auto w-full max-w-[400px] mx-auto flex flex-col items-start">
          {/* Top Header */}
          <div className="w-full flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-[2px] bg-[#FF5E1E] rounded-full" />
              <span className="text-[9.5px] xs:text-[10px] font-bold tracking-[0.20em] text-slate-500 uppercase font-mono">
                USER DASHBOARD
              </span>
            </div>

            <h2 className="text-[22px] xs:text-[24px] sm:text-[26px] font-black tracking-tight leading-[1.12] text-slate-950 mt-0.5">
              More Than Data. <span className="text-[#FF5E1E]">A Healthier You.</span>
            </h2>

            <p className="text-[11.5px] xs:text-[12px] text-slate-600 leading-snug mt-0.5">
              Your personal dashboard brings everything together — track sessions, analyze trends and stay motivated.
            </p>
          </div>

          {/* Center Visual Showcase Card */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-slate-200/90 bg-white/70 backdrop-blur-sm mt-3 xs:mt-3.5 group">
            <img
              src="/images/dashboard-showcase.png"
              alt="Iron Lung Dashboard & App"
              className="w-full h-[145px] xs:h-[165px] object-cover object-[center_38%] block"
            />
            <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[8.5px] xs:text-[9px] font-mono tracking-wider uppercase font-semibold">
              Real-Time Cloud Sync
            </div>
          </div>

          {/* 3 Compact Feature Pills Grid */}
          <div className="grid grid-cols-3 gap-2 w-full mt-2.5 xs:mt-3">
            <div className="py-2 px-1.5 rounded-xl bg-white/95 border border-slate-200/85 shadow-xs flex flex-col items-center text-center">
              <div className="w-6 h-6 rounded-lg bg-orange-50 text-[#FF5E1E] flex items-center justify-center mb-1">
                <BarChart3 size={13} className="text-[#FF5E1E]" />
              </div>
              <span className="text-[10px] xs:text-[10.5px] font-bold text-slate-900 leading-tight">
                Track Trends
              </span>
              <span className="text-[8px] xs:text-[8.5px] text-slate-500 leading-tight mt-0.5">
                Session logs
              </span>
            </div>

            <div className="py-2 px-1.5 rounded-xl bg-white/95 border border-slate-200/85 shadow-xs flex flex-col items-center text-center">
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center mb-1">
                <Heart size={13} className="text-blue-500 stroke-[2.2]" />
              </div>
              <span className="text-[10px] xs:text-[10.5px] font-bold text-slate-900 leading-tight">
                Bio Insights
              </span>
              <span className="text-[8px] xs:text-[8.5px] text-slate-500 leading-tight mt-0.5">
                Waveforms
              </span>
            </div>

            <div className="py-2 px-1.5 rounded-xl bg-white/95 border border-slate-200/85 shadow-xs flex flex-col items-center text-center">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                <Settings size={13} className="text-emerald-600 stroke-[2.2]" />
              </div>
              <span className="text-[10px] xs:text-[10.5px] font-bold text-slate-900 leading-tight">
                Custom Goals
              </span>
              <span className="text-[8px] xs:text-[8.5px] text-slate-500 leading-tight mt-0.5">
                Target metrics
              </span>
            </div>
          </div>

          {/* Action Buttons: 2 Equal Width Buttons matching exact width of cards & image */}
          <div className="grid grid-cols-2 gap-2.5 w-full mt-2.5 xs:mt-3">
            <button
              onClick={onExploreDashboard}
              className="group w-full py-2.5 px-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md shadow-slate-900/10 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <span>Explore Dashboard</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onOpenVideo}
              className="w-full py-2.5 px-3 rounded-full bg-white/95 hover:bg-white text-slate-800 font-semibold text-xs border border-slate-200/90 shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center">
                <Play size={7} className="fill-white translate-x-0.5" />
              </div>
              <span>Watch Video</span>
            </button>
          </div>
        </div>

        {/* Mobile Bottom Tag */}
        <div className="w-full max-w-[400px] mx-auto flex items-center gap-2 pt-1 pointer-events-none">
          <div className="w-4 h-[2px] bg-[#FF5E1E] rounded-full" />
          <span className="text-[9px] xs:text-[9.5px] font-bold tracking-[0.18em] text-slate-400 uppercase font-mono">
            SAME BREATH. A BRIGHTER TOMORROW.
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardSectionOverlay;
