import React, { useEffect, useRef, useState } from 'react';

export interface BlurTextProps {
  text: string;
  delay?: number;
  initialDelay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  duration?: number;
  easing?: string;
  onAnimationComplete?: () => void;
  as?: React.ElementType;
  highlightWords?: string[];
  highlightClassName?: string;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 200,
  initialDelay = 0,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  duration = 0.75,
  easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  onAnimationComplete,
  as: Component = 'span',
  highlightWords = [],
  highlightClassName = '',
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            setInView(true);
          });
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (!inView || !onAnimationComplete) return;

    const totalElements =
      animateBy === 'words'
        ? text.split(/\s+/).filter(Boolean).length
        : text.replace(/\s+/g, '').length;

    const totalDuration = initialDelay + Math.max(0, totalElements - 1) * delay + duration * 1000;
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [inView, text, delay, initialDelay, animateBy, duration, onAnimationComplete]);

  const fromY = direction === 'top' ? '-35px' : '35px';
  const lines = text.split('\n');
  let globalIndex = 0;

  return (
    <Component ref={ref} className={`select-text ${className}`}>
      {lines.map((line, lineIdx) => {
        const words = line.split(/\s+/).filter(Boolean);

        return (
          <React.Fragment key={`line-${lineIdx}`}>
            {lineIdx > 0 && <br />}
            {animateBy === 'words' ? (
              words.map((word, wordIdx) => {
                const currentIndex = globalIndex++;
                const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
                const isHighlighted = highlightWords.includes(cleanWord);

                return (
                  <span
                    key={`word-${wordIdx}`}
                    className={`inline-block mr-[0.28em] transition-all ${
                      isHighlighted ? highlightClassName : ''
                    }`}
                    style={{
                      transform: inView ? 'translate3d(0, 0, 0)' : `translate3d(0, ${fromY}, 0)`,
                      opacity: inView ? 1 : 0,
                      filter: inView ? 'blur(0px)' : 'blur(10px)',
                      transitionProperty: 'transform, opacity, filter',
                      transitionDuration: `${duration}s`,
                      transitionTimingFunction: easing,
                      transitionDelay: `${initialDelay + currentIndex * delay}ms`,
                      willChange: 'transform, opacity, filter',
                    }}
                  >
                    {word}
                  </span>
                );
              })
            ) : (
              words.map((word, wordIdx) => {
                const letters = word.split('');
                const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
                const isHighlighted = highlightWords.includes(cleanWord);

                return (
                  <span
                    key={`word-${wordIdx}`}
                    className={`inline-block mr-[0.28em] whitespace-nowrap ${
                      isHighlighted ? highlightClassName : ''
                    }`}
                  >
                    {letters.map((char, charIdx) => {
                      const currentIndex = globalIndex++;
                      return (
                        <span
                          key={`char-${charIdx}`}
                          className="inline-block transition-all"
                          style={{
                            transform: inView ? 'translate3d(0, 0, 0)' : `translate3d(0, ${fromY}, 0)`,
                            opacity: inView ? 1 : 0,
                            filter: inView ? 'blur(0px)' : 'blur(10px)',
                            transitionProperty: 'transform, opacity, filter',
                            transitionDuration: `${duration}s`,
                            transitionTimingFunction: easing,
                            transitionDelay: `${initialDelay + currentIndex * delay}ms`,
                            willChange: 'transform, opacity, filter',
                          }}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                );
              })
            )}
          </React.Fragment>
        );
      })}
    </Component>
  );
};

export default BlurText;
