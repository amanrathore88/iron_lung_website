import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  ArrowRight,
  Gauge,
  Tv,
  Zap
} from "lucide-react";
import { KineticText } from "../../ui/kinetic-text";

interface TechnologyHeroSectionProps {
  onBookDemo?: () => void;
  onContactUs?: () => void;
}

export const TechnologyHeroSection: React.FC<TechnologyHeroSectionProps> = ({
  onBookDemo,
  onContactUs,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:20");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);

  // Sync play state
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Toggle Mute / Unmute
  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  // Toggle native fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch((err) => {
        console.warn("Fullscreen request failed:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.warn("Exit fullscreen failed:", err);
      });
      setIsFullscreen(false);
    }
  };

  // Time formatting helper (e.g. 00:14)
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    if (total > 0) {
      setProgress((current / total) * 100);
      setCurrentTime(formatTime(current));
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(formatTime(videoRef.current.duration));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = percentage * videoRef.current.duration;
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-background pt-24 sm:pt-28 md:pt-36 pb-20 sm:pb-28">
      {/* Background Soft Glow & Fine Geometric Grid Texture */}
      <div className="absolute top-0 inset-x-0 h-[640px] pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff6900]/[0.09] via-transparent to-transparent blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(#ff6900_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.03] pointer-events-none -z-10" />

      {/* =================================================================== */}
      {/* 1. HERO HEADER: TITLE, BADGE, AND OVERVIEW                          */}
      {/* =================================================================== */}
      <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 text-center mb-10 sm:mb-14 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4 sm:space-y-6 max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Hardware & Engineering Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff6900]/10 border border-[#ff6900]/25 text-[#ff6900] text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase shadow-xs">
            <Cpu className="w-3.5 h-3.5 animate-pulse text-[#ff6900]" />
            <span>Industrial Hardware & Architecture</span>
          </div>

          {/* Headline with Signature KineticText */}
          <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-foreground uppercase leading-[1.04] flex items-center justify-center gap-x-3 sm:gap-x-4 flex-wrap">
            <KineticText text="Engineered" as="h1" className="text-foreground tracking-tight" />
            <KineticText text="Precision" as="span" className="text-[#ff6900] tracking-tight" />
          </div>

          {/* Sub-headline Description */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium max-w-2xl 2xl:max-w-3xl mx-auto leading-relaxed">
            Witness the union of medical-grade pneumatic resistance, real-time biometric telemetry, and high-performance human biomechanics in action.
          </p>

          {/* Quick Hardware Spec Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-foreground/80 font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border/80 shadow-xs">
              <Tv className="w-3.5 h-3.5 text-[#ff6900]" />
              22" HD Interactive Console
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border/80 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-[#ff6900]" />
              Pneumatic Resistance Core
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border/80 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff6900]" />
              Automated UV-C Hygiene
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border/80 shadow-xs">
              <Activity className="w-3.5 h-3.5 text-[#ff6900]" />
              Dynamic Biofeedback Waveforms
            </span>
          </div>
        </motion.div>
      </div>

      {/* =================================================================== */}
      {/* 2. CINEMATIC VIDEO SHOWCASE FRAME                                   */}
      {/* =================================================================== */}
      <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 mb-14 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative group"
        >
          {/* Subtle Ambient Backlight Glow behind Video Monitor Bezel */}
          <div className="absolute -inset-1 sm:-inset-2.5 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-r from-[#ff6900]/25 via-[#ff7700]/30 to-[#ff5500]/25 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />

          {/* Main Video Viewport Container */}
          <div
            ref={containerRef}
            onMouseEnter={() => setIsHoveringVideo(true)}
            onMouseLeave={() => setIsHoveringVideo(false)}
            className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A1118] border border-black/10 dark:border-white/10 shadow-[0_24px_55px_-12px_rgba(0,0,0,0.35),0_8px_20px_-6px_rgba(255,105,0,0.18)] select-none"
          >
            {/* HTML5 Native Video Tag with Autoplay, Muted Loop & Smooth Poster */}
            <video
              ref={videoRef}
              src="/video/ironlung-shots.mp4"
              poster="/images/technology-hero-poster.jpg"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer block"
            />

            {/* Subtle Gradient Overlays for High-End Cinematic Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Top Bar Floating Brand Watermark & Sound Prompt */}
            <div className="absolute top-3 sm:top-5 inset-x-3 sm:inset-x-6 flex items-center justify-between pointer-events-none z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-xs font-mono font-semibold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-[#ff6900] animate-ping" />
                <span>Iron Lung · Hardware Showcase</span>
              </div>

              {/* Sound Status Pill Indicator */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="pointer-events-auto cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white text-[10px] sm:text-xs font-medium transition-all shadow-sm"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-[#ff6900]" />
                    <span>Unmute Sound</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Audio Active</span>
                  </>
                )}
              </div>
            </div>

            {/* Center Floating Big Play/Pause Trigger (Appears when paused or on hover) */}
            {(!isPlaying || isHoveringVideo) && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center pointer-events-auto cursor-pointer z-20 transition-opacity duration-300"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 hover:bg-[#ff6900] backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95">
                  {isPlaying ? (
                    <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                  )}
                </div>
              </div>
            )}

            {/* Bottom Glassmorphic Control Bar with Timeline Scrubber */}
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 z-20 pointer-events-auto flex flex-col justify-end">
              {/* Interactive Timeline Progress Bar */}
              <div
                onClick={handleSeek}
                className="group/scrub w-full h-1.5 hover:h-2.5 bg-white/25 rounded-full mb-3 cursor-pointer relative overflow-hidden transition-all duration-150"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#ff6900] to-[#ff8800] rounded-full relative transition-all"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md opacity-0 group-hover/scrub:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between text-white text-xs sm:text-sm font-medium">
                {/* Left: Play/Pause & Time */}
                <div className="flex items-center gap-2.5 sm:gap-4">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-current text-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-current text-white ml-0.5" />
                    )}
                  </button>

                  <div className="text-[11px] sm:text-xs font-mono tracking-wider text-white/90">
                    <span className="text-white font-bold">{currentTime}</span>
                    <span className="text-white/50 mx-1">/</span>
                    <span className="text-white/60">{duration}</span>
                  </div>
                </div>

                {/* Right: Sound Toggle & Fullscreen */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#ff6900]" />
                    )}
                    <span className="hidden xs:inline text-[11px] font-mono">
                      {isMuted ? "MUTED" : "SOUND ON"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
                    aria-label="Toggle Fullscreen"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4 text-white" />
                    ) : (
                      <Maximize2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =================================================================== */}
      {/* 3. FOUR ARCHITECTURAL HIGHLIGHT CARDS & CALL-TO-ACTION              */}
      {/* =================================================================== */}
      <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
        {/* Engineering Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12 sm:mb-16">
          {[
            {
              icon: Gauge,
              title: "Pneumatic Resistance",
              spec: "8 to 85 cmH2O Load",
              desc: "Fast sub-millisecond adaptive valve regulation tailoring breathing resistance to every breath phase.",
            },
            {
              icon: Tv,
              title: "22-Inch Live Console",
              spec: "1080p Telemetry",
              desc: "Instant biological flow and tidal volume curves displayed with zero latency during high-intensity training.",
            },
            {
              icon: ShieldCheck,
              title: "Automated UV-C Hygiene",
              spec: "99.9% Sterilization",
              desc: "Built-in sanitization cycle activates automatically post-session for continuous medical-grade hygiene.",
            },
            {
              icon: Zap,
              title: "Cloud & RFID Integration",
              spec: "Instant Identification",
              desc: "Single-tap profile recognition syncing session telemetry across private web portals and mobile companions.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="group/card bg-card/85 backdrop-blur-sm border border-border/80 hover:border-[#ff6900]/40 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#ff6900]/10 flex items-center justify-center text-[#ff6900] mb-4 group-hover/card:scale-110 transition-transform">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold font-display text-foreground mb-1">
                  {feature.title}
                </h3>
                <span className="text-[11px] font-mono font-semibold text-[#ff6900] uppercase tracking-wider block mb-2">
                  {feature.spec}
                </span>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons: Book Demo & Contact Architecture */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5">
          <button
            type="button"
            onClick={onBookDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full bg-[#ff6900] hover:bg-[#e05d00] text-white font-medium text-base shadow-[0_8px_24px_rgba(255,105,0,0.28)] hover:shadow-[0_12px_28px_rgba(255,105,0,0.36)] transition-all duration-200 cursor-pointer"
          >
            <span>Book a Live Demonstration</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onContactUs}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-full bg-card hover:bg-card/90 border border-border text-foreground font-medium text-base shadow-xs hover:border-[#ff6900]/40 transition-all duration-200 cursor-pointer"
          >
            <span>Speak with Engineering</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TechnologyHeroSection;
