import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react';
import { HeroNavbar } from '../components/layout/HeroNavbar';
import Footer from '../components/layout/Footer';

interface BookDemoPageProps {
  onContactUs: () => void;
  onNavigateSection: (
    section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about' | 'how-it-works' | 'book-demo' | 'contact' | 'technology'
  ) => void;
}

interface CountryOption {
  code: string;
  name: string;
  iso: string;
  placeholder: string;
}

const COUNTRIES: CountryOption[] = [
  { code: '+91', name: 'India', iso: 'IN', placeholder: '98765 43210' },
  { code: '+1', name: 'United States', iso: 'US', placeholder: '(555) 000-0000' },
  { code: '+44', name: 'United Kingdom', iso: 'GB', placeholder: '7911 123456' },
  { code: '+33', name: 'France', iso: 'FR', placeholder: '6 00 00 00 00' },
  { code: '+49', name: 'Germany', iso: 'DE', placeholder: '151 12345678' },
  { code: '+971', name: 'United Arab Emirates', iso: 'AE', placeholder: '50 123 4567' },
  { code: '+65', name: 'Singapore', iso: 'SG', placeholder: '8123 4567' },
  { code: '+61', name: 'Australia', iso: 'AU', placeholder: '412 345 678' },
  { code: '+1', name: 'Canada', iso: 'CA', placeholder: '(555) 000-0000' },
];

