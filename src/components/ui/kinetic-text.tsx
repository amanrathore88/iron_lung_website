import React from "react";
import { cn } from "@/lib/utils";

type As = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

export interface KineticTextProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
  as?: As;
  className?: string;
}

export function KineticText({
  text,
  as: Tag = "h1",
  className = "",
  style,
  ...rest
}: KineticTextProps) {
  const mergedStyle = {
    "--hover-padding": "calc(1em / 16)",
    "--text-stroke-width": "calc(1em * 125 / 6000)",
    ...(style as React.CSSProperties | undefined),
  } as React.CSSProperties;

  const words = text.split(" ");

  return (
    <Tag
      {...rest}
      aria-label={text}
      className={cn("inline-flex flex-wrap cursor-default select-none", className)}
      style={mergedStyle}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-flex whitespace-nowrap">
          {word.split("").map((letter, letterIdx) => (
            <span
              key={letterIdx}
              aria-hidden="true"
              className="[will-change:font-weight,-webkit-text-stroke-width,padding] [-webkit-text-stroke-color:transparent] [-webkit-text-stroke-width:var(--text-stroke-width)] [transition:font-weight_0.35s_cubic-bezier(0.2,0,0,1),-webkit-text-stroke-color_0.35s,_padding_0.35s] hover:[padding-inline:var(--hover-padding)] hover:font-[900] hover:[-webkit-text-stroke-color:currentColor] hover:[-webkit-text-stroke-width:calc(var(--text-stroke-width)*2)] has-[+span+span:hover]:font-[400] has-[+span:hover]:[padding-inline:var(--hover-padding)] has-[+span:hover]:font-[600] [:hover+&]:[padding-inline:var(--hover-padding)] [:hover+&]:font-[600] [:hover+span+&]:font-[400]"
            >
              {letter}
            </span>
          ))}
          {wordIdx < words.length - 1 && (
            <span aria-hidden="true" className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  );
}

export default KineticText;
