import React from 'react';
import { ArrowRight, Play, Leaf, Shield, Heart, BarChart3 } from 'lucide-react';
import BlurText from './BlurText';

interface HeroOverlayProps {
  onDiscover: () => void;
  onOpenVideo: () => void;
  scrollProgress?: number; // 0.0 to 1.0
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({
  onDiscover,
  onOpenVideo,
  scrollProgress = 0,
}) => {
  const handleAnimationComplete = () => {
    console.log('Hero heading animation completed!');
  };

  const heroOpacity = Math.max(0, 1 - Math.min(1, scrollProgress / 0.16));
  const heroTranslateY = -scrollProgress * 120;

  if (heroOpacity <= 0.005) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 w-full h-full z-20 flex flex-col justify-between px-4 sm:px-8 lg:px-16 pt-16 sm:pt-24 lg:pt-32 pb-3 sm:pb-8 transition-opacity duration-150 overflow-hidden pointer-events-none"
      style={{
        opacity: heroOpacity,
        transform: `translateY(${heroTranslateY}px)`,
        pointerEvents: heroOpacity < 0.2 ? 'none' : 'auto',
      }}
    >
      {/* Main Grid: Left Column Hero Content & Right Column Floating Spec Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 lg:gap-8 items-start md:items-center mt-0 mb-auto md:my-auto">
        {/* Left Column: Headline, CTAs, & Badges */}
        <div className="w-full md:col-span-6 lg:col-span-6 md:max-w-[310px] lg:max-w-none flex flex-col items-start gap-2.5 sm:gap-3.5 lg:gap-5 pointer-events-auto">
          {/* Top Category Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full bg-white/85 border border-slate-200/80 backdrop-blur-md shadow-sm">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#FF5E1E]/15 flex items-center justify-center text-[#FF5E1E]">
              <svg viewBox="0 0 24 24" className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-[#FF5E1E] fill-current">
                <path d="M12 3v9" />
                <path d="M7 10c-2.5 0-4 2-4 5.5s2 4.5 4 3.5c1.2-.5 1.7-1.5 1.7-3.2V10z" />
                <path d="M17 10c2.5 0 4 2 4 5.5s-2 4.5-4 3.5c-1.2-.5-1.7-1.5-1.7-3.2V10z" />
              </svg>
            </div>
            <span className="text-[9px] sm:text-xs font-semibold tracking-[0.18em] sm:tracking-[0.22em] text-slate-600 uppercase font-space font-['Space_Grotesk',sans-serif]">
              A Healthier Tomorrow
            </span>
          </div>

          {/* Main Headline with BlurText Animation */}
          <h1 className="text-3xl xs:text-[34px] sm:text-4xl md:text-[44px] lg:text-[5.2rem] font-black tracking-tight leading-[1.08] lg:leading-[1.02] text-slate-950">
            <BlurText
              text="Breathe"
              delay={150}
              initialDelay={0}
              animateBy="words"
              direction="top"
              className="block text-slate-950"
            />
            <BlurText
              text="Better,"
              delay={150}
              initialDelay={150}
              animateBy="words"
              direction="top"
              className="block text-slate-950"
            />
            <BlurText
              text="Live Better"
              delay={150}
              initialDelay={300}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="block text-[#FF5E1E] drop-shadow-[0_4px_24px_rgba(255,94,30,0.25)]"
            />
          </h1>

          {/* Subtitle Paragraph */}
          <p className="text-[11.5px] xs:text-xs sm:text-sm md:text-[13px] lg:text-lg text-slate-600 max-w-xs md:max-w-[300px] lg:max-w-lg leading-relaxed font-normal">
            The next generation respiratory training system that helps you breathe cleaner, perform better and live healthier.
          </p>

          {/* Action CTAs: Responsive side-by-side on mobile & tablet, generous on desktop */}
          <div className="flex flex-row items-center gap-2 sm:gap-2.5 lg:gap-4 w-full sm:w-auto mt-0.5 sm:mt-1">
            {/* Primary Discover Button */}
            <button
              onClick={onDiscover}
              className="flex-1 sm:flex-initial px-4 md:px-4 lg:px-7 py-2.5 md:py-3 lg:py-4 rounded-full bg-[#FF5E1E] hover:bg-[#FF7033] text-white text-[11px] md:text-xs lg:text-sm font-bold shadow-[0_6px_24px_rgba(255,94,30,0.35)] hover:shadow-[0_8px_30px_rgba(255,94,30,0.55)] flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <span>Discover Iron Lung</span>
              <ArrowRight size={14} className="sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
            </button>

            {/* Secondary Watch Video Button */}
            <button
              onClick={onOpenVideo}
              className="px-3.5 md:px-3.5 lg:px-6 py-2.5 md:py-3 lg:py-4 rounded-full bg-white/85 hover:bg-white text-slate-900 text-[11px] md:text-xs lg:text-sm font-semibold border border-slate-300/80 shadow-sm backdrop-blur-md flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <div className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0">
                <Play size={8} className="fill-white translate-x-[0.5px] lg:w-2.5 lg:h-2.5" />
              </div>
              <span>Watch Video</span>
            </button>
          </div>

          {/* 3 Core Value Proposition Badges: Desktop & Tablet Only */}
          <div className="hidden md:grid grid-cols-3 gap-1.5 lg:gap-3.5 pt-2 sm:pt-3.5 lg:pt-6 w-full md:max-w-[310px] lg:max-w-lg">
            {/* Badge 1: Cleaner Air Intake */}
            <div className="flex items-center gap-1 md:gap-1.5 lg:gap-2.5 p-1.5 lg:p-2.5 rounded-xl bg-white/70 border border-slate-200/80 shadow-sm backdrop-blur-sm">
              <div className="p-1 lg:p-1.5 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                <Leaf size={11} className="text-slate-700 lg:w-3.5 lg:h-3.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[7.5px] lg:text-[10px] font-black tracking-wider text-slate-900 uppercase leading-tight truncate">
                  CLEANER
                </span>
                <span className="text-[6.5px] lg:text-[9px] text-slate-500 font-medium uppercase leading-tight truncate">
                  AIR INTAKE
                </span>
              </div>
            </div>

            {/* Badge 2: Advanced UV Purification */}
            <div className="flex items-center gap-1 md:gap-1.5 lg:gap-2.5 p-1.5 lg:p-2.5 rounded-xl bg-white/70 border border-slate-200/80 shadow-sm backdrop-blur-sm">
              <div className="p-1 lg:p-1.5 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                <Shield size={11} className="text-slate-700 lg:w-3.5 lg:h-3.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[7.5px] lg:text-[10px] font-black tracking-wider text-slate-900 uppercase leading-tight truncate">
                  ADVANCED
                </span>
                <span className="text-[6.5px] lg:text-[9px] text-slate-500 font-medium uppercase leading-tight truncate">
                  UV PURIFY
                </span>
              </div>
            </div>

            {/* Badge 3: Better Respiratory Health */}
            <div className="flex items-center gap-1 md:gap-1.5 lg:gap-2.5 p-1.5 lg:p-2.5 rounded-xl bg-white/70 border border-slate-200/80 shadow-sm backdrop-blur-sm">
              <div className="p-1 lg:p-1.5 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 text-slate-700 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v8" />
                  <path d="M9 7l-3 3" />
                  <path d="M15 7l3 3" />
                  <path d="M7 10c-2.5 0-4 2-4 5.5s2 4.5 4 3.5c1.2-.5 1.7-1.5 1.7-3.2V10z" />
                  <path d="M17 10c2.5 0 4 2 4 5.5s-2 4.5-4 3.5c-1.2-.5-1.7-1.5-1.7-3.2V10z" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[7.5px] lg:text-[10px] font-black tracking-wider text-slate-900 uppercase leading-tight truncate">
                  BETTER
                </span>
                <span className="text-[6.5px] lg:text-[9px] text-slate-500 font-medium uppercase leading-tight truncate">
                  WELLNESS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Empty Spacer Column for 3D Model in center-right */}
        <div className="hidden lg:block lg:col-span-3 pointer-events-none" />

