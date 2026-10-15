import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Calendar, ChevronDown, CheckCircle2 } from 'lucide-react';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIME_OPTIONS = [
  'Morning (9 AM – 12 PM)',
  'Afternoon (12 PM – 4 PM)',
  'Evening (4 PM – 8 PM)',
];

export const BookDemoModal: React.FC<BookDemoModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [preferredTime, setPreferredTime] = useState(TIME_OPTIONS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      // Reset state on close
      setTimeout(() => {
        setIsSubmitted(false);
        setErrorMessage('');
      }, 300);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter your phone number.');
      return;
    }
    if (!emailAddress.trim() || !emailAddress.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
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
          _subject: `[IRON LUNG DEMO] New Demo Request from ${fullName.trim()}`,
          _replyto: emailAddress.trim(),
          _template: 'table',
          'FULL NAME': fullName.trim(),
          'PHONE NUMBER': phoneNumber.trim(),
          'EMAIL ADDRESS': emailAddress.trim(),
          'PREFERRED TIME': preferredTime,
          'SUBMITTED AT': new Date().toLocaleString(),
        }),
      });
    } catch (err) {
      console.log('Demo request captured:', { fullName, phoneNumber, emailAddress, preferredTime });
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Blurred Atmospheric Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Centered Modal Card matching exact uploaded image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[460px] bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.18)] border border-slate-100 z-10 my-auto selection:bg-[#FF5500]/20"
          >
            {/* Circular Close Button at top right */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5 stroke-[2.2]" />
            </button>

            {/* Brand Logo */}
            <div className="flex items-center">
              <img
                src="/images/ironlung-logo.png"
                alt="IRONLUNG"
                className="h-6 sm:h-7 w-auto object-contain select-none pointer-events-none"
              />
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-[27px] font-bold text-[#0F172A] tracking-[-0.025em] mt-5 sm:mt-6 mb-2 select-none">
              Book a Free Demo
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-[13.5px] text-[#64748B] font-normal leading-[1.5] mb-5 sm:mb-6 select-none">
              Leave your details below and our team will contact you shortly to schedule a personalized session.
            </p>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                /* Success Confirmation State */
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-6 text-center flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3.5 shadow-sm">
                    <CheckCircle2 className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
                    Demo Request Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xs leading-relaxed mb-6">
                    Thank you, <span className="font-semibold text-slate-800">{fullName}</span>. Our team will contact you shortly to confirm your session.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3.5 px-6 rounded-xl sm:rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-sm transition-all cursor-pointer shadow-sm"
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                /* The Form matching reference image */
                <motion.form
                  key="form-state"
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-3.5 sm:space-y-4"
                >
                  {/* Field 1: FULL NAME */}
                  <div>
                    <label
                      htmlFor="demo-fullname"
                      className="block text-[11px] font-medium text-[#64748B] tracking-wider uppercase mb-1.5 select-none"
                    >
                      FULL NAME
                    </label>
                    <div className="flex items-center rounded-xl sm:rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-3 focus-within:border-[#FF5500] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF5500]/15 transition-all">
                      <User className="w-4.5 h-4.5 text-[#94A3B8] shrink-0 mr-3" />
                      <input
                        id="demo-fullname"
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        autoComplete="name"
                        className="w-full bg-transparent text-sm text-[#0F172A] placeholder-[#94A3B8] placeholder:font-normal focus:outline-none font-normal"
                      />
                    </div>
                  </div>

                  {/* Field 2: PHONE NUMBER */}
                  <div>
                    <label
                      htmlFor="demo-phone"
                      className="block text-[11px] font-medium text-[#64748B] tracking-wider uppercase mb-1.5 select-none"
                    >
                      PHONE NUMBER
                    </label>
                    <div className="flex items-center rounded-xl sm:rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-3 focus-within:border-[#FF5500] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF5500]/15 transition-all">
                      <Phone className="w-4.5 h-4.5 text-[#94A3B8] shrink-0 mr-3" />
                      <input
                        id="demo-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        autoComplete="tel"
                        className="w-full bg-transparent text-sm text-[#0F172A] placeholder-[#94A3B8] placeholder:font-normal focus:outline-none font-normal"
                      />
                    </div>
                  </div>

                  {/* Field 3: EMAIL ADDRESS */}
                  <div>
                    <label
                      htmlFor="demo-email"
                      className="block text-[11px] font-medium text-[#64748B] tracking-wider uppercase mb-1.5 select-none"
                    >
                      EMAIL ADDRESS
                    </label>
                    <div className="flex items-center rounded-xl sm:rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-3 focus-within:border-[#FF5500] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF5500]/15 transition-all">
                      <Mail className="w-4.5 h-4.5 text-[#94A3B8] shrink-0 mr-3" />
                      <input
                        id="demo-email"
                        type="email"
                        placeholder="Email Address"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        autoComplete="email"
                        className="w-full bg-transparent text-sm text-[#0F172A] placeholder-[#94A3B8] placeholder:font-normal focus:outline-none font-normal"
                      />
                    </div>
                  </div>

                  {/* Field 4: PREFERRED TIME */}
                  <div className="relative" ref={dropdownRef}>
                    <label
                      id="preferred-time-label"
                      className="block text-[11px] font-medium text-[#64748B] tracking-wider uppercase mb-1.5 select-none"
                    >
                      PREFERRED TIME
                    </label>
                    <button
                      type="button"
                      aria-labelledby="preferred-time-label"
                      aria-expanded={isDropdownOpen}
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      className="w-full flex items-center justify-between rounded-xl sm:rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-3 hover:bg-slate-100/70 focus:border-[#FF5500] focus:bg-white focus:ring-2 focus:ring-[#FF5500]/15 transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center min-w-0 pr-2">
                        <Calendar className="w-4.5 h-4.5 text-[#94A3B8] shrink-0 mr-3" />
                        <span className="text-sm text-[#0F172A] font-normal truncate">
                          {preferredTime}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4.5 h-4.5 text-[#64748B] shrink-0 transition-transform duration-200 ${
                          isDropdownOpen ? 'rotate-180 text-[#FF5500]' : ''
                        }`}
                      />
                    </button>

                    {/* Time Options Dropdown */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 bg-white rounded-xl border border-slate-200 shadow-xl py-1 overflow-hidden"
                        >
                          {TIME_OPTIONS.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => {
                                setPreferredTime(time);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${
                                preferredTime === time
                                  ? 'bg-[#FF5500]/10 text-[#FF5500] font-semibold'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{time}</span>
                              {preferredTime === time && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Validation Error Message */}
                  {errorMessage && (
                    <p className="text-xs text-rose-500 font-medium px-1">
                      {errorMessage}
                    </p>
                  )}

                  {/* Submit Button: Exact "Request Demo" Vibrant Orange Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 sm:mt-7 py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-2xl bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-base sm:text-[17px] tracking-normal shadow-lg shadow-[#FF5500]/25 hover:shadow-xl hover:shadow-[#FF5500]/35 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Submitting...</span>
                      </span>
                    ) : (
                      <span>Request Demo</span>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookDemoModal;
