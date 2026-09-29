import React from 'react';

interface BreathingCtaSectionProps {
  onBookDemo?: () => void;
}

export const BreathingCtaSection: React.FC<BreathingCtaSectionProps> = ({
  onBookDemo,
}) => {
  return (
    <section className="relative w-full bg-[#FDFDFD] text-black overflow-hidden py-8 sm:py-10 md:py-12 border-t border-black/[0.04]">
      {/* Right-Side Architectural Orange Line & Node */}
      <div
        className="absolute top-0 bottom-0 right-2 sm:right-6 md:right-10 lg:right-14 w-[38px] sm:w-[56px] md:w-[68px] pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 84 800"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <path
            d="M 12 0 L 12 448 Q 74 472 74 536 L 74 800"
            fill="none"
            stroke="#F53D00"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* Crisp Circular Orange Node at the Curve Vertex (x = 12/84 = 14.285%, y = 448/800 = 56%) */}
        <span
          className="absolute w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#F53D00] -translate-x-1/2 -translate-y-1/2"
          style={{ left: '14.285%', top: '56%' }}
        />
      </div>

      {/* Main Compact Editorial Content Container */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-12 md:px-16 lg:px-20 pr-12 sm:pr-20 md:pr-24">
        {/* Top Kicker */}
        <p className="text-[9.5px] sm:text-[11px] font-normal tracking-[0.26em] text-[#1E1E1E] uppercase leading-[1.55]">
          TAKE CONTROL OF
          <br />
          YOUR BREATHING
        </p>

        {/* Short Horizontal Orange Accent Rule */}
        <div className="w-11 sm:w-14 h-[2px] bg-[#F53D00] mt-2.5 sm:mt-3 mb-3.5 sm:mb-4" />

        {/* Primary Display Headline */}
        <h2 className="text-[28px] xs:text-[32px] sm:text-[42px] md:text-[50px] lg:text-[56px] font-extrabold tracking-[-0.035em] leading-[1.06] text-black">
          Know Your
          <br />
          Lungs, <span className="text-[#F53D00]">Train Better.</span>
        </h2>

        {/* Subtitle / Value Statement */}
        <p className="text-[13.5px] sm:text-[16px] md:text-[18px] text-[#1E1E1E] font-light leading-[1.42] tracking-[-0.01em] mt-3 sm:mt-4 mb-5 sm:mb-6 max-w-[460px]">
          Get deeper insights, track your progress
          <br className="hidden xs:inline" />{' '}
          and unlock a healthier, stronger you.
        </p>

        {/* Primary Pill CTA Button */}
        <div>
          <button
            type="button"
            onClick={onBookDemo}
            className="group inline-flex items-center justify-between bg-[#F53D00] hover:bg-[#E03500] active:scale-[0.99] text-white rounded-full px-6 sm:px-8 py-2.5 sm:py-3.5 min-w-[190px] sm:min-w-[240px] md:min-w-[265px] transition-all duration-200 shadow-[0_8px_22px_rgba(245,61,0,0.20)] cursor-pointer"
          >
            <span className="text-[15px] sm:text-[17px] md:text-[19px] font-medium tracking-[-0.01em] pl-1 sm:pl-2">
              Book a Demo
            </span>
            <svg
              viewBox="0 0 28 24"
              fill="none"
              className="w-5 h-4 sm:w-6 sm:h-5 text-white transition-transform duration-200 group-hover:translate-x-1"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="2" y1="12" x2="24" y2="12" />
              <polyline points="17 5 24 12 17 19" />
            </svg>
          </button>
        </div>

        {/* Bottom 3-Item Feature Strip */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 md:gap-x-8">
          {/* Item 1 */}
          <div className="inline-flex items-center gap-2.5 sm:gap-3">
            <span className="w-5 sm:w-6 h-[1.5px] bg-[#F53D00] shrink-0" />
            <span className="text-[9px] sm:text-[10.5px] tracking-[0.20em] text-[#1A1A1A] font-normal uppercase whitespace-nowrap">
              TRACK PROGRESS
            </span>
          </div>

          <span className="hidden sm:inline-block h-4 w-[1px] bg-black/30" aria-hidden="true" />

          {/* Item 2 */}
          <div className="inline-flex items-center gap-2.5 sm:gap-3">
            <span className="w-5 sm:w-6 h-[1.5px] bg-[#F53D00] shrink-0" />
            <span className="text-[9px] sm:text-[10.5px] tracking-[0.20em] text-[#1A1A1A] font-normal uppercase whitespace-nowrap">
              BUILD STRENGTH
            </span>
          </div>

          <span className="hidden sm:inline-block h-4 w-[1px] bg-black/30" aria-hidden="true" />

          {/* Item 3 */}
          <div className="inline-flex items-center gap-2.5 sm:gap-3">
            <span className="w-5 sm:w-6 h-[1.5px] bg-[#F53D00] shrink-0" />
            <span className="text-[9px] sm:text-[10.5px] tracking-[0.20em] text-[#1A1A1A] font-normal uppercase whitespace-nowrap">
              BREATHE BETTER
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BreathingCtaSection;
