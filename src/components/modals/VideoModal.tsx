import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden bg-[#02090F] border border-white/15 shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-[#061422]/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5E1E] shadow-[0_0_8px_rgba(255,94,30,0.8)] shrink-0" />
            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-white/90 uppercase font-semibold truncate">
              IronLung — Cinematic Engineering Reveal
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center group">
          <video
            ref={videoRef}
            src="/video/ironlung-reveal.mp4"
            autoPlay
            loop
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Center Play Overlay when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-black/60 border border-white/30 text-white flex items-center justify-center backdrop-blur-md hover:scale-110 transition-transform"
            >
              <Play size={32} className="fill-white translate-x-1" />
            </button>
          )}

          {/* Bottom Floating Control Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Progress Track */}
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
              <div
                className="h-full bg-[#FF5E1E] transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-white/80 text-xs">
              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="hover:text-white transition-colors">
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button onClick={toggleMute} className="hover:text-white transition-colors">
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <span className="font-mono text-[11px] text-white/50">4K 60FPS CINEMATIC CAD</span>
              </div>
              <button onClick={handleFullscreen} className="hover:text-white transition-colors">
                <Maximize2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
