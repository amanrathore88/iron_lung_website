import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import deviceImage from '../assets/ironlung-device.png';

export const DeviceAnatomySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Animating Image Properties based on scroll mapping
  // Frame 1: 0 - 0.25 (Default/Display Focus)
  // Frame 2: 0.35 - 0.60 (Middle Hub Focus)
  // Frame 3: 0.70 - 1.00 (Bottom UV Chamber Focus)

  // Zooming in closer for more detail
  const scale = useTransform(scrollYProgress, 
    [0, 0.2, 0.35, 0.55, 0.7, 1], 
    [1.1, 1.6, 1.6, 1.9, 1.9, 2.1]
  );
  
  // Changing translations to focus on different quadrants
  const y = useTransform(scrollYProgress, 
    [0, 0.2, 0.35, 0.55, 0.7, 1], 
    ["10%", "25%", "25%", "0%", "0%", "-35%"]
  );

  const x = useTransform(scrollYProgress, 
    [0, 0.2, 0.35, 0.55, 0.7, 1], 
    ["10%", "15%", "15%", "5%", "5%", "-10%"]
  );

  // Crossfade opacities for text sections
  const opacity1 = useTransform(scrollYProgress, [0, 0.15, 0.25, 0.32], [0, 1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.62], [0, 1, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.65, 0.75, 0.9, 1], [0, 1, 1, 1]); 
  
  const blur1 = useTransform(scrollYProgress, [0, 0.15, 0.25, 0.32], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]);
  const blur2 = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.62], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]);
  const blur3 = useTransform(scrollYProgress, [0.65, 0.75, 0.9, 1], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(0px)"]);

  const yOffset1 = useTransform(scrollYProgress, [0, 0.15, 0.25, 0.32], [40, 0, 0, -40]);
  const yOffset2 = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.62], [40, 0, 0, -40]);
  const yOffset3 = useTransform(scrollYProgress, [0.65, 0.75, 0.9, 1], [40, 0, 0, 0]);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-background">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ff6900]/10 via-background to-background pointer-events-none" />

        {/* Dynamic Image Overlay */}
        <motion.div 
          style={{ scale, x, y }}
          className="absolute inset-0 flex items-center justify-center transition-transform transform-gpu will-change-transform"
        >
          <img 
            src={deviceImage} 
            alt="Iron Lung Device Anatomy" 
            className="h-[80vh] 2xl:h-[88vh] 3xl:h-[92vh] w-auto object-contain opacity-60 md:opacity-95 drop-shadow-2xl"
          />
        </motion.div>

        {/* Gradient mask for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent w-full md:w-3/5" />

        {/* Text Content */}
        <div className="relative z-10 w-full max-w-7xl 2xl:max-w-[1400px] 3xl:max-w-[1640px] 4xl:max-w-[1840px] 5xl:max-w-[2200px] mx-auto px-6 md:px-10 h-full flex flex-col justify-center">
          
          <div className="inline-flex items-center gap-2 font-mono text-[10px] 2xl:text-xs tracking-[0.3em] uppercase text-[#ff6900] font-semibold mb-12 2xl:mb-16">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
            Master Every Detail
          </div>
          
          <div className="relative w-full md:w-1/2 h-64 2xl:h-80 3xl:h-96 flex items-center">
            
            {/* View 1: Display */}
            <motion.div 
              style={{ opacity: opacity1, y: yOffset1, filter: blur1 }}
              className="absolute inset-x-0"
            >
              <h3 className="text-5xl md:text-6xl 2xl:text-7xl 3xl:text-8xl font-display font-bold tracking-tight mb-6 text-foreground">
                The Display <br/><span className="text-[#ff6900]">Interface</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg 2xl:text-xl 3xl:text-2xl max-w-md 2xl:max-w-xl 3xl:max-w-2xl font-body">
                22-inch interactive touchscreen providing real-time biometric feedback and customizable workout protocols. Designed for extreme clarity under intense training conditions.
              </p>
            </motion.div>

            {/* View 2: Hub */}
            <motion.div 
              style={{ opacity: opacity2, y: yOffset2, filter: blur2 }}
              className="absolute inset-x-0"
            >
              <h3 className="text-5xl md:text-6xl 2xl:text-7xl 3xl:text-8xl font-display font-bold tracking-tight mb-6 text-foreground">
                Smart Card <br/><span className="text-[#ff6900]">Hub</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg 2xl:text-xl 3xl:text-2xl max-w-md 2xl:max-w-xl 3xl:max-w-2xl font-body">
                Contactless RFID sensor reads encrypted athlete profiles in under 200ms. Stores lung volume baselines, personal resistance thresholds, and progression histories.
              </p>
            </motion.div>

            {/* View 3: UV Chamber */}
            <motion.div 
              style={{ opacity: opacity3, y: yOffset3, filter: blur3 }}
              className="absolute inset-x-0"
            >
              <h3 className="text-5xl md:text-6xl 2xl:text-7xl 3xl:text-8xl font-display font-bold tracking-tight mb-6 text-foreground">
                UV-C <br/><span className="text-[#ff6900]">Chamber</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg 2xl:text-xl 3xl:text-2xl max-w-md 2xl:max-w-xl 3xl:max-w-2xl font-body">
                Automated 254nm UV-C exposure chamber cycle eliminates internal airborne pathogens and moisture residue between training intervals.
              </p>
            </motion.div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-6 md:left-10 flex flex-row items-center gap-4">
          <div className="w-[2px] h-12 bg-border overflow-hidden relative rounded-full">
            <motion.div 
              className="absolute top-0 left-0 w-full h-1/2 bg-[#ff6900]"
              animate={{
                y: ["-100%", "200%"]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground rotate-180" style={{ writingMode: 'vertical-rl' }}>
            System Scan Exploring
          </span>
        </div>

      </div>
    </section>
  );
};

export default DeviceAnatomySection;
