import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Monitor, Wind, Sun, Smartphone, Sliders, ShieldCheck, Activity, Zap } from 'lucide-react';
import ironlungDeviceImg from '../assets/ironlung-device.png';

export const featuresList = [
  {
    title: 'Personalized Training Profiles',
    icon: Brain,
  },
  {
    title: '22-inch Interactive Touchscreen',
    icon: Monitor,
  },
  {
    title: 'Ergonomic Air-flow Seating',
    icon: Wind,
  },
  {
    title: 'Automatic UV Sanitization',
    icon: Sun,
  },
  {
    title: 'Seamless App Integration',
    icon: Smartphone,
  },
  {
    title: '5 Dynamic Intensity Modes',
    icon: Sliders,
  },
  {
    title: 'Real-time Biometric Tracking',
    icon: Activity,
  },
  {
    title: 'High-Precision Sensors',
    icon: ShieldCheck,
  },
  {
    title: 'Continuous Power Supply',
    icon: Zap,
  }
];

export interface DeviceSpecsSectionProps {
  onReserve?: () => void;
  reserveUrl?: string;
}

export const DeviceSpecsSection: React.FC<DeviceSpecsSectionProps> = ({
  onReserve,
  reserveUrl = "#contact"
}) => {
  return (
    <section className="py-24 px-4 bg-secondary/30 border-t border-border text-foreground flex flex-col items-center justify-center font-sans">
      <div className="text-center mb-16 max-w-xl mx-auto">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#ff6900] font-semibold mb-3 inline-block">
          Complete Package
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-display text-foreground mb-4">
          Compare The Lineup
        </h2>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
          Hardware specifications, chassis dimensions, and verified power ratings for the Iron Lung Series 01 station.
        </p>
      </div>

      <div className="w-full max-w-md flex flex-col">
        {/* Card Container in premium offwhite */}
        <div className="bg-card rounded-2xl border border-border shadow-soft-depth flex flex-col overflow-hidden">
          {/* Header */}
          <div className="pt-12 px-8 pb-8 flex flex-col items-center text-center bg-background/50">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff6900]/10 border border-[#ff6900]/20 text-[#ff6900] font-mono text-xs uppercase tracking-widest mb-4">
              Flagship Edition
            </div>
            <h3 className="text-2xl md:text-3xl tracking-[0.3em] font-bold text-foreground mb-3 uppercase font-display">
               I R O N <span className="text-[#ff6900]">L U N G</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-xs font-body">
              Includes Iron Lung Device, 12-month Pro subscription, professional white-glove installation, and comprehensive service package.
            </p>
            
            <div className="w-48 h-48 mb-8 flex items-center justify-center relative group">
               {/* Decorative light effect behind the device */}
               <div className="absolute inset-0 bg-[#ff6900]/15 blur-[45px] rounded-full" />
               <img 
                 src={ironlungDeviceImg} 
                 alt="Iron Lung Device"
                 className="relative z-10 max-w-full max-h-full object-contain drop-shadow-lg transition-all duration-500 group-hover:scale-105"
               />
            </div>

            <div className="text-lg font-bold text-foreground mb-6 font-display">
              MRP ₹ 4,99,000 <br/>
              <span className="font-normal text-muted-foreground lowercase text-xs font-body">inclusive of all taxes</span>
            </div>

            {onReserve ? (
              <button 
                type="button"
                onClick={onReserve}
                className="w-full py-4 bg-[#ff6900] hover:bg-[#ff6900]/90 text-white text-sm font-bold tracking-widest uppercase rounded-lg shadow-lg shadow-[#ff6900]/25 transition-all flex items-center justify-center gap-2 text-center cursor-pointer"
              >
                RESERVE YOURS
              </button>
            ) : (
              <a 
                href={reserveUrl}
                className="w-full py-4 bg-[#ff6900] hover:bg-[#ff6900]/90 text-white text-sm font-bold tracking-widest uppercase rounded-lg shadow-lg shadow-[#ff6900]/25 transition-all flex items-center justify-center gap-2 text-center cursor-pointer"
              >
                RESERVE YOURS
              </a>
            )}
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-border" />

          {/* Feature List */}
          <div className="py-10 flex flex-col gap-8 bg-card">
            {featuresList.map((f, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
                 transition={{ delay: i * 0.04, duration: 0.4 }}
                 className="flex flex-col items-center justify-center text-center px-8"
               >
                  <div className="w-10 h-10 rounded-full bg-[#ff6900]/10 border border-[#ff6900]/20 flex items-center justify-center mb-3">
                    <f.icon className="w-5 h-5 text-[#ff6900] stroke-[1.75]" />
                  </div>
                  <span className="text-sm md:text-base text-foreground font-semibold tracking-tight">
                    {f.title}
                  </span>
               </motion.div>
            ))}

            {/* Divider */}
            <div className="w-full h-[1px] bg-border my-2" />

            {/* Other Specs */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center text-center px-8 pt-2"
            >
              <span className="text-sm font-bold uppercase tracking-wider text-foreground mb-3 font-display">
                Other Specifications
              </span>
              <span className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-[280px] font-mono">
                Dimension : 220 cm (L) × 90 cm (W) × 110 cm (H)
                <br/>
                Weight : 145 kg
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeviceSpecsSection;
