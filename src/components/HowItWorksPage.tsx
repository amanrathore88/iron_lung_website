import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wind, 
  Activity, 
  Gauge, 
  Sliders, 
  ArrowRight,
  Smartphone,
  LineChart,
  CalendarCheck,
  CheckCircle2,
  Cpu,
  Building2,
  Trophy,
  Briefcase,
  HeartPulse
} from 'lucide-react';
import { HeroNavbar } from './HeroNavbar';
import Footer from './Footer';
import AntiMetalButton from './ui/AntiMetalButton';
import { KineticText } from './ui/kinetic-text';

// ---------------------------------------------------------------------------
// TRAINING MODES TELEMETRY DATA
// ---------------------------------------------------------------------------
export interface ModeData {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  resistance: string;
  flowRate: string;
  cadence: string;
  ieRatio: string;
  intensityPercent: number;
  badge: string;
  color: string;
  adaptations: string[];
}

export const MODES: ModeData[] = [
  {
    id: "mode-1",
    number: "01",
    name: "Easy Breathe",
    tagline: "Foundational Airflow Conditioning",
    description: "Gentle introduction to respiratory resistance training, focusing on establishing rhythmic diaphragmatic breathing and smooth alveolar airflow expansion.",
    resistance: "8 – 15 cmH2O",
    flowRate: "1.4 L/sec",
    cadence: "12 BPM",
    ieRatio: "1 : 2.0",
    intensityPercent: 20,
    badge: "Level 1 • Foundation",
    color: "#38bdf8",
    adaptations: [
      "Establishes natural diaphragmatic breathing rhythm",
      "Gentle warm-up prior to high-exertion training",
      "Airway relaxation and stress mitigation",
      "Optimal for beginners & active rest days"
    ]
  },
  {
    id: "mode-2",
    number: "02",
    name: "Capacity Builder",
    tagline: "Volumetric Expansion & Control",
    description: "Progressive stepped resistance designed to train intercostal musculature and expand functional vital lung capacity safely and systematically.",
    resistance: "16 – 30 cmH2O",
    flowRate: "2.6 L/sec",
    cadence: "14 BPM",
    ieRatio: "1 : 1.8",
    intensityPercent: 40,
    badge: "Level 2 • Volume",
    color: "#34d399",
    adaptations: [
      "Safely expands vital lung capacity and inspiratory volume",
      "Strengthens deep intercostal and chest-wall muscles",
      "Enhances oxygen intake per individual respiratory cycle",
      "Reduces shortness of breath during steady aerobic exercise"
    ]
  },
  {
    id: "mode-3",
    number: "03",
    name: "Stamina Boost",
    tagline: "Threshold Resistance Conditioning",
    description: "Intermediate resistance protocols calibrated to delay respiratory muscle fatigue during sustained physical exertion and high-demand endurance activities.",
    resistance: "32 – 45 cmH2O",
    flowRate: "3.8 L/sec",
    cadence: "18 BPM",
    ieRatio: "1 : 1.5",
    intensityPercent: 65,
    badge: "Level 3 • Endurance",
    color: "#fbbf24",
    adaptations: [
      "Delays respiratory metaboreflex during intense exertion",
      "Boosts aerobic endurance for marathon, cycling & team sports",
      "Improves carbon dioxide tolerance and ventilation efficiency",
      "Maintains optimal core breathing alignment under fatigue"
    ]
  },
  {
    id: "mode-4",
    number: "04",
    name: "Athlete Performance",
    tagline: "High-Velocity Ventilatory Intervals",
    description: "Dynamic airflow resistance intervals designed for competitive sports, sprinters, and swimmers demanding explosive respiratory power and fast recovery.",
    resistance: "48 – 65 cmH2O",
    flowRate: "5.1 L/sec",
    cadence: "22 BPM",
    ieRatio: "1 : 1.2",
    intensityPercent: 85,
    badge: "Level 4 • Pro Athletic",
    color: "#ff6900",
    adaptations: [
      "Maximizes VO2 max and rapid respiratory muscle contraction",
      "Fast recovery between high-intensity interval sprints",
      "Strengthens maximum inspiratory pressure (MIP)",
      "Optimized for swimmers, combat athletes & elite sprinters"
    ]
  },
  {
    id: "mode-5",
    number: "05",
    name: "Beast Mode",
    tagline: "Maximum Calibrated Load",
    description: "Peak pneumatic resistance threshold simulating extreme high-altitude conditions for elite athletic conditioning and unbreakable respiratory power.",
    resistance: "68 – 85 cmH2O",
    flowRate: "6.2 L/sec",
    cadence: "26 BPM",
    ieRatio: "1 : 1.0",
    intensityPercent: 100,
    badge: "Level 5 • Maximum Load",
    color: "#ef4444",
    adaptations: [
      "Ultimate diaphragmatic strength testing and adaptation",
      "Simulates high-altitude hypoxia breathing conditions",
      "Peak inspiratory muscle power development",
      "For elite competitors demanding supreme mental & physical grit"
    ]
  },
  {
    id: "mode-6",
    number: "06",
    name: "Custom Programs",
    tagline: "Open Architecture Protocols",
    description: "Comprehensive parameter configuration allowing facility managers, athletic trainers, and biomechanics coaches to build bespoke resistance profiles.",
    resistance: "User Configured",
    flowRate: "Programmable",
    cadence: "Variable BPM",
    ieRatio: "Custom Ratio",
    intensityPercent: 75,
    badge: "Advanced • Trainer Admin",
    color: "#a855f7",
    adaptations: [
      "Customizable stepped resistance curves and ramps",
      "Adjustable inhalation-to-exhalation timing ratios",
      "Exportable session presets saved to user RFID cards",
      "Targeted protocols for specialized training regimes"
    ]
  }
];

