import React, { useRef, useState } from "react";
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
    <section className="relative w-full h-[82vh] sm:h-[85vh] lg:h-[88vh] min-h-[520px] max-h-[880px] overflow-hidden bg-black select-none">
      {/* Full-bleed background video covering the entire hero section */}
      <video
        ref={videoRef}
        src="/video/ironlung-shots.mp4"
        poster="/images/technology-hero-poster.jpg"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover block"
      />

      {/* Subtle discreet audio toggle in the bottom corner */}
      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute video audio" : "Mute video audio"}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 p-3 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white transition-all duration-200 cursor-pointer shadow-xl hover:scale-105 active:scale-95 group"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white/80 group-hover:text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-[#ff6900] animate-pulse" />
        )}
      </button>
    </section>
  );
};

export default TechnologyHeroSection;
