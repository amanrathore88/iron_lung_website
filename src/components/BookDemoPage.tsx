import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Building2, 
  User, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Radio,
  Cpu
} from 'lucide-react';
import { HeroNavbar } from './HeroNavbar';
import Footer from './Footer';
import { KineticText } from './ui/kinetic-text';
import { 
  validateIndianMobile, 
  validateEmail, 
  validateName, 
  validateOrganization, 
  validateMessage,
  normalizeIndianMobile 
} from '../lib/validators';

export const VALUE_PILLARS = [
  {
    step: "01",
    icon: Target,
    title: "Tailored Live Demonstration",
    description: "Walk through targeted respiratory modes, real-time biofeedback, and custom user profiling.",
    badge: "Personalized",
    highlight: "Live Profile Simulation"
  },
  {
    step: "02",
    icon: Cpu,
    title: "Hardware & Admin Dashboard Overview",
    description: "Explore device connectivity, RFID user cards, and cloud analytics dashboard integration.",
    badge: "Hardware & Cloud",
    highlight: "RFID & 60Hz Telemetry"
  },
  {
    step: "03",
    icon: MessageSquare,
    title: "Q&A with Technical Specialists",
    description: "Get immediate answers regarding bulk deployment, pricing options, and technical specifications.",
    badge: "Direct Access",
    highlight: "Commercial & Tech Terms"
  }
];

export const TIME_SLOTS = [
  { id: "morning", label: "Morning Window", hours: "10:00 AM – 01:00 PM IST" },
  { id: "afternoon", label: "Afternoon Window", hours: "02:00 PM – 05:00 PM IST" },
  { id: "evening", label: "Evening Window", hours: "05:00 PM – 08:00 PM IST" }
];

export const AGENDA_STAGES = [
  {
    index: "01",
    duration: "5 MIN",
    title: "Facility Scope & Targets",
    detail: "Review your training volume, user demographics, and facility targets."
  },
  {
    index: "02",
    duration: "15 MIN",
    title: "Console & Resistance Run",
    detail: "Interactive walk-through of the 22-inch interface, tidal volumes, and resistance curves."
  },
  {
    index: "03",
    duration: "10 MIN",
    title: "Procurement & Commercials",
    detail: "Nationwide white-glove setup, warranty scope, and custom deployment terms."
  }
];

interface BookDemoPageProps {
  onContactUs: () => void;
  onNavigateSection: (section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about' | 'how-it-works' | 'book-demo' | 'contact') => void;
}

export const BookDemoPage: React.FC<BookDemoPageProps> = ({
  onContactUs,
  onNavigateSection,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [requirements, setRequirements] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formAttempted, setFormAttempted] = useState(false);

  // Field touched state for instant feedback
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setFieldTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Real-time validators
  const nameValidation = useMemo(() => validateName(fullName), [fullName]);
  const emailValidation = useMemo(() => validateEmail(email), [email]);
  const phoneValidation = useMemo(() => validateIndianMobile(phone), [phone]);
  const orgValidation = useMemo(() => validateOrganization(organization), [organization]);
  const reqValidation = useMemo(() => validateMessage(requirements), [requirements]);

  const isFormValid =
    nameValidation.isValid &&
    emailValidation.isValid &&
    phoneValidation.isValid &&
    orgValidation.isValid &&
    reqValidation.isValid;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('phone');
    const raw = e.target.value;
    const cleaned = normalizeIndianMobile(raw);
    setPhone(cleaned.slice(0, 10));
  };