// ---------------------------------------------------------------------------
// ECOSYSTEM PILLARS
// ---------------------------------------------------------------------------
export const ECOSYSTEM_PILLARS = [
  {
    icon: Cpu,
    number: "01",
    title: "RFID Smart Card Profile",
    tagline: "Contactless Hardware Sync",
    description: "Users tap their RFID smart card onto the console reader to instantaneously load their calibrated resistance baseline, session history, and custom training parameters.",
    features: ["Zero-touch profile initialization", "Encrypted local & cloud credential sync", "Cross-facility terminal compatibility"]
  },
  {
    icon: Smartphone,
    number: "02",
    title: "Live Cloud Telemetry",
    tagline: "Multi-Platform Progress Sync",
    description: "Every breath cycle, tidal volume curve, and pressure threshold is streamed to the user's dashboard for instant visualization and longitudinal progress tracking.",
    features: ["Real-time session biometrics feed", "Synchronized personal dashboard", "Exportable PDF progress summaries"]
  },
  {
    icon: CalendarCheck,
    number: "03",
    title: "WhatsApp Dispatch Service",
    tagline: "Automated Motivational Cadence",
    description: "Automated WhatsApp notifications dispatch post-session summaries, celebrate vital capacity milestones, and send calendar reminders to keep training momentum consistent.",
    features: ["Instant post-training metric recaps", "Milestone & personal record alerts", "Gentle scheduled session prompts"]
  },
  {
    icon: LineChart,
    number: "04",
    title: "Standardized 6-Month Tests",
    tagline: "Documented Vital Progress",
    description: "Built-in standardized testing modules benchmark maximum inspiratory pressure and vital lung volume every 6 months to quantify physical progress and recalibrate training targets.",
    features: ["Standardized baseline assessment runs", "Direct before-and-after metric comparisons", "Formal documentation for athletic performance"]
  }
];