const CountryFlag: React.FC<{ iso: string }> = ({ iso }) => {
  if (iso === 'IN') {
    return (
      <svg className="w-4.5 h-3 rounded-[2px] shadow-2xs shrink-0 overflow-hidden" viewBox="0 0 450 300">
        <rect width="450" height="100" fill="#FF9933" />
        <rect y="100" width="450" height="100" fill="#FFFFFF" />
        <rect y="200" width="450" height="100" fill="#128807" />
        <circle cx="225" cy="150" r="30" fill="none" stroke="#000088" strokeWidth="6" />
      </svg>
    );
  }
  if (iso === 'US') {
    return (
      <svg className="w-4.5 h-3 rounded-[2px] shadow-2xs shrink-0 overflow-hidden" viewBox="0 0 450 300">
        <rect width="450" height="300" fill="#B22234" />
        <path d="M0,46h450M0,92h450M0,138h450M0,184h450M0,230h450M0,276h450" stroke="#FFF" strokeWidth="23" />
        <rect width="180" height="161" fill="#3C3B6E" />
      </svg>
    );
  }
  if (iso === 'FR') {
    return (
      <svg className="w-4.5 h-3 rounded-[2px] shadow-2xs shrink-0 overflow-hidden" viewBox="0 0 300 200">
        <rect width="100" height="200" fill="#002395" />
        <rect x="100" width="100" height="200" fill="#FFFFFF" />
        <rect x="200" width="100" height="200" fill="#ED2939" />
      </svg>
    );
  }
  if (iso === 'GB') {
    return (
      <svg className="w-4.5 h-3 rounded-[2px] shadow-2xs shrink-0 overflow-hidden" viewBox="0 0 60 30">
        <clipPath id="gb-flag-clip"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" clipPath="url(#gb-flag-clip)"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#cc0000" strokeWidth="4" clipPath="url(#gb-flag-clip)"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#cc0000" strokeWidth="6"/>
      </svg>
    );
  }
  if (iso === 'DE') {
    return (
      <svg className="w-4.5 h-3 rounded-[2px] shadow-2xs shrink-0 overflow-hidden" viewBox="0 0 5 3">
        <rect width="5" height="1" fill="#000" />
        <rect y="1" width="5" height="1" fill="#D00" />
        <rect y="2" width="5" height="1" fill="#FFCE00" />
      </svg>
    );
  }
  if (iso === 'AE') {
    return (
      <svg className="w-4.5 h-3 rounded-[2px] shadow-2xs shrink-0 overflow-hidden" viewBox="0 0 6 3">
        <rect width="6" height="1" fill="#00732F" />
        <rect y="1" width="6" height="1" fill="#FFF" />
        <rect y="2" width="6" height="1" fill="#000" />
        <rect width="1.5" height="3" fill="#F00" />
      </svg>
    );
  }
  return <span className="text-[10px] font-bold text-slate-700">{iso}</span>;
};

export const BookDemoPage: React.FC<BookDemoPageProps> = ({
  onContactUs,
  onNavigateSection,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavbarNavigate = (
    section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about' | 'how-it-works' | 'book-demo' | 'contact' | 'technology'
  ) => {
    if (section === 'book-demo') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigateSection(section);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch('https://formsubmit.co/ajax/info@ironlung.in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `[IRON LUNG DEMO] New Request: ${fullName.trim()} (${jobTitle.trim() || 'Direct Inquiry'})`,
          _replyto: email.trim(),
          _template: 'table',
          'FULL NAME': fullName.trim(),
          'WORK EMAIL': email.trim(),
          'JOB TITLE / ORGANIZATION': jobTitle.trim() || 'Not specified',
          'PHONE NUMBER': `${selectedCountry.code} ${phone.trim()}`,
          'COUNTRY': `${selectedCountry.name} (${selectedCountry.iso})`,
          'REQUEST TIME (LOCAL)': new Date().toLocaleString(),
        }),
      });
    } catch (err) {
      console.log('Demo request logged locally:', { fullName, email, jobTitle, phone: `${selectedCountry.code} ${phone}` });
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-[#00A3C4]/20 font-sans">
      {/* Brand Navigation Bar */}
      <HeroNavbar
        onBookDemo={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onContactUs={onContactUs}
        onNavigateSection={handleNavbarNavigate}
        activeSection="book-demo"
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12 pt-28 sm:pt-32 lg:pt-36 pb-16 lg:pb-24 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: MINIMALIST HEADLINE, SUBTITLE & DEMO FORM     */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center max-w-[490px] mx-auto lg:mx-0 w-full"
          >
            {/* Main Headline with Cyan Strike-through and Accent Word */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-black tracking-[-0.03em] text-[#0A1118] leading-[1.24] sm:leading-[1.14]">
              Book your live demo
              <br />
              <span className="inline-block mt-0.5 sm:mt-0">
                in{' '}
                <span className="relative inline-block mr-2.5 text-[#0A1118]">
                  minutes
                  {/* Hand-drawn organic strike stroke */}
                  <svg
                    className="absolute -left-1.5 top-[52%] -translate-y-1/2 w-[calc(100%+12px)] h-4 sm:h-5 pointer-events-none"
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M 2 13 Q 50 3 98 10"
                      stroke="#00A3C4"
                      strokeWidth="3.75"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>
                <span className="text-[#00A3C4]">seconds</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[#5A6578] text-[15px] sm:text-base leading-[1.55] mt-4 mb-7 sm:mb-8 font-normal">
              You will love our personalised demo! Get in touch with our friendly team and we’ll get back to you in 2 hours.
            </p>

            {/* Form State Container */}
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                /* Sleek Success Confirmation */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6 sm:p-8 text-left shadow-xs"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
                    Demo Scheduled!
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
                    Thank you, <span className="font-semibold text-slate-900">{fullName}</span>. We've received your request. A product specialist will contact you at <span className="font-semibold text-slate-900">{email}</span> within 2 hours with your calendar invitation.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFullName('');
                      setEmail('');
                      setJobTitle('');
                      setPhone('');
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#00A3C4] hover:text-[#0089a5] transition-colors cursor-pointer"
                  >
                    <span>Schedule another demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                /* The 4 Minimalist Form Fields + Dark Action Button */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-3.5 sm:space-y-4 w-full"
                  noValidate
                >
                  {/* Field 1: Full name */}
                  <div>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoComplete="name"
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0A1118] focus:ring-1 focus:ring-[#0A1118] transition-all text-[15px] shadow-2xs"
                    />
                  </div>

                  {/* Field 2: Work email address */}
                  <div>
                    <input
                      type="email"
                      placeholder="Work email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0A1118] focus:ring-1 focus:ring-[#0A1118] transition-all text-[15px] shadow-2xs"
                    />
                  </div>

                  {/* Field 3: Job title */}
                  <div>
                    <input
                      type="text"
                      placeholder="Job title"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      autoComplete="organization-title"
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0A1118] focus:ring-1 focus:ring-[#0A1118] transition-all text-[15px] shadow-2xs"
                    />
                  </div>

                  {/* Field 4: Split Phone Input with Country Code Selector */}
                  <div className="relative" ref={dropdownRef}>
                    <div className="flex rounded-xl border border-slate-200 bg-white focus-within:border-[#0A1118] focus-within:ring-1 focus-within:ring-[#0A1118] transition-all shadow-2xs">
                      {/* Country Flag & Code Trigger */}
                      <button
                        type="button"
                        onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
                        className="px-3.5 py-3.5 flex items-center gap-2 border-r border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 rounded-l-xl text-[14px] font-medium text-slate-700 transition-colors shrink-0 cursor-pointer select-none"
                      >
                        <span className="text-xs font-bold text-slate-800">{selectedCountry.iso}</span>
                        <CountryFlag iso={selectedCountry.iso} />
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 -ml-0.5" />
                      </button>

                      {/* Phone Number Input */}
                      <input
                        type="tel"
                        placeholder={`${selectedCountry.code} ${selectedCountry.placeholder}`}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                        className="flex-1 min-w-0 px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                      />
                    </div>

                    {/* Country Dropdown Menu */}
                    <AnimatePresence>
                      {isCountryDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-[calc(100%+6px)] z-50 w-64 max-h-60 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-xl py-1.5"
                        >
                          {COUNTRIES.map((c) => (
                            <button
                              key={c.iso + c.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(c);
                                setIsCountryDropdownOpen(false);
                              }}
                              className={`w-full px-3.5 py-2 flex items-center justify-between text-left text-sm hover:bg-slate-50 transition-colors cursor-pointer ${
                                selectedCountry.iso === c.iso ? 'bg-slate-50/90 font-semibold' : 'text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <CountryFlag iso={c.iso} />
                                <span className="truncate">{c.name}</span>
                              </div>
                              <span className="text-xs text-slate-400 ml-2 font-mono shrink-0">{c.code}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Error Banner */}
                  {errorMsg && (
                    <p className="text-xs text-rose-500 font-medium px-1">
                      {errorMsg}
                    </p>
                  )}

                  {/* Primary Dark Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-4 px-6 rounded-xl bg-[#092229] hover:bg-[#0c2f39] text-white font-semibold text-[15px] tracking-wide transition-all duration-150 shadow-sm hover:shadow active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Scheduling...</span>
                      </span>
                    ) : (
                      <span>Schedule a demo</span>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: HIGH-END EDITORIAL VISUAL CARD WITH QUOTE   */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-6 xl:col-span-7 w-full"
          >
            <div className="relative w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100/60 min-h-[580px] sm:min-h-[640px] lg:min-h-[660px] xl:min-h-[720px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 text-white bg-slate-900 group">
              
              {/* Background Photographic Image (WebP + JPG fallback) */}
              <picture className="absolute inset-0 w-full h-full pointer-events-none select-none">
                <source srcSet="/images/demo/demo-hero.webp" type="image/webp" />
                <img
                  src="/images/demo/demo-hero.jpg"
                  alt="Athlete in serene breathwork recovery overlooking alpine peaks"
                  className="w-full h-full object-cover object-[center_35%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </picture>

              {/* Atmospheric Depth Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 via-50% to-black/10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent pointer-events-none" />

              {/* Top-Left Minimalist Logo Pill (Matches Reference) */}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#A5E8F0] shadow-md flex items-center justify-center font-black text-[#0A1118] text-xl font-display select-none">
                  IL
                </div>
              </div>

              {/* Bottom Testimonial & Attribution Section */}
              <div className="relative z-10 mt-auto pt-16">
                {/* The Quote */}
                <p className="text-white text-lg sm:text-xl lg:text-[21px] xl:text-[23px] font-medium leading-[1.38] tracking-[-0.01em] max-w-xl text-balance drop-shadow-xs">
                  By integrating Iron Lung’s adaptive altitude protocols and biofeedback, our athletes achieved a 24% boost in aerobic threshold within three weeks. It’s an essential tool for athletic performance and cellular recovery.
                </p>

                {/* Attribution & Accreditation Partner Row */}
                <div className="mt-8 sm:mt-10 pt-4 flex items-end justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm sm:text-base tracking-tight">
                      Dr. Joy Boublil
                    </span>
                    <span className="text-white/75 text-xs sm:text-sm font-normal mt-0.5">
                      Head of Human Performance & Recovery
                    </span>
                  </div>

                  {/* Partner Logo Mark on Bottom Right (AWS in reference) */}
                  <div className="opacity-90 select-none pb-0.5">
                    <span className="font-mono text-xl sm:text-2xl font-bold tracking-tighter text-white">
                      aws
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </main>

      {/* Cinematic Brand Footer */}
      <Footer />
    </div>
  );
};

export default BookDemoPage;