        {/* Right Column: 4 Floating Value Cards & Testimonial (Desktop Only, 100% Unchanged) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col items-end gap-3.5 pointer-events-auto">
          {/* Card 1: Cleaner Air */}
          <div className="w-56 p-3 rounded-2xl bg-white/85 border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md flex items-center gap-3.5 hover:scale-[1.02] transition-transform">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-800 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v9" />
                <path d="M7 10c-2.5 0-4 2-4 5.5s2 4.5 4 3.5c1.2-.5 1.7-1.5 1.7-3.2V10z" />
                <path d="M17 10c2.5 0 4 2 4 5.5s-2 4.5-4 3.5c-1.2-.5-1.7-1.5-1.7-3.2V10z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-slate-900 uppercase">
                Cleaner
              </span>
              <span className="text-xs font-black tracking-wider text-slate-900 uppercase leading-none">
                Air
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                Every Day
              </span>
            </div>
          </div>

          {/* Card 2: Higher Performance */}
          <div className="w-56 p-3 rounded-2xl bg-white/85 border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md flex items-center gap-3.5 hover:scale-[1.02] transition-transform">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
              <BarChart3 size={20} className="text-slate-800" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-slate-900 uppercase leading-tight">
                Higher Performance
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                In Every Breath
              </span>
            </div>
          </div>

