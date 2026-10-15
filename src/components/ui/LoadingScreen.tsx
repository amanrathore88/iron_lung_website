import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isModelLoaded: boolean;
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isModelLoaded,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const startTimeRef = useRef(Date.now());
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    const MIN_DURATION_MS = 1800; // Minimum 1.8s for smooth branded intro
    const MAX_DURATION_MS = 2600; // Maximum cap

    const interval = setInterval(() => {
      if (hasFinishedRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;

      if (elapsed < MIN_DURATION_MS) {
        // Smoothly advance toward ~96%
        const ratio = elapsed / MIN_DURATION_MS;
        const curProgress = Math.min(96, Math.max(8, Math.round((1 - Math.pow(1 - ratio, 2.2)) * 96)));
        setProgress((prev) => Math.max(prev, curProgress));
      } else if (isModelLoaded || elapsed >= MAX_DURATION_MS) {
        // Ready to finish: smoothly reach 100%
        setProgress((prev) => {
          const next = Math.min(100, prev + Math.max(3, Math.round((100 - prev) * 0.45 + 3)));
          if (next >= 100) {
            hasFinishedRef.current = true;
            clearInterval(interval);
            setTimeout(() => {
              setIsFinished(true);
            }, 260);
            return 100;
          }
          return next;
        });
      } else {
        // Still loading model on slower network: hover around 96%
        setProgress((prev) => Math.max(prev, 96));
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isModelLoaded]);

  // SVG circular progress parameters
  const circleSize = 250;
  const strokeWidth = 4;
  const center = circleSize / 2;
  const radius = center - strokeWidth * 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isFinished && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF7F2] text-[#0A1118] select-none overflow-hidden"
          style={{ willChange: 'opacity, transform' }}
        >
          {/* Subtle warm ambient background glow matching site aesthetic */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 50% 50%, rgba(251, 68, 3, 0.05) 0%, rgba(250, 247, 242, 0) 70%)',
            }}
          />

          {/* Center Stage: Large Circle with Company Logo + Percentage below */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            
            {/* The Large Center Circle */}
            <div className="relative flex items-center justify-center w-[220px] h-[220px] xs:w-[240px] xs:h-[240px] sm:w-[260px] sm:h-[260px] md:w-[280px] md:h-[280px]">
              
              {/* Subtle Breathing Outer Glow Pulse */}
              <motion.div
                animate={{
                  scale: [1, 1.06, 1],
                  opacity: [0.25, 0.5, 0.25],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 rounded-full bg-[#FB4403]/10 blur-xl pointer-events-none"
              />

              {/* Main White Disc Container with Premium Shadow */}
              <div className="absolute inset-1.5 xs:inset-2 sm:inset-2.5 rounded-full bg-white shadow-[0_20px_50px_rgba(251,68,3,0.08),0_6px_20px_rgba(0,0,0,0.04)] border border-neutral-200/70 flex items-center justify-center overflow-hidden">
                {/* Company Logo */}
                <motion.img
                  src="/images/ironlung-logo.png"
                  alt="IRONLUNG"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-[130px] xs:w-[145px] sm:w-[160px] md:w-[175px] h-auto object-contain select-none pointer-events-none px-2"
                />
              </div>

              {/* Smooth Circular Progress Indicator SVG */}
              <svg
                className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                viewBox={`0 0 ${circleSize} ${circleSize}`}
              >
                {/* Background Track */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="#EAE5DC"
                  strokeWidth={strokeWidth}
                  className="opacity-60"
                />
                {/* Dynamic Brand Orange Progress Arc */}
                <motion.circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="#FB4403"
                  strokeWidth={strokeWidth + 0.5}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 0.15s ease-out',
                  }}
                />
              </svg>

            </div>

            {/* Loading Percentage Below Circle */}
            <div className="mt-7 sm:mt-8 flex items-center justify-center">
              <span
                className="font-black text-2xl xs:text-3xl sm:text-4xl text-[#0A1118] tracking-tight tabular-nums select-none"
                style={{ fontFamily: "'Swis721 BlkCn BT', sans-serif" }}
              >
                {progress}
                <span className="text-[#FB4403] font-black ml-0.5">%</span>
              </span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