// ---------------------------------------------------------------------------
// APPLICATION DOMAINS
// ---------------------------------------------------------------------------
export const APPLICATIONS = [
  {
    id: "gyms",
    icon: Building2,
    badge: "Facility Expansion",
    title: "Gyms & Fitness Hubs",
    headline: "A Premium Differentiator for Forward-Thinking Fitness Clubs",
    description: "Equip your facility with a dedicated respiratory training station. Give members a measurable way to train their lungs alongside conventional strength and cardio machines, unlocking high-margin premium memberships.",
    highlights: [
      "Attract endurance athletes, runners, and fitness enthusiasts",
      "Turnkey self-serve kiosk with automated UV sanitization",
      "Seamless member identification with RFID cards"
    ]
  },
  {
    id: "athletes",
    icon: Trophy,
    badge: "Peak Performance",
    title: "Athletes & Sports Academies",
    headline: "Unlocking The Aerobic Engine That Powers Championship Endurance",
    description: "The respiratory metaboreflex steals oxygenated blood from working legs and arms when breathing muscles fatigue. Iron Lung conditions the diaphragm to sustain high ventilation rates without stealing power.",
    highlights: [
      "Measurable increases in VO2 max and stamina",
      "Accelerated recovery during high-intensity intervals",
      "Targeted respiratory training without systemic joint wear"
    ]
  },
  {
    id: "corporate",
    icon: Briefcase,
    badge: "Executive Wellness",
    title: "Corporate Wellness Centers",
    headline: "Counteracting Desk Posture & Shallow Office Breathing",
    description: "Sedentary desk work and high cognitive pressure lead to chronic shallow chest breathing, fatigue, and sluggish afternoon focus. A 10-minute session restores deep oxygenation and sharp mental clarity.",
    highlights: [
      "Eliminates afternoon cognitive slumps through oxygenation",
      "Promotes healthy thoracic posture and diaphragmatic expansion",
      "Low-impact, sweat-free session suitable for corporate attire"
    ]
  },
  {
    id: "wellness",
    icon: HeartPulse,
    badge: "Vitality Defense",
    title: "Urban Air Quality Defense",
    headline: "Rebuilding Lung Capacity in High-Pollution Environments",
    description: "Living in modern metropolitan areas exposes human lungs to particulate matter that reduces vital capacity by up to 25%. Iron Lung empowers individuals to proactively strengthen airway defense and vital capacity.",
    highlights: [
      "Strengthens respiratory resistance against smog fatigue",
      "Promotes airway clearance and alveolar efficiency",
      "Maintains lifelong vital lung capacity and stamina"
    ]
  }
];