          {/* Card 3: Healthier Lives */}
          <div className="w-56 p-3 rounded-2xl bg-white/85 border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md flex items-center gap-3.5 hover:scale-[1.02] transition-transform">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
              <Heart size={20} className="text-slate-800" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-slate-900 uppercase leading-tight">
                Healthier Lives
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                For a Better Tomorrow
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Interactive Hint Pill: Mobile only (signals touch interaction for the 3D model) */}
      <div className="md:hidden flex items-center justify-center w-full my-auto pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-slate-200/50 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5E1E] animate-pulse" />
          <span className="text-[9px] font-manrope font-semibold tracking-wider text-slate-600 uppercase">
            360° Drag to Rotate
          </span>
        </div>
      </div>

      {/* Mobile Bottom Highlight Bar: 3 Compact Badges + Trust Statement */}
      <div className="md:hidden flex flex-col gap-2 w-full pointer-events-auto">
        {/* 3 Compact Badges */}
        <div className="grid grid-cols-3 gap-1.5 w-full">
          {/* Badge 1: Cleaner Air */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/85 border border-slate-200/80 shadow-xs backdrop-blur-md">
            <div className="p-1 rounded-md bg-slate-100 text-slate-700 shrink-0">
              <Leaf size={11} className="text-slate-700" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[7.5px] font-black tracking-wider text-slate-900 uppercase leading-tight truncate">
                CLEANER
              </span>
              <span className="text-[6.5px] text-slate-500 font-medium uppercase leading-tight truncate">
                AIR INTAKE
              </span>
            </div>
          </div>

          {/* Badge 2: UV Purify */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/85 border border-slate-200/80 shadow-xs backdrop-blur-md">
            <div className="p-1 rounded-md bg-slate-100 text-slate-700 shrink-0">
              <Shield size={11} className="text-slate-700" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[7.5px] font-black tracking-wider text-slate-900 uppercase leading-tight truncate">
                ADVANCED
              </span>
              <span className="text-[6.5px] text-slate-500 font-medium uppercase leading-tight truncate">
                UV PURIFY
              </span>
            </div>
          </div>

          {/* Badge 3: Better Wellness */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/85 border border-slate-200/80 shadow-xs backdrop-blur-md">
            <div className="p-1 rounded-md bg-slate-100 text-slate-700 shrink-0">
              <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-slate-700 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v8" />
                <path d="M9 7l-3 3" />
                <path d="M15 7l3 3" />
                <path d="M7 10c-2.5 0-4 2-4 5.5s2 4.5 4 3.5c1.2-.5 1.7-1.5 1.7-3.2V10z" />
                <path d="M17 10c2.5 0 4 2 4 5.5s-2 4.5-4 3.5c-1.2-.5-1.7-1.5-1.7-3.2V10z" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[7.5px] font-black tracking-wider text-slate-900 uppercase leading-tight truncate">
                BETTER
              </span>
              <span className="text-[6.5px] text-slate-500 font-medium uppercase leading-tight truncate">
                WELLNESS
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Trust Pill */}
        <div className="flex items-center gap-2 text-[8.5px] font-bold tracking-[0.10em] text-slate-500 uppercase px-2.5 py-1 rounded-full bg-white/85 border border-slate-200/60 backdrop-blur-sm self-start">
          <div className="w-4 h-[2px] bg-[#FF5E1E] rounded-full shrink-0" />
          <span className="truncate">Trusted by healthcare & fitness leaders worldwide</span>
        </div>
      </div>

      {/* Desktop & Tablet Bottom Trust Bar (100% Unchanged on Desktop) */}
      <div className="hidden md:flex relative w-full items-center justify-start pointer-events-auto pt-2 sm:pt-4">
        {/* Left Trust Statement with Orange Dash */}
        <div className="flex items-center gap-2.5 text-[9px] sm:text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase px-2.5 py-1 rounded-full bg-white/70 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
          <div className="w-5 sm:w-6 h-[2px] bg-[#FF5E1E] rounded-full shrink-0" />
          <span>Trusted by healthcare professionals, fitness centers and businesses worldwide.</span>
        </div>
      </div>
    </div>
  );
};
