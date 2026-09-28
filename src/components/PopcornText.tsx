// Popcorn Text — Originkit (Enhanced with Multi-Colored Words & Single-Run Lifecycle)

"use client";

import * as React from "react";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useAnimate, type AnimationOptions } from "framer-motion";

const TAGS = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "div", "span"] as const;

type Tag = (typeof TAGS)[number];

type FontStyle = React.CSSProperties;

type ScrollConfig = { position: "top" | "bottom"; distance: number };

export type WordItem = {
  text: string;
  color?: string;
};

export type PopcornTextProps = {
  text?: string;
  wordsConfig?: WordItem[];
  font?: FontStyle;
  color?: string;
  tag?: Tag;
  style?: React.CSSProperties;

  startY?: number;
  startScale?: number;
  startOpacity?: number;
  rotationRange?: number;

  stagger?: number;
  transition?: AnimationOptions;
  appearTrigger?: "default" | "hover" | "scroll";
  scrollConfig?: ScrollConfig;
  isActive?: boolean;
};

const defaultFont: FontStyle = {
  fontFamily: "'Space Grotesk', 'Inter', -apple-system, sans-serif",
  fontWeight: 800,
  fontSize: "clamp(38px, 7vw, 102px)",
  lineHeight: "1.15em",
  letterSpacing: "-0.03em",
  textAlign: "center",
};

export function PopcornText({
  text = "YOUR DASHBOARD AWAITS",
  wordsConfig,
  font = defaultFont,
  color = "#FFFFFF",
  tag = "h1",
  style,

  startY = 35,
  startScale = 0,
  startOpacity = 0,
  rotationRange = 22,

  stagger = 0.03,
  transition = { type: "spring", stiffness: 380, damping: 18, mass: 1 },
  appearTrigger: _appearTrigger = "default",
  scrollConfig: _scrollConfig = { position: "bottom", distance: 20 },
  isActive = true,
}: PopcornTextProps) {
  const [scope, animate] = useAnimate();
  const hasAppearedRef = useRef(false);
  const isInitializedRef = useRef(false);

  // Normalize words array
  const wordsList: WordItem[] = useMemo(() => {
    if (wordsConfig && wordsConfig.length > 0) {
      return wordsConfig;
    }
    return (text ?? "").split(" ").map((w) => ({ text: w, color }));
  }, [wordsConfig, text, color]);

  // Combined full text for ARIA label
  const fullText = useMemo(
    () => wordsList.map((w) => w.text).join(" "),
    [wordsList]
  );

  // Total non-space characters
  const allChars = useMemo(() => {
    return wordsList.flatMap((w) => w.text.split(""));
  }, [wordsList]);

  // Character configuration (random rotation and stagger order)
  const charsConfig = useMemo(() => {
    const indices = allChars.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    return allChars.map((char, index) => {
      const randomRotation = (Math.random() * 2 - 1) * rotationRange;
      return {
        char,
        randomRotation,
        staggerOrder: indices[index],
      };
    });
  }, [allChars.length, rotationRange]);

  const resetToHidden = useCallback(() => {
    if (!scope.current) return;
    animate(
      ".char",
      {
        y: startY,
        scale: startScale,
        opacity: startOpacity,
        rotate: "var(--start-rot)",
      },
      { duration: 0 }
    );
  }, [animate, startY, startScale, startOpacity, scope]);

  const runAppear = useCallback(() => {
    if (!scope.current) return;

    const animationConfig = {
      ...transition,
      delay: (i: number) => {
        const order = charsConfig[i]?.staggerOrder ?? i;
        return order * stagger;
      },
    };

    animate(
      ".char",
      { y: 0, scale: 1, opacity: 1, rotate: 0 },
      animationConfig as any
    );
  }, [animate, transition, stagger, charsConfig, scope]);

  // Initial hidden setup on mount
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      resetToHidden();
    }
  }, [resetToHidden]);

  // Handle strictly one-time appear animation when isActive turns true
  useEffect(() => {
    if (isActive && !hasAppearedRef.current) {
      hasAppearedRef.current = true;
      const timer = setTimeout(runAppear, 30);
      return () => clearTimeout(timer);
    } else if (!isActive && hasAppearedRef.current) {
      hasAppearedRef.current = false;
      resetToHidden();
    }
  }, [isActive, runAppear, resetToHidden]);

  const fontStyles = (font ?? {}) as React.CSSProperties;
  const safeTag = (TAGS as readonly string[]).includes(tag) ? tag : "h1";
  const MotionTag = motion[safeTag as Tag] as any;

  // Track global non-space character index across words
  let globalCharCounter = 0;

  return (
    <div
      style={{
        position: "relative",
        overflow: "visible",
        width: "max-content",
        maxWidth: "100%",
        display: "inline-block",
        ...style,
      }}
    >
      <MotionTag
        ref={scope}
        aria-label={fullText}
        style={{
          margin: 0,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          columnGap: "0.28em",
          rowGap: "0.10em",
          ...fontStyles,
        }}
      >
        {wordsList.map((wordItem, wordIndex) => (
          <span
            key={wordIndex}
            className="inline-flex whitespace-nowrap"
            style={{ color: wordItem.color || color }}
          >
            {wordItem.text.split("").map((char, charIndex) => {
              const currentIdx = globalCharCounter++;
              const item = charsConfig[currentIdx] || {
                char,
                randomRotation: 0,
                staggerOrder: currentIdx,
              };

              return (
                <span
                  key={charIndex}
                  className="char"
                  data-char-idx={currentIdx}
                  style={
                    {
                      display: "inline-block",
                      willChange: "transform, opacity",
                      transformOrigin: "center center",
                      "--start-rot": `${item.randomRotation}deg`,
                    } as React.CSSProperties
                  }
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </MotionTag>
    </div>
  );
}

export default PopcornText;
