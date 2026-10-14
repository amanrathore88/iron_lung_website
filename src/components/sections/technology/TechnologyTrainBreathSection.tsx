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
  },
  {
    id: 2,
    title: "5 Modes",
    description:
      "Choose from 5 resistance levels: Easy, Moderate, Hard, Intense, or Beast Mode to match your training capacity.",
    targetFrame: 350,
    frameIndex: 56,
    poster: "/images/technology/sequence/seq_056.webp",
  },
  {
    id: 3,
    title: "Exercise",
    description:
      "Guided interactive respiratory training with live biofeedback and real-time lung capacity tracking.",
    targetFrame: 602,
    frameIndex: 89,
    poster: "/images/technology/sequence/seq_089.webp",
  },
  {
    id: 4,
    title: "UV Sanitization",
    description:
      "Integrated UV-C sterilization system cleanses the mouthpiece and airflow chamber after every session.",
    targetFrame: 820,
    frameIndex: 120,
    poster: "/images/technology/sequence/seq_120.webp",
  },
];

const TOTAL_FRAMES = 121;
const DEFAULT_POSTER = "/images/technology/sequence/seq_000.webp";

export const TechnologyTrainBreathSection: React.FC = () => {
  // Start with Point 1 active as shown in the design reference, defaulting to frame 0001 (index 0) on arrival
  const [activePointId, setActivePointId] = useState<number | null>(1);
  const [isLoaded, setIsLoaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const imagesCacheRef = useRef<HTMLImageElement[]>([]);

  // Draw a specific frame index onto the canvas
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesCacheRef.current[frameIdx];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Smooth ease-in-out cinematic animation loop between frame indices
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
      const frameDistance = Math.abs(totalDelta);

      // Slower, graceful cinematic pacing (~1.8s to 2.4s) so the camera rotation & zoom can be savored
      const durationMs = Math.max(1800, Math.min(2500, 1300 + frameDistance * 14));
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);

        // Sinusoidal ease-in-out: zero jerk at endpoints, natural acceleration & gentle deceleration
        const eased = 0.5 * (1 - Math.cos(Math.PI * progress));

        const nextFrame = Math.round(startFrame + totalDelta * eased);

        if (nextFrame !== currentFrameRef.current) {
          currentFrameRef.current = nextFrame;
          renderFrame(nextFrame);
        }

        if (progress < 1) {
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

  // Handle clicking an accordion item
  const handlePointClick = (point: AccordionPoint) => {
    setActivePointId(point.id);
    animateToFrame(point.frameIndex);
  };

  // Preload frames progressively
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    imagesCacheRef.current = images;

    // First preload keyframes immediately
    const keyIndices = [0, 31, 56, 89, 120];
    let loadedKeyCount = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/images/technology/sequence/seq_${String(i).padStart(3, "0")}.webp`;
      images[i] = img;

      if (keyIndices.includes(i)) {
        img.onload = () => {
          loadedKeyCount++;
          if (loadedKeyCount >= 2 && !isLoaded) {
            setIsLoaded(true);
            renderFrame(currentFrameRef.current);
          }
        };
      }
    }

    // Initial draw once canvas is mounted
    const timer = setTimeout(() => {
      renderFrame(0);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [renderFrame, isLoaded]);

  return (
    <section className="w-full bg-[#fcfaf7] py-6 sm:py-10 md:py-14 selection:bg-[#fb4403]/20 overflow-hidden">
      <div className="w-[94%] sm:w-[95%] lg:w-[96%] max-w-[1440px] mx-auto">
        {/* ================================================================= */}
        {/* ROUNDED CARD CONTAINER (Exact match to reference mockup)          */}
        {/* ================================================================= */}
        <div className="w-full bg-[#d9d9d9] rounded-[28px] sm:rounded-[36px] md:rounded-[44px] lg:rounded-[48px] p-6 sm:p-8 md:p-12 lg:p-14 xl:p-16 shadow-sm border border-neutral-300/40 relative overflow-hidden min-h-[540px] lg:min-h-[640px] xl:min-h-[680px] flex flex-col justify-center">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full z-20 relative">
            
            {/* =============================================================== */}
            {/* LEFT COLUMN: TITLE & ACCORDION OF 4 POINTS                      */}
            {/* =============================================================== */}
            <div className="lg:col-span-5 flex flex-col justify-center select-none">
              {/* Headline */}
              <div className="mb-6 sm:mb-8 md:mb-10">
                <h2 className="text-4xl xs:text-5xl sm:text-6xl lg:text-[54px] xl:text-[62px] font-black tracking-[-0.035em] leading-[0.98]">
                  <span className="block text-black">Train every</span>
                  <span className="block text-[#fb4403] mt-1 sm:mt-1.5">breath</span>
                </h2>
              </div>

              {/* Accordion List */}
              <div className="flex flex-col space-y-3 sm:space-y-3.5 w-full max-w-[440px]">
                {POINTS.map((point) => {
                  const isActive = activePointId === point.id;

                  return (
                    <div
                      key={point.id}
                      id={`accordion-point-${point.id}`}
                      onClick={() => handlePointClick(point)}
                      className={`w-full bg-white rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer shadow-xs border ${
                        isActive
                          ? "border-black/10 shadow-sm"
                          : "border-black/5 hover:border-black/15 hover:shadow-xs"
                      }`}
                    >
                      {/* Header Row */}
                      <button
                        type="button"
                        aria-expanded={isActive}
                        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-4.5 text-left focus:outline-none"
                      >
                        <span className="text-base sm:text-lg font-bold text-black tracking-tight">
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

                      {/* Expandable Description */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 sm:px-6 pb-5 pt-0 text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
                              {point.description}
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
          {/* Shifted slightly to the right with soft faded top/bottom/left     */}
          {/* =============================================================== */}
          <div className="relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 w-full lg:w-[58%] xl:w-[62%] h-full min-h-[360px] sm:min-h-[460px] lg:min-h-0 flex items-center justify-center lg:justify-end pointer-events-none z-10 lg:translate-x-5 xl:translate-x-9 2xl:translate-x-12">
            
            {/* Outer Wrapper: Vertical Mask for seamless top and bottom fade (removes render cutoff lines) */}
            <div
              className="w-full h-full flex items-center justify-center lg:justify-end"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
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
                  className="w-full h-full max-h-[580px] sm:max-h-[660px] lg:max-h-[740px] xl:max-h-[800px] object-contain scale-[1.04] sm:scale-105 lg:scale-[1.12] xl:scale-[1.16] origin-center lg:origin-right select-none block"
                />

                {/* Static Initial Fallback Image (Shows instantly before canvas draws) */}
                <img
                  src={DEFAULT_POSTER}
                  alt="IRONLUNG Train Every Breath Machine"
                  className={`absolute inset-0 w-full h-full object-contain scale-[1.04] sm:scale-105 lg:scale-[1.12] xl:scale-[1.16] origin-center lg:origin-right pointer-events-none transition-opacity duration-300 ${
                    isLoaded ? "opacity-0" : "opacity-100"
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
