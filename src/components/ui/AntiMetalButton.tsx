"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DoubleChevronProps {
  index: number;
  dotColor: string;
}

const DoubleChevron: React.FC<DoubleChevronProps> = ({ index, dotColor }) => {
  const base = index * 0.12;
  const dots = [
    { cx: 2, cy: 2, d: 0 },
    { cx: 5, cy: 5, d: 0.05 },
    { cx: 8, cy: 8, d: 0.1 },
    { cx: 5, cy: 11, d: 0.15 },
    { cx: 2, cy: 14, d: 0.2 },
    { cx: 6, cy: 2, d: 0.05 },
    { cx: 9, cy: 5, d: 0.1 },
    { cx: 12, cy: 8, d: 0.15 },
    { cx: 9, cy: 11, d: 0.2 },
    { cx: 6, cy: 14, d: 0.25 },
  ];

  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      aria-hidden="true"
      focusable="false"
      className="shrink-0 overflow-visible"
    >
      <g fill={dotColor}>
        {dots.map((p, i) => (
          <circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r="1"
            className="bd-dot"
            style={{ animationDelay: `${base + p.d}s` }}
          />
        ))}
      </g>
    </svg>
  );
};

export interface AntiMetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  accentFrom?: string;
  accentTo?: string;
  dotColor?: string;
  href?: string;
}

export const AntiMetalButton = React.forwardRef<HTMLButtonElement, AntiMetalButtonProps>(
  (
    {
      className,
      children,
      label,
      accentFrom = "#ff6900",
      accentTo = "#e05500",
      dotColor = "#ffffff",
      href,
      onClick,
      ...props
    },
    ref
  ) => {
    const content = label ?? children ?? "Book a demo";

    const buttonContent = (
      <>
        <style>{`
          @keyframes bd-dot-wave {
            0%, 70%, 100% { opacity: 0.25; transform: scale(0.85); }
            35% { opacity: 1; transform: scale(1); }
          }
          .bd-dot {
            transform-box: fill-box;
            transform-origin: center;
            animation: bd-dot-wave 1.4s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .bd-dot { animation: none; opacity: 1; }
          }
        `}</style>

        <span className="absolute inset-y-0 right-2.5 sm:right-3.5 flex items-center text-[11px] sm:text-[12px] md:text-[13px] font-display font-bold uppercase tracking-wider text-black group-hover/btn:opacity-0 group-hover/btn:translate-x-3 transition-all duration-300 ease-out z-0 pointer-events-none select-none">
          {content}
        </span>

        <span
          aria-hidden="true"
          className="absolute bottom-1 left-1 top-1 z-10 flex w-8 sm:w-9 items-center justify-start gap-2 sm:gap-2.5 overflow-hidden rounded-lg pl-2.5 sm:pl-3 pr-2 transition-[width,gap] duration-300 [transition-timing-function:cubic-bezier(0.65,0,0.35,1)] group-hover/btn:w-[calc(100%-0.5rem)]"
          style={{
            background: `linear-gradient(180deg, ${accentFrom} 0%, ${accentTo} 100%)`,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2), 0 2px 8px rgba(255,105,0,0.35)",
          }}
        >
          <DoubleChevron index={0} dotColor={dotColor} />
          <DoubleChevron index={1} dotColor={dotColor} />
          <DoubleChevron index={2} dotColor={dotColor} />
          <DoubleChevron index={3} dotColor={dotColor} />
          <DoubleChevron index={4} dotColor={dotColor} />
        </span>
      </>
    );

    if (href) {
      return (
        <a
          href={href}
          className={cn(
            "group/btn relative inline-flex h-10 sm:h-11 min-w-[115px] sm:min-w-[140px] px-3 sm:px-5 overflow-hidden rounded-xl transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none cursor-pointer",
            "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-black/10 hover:border-[#ff6900]/40 hover:shadow-md hover:shadow-[#ff6900]/15",
            className
          )}
        >
          {buttonContent}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn(
          "group/btn relative inline-flex h-10 sm:h-11 min-w-[115px] sm:min-w-[140px] px-3 sm:px-5 overflow-hidden rounded-xl transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none cursor-pointer",
          "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-black/10 hover:border-[#ff6900]/40 hover:shadow-md hover:shadow-[#ff6900]/15",
          className
        )}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

AntiMetalButton.displayName = "AntiMetalButton";

export default AntiMetalButton;
