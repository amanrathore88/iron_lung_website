import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

interface AccordionPoint {
  id: number;
  title: string;
  description: string;
  targetFrame: number;
  frameIndex: number;
  poster: string;
  mobileImage: string;
  mobilePng: string;
  frameLabel: string;
}

const POINTS: AccordionPoint[] = [
  {
    id: 1,
    title: "Card Insert",
    description:
      "Smart card technology creates customized breathing exercises based on your age, weight, height, and health profile.",
    targetFrame: 325,
    frameIndex: 31,
    poster: "/images/technology/sequence/seq_031.webp",
    mobileImage: "/images/technology/points/point_0325.webp",
    mobilePng: "/images/technology/points/point_0325.png",
    frameLabel: "0325",
  },
  {
    id: 2,
    title: "5 Modes",
    description:
      "Choose from 5 resistance levels: Easy, Moderate, Hard, Intense, or Beast Mode to match your training capacity.",
    targetFrame: 350,
    frameIndex: 56,
    poster: "/images/technology/sequence/seq_056.webp",
    mobileImage: "/images/technology/points/point_0350.webp",
    mobilePng: "/images/technology/points/point_0350.png",
    frameLabel: "0350",
  },
  {
    id: 3,
    title: "Exercise",
    description:
      "Guided interactive respiratory training with live biofeedback and real-time lung capacity tracking.",
    targetFrame: 602,
    frameIndex: 89,
    poster: "/images/technology/sequence/seq_089.webp",
    mobileImage: "/images/technology/points/point_0602.webp",
    mobilePng: "/images/technology/points/point_0602.png",
    frameLabel: "0602",
  },
  {
    id: 4,
    title: "UV Sanitization",
    description:
      "Integrated UV-C sterilization system cleanses the mouthpiece and airflow chamber after every session.",
    targetFrame: 820,
    frameIndex: 120,
    poster: "/images/technology/sequence/seq_120.webp",
    mobileImage: "/images/technology/points/point_0820.webp",
    mobilePng: "/images/technology/points/point_0820.png",
    frameLabel: "0820",
  },
];

const TOTAL_FRAMES = 121;
const DEFAULT_POSTER = "/images/technology/sequence/seq_000.webp";

