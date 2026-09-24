import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Wind, 
  TrendingDown, 
  Activity, 
  X, 
  ChevronRight, 
  Gauge, 
  Layers 
} from 'lucide-react';
import PollutionAttack3D from './canvas/PollutionAttack3D';

interface AQILevel {
  range: string;
  min: number;
  max: number;
  name: string;
  color: string;
  badgeBg: string;
  description: string;
  capacityImpact: string;
  cigaretteEquiv: string;
  pm25Level: string;
}

const AQI_LEVELS: AQILevel[] = [
  {
    range: '0 - 50',
    min: 0,
    max: 50,
    name: 'Good / Clean Air',
    color: '#10b981',
    badgeBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    description: 'Optimal atmospheric purity. Full alveolar elasticity, unimpeded gas exchange, and peak stamina.',
    capacityImpact: '0% (Optimal)',
    cigaretteEquiv: '0 cigs/day',
    pm25Level: '< 12 µg/m³',
  },
  {
    range: '51 - 100',
    min: 51,
    max: 100,
    name: 'Moderate',
    color: '#f59e0b',
    badgeBg: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    description: 'Early particulate burden. Mild airway irritation during prolonged high-ventilation workouts.',
    capacityImpact: '-5% to -8%',
    cigaretteEquiv: '1 - 2 cigs/day',
    pm25Level: '12 - 35 µg/m³',
  },
  {
    range: '101 - 200',
    min: 101,
    max: 200,
    name: 'Unhealthy / Smog',
    color: '#f97316',
    badgeBg: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
    description: 'PM2.5 microparticles bypass nasal cilia and accumulate across the primary bronchial bifurcations.',
    capacityImpact: '-12% to -16%',
    cigaretteEquiv: '4 - 6 cigs/day',
    pm25Level: '35 - 55 µg/m³',
  },
  {
    range: '201 - 300',
    min: 201,
    max: 300,
    name: 'Very Unhealthy',
    color: '#ef4444',
    badgeBg: 'bg-red-500/10 text-red-500 border-red-500/30',
    description: 'Severe micro-alveolar soot deposition. Chronic cellular fatigue, bronchospasm, and stunted VO2 max.',
    capacityImpact: '-18% to -22%',
    cigaretteEquiv: '8 - 11 cigs/day',
    pm25Level: '55 - 150 µg/m³',
  },
  {
    range: '301 - 500+',
    min: 301,
    max: 500,
    name: 'Hazardous Emergency',
    color: '#dc2626',
    badgeBg: 'bg-red-600/15 text-red-500 border-red-600/50',
    description: 'Winter smog inversions. Acute tissue hypoxia, accelerated anthracosis risk, and severe capacity loss.',
    capacityImpact: '-25% to -30%',
    cigaretteEquiv: '14+ cigs/day',
    pm25Level: '250+ µg/m³',
  },
];

const GLOBAL_STATS = [
  {
    number: '91%',
    label: 'Global population breathes air exceeding WHO safe pollution limits',
    tag: 'Global Exposure',
    icon: Wind,
  },
  {
    number: '7M',
    label: 'Annual deaths worldwide linked directly to ambient particulate pollution',
    tag: 'Invisible Burden',
    icon: AlertTriangle,
  },
  {
    number: '25%',
    label: 'Average silent reduction in vital lung capacity before symptoms become apparent',
    tag: 'Silent Erosion',
    icon: TrendingDown,
  },
];

const WARNING_SIGNS = [
  'Persistent dry cough following physical training',
  'Shortness of breath on routine exertion',
  'Chronic post-workout respiratory fatigue',
  'Subtle chest tightness or airway resistance',
  'Unexplained plateau in endurance metrics',
  'Delayed recovery of normal breathing cadence',
];

const PollutionAlertSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAQIIndex, setSelectedAQIIndex] = useState(4); // Default to Hazardous
  const currentAQI = AQI_LEVELS[selectedAQIIndex];

  return (
    <section
      id="pollution-alert"
      className="py-10 sm:py-16 md:py-20 px-3 sm:px-6 lg:px-10 bg-background text-foreground relative overflow-hidden font-sans border-t border-border/80 scroll-mt-20 md:scroll-mt-24"
    >
      <div className="max-w-6xl 2xl:max-w-7xl 3xl:max-w-[1640px] 4xl:max-w-[1880px] mx-auto relative z-10 w-full">
        
        {/* ========================================================= */}
        {/* 1A. DESKTOP VIEW: SMART TECHIE BANNER & TRIGGER BUTTON    */}
        {/* ========================================================= */}
        <div className="hidden md:flex p-6 lg:p-8 2xl:p-10 3xl:p-12 rounded-3xl bg-gradient-to-r from-card via-card to-secondary/30 border border-border/90 shadow-soft-depth items-center justify-between gap-6 relative overflow-hidden group w-full">
          
          {/* Ambient subtle warm backlight */}
          <div className="absolute -right-20 -top-20 w-64 2xl:w-80 h-64 2xl:h-80 bg-[#ff6900]/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Left: Info */}
          <div className="flex-1 space-y-2.5 2xl:space-y-3.5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 2xl:py-1.5 rounded-full bg-[#ff6900]/10 border border-[#ff6900]/25 text-[#ff6900] text-[11px] 2xl:text-xs font-mono uppercase tracking-widest">
              <Activity className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-[#ff6900] animate-pulse shrink-0" />
              <span>Environmental Risk Telemetry</span>
            </div>

            <h3 className="text-2xl lg:text-3xl 2xl:text-4xl 3xl:text-5xl font-bold font-display text-foreground tracking-tight leading-snug">
              Air Quality & Environmental Risk Simulator
            </h3>

            <p className="text-sm 2xl:text-base 3xl:text-lg text-muted-foreground max-w-2xl 2xl:max-w-3xl font-body leading-relaxed">
              Simulate how ambient PM2.5 and atmospheric particulate matter impact respiratory capacity and stamina in real time. Inspect your environmental exposure level.
            </p>
          </div>

          {/* Right: High-Tech Animated Button */}
          <div className="shrink-0">
            <button
              onClick={() => setIsOpen(true)}
              className="px-7 py-4 2xl:px-9 2xl:py-5 rounded-2xl bg-[#ff6900] hover:bg-[#ff7a1a] text-white font-mono font-bold text-sm 2xl:text-base tracking-wider uppercase flex items-center justify-center gap-3 shadow-lg shadow-[#ff6900]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Gauge className="w-4 h-4 2xl:w-5 2xl:h-5 shrink-0" />
              <span>CHECK AIR RISK</span>
              <ChevronRight className="w-4 h-4 2xl:w-5 2xl:h-5 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1B. MOBILE-FIRST ALTERNATIVE: LIVE CYBER-TELEMETRY HUD    */}
        {/* ========================================================= */}
        <div className="block md:hidden w-full rounded-2xl bg-card border border-border/90 p-4 shadow-soft-depth relative overflow-hidden">
          {/* Dynamic ambient background glow based on selected AQI */}
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[60px] opacity-25 pointer-events-none transition-colors duration-500"
            style={{ backgroundColor: currentAQI.color }}
          />

          {/* Top header badge row */}
          <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff6900]/10 border border-[#ff6900]/25 text-[#ff6900] text-[10px] font-mono uppercase tracking-wider">
              <Activity className="w-3 h-3 text-[#ff6900] animate-pulse shrink-0" />
              <span>Environmental Risk Telemetry</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              AQI Meter
            </span>
          </div>

          {/* Title & description */}
          <h3 className="text-lg font-bold font-display text-foreground tracking-tight leading-snug relative z-10">
            Air Quality & Lung Impact
          </h3>
          <p className="text-[11.5px] text-muted-foreground font-body mt-1 leading-relaxed relative z-10">
            Select an ambient AQI level to inspect instant respiratory capacity loss and particulate penetration:
          </p>

          {/* 5-Segment AQI Selector Pill Bar */}
          <div className="grid grid-cols-5 gap-1.5 my-3 relative z-10">
            {AQI_LEVELS.map((lvl, idx) => {
              const isSelected = selectedAQIIndex === idx;
              return (
                <button
                  key={lvl.range}
                  onClick={() => setSelectedAQIIndex(idx)}
                  className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'shadow-md scale-[1.02]'
                      : 'bg-background/70 border-border/70 opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${lvl.color}18` : undefined,
                    borderColor: isSelected ? lvl.color : undefined,
                  }}
                >
                  <span
                    className="text-[10px] font-mono font-bold leading-tight"
                    style={{ color: lvl.color }}
                  >
                    {lvl.range.split(' ')[0]}
                  </span>
                  <span className="text-[8px] font-mono text-muted-foreground truncate max-w-full mt-0.5 font-medium">
                    {lvl.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live Dynamic Status Card */}
          <div
            className="p-3.5 rounded-xl border transition-all duration-300 relative z-10 mb-3"
            style={{
              backgroundColor: `${currentAQI.color}0c`,
              borderColor: `${currentAQI.color}35`,
            }}
          >
            {/* Top row: Name & PM2.5 */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className={`text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${currentAQI.badgeBg}`}
              >
                AQI {currentAQI.range} · {currentAQI.name.split(' ')[0]}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                PM2.5: {currentAQI.pm25Level}
              </span>
            </div>

            {/* Physiological description */}
            <p className="text-[11px] text-foreground/90 leading-relaxed font-body mb-3">
              {currentAQI.description}
            </p>

            {/* Two Key Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-border/60">
              <div className="p-2 rounded-lg bg-background/90 border border-border text-center">
                <div className="text-[8.5px] font-mono uppercase text-muted-foreground">
                  Vital Capacity Loss
                </div>
                <div className="text-sm font-mono font-bold text-red-500 mt-0.5">
                  {currentAQI.capacityImpact}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-background/90 border border-border text-center">
                <div className="text-[8.5px] font-mono uppercase text-muted-foreground">
                  Toxicity Equivalent
                </div>
                <div className="text-sm font-mono font-bold text-foreground mt-0.5">
                  {currentAQI.cigaretteEquiv}
                </div>
              </div>
            </div>
          </div>

          {/* 3 Particle Scale Badges (compact chips) */}
          <div className="grid grid-cols-3 gap-1.5 mb-3.5 relative z-10">
            <div className="p-1.5 rounded-lg bg-background/80 border border-border text-center">
              <div className="text-[9px] font-mono font-bold text-amber-500">PM10</div>
              <div className="text-[8px] text-muted-foreground">Pollen/Dust</div>
              <div className="text-[8px] font-mono text-emerald-500 font-semibold">Filtered</div>
            </div>
            <div className="p-1.5 rounded-lg bg-background/80 border border-border text-center">
              <div className="text-[9px] font-mono font-bold text-orange-500">PM2.5</div>
              <div className="text-[8px] text-muted-foreground">Soot/Smog</div>
              <div className="text-[8px] font-mono text-orange-500 font-semibold">Penetrates</div>
            </div>
            <div className="p-1.5 rounded-lg bg-background/80 border border-border text-center">
              <div className="text-[9px] font-mono font-bold text-red-600">PM0.1</div>
              <div className="text-[8px] text-muted-foreground">Nano-soot</div>
              <div className="text-[8px] font-mono text-red-600 font-bold">Bloodstream</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 relative z-10 pt-1">
            <a
              href="/contact"
              className="w-full py-3 px-4 rounded-xl bg-[#ff6900] hover:bg-[#ff7a1a] text-white font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md shadow-[#ff6900]/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>PROTECT WITH IRON LUNG</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setIsOpen(true)}
              className="hidden md:flex w-full py-2.5 px-3 rounded-xl bg-background/80 hover:bg-muted border border-border text-muted-foreground hover:text-foreground font-mono text-[10.5px] items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#ff6900]" />
              <span>Launch 3D Infiltration Lab</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. HIGH-TECH ANIMATED MODAL WITH 3D LUNG & AQI MATRIX     */}
        {/* ========================================================= */}
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
              
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-5xl rounded-2xl sm:rounded-3xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
              >
                {/* Modal Header */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border flex items-center justify-between bg-background/60">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff6900] animate-ping shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-lg font-bold font-display text-foreground truncate">
                        Air Quality Impact Telemetry
                      </h4>
                      <p className="text-[10px] sm:text-[11px] font-mono text-muted-foreground truncate">
                        Real-Time AQI & Particulate Infiltration Dynamics
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 sm:p-2 rounded-xl bg-background border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
                  
                  {/* Two-Column Matrix: 3D Lung Canvas + AQI Controller */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Left: Realistic 3D Biological Lung Canvas */}
                    <div className="lg:col-span-6 flex flex-col">
                      <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#faf9f6] via-[#f2efe9] to-[#e8e4da] border border-border/90 shadow-inner overflow-hidden">
                        
                        {/* Status tag */}
                        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[10px] font-mono text-zinc-800 shadow-sm">
                          <span
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: currentAQI.color }}
                          />
                          <span className="font-semibold">{currentAQI.name}</span>
                          <span className="text-zinc-500">· PM2.5: {currentAQI.pm25Level}</span>
                        </div>

                        {/* 3D Canvas */}
                        <div className="w-full h-full">
                          <PollutionAttack3D aqi={currentAQI.max} isPurifying={false} />
                        </div>

                        {/* Bottom Drag Helper */}
                        <div className="absolute bottom-3 left-3 z-20 pointer-events-none text-[10px] font-mono text-zinc-600 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-black/10 shadow-xs flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900] animate-ping" />
                          <span>Drag to rotate · Inspect tissue response</span>
                        </div>
                      </div>

                      {/* 3 Particle Scale Indicators */}
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="p-2 rounded-xl bg-background border border-border text-center">
                          <div className="text-[10px] font-mono font-bold text-amber-500">PM10</div>
                          <div className="text-[9px] text-muted-foreground">Dust & Pollen</div>
                          <div className="text-[9px] font-mono text-emerald-500 font-semibold mt-0.5">Filtered</div>
                        </div>

                        <div className="p-2 rounded-xl bg-background border border-border text-center">
                          <div className="text-[10px] font-mono font-bold text-red-500">PM2.5</div>
                          <div className="text-[9px] text-muted-foreground">Combustion Soot</div>
                          <div className="text-[9px] font-mono text-red-500 font-semibold mt-0.5">Penetrates</div>
                        </div>

                        <div className="p-2 rounded-xl bg-background border border-border text-center">
                          <div className="text-[10px] font-mono font-bold text-red-600">PM0.1</div>
                          <div className="text-[9px] text-muted-foreground">Nanoparticles</div>
                          <div className="text-[9px] font-mono text-red-600 font-bold mt-0.5">Bloodstream</div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Interactive Risk Calculator & Analytics */}
                    <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                            Ambient AQI Selector
                          </span>
                          <span className="text-[10px] font-mono text-[#ff6900] font-bold">
                            Live Simulation
                          </span>
                        </div>

                        {/* AQI Range Buttons */}
                        <div className="grid grid-cols-5 gap-1 sm:gap-1.5 mb-3">
                          {AQI_LEVELS.map((lvl, i) => (
                            <button
                              key={lvl.range}
                              onClick={() => setSelectedAQIIndex(i)}
                              className={`p-1 sm:p-2 rounded-lg sm:rounded-xl border text-center transition-all cursor-pointer ${
                                selectedAQIIndex === i
                                  ? 'bg-card shadow-sm ring-1 ring-[#ff6900]'
                                  : 'bg-background/60 border-border hover:border-border hover:bg-card opacity-75'
                              }`}
                              style={{
                                borderColor: selectedAQIIndex === i ? lvl.color : undefined,
                              }}
                            >
                              <div className="text-[9.5px] sm:text-[11px] font-mono font-bold leading-tight" style={{ color: lvl.color }}>
                                {lvl.range}
                              </div>
                              <div className="text-[8px] sm:text-[9px] text-muted-foreground truncate font-medium mt-0.5">
                                {lvl.name.split(' ')[0]}
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Active AQI Description */}
                        <div
                          className="p-4 rounded-2xl border transition-all"
                          style={{
                            backgroundColor: `${currentAQI.color}08`,
                            borderColor: `${currentAQI.color}35`,
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${currentAQI.badgeBg}`}
                            >
                              AQI {currentAQI.range} · {currentAQI.name}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              PM2.5: {currentAQI.pm25Level}
                            </span>
                          </div>

                          <p className="text-xs text-foreground/90 font-body leading-relaxed mt-1.5">
                            {currentAQI.description}
                          </p>

                          {/* Impact Numbers */}
                          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/60">
                            <div className="p-2.5 rounded-xl bg-background border border-border text-center">
                              <div className="text-[9px] font-mono text-muted-foreground uppercase">
                                Tidal Capacity Loss
                              </div>
                              <div className="text-base font-mono font-bold text-red-500">
                                {currentAQI.capacityImpact}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-background border border-border text-center">
                              <div className="text-[9px] font-mono text-muted-foreground uppercase">
                                Toxicity Equivalence
                              </div>
                              <div className="text-base font-mono font-bold text-foreground">
                                {currentAQI.cigaretteEquiv}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Warning Signs */}
                      <div className="pt-2 border-t border-border/70">
                        <h5 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                          Warning Signs Your Lungs Need Conditioning:
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {WARNING_SIGNS.map((sign, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-body"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ff6900] shrink-0" />
                              <span>{sign}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* 3 Global Statistics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/70">
                    {GLOBAL_STATS.map((stat, idx) => {
                      const IconComp = stat.icon;
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-background border border-border flex items-center gap-3"
                        >
                          <div className="w-9 h-9 rounded-xl bg-[#ff6900]/10 text-[#ff6900] flex items-center justify-center shrink-0 border border-[#ff6900]/20">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xl font-black font-display text-foreground">
                              {stat.number}
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-tight">
                              {stat.label}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="px-4 sm:px-6 py-3 bg-background/80 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs font-mono text-muted-foreground">
                  <span className="text-[11px] sm:text-xs text-center sm:text-left">Targeted Airway Resistance Reverses Silently Lost Capacity</span>
                  <a
                    href="/contact"
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#ff6900] text-white font-bold hover:bg-[#ff7a1a] transition-colors text-center cursor-pointer"
                  >
                    Consult Specialists
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default PollutionAlertSection;
