import React from 'react';
import { X, Sparkles, Play, RotateCcw, CheckCircle2 } from 'lucide-react';

export type ButtonType = 'uv' | 'start' | 'reset';

export interface ButtonData {
  id: ButtonType;
  name: string;
  shortLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  specs: { label: string; value: string }[];
  accentColor: string;
  glowColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconBg: string;
  iconText: string;
}

export const BUTTON_INFO_MAP: Record<ButtonType, ButtonData> = {
  uv: {
    id: 'uv',
    name: 'UV Sanitization',
    shortLabel: 'UV SANITIZE',
    badge: 'MEDICAL-GRADE STERILIZATION',
    title: 'UV-C Purification System',
    subtitle: 'Automated Dual-Chamber Cleanse',
    description:
      'Initiates an automated medical-grade UV-C irradiation cycle through airflow channels and handset, eliminating 99.9% of bacteria and pathogens.',
    specs: [
      { label: 'Efficacy', value: '99.9% Pathogen Elimination' },
      { label: 'Cycle Time', value: '60 Seconds Rapid Cycle' },
      { label: 'Safety Mode', value: 'Auto Shutter & Zero Ozone' },
    ],
    accentColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-600',
    badgeBorder: 'border-purple-500/25',
    iconBg: 'bg-purple-500/15',
    iconText: 'text-purple-600',
  },
  start: {
    id: 'start',
    name: 'Start Protocol',
    shortLabel: 'START',
    badge: 'SESSION ACTIVATION',
    title: 'One-Touch Protocol Start',
    subtitle: 'Adaptive Biometric Induction',
    description:
      'Activates hyper-oxygenation training protocol, synchronizing variable-frequency air turbines with real-time biometric feedback.',
    specs: [
      { label: 'Activation', value: 'One-Touch Instant Engage' },
      { label: 'Flow Control', value: 'Biometric Adaptive Delivery' },
      { label: 'Telemetry', value: 'Real-Time Waveform Sync' },
    ],
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-600',
    badgeBorder: 'border-emerald-500/25',
    iconBg: 'bg-emerald-500/15',
    iconText: 'text-emerald-600',
  },
  reset: {
    id: 'reset',
    name: 'System Reset',
    shortLabel: 'RESET',
    badge: 'SAFETY & ZERO-RECALIBRATION',
    title: 'Emergency Stop & Reset',
    subtitle: 'Instant Pressure Neutralization',
    description:
      'Safely halts all airflow, vents internal pressure vessels, and recalibrates precision flow transducers to absolute zero baseline.',
    specs: [
      { label: 'Response', value: '< 0.2s Rapid Neutralize' },
      { label: 'Sensor Calibration', value: 'Zero-Point Auto Tare' },
      { label: 'Chamber Status', value: 'Full Atmospheric Vent' },
    ],
    accentColor: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-600',
    badgeBorder: 'border-rose-500/25',
    iconBg: 'bg-rose-500/15',
    iconText: 'text-rose-600',
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
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'start':
        return <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />;
      case 'reset':
        return <RotateCcw className="w-4 h-4 text-rose-600" />;
    }
  };

  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 900;
  const isCompactDevice = isMobile || screenW < 1024;

  // On Mobile and Tablet (< 1024px): Positioned as a floating modal/sheet with backdrop
  if (isCompactDevice) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Card */}
        <div
          className="relative w-full max-w-[340px] max-h-[calc(100vh-32px)] overflow-y-auto rounded-2xl bg-white/95 border border-slate-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.22)] p-3.5 sm:p-4 flex flex-col gap-2.5 backdrop-blur-xl animate-in zoom-in-95 duration-200 z-10"
          style={{
            boxShadow: `0 20px 50px -10px ${data.glowColor}, 0 0 0 1px rgba(255, 255, 255, 0.8)`,
          }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${data.iconBg} flex items-center justify-center shrink-0`}>
                {renderIcon()}
              </div>
              <div className="flex flex-col">
                <span className={`text-[8.5px] font-black tracking-widest uppercase ${data.badgeText}`}>
                  {data.badge}
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-none mt-0.5">
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
              <X size={13} />
            </button>
          </div>

          {/* Description */}
          <p className="text-[11.5px] text-slate-600 leading-snug font-normal">
            {data.description}
          </p>

          {/* Specs List */}
          <div className="flex flex-col gap-1 pt-0.5">
            {data.specs.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-slate-50/80 border border-slate-100 text-[10.5px]"
              >
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <CheckCircle2 size={12} className={data.iconText} />
                  <span>{s.label}</span>
                </div>
                <span className="font-bold text-slate-900">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-1.5 text-[9.5px] text-slate-400 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Hardware Function
            </span>
            <span className="font-semibold text-slate-500">Tap anywhere to close</span>
          </div>
        </div>
      </div>
    );
  }

  // On Desktop (>= 1024px): Anchored cleanly below the button cluster with strictly guaranteed bottom clearance
  const cardWidth = 310;
  const estimatedCardHeight = 220;
  const buttonX = anchorPos ? anchorPos.x : 520;
  const buttonY = anchorPos ? anchorPos.y : 540;

  // Position card horizontally aligned with button, clear of left cards (>= 475px on wide desktop)
  let left = Math.min(buttonX - 40, screenW - cardWidth - 24);
  if (left < 475 && screenW >= 1200) {
    left = 475;
  } else if (left < 20) {
    left = 20;
  }

  // Strictly clamp top position so the card NEVER cuts off at the bottom of the screen
  let top = Math.min(buttonY + 18, screenH - estimatedCardHeight - 20);
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
      {/* Popover Card */}
      <div
        className="relative w-full max-h-[calc(100vh-90px)] overflow-y-auto rounded-2xl bg-white/95 border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.16)] p-3.5 flex flex-col gap-2 backdrop-blur-xl transition-all"
        style={{
          boxShadow: `0 20px 50px -10px ${data.glowColor}, 0 0 0 1px rgba(255, 255, 255, 0.9)`,
        }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${data.iconBg} flex items-center justify-center shrink-0 shadow-xs`}>
              {renderIcon()}
            </div>
            <div className="flex flex-col">
              <span className={`text-[8.5px] sm:text-[9px] font-black tracking-widest uppercase ${data.badgeText}`}>
                {data.badge}
              </span>
              <span className="text-[13.5px] sm:text-sm font-black text-slate-900 tracking-tight leading-none mt-0.5">
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
            <X size={13} />
          </button>
        </div>

        {/* Subtitle & Description */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10.5px] font-bold text-slate-700 leading-tight">
            {data.subtitle}
          </span>
          <p className="text-[11px] text-slate-600 leading-snug font-normal">
            {data.description}
          </p>
        </div>

        {/* Feature Specs */}
        <div className="flex flex-col gap-1 pt-0.5">
          {data.specs.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-slate-50/90 border border-slate-100 text-[10.5px]"
            >
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <CheckCircle2 size={12} className={data.iconText} />
                <span>{s.label}</span>
              </div>
              <span className="font-bold text-slate-900">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1.5 text-[9.5px] text-slate-400 border-t border-slate-100">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Hardware Function Active</span>
          </span>
          <span className="font-semibold text-slate-500">Click button or × to close</span>
        </div>
      </div>
    </div>
  );
};
