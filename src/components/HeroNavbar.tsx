import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeroNavbarProps {
  onBookDemo: () => void;
  onContactUs: () => void;
  onNavigateSection?: (section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about') => void;
}

export const HeroNavbar: React.FC<HeroNavbarProps> = ({
  onBookDemo,
  onContactUs,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)] px-4 sm:px-6 lg:px-12 py-2.5 sm:py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-nowrap">
        {/* Brand Logo */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onNavigateSection?.('hero');
          }}
          className="flex flex-col group cursor-pointer text-left shrink-0"
        >
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF5E1E] to-[#FF3D00] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v9" />
                <path d="M9 7l-3 3" />
                <path d="M15 7l3 3" />
                <path d="M7 10c-2.5 0-4 2-4 5.5s2 4.5 4 3.5c1.2-.5 1.7-1.5 1.7-3.2V10z" />
                <path d="M17 10c2.5 0 4 2 4 5.5s-2 4.5-4 3.5c-1.2-.5-1.7-1.5-1.7-3.2V10z" />
              </svg>
            </div>
            <span className="text-lg sm:text-2xl font-black tracking-wider text-slate-900">
              IRON <span className="text-[#FF5E1E]">LUNG</span>
            </span>
          </div>
          <span className="text-[7.5px] sm:text-[9px] tracking-[0.18em] sm:tracking-[0.24em] font-bold text-slate-500 uppercase ml-9 sm:ml-10 mt-0.5 whitespace-nowrap">
            BREATHE BETTER. LIVE BETTER.
          </span>
        </button>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-6 xl:gap-9 text-xs lg:text-sm font-semibold text-slate-800 whitespace-nowrap shrink">
          <button
            onClick={() => onNavigateSection?.('screen')}
            className="hover:text-[#FF5E1E] transition-colors duration-200 tracking-wide cursor-pointer"
          >
            Technology
          </button>
          <button
            onClick={() => onNavigateSection?.('uv')}
            className="hover:text-[#FF5E1E] transition-colors duration-200 tracking-wide cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigateSection?.('comfort')}
            className="hover:text-[#FF5E1E] transition-colors duration-200 tracking-wide cursor-pointer"
          >
            Ergonomics
          </button>
          <button
            onClick={() => onNavigateSection?.('dashboard')}
            className="hover:text-[#FF5E1E] transition-colors duration-200 tracking-wide cursor-pointer"
          >
            Experience
          </button>
          <button
            onClick={() => onNavigateSection?.('about')}
            className="hover:text-[#FF5E1E] transition-colors duration-200 tracking-wide cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Right Desktop CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-nowrap">
          <button
            onClick={onBookDemo}
            className="hidden sm:inline-flex px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-slate-800 border border-slate-300 bg-white/95 hover:bg-white hover:border-slate-400 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            Book a Demo
          </button>
          <button
            onClick={onContactUs}
            className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#FF5E1E] hover:bg-[#FF7033] shadow-[0_4px_16px_rgba(255,94,30,0.35)] hover:shadow-[0_6px_20px_rgba(255,94,30,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
          >
            Contact Us
          </button>

          {/* Hamburger Menu Button (Mobile Only) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-transparent hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-all active:scale-95"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          />

          {/* Drawer Menu */}
          <div className="relative z-50 md:hidden mt-2.5 p-4 sm:p-6 rounded-2xl bg-[#06121C]/95 border border-white/15 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,210,255,0.15)] flex flex-col gap-2.5 max-h-[82vh] overflow-y-auto animate-in slide-in-from-top-3 duration-250">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection?.('hero');
              }}
              className="text-left text-white/80 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/5 text-sm font-medium transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection?.('screen');
              }}
              className="text-left text-white/80 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/5 text-sm font-medium transition-colors"
            >
              Technology
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection?.('uv');
              }}
              className="text-left text-white/80 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/5 text-sm font-medium transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection?.('comfort');
              }}
              className="text-left text-white/80 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/5 text-sm font-medium transition-colors"
            >
              Ergonomics
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection?.('dashboard');
              }}
              className="text-left text-white/80 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/5 text-sm font-medium transition-colors"
            >
              Experience
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection?.('about');
              }}
              className="text-left text-white/80 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/5 text-sm font-medium transition-colors"
            >
              About
            </button>

            <div className="flex flex-col gap-2.5 pt-3 mt-1 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookDemo();
                }}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white/90 border border-white/20 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all"
              >
                Book Demo
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onContactUs();
                }}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-[#FF5E1E] hover:bg-[#FF7033] shadow-[0_0_20px_rgba(255,94,30,0.4)] active:scale-[0.98] transition-all"
              >
                Contact Us
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
