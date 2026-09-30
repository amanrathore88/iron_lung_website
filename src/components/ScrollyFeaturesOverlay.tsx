import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Leaf, Activity, Sliders } from 'lucide-react';

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
  const isSec1Active = scrollProgress >= 0.16 && scrollProgress <= 0.42;

  // Phase 2 (Section 02 - UV Sanitization): Fades in from 0.38, locked at 0.46-0.58, fades out by 0.66
  const sec2Opacity = Math.min(
    1,
    Math.max(0, scrollProgress < 0.46 ? (scrollProgress - 0.38) / 0.08 : (0.66 - scrollProgress) / 0.08)
  );
  const sec2TranslateY = (1 - Math.min(1, Math.max(0, (scrollProgress - 0.38) / 0.08))) * 32;
  const isSec2Active = scrollProgress >= 0.40 && scrollProgress <= 0.64;

  // Phase 3 (Section 03 - Ergonomic Chair): Fades in from 0.60, locked at 0.68-0.73, fades out cleanly by 0.76
  const sec3Opacity = Math.min(
    1,
    Math.max(0, scrollProgress < 0.68 ? (scrollProgress - 0.60) / 0.08 : (0.76 - scrollProgress) / 0.03)
  );
  const sec3TranslateY = (1 - Math.min(1, Math.max(0, (scrollProgress - 0.60) / 0.08))) * 32;
  const isSec3Active = scrollProgress >= 0.62 && scrollProgress <= 0.75;

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
        className="absolute inset-0 px-4 sm:px-8 lg:px-16 flex flex-col justify-between pt-20 pb-4 sm:pt-20 sm:pb-6 md:py-0 md:flex-row md:items-center md:justify-between md:transition-all md:duration-300 pointer-events-none"
        style={{
          opacity: sec1Opacity,
          transform: `translateY(${sec1TranslateY}px)`,
          display: sec1Opacity <= 0.01 ? 'none' : 'flex',
        }}
      >
        {/* On Tablet/Desktop: Combined left column with md:max-w-[240px] (tablet) or lg:max-w-xl (desktop) */}
        {/* On Mobile: Centered header at top, unified dock at bottom, center is open for 3D console */}
        <div className="w-full flex flex-col items-center text-center md:items-start md:text-left gap-1.5 sm:gap-3 lg:gap-5 md:max-w-[240px] lg:max-w-xl pointer-events-auto">
          {/* Mobile Centered Kicker Badge */}
          <div className="flex md:hidden items-center gap-2 px-3 py-1 rounded-full bg-white/95 border border-slate-200/90 shadow-sm backdrop-blur-md">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={isSec1Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={isSec1Active ? { duration: 0.25, delay: 0.0, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="text-xs font-black text-[#FF5E1E] tracking-tight"
            >
              01
            </motion.span>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isSec1Active ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={isSec1Active ? { duration: 0.25, delay: 0.12, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              style={{ transformOrigin: 'left center' }}
              className="w-1 h-1 rounded-full bg-slate-300"
            />
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={isSec1Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={isSec1Active ? { duration: 0.24, delay: 0.24, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="text-[9.5px] font-bold tracking-[0.22em] text-slate-500 uppercase"
            >
              PRODUCT INTERFACE
            </motion.span>
          </div>

          {/* Tablet/Desktop Left-Aligned Kicker (100% Unchanged Design, Animated Sequence) */}
          <div className="hidden md:flex flex-col items-start gap-0.5 sm:gap-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={isSec1Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={isSec1Active ? { duration: 0.25, delay: 0.0, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="text-xl sm:text-2xl lg:text-3xl font-black text-[#FF5E1E] tracking-tight"
              >
                01
              </motion.span>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={isSec1Active ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                transition={isSec1Active ? { duration: 0.25, delay: 0.12, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                style={{ transformOrigin: 'left center' }}
                className="w-5 sm:w-7 lg:w-8 h-[2px] bg-[#FF5E1E] rounded-full"
              />
            </div>
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={isSec1Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={isSec1Active ? { duration: 0.24, delay: 0.24, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="text-[9px] sm:text-[10px] lg:text-xs font-bold tracking-[0.20em] sm:tracking-[0.22em] text-slate-500 uppercase mt-0.5"
            >
              PRODUCT INTERFACE
            </motion.span>
          </div>

          {/* Heading & Description */}
          <div className="flex flex-col items-center md:items-start gap-1 sm:gap-2 lg:gap-3 w-full max-w-md">
            <h2 className="text-[23px] xs:text-[25px] sm:text-3xl md:text-2xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.12] lg:leading-[1.08] text-slate-950">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={isSec1Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={isSec1Active ? { duration: 0.52, delay: 0.34, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="inline-block md:block mr-[0.25em] md:mr-0"
              >
                Smart, Intuitive
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={isSec1Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={isSec1Active ? { duration: 0.52, delay: 0.47, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="inline-block md:block"
              >
                Touch Screen
              </motion.span>
            </h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isSec1Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={isSec1Active ? { duration: 0.62, delay: 0.62, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="text-[11.5px] sm:text-sm md:text-[11px] lg:text-base text-slate-600 leading-relaxed font-normal max-w-[320px] md:max-w-none mx-auto md:mx-0"
            >
              A clear and easy-to-use interface that guides you through every session with real-time feedback and personalized settings.
            </motion.p>
          </div>

          {/* TABLET & DESKTOP Cards Container (hidden on mobile, rendered below on mobile) */}
          <div className="hidden md:flex flex-col gap-2 lg:gap-3 w-full max-w-[240px] lg:max-w-md mt-0.5 lg:mt-1">
            {/* Card 1: Guided Breathing Programs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isSec1Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileHover={{ scale: 1.01 }}
              transition={isSec1Active ? { duration: 0.48, delay: 0.78, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="p-2 lg:p-4 rounded-xl lg:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 lg:gap-3.5"
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={isSec1Active ? { scale: 1 } : { scale: 0.85 }}
                transition={isSec1Active ? { duration: 0.45, delay: 0.78, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="w-8 h-8 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl bg-[#FFF3EE] flex items-center justify-center shrink-0"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 lg:w-6 lg:h-6" fill="none">
                  {/* Left & Right Lung Lobes in Dark Navy */}
                  <path
                    d="M9.4 8.2C6.5 8.4 4.5 11.2 4.5 15.8C4.5 18.4 5.8 19.6 7.7 19.0C9.0 18.5 9.8 17.4 9.8 15.4V9.0C9.8 8.5 9.6 8.2 9.4 8.2Z"
                    stroke="#0F172A"
                    strokeWidth="1.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.6 8.2C17.5 8.4 19.5 11.2 19.5 15.8C19.5 18.4 18.2 19.6 16.3 19.0C15.0 18.5 14.2 17.4 14.2 15.4V9.0C14.2 8.5 14.4 8.2 14.6 8.2Z"
                    stroke="#0F172A"
                    strokeWidth="1.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Center Trachea & Bronchial Branches in Brand Orange */}
                  <path
                    d="M12 3.8V10.6M12 10.6L8.2 13.7M12 10.6L15.8 13.7"
                    stroke="#FF5E1E"
                    strokeWidth="1.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              <div className="h-6 lg:h-8 w-[1px] bg-slate-200/80 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] lg:text-sm font-bold text-[#0F172A] leading-tight">
                  Guided Breathing Programs
                </span>
                <span className="text-[9px] lg:text-[11px] text-slate-500 font-medium mt-0.5">
                  For all fitness levels
                </span>
              </div>
            </motion.div>

            {/* Card 2: Real-Time Session Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isSec1Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileHover={{ scale: 1.01 }}
              transition={isSec1Active ? { duration: 0.48, delay: 0.91, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="p-2 lg:p-4 rounded-xl lg:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 lg:gap-3.5"
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={isSec1Active ? { scale: 1 } : { scale: 0.85 }}
                transition={isSec1Active ? { duration: 0.45, delay: 0.91, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="w-8 h-8 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl bg-[#FFF3EE] flex items-center justify-center shrink-0"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 lg:w-6 lg:h-6" fill="none">
                  {/* 3 Rising Vertical Bars in Dark Navy */}
                  <path d="M8.2 15.5V12.8" stroke="#0F172A" strokeWidth="1.95" strokeLinecap="round" />
                  <path d="M11.4 15.5V10.5" stroke="#0F172A" strokeWidth="1.95" strokeLinecap="round" />
                  <path d="M14.6 15.5V8.2" stroke="#0F172A" strokeWidth="1.95" strokeLinecap="round" />
                  {/* Sweeping Circular Gauge Arc in Brand Orange */}
                  <path
                    d="M12.4 4.1A8 8 0 1 1 5.4 16.5"
                    stroke="#FF5E1E"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
              <div className="h-6 lg:h-8 w-[1px] bg-slate-200/80 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] lg:text-sm font-bold text-[#0F172A] leading-tight">
                  Real-Time Session Feedback
                </span>
                <span className="text-[9px] lg:text-[11px] text-slate-500 font-medium mt-0.5">
                  Track your breathing performance
                </span>
              </div>
            </motion.div>

            {/* Card 3: Simple & Intuitive Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isSec1Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileHover={{ scale: 1.01 }}
              transition={isSec1Active ? { duration: 0.48, delay: 1.04, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="p-2 lg:p-4 rounded-xl lg:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 lg:gap-3.5"
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={isSec1Active ? { scale: 1 } : { scale: 0.85 }}
                transition={isSec1Active ? { duration: 0.45, delay: 1.04, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="w-8 h-8 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl bg-[#FFF3EE] flex items-center justify-center shrink-0"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 lg:w-6 lg:h-6" fill="none">
                  {/* Orange Touch Ring around Fingertip */}
                  <path
                    d="M8.1 10.6A3.8 3.8 0 1 1 13.9 10.6"
                    stroke="#FF5E1E"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                  {/* Dark Navy Pointing Hand Silhouette */}
                  <path
                    d="M9.8 14.2V8.3C9.8 7.6 10.3 7.1 11.0 7.1C11.7 7.1 12.2 7.6 12.2 8.3V12.2M12.2 11.5C12.2 10.9 12.7 10.5 13.3 10.5C13.9 10.5 14.4 10.9 14.4 11.5V12.6M14.4 12.1C14.4 11.5 14.9 11.1 15.5 11.1C16.1 11.1 16.6 11.5 16.6 12.1V13.3M16.6 12.9C16.6 12.4 17.0 12.0 17.6 12.0C18.2 12.0 18.6 12.4 18.6 13.0V15.8C18.6 18.0 17.3 19.6 15.6 20.2M9.8 13.2L8.4 12.3C7.8 11.9 7.0 12.1 6.7 12.7C6.4 13.2 6.5 13.8 6.9 14.3L9.6 17.6C10.3 18.5 10.9 19.4 11.2 20.2"
                    stroke="#0F172A"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              <div className="h-6 lg:h-8 w-[1px] bg-slate-200/80 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] lg:text-sm font-bold text-[#0F172A] leading-tight">
                  Simple & Intuitive Controls
                </span>
                <span className="text-[9px] lg:text-[11px] text-slate-500 font-medium mt-0.5">
                  Designed for everyone
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* MOBILE Center Spacer: Ensures Zone 2 is open for 3D Console */}
        <div className="md:hidden flex-1 min-h-[100px] pointer-events-none" />

        {/* MOBILE Bottom Unified Feature Dock: Clean, high-contrast, premium hardware controller card */}
        <div className="md:hidden w-full max-w-[345px] mx-auto rounded-2xl bg-white shadow-[0_16px_40px_rgba(0,0,0,0.14)] border border-slate-200/90 p-2.5 flex flex-col gap-1.5 pointer-events-auto mb-2 xs:mb-3">
          {/* Header pill */}
          <div className="px-1.5 pt-0.5 pb-1 flex items-center justify-between border-b border-slate-100">
            <span className="text-[9.5px] font-extrabold tracking-widest text-slate-400 uppercase">
              Core Capabilities
            </span>
            <span className="text-[9.5px] font-bold text-[#FF5E1E] tracking-wider uppercase">
              3 Modes
            </span>
          </div>

          {/* Row 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isSec1Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={isSec1Active ? { duration: 0.48, delay: 0.78, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100/90"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={isSec1Active ? { scale: 1 } : { scale: 0.85 }}
              transition={isSec1Active ? { duration: 0.45, delay: 0.78, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="w-7 h-7 rounded-lg bg-[#FFF3EE] flex items-center justify-center shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <path
                  d="M9.4 8.2C6.5 8.4 4.5 11.2 4.5 15.8C4.5 18.4 5.8 19.6 7.7 19.0C9.0 18.5 9.8 17.4 9.8 15.4V9.0C9.8 8.5 9.6 8.2 9.4 8.2Z"
                  stroke="#0F172A"
                  strokeWidth="1.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.6 8.2C17.5 8.4 19.5 11.2 19.5 15.8C19.5 18.4 18.2 19.6 16.3 19.0C15.0 18.5 14.2 17.4 14.2 15.4V9.0C14.2 8.5 14.4 8.2 14.6 8.2Z"
                  stroke="#0F172A"
                  strokeWidth="1.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 3.8V10.6M12 10.6L8.2 13.7M12 10.6L15.8 13.7"
                  stroke="#FF5E1E"
                  strokeWidth="1.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11.5px] font-bold text-[#0F172A] leading-tight truncate">
                Guided Breathing Programs
              </span>
              <span className="text-[9.5px] text-slate-500 font-medium">
                For all fitness levels
              </span>
            </div>
          </motion.div>

          {/* Row 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isSec1Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={isSec1Active ? { duration: 0.48, delay: 0.91, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100/90"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={isSec1Active ? { scale: 1 } : { scale: 0.85 }}
              transition={isSec1Active ? { duration: 0.45, delay: 0.91, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="w-7 h-7 rounded-lg bg-[#FFF3EE] flex items-center justify-center shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <path d="M8.2 15.5V12.8" stroke="#0F172A" strokeWidth="1.95" strokeLinecap="round" />
                <path d="M11.4 15.5V10.5" stroke="#0F172A" strokeWidth="1.95" strokeLinecap="round" />
                <path d="M14.6 15.5V8.2" stroke="#0F172A" strokeWidth="1.95" strokeLinecap="round" />
                <path
                  d="M12.4 4.1A8 8 0 1 1 5.4 16.5"
                  stroke="#FF5E1E"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11.5px] font-bold text-[#0F172A] leading-tight truncate">
                Real-Time Session Feedback
              </span>
              <span className="text-[9.5px] text-slate-500 font-medium">
                Track your breathing performance
              </span>
            </div>
          </motion.div>

          {/* Row 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isSec1Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={isSec1Active ? { duration: 0.48, delay: 1.04, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100/90"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={isSec1Active ? { scale: 1 } : { scale: 0.85 }}
              transition={isSec1Active ? { duration: 0.45, delay: 1.04, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="w-7 h-7 rounded-lg bg-[#FFF3EE] flex items-center justify-center shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <path
                  d="M8.1 10.6A3.8 3.8 0 1 1 13.9 10.6"
                  stroke="#FF5E1E"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
                <path
                  d="M9.8 14.2V8.3C9.8 7.6 10.3 7.1 11.0 7.1C11.7 7.1 12.2 7.6 12.2 8.3V12.2M12.2 11.5C12.2 10.9 12.7 10.5 13.3 10.5C13.9 10.5 14.4 10.9 14.4 11.5V12.6M14.4 12.1C14.4 11.5 14.9 11.1 15.5 11.1C16.1 11.1 16.6 11.5 16.6 12.1V13.3M16.6 12.9C16.6 12.4 17.0 12.0 17.6 12.0C18.2 12.0 18.6 12.4 18.6 13.0V15.8C18.6 18.0 17.3 19.6 15.6 20.2M9.8 13.2L8.4 12.3C7.8 11.9 7.0 12.1 6.7 12.7C6.4 13.2 6.5 13.8 6.9 14.3L9.6 17.6C10.3 18.5 10.9 19.4 11.2 20.2"
                  stroke="#0F172A"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11.5px] font-bold text-[#0F172A] leading-tight truncate">
                Simple & Intuitive Controls
              </span>
              <span className="text-[9.5px] text-slate-500 font-medium">
                Designed for everyone
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right side is intentionally empty for the focused 3D Touch Screen Model on Desktop */}
        <div className="hidden lg:block w-[45%]" />
      </div>

      {/* ======================================================== */}
      {/* SECTION 02: Built-In UV Purification (Right Column)     */}
      {/* ======================================================== */}
      <div
        className="absolute inset-0 px-4 sm:px-8 lg:px-16 flex flex-col justify-between pt-20 pb-4 sm:pt-20 sm:pb-6 md:py-0 md:flex-row md:items-center md:justify-between md:transition-all md:duration-300 pointer-events-none"
        style={{
          opacity: sec2Opacity,
          transform: `translateY(${sec2TranslateY}px)`,
          display: sec2Opacity <= 0.01 ? 'none' : 'flex',
        }}
      >
        {/* Left Column Area: Tag (Desktop/Laptop only to prevent mobile & tablet overlap) */}
        <div className="hidden lg:flex relative w-full lg:w-[48%] h-full flex-col justify-end pt-24 pb-12 sm:pb-16 pointer-events-none">
          {/* Left Bottom Tag: Cleaner Air A Healthier You */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={isSec2Active ? { duration: 0.5, delay: 0.95, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
            className="flex items-start gap-3 pointer-events-auto"
          >
            <div className="w-[3px] h-10 bg-[#FF5E1E] rounded-full shrink-0 shadow-sm" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black tracking-wider text-slate-900 uppercase">
                Cleaner Air
              </span>
              <span className="text-xs sm:text-sm font-black tracking-wider text-slate-900 uppercase leading-tight">
                A Healthier You
              </span>
            </div>
          </motion.div>
        </div>

        {/* MOBILE Top Header: Centered kicker, heading, description */}
        <div className="md:hidden w-full flex flex-col items-center text-center gap-1.5 pointer-events-auto">
          {/* Mobile Centered Kicker Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 border border-slate-200/90 shadow-sm backdrop-blur-md">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={isSec2Active ? { duration: 0.25, delay: 0.0, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="text-xs font-black text-[#FF5E1E] tracking-tight"
            >
              02
            </motion.span>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isSec2Active ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={isSec2Active ? { duration: 0.25, delay: 0.12, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              style={{ transformOrigin: 'left center' }}
              className="w-1 h-1 rounded-full bg-slate-300"
            />
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={isSec2Active ? { duration: 0.24, delay: 0.24, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="text-[9.5px] font-bold tracking-[0.22em] text-slate-500 uppercase"
            >
              UV SANITIZATION
            </motion.span>
          </div>

          {/* Heading & Description */}
          <div className="flex flex-col items-center gap-1 w-full max-w-md">
            <h2 className="text-[23px] xs:text-[25px] font-black tracking-tight leading-[1.12] text-slate-950">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={isSec2Active ? { duration: 0.52, delay: 0.34, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="inline-block mr-[0.25em]"
              >
                Built-In
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={isSec2Active ? { duration: 0.52, delay: 0.47, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="inline-block"
              >
                UV Purification
              </motion.span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={isSec2Active ? { duration: 0.62, delay: 0.62, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="text-[11.5px] text-slate-600 leading-relaxed font-normal max-w-[320px] mx-auto"
            >
              Advanced UV-C sanitization technology keeps the breathing interface clean and safe for every session.
            </motion.p>
          </div>
        </div>

        {/* MOBILE Center Spacer: Ensures Zone 2 is open for 3D UV Handpiece */}
        <div className="md:hidden flex-1 min-h-[100px] pointer-events-none" />

        {/* MOBILE Bottom Unified Feature Dock: Clean, high-contrast, premium hardware controller card */}
        <div className="md:hidden w-full max-w-[345px] mx-auto rounded-2xl bg-white shadow-[0_16px_40px_rgba(0,0,0,0.14)] border border-slate-200/90 p-2.5 flex flex-col gap-1.5 pointer-events-auto mb-2 xs:mb-3">
          {/* Header pill */}
          <div className="px-1.5 pt-0.5 pb-1 flex items-center justify-between border-b border-slate-100">
            <span className="text-[9.5px] font-extrabold tracking-widest text-slate-400 uppercase">
              Purification Tech
            </span>
            <span className="text-[9.5px] font-bold text-[#FF5E1E] tracking-wider uppercase">
              Medical Grade
            </span>
          </div>

          {/* Row 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={isSec2Active ? { duration: 0.48, delay: 0.78, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100/90"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={isSec2Active ? { scale: 1 } : { scale: 0.85 }}
              transition={isSec2Active ? { duration: 0.45, delay: 0.78, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="w-7 h-7 rounded-lg bg-[#FF5E1E]/10 flex items-center justify-center text-[#FF5E1E] shrink-0"
            >
              <Shield size={14} className="text-[#FF5E1E]" />
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11.5px] font-bold text-slate-900 leading-tight truncate">
                Eliminates Bacteria & Viruses
              </span>
              <span className="text-[9.5px] text-slate-500 font-medium">
                For a safer experience
              </span>
            </div>
          </motion.div>

          {/* Row 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={isSec2Active ? { duration: 0.48, delay: 0.91, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100/90"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={isSec2Active ? { scale: 1 } : { scale: 0.85 }}
              transition={isSec2Active ? { duration: 0.45, delay: 0.91, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0"
            >
              <Sparkles size={14} className="text-amber-500" />
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11.5px] font-bold text-slate-900 leading-tight truncate">
                Automatic Sanitization
              </span>
              <span className="text-[9.5px] text-slate-500 font-medium">
                Before and after each use
              </span>
            </div>
          </motion.div>

          {/* Row 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={isSec2Active ? { duration: 0.48, delay: 1.04, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100/90"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={isSec2Active ? { scale: 1 } : { scale: 0.85 }}
              transition={isSec2Active ? { duration: 0.45, delay: 1.04, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0"
            >
              <Leaf size={14} className="text-emerald-500" />
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11.5px] font-bold text-slate-900 leading-tight truncate">
                Hygienic & Maintenance Friendly
              </span>
              <span className="text-[9.5px] text-slate-500 font-medium">
                Designed for long-term use
              </span>
            </div>
          </motion.div>
        </div>

        {/* TABLET & DESKTOP Right Column Content (hidden on mobile) */}
        <div className="hidden md:flex w-full md:max-w-[245px] lg:max-w-xl flex-col items-start gap-2 sm:gap-3 lg:gap-5 pointer-events-auto ml-auto">
          {/* Section Number & Kicker */}
          <div className="flex flex-col items-start gap-0.5 sm:gap-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={isSec2Active ? { duration: 0.25, delay: 0.0, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="text-xl sm:text-2xl lg:text-3xl font-black text-[#FF5E1E] tracking-tight"
              >
                02
              </motion.span>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={isSec2Active ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                transition={isSec2Active ? { duration: 0.25, delay: 0.12, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                style={{ transformOrigin: 'left center' }}
                className="w-5 sm:w-7 lg:w-8 h-[2px] bg-[#FF5E1E] rounded-full"
              />
            </div>
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={isSec2Active ? { duration: 0.24, delay: 0.24, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="text-[9px] sm:text-[10px] lg:text-xs font-bold tracking-[0.20em] sm:tracking-[0.22em] text-slate-500 uppercase mt-0.5"
            >
              UV SANITIZATION
            </motion.span>
          </div>

          {/* Heading & Description */}
          <div className="flex flex-col items-start gap-1 sm:gap-2 lg:gap-3 w-full max-w-md">
            <h2 className="text-2xl sm:text-2xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.12] lg:leading-[1.08] text-slate-950">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={isSec2Active ? { duration: 0.52, delay: 0.34, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="inline-block lg:block mr-[0.25em] lg:mr-0"
              >
                Built-In
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={isSec2Active ? { duration: 0.52, delay: 0.47, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="inline-block lg:block"
              >
                UV Purification
              </motion.span>
            </h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={isSec2Active ? { duration: 0.62, delay: 0.62, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="text-[11px] sm:text-[11px] lg:text-base text-slate-600 leading-relaxed font-normal"
            >
              Advanced UV-C sanitization technology keeps the breathing interface clean and safe for every session.
            </motion.p>
          </div>

          {/* 3 Value Cards Stack */}
          <div className="flex flex-col gap-2 lg:gap-3 w-full max-w-[245px] lg:max-w-md mt-0.5 lg:mt-1">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileHover={{ scale: 1.01 }}
              transition={isSec2Active ? { duration: 0.48, delay: 0.78, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="p-2 lg:p-4 rounded-xl lg:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 lg:gap-3.5"
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={isSec2Active ? { scale: 1 } : { scale: 0.85 }}
                transition={isSec2Active ? { duration: 0.45, delay: 0.78, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0"
              >
                <Shield size={14} className="text-slate-800 lg:w-5 lg:h-5" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-[11px] lg:text-sm font-bold text-slate-900 leading-tight">
                  Eliminates Bacteria & Viruses
                </span>
                <span className="text-[9px] lg:text-[11px] text-slate-500 font-medium mt-0.5">
                  For a safer experience
                </span>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileHover={{ scale: 1.01 }}
              transition={isSec2Active ? { duration: 0.48, delay: 0.91, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="p-2 lg:p-4 rounded-xl lg:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 lg:gap-3.5"
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={isSec2Active ? { scale: 1 } : { scale: 0.85 }}
                transition={isSec2Active ? { duration: 0.45, delay: 0.91, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0"
              >
                <Sparkles size={14} className="text-slate-800 lg:w-5 lg:h-5" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-[11px] lg:text-sm font-bold text-slate-900 leading-tight">
                  Automatic Sanitization
                </span>
                <span className="text-[9px] lg:text-[11px] text-slate-500 font-medium mt-0.5">
                  Before and after each use
                </span>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isSec2Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileHover={{ scale: 1.01 }}
              transition={isSec2Active ? { duration: 0.48, delay: 1.04, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="p-2 lg:p-4 rounded-xl lg:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 lg:gap-3.5"
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={isSec2Active ? { scale: 1 } : { scale: 0.85 }}
                transition={isSec2Active ? { duration: 0.45, delay: 1.04, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0"
              >
                <Leaf size={14} className="text-slate-800 lg:w-5 lg:h-5" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-[11px] lg:text-sm font-bold text-slate-900 leading-tight">
                  Hygienic & Maintenance Friendly
                </span>
                <span className="text-[9px] lg:text-[11px] text-slate-500 font-medium mt-0.5">
                  Designed for long-term use
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 03: Ergonomic Biometric Training Chair (Left Col) */}
      {/* ======================================================== */}
      <div
        className="absolute inset-0 px-4 sm:px-8 lg:px-16 flex flex-col justify-between pt-16 pb-3 sm:pt-20 sm:pb-6 md:py-0 md:flex-row md:items-center md:justify-between md:transition-all md:duration-300 pointer-events-none"
        style={{
          opacity: sec3Opacity,
          transform: `translateY(${sec3TranslateY}px)`,
          display: sec3Opacity <= 0.01 ? 'none' : 'flex',
        }}
      >
        {/* MOBILE Top Header: Centered kicker, heading, description */}
        <div className="md:hidden w-full flex flex-col items-center text-center gap-1.5 pointer-events-auto">
          {/* Mobile Centered Kicker Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 border border-slate-200/90 shadow-sm backdrop-blur-md">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={isSec3Active ? { duration: 0.25, delay: 0.0, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="text-xs font-black text-[#FF5E1E] tracking-tight"
            >
              03
            </motion.span>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isSec3Active ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={isSec3Active ? { duration: 0.25, delay: 0.12, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              style={{ transformOrigin: 'left center' }}
              className="w-1 h-1 rounded-full bg-slate-300"
            />
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={isSec3Active ? { duration: 0.24, delay: 0.24, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="text-[9.5px] font-bold tracking-[0.22em] text-slate-500 uppercase"
            >
              ERGONOMIC DESIGN
            </motion.span>
          </div>

          {/* Heading & Description */}
          <div className="flex flex-col items-center gap-1 w-full max-w-md">
            <h2 className="text-[23px] xs:text-[25px] font-black tracking-tight leading-[1.12] text-slate-950">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={isSec3Active ? { duration: 0.52, delay: 0.34, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="inline-block mr-[0.25em]"
              >
                Engineered for
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={isSec3Active ? { duration: 0.52, delay: 0.47, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="inline-block"
              >
                Optimal Posture
              </motion.span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={isSec3Active ? { duration: 0.62, delay: 0.62, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="text-[11.5px] text-slate-600 leading-relaxed font-normal max-w-[320px] mx-auto"
            >
              Specially contoured seating engineered to open the thoracic cavity, aligning the spine for optimal lung expansion and deep diaphragm activation.
            </motion.p>
          </div>
        </div>

        {/* MOBILE Center Spacer: Ensures Zone 2 is open for 3D Chair */}
        <div className="md:hidden flex-1 min-h-[100px] pointer-events-none" />

        {/* MOBILE Bottom Unified Feature Dock: Clean, high-contrast, premium hardware controller card */}
        <div className="md:hidden w-full max-w-[345px] mx-auto rounded-2xl bg-white shadow-[0_16px_40px_rgba(0,0,0,0.14)] border border-slate-200/90 p-2.5 flex flex-col gap-1.5 pointer-events-auto mb-2 xs:mb-3">
          {/* Header pill */}
          <div className="px-1.5 pt-0.5 pb-1 flex items-center justify-between border-b border-slate-100">
            <span className="text-[9.5px] font-extrabold tracking-widest text-slate-400 uppercase">
              Biometric Seating
            </span>
            <span className="text-[9.5px] font-bold text-[#FF5E1E] tracking-wider uppercase">
              Posture Tuned
            </span>
          </div>

          {/* Row 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={isSec3Active ? { duration: 0.48, delay: 0.78, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100/90"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={isSec3Active ? { scale: 1 } : { scale: 0.85 }}
              transition={isSec3Active ? { duration: 0.45, delay: 0.78, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="w-7 h-7 rounded-lg bg-[#FF5E1E]/10 flex items-center justify-center text-[#FF5E1E] shrink-0"
            >
              <Activity size={14} className="text-[#FF5E1E]" />
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11.5px] font-bold text-slate-900 leading-tight truncate">
                Thoracic Spine Alignment
              </span>
              <span className="text-[9.5px] text-slate-500 font-medium">
                Maximizes lung capacity & airflow
              </span>
            </div>
          </motion.div>

          {/* Row 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={isSec3Active ? { duration: 0.48, delay: 0.91, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100/90"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={isSec3Active ? { scale: 1 } : { scale: 0.85 }}
              transition={isSec3Active ? { duration: 0.45, delay: 0.91, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0"
            >
              <Shield size={14} className="text-indigo-500" />
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11.5px] font-bold text-slate-900 leading-tight truncate">
                Medical-Grade Cushioning
              </span>
              <span className="text-[9.5px] text-slate-500 font-medium">
                High-density pressure-relief memory foam
              </span>
            </div>
          </motion.div>

          {/* Row 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={isSec3Active ? { duration: 0.48, delay: 1.04, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100/90"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={isSec3Active ? { scale: 1 } : { scale: 0.85 }}
              transition={isSec3Active ? { duration: 0.45, delay: 1.04, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0"
            >
              <Sliders size={14} className="text-blue-500" />
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11.5px] font-bold text-slate-900 leading-tight truncate">
                Multi-Point Adjustment
              </span>
              <span className="text-[9.5px] text-slate-500 font-medium">
                Tailored recline & lumbar support
              </span>
            </div>
          </motion.div>
        </div>

        {/* TABLET & DESKTOP Left Column Content (hidden on mobile) */}
        <div className="hidden md:flex w-full md:max-w-[245px] lg:max-w-xl flex-col items-start gap-2 sm:gap-3 lg:gap-5 pointer-events-auto">
          {/* Section Number & Kicker */}
          <div className="flex flex-col items-start gap-0.5 sm:gap-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={isSec3Active ? { duration: 0.25, delay: 0.0, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="text-xl sm:text-2xl lg:text-3xl font-black text-[#FF5E1E] tracking-tight"
              >
                03
              </motion.span>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={isSec3Active ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                transition={isSec3Active ? { duration: 0.25, delay: 0.12, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                style={{ transformOrigin: 'left center' }}
                className="w-5 sm:w-7 lg:w-8 h-[2px] bg-[#FF5E1E] rounded-full"
              />
            </div>
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={isSec3Active ? { duration: 0.24, delay: 0.24, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="text-[9px] sm:text-[10px] lg:text-xs font-bold tracking-[0.20em] sm:tracking-[0.22em] text-slate-500 uppercase mt-0.5"
            >
              ERGONOMIC DESIGN
            </motion.span>
          </div>

          {/* Heading & Description */}
          <div className="flex flex-col items-start gap-1 sm:gap-2 lg:gap-3 w-full max-w-md">
            <h2 className="text-2xl sm:text-2xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.12] lg:leading-[1.08] text-slate-950">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={isSec3Active ? { duration: 0.52, delay: 0.34, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="inline-block lg:block mr-[0.25em] lg:mr-0"
              >
                Engineered for
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={isSec3Active ? { duration: 0.52, delay: 0.47, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="inline-block lg:block"
              >
                Optimal Posture
              </motion.span>
            </h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={isSec3Active ? { duration: 0.62, delay: 0.62, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="text-[11px] sm:text-[11px] lg:text-base text-slate-600 leading-relaxed font-normal"
            >
              Specially contoured seating engineered to open the thoracic cavity, aligning the spine for optimal lung expansion and deep diaphragm activation.
            </motion.p>
          </div>

          {/* 3 Value Cards Stack */}
          <div className="flex flex-col gap-2 lg:gap-3 w-full max-w-[245px] lg:max-w-md mt-0.5 lg:mt-1">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileHover={{ scale: 1.01 }}
              transition={isSec3Active ? { duration: 0.48, delay: 0.78, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="p-2 lg:p-4 rounded-xl lg:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 lg:gap-3.5"
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={isSec3Active ? { scale: 1 } : { scale: 0.85 }}
                transition={isSec3Active ? { duration: 0.45, delay: 0.78, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0"
              >
                <Activity size={14} className="text-slate-800 lg:w-5 lg:h-5" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-[11px] lg:text-sm font-bold text-slate-900 leading-tight">
                  Thoracic Spine Alignment
                </span>
                <span className="text-[9px] lg:text-[11px] text-slate-500 font-medium mt-0.5">
                  Maximizes lung capacity & airflow
                </span>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileHover={{ scale: 1.01 }}
              transition={isSec3Active ? { duration: 0.48, delay: 0.91, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="p-2 lg:p-4 rounded-xl lg:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 lg:gap-3.5"
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={isSec3Active ? { scale: 1 } : { scale: 0.85 }}
                transition={isSec3Active ? { duration: 0.45, delay: 0.91, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0"
              >
                <Shield size={14} className="text-slate-800 lg:w-5 lg:h-5" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-[11px] lg:text-sm font-bold text-slate-900 leading-tight">
                  Medical-Grade Cushioning
                </span>
                <span className="text-[9px] lg:text-[11px] text-slate-500 font-medium mt-0.5">
                  High-density pressure-relief memory foam
                </span>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileHover={{ scale: 1.01 }}
              transition={isSec3Active ? { duration: 0.48, delay: 1.04, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
              className="p-2 lg:p-4 rounded-xl lg:rounded-2xl bg-white/90 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center gap-2.5 lg:gap-3.5"
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={isSec3Active ? { scale: 1 } : { scale: 0.85 }}
                transition={isSec3Active ? { duration: 0.45, delay: 1.04, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
                className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0"
              >
                <Sliders size={14} className="text-slate-800 lg:w-5 lg:h-5" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-[11px] lg:text-sm font-bold text-slate-900 leading-tight">
                  Multi-Point Adjustment
                </span>
                <span className="text-[9px] lg:text-[11px] text-slate-500 font-medium mt-0.5">
                  Tailored recline & lumbar support
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column Area: Tag & 3D Model Framing Space (Desktop only) */}
        <div className="hidden lg:flex relative w-full lg:w-[48%] h-full flex-col justify-end items-end pt-24 pb-12 sm:pb-16 pointer-events-none">
          {/* Right Bottom Tag: Active Recovery Maximum Comfort */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isSec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={isSec3Active ? { duration: 0.5, delay: 0.95, ease: [0.22, 1, 0.36, 1] } : { duration: 0.15 }}
            className="flex items-start gap-3 pointer-events-auto"
          >
            <div className="w-[3px] h-10 bg-[#FF5E1E] rounded-full shrink-0 shadow-sm" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black tracking-wider text-slate-900 uppercase">
                Active Recovery
              </span>
              <span className="text-xs sm:text-sm font-black tracking-wider text-slate-900 uppercase leading-tight">
                Maximum Comfort
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
