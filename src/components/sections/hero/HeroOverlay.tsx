import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import BlurText from '../../ui/BlurText';

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

  const heroOpacity = Math.max(0, 1 - Math.min(1, scrollProgress / 0.16));
  const heroTranslateY = -scrollProgress * 120;

  if (heroOpacity <= 0.005) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 w-full h-full z-20 flex flex-col justify-between px-4 sm:px-8 lg:px-16 pt-[94px] sm:pt-24 lg:pt-32 pb-3 sm:pb-8 md:transition-opacity md:duration-150 overflow-hidden pointer-events-none"
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

          {/* Main Headline with BlurText Animation: Bold, prominent, properly scaled on mobile */}
          <h1 className="text-[34px] xs:text-[38px] sm:text-4xl md:text-[44px] lg:text-[5.2rem] font-black tracking-tight leading-[1.06] lg:leading-[1.02] text-slate-950">
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
              className="block text-[#FF5E1E] drop-shadow-[0_4px_24px_rgba(255,94,30,0.25)]"
            />
          </h1>

          {/* 3. Subtitle Paragraph — soft upward fade (~15px) after headline finishes */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.42,
              delay: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-[13px] xs:text-[14px] sm:text-sm md:text-[13px] lg:text-lg text-slate-600 max-w-[330px] md:max-w-[300px] lg:max-w-lg leading-relaxed font-normal"
          >
            The next generation respiratory training system that helps you breathe cleaner, perform better and live healthier.
          </motion.p>

          {/* 4. Action CTAs — staggered entrance (Discover Iron Lung first, then Watch Video) */}
          <div className="flex flex-row items-center gap-2 xs:gap-3 sm:gap-2.5 lg:gap-4 w-full sm:w-auto mt-0.5 sm:mt-1">
            {/* Primary Discover Button */}
            <motion.button
              onClick={onDiscover}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                duration: 0.38,
                delay: 1.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex-1 sm:flex-initial px-4 xs:px-5 md:px-4 lg:px-7 py-3 md:py-3 lg:py-4 rounded-full bg-[#FF5E1E] hover:bg-[#FF7033] text-white text-xs xs:text-[13px] md:text-xs lg:text-sm font-bold shadow-[0_6px_24px_rgba(255,94,30,0.35)] hover:shadow-[0_8px_30px_rgba(255,94,30,0.55)] flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-2.5 transition-[background-color,box-shadow] duration-200 whitespace-nowrap"
            >
              <span>Discover Iron Lung</span>
              <ArrowRight size={14} className="sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
            </motion.button>

            {/* Secondary Watch Video Button */}
            <motion.button
              onClick={onOpenVideo}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                duration: 0.38,
                delay: 1.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="px-3.5 xs:px-4 md:px-3.5 lg:px-6 py-3 md:py-3 lg:py-4 rounded-full bg-white/90 hover:bg-white text-slate-900 text-xs xs:text-[13px] md:text-xs lg:text-sm font-semibold border border-slate-300/80 shadow-sm backdrop-blur-md flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-2.5 transition-[background-color,box-shadow,border-color] duration-200 whitespace-nowrap"
            >
              <div className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0">
                <Play size={8} className="fill-white translate-x-[0.5px] lg:w-2.5 lg:h-2.5" />
              </div>
              <span>Watch Video</span>
            </motion.button>
          </div>

        </div>

        {/* Empty Spacer Column for 3D Model in center-right */}
        <div className="hidden lg:block lg:col-span-3 pointer-events-none" />

        {/* 5. Right Column: 3 Floating Value Cards — sequential top-to-bottom reveal (~130ms stagger, 18px slide) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col items-end gap-3.5 pointer-events-auto">
          {/* Card 1: Cleaner Air */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{
              duration: 0.42,
              delay: 1.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-56 p-3 rounded-2xl bg-white/85 border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-full bg-[#FFF3EE] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path
                  d="M6.5 9.2H14.8C16.1 9.2 17.1 8.2 17.1 6.9C17.1 5.6 16.1 4.6 14.8 4.6C13.6 4.6 12.7 5.4 12.5 6.5"
                  stroke="#FF5E1E"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.5 14.8H14.8C16.1 14.8 17.1 15.8 17.1 17.1C17.1 18.4 16.1 19.4 14.8 19.4C13.6 19.4 12.7 18.6 12.5 17.5"
                  stroke="#FF5E1E"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.8 12H19.5"
                  stroke="#0F172A"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
                <path
                  d="M17.2 9.7L19.7 12L17.2 14.3"
                  stroke="#0F172A"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-[#0F172A] uppercase leading-tight">
                Cleaner
              </span>
              <span className="text-xs font-black tracking-wider text-[#FF5E1E] uppercase leading-tight">
                Air
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                Every Day
              </span>
            </div>
          </motion.div>

          {/* Card 2: Higher Performance */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{
              duration: 0.42,
              delay: 1.31,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-56 p-3 rounded-2xl bg-white/85 border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-full bg-[#FFF3EE] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M6 18.5V16.5" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <path d="M9.8 18.5V14.2" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <path d="M13.6 18.5V11.8" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <path d="M17.4 18.5V8.2" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M6.2 12.6C9.8 11.6 13.2 9.1 16.2 4.8"
                  stroke="#FF5E1E"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.2 4.8H16.3V7.9"
                  stroke="#FF5E1E"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-[#0F172A] uppercase leading-tight">
                Higher
              </span>
              <span className="text-xs font-black tracking-wider text-[#FF5E1E] uppercase leading-tight">
                Performance
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                In Every Breath
              </span>
            </div>
          </motion.div>

          {/* Card 3: Healthier Lives */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{
              duration: 0.42,
              delay: 1.44,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-56 p-3 rounded-2xl bg-white/85 border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-full bg-[#FFF3EE] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path
                  d="M14.2 6.4C13.2 6.4 12.2 7.0 11.5 8.1C10.5 6.6 8.6 5.9 6.9 6.6C4.8 7.4 3.9 9.9 4.7 12.3C5.8 15.3 11.5 19.2 11.5 19.2C11.5 19.2 16.3 15.9 17.9 13.0"
                  stroke="#0F172A"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M17.6 5.9V10.9" stroke="#FF5E1E" strokeWidth="1.9" strokeLinecap="round" />
                <path d="M15.1 8.4H20.1" stroke="#FF5E1E" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-[#0F172A] uppercase leading-tight">
                Healthier
              </span>
              <span className="text-xs font-black tracking-wider text-[#FF5E1E] uppercase leading-tight">
                Lives
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                For a Better Tomorrow
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Invisible bottom spacer to preserve exact pixel-perfect desktop/tablet grid vertical alignment */}
      <div className="hidden md:block w-full h-8 pointer-events-none" />
    </div>
  );
};
