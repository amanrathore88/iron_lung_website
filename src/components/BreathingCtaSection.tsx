import React from 'react';

interface BreathingCtaSectionProps {
  onBookDemo?: () => void;
}

export const BreathingCtaSection: React.FC<BreathingCtaSectionProps> = ({
  onBookDemo,
}) => {
  return (
    <section className="relative w-full bg-[#FDFDFD] text-black overflow-hidden py-16 sm:py-24 md:py-28 lg:py-32">
      {/* Right-Side Architectural Orange Line & Node (Matches Reference) */}
      <div
        className="absolute top-0 bottom-0 right-2 sm:right-6 md:right-10 lg:right-14 w-[44px] sm:w-[68px] md:w-[84px] pointer-events-none select-none"
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
            strokeWidth="1.75"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* Crisp Circular Orange Node at the Curve Vertex (x = 12/84 = 14.285%, y = 448/800 = 56%) */}
        <span
          className="absolute w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#F53D00] -translate-x-1/2 -translate-y-1/2"
          style={{ left: '14.285%', top: '56%' }}
        />
      </div>

      {/* Main Editorial Content Container */}
      <div className="relative z-10 max-w-[1380px] mx-auto px-6 sm:px-12 md:px-16 lg:px-20 pr-12 sm:pr-20 md:pr-28">
        {/* Top Kicker */}
        <p className="text-[11px] sm:text-[13px] md:text-[13.5px] font-normal tracking-[0.28em] text-[#1E1E1E] uppercase leading-[1.65]">
          TAKE CONTROL OF
          <br />
          YOUR BREATHING
        </p>

        {/* Short Horizontal Orange Accent Rule */}
        <div className="w-14 sm:w-20 h-[2px] bg-[#F53D00] mt-4 sm:mt-5 mb-6 sm:mb-9" />

        {/* Primary Display Headline */}
        <h2 className="text-[38px] xs:text-[44px] sm:text-[64px] md:text-[78px] lg:text-[88px] font-extrabold tracking-[-0.035em] leading-[1.05] text-black">
          Know Your
          <br />
          Lungs, <span className="text-[#F53D00]">Train Better.</span>
        </h2>

        {/* Subtitle / Value Statement */}
        <p className="text-[16px] sm:text-[21px] md:text-[25px] text-[#1E1E1E] font-light leading-[1.42] tracking-[-0.01em] mt-5 sm:mt-7 mb-8 sm:mb-12 max-w-[640px]">
          Get deeper insights, track your progress
          <br className="hidden xs:inline" />{' '}
          and unlock a healthier, stronger you.
        </p>

        {/* Primary Pill CTA Button */}
        <div>
          <button
            type="button"
            onClick={onBookDemo}
            className="group inline-flex items-center justify-between bg-[#F53D00] hover:bg-[#E03500] active:scale-[0.99] text-white rounded-full px-8 sm:px-12 py-4 sm:py-5 min-w-[240px] sm:min-w-[340px] md:min-w-[380px] transition-all duration-200 shadow-[0_10px_28px_rgba(245,61,0,0.22)] cursor-pointer"
          >
            <span className="text-[18px] sm:text-[23px] md:text-[26px] font-medium tracking-[-0.01em] pl-1 sm:pl-4">
              Book a Demo
            </span>
            <svg
              viewBox="0 0 28 24"
              fill="none"
              className="w-6 h-5 sm:w-7 sm:h-6 text-white transition-transform duration-200 group-hover:translate-x-1"
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
        <div className="mt-12 sm:mt-16 md:mt-20 flex flex-wrap items-center gap-y-3 gap-x-5 sm:gap-x-8 md:gap-x-11">
          {/* Item 1 */}
          <div className="inline-flex items-center gap-3 sm:gap-4">
            <span className="w-6 sm:w-8 h-[1.5px] bg-[#F53D00] shrink-0" />
            <span className="text-[10px] sm:text-[12px] tracking-[0.22em] text-[#1A1A1A] font-normal uppercase whitespace-nowrap">
              TRACK PROGRESS
            </span>
          </div>

          <span className="hidden sm:inline-block h-5 w-[1px] bg-black/35" aria-hidden="true" />

          {/* Item 2 */}
          <div className="inline-flex items-center gap-3 sm:gap-4">
            <span className="w-6 sm:w-8 h-[1.5px] bg-[#F53D00] shrink-0" />
            <span className="text-[10px] sm:text-[12px] tracking-[0.22em] text-[#1A1A1A] font-normal uppercase whitespace-nowrap">
              BUILD STRENGTH
            </span>
          </div>

          <span className="hidden sm:inline-block h-5 w-[1px] bg-black/35" aria-hidden="true" />

          {/* Item 3 */}
          <div className="inline-flex items-center gap-3 sm:gap-4">
            <span className="w-6 sm:w-8 h-[1.5px] bg-[#F53D00] shrink-0" />
            <span className="text-[10px] sm:text-[12px] tracking-[0.22em] text-[#1A1A1A] font-normal uppercase whitespace-nowrap">
              BREATHE BETTER
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BreathingCtaSection;
