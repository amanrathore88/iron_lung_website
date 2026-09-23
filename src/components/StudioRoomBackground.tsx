import React from 'react';

interface StudioRoomBackgroundProps {
  scrollProgress: number;
}

export const StudioRoomBackground: React.FC<StudioRoomBackgroundProps> = ({ scrollProgress }) => {
  // Studio room background is active during Hero (0.0) through Feature Section 03 (0.73).
  // As the user scrolls past Section 03 (0.73 -> 0.79), it smoothly transitions out,
  // handing over completely to 'Our Story's warm ivory canvas so zero window background or white fade shows under the 3D model.
  const studioOpacity = scrollProgress <= 0.73
    ? 1.0
    : Math.max(0, 1 - (scrollProgress - 0.73) / 0.06);

  if (studioOpacity <= 0) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-150"
      style={{ opacity: studioOpacity }}
    >
      <div className="absolute inset-0 bg-white" />
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
          backgroundPosition: 'center center',
        }}
      />

      {/* 1. Left Horizontal White Fade */}
      <div className="absolute inset-y-0 left-0 w-full sm:w-[58vw] max-w-[900px] bg-gradient-to-r from-white via-white/85 to-transparent z-[1]" />

      {/* 2. Top Header White Fade */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/60 to-transparent z-[1]" />

      {/* 3. Soft Bottom Floor Fade */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/30 via-white/10 to-transparent z-[1]" />

      {/* 4. Right Side White Vignette */}
      <div className="absolute inset-y-0 right-0 w-[30vw] max-w-[420px] bg-gradient-to-l from-white/65 via-white/20 to-transparent z-[1]" />

      {/* 5. Feature Section White Studio Wash */}
      <div
        className="absolute inset-0 bg-white/45 backdrop-blur-[2px] z-[1] transition-opacity duration-300"
        style={{
          opacity: Math.min(1, Math.max(0, (scrollProgress - 0.18) / 0.20)),
        }}
      />
    </div>
  );
};
