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
    <section className="relative w-full h-[72vh] min-h-[440px] sm:h-[80vh] md:h-[100dvh] md:min-h-[520px] md:max-h-[1080px] flex flex-col justify-between bg-[#fcfaf7] text-neutral-900 select-none overflow-hidden pt-18 sm:pt-20 md:pt-22 pb-4 sm:pb-6 md:pb-8">
      {/* ===================================================================== */}
      {/* EXTENDED ROUNDED VIDEO CARD (FULL HERO VIEWPORT MATCHING RED BOX)    */}
      {/* ===================================================================== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 min-h-0 w-[94%] sm:w-[95%] lg:w-[96%] max-w-[1440px] mx-auto flex items-center justify-center"
      >
        <div className="relative w-full h-full rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden bg-black shadow-2xl shadow-black/10 border border-neutral-200/60 group">
          {/* Background Video */}
          <video
            ref={videoRef}
            poster="/images/technology-hero-poster.jpg"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            className="w-full h-full object-cover block select-none pointer-events-none"
          >
            <source src="/video/Comp%201_31.mp4" type="video/mp4" />
            <source src="/video/Comp 1_31.mp4" type="video/mp4" />
          </video>

          {/* Discreet Audio Toggle Button */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95 group pointer-events-auto"
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
