"use client";

import * as React from "react";
import {
  HTMLMotionProps,
  MotionValue,
  Variants,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KineticText } from "./ui/kinetic-text";

// ---------------------------------------------------------------------------
// 1. EXACT PRIMITIVES AS SPECIFIED BY THE USER (With Arrival-Completion Timing)
// ---------------------------------------------------------------------------

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
}

interface ContainerInsetProps extends HTMLMotionProps<"div"> {
  insetYRange?: [number, number];
  insetXRange?: [number, number];
  roundednessRange?: [number, number];
}

const SPRING_TRANSITION_CONFIG = {
  type: "spring" as const,
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
};

const variants: Variants = {
  hidden: {
    filter: "blur(10px)",
    opacity: 0,
  },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
  },
};

const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined);

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext);
  if (!context) {
    throw new Error(
      "useContainerScrollContext must be used within a ContainerScroll Component"
    );
  }
  return context;
}

export const ContainerScroll: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...props }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  // Animation starts as section enters view and ENDS completely as section arrives in view ("start 30%")
  // This ensures that when the user arrives at this section, the video is ALREADY in full width!
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "start 30%"],
  });

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative w-full", className)}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
};
ContainerScroll.displayName = "ContainerScroll";

interface ContainerAnimatedProps extends HTMLMotionProps<"div"> {
  inputRange?: number[];
  outputRange?: number[];
}

export const ContainerAnimated = React.forwardRef<
  HTMLDivElement,
  ContainerAnimatedProps
>(
  (
    {
      className,
      transition,
      style,
      inputRange = [0, 1],
      outputRange = [50, 0],
      ...props
    },
    ref
  ) => {
    const { scrollYProgress } = useContainerScrollContext();
    const y = useTransform(scrollYProgress, inputRange, outputRange);
    return (
      <motion.div
        ref={ref}
        className={cn("", className)}
        variants={variants}
        initial="hidden"
        whileInView={"visible"}
        viewport={{ once: true }}
        style={{ y, ...style }}
        transition={{ ...SPRING_TRANSITION_CONFIG, ...transition }}
        {...props}
      />
    );
  }
);
ContainerAnimated.displayName = "ContainerAnimated";

export const ContainerSticky = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
      {...props}
    />
  );
});
ContainerSticky.displayName = "ContainerSticky";

export const HeroVideo = React.forwardRef<
  HTMLVideoElement,
  HTMLMotionProps<"video">
>(({ style, className, transition, ...props }, ref) => {
  const { scrollYProgress } = useContainerScrollContext();
  // Scale expands from 0.75 to 1.0 so it hits 100% full width when section arrives
  const scale = useTransform(scrollYProgress, [0, 1], [0.75, 1]);

  return (
    <motion.video
      ref={ref}
      className={cn(
        "relative z-10 size-auto max-h-full max-w-full",
        className
      )}
      autoPlay
      muted
      loop
      playsInline
      style={{ scale, ...style }}
      {...props}
    />
  );
});
HeroVideo.displayName = "HeroVideo";

export const HeroButton = React.forwardRef<
  HTMLButtonElement,
  HTMLMotionProps<"button">
>(({ className, transition, ...props }, ref) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.015,
      }}
      whileTap={{
        scale: 0.985,
      }}
      ref={ref}
      className={cn(
        "group relative flex w-fit items-center rounded-full border border-[#ff6900] bg-gray-950/20 px-4 py-2 shadow-[0px_4px_24px_rgba(255,105,0,0.3)] transition-colors hover:bg-slate-950/50",
        className
      )}
      {...props}
    />
  );
});
HeroButton.displayName = "HeroButton";

export const ContainerInset = React.forwardRef<
  HTMLDivElement,
  ContainerInsetProps
