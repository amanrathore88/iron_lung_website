import React, { useState, useRef } from "react";
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  useMotionTemplate 
} from "framer-motion";
import { 
  Cpu, 
  Tv, 
  Armchair, 
  Activity, 
  ShieldCheck, 
  Gauge, 
  ChevronRight, 
  ChevronLeft 
} from "lucide-react";

// =========================================================================
// 1. SPECIFICATION DATA FOR THE 6 CORE CAPABILITIES
// =========================================================================
export interface SystemFeature {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  description: string;
  tagline: string;
}

export const SPEC_FEATURES: SystemFeature[] = [
  {
    id: "01",
    title: "Personalized Training Profiles",
    badge: "Technology",
    badgeColor: "bg-[#ff6900]/10 text-[#ff6900] border-[#ff6900]/25",
    icon: Cpu,
    image: "/images/feature-1.png",
    description:
      "Smart card technology creates customized breathing exercises based on your age, weight, height, and athletic performance profile. No guesswork—just results.",
    tagline: "Contactless RFID Profile Sync",
  },
  {
    id: "02",
    title: "22-Inch Interactive Touchscreen",
    badge: "Interface",
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/25",
    icon: Tv,
    image: "/images/feature-2.jpg",
    description:
      "Large 22-inch touchscreen provides real-time guidance, tracks your progress, and ensures perfect posture and breathing rhythm with visual biometric feedback.",
    tagline: "FHD Touchscreen with 60Hz Telemetry",
  },
  {
    id: "03",
    title: "Ergonomic Air-flow Seating",
    badge: "Comfort & Posture",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/25",
    icon: Armchair,
    image: "/images/feature-3.png",
    description:
      "Engineered with orthopedic contouring to maximize diaphragm expansion and reduce upper-body muscle tension during rigorous lung exercises.",
    tagline: "Thoracic Orthopedic Geometry",
  },
  {
    id: "04",
    title: "Real-Time Telemetry & Progress",
    badge: "Analytics",
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/25",
    icon: Activity,
    image: "/images/feature-4.png",
    description:
      "Instantly sync your session metrics to your smartphone. Share comprehensive respiratory trend logs with your physician, sports trainer, or healthcare provider.",
    tagline: "HIPAA-Ready Cloud Telemetry",
  },
  {
    id: "05",
    title: "Automated UV-C Sanitization",
    badge: "Hygiene",
    badgeColor: "bg-cyan-500/10 text-cyan-500 border-cyan-500/25",
    icon: ShieldCheck,
    image: "/images/feature-5.png",
    description:
      "Automated UV sanitization and quick calibration between sessions ensure clinical-grade sterilization and ready-to-train status around the clock.",
    tagline: "Medical-Grade 254nm UV-C Cycle",
  },
  {
    id: "06",
    title: "5 Resistance Levels for All Users",
    badge: "Performance",
    badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/25",
    icon: Gauge,
    image: "/images/feature-6.png",
    description:
      "From gentle pulmonary conditioning to intense athletic thresholds, switch resistance levels on the fly to match your fitness journey.",
    tagline: "Dynamic Fluid Flow Modulation",
  },
];

// =========================================================================
// 2. PARALLAX 3D TILT CARD (Holographic Specular Glare & Depth Elevation)
// =========================================================================
export const ParallaxFeatureCard: React.FC<{
  feature: SystemFeature;
  idx: number;
}> = ({ feature, idx }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const isHovered = useMotionValue(0);

  // Smooth springs for buttery smooth 3D tilt without stutter
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 320,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 320,
    damping: 24,
  });
  const glareOpacity = useSpring(isHovered, { stiffness: 280, damping: 22 });

  const glareBackground = useMotionTemplate`radial-gradient(380px circle at ${glareX}% ${glareY}%, rgba(255, 105, 0, 0.22), rgba(255, 255, 255, 0.08) 25%, transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && (window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches)) {
      return;
    }
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const pctX = clientX / rect.width;
    const pctY = clientY / rect.height;

    x.set(pctX - 0.5);
    y.set(pctY - 0.5);
    glareX.set(pctX * 100);
    glareY.set(pctY * 100);
    isHovered.set(1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    isHovered.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-3xl h-full select-none"
      style={{ perspective: 1000 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: idx * 0.05 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border border-border/80 hover:border-[#ff6900]/50 shadow-soft-depth hover:shadow-[0_20px_45px_rgba(255,105,0,0.12)] transition-colors flex flex-col justify-between group relative overflow-hidden h-full"
      >
        {/* Dynamic Holographic Specular Beam (Follows cursor on card) */}
        <motion.div
          style={{
            opacity: glareOpacity,
            background: glareBackground,
          }}
          className="pointer-events-none absolute inset-0 z-30 rounded-3xl transition-opacity duration-150"
        />

        {/* Ambient Corner Warm Aura */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#ff6900]/10 rounded-full blur-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="relative z-10">
          {/* Top Badge & System ID with 3D Depth */}
          <div
            style={{ transform: "translateZ(45px)" }}
            className="flex items-center justify-between mb-3.5"
          >
            <span
              className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-xs ${feature.badgeColor}`}
            >
              {feature.badge}
            </span>
            <span className="text-[11px] font-mono text-muted-foreground font-semibold group-hover:text-[#ff6900] transition-colors">
              SYS.{feature.id}
            </span>
          </div>

          {/* 16:9 Image Preview with 3D Parallax Lift */}
          <div
            style={{ transform: "translateZ(38px)" }}
            className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-4 border border-border/70 bg-muted/20 shadow-sm group-hover:border-[#ff6900]/30 transition-all"
          >
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Holographic scanning laser line effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff6900]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>

          {/* Title & Description with 3D Float */}
          <h4
            style={{ transform: "translateZ(28px)" }}
            className="text-base sm:text-lg font-bold font-display text-foreground group-hover:text-[#ff6900] transition-colors leading-snug"
          >
            {feature.title}
          </h4>

          <p
            style={{ transform: "translateZ(18px)" }}
            className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed font-body"
          >
            {feature.description}
          </p>
        </div>

        {/* Bottom Technical Spec Tag with 3D Depth */}
        <div
          style={{ transform: "translateZ(26px)" }}
          className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground relative z-10"
        >
          <span className="truncate group-hover:text-foreground transition-colors font-medium">
            {feature.tagline}
          </span>
          <ChevronRight className="w-4 h-4 text-[#ff6900] shrink-0 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>
    </div>
  );
};

