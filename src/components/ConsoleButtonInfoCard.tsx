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
      'Initiates an automated medical-grade UV-C irradiation cycle through internal airflow channels and the user handset, neutralizing 99.9% of bacteria and pathogens between sessions.',
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
      'Instantly activates the selected hyper-oxygenation or rhythmic training protocol, synchronizing variable-frequency air turbines with live respiratory feedback.',
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
      'Safely halts all active airflow, vents internal pressure vessels, and recalibrates precision flow transducers to absolute zero baseline for the next user.',
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
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'start':
        return <Play className="w-5 h-5 text-emerald-600 fill-emerald-600" />;
      case 'reset':
        return <RotateCcw className="w-5 h-5 text-rose-600" />;
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
          className="relative w-full max-w-[360px] rounded-2xl bg-white/95 border border-slate-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.22)] p-4 flex flex-col gap-3 backdrop-blur-xl animate-in zoom-in-95 duration-250 z-10"
          style={{
            boxShadow: `0 20px 50px -10px ${data.glowColor}, 0 0 0 1px rgba(255, 255, 255, 0.8)`,
          }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl ${data.iconBg} flex items-center justify-center shrink-0`}>
                {renderIcon()}
              </div>
              <div className="flex flex-col">
                <span className={`text-[9px] font-black tracking-widest uppercase ${data.badgeText}`}>
                  {data.badge}
                </span>
                <span className="text-base font-black text-slate-900 tracking-tight leading-none mt-0.5">
                  {data.title}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {data.description}
          </p>

          {/* Specs List */}
          <div className="flex flex-col gap-1.5 pt-1">
            {data.specs.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100 text-[11px]"
              >
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <CheckCircle2 size={13} className={data.iconText} />
                  <span>{s.label}</span>
                </div>
                <span className="font-bold text-slate-900">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-100">
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

  // On Desktop (>= 1024px): Anchored cleanly below the button cluster with clear space from left cards
  const cardWidth = 325;
  const buttonX = anchorPos ? anchorPos.x : 580;
  const buttonY = anchorPos ? anchorPos.y : 480;

  // Left feature cards end around X = 450px on desktop.
  // Ensure left is at least 485px so it NEVER touches the left column cards.
  let left = Math.max(485, Math.min(buttonX - 60, screenW - cardWidth - 30));
  // Safely anchor below button without running off bottom
  let top = Math.min(buttonY + 28, screenH - 290);

  return (
    <div
      className="absolute z-40 pointer-events-auto animate-in fade-in zoom-in-95 duration-250"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${cardWidth}px`,
      }}
    >
      {/* Popover Card */}
      <div
        className="relative w-full rounded-2xl bg-white/95 border border-slate-200/90 shadow-[0_24px_64px_rgba(0,0,0,0.18)] p-4 flex flex-col gap-3 backdrop-blur-xl transition-all"
        style={{
          boxShadow: `0 24px 60px -10px ${data.glowColor}, 0 0 0 1px rgba(255, 255, 255, 0.9)`,
        }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl ${data.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
              {renderIcon()}
            </div>
            <div className="flex flex-col">
              <span className={`text-[9.5px] font-black tracking-widest uppercase ${data.badgeText}`}>
                {data.badge}
              </span>
              <span className="text-base font-black text-slate-900 tracking-tight leading-none mt-0.5">
                {data.title}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Subtitle & Description */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-700">
            {data.subtitle}
          </span>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {data.description}
          </p>
        </div>

        {/* Feature Specs */}
        <div className="flex flex-col gap-1.5 pt-0.5">
          {data.specs.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100 text-[11px]"
            >
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <CheckCircle2 size={13} className={data.iconText} />
                <span>{s.label}</span>
              </div>
              <span className="font-bold text-slate-900">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-100">
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
