import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export const TechnologyHeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <section className="relative w-full bg-white text-neutral-900 pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20 overflow-hidden select-none">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================================================================= */}
        {/* 1. GIGANTIC CENTERED TITLE: "IRON LUNG"                           */}
        {/* ================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center w-full"
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[116px] xl:text-[136px] 2xl:text-[152px] font-black tracking-[-0.035em] leading-[0.92] select-none uppercase inline-flex items-center justify-center gap-x-3 sm:gap-x-5 md:gap-x-7 lg:gap-x-8">
            <span className="text-[#FF5500] drop-shadow-xs">IRON</span>
            <span className="text-[#0F172A]">LUNG</span>
          </h1>
        </motion.div>

        {/* ================================================================= */}
        {/* 2. ROUNDED CINEMATIC VIDEO CONTAINER (REPLACING REFERENCE IMAGE)  */}
        {/* ================================================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 w-full max-w-[1360px] mx-auto"
        >
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] max-h-[640px] rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden bg-black shadow-xl shadow-black/10 border border-neutral-100">
            {/* The Video Element */}
            <video
              ref={videoRef}
              src="/video/ironlung-shots.mp4"
              poster="/images/technology-hero-poster.jpg"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              className="w-full h-full object-cover block select-none pointer-events-none"
            />

            {/* Discreet Mute/Unmute Control */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
              className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white transition-all duration-200 cursor-pointer shadow-xl hover:scale-105 active:scale-95 group pointer-events-auto"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 group-hover:text-white" />
              ) : (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF5500] animate-pulse" />
              )}
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default TechnologyHeroSection;