// =========================================================================
// 3. MAIN SECTION: INTEGRATED SYSTEM CAPABILITIES
// =========================================================================
export const IntegratedSystemCapabilitiesSection: React.FC = () => {
  const [mobileCardIndex, setMobileCardIndex] = useState(0);

  const nextMobileCard = () => {
    setMobileCardIndex((prev) => (prev + 1) % SPEC_FEATURES.length);
  };

  const prevMobileCard = () => {
    setMobileCardIndex((prev) => (prev - 1 + SPEC_FEATURES.length) % SPEC_FEATURES.length);
  };

  return (
    <section id="capabilities" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subheader / Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-border/70">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#ff6900] font-semibold mb-1">
              Integrated System Capabilities
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-foreground tracking-tight">
              Engineered for Uncompromising Respiratory Control
            </h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground shrink-0">
            SYS.01 — SYS.06 · ALL STANDARD INCLUDED
          </span>
        </div>

        {/* MOBILE VIEW (md:hidden): Clean Active Card with Swipe & Left/Right Buttons */}
        <div className="md:hidden space-y-3.5 select-none">
          {/* Category Quick Jump Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 px-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SPEC_FEATURES.map((feature, idx) => {
              const isActive = mobileCardIndex === idx;
              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => setMobileCardIndex(idx)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border select-none ${
                    isActive
                      ? "bg-[#ff6900] text-white border-[#ff6900] shadow-md shadow-[#ff6900]/25 scale-105"
                      : "bg-card border-border/80 text-muted-foreground active:scale-95"
                  }`}
                >
                  <span>{feature.id}</span>
                  <span className="font-sans font-semibold text-[11px]">{feature.title.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Clean Single Active Card with Touch Swipe */}
          <div className="relative w-full py-1">
            <AnimatePresence mode="wait">
              {(() => {
                const feature = SPEC_FEATURES[mobileCardIndex];
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -40 || info.velocity.x < -300) {
                        nextMobileCard();
                      } else if (info.offset.x > 40 || info.velocity.x > 300) {
                        prevMobileCard();
                      }
                    }}
                    className="w-full rounded-2xl bg-card border border-[#ff6900]/40 shadow-[0_12px_32px_-8px_rgba(255,105,0,0.18)] p-4 sm:p-5 flex flex-col justify-between select-none relative z-10 cursor-grab active:cursor-grabbing"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${feature.badgeColor}`}>
                          {feature.badge}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-[#ff6900]">
                          SYS.{feature.id}
                        </span>
                      </div>

                      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-3.5 border border-border/70 bg-black/40 shadow-inner">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      </div>

                      <h4 className="text-base sm:text-lg font-bold font-display leading-snug text-foreground">
                        {feature.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed font-body">
                        {feature.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                      <span className="truncate font-medium text-foreground">
                        {feature.tagline}
                      </span>
                      <ChevronRight className="w-4 h-4 shrink-0 text-[#ff6900]" />
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>

          {/* Mobile Bottom Quick Navigation with Left and Right Arrow Buttons */}
          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-[#ff6900] animate-pulse" />
              <span className="font-bold text-foreground">0{mobileCardIndex + 1}</span>
              <span>/ 0{SPEC_FEATURES.length}</span>
              <span className="text-border">·</span>
              <span className="text-[#ff6900] font-semibold">{SPEC_FEATURES[mobileCardIndex].badge}</span>
            </div>

            {/* Left and Right Arrow Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevMobileCard}
                className="w-10 h-10 rounded-xl bg-card border border-border hover:border-[#ff6900]/50 flex items-center justify-center text-foreground hover:text-[#ff6900] active:scale-95 transition-all cursor-pointer shadow-sm"
                aria-label="Previous capability"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={nextMobileCard}
                className="w-10 h-10 rounded-xl bg-card border border-border hover:border-[#ff6900]/50 flex items-center justify-center text-foreground hover:text-[#ff6900] active:scale-95 transition-all cursor-pointer shadow-sm"
                aria-label="Next capability"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* DESKTOP VIEW (hidden md:grid): 3x2 Grid of Parallax 3D Tilt Cards */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPEC_FEATURES.map((feature, idx) => (
            <ParallaxFeatureCard key={feature.id} feature={feature} idx={idx} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default IntegratedSystemCapabilitiesSection;
