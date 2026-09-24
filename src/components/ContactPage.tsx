import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Check, 
  Copy, 
  MessageCircle, 
  Cpu, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Compass, 
  Radio, 
  User, 
  Layers, 
  ExternalLink 
} from "lucide-react";
import { HeroNavbar } from "./HeroNavbar";
import Footer from "./Footer";
import { KineticText } from "./ui/kinetic-text";
import { 
  validateIndianMobile, 
  validateEmail, 
  validateName, 
  validateOrganization, 
  validateMessage, 
  normalizeIndianMobile 
} from "../lib/validators";

// Inquiry category classification pills
export const INQUIRY_CATEGORIES = [
  { id: "fitness", label: "Fitness & Training Centers", icon: Activity },
  { id: "sports", label: "Sports & Athletic Academies", icon: ShieldCheck },
  { id: "corporate", label: "Corporate & Campus Facilities", icon: Building2 },
  { id: "private", label: "Private System Setup", icon: Cpu },
  { id: "api", label: "Smart Card & Cloud API", icon: Radio },
];

interface ContactPageProps {
  onBookDemo: () => void;
  onNavigateSection: (section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about' | 'how-it-works' | 'book-demo' | 'contact' | 'technology') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onBookDemo,
  onNavigateSection,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("fitness");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [refId, setRefId] = useState("");
  const [formAttempted, setFormAttempted] = useState(false);

  // Field touched tracking for inline feedback
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setFieldTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Real-time validators
  const nameValidation = useMemo(() => validateName(fullName), [fullName]);
  const orgValidation = useMemo(() => validateOrganization(organization), [organization]);
  const emailValidation = useMemo(() => validateEmail(email), [email]);
  const phoneValidation = useMemo(() => validateIndianMobile(phone), [phone]);
  const msgValidation = useMemo(() => validateMessage(message), [message]);

  const isFormValid =
    nameValidation.isValid &&
    orgValidation.isValid &&
    emailValidation.isValid &&
    phoneValidation.isValid &&
    msgValidation.isValid;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldTouched("phone");
    const raw = e.target.value;
    const cleaned = normalizeIndianMobile(raw);
    setPhone(cleaned.slice(0, 10));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormAttempted(true);
    setTouched({
      fullName: true,
      organization: true,
      email: true,
      phone: true,
      message: true,
    });

    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);
    
    // Generate a sleek technical reference ID
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const generatedRefId = `IL-ENG-${randomCode}`;
    setRefId(generatedRefId);

    const activeCat = INQUIRY_CATEGORIES.find((c) => c.id === selectedCategory)?.label || selectedCategory;

