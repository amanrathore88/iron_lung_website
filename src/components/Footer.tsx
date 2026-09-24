"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Send, Layers, MessageCircle } from "lucide-react";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES FOR IRON LUNG
// -------------------------------------------------------------------------
const STYLES = `
.cinematic-footer-wrapper {
  font-family: 'Space Grotesk', -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  
  --pill-bg-1: rgba(30, 30, 34, 0.04);
  --pill-bg-2: rgba(30, 30, 34, 0.015);
  --pill-shadow: rgba(0, 0, 0, 0.06);
  --pill-highlight: rgba(255, 255, 255, 0.85);
  --pill-inset-shadow: rgba(30, 30, 34, 0.03);
  --pill-border: rgba(30, 30, 34, 0.1);
  
  --pill-bg-1-hover: rgba(255, 105, 0, 0.08);
  --pill-bg-2-hover: rgba(255, 105, 0, 0.02);
  --pill-border-hover: rgba(255, 105, 0, 0.45);
  --pill-shadow-hover: rgba(255, 105, 0, 0.18);
  --pill-highlight-hover: rgba(255, 255, 255, 0.95);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.12); opacity: 0.9; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(255, 105, 0, 0.5)); }
  15%, 45% { transform: scale(1.22); filter: drop-shadow(0 0 10px rgba(255, 105, 0, 0.85)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 35s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Theme-adaptive Grid Background */
.footer-bg-grid {
  background-size: 56px 56px;
  background-image: 
    linear-gradient(to right, rgba(30, 30, 34, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(30, 30, 34, 0.04) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
}

/* Iron Lung Orange Aurora Glow */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(255, 105, 0, 0.18) 0%, 
    rgba(255, 105, 0, 0.05) 45%, 
    transparent 70%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: #1e1e22;
}

/* Giant Background Text Masking - Fully visible, not cut off */
.footer-giant-bg-text {
  font-size: clamp(2rem, 11vw, 15rem);
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(30, 30, 34, 0.09);
  background: linear-gradient(180deg, rgba(30, 30, 34, 0.13) 0%, rgba(30, 30, 34, 0.02) 85%, transparent 100%);
  -webkit-background-clip: text;
  background-clip: text;
  text-align: center;
  user-select: none;
}

.dark .footer-giant-bg-text {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.09);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0.02) 85%, transparent 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Text Glow */
.footer-text-glow {
  background: linear-gradient(180deg, #1e1e22 0%, rgba(30, 30, 34, 0.75) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 25px rgba(255, 105, 0, 0.12));
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
    to?: string;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      // Skip magnetic effect on touch devices for butter-smooth touch scroll
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.35,
            y: y * 0.35,
            rotationX: -y * 0.12,
            rotationY: x * 0.12,
            scale: 1.04,
            ease: "power2.out",
            duration: 0.35,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement | null) => {
          (localRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node as any);
          else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MAIN IRON LUNG CINEMATIC FOOTER
// -------------------------------------------------------------------------
const MarqueeItem = () => (
  <div className="flex items-center space-x-10 md:space-x-14 px-6 select-none font-mono">
    <span>Respiratory Power</span> <span className="text-[#ff6900]">✦</span>
    <span>Smart Card Tracking</span> <span className="text-[#ff6900]/60">✦</span>
    <span>185 BPM Tested</span> <span className="text-[#ff6900]">✦</span>
    <span>4000m Elevation Certified</span> <span className="text-[#ff6900]/60">✦</span>
    <span>Real-time Biofeedback</span> <span className="text-[#ff6900]">✦</span>
    <span>More Oxygen, More Power</span> <span className="text-[#ff6900]">✦</span>
  </div>
);

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    // React strict mode compatible GSAP context cleanup
    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.fromTo(
        giantTextRef.current,
        { y: 50, scale: 0.92, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // Staggered Content Reveal
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 45%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* 
        The "Curtain Reveal" Wrapper:
        It sits in standard flow. Because it has clip-path, its contents
        are ONLY visible within its bounding box. 
      */}
      <div
        ref={wrapperRef}
        className="relative min-h-screen md:h-screen w-full bg-background"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        {/* The actual footer stays fixed to the viewport underneath everything */}
        <footer className="fixed bottom-0 left-0 flex min-h-screen md:h-screen w-full flex-col justify-between overflow-hidden bg-background text-foreground cinematic-footer-wrapper">
          
          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[90px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text: IRON LUNG - centered, fully visible across all screen sizes */}
          <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 inset-x-0 w-full flex items-center justify-center z-0 pointer-events-none select-none overflow-hidden px-4">
            <div
              ref={giantTextRef}
              className="footer-giant-bg-text whitespace-nowrap font-display uppercase tracking-tight text-center"
            >
              IRON LUNG
            </div>
          </div>

          {/* 1. Diagonal Sleek Marquee (Lowered so it is clearly visible) */}
          <div className="absolute top-20 sm:top-24 md:top-28 left-0 w-full overflow-hidden border-y border-border/70 bg-background/85 backdrop-blur-md py-4 z-10 -rotate-1 md:-rotate-2 scale-105 md:scale-110 shadow-lg">
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.25em] text-muted-foreground uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* 2. Main Center Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-6 mt-28 sm:mt-36 md:mt-40 2xl:mt-44 w-full max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto">
            <h2
              ref={headingRef}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl 2xl:text-9xl font-black footer-text-glow tracking-tighter mb-6 sm:mb-8 md:mb-12 text-center font-display"
            >
              Ready to begin?
            </h2>

            {/* Interactive Magnetic Pills Layout */}
            <div ref={linksRef} className="flex flex-col items-center gap-4 sm:gap-6 2xl:gap-8 w-full">
              
              {/* Primary Call to Action Pills */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 2xl:gap-5 w-full">
                <MagneticButton 
                  as="a" 
                  href="#contact" 
                  className="footer-glass-pill px-6 sm:px-8 md:px-10 2xl:px-12 py-3.5 sm:py-4 md:py-5 2xl:py-5.5 rounded-full text-foreground font-bold text-xs sm:text-sm md:text-base 2xl:text-lg flex items-center gap-2.5 sm:gap-3 2xl:gap-3.5 group border-[#ff6900]/30 hover:border-[#ff6900] shadow-md hover:shadow-xl hover:shadow-[#ff6900]/15"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-9 2xl:h-9 rounded-full bg-[#ff6900]/15 text-[#ff6900] flex items-center justify-center group-hover:bg-[#ff6900] group-hover:text-white transition-all">
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-4.5 2xl:h-4.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <span>Talk to our Experts</span>
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-4.5 2xl:h-4.5 text-muted-foreground group-hover:text-[#ff6900] transition-colors" />
                </MagneticButton>
                
                <MagneticButton 
                  as="a" 
                  href="#features" 
                  className="footer-glass-pill px-6 sm:px-8 md:px-10 2xl:px-12 py-3.5 sm:py-4 md:py-5 2xl:py-5.5 rounded-full text-foreground font-bold text-xs sm:text-sm md:text-base 2xl:text-lg flex items-center gap-2.5 sm:gap-3 2xl:gap-3.5 group border-border hover:border-[#ff6900]/50 shadow-md"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-9 2xl:h-9 rounded-full bg-black/5 text-foreground flex items-center justify-center group-hover:text-[#ff6900] transition-all">
                    <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-4.5 2xl:h-4.5" />
                  </div>
                  <span>Explore Features</span>
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-4.5 2xl:h-4.5 text-muted-foreground group-hover:text-[#ff6900] transition-colors" />
                </MagneticButton>

                <MagneticButton 
                  as="a" 
                  href="https://wa.me/918853667396" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="footer-glass-pill px-5 sm:px-6 md:px-8 2xl:px-10 py-3.5 sm:py-4 md:py-5 2xl:py-5.5 rounded-full text-foreground font-bold text-xs sm:text-sm md:text-base 2xl:text-lg flex items-center gap-2 sm:gap-2.5 2xl:gap-3 group border-emerald-500/20 hover:border-emerald-500/60 shadow-md"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>WhatsApp Chat</span>
                </MagneticButton>
              </div>

              {/* Secondary Navigation Links */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 md:gap-4 2xl:gap-5 w-full mt-1 sm:mt-2">
                <MagneticButton as="a" href="#features" className="footer-glass-pill px-3.5 sm:px-5 2xl:px-6 py-2 sm:py-2.5 2xl:py-3 rounded-full text-muted-foreground font-medium text-[11px] sm:text-xs md:text-sm 2xl:text-base hover:text-foreground">
                  Features
                </MagneticButton>
                <MagneticButton as="a" href="#contact" className="footer-glass-pill px-3.5 sm:px-5 2xl:px-6 py-2 sm:py-2.5 2xl:py-3 rounded-full text-muted-foreground font-medium text-[11px] sm:text-xs md:text-sm 2xl:text-base hover:text-foreground">
                  Contact Us
                </MagneticButton>
                <MagneticButton as="a" href="mailto:info@ironlung.in" className="footer-glass-pill px-3.5 sm:px-5 2xl:px-6 py-2 sm:py-2.5 2xl:py-3 rounded-full text-muted-foreground font-medium text-[11px] sm:text-xs md:text-sm 2xl:text-base hover:text-foreground">
                  info@ironlung.in
                </MagneticButton>
                <MagneticButton as="a" href="#contact" className="footer-glass-pill px-3.5 sm:px-5 2xl:px-6 py-2 sm:py-2.5 2xl:py-3 rounded-full text-muted-foreground font-medium text-[11px] sm:text-xs md:text-sm 2xl:text-base hover:text-foreground">
                  IIT Kanpur DJAC
                </MagneticButton>
                <MagneticButton as="a" href="#privacy-policy" className="footer-glass-pill px-3.5 sm:px-5 2xl:px-6 py-2 sm:py-2.5 2xl:py-3 rounded-full text-muted-foreground font-medium text-[11px] sm:text-xs md:text-sm 2xl:text-base hover:text-foreground">
                  Privacy Policy
                </MagneticButton>
                <MagneticButton as="a" href="#terms-of-service" className="footer-glass-pill px-3.5 sm:px-5 2xl:px-6 py-2 sm:py-2.5 2xl:py-3 rounded-full text-muted-foreground font-medium text-[11px] sm:text-xs md:text-sm 2xl:text-base hover:text-foreground">
                  Terms of Service
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar / Credits - Perfectly Aligned 3-Column Grid */}
          <div className="relative z-20 w-full border-t border-border/50 pt-5 pb-8 px-4 sm:px-6 md:px-12">
            <div className="w-full max-w-7xl 2xl:max-w-[1400px] 3xl:max-w-[1640px] 4xl:max-w-[1840px] 5xl:max-w-[2200px] mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
            
            {/* Copyright */}
            <div className="text-muted-foreground text-[11px] md:text-xs 2xl:text-sm font-semibold tracking-wider uppercase font-mono justify-self-center md:justify-self-start order-2 md:order-1">
              © {new Date().getFullYear()} Iron Lung. All rights reserved.
            </div>

            {/* "Engineered with ❤ at IIT Kanpur" Badge */}
            <div className="justify-self-center order-1 md:order-2">
              <div className="footer-glass-pill px-5 2xl:px-6 py-2 2xl:py-2.5 rounded-full inline-flex items-center gap-2 border border-border/70 shadow-sm cursor-default">
                <span className="text-muted-foreground text-[11px] 2xl:text-xs font-mono uppercase tracking-wider">Engineered with</span>
                <span className="animate-footer-heartbeat text-sm 2xl:text-base text-[#ff6900] inline-block px-0.5">❤</span>
                <span className="text-muted-foreground text-[11px] 2xl:text-xs font-mono uppercase tracking-wider">at</span>
                <span className="text-foreground font-bold font-display text-xs 2xl:text-sm ml-0.5">IIT Kanpur</span>
              </div>
            </div>

            {/* Back to top */}
            <div className="justify-self-center md:justify-self-end order-3">
              <MagneticButton
                as="button"
                onClick={scrollToTop}
                title="Back to Top"
                className="w-11 h-11 2xl:w-12 2xl:h-12 rounded-full footer-glass-pill flex items-center justify-center text-muted-foreground hover:text-[#ff6900] group shadow-sm hover:shadow-md transition-all"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
              </MagneticButton>
            </div>

            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default CinematicFooter;
