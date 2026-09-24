import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { KineticText } from "./ui/kinetic-text";

// 5 authentic software interface screenshots
export const CONSOLE_STEPS = [
  {
    id: 1,
    title: "Standby & System Ready",
    label: "Standby",
    image: "/images/console/step-1-standby.png",
    caption: "User profile loaded · UV sanitization and quick calibration ready.",
    badge: "INITIAL STATE",
  },
  {
    id: 2,
    title: "Difficulty Mode Selection",
    label: "Select Mode",
    image: "/images/console/step-2-mode.png",
    caption: "Choose between custom training curves · Session timer initialized at 00:00:00.",
    badge: "CONFIGURATION",
  },
  {
    id: 3,
    title: "Moderate Resistance Cadence",
    label: "Moderate Pace",
    image: "/images/console/step-3-moderate.png",
    caption: "Active workout running at 00:00:57 · Live pace controls [• LIVE] [STOP] [RESET].",
    badge: "WORKOUT ACTIVE",
  },
  {
    id: 4,
    title: "Intense Aerobic Threshold",
    label: "Intense Mode",
    image: "/images/console/step-4-intense.png",
    caption: "Breath Score rising to 49 pts · High-resistance threshold inhalation.",
    badge: "PEAK OUTPUT",
  },
  {
    id: 5,
    title: "Active Exhale & Biometric Waveform",
    label: "Live Exhale Wave",
    image: "/images/console/step-5-exhale.png",
    caption: "Dynamic needle tracking EXHALE with live biological sine wave telemetry.",
    badge: "REAL-TIME BIOFEEDBACK",
  },
];

export const ConsoleInteractiveSection: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-advance through the 5 UI steps when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % CONSOLE_STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStep = CONSOLE_STEPS[currentStepIndex];

  return (
    <section className="relative overflow-hidden bg-background pt-10 sm:pt-14 pb-16">
      
      {/* 1. 22-INCH TABLET DISPLAY CONTAINER SCROLL */}
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center text-center px-2 pt-3 sm:pt-1">
            <span className="font-mono text-[9.5px] sm:text-[10px] md:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#ff6900] font-semibold mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#ff6900]/10 border border-[#ff6900]/25 inline-flex items-center gap-1.5 sm:gap-2 shadow-xs">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#ff6900] animate-pulse" />
              22-Inch Interactive Console
            </span>
            <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display text-foreground leading-[1.08] tracking-tight">
              <KineticText text="Command Every Breath With" as="h2" className="text-foreground tracking-tight" />
              <br />
              <KineticText text="High-Precision Tracking" as="span" className="text-[#ff6900] tracking-tight" />
            </div>
            <p className="mt-3 sm:mt-4 text-muted-foreground max-w-xl md:max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed font-body">
              The high-definition smart command center analyzes tidal airflow volume, real-time lung resistance, and workout cadence at 60Hz.
            </p>
          </div>
        }
      >
        {/* INSIDE THE 22" TABLET SCREEN */}
        <div className="w-full h-full relative bg-[#090b0e] flex items-center justify-center p-1 sm:p-2 overflow-hidden select-none">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentStep.id}
              src={currentStep.image}
              alt={currentStep.title}
              initial={{ opacity: 0.2, scale: 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.2, scale: 1.005 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full h-full object-contain object-center rounded-[14px]"
            />
          </AnimatePresence>
        </div>
      </ContainerScroll>

      {/* 2. INTERACTIVE CONTROLS DOCK UNDER THE CONSOLE */}
      <div className="max-w-4xl mx-auto px-4 mt-6 sm:mt-8">
        <div className="p-3 sm:p-4 rounded-2xl bg-card border border-border shadow-soft-depth flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Step Selector Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {CONSOLE_STEPS.map((step, idx) => {
              const isActive = currentStepIndex === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
                    isActive
                      ? "bg-[#ff6900] text-white border-[#ff6900] shadow-sm shadow-[#ff6900]/25"
                      : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-[#ff6900]/40"
                  }`}
                >
                  <span>{step.id}. {step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Play/Pause & Step Info */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-border/60">
            <div className="text-left font-mono text-xs">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Active Interface</span>
              <span className="text-foreground font-semibold font-display truncate max-w-[200px] inline-block">{currentStep.title}</span>
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-xl bg-background border border-border hover:border-[#ff6900]/50 text-foreground font-mono text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#ff6900]" />
                  <span>Pause Auto-Run</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#ff6900]" />
                  <span>Resume Auto-Run</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Step Caption */}
        <p className="text-center font-mono text-xs text-muted-foreground mt-3">
          {currentStep.caption}
        </p>
      </div>

    </section>
  );
};

export default ConsoleInteractiveSection;
