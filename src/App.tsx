import React, { useState, useEffect, useRef } from 'react';
import { HeroNavbar } from './components/HeroNavbar';
import { StudioRoomBackground } from './components/StudioRoomBackground';
import { Hero3DCanvas } from './components/Hero3DCanvas';
import { HeroOverlay } from './components/HeroOverlay';
import { ScrollyFeaturesOverlay } from './components/ScrollyFeaturesOverlay';
import { DashboardSectionOverlay } from './components/DashboardSectionOverlay';
import { AboutSectionOverlay } from './components/AboutSectionOverlay';
import { VideoModal } from './components/VideoModal';
import { DemoModal } from './components/DemoModal';

export const App: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [demoModalState, setDemoModalState] = useState<{
    isOpen: boolean;
    mode: 'demo' | 'contact';
  }>({
    isOpen: false,
    mode: 'demo',
  });

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const scrollyTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const track = scrollyTrackRef.current;
          if (track) {
            const trackTop = track.offsetTop;
            const trackSpan = track.offsetHeight - window.innerHeight;
            if (trackSpan > 0) {
              const progress = Math.min(1, Math.max(0, (scrollY - trackTop) / trackSpan));
              setScrollProgress(progress);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToStage = (progress: number) => {
    const track = scrollyTrackRef.current;
    if (track) {
      const trackTop = track.offsetTop;
      const trackSpan = track.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: trackTop + progress * trackSpan,
        behavior: 'smooth',
      });
    }
  };


  const handleNavigation = (section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about') => {
    if (section === 'hero') scrollToStage(0);
    else if (section === 'screen') scrollToStage(0.28);
    else if (section === 'uv') scrollToStage(0.50);
    else if (section === 'comfort') scrollToStage(0.72);
    else if (section === 'about') scrollToStage(0.84);
    else if (section === 'dashboard') scrollToStage(0.98);
  };

  return (
    <div className="relative bg-white text-slate-900 font-sans select-none">
      {/* Fixed Top Brand Navigation */}
      <HeroNavbar
        onBookDemo={() => setDemoModalState({ isOpen: true, mode: 'demo' })}
        onContactUs={() => setDemoModalState({ isOpen: true, mode: 'contact' })}
        onNavigateSection={handleNavigation}
      />

      {/* Multi-Stage Scrollytelling Track (h-[760vh] calibrated for smooth feature transitions, editorial About Us, & cinematic sweep) */}
      <div ref={scrollyTrackRef} className="relative h-[760vh] w-full">
        {/* Sticky 100vh Viewport Pin */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
          {/* Layer 0 (z-0): Studio Room Background */}
          <StudioRoomBackground scrollProgress={scrollProgress} />

          {/* Layer 1 (z-[10]): Editorial About Us Section Overlay (media_1790142628076.png) */}
          <AboutSectionOverlay
            scrollProgress={scrollProgress}
            onOpenVideo={() => setIsVideoModalOpen(true)}
          />

          {/* Layer 2 (z-[15]): Section 4 User Dashboard Overlay (Revealed via soft cloudy mask following 3D model) */}
          <DashboardSectionOverlay
            scrollProgress={scrollProgress}
            onExploreDashboard={() => setDemoModalState({ isOpen: true, mode: 'demo' })}
            onOpenVideo={() => setIsVideoModalOpen(true)}
          />

          {/* Layer 3 (z-[20]): Real-time WebGL 3D Interactive Model Canvas (Transparent canvas, 3D model sweeps over layers) */}
          <Hero3DCanvas scrollProgress={scrollProgress} />

          {/* Layer 4 (z-[30]): Hero Section Overlay (Stage 0: Fades out as user scrolls) */}
          <HeroOverlay
            onDiscover={() => scrollToStage(0.28)}
            onOpenVideo={() => setIsVideoModalOpen(true)}
            scrollProgress={scrollProgress}
          />

          {/* Layer 4 (z-[30]): Scrollytelling Feature Overlays (Stage 1: Touch Screen, Stage 2: UV Sanitization, Stage 3: Ergonomic Chair) */}
          <ScrollyFeaturesOverlay
            scrollProgress={scrollProgress}
            onExploreScreen={() => scrollToStage(0.28)}
            onExploreUV={() => scrollToStage(0.50)}
            onExploreChair={() => scrollToStage(0.72)}
          />
        </div>
      </div>


      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      {/* VIP Demo & Contact Modal */}
      <DemoModal
        isOpen={demoModalState.isOpen}
        mode={demoModalState.mode}
        onClose={() => setDemoModalState({ isOpen: false, mode: 'demo' })}
      />
    </div>
  );
};

export default App;
