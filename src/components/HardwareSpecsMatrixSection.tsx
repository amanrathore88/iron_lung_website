import React from "react";
import { 
  Tv, 
  Zap, 
  Gauge, 
  Smartphone, 
  ShieldCheck, 
  Activity, 
  ChevronRight, 
  CheckCircle2 
} from "lucide-react";
import ironlungDeviceImg from "../assets/ironlung-device.png";
import { KineticText } from "./ui/kinetic-text";

export const SYSTEM_QUICK_SPECS = [
  { label: 'Display', value: '22" Touchscreen', icon: Tv },
  { label: 'Sanitization', value: 'UV-C Auto', icon: Zap },
  { label: 'Modes', value: '5 Intensity Levels', icon: Gauge },
  { label: 'Connectivity', value: 'App + WhatsApp', icon: Smartphone },
  { label: 'Certification', value: 'ISO 9001', icon: ShieldCheck },
  { label: 'Tested', value: '185 BPM Max', icon: Activity },
];

export const TECHNICAL_HIGHLIGHTS = [
  {
    title: "High-Precision Sensors",
    desc: "Multi-sensor pressure and flow transducers engineered with zero-drift accuracy.",
    icon: ShieldCheck,
  },
  {
    title: "Continuous Power Supply",
    desc: "Clean uninterruptible power circuitry ensuring zero data loss during intensive workouts.",
    icon: Zap,
  },
];

export interface HardwareSpecsMatrixSectionProps {
  onReserve?: () => void;
  reserveUrl?: string;
}

export const HardwareSpecsMatrixSection: React.FC<HardwareSpecsMatrixSectionProps> = ({
  onReserve,
  reserveUrl = "#contact"
}) => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6900]/10 border border-[#ff6900]/25 text-[#ff6900] text-xs font-mono uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900] animate-pulse" />
            Flagship Hardware Engineering
          </div>
          <div className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground mb-4 flex items-center justify-center gap-x-2.5 flex-wrap">
            <KineticText text="Unified System" as="h2" className="text-foreground tracking-tight" />
            <KineticText text="Architecture" as="span" className="text-[#ff6900] tracking-tight" />
          </div>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-body">
            Comprehensive hardware specifications, verified dimensions, and certified components for the Series 01 station.
          </p>
        </div>

        {/* Master Specs Card Container */}
        <div className="rounded-3xl border border-border bg-card/90 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left Col (7 Cols): Device Presentation & Pricing */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-background via-card to-card">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff6900]/10 border border-[#ff6900]/25 text-[#ff6900] font-mono text-xs uppercase tracking-widest font-semibold">
                    Flagship Edition
                  </span>
                  <span className="text-xs font-mono text-muted-foreground tracking-wider">
                    SERIES 01 · PRECISION ALLOY
                  </span>
                </div>

                <div className="text-2xl sm:text-4xl tracking-widest font-black text-foreground uppercase font-display flex items-center gap-x-3 flex-wrap">
                  <KineticText text="I R O N" as="h3" className="text-foreground" />
                  <KineticText text="L U N G" as="span" className="text-[#ff6900]" />
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground mt-2.5 max-w-xl leading-relaxed font-body">
                  Includes Iron Lung Device, 12-month Pro subscription, professional white-glove nationwide installation, and comprehensive technical service package.
                </p>
              </div>

              {/* Central Device Render */}
              <div className="py-8 my-2 flex items-center justify-center relative group">
                <div className="absolute inset-0 max-w-xs mx-auto bg-gradient-to-tr from-[#ff6900]/15 to-transparent blur-[50px] rounded-full pointer-events-none" />
                <img
                  src={ironlungDeviceImg}
                  alt="Iron Lung Device Flagship Edition"
                  className="relative z-10 max-h-52 sm:max-h-64 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Price & Primary CTA */}
              <div className="pt-6 border-t border-border/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Complete Package Price</div>
                  <div className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">
                    MRP ₹ 4,99,000
                  </div>
                  <span className="text-[11px] text-muted-foreground font-body">inclusive of all taxes & delivery</span>
                </div>

                {onReserve ? (
                  <button
                    type="button"
                    onClick={onReserve}
                    className="w-full sm:w-auto px-7 py-3.5 bg-[#ff6900] hover:bg-[#ff7a1a] text-white text-xs sm:text-sm font-bold tracking-widest uppercase rounded-xl shadow-lg shadow-[#ff6900]/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] text-center shrink-0 cursor-pointer"
                  >
                    <span>RESERVE YOURS</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <a
                    href={reserveUrl}
                    className="w-full sm:w-auto px-7 py-3.5 bg-[#ff6900] hover:bg-[#ff7a1a] text-white text-xs sm:text-sm font-bold tracking-widest uppercase rounded-xl shadow-lg shadow-[#ff6900]/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] text-center shrink-0 cursor-pointer"
                  >
                    <span>RESERVE YOURS</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Right Col (5 Cols): Technical Specifications Matrix */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 bg-secondary/15 flex flex-col justify-between space-y-6">
              
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/70">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground font-display">
                    Hardware Specifications
                  </span>
                  <span className="text-[10px] font-mono text-[#ff6900] font-semibold">
                    PRECISION CALIBRATED
                  </span>
                </div>

                {/* Dimensions & Weight Grid */}
                <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-6">
                  <div className="p-3.5 rounded-2xl bg-card border border-border shadow-xs">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Dimension</div>
                    <div className="font-bold text-foreground mt-1 text-xs sm:text-sm">220 × 90 × 110 cm</div>
                    <div className="text-[10px] text-muted-foreground">(L × W × H)</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-card border border-border shadow-xs">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Weight</div>
                    <div className="font-bold text-foreground mt-1 text-xs sm:text-sm">145 kg</div>
                    <div className="text-[10px] text-muted-foreground">Heavy-gauge alloy</div>
                  </div>
                </div>

                {/* 6 Quick Tech Specs */}
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {SYSTEM_QUICK_SPECS.map((spec, i) => {
                    const Icon = spec.icon;
                    return (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-card/80 border border-border flex items-center gap-2.5 text-xs shadow-xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#ff6900]/10 text-[#ff6900] flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[9px] font-mono text-muted-foreground truncate uppercase">{spec.label}</div>
                          <div className="font-bold text-foreground truncate text-[11px] font-display">{spec.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Highlights */}
                <div className="space-y-2.5 pt-2">
                  {TECHNICAL_HIGHLIGHTS.map((h, idx) => {
                    const Icon = h.icon;
                    return (
                      <div key={idx} className="p-3 rounded-xl bg-card/60 border border-border/70 flex items-start gap-2.5">
                        <Icon className="w-4 h-4 text-[#ff6900] shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-foreground font-display">{h.title}</div>
                          <div className="text-[11px] text-muted-foreground leading-snug">{h.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Service Assurance Badges */}
              <div className="pt-4 border-t border-border/70 space-y-2 text-xs text-muted-foreground font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>White-glove nationwide delivery and calibrated setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>12-Month Pro telemetry & cloud synchronization pass</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Dedicated technical specialist orientation session</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HardwareSpecsMatrixSection;
