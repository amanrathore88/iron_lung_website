import React from 'react';

const heroBannerImages = [
  '/images/about/gallery/gallery-1.jpg',
  '/images/about/gallery/gallery-2.jpg',
  '/images/about/gallery/gallery-3.jpg',
  '/images/about/gallery/gallery-4.jpg',
  '/images/about/gallery/gallery-5.jpg',
  '/images/about/gallery/gallery-6.jpg',
  '/images/about/gallery/gallery-7.jpg',
];

const angleStyles: React.CSSProperties[] = [
  { transform: 'rotateY(60deg) scale(1.10)' },
  { transform: 'rotateY(30deg) scale(0.95)' },
  { transform: 'rotateY(15deg) scale(0.90)' },
  { transform: 'rotateY(0deg) scale(0.89)' },
  { transform: 'rotateY(-15deg) scale(0.90)' },
  { transform: 'rotateY(-30deg) scale(0.95)' },
  { transform: 'rotateY(-60deg) scale(1.10)' },
];

export const AboutHero: React.FC = () => {
  return (
    <div className="bg-white pt-24 sm:pt-28 md:pt-32 text-center overflow-hidden">
      <div className="px-4 sm:px-6">
        {/* Desktop 3D perspective display */}
        <div
          className="hidden sm:flex justify-center items-center gap-4 md:gap-6"
          style={{ perspective: '1000px' }}
        >
          {heroBannerImages.map((img, idx) => (
            <div
              key={idx}
              className="w-40 h-64 md:w-48 md:h-72 transform-gpu transition-transform duration-300 rounded-xl overflow-hidden shadow-xl bg-neutral-100"
              style={{ ...angleStyles[idx], transformStyle: 'preserve-3d' }}
            >
              <img
                src={img}
                alt={`IRONLUNG gallery ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Mobile - Horizontal Scroll */}
        <div className="flex sm:hidden gap-4 overflow-x-auto px-2 py-4">
          {heroBannerImages.map((img, idx) => (
            <div key={idx} className="flex-none w-40 h-60 shrink-0 rounded-xl overflow-hidden shadow-md bg-neutral-100">
              <img
                src={img}
                alt={`IRONLUNG gallery ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 sm:mt-12 text-base sm:text-xl text-neutral-600 font-normal max-w-4xl mx-auto px-4 leading-relaxed">
        At IRONLUNG, we believe better breathing leads to better performance. Our respiratory muscle training technology helps you train your breathing muscles with controlled resistance, so you can build breathing strength, improve endurance, and push your limits.
      </p>
    </div>
  );
};

export default AboutHero;
