import React from 'react';
import { Shield, Sparkles, Leaf, Heart, Activity, Sliders } from 'lucide-react';

interface ScrollyFeaturesOverlayProps {
  scrollProgress: number; // 0.0 to 1.0
  onExploreScreen?: () => void;
  onExploreUV?: () => void;
  onExploreChair?: () => void;
}

export const ScrollyFeaturesOverlay: React.FC<ScrollyFeaturesOverlayProps> = ({
  scrollProgress,
}) => {
  // Phase 1 (Section 01 - Touchscreen): Fades in from 0.14, locked at 0.24-0.36, fades out by 0.44
  const sec1Opacity = Math.min(
    1,
    Math.max(0, scrollProgress < 0.24 ? (scrollProgress - 0.14) / 0.10 : (0.44 - scrollProgress) / 0.08)
  );
  const sec1TranslateY = (1 - Math.min(1, Math.max(0, (scrollProgress - 0.14) / 0.10))) * 32;

  // Phase 2 (Section 02 - UV Sanitization): Fades in from 0.38, locked at 0.46-0.58, fades out by 0.66
  const sec2Opacity = Math.min(
    1,
    Math.max(0, scrollProgress < 0.46 ? (scrollProgress - 0.38) / 0.08 : (0.66 - scrollProgress) / 0.08)
  );
  const sec2TranslateY = (1 - Math.min(1, Math.max(0, (scrollProgress - 0.38) / 0.08))) * 32;

  // Phase 3 (Section 03 - Ergonomic Chair): Fades in from 0.60, locked at 0.68-0.73, fades out cleanly by 0.76
  const sec3Opacity = Math.min(
    1,
    Math.max(0, scrollProgress < 0.68 ? (scrollProgress - 0.60) / 0.08 : (0.76 - scrollProgress) / 0.03)
  );
  const sec3TranslateY = (1 - Math.min(1, Math.max(0, (scrollProgress - 0.60) / 0.08))) * 32;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-hidden">
      {/* ======================================================== */}
      {/* Decorative Connecting Orange Lines (Matches Design Image) */}
      {/* ======================================================== */}
      {/* Line 1: From Hero bottom center down towards Section 01 */}
      <svg
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 z-10"
        style={{
          opacity: sec1Opacity * 0.85,
        }}
      >
        <path
          d="M 50% 12% C 50% 22%, 58% 28%, 68% 30%"
          fill="none"
          stroke="#FF5E1E"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset="0"
          className="opacity-90"
        />
      </svg>

      {/* Line 2: S-curve looping from Section 01 into Section 02 */}
      <svg
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 z-10"
        style={{
          opacity: Math.min(sec1Opacity, sec2Opacity) > 0 ? 0.7 : (scrollProgress > 0.36 && scrollProgress < 0.58 ? 0.8 : 0),
        }}
      >
        <path
          d="M 70% 55% C 62% 64%, 48% 66%, 42% 75%"
          fill="none"
          stroke="#FF5E1E"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="opacity-80"
        />
      </svg>

      {/* Line 3: S-curve looping from Section 02 into Section 03 */}
      <svg
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 z-10"
        style={{
          opacity: Math.min(sec2Opacity, sec3Opacity) > 0 ? 0.7 : (scrollProgress > 0.58 && scrollProgress < 0.76 ? sec3Opacity * 0.8 : 0),
        }}
      >
        <path
          d="M 42% 72% C 52% 78%, 62% 76%, 68% 84%"
          fill="none"
          stroke="#FF5E1E"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="opacity-80"
        />
      </svg>

      {/* ======================================================== */}
      {/* SECTION 01: Smart, Intuitive Touch Screen                */}
      {/* ======================================================== */}
      <div
        className="absolute inset-0 px-4 sm:px-8 lg:px-16 flex flex-col justify-between pt-16 pb-4 sm:pt-20 sm:pb-6 md:py-0 md:flex-row md:items-center md:justify-between transition-all duration-300 pointer-events-none"
        style={{
          opacity: sec1Opacity,
          transform: `translateY(${sec1TranslateY}px)`,
          display: sec1Opacity <= 0.01 ? 'none' : 'flex',
        }}
      >
        {/* On Tablet/Desktop: Combined left column with md:max-w-[240px] (tablet) or lg:max-w-xl (desktop) */}
        {/* On Mobile: Header stays at top, cards stay at bottom, center is open for the 3D console */}
        <div className="w-full md:max-w-[240px] lg:max-w-xl flex flex-col items-start gap-2 sm:gap-3 lg:gap-5 pointer-events-auto">
          {/* Section Number & Kicker */}
          <div className="flex flex-col items-start gap-0.5 sm:gap-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[#FF5E1E] tracking-tight">
                01
              </span>
              <div className="w-5 sm:w-7 lg:w-8 h-[2px] bg-[#FF5E1E] rounded-full" />
            </div>
            <span className="text-[9px] sm:text-[10px] lg:text-xs font-bold tracking-[0.20em] sm:tracking-[0.22em] text-slate-500 uppercase mt-0.5">
              PRODUCT INTERFACE
            </span>
          </div>

          {/* Heading & Description */}
          <div className="flex flex-col items-start gap-1 sm:gap-2 lg:gap-3 w-full max-w-md">
            <h2 className="text-2xl xs:text-[26px] sm:text-3xl md:text-2xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08] text-slate-950">
              Smart, Intuitive <br />
              Touch Screen
            </h2>

            {/* Description */}
            <p className="text-[11px] xs:text-xs sm:text-sm md:text-[11px] lg:text-base text-slate-600 leading-relaxed font-normal max-w-[310px] md:max-w-none">
              A clear and easy-to-use interface that guides you through every session with real-time feedback and personalized settings.
            </p>
          </div>

          {/* TABLET & DESKTOP Cards Container (hidden on mobile, rendered below on mobile) */}
          <div className="hidden md:flex flex-col gap-2 lg:gap-3 w-full max-w-[240px] lg:max-w-md mt-0.5 lg:mt-1">
            {/* Card 1 */}
            <div className="p-2 lg:p-4 rounded-xl lg:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 lg:gap-3.5 hover:scale-[1.01] transition-transform">
              <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-slate-800 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v9" />
                  <path d="M7 10c-2.5 0-4 2-4 5.5s2 4.5 4 3.5c1.2-.5 1.7-1.5 1.7-3.2V10z" />
                  <path d="M17 10c2.5 0 4 2 4 5.5s-2 4.5-4 3.5c-1.2-.5-1.7-1.5-1.7-3.2V10z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] lg:text-sm font-bold text-slate-900 leading-tight">
                  Guided Breathing Programs
                </span>
                <span className="text-[9px] lg:text-[11px] text-slate-500 font-medium mt-0.5">
                  For all fitness levels
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-2 lg:p-4 rounded-xl lg:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 lg:gap-3.5 hover:scale-[1.01] transition-transform">
              <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Heart size={14} className="text-slate-800 lg:w-5 lg:h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] lg:text-sm font-bold text-slate-900 leading-tight">
                  Real-Time Session Feedback
                </span>
                <span className="text-[9px] lg:text-[11px] text-slate-500 font-medium mt-0.5">
                  Track your breathing performance
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-2 lg:p-4 rounded-xl lg:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 lg:gap-3.5 hover:scale-[1.01] transition-transform">
              <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Activity size={14} className="text-slate-800 lg:w-5 lg:h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] lg:text-sm font-bold text-slate-900 leading-tight">
                  Simple & Intuitive Controls
                </span>
                <span className="text-[9px] lg:text-[11px] text-slate-500 font-medium mt-0.5">
                  Designed for everyone
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE Center Spacer: Ensures Zone 2 is open for 3D Console */}
        <div className="md:hidden flex-1 min-h-[140px] pointer-events-none" />

        {/* MOBILE Bottom Cards Row: Placed neatly at the bottom on mobile screens (< 768px) */}
        <div className="md:hidden w-full max-w-[360px] mx-auto flex flex-col gap-2 pointer-events-auto">
          {/* Card 1 */}
          <div className="py-2.5 px-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF5E1E] shrink-0">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#FF5E1E] fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v9" />
                <path d="M7 10c-2.5 0-4 2-4 5.5s2 4.5 4 3.5c1.2-.5 1.7-1.5 1.7-3.2V10z" />
                <path d="M17 10c2.5 0 4 2 4 5.5s-2 4.5-4 3.5c-1.2-.5-1.7-1.5-1.7-3.2V10z" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 leading-tight truncate">
                Guided Breathing Programs
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                For all fitness levels
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="py-2.5 px-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
              <Heart size={14} className="text-rose-500" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 leading-tight truncate">
                Real-Time Session Feedback
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                Track your breathing performance
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="py-2.5 px-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <Activity size={14} className="text-blue-500" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 leading-tight truncate">
                Simple & Intuitive Controls
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                Designed for everyone
              </span>
            </div>
          </div>
        </div>

        {/* Right side is intentionally empty for the focused 3D Touch Screen Model on Desktop */}
        <div className="hidden lg:block w-[45%]" />
      </div>

      {/* ======================================================== */}
      {/* SECTION 02: Built-In UV Purification (Right Column)     */}
      {/* ======================================================== */}
      <div
        className="absolute inset-0 px-4 sm:px-8 lg:px-16 flex items-center justify-between transition-all duration-300 pointer-events-none"
        style={{
          opacity: sec2Opacity,
          transform: `translateY(${sec2TranslateY}px)`,
          display: sec2Opacity <= 0.01 ? 'none' : 'flex',
        }}
      >
        {/* Left Column Area: Tag (Desktop/Laptop only to prevent mobile overlap) */}
        <div className="hidden lg:flex relative w-full lg:w-[48%] h-full flex-col justify-end pt-24 pb-12 sm:pb-16 pointer-events-none">
          {/* Left Bottom Tag: Cleaner Air A Healthier You */}
          <div className="flex items-start gap-3 pointer-events-auto">
            <div className="w-[3px] h-10 bg-[#FF5E1E] rounded-full shrink-0 shadow-sm" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black tracking-wider text-slate-900 uppercase">
                Cleaner Air
              </span>
              <span className="text-xs sm:text-sm font-black tracking-wider text-slate-900 uppercase leading-tight">
                A Healthier You
              </span>
            </div>
          </div>
        </div>

        {/* Right Column Content */}
        <div className="w-full max-w-lg lg:max-w-xl flex flex-col items-start gap-3.5 sm:gap-5 pointer-events-auto ml-auto">
          {/* Section Number & Kicker */}
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="text-xl sm:text-3xl font-black text-[#FF5E1E] tracking-tight">
                02
              </span>
              <div className="w-6 sm:w-8 h-[2px] bg-[#FF5E1E] rounded-full" />
            </div>
            <span className="text-[9.5px] sm:text-xs font-bold tracking-[0.20em] sm:tracking-[0.22em] text-slate-500 uppercase mt-0.5">
              UV SANITIZATION
            </span>
          </div>

          {/* Heading & Description with responsive glass backdrop on mobile for maximum legibility */}
          <div className="flex flex-col items-start gap-2 sm:gap-3 p-3 sm:p-0 rounded-2xl bg-white/75 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border border-white/50 sm:border-none shadow-sm sm:shadow-none w-full max-w-md">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08] text-slate-950">
              Built-In <br />
              UV Purification
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal">
              Advanced UV-C sanitization technology keeps the breathing interface clean and safe for every session.
            </p>
          </div>

          {/* 3 Value Cards Stack */}
          <div className="flex flex-col gap-2 sm:gap-3 w-full max-w-md mt-0.5 sm:mt-1">
            {/* Card 1 */}
            <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 sm:gap-3.5 hover:scale-[1.01] transition-transform">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Shield size={16} className="text-slate-800 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  Eliminates Bacteria & Viruses
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">
                  For a safer experience
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 sm:gap-3.5 hover:scale-[1.01] transition-transform">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Sparkles size={16} className="text-slate-800 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  Automatic Sanitization
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">
                  Before and after each use
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 sm:gap-3.5 hover:scale-[1.01] transition-transform">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Leaf size={16} className="text-slate-800 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  Hygienic & Maintenance Friendly
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">
                  Designed for long-term use
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 03: Ergonomic Biometric Training Chair (Left Col) */}
      {/* ======================================================== */}
      <div
        className="absolute inset-0 px-4 sm:px-8 lg:px-16 flex items-center justify-between transition-all duration-300 pointer-events-none"
        style={{
          opacity: sec3Opacity,
          transform: `translateY(${sec3TranslateY}px)`,
          display: sec3Opacity <= 0.01 ? 'none' : 'flex',
        }}
      >
        {/* Left Column Content */}
        <div className="w-full max-w-lg lg:max-w-xl flex flex-col items-start gap-3.5 sm:gap-5 pointer-events-auto">
          {/* Section Number & Kicker */}
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="text-xl sm:text-3xl font-black text-[#FF5E1E] tracking-tight">
                03
              </span>
              <div className="w-6 sm:w-8 h-[2px] bg-[#FF5E1E] rounded-full" />
            </div>
            <span className="text-[9.5px] sm:text-xs font-bold tracking-[0.20em] sm:tracking-[0.22em] text-slate-500 uppercase mt-0.5">
              ERGONOMIC DESIGN
            </span>
          </div>

          {/* Heading & Description with responsive glass backdrop on mobile for maximum legibility */}
          <div className="flex flex-col items-start gap-2 sm:gap-3 p-3 sm:p-0 rounded-2xl bg-white/75 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border border-white/50 sm:border-none shadow-sm sm:shadow-none w-full max-w-md">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08] text-slate-950">
              Engineered for <br />
              Optimal Posture
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal">
              Specially contoured seating engineered to open the thoracic cavity, aligning the spine for optimal lung expansion and deep diaphragm activation.
            </p>
          </div>

          {/* 3 Value Cards Stack */}
          <div className="flex flex-col gap-2 sm:gap-3 w-full max-w-md mt-0.5 sm:mt-1">
            {/* Card 1 */}
            <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 sm:gap-3.5 hover:scale-[1.01] transition-transform">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Activity size={16} className="text-slate-800 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  Thoracic Spine Alignment
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">
                  Maximizes lung capacity & airflow
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 sm:gap-3.5 hover:scale-[1.01] transition-transform">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Shield size={16} className="text-slate-800 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  Medical-Grade Cushioning
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">
                  High-density pressure-relief memory foam
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 sm:gap-3.5 hover:scale-[1.01] transition-transform">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Sliders size={16} className="text-slate-800 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  Multi-Point Adjustment
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">
                  Tailored recline & lumbar support
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Area: Tag & 3D Model Framing Space (Desktop only) */}
        <div className="hidden lg:flex relative w-full lg:w-[48%] h-full flex-col justify-end items-end pt-24 pb-12 sm:pb-16 pointer-events-none">
          {/* Right Bottom Tag: Active Recovery Maximum Comfort */}
          <div className="flex items-start gap-3 pointer-events-auto">
            <div className="w-[3px] h-10 bg-[#FF5E1E] rounded-full shrink-0 shadow-sm" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black tracking-wider text-slate-900 uppercase">
                Active Recovery
              </span>
              <span className="text-xs sm:text-sm font-black tracking-wider text-slate-900 uppercase leading-tight">
                Maximum Comfort
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
