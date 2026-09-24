import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeroNavbarProps {
  onBookDemo: () => void;
  onContactUs: () => void;
  onNavigateSection?: (section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about' | 'how-it-works' | 'book-demo' | 'contact' | 'technology') => void;
  activeSection?: string;
}

export const HeroNavbar: React.FC<HeroNavbarProps> = ({
  onBookDemo,
  onContactUs,
  onNavigateSection,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)] px-3 sm:px-6 lg:px-12 py-2 sm:py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-nowrap gap-2">
        {/* Brand Logo */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onNavigateSection?.('hero');
          }}
          className="flex flex-col group cursor-pointer text-left shrink-0"
        >
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#FF5E1E] to-[#FF3D00] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v9" />
                <path d="M9 7l-3 3" />
                <path d="M15 7l3 3" />
                <path d="M7 10c-2.5 0-4 2-4 5.5s2 4.5 4 3.5c1.2-.5 1.7-1.5 1.7-3.2V10z" />
                <path d="M17 10c2.5 0 4 2 4 5.5s-2 4.5-4 3.5c-1.2-.5-1.7-1.5-1.7-3.2V10z" />
              </svg>
            </div>
            <span className="text-base sm:text-xl lg:text-2xl font-black tracking-wider text-slate-900">
              IRON <span className="text-[#FF5E1E]">LUNG</span>
            </span>
          </div>
          <span className="text-[7px] sm:text-[9px] tracking-[0.16em] sm:tracking-[0.24em] font-bold text-slate-500 uppercase ml-8 sm:ml-10 mt-0.5 whitespace-nowrap">
            BREATHE BETTER. LIVE BETTER.
          </span>
        </button>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8 xl:gap-10 text-xs lg:text-sm font-semibold text-slate-800 whitespace-nowrap shrink">
          <button
            onClick={() => onNavigateSection?.('technology')}
            className={`hover:text-[#FF5E1E] transition-colors duration-200 tracking-wide cursor-pointer ${
              activeSection === 'technology' || activeSection === 'screen' ? 'text-[#FF5E1E] font-bold' : ''
            }`}
          >
            Technology
          </button>
          <button
            onClick={() => onNavigateSection?.('how-it-works')}
            className={`hover:text-[#FF5E1E] transition-colors duration-200 tracking-wide cursor-pointer ${
              activeSection === 'how-it-works' ? 'text-[#FF5E1E] font-bold' : ''
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigateSection?.('about')}
            className={`hover:text-[#FF5E1E] transition-colors duration-200 tracking-wide cursor-pointer ${
              activeSection === 'about' ? 'text-[#FF5E1E] font-bold' : ''
            }`}
          >
            About
          </button>
        </nav>

        {/* Right Desktop CTA Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 flex-nowrap">
          <button
            onClick={onBookDemo}
            className={`hidden sm:inline-flex px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap cursor-pointer ${
              activeSection === 'book-demo'
                ? 'text-[#FF5E1E] border-2 border-[#FF5E1E] bg-[#FF5E1E]/10 font-bold shadow-sm'
                : 'text-slate-800 border border-slate-300 bg-white/95 hover:bg-white hover:border-slate-400 shadow-sm'
            }`}
          >
            Book a Demo
          </button>
          <button
            onClick={onContactUs}
            className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-white transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeSection === 'contact'
                ? 'bg-[#E04B10] shadow-[0_0_20px_rgba(255,94,30,0.6)] ring-2 ring-orange-300 font-bold scale-[1.02]'
                : 'bg-[#FF5E1E] hover:bg-[#FF7033] shadow-[0_4px_16px_rgba(255,94,30,0.35)] hover:shadow-[0_6px_20px_rgba(255,94,30,0.5)] hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            Contact Us
          </button>

          {/* Hamburger Menu Button (Mobile Only) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-transparent hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
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
          <div className="relative z-50 md:hidden mt-2 p-4 sm:p-5 rounded-2xl bg-[#06121C]/95 border border-white/15 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,210,255,0.15)] flex flex-col gap-2 max-h-[calc(100vh-5rem)] overflow-y-auto animate-in slide-in-from-top-3 duration-250">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection?.('hero');
              }}
              className="text-left text-white/80 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/5 text-sm font-medium transition-colors cursor-pointer"
            >
              Overview
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection?.('technology');
              }}
              className={`text-left py-2.5 px-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeSection === 'technology' || activeSection === 'screen' ? 'text-[#FF5E1E] font-semibold bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              Technology
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection?.('how-it-works');
              }}
              className={`text-left py-2.5 px-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeSection === 'how-it-works' ? 'text-[#FF5E1E] font-semibold bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection?.('about');
              }}
              className={`text-left py-2.5 px-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeSection === 'about' ? 'text-[#FF5E1E] font-semibold bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              About
            </button>

            <div className="flex flex-col gap-2.5 pt-3 mt-1 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookDemo();
                }}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeSection === 'book-demo'
                    ? 'text-[#FF5E1E] border border-[#FF5E1E] bg-[#FF5E1E]/15 font-bold shadow-sm'
                    : 'text-white/90 border border-white/20 bg-white/5 hover:bg-white/10 active:scale-[0.98]'
                }`}
              >
                Book Demo
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onContactUs();
                }}
                className={`w-full py-3 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer ${
                  activeSection === 'contact'
                    ? 'bg-[#E04B10] shadow-[0_0_25px_rgba(255,94,30,0.7)] ring-2 ring-orange-400 font-bold'
                    : 'bg-[#FF5E1E] hover:bg-[#FF7033] shadow-[0_0_20px_rgba(255,94,30,0.4)] active:scale-[0.98]'
                }`}
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