    try {
      await fetch('https://formsubmit.co/ajax/info@ironlung.in', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `[IRON LUNG LEAD] Inquiry: ${fullName.trim()} (${activeCat})`,
          _replyto: email.trim(),
          _template: 'table',
          'INQUIRY TYPE': 'Direct Engineering & Deployment Desk',
          'REFERENCE ID': generatedRefId,
          'FULL NAME': fullName.trim(),
          'FACILITY / ORGANIZATION': organization.trim(),
          'MOBILE (INDIA)': `+91 ${phone.trim()}`,
          'EMAIL ADDRESS': email.trim(),
          'INQUIRY CATEGORY': activeCat,
          'HARDWARE NEEDS & BRIEF': message.trim(),
          'WHATSAPP UPDATES OPT-IN': whatsappUpdates ? 'Yes, opted-in' : 'No',
          'TIMESTAMP (IST)': `${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`
        })
      });
    } catch (err) {
      console.log('Contact inquiry logged locally:', { fullName, email, phone: `+91 ${phone}`, organization, message });
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleNavbarNavigate = (section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about' | 'how-it-works' | 'book-demo' | 'contact' | 'technology') => {
    if (section === 'contact') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigateSection(section);
    }
  };

  const whatsappDirectUrl = `https://wa.me/918853667396?text=${encodeURIComponent(
    `Hello Iron Lung Engineering Team, I would like to inquire about the Iron Lung system for ${
      INQUIRY_CATEGORIES.find((c) => c.id === selectedCategory)?.label || "my facility"
    }.`
  )}`;

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-[#ff6900]/20 relative">
      {/* Website's Existing Brand Navigation Bar */}
      <HeroNavbar
        onBookDemo={onBookDemo}
        onContactUs={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateSection={handleNavbarNavigate}
        activeSection="contact"
      />

      {/* Atmospheric ambient lighting & subtle background grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl 2xl:max-w-[1400px] 3xl:max-w-[1640px] 4xl:max-w-[1840px] 5xl:max-w-[2200px] h-[700px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-16 left-1/4 w-[500px] 2xl:w-[700px] h-[500px] 2xl:h-[700px] bg-[#ff6900]/[0.06] rounded-full blur-[140px]" />
        <div className="absolute top-36 right-1/4 w-[450px] 2xl:w-[650px] h-[450px] 2xl:h-[650px] bg-[#ff6900]/[0.04] rounded-full blur-[120px]" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 pt-24 sm:pt-28 md:pt-36 pb-16 sm:pb-20 px-3.5 sm:px-6 lg:px-10 max-w-7xl 2xl:max-w-[1400px] 3xl:max-w-[1640px] 4xl:max-w-[1840px] 5xl:max-w-[2200px] mx-auto w-full">
        
        {/* ========================================================= */}
        {/* 1. TOP HEADER & ENGINEERING STATUS BANNER                 */}
        {/* ========================================================= */}
        <div className="mb-10 sm:mb-14 2xl:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start"
          >
            {/* Live Incubation & Engineering Badge */}
            <div className="inline-flex items-center gap-2.5 py-1.5 px-4 mb-4 rounded-full bg-[#ff6900]/10 border border-[#ff6900]/25 text-[#ff6900] text-xs font-mono font-semibold tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6900] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6900]" />
              </span>
              Direct Engineering & Deployment Desk
            </div>

            <div className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl 3xl:text-8xl font-black font-display tracking-tight text-foreground leading-[1.08] mb-4">
              <div>
                <KineticText text="Connect With Our" as="h1" className="text-foreground tracking-tight" />
              </div>
              <div>
                <KineticText text="Hardware Architects" as="span" className="text-[#ff6900] tracking-tight" />
              </div>
            </div>

            <p className="text-muted-foreground text-sm sm:text-base 2xl:text-lg leading-relaxed max-w-2xl 2xl:max-w-3xl font-body">
              Whether deploying high-volume respiration pods in sports academies or configuring custom smart card telemetry, our IIT Kanpur engineering team is ready to assist.
            </p>

            {/* Quick Technical Assurance Tags */}
            <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
              <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-xl bg-card border border-border/90 text-xs font-medium text-foreground shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>SIIC Incubated, IIT Kanpur</span>
              </div>
              <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-xl bg-card border border-border/90 text-xs font-medium text-foreground shadow-xs">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Priority Response &lt; 2 Hours</span>
              </div>
              <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-xl bg-card border border-border/90 text-xs font-medium text-foreground shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>Complimentary On-Site Calibration</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ========================================================= */}
        {/* 2. TWO-COLUMN HIGH-TECH WORKSPACE                         */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: INTERACTIVE FORM & INQUIRY CATEGORIES (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Category Selector Dock */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-card/90 backdrop-blur-xl border border-border shadow-soft-depth">
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>Select Inquiry Nature</span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {INQUIRY_CATEGORIES.map((cat) => {
                  const IconComp = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-medium transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                        isSelected
                          ? "bg-[#ff6900] text-white font-semibold shadow-md shadow-[#ff6900]/25 scale-[1.02]"
                          : "bg-background border border-border hover:border-[#ff6900]/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Card */}
            <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-card/95 backdrop-blur-xl border border-border shadow-xl relative overflow-hidden">
              <div className="mb-5 sm:mb-6 border-b border-border/60 pb-3 sm:pb-4">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground tracking-tight">
                  Direct Dispatch Terminal
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground font-body mt-1">
                  Submitted briefs are routed directly to our hardware deployment engineers.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="submitted-state"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="py-8 text-center space-y-5"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#ff6900]/15 border border-[#ff6900]/30 flex items-center justify-center text-[#ff6900] mx-auto shadow-lg shadow-[#ff6900]/15">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div>
                      <span className="font-mono text-xs text-[#ff6900] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#ff6900]/10 border border-[#ff6900]/25 inline-block mb-2">
                        {refId}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                        Inquiry Received & Routed
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2 leading-relaxed font-body">
                        Thank you, <span className="text-foreground font-semibold">{fullName}</span>. An Iron Lung systems engineer will follow up at <span className="text-[#ff6900] font-mono font-medium">{email}</span> (or via <span className="font-mono text-foreground font-semibold">+91 {phone}</span>) within 2 hours.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-3 justify-center items-center">
                      <a
                        href={whatsappDirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Open WhatsApp Thread</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormAttempted(false);
                          setTouched({});
                          setFullName("");
                          setOrganization("");
                          setEmail("");
                          setPhone("");
                          setMessage("");
                        }}
                        className="px-5 py-3 bg-secondary text-foreground text-xs font-mono uppercase rounded-xl border border-border hover:bg-muted transition-colors cursor-pointer"
                      >
                        Submit Another Brief
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    
                    {/* Full Name & Organization */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#ff6900]" />
                            <span>Full Name</span>
                            <span className="text-[#ff6900]">*</span>
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="e.g. Arjun Sharma"
                            value={fullName}
                            onChange={(e) => {
                              setFullName(e.target.value);
                              setFieldTouched("fullName");
                            }}
                            onBlur={() => setFieldTouched("fullName")}
                            className={`w-full px-4 pr-10 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground/50 text-sm outline-none transition-all shadow-inner ${
                              (touched.fullName || formAttempted) && !nameValidation.isValid
                                ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                : fullName.trim() && nameValidation.isValid
                                ? "border-emerald-500/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                : "border-border/90 focus:border-[#ff6900] focus:ring-2 focus:ring-[#ff6900]/15"
                            }`}
                          />
                          {fullName.trim() && nameValidation.isValid && (
                            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        {(touched.fullName || formAttempted) && !nameValidation.isValid && (
                          <div className="text-rose-500 text-[11px] font-mono flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{nameValidation.message}</span>
                          </div>
                        )}
                      </div>

                      {/* Organization */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#ff6900]" />
                            <span>Organization / Facility</span>
                            <span className="text-[#ff6900]">*</span>
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="e.g. FitZone Elite Academy"
                            value={organization}
                            onChange={(e) => {
                              setOrganization(e.target.value);
                              setFieldTouched("organization");
                            }}
                            onBlur={() => setFieldTouched("organization")}
                            className={`w-full px-4 pr-10 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground/50 text-sm outline-none transition-all shadow-inner ${
                              (touched.organization || formAttempted) && !orgValidation.isValid
                                ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                : organization.trim() && orgValidation.isValid
                                ? "border-emerald-500/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                : "border-border/90 focus:border-[#ff6900] focus:ring-2 focus:ring-[#ff6900]/15"
                            }`}
                          />
                          {organization.trim() && orgValidation.isValid && (
                            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        {(touched.organization || formAttempted) && !orgValidation.isValid && (
                          <div className="text-rose-500 text-[11px] font-mono flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{orgValidation.message}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Work / Direct Email with Real-Time Checker */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#ff6900]" />
                            <span>Work / Direct Email</span>
                            <span className="text-[#ff6900]">*</span>
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="arjun@facility.in"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setFieldTouched("email");
                            }}
                            onBlur={() => setFieldTouched("email")}
                            className={`w-full px-4 pr-10 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground/50 text-sm outline-none transition-all shadow-inner ${
                              (touched.email || formAttempted) && !emailValidation.isValid
                                ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                : email.trim() && emailValidation.isValid
                                ? "border-emerald-500/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                : "border-border/90 focus:border-[#ff6900] focus:ring-2 focus:ring-[#ff6900]/15"
                            }`}
                          />
                          {email.trim() && emailValidation.isValid && (
                            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        {(touched.email || formAttempted) && !emailValidation.isValid && (
                          <div className="text-rose-500 text-[11px] font-mono flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{emailValidation.message}</span>
                          </div>
                        )}
                        {email.trim() && emailValidation.isValid && (
                          <div className="text-emerald-500 text-[11px] font-mono flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            <span>Valid email domain verified</span>
                          </div>
                        )}
                      </div>

                      {/* Indian Mobile Number (10 Digits starting with 6-9) */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#ff6900]" />
                            <span>Mobile (India)</span>
                            <span className="text-[#ff6900]">*</span>
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {phone.length}/10
                          </span>
                        </label>
                        <div className="relative flex items-center">
                          {/* Professional +91 prefix badge */}
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-mono font-semibold text-muted-foreground border-r border-border/60 pr-2.5 mr-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-muted text-foreground mr-1.5 border border-border/80">IN</span>
                            <span>+91</span>
                          </div>
                          <input
                            type="tel"
                            placeholder="98765 43210"
                            value={phone}
                            maxLength={10}
                            onChange={handlePhoneChange}
                            onBlur={() => setFieldTouched("phone")}
                            className={`w-full pl-[82px] pr-10 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground/50 text-sm font-mono outline-none transition-all shadow-inner ${
                              (touched.phone || formAttempted) && !phoneValidation.isValid
                                ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                : phone.length === 10 && phoneValidation.isValid
                                ? "border-emerald-500/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                : "border-border/90 focus:border-[#ff6900] focus:ring-2 focus:ring-[#ff6900]/15"
                            }`}
                          />
                          {phone.length === 10 && phoneValidation.isValid && (
                            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        {(touched.phone || formAttempted) && !phoneValidation.isValid && (
                          <div className="text-rose-500 text-[11px] font-mono flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{phoneValidation.message}</span>
                          </div>
                        )}
                        {phone.length === 10 && phoneValidation.isValid && (
                          <div className="text-emerald-500 text-[11px] font-mono flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            <span>Valid 10-digit Indian number (starts with {phone[0]})</span>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Message / Specifications */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#ff6900]" />
                          <span>Project Requirements & Hardware Needs</span>
                          <span className="text-[#ff6900]">*</span>
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">Detailed Brief</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Detail your expected volume of users, installation location, or specific training protocols needed..."
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          setFieldTouched("message");
                        }}
                        onBlur={() => setFieldTouched("message")}
                        className={`w-full px-4 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground/50 text-sm outline-none transition-all resize-none shadow-inner ${
                          (touched.message || formAttempted) && !msgValidation.isValid
                            ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            : message.trim() && msgValidation.isValid
                            ? "border-emerald-500/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            : "border-border/90 focus:border-[#ff6900] focus:ring-2 focus:ring-[#ff6900]/15"
                        }`}
                      />
                      {(touched.message || formAttempted) && !msgValidation.isValid && (
                        <div className="text-rose-500 text-[11px] font-mono flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{msgValidation.message}</span>
                        </div>
                      )}
                    </div>

                    {/* WhatsApp Fast Update Checkbox */}
                    <div className="flex items-center gap-2.5 pt-1 cursor-pointer select-none" onClick={() => setWhatsappUpdates(!whatsappUpdates)}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        whatsappUpdates ? "bg-[#ff6900] border-[#ff6900] text-white" : "border-border bg-background"
                      }`}>
                        {whatsappUpdates && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-xs text-muted-foreground font-body">
                        Receive instant status confirmation via WhatsApp
                      </span>
                    </div>

                    {/* Form Error Banner if submit attempted with errors */}
                    {formAttempted && !isFormValid && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-mono flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                        <span>Please correct the highlighted errors above before dispatching your inquiry.</span>
                      </motion.div>
                    )}

                    {/* Form Actions */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#ff6900] hover:bg-[#ff7a1a] text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#ff6900]/25 transition-all cursor-pointer disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <span>TRANSMITTING...</span>
                        ) : (
                          <>
                            <span>DISPATCH INQUIRY</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>

                      <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Confidential Enterprise Routing</span>
                      </span>
                    </div>

                  </form>
                )}
              </AnimatePresence>
            </div>

            {/* Instant WhatsApp Alternative Strip */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold font-display text-foreground">
                    Need Immediate System Sizing?
                  </div>
                  <div className="text-[11px] text-muted-foreground font-body">
                    Connect instantly with an engineer on our verified WhatsApp hotline.
                  </div>
                </div>
              </div>

              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 transition-all shrink-0 shadow-sm cursor-pointer"
              >
                <span>Chat Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* RIGHT COLUMN: HARDWARE HEADQUARTERS & TECHNICAL HUB (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-5">
            
            {/* Main Headquarters Card */}
            <div className="p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl bg-card/95 backdrop-blur-xl border border-border shadow-xl space-y-5 sm:space-y-6 relative overflow-hidden">
              
              {/* Top ambient warm glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff6900]/10 rounded-full blur-[80px] pointer-events-none" />

              {/* Lab Status Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#ff6900] font-bold">
                    HARDWARE HEADQUARTERS
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground tracking-tight mt-0.5">
                    IIT Kanpur Campus
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 text-[10px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LAB ACTIVE
                </div>
              </div>

              {/* Coordinates & Location Card */}
              <div className="p-4 rounded-2xl bg-background border border-border/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Compass className="w-3 h-3 text-[#ff6900]" />
                    Facility Coordinates
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("401H DJAC, IIT Kanpur, Uttar Pradesh 208016", "address")}
                    className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title="Copy Address"
                  >
                    {copiedField === "address" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">
                  401H DJAC, IIT Kanpur
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  Startup Incubation and Innovation Centre (SIIC), Uttar Pradesh 208016, India
                </p>
                <div className="text-[10px] font-mono text-muted-foreground/80 pt-1">
                  GPS: 26.5123° N, 80.2329° E
                </div>
              </div>

              {/* Direct Hotlines List */}
              <div className="space-y-3">
                
                {/* Email Hotline */}
                <div className="p-3.5 rounded-2xl bg-background border border-border/80 flex items-center justify-between shadow-xs">
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                      OFFICIAL DESK
                    </div>
                    <a
                      href="mailto:info@ironlung.in"
                      className="text-xs sm:text-sm font-bold font-mono text-foreground hover:text-[#ff6900] transition-colors flex items-center gap-1.5 mt-0.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#ff6900]" />
                      <span>info@ironlung.in</span>
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("info@ironlung.in", "email")}
                    className="p-2 rounded-xl bg-card hover:bg-muted border border-border/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedField === "email" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* WhatsApp & Phone Hotline */}
                <div className="p-3.5 rounded-2xl bg-background border border-border/80 flex items-center justify-between shadow-xs">
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                      PRIORITY DIRECT LINE
                    </div>
                    <a
                      href="tel:+918853667396"
                      className="text-xs sm:text-sm font-bold font-mono text-foreground hover:text-[#ff6900] transition-colors flex items-center gap-1.5 mt-0.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#ff6900]" />
                      <span>+91 8853667396</span>
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("+918853667396", "phone")}
                    className="p-2 rounded-xl bg-card hover:bg-muted border border-border/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title="Copy Phone"
                  >
                    {copiedField === "phone" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

              </div>

              {/* Operating Hours & Best Window */}
              <div className="p-3.5 rounded-2xl bg-background border border-border/80 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
                    OPERATIONAL WINDOW
                  </span>
                  <span className="text-[10px] font-mono text-[#ff6900] font-semibold">
                    Mon – Sat
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-foreground">
                  09:00 AM – 06:00 PM IST
                </div>
                <p className="text-[11px] text-muted-foreground font-body">
                  For hardware testing inspections or lab visits, prior appointment required.
                </p>
              </div>

              {/* Institutional Deployment Guarantee */}
              <div className="p-4 rounded-2xl bg-[#ff6900]/[0.06] border border-[#ff6900]/25 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ff6900] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Deployment SLA Guarantee</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed font-body">
                  Every institutional installation includes complete sensor calibration, staff orientation, and continuous cloud telemetry support.
                </p>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Cinematic Footer */}
      <Footer />
    </div>
  );
};

export default ContactPage;