export const TechnologyTrainBreathSection: React.FC = () => {
  // All accordion points start closed on arrival so the section showcases the full machine (Frame 0001)
  const [activePointId, setActivePointId] = useState<number | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const imagesCacheRef = useRef<HTMLImageElement[]>([]);

  // Draw a specific frame index onto the canvas with zero-latency pre-decoded images
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesCacheRef.current[frameIdx];
    if (img && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Rock-steady cinematic frame player: avoids velocity spikes, stutters, and frame drops
  const animateToFrame = useCallback(
    (targetIdx: number) => {
      targetFrameRef.current = targetIdx;

      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }

      const startFrame = currentFrameRef.current;
      const targetFrame = targetIdx;

      if (startFrame === targetFrame) {
        renderFrame(targetFrame);
        return;
      }

      const totalDelta = targetFrame - startFrame;
      const totalFrames = Math.abs(totalDelta);
      const direction = Math.sign(totalDelta);

      // Pacing:
      // Adjacent points (<= 35 frames delta, ~25-33 frames): steady 44ms per frame (~23fps)
      // Provides deliberate, calm, and graceful camera moves (~1.1s to 1.5s).
      // Long distance transitions (> 35 frames, e.g. 89 frames from UV to Card Insert):
      // Paced steadily over ~2.4s without artificial velocity spikes or stutters.
      const frameIntervalMs =
        totalFrames <= 35
          ? 44
          : Math.max(25, Math.floor(2400 / totalFrames));

      let lastTime = performance.now();
      let accumulator = 0;
      let current = startFrame;

      const step = (now: number) => {
        const delta = now - lastTime;
        lastTime = now;
        accumulator += delta;

        let frameChanged = false;

        while (accumulator >= frameIntervalMs && current !== targetFrame) {
          current += direction;
          accumulator -= frameIntervalMs;
          frameChanged = true;
        }

        if (frameChanged) {
          currentFrameRef.current = current;
          renderFrame(current);
        }

        if (current !== targetFrame) {
          animFrameIdRef.current = requestAnimationFrame(step);
        } else {
          currentFrameRef.current = targetFrame;
          renderFrame(targetFrame);
          animFrameIdRef.current = null;
        }
      };

      animFrameIdRef.current = requestAnimationFrame(step);
    },
    [renderFrame]
  );

  // Toggleable accordion interaction:
  // - Clicking any closed point expands it and animates camera to that point's frame
  // - Clicking an already-open point collapses it and smoothly returns camera to Frame 0001 (Overview)
  const handlePointClick = (point: AccordionPoint) => {
    if (activePointId === point.id) {
      setActivePointId(null);
      animateToFrame(0);
    } else {
      setActivePointId(point.id);
      animateToFrame(point.frameIndex);
    }
  };

  // Preload and off-thread decode all 121 frames once on mount
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    imagesCacheRef.current = images;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/images/technology/sequence/seq_${String(i).padStart(3, "0")}.webp`;
      if (typeof img.decode === "function") {
        img.decode().catch(() => {});
      }
      images[i] = img;

      if (i === 0) {
        img.onload = () => {
          setCanvasReady(true);
          renderFrame(0);
        };
      }
    }

    // Safety fallback draw after mounting
    const timer = setTimeout(() => {
      setCanvasReady(true);
      renderFrame(0);
    }, 120);

    return () => {
      clearTimeout(timer);
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [renderFrame]);

  return (
    <section className="w-full bg-[#fcfaf7] py-6 sm:py-10 md:py-14 selection:bg-[#fb4403]/20 overflow-hidden">
      <div className="w-[94%] sm:w-[95%] lg:w-[96%] max-w-[1440px] mx-auto">
        {/* ================================================================= */}
        {/* ROUNDED CARD CONTAINER (White card on #fcfaf7 page background)    */}
        {/* ================================================================= */}
        <div className="w-full bg-white rounded-[24px] xs:rounded-[28px] sm:rounded-[36px] md:rounded-[44px] lg:rounded-[48px] p-5 xs:p-6 sm:p-8 md:p-12 lg:p-14 xl:p-16 shadow-sm border border-neutral-200/70 relative overflow-hidden min-h-0 lg:min-h-[640px] xl:min-h-[680px] flex flex-col justify-center">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center w-full z-20 relative">
            
            {/* =============================================================== */}
            {/* LEFT COLUMN: TITLE & ACCORDION OF 4 POINTS                      */}
            {/* =============================================================== */}
            <div className="lg:col-span-5 flex flex-col justify-center select-none">
              {/* Headline */}
              <div className="mb-5 sm:mb-8 md:mb-10">
                <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[54px] xl:text-[62px] font-black tracking-[-0.035em] leading-[0.98]">
                  <span className="block text-black">Train every</span>
                  <span className="block text-[#fb4403] mt-1 sm:mt-1.5">breath</span>
                </h2>
              </div>

              {/* Accordion List */}
              <div className="flex flex-col space-y-2.5 sm:space-y-3.5 w-full max-w-full lg:max-w-[440px]">
                {POINTS.map((point) => {
                  const isActive = activePointId === point.id;

                  return (
                    <div
                      key={point.id}
                      id={`accordion-point-${point.id}`}
                      className={`w-full bg-[#fcfaf7] rounded-xl sm:rounded-2xl transition-all duration-300 shadow-xs border ${
                        isActive
                          ? "border-neutral-300 shadow-xs"
                          : "border-neutral-200/70 hover:border-neutral-300 hover:shadow-xs"
                      }`}
                    >
                      {/* Header Row */}
                      <button
                        type="button"
                        onClick={() => handlePointClick(point)}
                        aria-expanded={isActive}
                        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-4.5 text-left focus:outline-none cursor-pointer group"
                      >
                        <span className="text-base sm:text-lg font-medium text-neutral-800 tracking-tight">
                          {point.title}
                        </span>
                        <span className="flex-shrink-0 ml-4 transition-transform duration-300">
                          {isActive ? (
                            <ChevronUp className="w-5 h-5 text-[#fb4403]" strokeWidth={2.6} />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" strokeWidth={2.4} />
                          )}
                        </span>
                      </button>

                      {/* Expandable Description & Mobile Framed Preview Image */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 sm:px-6 pb-5 pt-0 text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
                              <p>{point.description}</p>

                              {/* Mobile-Only Framed Preview Image for this point */}
                              <div className="block lg:hidden mt-3.5">
                                <div className="relative w-full rounded-2xl overflow-hidden bg-white border border-neutral-200/90 shadow-[0_6px_22px_rgba(0,0,0,0.06)] p-2 sm:p-2.5">
                                  {/* Matting area with subtle warm backdrop */}
                                  <div className="relative w-full aspect-[16/10] xs:aspect-[16/9] rounded-xl bg-gradient-to-b from-[#FAF7F2] to-[#F3EDE7] flex items-center justify-center overflow-hidden border border-neutral-200/50">
                                    <picture>
                                      <source srcSet={point.mobileImage} type="image/webp" />
                                      <img
                                        src={point.mobilePng}
                                        alt={`IRONLUNG ${point.title} (Frame ${point.frameLabel})`}
                                        className="w-full h-full object-contain p-2 select-none"
                                        loading="eager"
                                      />
                                    </picture>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Empty space placeholder for desktop grid (since canvas fills right side) */}
            <div className="hidden lg:block lg:col-span-7 pointer-events-none" />

          </div>

          {/* =============================================================== */}
          {/* RIGHT SIDE / CANVAS 3D MACHINE FRAME ANIMATION CONTAINER         */}
          {/* Desktop-only: preserved exactly as it is without alteration      */}
          {/* =============================================================== */}
          <div className="hidden lg:flex lg:absolute lg:right-0 lg:top-0 lg:bottom-0 w-full lg:w-[58%] xl:w-[62%] h-full min-h-0 flex items-center justify-end pointer-events-none z-10 lg:translate-x-5 xl:translate-x-9 2xl:translate-x-12">
            
            {/* Outer Wrapper: Vertical Mask for seamless top and bottom fade (removes render cutoff lines) */}
            <div
              className="w-full h-full flex items-center justify-center lg:justify-end"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
              }}
            >
              {/* Inner Wrapper: Horizontal Mask for smooth fade towards accordion text column */}
              <div
                className="relative w-full h-full flex items-center justify-center lg:justify-end"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, black 8%, black 100%)",
                  maskImage:
                    "linear-gradient(to right, transparent 0%, black 8%, black 100%)",
                }}
              >
                {/* HTML5 Transparent Canvas Sequence Player */}
                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={720}
                  className="w-full h-full max-h-[460px] sm:max-h-[580px] lg:max-h-[740px] xl:max-h-[800px] object-contain scale-100 sm:scale-105 lg:scale-[1.12] xl:scale-[1.16] origin-center lg:origin-right select-none block"
                />

                {/* Static Initial Fallback Image (Shows instantly before canvas draws) */}
                <img
                  src={DEFAULT_POSTER}
                  alt="IRONLUNG Train Every Breath Machine"
                  className={`absolute inset-0 w-full h-full object-contain scale-100 sm:scale-105 lg:scale-[1.12] xl:scale-[1.16] origin-center lg:origin-right pointer-events-none transition-opacity duration-300 ${
                    canvasReady ? "opacity-0" : "opacity-100"
                  }`}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TechnologyTrainBreathSection;