  const activeSlot = TIME_SLOTS.find((s) => s.id === selectedSlot) || TIME_SLOTS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormAttempted(true);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      organization: true,
      requirements: true,
    });

    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);

    const trackingId = `IL-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await fetch('https://formsubmit.co/ajax/info@ironlung.in', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `[IRON LUNG LEAD] Live Demo: ${fullName.trim()} - ${organization.trim()}`,
          _replyto: email.trim(),
          _template: 'table',
          'INQUIRY TYPE': '1-on-1 Product Demonstration',
          'REFERENCE ID': trackingId,
          'FULL NAME': fullName.trim(),
          'MOBILE (INDIA)': `+91 ${phone.trim()}`,
          'EMAIL ADDRESS': email.trim(),
          'FACILITY / ORGANIZATION': organization.trim(),
          'PREFERRED TIME WINDOW': `${activeSlot.label} (${activeSlot.hours})`,
          'REQUIREMENTS & BRIEF': requirements.trim() || 'No specific notes provided',
          'TIMESTAMP (IST)': `${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`
        })
      });
    } catch (err) {
      console.log('Demo submission logged locally:', { fullName, email, phone: `+91 ${phone}`, organization, selectedSlot });
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleNavbarNavigate = (section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about' | 'how-it-works' | 'book-demo' | 'contact') => {
    if (section === 'book-demo') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigateSection(section);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-[#ff6900]/20 relative font-sans">
      {/* Website's Existing Brand Navigation Bar */}
      <HeroNavbar
        onBookDemo={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onContactUs={onContactUs}
        onNavigateSection={handleNavbarNavigate}
        activeSection="book-demo"
      />

      {/* Atmospheric Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl 2xl:max-w-[1400px] 3xl:max-w-[1640px] 4xl:max-w-[1840px] 5xl:max-w-[2200px] h-[700px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-16 left-1/4 w-[500px] 2xl:w-[700px] h-[500px] 2xl:h-[700px] bg-[#ff6900]/[0.06] rounded-full blur-[140px]" />
        <div className="absolute top-48 right-1/4 w-[500px] 2xl:w-[700px] h-[500px] 2xl:h-[700px] bg-[#ff6900]/[0.03] rounded-full blur-[160px]" />
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 pt-24 sm:pt-28 md:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 md:px-10 max-w-7xl 2xl:max-w-[1400px] 3xl:max-w-[1640px] 4xl:max-w-[1840px] 5xl:max-w-[2200px] mx-auto w-full">
        
        {/* ========================================================= */}
        {/* 1. TOP HEADER: BOLD & BALANCED                            */}
        {/* ========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-10 sm:mb-12 2xl:mb-16"
        >
          <div className="inline-flex items-center gap-2 py-1.5 px-3.5 sm:px-4 2xl:px-5 mb-4 rounded-full bg-[#ff6900]/10 border border-[#ff6900]/25 text-[#ff6900] text-[11px] sm:text-xs 2xl:text-sm font-mono font-bold tracking-wider uppercase shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6900] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6900]"></span>
            </span>
            <span>DIRECT PRODUCT DEMONSTRATION · 1-ON-1 SESSIONS</span>
          </div>

          <div className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl 3xl:text-8xl font-black font-display tracking-tight text-foreground leading-[1.08] mb-3 sm:mb-4">
            <div className="flex justify-center">
              <KineticText text="See Iron Lung in action" as="h1" className="text-foreground tracking-tight" />
            </div>
            <div className="flex items-center justify-center gap-x-2.5 flex-wrap">
              <KineticText text="with an" as="span" className="text-foreground tracking-tight" />
              <KineticText text="expert guide." as="span" className="text-[#ff6900] tracking-tight" />
            </div>
          </div>

          <p className="text-muted-foreground text-sm sm:text-base 2xl:text-lg leading-relaxed max-w-2xl 2xl:max-w-3xl mx-auto font-body">
            Schedule a 1-on-1 personalized live demonstration tailored for your personal training, athletic center, gym, or sports performance facility.
          </p>

          {/* Quick Assurance Chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] font-mono text-muted-foreground">
            <span className="px-3 py-1.5 rounded-lg bg-card border border-border/80 flex items-center gap-1.5 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#ff6900]" />
              <span>30-Min Session</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-card border border-border/80 flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero Obligation</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-card border border-border/80 flex items-center gap-1.5 shadow-2xs">
              <Radio className="w-3.5 h-3.5 text-[#ff6900]" />
              <span>Live 60Hz Telemetry</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-card border border-border/80 flex items-center gap-1.5 shadow-2xs">
              <MessageSquare className="w-3.5 h-3.5 text-[#ff6900]" />
              <span>Direct Engineer Q&A</span>
            </span>
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* 2. BALANCED 2-COLUMN MAIN CONTENT (6 COLS + 6 COLS)       */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* LEFT COLUMN: 3 BALANCED VALUE CARDS & SESSION TIMELINE */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-5 sm:gap-6">
            
            {/* 3 Perfectly Aligned Stacked Value Cards */}
            <div className="flex flex-col gap-4">
              {VALUE_PILLARS.map((pillar, idx) => {
                const IconComp = pillar.icon;
                return (
                  <motion.div
                    key={pillar.step}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
                    className="p-4 sm:p-5 rounded-2xl bg-card border border-border/90 hover:border-[#ff6900]/40 shadow-soft-depth transition-all flex items-start gap-4 relative overflow-hidden group"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#ff6900] to-[#e05600] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#ff6900]/25 mt-0.5">
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#ff6900]">
                            PART {pillar.step}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold font-display text-foreground group-hover:text-[#ff6900] transition-colors leading-snug">
                            {pillar.title}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/60 shrink-0 hidden sm:inline-block">
                          {pillar.badge}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-body">
                        {pillar.description}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center gap-1.5 text-[11px] font-mono text-[#ff6900] font-medium">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>{pillar.highlight}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* 30-Minute Structured Session Agenda Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="p-5 sm:p-6 rounded-2xl bg-card/75 border border-border/90 shadow-soft-depth flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-border/70">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                  Structured 30-Minute Agenda
                </span>
                <span className="text-[10.5px] font-mono text-[#ff6900] font-bold">
                  TOTAL: 30 MIN
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {AGENDA_STAGES.map((stage) => (
                  <div key={stage.index} className="p-3 rounded-xl bg-background/60 border border-border/60 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10.5px] font-mono font-bold text-[#ff6900]">
                        PHASE {stage.index}
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground font-semibold">
                        {stage.duration}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold font-display text-foreground leading-snug">
                      {stage.title}
                    </h4>
                    <p className="text-[10.5px] text-muted-foreground font-body leading-relaxed mt-1">
                      {stage.detail}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: BOOK YOUR LIVE DEMO FORM CARD */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/90 p-5 sm:p-7 md:p-8 shadow-soft-depth relative overflow-hidden h-full flex flex-col justify-between"
            >
              {/* Subtle top ambient glow */}
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#ff6900]/10 rounded-full blur-[80px] pointer-events-none" />

              <div>
                {/* Form Card Header */}
                <div className="flex items-center justify-between gap-3 mb-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff6900] animate-pulse" />
                    <h2 className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">
                      Book Your Live Demo
                    </h2>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#ff6900]/10 text-[#ff6900] flex items-center justify-center border border-[#ff6900]/20 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground font-body mb-6 leading-relaxed relative z-10">
                  Reserve a dedicated session with an Iron Lung product specialist. Conducted via interactive live video or on-site facility trial.
                </p>

                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="submitted"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="py-12 text-center space-y-4 relative z-10"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-[#ff6900]/15 border border-[#ff6900]/30 flex items-center justify-center text-[#ff6900] mx-auto shadow-lg shadow-[#ff6900]/15">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      
                      <div>
                        <span className="text-xs font-mono text-[#ff6900] uppercase tracking-wider font-semibold">
                          RESERVATION CONFIRMED
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-bold font-display text-foreground mt-1">
                          Live Demo Scheduled!
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Thank you, <span className="text-foreground font-semibold">{fullName}</span>. An Iron Lung product specialist will reach out at <span className="text-[#ff6900] font-mono">{email}</span> (or via <span className="font-mono text-foreground font-semibold">+91 {phone}</span>) to confirm your video meeting credentials.
                      </p>

                      {/* Telemetry Summary Card */}
                      <div className="p-4 rounded-xl bg-background/90 border border-border/80 text-xs text-foreground font-mono text-left max-w-sm mx-auto space-y-1.5 shadow-xs">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest border-b border-border/50 pb-1 mb-1">
                          Booking Telemetry
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Attendee:</span>
                          <span className="font-semibold">{fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Facility / Org:</span>
                          <span className="font-semibold">{organization || "Personal Setup"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contact:</span>
                          <span className="font-semibold">+91 {phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time Window:</span>
                          <span className="text-[#ff6900] font-semibold">{activeSlot.label}</span>
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSubmitted(false);
                            setFormAttempted(false);
                            setTouched({});
                            setFullName('');
                            setEmail('');
                            setPhone('');
                            setOrganization('');
                            setRequirements('');
                          }}
                          className="mt-3 px-6 py-2.5 bg-secondary hover:bg-muted text-foreground text-xs font-mono uppercase tracking-wider rounded-xl border border-border transition-colors cursor-pointer"
                        >
                          Book Another Demo
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <form key="form" onSubmit={handleSubmit} noValidate className="space-y-4 relative z-10">
                      
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <span>Full Name</span>
                            <span className="text-[#ff6900]">*</span>
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">Primary Contact</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/60">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => {
                              setFieldTouched('fullName');
                              setFullName(e.target.value);
                            }}
                            onBlur={() => setFieldTouched('fullName')}
                            placeholder="Dr. Rajesh / Vikram Sharma"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground/45 text-sm outline-none transition-all shadow-2xs ${
                              (touched.fullName || formAttempted) && !nameValidation.isValid
                                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                : fullName.trim() && nameValidation.isValid
                                ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                                : 'border-border/90 focus:border-[#ff6900] focus:ring-2 focus:ring-[#ff6900]/20'
                            }`}
                          />
                        </div>
                        {(touched.fullName || formAttempted) && !nameValidation.isValid && (
                          <div className="text-rose-500 text-[11px] font-mono flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{nameValidation.message}</span>
                          </div>
                        )}
                      </div>

                      {/* 2-Column: Email & Indian Mobile */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        
                        {/* Email */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <span>Work Email</span>
                              <span className="text-[#ff6900]">*</span>
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">Meeting Link</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/60">
                              <Mail className="w-4 h-4" />
                            </div>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => {
                                setFieldTouched('email');
                                setEmail(e.target.value);
                              }}
                              onBlur={() => setFieldTouched('email')}
                              placeholder="rajesh@sportsacademy.in"
                              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground/45 text-sm outline-none transition-all shadow-2xs ${
                                (touched.email || formAttempted) && !emailValidation.isValid
                                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                  : email.trim() && emailValidation.isValid
                                  ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                                  : 'border-border/90 focus:border-[#ff6900] focus:ring-2 focus:ring-[#ff6900]/20'
                              }`}
                            />
                          </div>
                          {(touched.email || formAttempted) && !emailValidation.isValid && (
                            <div className="text-rose-500 text-[11px] font-mono flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{emailValidation.message}</span>
                            </div>
                          )}
                        </div>

                        {/* Indian Mobile */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <span>Mobile (India)</span>
                              <span className="text-[#ff6900]">*</span>
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">10 Digits</span>
                          </label>
                          <div className="relative flex rounded-xl shadow-2xs">
                            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-border/90 bg-muted/60 text-foreground font-mono text-xs font-bold shrink-0">
                              +91
                            </span>
                            <input
                              type="tel"
                              value={phone}
                              onChange={handlePhoneChange}
                              onBlur={() => setFieldTouched('phone')}
                              maxLength={10}
                              placeholder="9876543210"
                              className={`w-full px-3 py-3 rounded-r-xl bg-background border text-foreground placeholder:text-muted-foreground/45 text-sm outline-none transition-all font-mono ${
                                (touched.phone || formAttempted) && !phoneValidation.isValid
                                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                  : phone.trim() && phoneValidation.isValid
                                  ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                                  : 'border-border/90 focus:border-[#ff6900] focus:ring-2 focus:ring-[#ff6900]/20'
                              }`}
                            />
                          </div>
                          {(touched.phone || formAttempted) && !phoneValidation.isValid && (
                            <div className="text-rose-500 text-[11px] font-mono flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{phoneValidation.message}</span>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Organization / Facility */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <span>Facility, Academy or Gym Name</span>
                            <span className="text-[#ff6900]">*</span>
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">Organization</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/60">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={organization}
                            onChange={(e) => {
                              setFieldTouched('organization');
                              setOrganization(e.target.value);
                            }}
                            onBlur={() => setFieldTouched('organization')}
                            placeholder="Apex Athletics Center / Cult.fit Center / Private Studio"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground/45 text-sm outline-none transition-all shadow-2xs ${
                              (touched.organization || formAttempted) && !orgValidation.isValid
                                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                : organization.trim() && orgValidation.isValid
                                ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                                : 'border-border/90 focus:border-[#ff6900] focus:ring-2 focus:ring-[#ff6900]/20'
                            }`}
                          />
                        </div>
                        {(touched.organization || formAttempted) && !orgValidation.isValid && (
                          <div className="text-rose-500 text-[11px] font-mono flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{orgValidation.message}</span>
                          </div>
                        )}
                      </div>

                      {/* Preferred Time Window Chips */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span>Preferred Time Window (IST)</span>
                          <span className="text-[10px] font-mono text-muted-foreground">Indian Standard Time</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {TIME_SLOTS.map((slot) => {
                            const isSelected = selectedSlot === slot.id;
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => setSelectedSlot(slot.id)}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#ff6900]/10 border-[#ff6900] text-foreground font-semibold shadow-xs ring-1 ring-[#ff6900]/20'
                                    : 'bg-background border-border/80 text-muted-foreground hover:text-foreground hover:border-[#ff6900]/40'
                                }`}
                              >
                                <div className="text-xs font-bold text-foreground">
                                  {slot.label}
                                </div>
                                <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                                  {slot.hours}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Specific Training Targets or Questions */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <span>Target Athletes & Use-Case Requirements</span>
                            <span className="text-[#ff6900]">*</span>
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">Min 5 chars</span>
                        </label>
                        <textarea
                          rows={3}
                          value={requirements}
                          onChange={(e) => {
                            setFieldTouched('requirements');
                            setRequirements(e.target.value);
                          }}
                          placeholder="Please describe your facility type, estimated member throughput, or specific athletic sports (e.g. marathoners, swimmers, cyclists)..."
                          onBlur={() => setFieldTouched('requirements')}
                          className={`w-full px-4 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground/45 text-sm outline-none transition-all resize-none shadow-2xs ${
                            (touched.requirements || formAttempted) && !reqValidation.isValid
                              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                              : requirements.trim() && reqValidation.isValid
                              ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                              : 'border-border/90 focus:border-[#ff6900] focus:ring-2 focus:ring-[#ff6900]/20'
                          }`}
                        />
                        {(touched.requirements || formAttempted) && !reqValidation.isValid && (
                          <div className="text-rose-500 text-[11px] font-mono flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{reqValidation.message}</span>
                          </div>
                        )}
                      </div>

                      {/* Form Error Notification if user attempts submit with errors */}
                      {formAttempted && !isFormValid && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-mono flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                          <span>Please correct the highlighted errors above before booking your demo.</span>
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <div className="pt-2">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 rounded-xl bg-[#ff6900] hover:bg-[#ff7a1a] text-white font-display font-bold tracking-wider uppercase text-xs sm:text-sm shadow-lg shadow-[#ff6900]/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-70 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <span>RESERVING LIVE SESSION...</span>
                          ) : (
                            <>
                              <span>SCHEDULE LIVE DEMO</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </motion.button>
                      </div>

                      {/* Trust & Assurance Note */}
                      <div className="pt-2 text-center text-[10.5px] font-mono text-muted-foreground/80 flex items-center justify-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Confidential Briefing · Dedicated Specialist · Instant Confirmation</span>
                      </div>

                    </form>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          </div>

        </div>
      </main>

      {/* Shared Cinematic Footer */}
      <Footer />
    </div>
  );
};

export default BookDemoPage;
