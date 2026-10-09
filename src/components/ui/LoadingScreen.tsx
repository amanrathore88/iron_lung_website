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
    const MIN_DURATION_MS = 2000;    // Minimum 2.0s so the user experiences the branded intro
    const MAX_DURATION_MS = 2800;    // Hard 2.8s cap (under 3s requirement)

    const interval = setInterval(() => {
      if (hasFinishedRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;

      if (elapsed < MIN_DURATION_MS) {
        // Smoothly advance from 0% toward ~96% during the minimum 2s window
        const ratio = elapsed / MIN_DURATION_MS;
        const curProgress = Math.min(96, Math.max(8, Math.round((1 - Math.pow(1 - ratio, 2.2)) * 96)));
        setProgress((prev) => Math.max(prev, curProgress));
      } else if (isModelLoaded || elapsed >= MAX_DURATION_MS) {
        // Ready to finish: smoothly reach 100%
        setProgress((prev) => {
          const next = Math.min(100, prev + Math.max(2, Math.round((100 - prev) * 0.45 + 3)));
          if (next >= 100) {
            hasFinishedRef.current = true;
            clearInterval(interval);
            setTimeout(() => {
              setIsFinished(true);
            }, 220);
            return 100;
          }
          return next;
        });
      } else {
        // Model still loading past 2.0s on slower networks: hover smoothly around 95-97% until ready
        setProgress((prev) => Math.max(prev, 96));
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isModelLoaded]);

  // Status subtitle based on progress
  const getStatusText = (val: number) => {
    if (val < 30) return 'INITIALIZING 3D ENVIRONMENT';
    if (val < 65) return 'CALIBRATING RESPIRATORY SENSORS';
    if (val < 95) return 'PREPARING SPATIAL EXPERIENCE';
    return 'EXPERIENCE READY';
  };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isFinished && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.025,
            filter: 'blur(10px)',
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070C12] text-white select-none overflow-hidden"
          style={{ willChange: 'opacity, transform, filter' }}
        >
          {/* Ambient Respiration Glow (Inhale / Exhale Breathing Background) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top-Right Warm Amber/Orange Breath Glow */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.18, 0.32, 0.18],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-[20%] -right-[15%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full bg-gradient-to-br from-[#FF5E1E] to-transparent blur-[120px] pointer-events-none"
            />

            {/* Bottom-Left Cyan/Oxygen Breath Glow */}
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.25, 0.15, 0.25],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -bottom-[20%] -left-[15%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full bg-gradient-to-tr from-[#00A3C4] to-transparent blur-[130px] pointer-events-none"
            />

            {/* Subtle Tech Hex/Grid Overlay */}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          {/* Central Branded Module */}
          <div className="relative z-10 flex flex-col items-center max-w-[420px] w-full px-6">
            
            {/* Respiration Rings & Brand Centerpiece */}
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 flex items-center justify-center mb-5 sm:mb-8">
              {/* Outer Breathing Pulse Wave */}
              <motion.div
                animate={{
                  scale: [1, 1.28, 1],
                  opacity: [0.25, 0.05, 0.25],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 rounded-full border border-[#00A3C4]/60"
              />

              {/* Middle Rotating Cyan-to-Orange Gradient Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-2 sm:inset-3 rounded-full p-[1.5px] bg-gradient-to-tr from-[#FF5E1E] via-[#00A3C4] to-transparent shadow-[0_0_25px_rgba(0,163,196,0.3)]"
              >
                <div className="w-full h-full rounded-full bg-[#070C12]" />
              </motion.div>

              {/* Inner Pulsing Core Ring */}
              <motion.div
                animate={{
                  scale: [0.94, 1.04, 0.94],
                  boxShadow: [
                    '0 0 15px rgba(255,94,30,0.3)',
                    '0 0 35px rgba(255,94,30,0.65)',
                    '0 0 15px rgba(255,94,30,0.3)',
                  ],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-5 sm:inset-7 rounded-full border border-[#FF5E1E]/50 bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xs flex items-center justify-center"
              />

              {/* Respiration Wave Icon (Lungs Rhythm) */}
              <div className="relative z-10 flex items-center justify-center">
                <svg
                  className="w-9 h-9 sm:w-12 sm:h-12 text-[#FF5E1E] drop-shadow-[0_2px_12px_rgba(255,94,30,0.8)]"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Trachea & Bronchi */}
                  <path d="M24 6v12" />
                  <path d="M24 18c-2 2-6 4-9 6" />
                  <path d="M24 18c2 2 6 4 9 6" />
                  {/* Left Lung */}
                  <path d="M15 24c-4.5 3-7 7.5-7 12 0 4 3 6 7 6 5 0 8-3.5 8-8v-9.5" />
                  {/* Right Lung */}
                  <path d="M33 24c4.5 3 7 7.5 7 12 0 4-3 6-7 6-5 0-8-3.5-8-8v-9.5" />
                </svg>
              </div>
            </div>

            {/* Official Iron Lung Brand Logo Glass Pill */}
            <motion.div
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="px-5 py-2 sm:px-6 sm:py-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(255,94,30,0.2)] flex items-center justify-center mb-4 sm:mb-6"
            >
              <img
                src="/images/ironlung-logo.png"
                alt="Iron Lung"
                className="h-6 sm:h-7 md:h-8 w-auto object-contain"
              />
            </motion.div>

            {/* Sub-badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-mono font-medium tracking-widest text-[#00A3C4] uppercase mb-4 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A3C4] animate-pulse" />
              <span>Adaptive Altitude & Biofeedback</span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full relative mt-2 mb-3">
              {/* Track */}
              <div className="h-1.5 sm:h-2 w-full rounded-full bg-white/10 overflow-hidden relative shadow-inner">
                {/* Glowing Fill */}
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#00A3C4] via-[#38BDF8] to-[#FF5E1E] relative shadow-[0_0_12px_rgba(255,94,30,0.8)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                >
                  {/* Leading light glint */}
                  <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/90 rounded-full blur-[1px]" />
                </motion.div>
              </div>
            </div>

            {/* Status Information & Percentage */}
            <div className="w-full flex items-center justify-between text-xs font-mono mt-1 px-0.5">
              <span className="text-slate-400 font-medium tracking-wider text-[11px] sm:text-xs">
                {getStatusText(progress)}
              </span>
              <span className="text-[#FF5E1E] font-bold text-sm sm:text-base tabular-nums">
                {progress}%
              </span>
            </div>

          </div>

          {/* Bottom Accreditation / Tagline */}
          <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 text-center">
            <p className="text-[10px] sm:text-[11px] font-mono tracking-widest text-slate-500 uppercase">
              Iron Lung Respiratory Systems · Next-Gen Altitude Technology
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
