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
    <section className="relative w-full h-[100dvh] min-h-[500px] max-h-[1080px] flex flex-col justify-between bg-white text-neutral-900 select-none overflow-hidden pt-16 sm:pt-18 md:pt-20 lg:pt-22 pb-5 sm:pb-6 md:pb-8">
      {/* ===================================================================== */}
      {/* 1. GIGANTIC "IRON LUNG" HEADLINE (MATCHING EXACT LARGE SCALE)          */}
      {/* ===================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full text-center flex-shrink-0 px-3 sm:px-4"
      >
        <h1 className="text-[14vw] sm:text-[14.5vw] md:text-[15vw] lg:text-[15.5vw] xl:text-[180px] 2xl:text-[200px] font-black font-sans tracking-[-0.035em] leading-[0.88] select-none uppercase inline-flex items-center justify-center gap-x-2.5 sm:gap-x-4 md:gap-x-6 lg:gap-x-8">
          <span className="text-[#FF5500]">IRON</span>
          <span className="text-[#0F172A]">LUNG</span>
        </h1>
      </motion.div>

      {/* ===================================================================== */}
      {/* 2. ROUNDED VIDEO CARD (FITTING ENTIRELY WITHIN VIEWPORT ABOVE FOLD)   */}
      {/* ===================================================================== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 min-h-0 w-[93%] sm:w-[94%] max-w-[1400px] mx-auto mt-2 sm:mt-3 md:mt-4 flex items-center justify-center"
      >
        <div className="relative w-full h-full max-h-[58vh] rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden bg-black shadow-lg shadow-black/5 border border-neutral-100">
          {/* Background Video */}
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

          {/* Discreet Audio Toggle Button */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
            className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-20 p-2 sm:p-2.5 md:p-3 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95 group pointer-events-auto"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 group-hover:text-white" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF5500] animate-pulse" />
            )}
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default TechnologyHeroSection;
