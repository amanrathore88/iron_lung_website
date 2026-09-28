import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BarChart3, Heart, SlidersHorizontal, ArrowRight, Play } from 'lucide-react';

interface DashboardSectionOverlayProps {
  scrollProgress: number; // 0.0 to 1.0 (controls reveal sweep from 0.88 to 0.98)
  frameProgress?: number; // 0.0 to 1.0 (controls video frames 1 to 120)
  onExploreDashboard?: () => void;
  onOpenVideo?: () => void;
}

const TOTAL_FRAMES = 120;

export const DashboardSectionOverlay: React.FC<DashboardSectionOverlayProps> = ({
  scrollProgress,
  frameProgress = 0,
  onExploreDashboard,
  onOpenVideo,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const loadedSetRef = useRef<Set<number>>(new Set());
  const [frame1Loaded, setFrame1Loaded] = useState<boolean>(false);
  const currentRenderedFrameRef = useRef<number>(-1);
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;

  // ---------------------------------------------------------------------------
  // 1. Physical Airplane-Style Sweep Reveal Architecture (0.88 - 0.98)
  // ---------------------------------------------------------------------------
  // Synchronized in lockstep with the 3D model's flight trajectory across the screen.
  // Stage 4 chair center: 15.5vw (s4X = 0.345)
  // Stage 5 exit: ~120vw (s5X = -0.70)
  const t = Math.min(1, Math.max(0, (scrollProgress - 0.88) / 0.10));
  const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const modelCenterPct = 15.5 + ease * 104.5;
  const revealPct = Math.min(116, Math.max(0, modelCenterPct + 2));

  // Mobile / Tablet Elevation Reveal (0.885 - 0.98)
  const mobileProgress = Math.min(1, Math.max(0, (scrollProgress - 0.885) / 0.095));
  const mobileEase =
    mobileProgress < 0.5
      ? 4 * mobileProgress * mobileProgress * mobileProgress
      : 1 - Math.pow(-2 * mobileProgress + 2, 3) / 2;

  // Soft Gradient / Cloudy Edge Transition (Desktop sweep)
  const feather = 18;
  const fadeStart = Math.max(0, revealPct - feather);
  const fadeMid1 = Math.max(0, revealPct - feather * 0.60);
  const fadeMid2 = Math.max(0, revealPct - feather * 0.25);
  const fadeEnd = Math.min(100, revealPct);

  // When fully revealed (revealPct >= 99.5) or on mobile/tablet, disable CSS mask to avoid GPU lag
  const maskGradient =
    revealPct >= 99.5 || !isDesktop
      ? undefined
      : `linear-gradient(to right, #000 0%, #000 ${fadeStart}%, rgba(0, 0, 0, 0.88) ${fadeMid1}%, rgba(0, 0, 0, 0.42) ${fadeMid2}%, rgba(0, 0, 0, 0.08) ${
          fadeMid2 + (fadeEnd - fadeMid2) * 0.7
        }%, transparent ${fadeEnd}%, transparent 100%)`;

  const isInteractive = scrollProgress >= 0.98;

  // ---------------------------------------------------------------------------
  // 2. High-Performance Canvas Image Sequence Renderer
  // ---------------------------------------------------------------------------
  const renderFrameToCanvas = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pick target image, or fallback to the nearest available loaded frame
    let img: HTMLImageElement | undefined = framesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Find closest loaded frame
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = frameIndex - offset;
        const next = frameIndex + offset;
        if (prev >= 1 && framesRef.current[prev]?.complete && framesRef.current[prev]?.naturalWidth > 0) {
          img = framesRef.current[prev];
          break;
        }
        if (next <= TOTAL_FRAMES && framesRef.current[next]?.complete && framesRef.current[next]?.naturalWidth > 0) {
          img = framesRef.current[next];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    if (cw === 0 || ch === 0 || iw === 0 || ih === 0) return;

    ctx.clearRect(0, 0, cw, ch);

    // Object-fit: cover calculation
    const canvasRatio = cw / ch;
    const imageRatio = iw / ih;
    let drawW: number;
    let drawH: number;
    let drawX: number;
    let drawY: number;

    if (canvasRatio > imageRatio) {
      // Viewport is wider than 16:9
      drawW = cw;
      drawH = cw / imageRatio;
      drawX = 0;
      drawY = (ch - drawH) / 2;
    } else {
      // Viewport is narrower/taller than 16:9 (e.g. laptop, tablet, mobile)
      drawH = ch;
      drawW = ch * imageRatio;
      // Anchor to the right edge (focalFactor = 1.0 on desktop) so devices stay cleanly in the right column
      // On mobile, center the dramatic rock & phone composition
      const focalFactor = cw < 768 ? 0.60 : 1.0;
      drawX = (cw - drawW) * focalFactor;
      drawY = 0;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    currentRenderedFrameRef.current = frameIndex;
  }, []);

  // ---------------------------------------------------------------------------
  // 3. Progressive Frame Preloading Engine (Zero-flicker background caching)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // 1. Immediately prioritize and load Frame 1
    const frame1 = new Image();
    frame1.src = '/dashboard-frames/ezgif-frame-001.jpg';
    framesRef.current[1] = frame1;

    frame1.onload = () => {
      loadedSetRef.current.add(1);
      setFrame1Loaded(true);
      renderFrameToCanvas(1);
    };

    // 2. Preload remaining 119 frames in the background
    let isCancelled = false;
    const preloadAll = async () => {
      for (let i = 2; i <= TOTAL_FRAMES; i++) {
        if (isCancelled) break;
        const img = new Image();
        const paddedIndex = String(i).padStart(3, '0');
        img.src = `/dashboard-frames/ezgif-frame-${paddedIndex}.jpg`;
        framesRef.current[i] = img;

        img.onload = () => {
          loadedSetRef.current.add(i);
          // If the user is currently waiting on or near this frame, render it
          const currentTarget = Math.min(
            TOTAL_FRAMES,
            Math.max(1, Math.round(1 + frameProgress * (TOTAL_FRAMES - 1)))
          );
          if (Math.abs(currentTarget - i) <= 1) {
            renderFrameToCanvas(currentTarget);
          }
        };

        // Small micro-yield every 6 frames to keep the main thread fluid
        if (i % 6 === 0) {
          await new Promise((r) => setTimeout(r, 12));
        }
      }
    };

    // Begin background preloading after initial paint
    const timer = setTimeout(() => {
      preloadAll();
    }, 100);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [renderFrameToCanvas]);

  // ---------------------------------------------------------------------------
  // 4. Handle Canvas Resize with High-DPI Support
  // ---------------------------------------------------------------------------
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const targetFrame = Math.min(
      TOTAL_FRAMES,
      Math.max(1, Math.round(1 + frameProgress * (TOTAL_FRAMES - 1)))
    );
    renderFrameToCanvas(targetFrame);
  }, [frameProgress, renderFrameToCanvas]);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  // ---------------------------------------------------------------------------
  // 5. Scroll-Driven Frame Scrubbing Loop
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // When scrollProgress is in reveal sweep (< 0.98), lock to frame 1
    // Once dashboard is revealed and frameProgress advances, scrub frames 1 -> 120
    const targetFrame =
      scrollProgress < 0.98 && frameProgress <= 0.01
        ? 1
        : Math.min(TOTAL_FRAMES, Math.max(1, Math.round(1 + frameProgress * (TOTAL_FRAMES - 1))));

    if (currentRenderedFrameRef.current !== targetFrame) {
      renderFrameToCanvas(targetFrame);
    }
  }, [frameProgress, scrollProgress, renderFrameToCanvas]);

  if (scrollProgress < 0.86) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden ${
        isInteractive ? 'z-[30]' : 'z-[15]'
      } bg-[#FAF7F2]`}
      style={{
        maskImage: maskGradient,
        WebkitMaskImage: maskGradient,
        opacity: isDesktop ? 1.0 : mobileEase,
        transform: isDesktop ? undefined : `translateY(${(1 - mobileEase) * 20}px)`,
        pointerEvents: isInteractive ? 'auto' : 'none',
      }}
    >
      {/* Soft Atmospheric Cloudy Mist along the leading transition edge (Desktop only) */}
      {isDesktop && revealPct > 5 && revealPct < 105 && (
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-30"
          style={{
            left: `${fadeMid1}%`,
            width: '240px',
            transform: 'translateX(-50%)',
            background:
              'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.48) 0%, rgba(254, 251, 247, 0.22) 50%, transparent 80%)',
            filter: 'blur(24px)',
          }}
        />
      )}

      {/* Top Header Soft Fade (smooth blend beneath white navbar) */}
      <div className="absolute inset-x-0 top-0 h-16 sm:h-20 bg-gradient-to-b from-white/80 via-white/30 to-transparent pointer-events-none z-[25]" />

      {/* ===================================================================== */}
      {/* 1. REAL-TIME VIDEO FRAMES BACKGROUND CANVAS                           */}
      {/* ===================================================================== */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{
          opacity: frame1Loaded ? 1.0 : 0.0,
          transition: 'opacity 0.3s ease-out',
        }}
      />

      {/* Desktop/Tablet Ambient Daylight Readability Gradient on the Left (protects text contrast across all ratios) */}
      <div
        className="hidden md:block absolute inset-y-0 left-0 w-full md:w-[62%] lg:w-[48%] pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to right, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.92) 40%, rgba(255, 255, 255, 0.55) 75%, transparent 100%)',
        }}
      />

      {/* Mobile Atmospheric Frosted Wash (ensures total readability on narrow portrait screens while letting animated background show through) */}
      <div
        className="block md:hidden absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.90) 65%, rgba(255, 255, 255, 0.70) 90%, rgba(255, 255, 255, 0.50) 100%)',
        }}
      />

      {/* ===================================================================== */}
      {/* 2. TOP RIGHT FLOATING METRIC LABELS (media_1790581999203.png)          */}
      {/* ===================================================================== */}
      <div className="hidden lg:flex absolute top-20 sm:top-24 right-8 sm:right-14 z-20 flex-col items-end gap-1 pointer-events-none select-none">
        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-slate-400 font-mono">
          BREATHE
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-slate-400 font-mono">
          TRACK
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-slate-400 font-mono">
          IMPROVE
        </span>
        <div className="w-6 h-[2px] bg-[#ff6900] mt-1.5" />
      </div>

      {/* ===================================================================== */}
      {/* 3. MAIN CONTENT COLUMN (Pixel-perfect to media_1790581999203.png)       */}
      {/* ===================================================================== */}
      <div className="relative z-20 w-full h-full flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 xl:px-24 pointer-events-auto">
        <div className="max-w-xl xl:max-w-2xl py-8 sm:py-12">
          {/* Top Label */}
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <span className="w-6 sm:w-8 h-[2px] bg-[#ff6900]" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-slate-500 uppercase font-mono">
              USER DASHBOARD
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.65rem] font-black tracking-tight leading-[1.08] text-slate-950 font-display mb-3 sm:mb-4">
            More Than Data.
            <br />
            <span className="text-[#ff6900]">A Healthier You.</span>
          </h2>

          {/* Sub-heading / Description */}
          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-[490px] mb-6 sm:mb-7 font-normal">
            Your personal dashboard brings everything together — track your sessions, analyze your progress and stay
            motivated on your journey to better breathing.
          </p>

          {/* Timeline / Feature Points */}
          <div className="relative pl-6 sm:pl-7 flex flex-col gap-4 sm:gap-5 mb-7 sm:mb-8 max-w-[490px]">
            {/* Connecting Vertical Gray Line */}
            <div className="absolute left-[7px] sm:left-[8px] top-3 bottom-4 w-[1.5px] bg-slate-200" />

            {/* Feature 1: Track Progress */}
            <div className="relative flex items-center gap-3.5 sm:gap-4 group">
              {/* Timeline Orange Node */}
              <div className="absolute -left-[21px] sm:-left-[23px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#ff6900] ring-4 ring-white" />

              {/* Icon Container */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF6EE] border border-[#ff6900]/20 flex items-center justify-center shrink-0 text-[#ff6900] shadow-sm transition-transform duration-200 group-hover:scale-105">
                <BarChart3 className="w-5 h-5 text-[#ff6900]" />
              </div>

              {/* Text */}
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Track Progress
                </h3>
                <p className="text-slate-500 text-xs sm:text-[13px] leading-snug">
                  View session history, performance trends and improvements over time.
                </p>
              </div>
            </div>

            {/* Feature 2: Health Insights */}
            <div className="relative flex items-center gap-3.5 sm:gap-4 group">
              {/* Timeline Orange Node */}
              <div className="absolute -left-[21px] sm:-left-[23px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#ff6900] ring-4 ring-white" />

              {/* Icon Container */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF6EE] border border-[#ff6900]/20 flex items-center justify-center shrink-0 text-[#ff6900] shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Heart className="w-5 h-5 text-[#ff6900]" />
              </div>

              {/* Text */}
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Health Insights
                </h3>
                <p className="text-slate-500 text-xs sm:text-[13px] leading-snug">
                  Understand your breathing patterns with easy-to-read analytics.
                </p>
              </div>
            </div>

            {/* Feature 3: Personalized Experience */}
            <div className="relative flex items-center gap-3.5 sm:gap-4 group">
              {/* Timeline Orange Node */}
              <div className="absolute -left-[21px] sm:-left-[23px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#ff6900] ring-4 ring-white" />

              {/* Icon Container */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF6EE] border border-[#ff6900]/20 flex items-center justify-center shrink-0 text-[#ff6900] shadow-sm transition-transform duration-200 group-hover:scale-105">
                <SlidersHorizontal className="w-5 h-5 text-[#ff6900]" />
              </div>

              {/* Text */}
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Personalized Experience
                </h3>
                <p className="text-slate-500 text-xs sm:text-[13px] leading-snug">
                  Set goals, customize settings and make the program your own.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-4 sm:gap-6 mb-6 sm:mb-7">
            {/* Primary Button */}
            <button
              onClick={onExploreDashboard}
              className="px-6 sm:px-7 py-3 rounded-full bg-[#ff6900] hover:bg-[#e65c00] active:scale-[0.98] text-white font-bold text-xs sm:text-sm md:text-base shadow-lg shadow-[#ff6900]/25 flex items-center gap-2.5 transition-all group cursor-pointer"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Secondary Button */}
            <button
              onClick={onOpenVideo}
              className="flex items-center gap-2.5 sm:gap-3 text-slate-900 font-bold text-xs sm:text-sm md:text-base group hover:text-[#ff6900] transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-300 bg-white flex items-center justify-center shadow-sm group-hover:border-[#ff6900] group-hover:scale-105 transition-all">
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900 fill-slate-900 ml-0.5 group-hover:text-[#ff6900] group-hover:fill-[#ff6900] transition-colors" />
              </div>
              <span>Watch Video</span>
            </button>
          </div>

          {/* Bottom Tagline */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="w-5 sm:w-6 h-[2px] bg-[#ff6900]" />
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold tracking-[0.25em] text-slate-400 uppercase font-mono">
              SAME BREATH, A BRIGHTER TOMORROW.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSectionOverlay;
