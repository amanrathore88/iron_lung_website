import React from 'react';
import { X, Sparkles, Play, RotateCcw } from 'lucide-react';

export type ButtonType = 'uv' | 'start' | 'reset';

export interface ButtonData {
  id: ButtonType;
  name: string;
  shortLabel: string;
  badge: string;
  title: string;
  description: string;
  accentColor: string;
  glowColor: string;
  badgeText: string;
  iconBg: string;
  iconText: string;
}

export const BUTTON_INFO_MAP: Record<ButtonType, ButtonData> = {
  uv: {
    id: 'uv',
    name: 'UV Sanitization',
    shortLabel: 'UV SANITIZE',
    badge: 'STERILIZATION',
    title: 'UV-C Purification',
    description:
      'Automatically sanitizes airflow channels and handset with medical-grade UV-C light.',
    accentColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.28)',
    badgeText: 'text-purple-600',
    iconBg: 'bg-purple-500/12',
    iconText: 'text-purple-600',
  },
  start: {
    id: 'start',
    name: 'Start Protocol',
    shortLabel: 'START',
    badge: 'SESSION START',
    title: 'Start Protocol',
    description:
      'Activates guided respiratory training synchronized with real-time biometric feedback.',
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.28)',
    badgeText: 'text-emerald-600',
    iconBg: 'bg-emerald-500/12',
    iconText: 'text-emerald-600',
  },
  reset: {
    id: 'reset',
    name: 'System Reset',
    shortLabel: 'RESET',
    badge: 'EMERGENCY',
    title: 'Stop & Reset',
    description:
      'Instantly halts all airflow and recalibrates to zero.',
    accentColor: '#F53D00',
    glowColor: 'rgba(245, 61, 0, 0.25)',
    badgeText: 'text-[#F53D00]',
    iconBg: 'bg-[#FFF3EE]',
    iconText: 'text-[#F53D00]',
  },
};

interface ConsoleButtonInfoCardProps {
  activeButton: ButtonType | null;
  onClose: () => void;
  anchorPos: { x: number; y: number } | null;
  isMobile: boolean;
}

export const ConsoleButtonInfoCard: React.FC<ConsoleButtonInfoCardProps> = ({
  activeButton,
  onClose,
  anchorPos,
  isMobile,
}) => {
  if (!activeButton) return null;

  const data = BUTTON_INFO_MAP[activeButton];

  // Icon mapping
  const renderIcon = () => {
    switch (activeButton) {
      case 'uv':
        return <Sparkles className="w-5 h-5 text-purple-600" strokeWidth={2} />;
      case 'start':
        return <Play className="w-5 h-5 text-emerald-600 fill-emerald-600" />;
      case 'reset':
        return <RotateCcw className="w-5 h-5 text-[#F53D00]" strokeWidth={2} />;
    }
  };

  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 900;
  const isCompactDevice = isMobile || screenW < 1024;

  // On Mobile and Tablet (< 1024px): Compact floating modal card
  if (isCompactDevice) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto bg-black/35 backdrop-blur-xs animate-in fade-in duration-200">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Compact Card */}
        <div
          className="relative w-full max-w-[310px] rounded-2xl bg-white/95 border border-slate-200/80 p-4 flex flex-col gap-2.5 backdrop-blur-xl animate-in zoom-in-95 duration-200 z-10"
          style={{
            boxShadow: `0 16px 40px -8px ${data.glowColor}, 0 8px 24px rgba(0, 0, 0, 0.10)`,
          }}
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl ${data.iconBg} flex items-center justify-center shrink-0`}
              >
                {renderIcon()}
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-[9.5px] font-extrabold tracking-[0.14em] uppercase ${data.badgeText}`}
                >
                  {data.badge}
                </span>
                <span className="text-[17px] font-extrabold text-[#0F172A] tracking-tight leading-tight mt-0.5">
                  {data.title}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={13} strokeWidth={2.2} />
            </button>
          </div>

          {/* Concise Description */}
          <p className="text-[12px] text-slate-600 leading-snug font-normal">
            {data.description}
          </p>

          {/* Subtle bottom accent line */}
          <div className="w-full h-[1px] bg-slate-100 mt-0.5" />
        </div>
      </div>
    );
  }

  // On Desktop (>= 1024px): Compact card anchored cleanly below the hardware buttons
  const cardWidth = 305;
  const estimatedCardHeight = 135;
  const buttonX = anchorPos ? anchorPos.x : 520;
  const buttonY = anchorPos ? anchorPos.y : 540;

  let left = Math.min(buttonX - 36, screenW - cardWidth - 24);
  if (left < 460 && screenW >= 1200) {
    left = 460;
  } else if (left < 20) {
    left = 20;
  }

  let top = Math.min(buttonY + 20, screenH - estimatedCardHeight - 20);
  if (top < 76) top = 76;

  return (
    <div
      className="absolute z-40 pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${cardWidth}px`,
      }}
    >
      {/* Compact Popover Card matching reference */}
      <div
        className="relative w-full rounded-2xl bg-white/95 border border-slate-200/80 p-4 flex flex-col gap-2.5 backdrop-blur-xl transition-all"
        style={{
          boxShadow: `0 16px 40px -8px ${data.glowColor}, 0 8px 24px rgba(0, 0, 0, 0.08)`,
        }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl ${data.iconBg} flex items-center justify-center shrink-0`}
            >
              {renderIcon()}
            </div>
            <div className="flex flex-col">
              <span
                className={`text-[9.5px] font-extrabold tracking-[0.14em] uppercase ${data.badgeText}`}
              >
                {data.badge}
              </span>
              <span className="text-[17.5px] font-extrabold text-[#0F172A] tracking-tight leading-tight mt-0.5">
                {data.title}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={13} strokeWidth={2.2} />
          </button>
        </div>

        {/* Concise Description */}
        <p className="text-[12px] text-slate-600 leading-snug font-normal">
          {data.description}
        </p>

        {/* Subtle bottom divider rule */}
        <div className="w-full h-[1px] bg-slate-100 mt-0.5" />
      </div>
    </div>
  );
};

