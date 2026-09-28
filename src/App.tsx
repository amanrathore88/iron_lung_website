import React, { useState, useEffect, useRef } from 'react';
import { HeroNavbar } from './components/HeroNavbar';
import { StudioRoomBackground } from './components/StudioRoomBackground';
import { Hero3DCanvas } from './components/Hero3DCanvas';
import { HeroOverlay } from './components/HeroOverlay';
import { ScrollyFeaturesOverlay } from './components/ScrollyFeaturesOverlay';
import { DashboardSectionOverlay } from './components/DashboardSectionOverlay';
import { AboutSectionOverlay } from './components/AboutSectionOverlay';
import { LandingBottomSections } from './components/LandingBottomSections';
import { TechnologyPage } from './components/TechnologyPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { BookDemoPage } from './components/BookDemoPage';
import { ContactPage } from './components/ContactPage';
import { VideoModal } from './components/VideoModal';
import { DemoModal } from './components/DemoModal';

export type AppView = 'home' | 'technology' | 'how-it-works' | 'book-demo' | 'contact';

export const App: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [demoModalState, setDemoModalState] = useState<{
    isOpen: boolean;
    mode: 'demo' | 'contact';
  }>({
    isOpen: false,
    mode: 'demo',
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      if (hash.includes('technology') || pathname.includes('technology')) {
        return 'technology';
      }
      if (hash.includes('how-it-works') || pathname.includes('how-it-works') || hash.includes('features')) {
        return 'how-it-works';
      }
      if (hash.includes('book-demo') || hash.includes('demo') || pathname.includes('book-demo') || pathname.includes('demo')) {
        return 'book-demo';
      }
      if (hash.includes('contact') || pathname.includes('contact')) {
        return 'contact';
      }
    }
    return 'home';
  });

  const [modelProgress, setModelProgress] = useState<number>(0);
  const [dashboardFrameProgress, setDashboardFrameProgress] = useState<number>(0);
  const scrollyTrackRef = useRef<HTMLDivElement>(null);

  // Sync browser back/forward and hash changes
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      if (hash.includes('technology') || pathname.includes('technology')) {
        setCurrentView('technology');
      } else if (hash.includes('how-it-works') || pathname.includes('how-it-works') || hash.includes('features')) {
        setCurrentView('how-it-works');
      } else if (hash.includes('book-demo') || hash.includes('demo') || pathname.includes('book-demo') || pathname.includes('demo')) {
        setCurrentView('book-demo');
      } else if (hash.includes('contact') || pathname.includes('contact')) {
        setCurrentView('contact');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (currentView !== 'home') return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const track = scrollyTrackRef.current;
          if (track) {
            const trackTop = track.offsetTop;
            const vh = window.innerHeight;
            const modelSpan = 6.6 * vh; // 660vh for 3D model & sweep reveal
            const dashboardSpan = 3.0 * vh; // 300vh for video frames scrub
            
            const relY = Math.max(0, scrollY - trackTop);
            const mProgress = Math.min(1, relY / modelSpan);
            setModelProgress(mProgress);

            const frameProgress = Math.min(1, Math.max(0, (relY - modelSpan) / dashboardSpan));
            setDashboardFrameProgress(frameProgress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const scrollToStage = (stageVal: number | 'hero' | 'screen' | 'uv' | 'comfort' | 'about' | 'dashboard') => {
    const track = scrollyTrackRef.current;
    if (track) {
      const trackTop = track.offsetTop;
      const vh = window.innerHeight;
      const modelSpan = 6.6 * vh;
      let targetOffset = 0;

      if (typeof stageVal === 'number') {
        targetOffset = stageVal * modelSpan;
      } else if (stageVal === 'hero') {
        targetOffset = 0;
      } else if (stageVal === 'screen') {
        targetOffset = 0.28 * modelSpan;
      } else if (stageVal === 'uv') {
        targetOffset = 0.50 * modelSpan;
      } else if (stageVal === 'comfort') {
        targetOffset = 0.72 * modelSpan;
      } else if (stageVal === 'about') {
        targetOffset = 0.84 * modelSpan;
      } else if (stageVal === 'dashboard') {
        targetOffset = modelSpan; // At completion of sweep reveal with frame 1 ready
      }

      window.scrollTo({
        top: trackTop + targetOffset,
        behavior: 'smooth',
      });
    }
  };

  const handleNavigation = (section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about' | 'how-it-works' | 'book-demo' | 'contact' | 'technology') => {
    if (section === 'technology') {
      if (currentView !== 'technology') {
        window.history.pushState(null, '', '#technology');
        setCurrentView('technology');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (section === 'how-it-works') {
      if (currentView !== 'how-it-works') {
        window.history.pushState(null, '', '#how-it-works');
        setCurrentView('how-it-works');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (section === 'book-demo') {
      if (currentView !== 'book-demo') {
        window.history.pushState(null, '', '#book-demo');
        setCurrentView('book-demo');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (section === 'contact') {
      if (currentView !== 'contact') {
        window.history.pushState(null, '', '#contact');
        setCurrentView('contact');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Navigating back to home section
    if (currentView !== 'home') {
      window.history.pushState(null, '', '#');
      setCurrentView('home');
      setTimeout(() => {
        if (section === 'hero') scrollToStage('hero');
        else if (section === 'screen') scrollToStage('screen');
        else if (section === 'uv') scrollToStage('uv');
        else if (section === 'comfort') scrollToStage('comfort');
        else if (section === 'about') scrollToStage('about');
        else if (section === 'dashboard') scrollToStage('dashboard');
      }, 60);
      return;
    }

    if (section === 'hero') scrollToStage('hero');
    else if (section === 'screen') scrollToStage('screen');
    else if (section === 'uv') scrollToStage('uv');
    else if (section === 'comfort') scrollToStage('comfort');
    else if (section === 'about') scrollToStage('about');
    else if (section === 'dashboard') scrollToStage('dashboard');
  };

  return (
    <div className="relative bg-white text-slate-900 font-sans select-none">
      {currentView === 'technology' ? (
        <TechnologyPage
          onBookDemo={() => handleNavigation('book-demo')}
          onContactUs={() => handleNavigation('contact')}
          onNavigateSection={handleNavigation}
        />
      ) : currentView === 'how-it-works' ? (
        <HowItWorksPage
          onBookDemo={() => handleNavigation('book-demo')}
          onContactUs={() => handleNavigation('contact')}
          onNavigateSection={handleNavigation}
        />
      ) : currentView === 'book-demo' ? (
        <BookDemoPage
          onContactUs={() => handleNavigation('contact')}
          onNavigateSection={handleNavigation}
        />
      ) : currentView === 'contact' ? (
        <ContactPage
          onBookDemo={() => handleNavigation('book-demo')}
          onNavigateSection={handleNavigation}
        />
      ) : (
        <>
          {/* Fixed Top Brand Navigation */}
          <HeroNavbar
            onBookDemo={() => handleNavigation('book-demo')}
            onContactUs={() => handleNavigation('contact')}
            onNavigateSection={handleNavigation}
            activeSection={
              modelProgress >= 0.88
                ? 'dashboard'
                : modelProgress >= 0.78
                ? 'about'
                : modelProgress >= 0.60
                ? 'comfort'
                : modelProgress >= 0.18
                ? 'screen'
                : 'hero'
            }
          />

          {/* Multi-Stage Scrollytelling Track (h-[1060vh]: 660vh for 3D model & sweep, 300vh for 120-frame video sequence) */}
          <div ref={scrollyTrackRef} className="relative h-[1060vh] w-full">
            {/* Sticky 100vh Viewport Pin */}
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
              {/* Layer 0 (z-0): Studio Room Background */}
              <StudioRoomBackground scrollProgress={modelProgress} />

              {/* Layer 1 (z-[10]): Editorial About Us Section Overlay (media_1790142628076.png) */}
              <AboutSectionOverlay
                scrollProgress={modelProgress}
                onOpenVideo={() => setIsVideoModalOpen(true)}
              />

              {/* Layer 2 (z-[15]): Section 4 User Dashboard Overlay (Synchronized 120-frame video sequence) */}
              <DashboardSectionOverlay
                scrollProgress={modelProgress}
                frameProgress={dashboardFrameProgress}
                onExploreDashboard={() => handleNavigation('book-demo')}
                onOpenVideo={() => setIsVideoModalOpen(true)}
              />

              {/* Layer 3 (z-[20]): Real-time WebGL 3D Interactive Model Canvas (Transparent canvas, 3D model sweeps over layers) */}
              <Hero3DCanvas scrollProgress={modelProgress} />

              {/* Layer 4 (z-[30]): Hero Section Overlay (Stage 0: Fades out as user scrolls) */}
              <HeroOverlay
                onDiscover={() => scrollToStage('screen')}
                onOpenVideo={() => setIsVideoModalOpen(true)}
                scrollProgress={modelProgress}
              />

              {/* Layer 4 (z-[30]): Scrollytelling Feature Overlays (Stage 1: Touch Screen, Stage 2: UV Sanitization, Stage 3: Ergonomic Chair) */}
              <ScrollyFeaturesOverlay
                scrollProgress={modelProgress}
                onExploreScreen={() => scrollToStage('screen')}
                onExploreUV={() => scrollToStage('uv')}
                onExploreChair={() => scrollToStage('comfort')}
              />
            </div>
          </div>

          {/* Landing Page Bottom Sections (Partners Marquee & Cinematic Footer) */}
          <LandingBottomSections />
        </>
      )}

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      {/* VIP Demo & Contact Modal (Available if invoked via modal) */}
      <DemoModal
        isOpen={demoModalState.isOpen}
        mode={demoModalState.mode}
        onClose={() => setDemoModalState({ isOpen: false, mode: 'demo' })}
      />
    </div>
  );
};

export default App;
