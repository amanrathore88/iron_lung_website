import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'demo' | 'contact';
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, mode = 'demo' }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: 'nyc',
    tier: 'executive',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl overflow-hidden bg-[#030B14] border border-white/15 shadow-[0_0_80px_rgba(255,94,30,0.15)] flex flex-col p-5 sm:p-8">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X size={18} />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#FF5E1E] shadow-[0_0_8px_rgba(255,94,30,0.8)]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF5E1E]">
                {mode === 'demo' ? 'Private Reservation' : 'Direct Inquiry'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {mode === 'demo' ? 'Experience IronLung In Person' : 'Connect with Our Specialists'}
            </h2>

            <p className="text-sm text-white/60 mt-2 leading-relaxed">
              Experience the physiological transformation of pure, hyper-baric oxygen flow and Far-UVC germicidal respiration.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Alexander Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#FF5E1E] focus:ring-1 focus:ring-[#FF5E1E] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  Corporate / Personal Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="alexander@vance-longevity.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#FF5E1E] focus:ring-1 focus:ring-[#FF5E1E] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                    Experience Location
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-[#071524] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5E1E]"
                  >
                    <option value="nyc">New York Flagship</option>
                    <option value="london">London Mayfair Suite</option>
                    <option value="tokyo">Tokyo Ginza Lounge</option>
                    <option value="home">Private In-Home VIP Demo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                    Session Tier
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-[#071524] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5E1E]"
                  >
                    <option value="executive">Executive Wellness</option>
                    <option value="athletic">High Performance Athletics</option>
                    <option value="clinical">Clinical Respiratory Care</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#FF5E1E] hover:bg-[#FF7033] text-white font-semibold text-sm shadow-[0_0_30px_rgba(255,94,30,0.5)] transition-all mt-3 hover:scale-[1.01] active:scale-[0.99]"
              >
                Confirm Experience Reservation →
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/40 text-[#00D2FF] flex items-center justify-center mb-5 shadow-[0_0_25px_rgba(0,210,255,0.4)]">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Reservation Confirmed
            </h3>
            <p className="text-sm text-white/70 mt-2 max-w-xs leading-relaxed">
              Thank you, <span className="text-[#FF5E1E] font-medium">{formData.name}</span>. An IronLung Clinical Concierge has been assigned to your private session.
            </p>
            <button
              onClick={handleReset}
              className="mt-6 px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              Return to Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
