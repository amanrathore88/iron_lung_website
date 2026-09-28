// Popcorn Text — Originkit

"use client";

import * as React from "react";
import { useMemo } from "react";
import { motion, type AnimationOptions } from "framer-motion";

const TAGS = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "div", "span"] as const;

type Tag = (typeof TAGS)[number];

type FontStyle = React.CSSProperties;

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

  charIndexOffset?: number;
  totalCharsOverall?: number;

  isActive?: boolean;
  hasAppearedAlready?: boolean;
  onAnimationComplete?: () => void;
  appearTrigger?: "default" | "hover" | "scroll";
  scrollConfig?: { position: "top" | "bottom"; distance: number };
};

const defaultFont: FontStyle = {
  fontFamily: "Inter",
  fontWeight: 700,
  fontSize: 120,
  lineHeight: "1.5em",
  letterSpacing: "0em",
  textAlign: "center",
};

export function PopcornText({
  text = "Your Dashboard Awaits",
  wordsConfig,
  font = defaultFont,
  color = "#FFFFFF",
  tag = "h1",
  style,

  startY = 30,
  startScale = 0,
  startOpacity = 0,
  rotationRange = 20,

  stagger = 0.04,
  transition = { type: "spring", stiffness: 350, damping: 14, mass: 1 },

  charIndexOffset = 0,
  totalCharsOverall,

  isActive = true,
  hasAppearedAlready = false,
  onAnimationComplete,
}: PopcornTextProps) {
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

  // Total characters in this component
  const chars = useMemo(() => {
    return wordsList.flatMap((w) => w.text.split(""));
  }, [wordsList]);

  // Stable random rotations and randomized stagger order matching Originkit
  const charsConfig = useMemo(() => {
    const totalCount = totalCharsOverall || chars.length;
    const indices = Array.from({ length: totalCount }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = indices[i];
      indices[i] = indices[j];
      indices[j] = temp;
    }

    return chars.map((char, index) => {
      const globalIdx = charIndexOffset + index;
      const randomRotation = (Math.random() * 2 - 1) * rotationRange;
      const staggerOrder = indices[globalIdx] !== undefined ? indices[globalIdx] : globalIdx;
      return {
        char,
        randomRotation,
        staggerOrder,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chars.length, charIndexOffset, totalCharsOverall, rotationRange]);

  const fontStyles = (font ?? {}) as React.CSSProperties;
  const safeTag = (TAGS as readonly string[]).includes(tag) ? tag : "h1";
  const MotionTag = motion[safeTag as Tag] as any;

  let localCharIdx = 0;

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
              const currentIdx = localCharIdx++;
              const item = charsConfig[currentIdx] || {
                char,
                randomRotation: 0,
                staggerOrder: currentIdx,
              };

              const shouldShow = isActive || hasAppearedAlready;
              const isSettled = hasAppearedAlready;

              return (
                <motion.span
                  key={charIndex}
                  className="char"
                  data-char-idx={charIndexOffset + currentIdx}
                  aria-hidden="true"
                  initial={
                    isSettled
                      ? { y: 0, scale: 1, opacity: 1, rotate: 0 }
                      : {
                          y: startY,
                          scale: startScale,
                          opacity: startOpacity,
                          rotate: item.randomRotation,
                        }
                  }
                  animate={
                    shouldShow
                      ? {
                          y: 0,
                          scale: 1,
                          opacity: 1,
                          rotate: 0,
                        }
                      : {
                          y: startY,
                          scale: startScale,
                          opacity: startOpacity,
                          rotate: item.randomRotation,
                        }
                  }
                  transition={
                    isSettled
                      ? { duration: 0 }
                      : {
                          ...transition,
                          delay: item.staggerOrder * stagger,
                        }
                  }
                  onAnimationComplete={
                    charIndexOffset + currentIdx ===
                    (totalCharsOverall ? totalCharsOverall - 1 : chars.length - 1)
                      ? onAnimationComplete
                      : undefined
                  }
                  style={{
                    display: "inline-block",
                    transformOrigin: "center center",
                    willChange: "transform, opacity",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              );
            })}
          </span>
        ))}
      </MotionTag>
    </div>
  );
}

export default PopcornText;
