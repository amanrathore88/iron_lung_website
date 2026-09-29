import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Maximize2 } from 'lucide-react';

interface CinematicVideoSectionProps {
  /**
   * 0.0 to 1.0 progress across the video reveal runway after the Mobile Companion App stage.
   */
  videoScrollProgress: number;
}

export const CinematicVideoSection: React.FC<CinematicVideoSectionProps> = ({
  videoScrollProgress,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);

  // Normalized transition progress (0.0 -> 1.0) across the [0.06, 0.54] scroll window
  const rawT = Math.min(1, Math.max(0, (videoScrollProgress - 0.06) / 0.48));
  // Smooth cubic ease-in-out
  const easeT =
    rawT < 0.5
      ? 4 * rawT * rawT * rawT
      : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

  const isVisible = videoScrollProgress > 0.04;

  // Auto-play / pause management when entering or leaving the video showcase stage
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isVisible) {
      if (videoEl.paused && isPlaying) {
        videoEl.play().catch(() => {});
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

  // Clean Apple-style Expanding Cinema Aperture + Counter-Scale Parallax:
  // As the Mobile Companion App zooms back into depth, the cinema frame glides into center,
  // smoothly unclips from a rounded cinema window (inset 12% 8% round 28px) to full-bleed (0%),
  // while the inner video counter-scales from 1.12 -> 1.00.
  const entryOpacity = Math.min(1, rawT / 0.34);
  const translateYVh = (1 - easeT) * 26;
  const insetY = (1 - easeT) * 12;
  const insetX = (1 - easeT) * 8;
  const radiusPx = Math.round((1 - easeT) * 28);
  const innerVideoScale = 1.12 - 0.12 * easeT;
  const controlsOpacity = Math.min(1, Math.max(0, (rawT - 0.72) / 0.28));

  return (
    <div
      className="absolute inset-0 w-full h-full z-[35] overflow-hidden flex items-center justify-center"
      style={{
        opacity: entryOpacity,
        pointerEvents: rawT >= 0.5 ? 'auto' : 'none',
      }}
    >
      {/* Expanding Rounded Cinema Viewport */}
      <div
        className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center will-change-transform"
        style={{
          transform: `translate3d(0, ${translateYVh.toFixed(2)}vh, 0)`,
          clipPath: `inset(${insetY.toFixed(2)}% ${insetX.toFixed(2)}% ${insetY.toFixed(2)}% ${insetX.toFixed(2)}% round ${radiusPx}px)`,
          WebkitClipPath: `inset(${insetY.toFixed(2)}% ${insetX.toFixed(2)}% ${insetY.toFixed(2)}% ${insetX.toFixed(2)}% round ${radiusPx}px)`,
        }}
      >
        {/* Core 3D Product Showcase Video with Counter-Scale Dolly Parallax */}
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
          className="relative z-10 w-full h-full object-contain md:object-cover select-none cursor-pointer bg-black will-change-transform"
          style={{
            transform: `scale(${innerVideoScale.toFixed(4)})`,
          }}
        />

        {/* Minimal Floating Glassmorphic Playback & Progress Pill */}
        <div
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 sm:gap-4 px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-colors"
          style={{
            opacity: controlsOpacity,
            transform: `translate(-50%, ${(1 - controlsOpacity) * 10}px)`,
          }}
        >
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause showcase video' : 'Play showcase video'}
            className="w-7 h-7 rounded-full bg-[#FF5500] hover:bg-[#ff6a1f] text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} className="translate-x-[1px]" />}
          </button>

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