interface HowItWorksPageProps {
  onBookDemo: () => void;
  onContactUs: () => void;
  onNavigateSection: (section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about' | 'how-it-works' | 'book-demo' | 'contact') => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onBookDemo,
  onContactUs,
  onNavigateSection,
}) => {
  const [selectedModeIndex, setSelectedModeIndex] = useState(0);
  const [activeAppTab, setActiveAppTab] = useState(0);

  const activeMode = MODES[selectedModeIndex];
  const activeApp = APPLICATIONS[activeAppTab];

  const handleNavbarNavigate = (section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about' | 'how-it-works' | 'book-demo' | 'contact') => {
    if (section === 'how-it-works') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigateSection(section);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen font-body overflow-x-hidden selection:bg-[#ff6900]/20 relative">
      {/* Existing Brand Navigation Bar */}
      <HeroNavbar
        onBookDemo={onBookDemo}
        onContactUs={onContactUs}
        onNavigateSection={handleNavbarNavigate}
        activeSection="how-it-works"
      />

      {/* Atmospheric Ambient Lighting */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[#ff6900]/[0.05] rounded-full blur-[160px]" />
        <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] bg-accent/[0.04] rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 -left-48 w-[600px] h-[600px] bg-[#ff6900]/[0.04] rounded-full blur-[140px]" />
      </div>

      <main className="relative z-10 pt-24 sm:pt-28 md:pt-36">
        
        {/* ================================================================= */}
        {/* SECTION 1: HERO HEADER                                            */}
        {/* ================================================================= */}
        <section className="px-4 sm:px-6 md:px-10 max-w-7xl 2xl:max-w-[1400px] 3xl:max-w-[1640px] 4xl:max-w-[1840px] 5xl:max-w-[2200px] mx-auto text-center mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-6 max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl mx-auto"
          >
            {/* System Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 2xl:py-2 rounded-full bg-[#ff6900]/10 border border-[#ff6900]/25 text-[#ff6900] text-[11px] sm:text-xs 2xl:text-sm font-mono font-bold tracking-widest uppercase">
              <Activity className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 animate-pulse" />
              <span>Intelligent Respiratory Architecture</span>
            </div>

            {/* Main Headline */}
            <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl 2xl:text-9xl font-black font-display tracking-tight text-foreground uppercase leading-[1.05] flex items-center justify-center gap-x-3 sm:gap-x-4 flex-wrap">
              <KineticText text="System" as="h1" className="text-foreground tracking-tight" />
              <KineticText text="Capabilities" as="span" className="text-[#ff6900] tracking-tight" />
            </div>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg md:text-xl 2xl:text-2xl text-muted-foreground font-medium max-w-2xl 2xl:max-w-3xl mx-auto leading-relaxed">
              Engineered pneumatic resistance, real-time biometric telemetry, and cloud-synced adaptive conditioning designed for uncompromising respiratory performance.
            </p>

            {/* Telemetry Stat Bar */}
            <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl 2xl:max-w-5xl mx-auto">
              {[
                { label: "Resistance Modes", value: "5 + Custom", detail: "Progressive Load" },
                { label: "Pneumatic Valves", value: "< 2ms", detail: "Sub-ms Response" },
                { label: "Profile Sync", value: "RFID Instant", detail: "Nationwide Terminals" },
                { label: "Biofeedback", value: "Real-time", detail: "22\" FHD Waveform" }
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className="bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl p-3 sm:p-4 text-left shadow-xs hover:border-[#ff6900]/40 transition-colors"
                >
                  <div className="text-[10px] 2xl:text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    {stat.label}
                  </div>
                  <div className="text-lg sm:text-xl 2xl:text-2xl font-black font-display text-foreground text-[#ff6900]">
                    {stat.value}
                  </div>
                  <div className="text-[11px] 2xl:text-xs text-muted-foreground font-body">
                    {stat.detail}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 2: INTERACTIVE MODE TELEMETRY SIMULATOR                   */}
        {/* ================================================================= */}
        <section className="px-4 sm:px-6 md:px-10 max-w-7xl 2xl:max-w-[1400px] 3xl:max-w-[1640px] 4xl:max-w-[1840px] 5xl:max-w-[2200px] mx-auto mb-20 sm:mb-28">
          
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12 border-b border-border/80 pb-6">
            <div>
              <span className="text-xs 2xl:text-sm font-mono uppercase tracking-widest text-[#ff6900] font-bold block mb-1">
                Dynamic Resistance Engine
              </span>
              <KineticText 
                text="6 Intelligent Modes" 
                as="h2" 
                className="text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl 3xl:text-7xl font-black font-display text-foreground tracking-tight" 
              />
            </div>
            <p className="text-xs sm:text-sm 2xl:text-base text-muted-foreground max-w-md 2xl:max-w-xl font-body leading-relaxed">
              Select any mode below to inspect its targeted resistance parameters, volumetric curves, and specific physiological adaptations.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-8">
            {MODES.map((mode, index) => {
              const isSelected = selectedModeIndex === index;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedModeIndex(index)}
                  className={`relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                    isSelected
                      ? "bg-card border-[#ff6900] shadow-[0_4px_20px_rgba(255,105,0,0.18)]"
                      : "bg-card/60 border-border/70 hover:border-border hover:bg-card/90"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeModeBar"
                      className="absolute top-0 left-0 right-0 h-1 bg-[#ff6900]"
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] 2xl:text-xs font-mono font-bold tracking-widest ${
                      isSelected ? "text-[#ff6900]" : "text-muted-foreground"
                    }`}>
                      MODE {mode.number}
                    </span>
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: mode.color }} 
                    />
                  </div>

                  <div className="text-xs sm:text-sm 2xl:text-base font-bold font-display text-foreground line-clamp-1">
                    {mode.name}
                  </div>
                  <div className="text-[10px] 2xl:text-xs text-muted-foreground font-mono mt-1">
                    {mode.resistance.split(' ')[0]} cmH2O
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Mode Interactive Telemetry Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMode.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-card/90 backdrop-blur-xl border border-border/90 rounded-3xl p-5 sm:p-8 md:p-10 shadow-soft-depth relative overflow-hidden"
            >
              <div 
                className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20"
                style={{ backgroundColor: activeMode.color }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
                
                {/* Left Column: Mode Info */}
                <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-full text-[11px] 2xl:text-xs font-mono font-bold uppercase tracking-wider bg-foreground/5 border border-border/80 text-foreground">
                        {activeMode.badge}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        Target Load: {activeMode.intensityPercent}%
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-foreground tracking-tight mb-2">
                      {activeMode.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-[#ff6900] uppercase tracking-wider font-semibold mb-4">
                      {activeMode.tagline}
                    </p>

                    <p className="text-sm sm:text-base 2xl:text-lg text-muted-foreground leading-relaxed font-body">
                      {activeMode.description}
                    </p>
                  </div>

                  {/* Adaptations Checklist */}
                  <div className="pt-4 border-t border-border/60">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                      Target Physiological Adaptations
                    </h4>
                    <div className="space-y-2.5">
                      {activeMode.adaptations.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-[#ff6900]/15 text-[#ff6900] flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                          <span className="text-xs sm:text-sm text-foreground/90 font-medium">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Waveform & Telemetry Panel */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                  
                  {/* Waveform Box */}
                  <div className="bg-background/90 rounded-2xl border border-border/90 p-4 sm:p-5 relative overflow-hidden shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: activeMode.color }} />
                        <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                          Live Tidal Waveform Telemetry
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        22" Console Feed
                      </span>
                    </div>

                    <div className="relative h-32 sm:h-36 2xl:h-44 w-full flex items-center justify-center overflow-hidden bg-black/5 dark:bg-white/5 rounded-xl border border-border/50">
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ff6900_1px,transparent_1px)] [background-size:16px_16px]" />

                      <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={activeMode.color} stopOpacity="0.2" />
                            <stop offset="50%" stopColor={activeMode.color} stopOpacity="1" />
                            <stop offset="100%" stopColor={activeMode.color} stopOpacity="0.4" />
                          </linearGradient>
                        </defs>
                        
                        <motion.path
                          d="M 0 60 Q 62.5 15, 125 60 T 250 60 T 375 60 T 500 60"
                          fill="none"
                          stroke="url(#waveGradient)"
                          strokeWidth="3.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, ease: "easeInOut" }}
                        />
                        
                        <path
                          d="M 0 60 Q 62.5 15, 125 60 T 250 60 T 375 60 T 500 60"
                          fill="none"
                          stroke={activeMode.color}
                          strokeWidth="1"
                          strokeOpacity="0.5"
                        />
                      </svg>

                      <div className="absolute top-2 left-3 text-[9px] 2xl:text-[10px] font-mono text-muted-foreground uppercase">
                        INSPIRATION PHASE ↑
                      </div>
                      <div className="absolute bottom-2 right-3 text-[9px] 2xl:text-[10px] font-mono text-muted-foreground uppercase">
                        EXPIRATION RESISTANCE ↓
                      </div>
                    </div>
                  </div>

                  {/* 4 Gauges */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-background/80 border border-border/80 rounded-xl p-3.5 sm:p-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-1">
                        <Gauge className="w-3.5 h-3.5 text-[#ff6900]" />
                        <span>Pneumatic Resistance</span>
                      </div>
                      <div className="text-base sm:text-xl font-black font-mono text-foreground">
                        {activeMode.resistance}
                      </div>
                    </div>

                    <div className="bg-background/80 border border-border/80 rounded-xl p-3.5 sm:p-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-1">
                        <Wind className="w-3.5 h-3.5 text-[#ff6900]" />
                        <span>Volumetric Flow Rate</span>
                      </div>
                      <div className="text-base sm:text-xl font-black font-mono text-foreground">
                        {activeMode.flowRate}
                      </div>
                    </div>

                    <div className="bg-background/80 border border-border/80 rounded-xl p-3.5 sm:p-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-1">
                        <Activity className="w-3.5 h-3.5 text-[#ff6900]" />
                        <span>Target Cadence</span>
                      </div>
                      <div className="text-base sm:text-xl font-black font-mono text-foreground">
                        {activeMode.cadence}
                      </div>
                    </div>

                    <div className="bg-background/80 border border-border/80 rounded-xl p-3.5 sm:p-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-1">
                        <Sliders className="w-3.5 h-3.5 text-[#ff6900]" />
                        <span>Inhale : Exhale Ratio</span>
                      </div>
                      <div className="text-base sm:text-xl font-black font-mono text-foreground">
                        {activeMode.ieRatio}
                      </div>
                    </div>
                  </div>

                  {/* Direct Link */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground font-body">
                      Calibrated live on every 22" touch display.
                    </span>
                    <button
                      onClick={onBookDemo}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#ff6900] hover:text-[#ff8a3d] transition-colors cursor-pointer"
                    >
                      <span>Try this mode live</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          </AnimatePresence>

        </section>

        {/* ================================================================= */}
        {/* SECTION 3: END-TO-END DIGITAL ECOSYSTEM                           */}
        {/* ================================================================= */}
        <section className="px-4 sm:px-6 md:px-10 max-w-7xl 2xl:max-w-[1400px] 3xl:max-w-[1640px] 4xl:max-w-[1840px] 5xl:max-w-[2200px] mx-auto mb-20 sm:mb-28">
          
          <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs 2xl:text-sm font-mono uppercase tracking-widest text-[#ff6900] font-bold block mb-2">
              Connected Infrastructure
            </span>
            <div className="mb-4">
              <KineticText 
                text="End-to-End Support Ecosystem" 
                as="h2" 
                className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl 3xl:text-8xl font-black font-display text-foreground tracking-tight" 
              />
            </div>
            <p className="text-sm sm:text-base 2xl:text-lg text-muted-foreground leading-relaxed font-body">
              Iron Lung integrates precision mechanical hardware with seamless cloud intelligence and instant messaging dispatch.
            </p>
          </div>

          {/* 4 Executive Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 2xl:gap-10">
            {ECOSYSTEM_PILLARS.map((pillar) => {
              const IconComponent = pillar.icon;
              return (
                <motion.div
                  key={pillar.number}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="bg-card/85 backdrop-blur-md border border-border/80 rounded-3xl p-6 sm:p-8 2xl:p-10 relative overflow-hidden shadow-soft-depth group hover:border-[#ff6900]/40 transition-all flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 p-6 sm:p-8 2xl:p-10 text-3xl sm:text-4xl 2xl:text-5xl font-mono font-black text-muted-foreground/15 group-hover:text-[#ff6900]/20 transition-colors pointer-events-none">
                    {pillar.number}
                  </div>

                  <div>
                    {/* Icon */}
                    <div className="w-12 h-12 2xl:w-14 2xl:h-14 rounded-2xl bg-[#ff6900]/10 border border-[#ff6900]/25 text-[#ff6900] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 2xl:w-7 2xl:h-7" />
                    </div>

                    <span className="text-[11px] 2xl:text-xs font-mono uppercase tracking-widest text-[#ff6900] font-bold block mb-1">
                      {pillar.tagline}
                    </span>
                    <h3 className="text-2xl 2xl:text-3xl font-black font-display text-foreground mb-3 tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-sm 2xl:text-base text-muted-foreground leading-relaxed font-body mb-6">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Bullet features */}
                  <div className="space-y-2 2xl:space-y-3 pt-4 border-t border-border/60">
                    {pillar.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm 2xl:text-base text-foreground/80 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </section>

        {/* ================================================================= */}
        {/* SECTION 4: MULTI-SECTOR APPLICATIONS ("WHO IT'S BUILT FOR")       */}
        {/* ================================================================= */}
        <section className="px-4 sm:px-6 md:px-10 max-w-7xl 2xl:max-w-[1400px] 3xl:max-w-[1640px] 4xl:max-w-[1840px] 5xl:max-w-[2200px] mx-auto mb-20 sm:mb-28">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12 border-b border-border/80 pb-6">
            <div>
              <span className="text-xs 2xl:text-sm font-mono uppercase tracking-widest text-[#ff6900] font-bold block mb-1">
                Target Sectors & Audiences
              </span>
              <KineticText 
                text="Who Can Benefit" 
                as="h2" 
                className="text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl 3xl:text-7xl font-black font-display text-foreground tracking-tight" 
              />
            </div>
            <p className="text-xs sm:text-sm 2xl:text-base text-muted-foreground max-w-md 2xl:max-w-xl font-body leading-relaxed">
              Engineered to deliver measurable respiratory enhancements across athletic facilities, corporate environments, and individual fitness hubs.
            </p>
          </div>

          {/* Application Selection Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-8">
            {APPLICATIONS.map((app, index) => {
              const isSelected = activeAppTab === index;
              const IconComp = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => setActiveAppTab(index)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-card border-[#ff6900] shadow-md shadow-[#ff6900]/10"
                      : "bg-card/50 border-border/70 hover:border-border hover:bg-card/80"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${
                    isSelected ? "bg-[#ff6900] text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="text-xs sm:text-sm font-bold font-display text-foreground">
                    {app.title}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    {app.badge}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Application Detail Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeApp.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-card/90 backdrop-blur-xl border border-border/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-soft-depth"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6900]/10 border border-[#ff6900]/25 text-[#ff6900] text-xs font-mono font-semibold uppercase tracking-wider">
                    <span>{activeApp.badge}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-foreground tracking-tight">
                    {activeApp.headline}
                  </h3>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-body">
                    {activeApp.description}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {activeApp.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-[#ff6900]/15 text-[#ff6900] flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <span className="text-xs sm:text-sm text-foreground/90 font-medium">
                          {h}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-background/80 rounded-2xl border border-border/80 p-6 text-center space-y-4 shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-[#ff6900]/10 text-[#ff6900] flex items-center justify-center mx-auto border border-[#ff6900]/25">
                    <activeApp.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-display text-foreground">
                      Deploy in Your Facility
                    </h4>
                    <p className="text-xs text-muted-foreground font-body mt-1 leading-relaxed">
                      Custom procurement programs, pilot installations, and volume terms available for authorized operators.
                    </p>
                  </div>
                  <AntiMetalButton
                    onClick={onBookDemo}
                    label="Schedule Consultation"
                    className="w-full h-11 text-xs"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </section>

        {/* ================================================================= */}
        {/* SECTION 5: FINAL HIGH-CONVERTING CALL TO ACTION                   */}
        {/* ================================================================= */}
        <section className="px-4 sm:px-6 md:px-10 max-w-5xl 2xl:max-w-6xl mx-auto mb-20 sm:mb-28 text-center">
          <div className="bg-gradient-to-b from-card to-card/60 border border-border/90 rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-soft-depth">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ff6900]/10 rounded-full blur-[100px] pointer-events-none" />

            <span className="text-xs font-mono uppercase tracking-widest text-[#ff6900] font-bold block mb-3">
              Ready for the Next Generation?
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display text-foreground tracking-tight mb-4 uppercase">
              Transform Your Respiratory Power
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed font-body">
              Experience the Iron Lung flagship station in an interactive 1-on-1 live session. Explore pneumatic resistance profiles and console telemetry firsthand.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <AntiMetalButton
                onClick={onBookDemo}
                label="Book Live Demonstration"
                className="h-12 w-48 sm:w-56 text-xs sm:text-sm"
              />
              <button
                onClick={onContactUs}
                className="h-12 px-6 sm:px-8 inline-flex items-center justify-center rounded-xl bg-background hover:bg-muted border border-border text-foreground font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                Talk to Engineering
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Cinematic Footer */}
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