>(
  (
    {
      className,
      style,
      insetYRange = [40, 0],
      insetXRange = [40, 0],
      roundednessRange = [1000, 16],
      transition,
      ...props
    },
    ref
  ) => {
    const { scrollYProgress } = useContainerScrollContext();

    // Expands completely as the section arrives in view (progress 0 -> 1)
    const insetY = useTransform(scrollYProgress, [0, 1], insetYRange);
    const insetX = useTransform(scrollYProgress, [0, 1], insetXRange);
    const roundedness = useTransform(scrollYProgress, [0, 1], roundednessRange);

    const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${roundedness}px)`;

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative pointer-events-none overflow-hidden",
          className
        )}
        style={{
          clipPath,
          ...style,
        }}
        {...props}
      />
    );
  }
);
ContainerInset.displayName = "ContainerInset";

// ---------------------------------------------------------------------------
// 2. PRODUCT VIDEO DATA (Iron Lung Platform Modules)
// ---------------------------------------------------------------------------
export interface ProductVideoItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  duration: string;
  videoUrl: string;
  poster: string;
  description: string;
}

const PRODUCT_VIDEOS: ProductVideoItem[] = [
  {
    id: "hardware-enclosure",
    title: "Aerospace Enclosure & Laminar Airflow",
    subtitle: "Dual-Chamber Aerodynamic Architecture",
    tag: "Hardware Pod",
    duration: "0:45",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "/images/feature-1.png",
    description: "CNC-machined aerospace chassis designed to regulate internal fluid aerodynamics and stabilize laminar airflow."
  },
  {
    id: "airway-resistance",
    title: "Dynamic Variable Airway Resistance",
    subtitle: "Diaphragmatic Biometric Feedback",
    tag: "Resistance Core",
    duration: "0:52",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    poster: "/images/feature-3.png",
    description: "Electronically modulated micro-valves regulating inspiratory and expiratory resistance in real time."
  },
  {
    id: "rfid-telemetry",
    title: "Contactless RFID Smart Card Telemetry",
    subtitle: "Zero-Touch Cloud Session Synchronization",
    tag: "Smart Card Sync",
    duration: "0:38",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    poster: "/images/feature-4.png",
    description: "Tap-and-train profile initialization streaming live vital capacity metrics to institutional cloud consoles."
  },
  {
    id: "vo2-athletic",
    title: "High-Ventilation VO2 Max Conditioning",
    subtitle: "Peak Aerobic Capacity Simulation",
    tag: "Athletic Mode",
    duration: "1:04",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "/images/hero-lung.jpg",
    description: "Interval resistance protocols engineered to delay diaphragmatic fatigue under high physical exertion."
  },
  {
    id: "diaphragm-sensors",
    title: "Precision Diaphragmatic Pressure Biofeedback",
    subtitle: "Real-Time Volumetric Airflow Tracking",
    tag: "Biometric Sensors",
    duration: "0:48",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "/images/feature-2.jpg",
    description: "High-frequency pressure transducers capturing millisecond breath inflection curves and power outputs."
  },
  {
    id: "stamina-rebound",
    title: "Hypoxic Fatigue Delay & Fast Rebound",
    subtitle: "Advanced Respiratory Conditioning Cycle",
    tag: "Recovery Mode",
    duration: "0:56",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    poster: "/images/feature-6.png",
    description: "Dynamic oxygen exchange protocols accelerating recovery cadence following maximum athletic outputs."
  }
];

// ---------------------------------------------------------------------------
// 3. MAIN PRODUCT VIDEO SHOWCASE COMPONENT
// ---------------------------------------------------------------------------
const ProductVideoShowcase: React.FC = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);
  const [isMuted, setIsMuted] = React.useState<boolean>(true);
  const [videoProgress, setVideoProgress] = React.useState<number>(0);
  const [canScrollLeft, setCanScrollLeft] = React.useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = React.useState<boolean>(true);

  const activeVideo = PRODUCT_VIDEOS[activeIndex];

  // Autoplay on cursor hover
  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  // Check slider scroll bounds
  const checkSliderScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  };

  React.useEffect(() => {
    checkSliderScroll();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", checkSliderScroll, { passive: true });
      window.addEventListener("resize", checkSliderScroll);
      return () => {
        slider.removeEventListener("scroll", checkSliderScroll);
        window.removeEventListener("resize", checkSliderScroll);
      };
    }
  }, []);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setVideoProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const switchVideo = (index: number) => {
    setActiveIndex(index);
    setVideoProgress(0);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }

    if (sliderRef.current) {
      const container = sliderRef.current;
      const card = container.children[index] as HTMLElement;
      if (card) {
        // Confine horizontal scrolling strictly to the slider container so the whole window/page never shifts
        const targetScrollLeft = card.offsetLeft - (container.clientWidth / 2) + (card.clientWidth / 2);
        container.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });
      }
    }
  };

  const handleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section 
      id="product-reels" 
      className="relative bg-background text-foreground border-t border-border/80 pt-8 sm:pt-12 pb-3 sm:pb-5 overflow-x-hidden"
    >
      <ContainerScroll className="w-full relative">
        <ContainerSticky className="flex flex-col items-center gap-4 sm:gap-6 px-3.5 sm:px-6 lg:px-8 max-w-6xl 2xl:max-w-7xl 3xl:max-w-[1640px] 4xl:max-w-[1880px] mx-auto">
          
          {/* Ambient subtle glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] 2xl:w-[800px] h-[220px] 2xl:h-[300px] bg-[#ff6900]/[0.07] rounded-full blur-[120px] pointer-events-none z-0" />

          {/* 1. TOP HEADER (ContainerAnimated with smooth spring blur transition) */}
          <ContainerAnimated className="text-center max-w-2xl 2xl:max-w-3xl mx-auto w-full space-y-1.5 z-20 shrink-0">
            <div className="flex justify-center">
              <HeroButton className="py-1 px-3.5 2xl:py-1.5 2xl:px-4 text-[11px] sm:text-xs 2xl:text-sm font-mono gap-1.5 text-[#ff6900]">
                <Activity className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 animate-pulse text-[#ff6900]" />
                <span className="tracking-wide uppercase font-semibold">Product Demonstration Live</span>
              </HeroButton>
            </div>

            <div className="text-xl sm:text-3xl md:text-4xl 2xl:text-5xl 3xl:text-6xl font-black font-display tracking-tight text-foreground uppercase leading-tight pt-1 flex items-center justify-center gap-x-2.5 flex-wrap">
              <KineticText text="Precision Hardware" as="h2" className="text-foreground tracking-tight" />
              <KineticText text="Live In Motion" as="span" className="text-[#ff6900] tracking-tight" />
            </div>

            <p className="text-xs sm:text-sm 2xl:text-base text-muted-foreground font-body leading-relaxed max-w-xl 2xl:max-w-2xl mx-auto">
              Continuous demonstration telemetry: Dual-chamber aerodynamics, electronically regulated resistance valves, and instant RFID smart card profile synchronization.
            </p>
          </ContainerAnimated>

          {/* 2. CENTER VIDEO WITH DYNAMIC INSET & CLIPPATH (Full Width on Arrival) */}
          <div 
            onMouseEnter={handleMouseEnter}
            className="w-full flex items-center justify-center z-20 max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl 4xl:max-w-[1600px]"
          >
            <ContainerInset 
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[62vh] 2xl:max-h-[70vh] 3xl:max-h-[75vh] border border-border/80 shadow-2xl bg-black group rounded-2xl sm:rounded-3xl"
            >
              <div className="relative w-full h-full pointer-events-auto flex items-center justify-center overflow-hidden">
                {/* Scaled HeroVideo Primitive (hits 1.0 full width as section arrives) */}
                <HeroVideo
                  ref={videoRef}
                  src={activeVideo.videoUrl}
                  poster={activeVideo.poster}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  preload="auto"
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full h-full object-cover"
                />

                {/* Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/35 pointer-events-none z-10" />

                {/* Top Left Clean Status Pill */}
                <div className="absolute top-2.5 sm:top-4 left-3 sm:left-5 z-20 flex items-center gap-2 pointer-events-none">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-[9.5px] sm:text-xs font-mono text-white shadow-md">
                    <span className="w-2 h-2 rounded-full bg-[#ff6900] animate-ping shrink-0" />
                    <span className="font-bold text-[#ff6900] uppercase tracking-wider">{activeVideo.tag}</span>
                    <span className="text-white/60">· {activeVideo.duration}</span>
                  </div>
                </div>

                {/* Center Play/Pause Trigger on Hover */}
                <button
                  onClick={togglePlay}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/55 hover:bg-[#ff6900] backdrop-blur-md border border-white/20 hover:border-[#ff6900] text-white flex items-center justify-center transition-all duration-300 opacity-80 group-hover:opacity-100 hover:scale-110 shadow-2xl cursor-pointer"
                  title={isPlaying ? "Pause Video" : "Play Video"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 translate-x-0.5" />
                  )}
                </button>

                {/* Bottom Controls Bar */}
                <div className="absolute bottom-0 inset-x-0 z-20 p-2.5 sm:p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2 pointer-events-auto">
                  {/* Seek Line */}
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#ff6900] transition-all duration-150"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>

                  {/* Info & Sound Toggle */}
                  <div className="flex items-center justify-between gap-3 text-white">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs sm:text-sm md:text-base font-bold font-display truncate">
                        {activeVideo.title}
                      </h3>
                      <p className="text-[9.5px] sm:text-xs text-white/70 font-body truncate hidden sm:block">
                        {activeVideo.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <button
                        onClick={toggleMute}
                        className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={handleFullscreen}
                        className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                        title="Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ContainerInset>
          </div>

          {/* 3. MULTI-VIDEO SLIDER (No scrollbar line, No bottom dots, working slide buttons) */}
          <div className="w-full max-w-5xl mx-auto z-20">
            
            {/* Header & Navigation Arrows */}
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-bold font-display uppercase tracking-wider text-foreground">
                  Product Video Library
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#ff6900]/10 border border-[#ff6900]/25 text-[#ff6900] text-[9.5px] font-mono font-bold">
                  {PRODUCT_VIDEOS.length} Modules
                </span>
              </div>

              {/* Slider Arrow Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={slideLeft}
                  disabled={!canScrollLeft}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[#ff6900]/50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
                  title="Previous video"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button
                  onClick={slideRight}
                  disabled={!canScrollRight}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[#ff6900]/50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
                  title="Next video"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Slider Track: No scrollbar line, no dots */}
            <div
              ref={sliderRef}
              className="flex gap-2.5 sm:gap-3.5 overflow-x-auto snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1 px-1 -mx-1"
            >
              {PRODUCT_VIDEOS.map((item, idx) => {
                const isSelected = activeIndex === idx;
                return (
                  <button
                    key={item.id}
                    onClick={() => switchVideo(idx)}
                    className={`snap-start shrink-0 w-[190px] sm:w-[220px] md:w-[240px] p-2 sm:p-2.5 rounded-2xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-card border-[#ff6900] shadow-md shadow-[#ff6900]/10 ring-2 ring-[#ff6900]/40 scale-[1.01]"
                        : "bg-card/60 border-border/80 hover:border-[#ff6900]/50 hover:bg-card opacity-80 hover:opacity-100"
                    }`}
                  >
                    {/* Thumbnail Card */}
                    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black">
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 ${
                          isSelected 
                            ? "bg-[#ff6900] text-white scale-110" 
                            : "bg-white/30 text-white group-hover:bg-[#ff6900] group-hover:scale-110"
                        }`}>
                          <Play className="w-3.5 h-3.5 translate-x-0.5" />
                        </div>
                      </div>

                      {/* Duration Badge */}
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[8.5px] font-mono text-white font-medium">
                        {item.duration}
                      </span>

                      {/* Playing indicator */}
                      {isSelected && (
                        <span className="absolute top-1 left-1 px-2 py-0.5 rounded-full bg-[#ff6900] text-[8px] font-mono font-bold text-white uppercase tracking-wider shadow-sm">
                          Playing
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-mono font-bold uppercase text-[#ff6900] truncate">
                          {item.tag}
                        </span>
                        <span className="text-[8.5px] font-mono text-muted-foreground">
                          0{idx + 1}
                        </span>
                      </div>

                      <h4 className="text-[11.5px] sm:text-xs font-bold font-display text-foreground line-clamp-1 group-hover:text-[#ff6900] transition-colors">
                        {item.title}
                      </h4>

                      <p className="text-[10px] text-muted-foreground font-body line-clamp-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

        </ContainerSticky>
      </ContainerScroll>
    </section>
  );
};

export default ProductVideoShowcase;
