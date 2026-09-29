import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Maximize2 } from 'lucide-react';

interface CinematicVideoSectionProps {
  /**
   * 0.0 to 1.0 progress across the video reveal runway after the Mobile Companion App stage.
   * - 0.00 -> 0.10: Hold on Mobile Companion App
   * - 0.10 -> 0.56: Smooth 3D portal rise & expansion transition
   * - 0.56 -> 1.00: Full-screen locked showcase playback
   */
  videoScrollProgress: number;
}

export const CinematicVideoSection: React.FC<CinematicVideoSectionProps> = ({
  videoScrollProgress,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);

  // Normalized transition progress (0.0 -> 1.0) across the [0.08, 0.54] scroll window
  const rawT = Math.min(1, Math.max(0, (videoScrollProgress - 0.08) / 0.46));
  // Smooth cubic-bezier-like quintic ease-in-out for silk-grade portal expansion
  const easeT =
    rawT < 0.5
      ? 4 * rawT * rawT * rawT
      : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

  const isVisible = videoScrollProgress > 0.04;
  const isFullyDocked = rawT >= 0.98;

  // Auto-play / pause management when entering or leaving the video showcase stage
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isVisible) {
      if (videoEl.paused && isPlaying) {
        videoEl.play().catch(() => {
          // Autoplay fallback if browser blocks unmuted; video is muted so it will succeed
        });
      }
    } else {
      if (!videoEl.paused) {
        videoEl.pause();
      }
    }
  }, [isVisible, isPlaying]);

  const handleTimeUpdate = () => {
    const videoEl = videoRef.current;
    if (!videoEl || !videoEl.duration) return;
    setPlaybackProgress((videoEl.currentTime / videoEl.duration) * 100);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (videoEl.paused) {
      videoEl.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoEl.pause();
      setIsPlaying(false);
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (videoEl.requestFullscreen) {
      videoEl.requestFullscreen();
    }
  };

  if (!isVisible) {
    return null;
  }

  // Transform choreography:
  // Rises from bottom (translateY: 88% -> 0%), expands from a floating rounded cinema card
  // (scale: 0.78 -> 1.00, rotateX: 10deg -> 0deg, borderRadius: 36px -> 0px) into full-screen black theater
  const translateYPct = (1 - easeT) * 88;
  const scaleVal = 0.78 + 0.22 * easeT;
  const rotateXDeg = (1 - easeT) * 10;
  const borderRadiusPx = Math.round((1 - easeT) * 36);
  const backdropOpacity = Math.min(1, rawT * 1.35);
  const rimGlowOpacity = Math.sin(rawT * Math.PI); // Peaks mid-transition, settles when docked
  const controlsOpacity = Math.min(1, Math.max(0, (rawT - 0.65) / 0.35));

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-[35] overflow-hidden"
      style={{
        pointerEvents: rawT >= 0.5 ? 'auto' : 'none',
        perspective: '1400px',
      }}
    >
      {/* Dimming Backdrop Veil over the receding Mobile Companion App section */}
      <div
        className="absolute inset-0 bg-[#050507] pointer-events-none transition-none"
        style={{
          opacity: backdropOpacity * 0.88,
        }}
      />

      {/* Expanding 3D Cinema Portal Container */}
      <div
        className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center will-change-transform"
        style={{
          transform: `translate3d(0, ${translateYPct.toFixed(2)}%, 0) scale(${scaleVal.toFixed(4)}) rotateX(${rotateXDeg.toFixed(2)}deg)`,
          transformOrigin: 'center bottom',
          borderRadius: `${borderRadiusPx}px`,
          boxShadow: isFullyDocked
            ? 'none'
            : `0 -24px 80px rgba(255, 85, 0, ${(0.38 * rimGlowOpacity).toFixed(3)}), 0 -4px 24px rgba(255, 120, 40, ${(0.45 * rimGlowOpacity).toFixed(3)}), 0 30px 90px rgba(0, 0, 0, 0.85)`,
          borderTop: isFullyDocked
            ? 'none'
            : `1.5px solid rgba(255, 105, 0, ${(0.65 * rimGlowOpacity + 0.15).toFixed(3)})`,
        }}
      >
        {/* Top Horizon Orange Laser Sweep (Visible as the portal rises and expands) */}
        {!isFullyDocked && (
          <div
            className="absolute top-0 inset-x-0 h-[2px] pointer-events-none z-30"
            style={{
              background:
                'linear-gradient(90deg, transparent 5%, rgba(255, 95, 20, 0.95) 35%, #FFFFFF 50%, rgba(255, 95, 20, 0.95) 65%, transparent 95%)',
              opacity: rimGlowOpacity,
              boxShadow: '0 0 24px 4px rgba(255, 85, 0, 0.75)',
            }}
          />
        )}

        {/* Subtle Ambient Radial Orange Studio Glow behind Video on Mobile Portrait */}
        <div
          className="absolute inset-0 pointer-events-none z-0 md:hidden"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(255, 85, 0, 0.12) 0%, rgba(255, 85, 0, 0.03) 48%, transparent 72%)',
          }}
        />

        {/* Core 3D Product Showcase Video (Resoures/35.mp4 -> /video/showcase-35.mp4) */}
        <video
          ref={videoRef}
          src="/video/showcase-35.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlay}
          className="relative z-10 w-full h-full object-contain md:object-cover select-none cursor-pointer bg-black"
        />

        {/* Subtle Top & Bottom Cinematic Vignette Gradients (keeps navbar & bottom controls crisp) */}
        <div
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 via-black/25 to-transparent pointer-events-none z-20"
          style={{ opacity: controlsOpacity }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-20"
          style={{ opacity: controlsOpacity }}
        />

        {/* Top Kicker Pill Badge (Appears smoothly once video portal docks) */}
        <div
          className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center"
          style={{
            opacity: controlsOpacity,
            transform: `translate(-50%, ${(1 - controlsOpacity) * -10}px)`,
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500] animate-pulse" />
            <span className="text-[9.5px] sm:text-[10.5px] font-extrabold tracking-[0.22em] text-white/90 uppercase">
              CINEMATIC HARDWARE SHOWCASE
            </span>
          </div>
        </div>

        {/* Bottom Floating Glassmorphic Playback & Progress Bar */}
        <div
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 sm:gap-4 px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-colors"
          style={{
            opacity: controlsOpacity,
            transform: `translate(-50%, ${(1 - controlsOpacity) * 12}px)`,
          }}
        >
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause showcase video' : 'Play showcase video'}
            className="w-7 h-7 rounded-full bg-[#FF5500] hover:bg-[#ff6a1f] text-white flex items-center justify-center transition-transform active:scale-95 shrink-0 shadow-[0_0_12px_rgba(255,85,0,0.5)]"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} className="translate-x-[1px]" />}
          </button>

          {/* Live Scrub / Progress Indicator */}
          <div className="w-28 xs:w-36 sm:w-48 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF5500] to-[#FF884D] rounded-full transition-all duration-100"
              style={{ width: `${playbackProgress}%` }}
            />
          </div>

          <button
            type="button"
            onClick={handleFullscreen}
            aria-label="Fullscreen video"
            className="text-white/75 hover:text-white transition-colors p-1 shrink-0"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CinematicVideoSection;
