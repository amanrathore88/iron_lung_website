import React, { useState, useEffect, useRef } from 'react';
import { HeroNavbar } from './components/layout/HeroNavbar';
import { LandingBottomSections } from './components/layout/LandingBottomSections';
import { StudioRoomBackground } from './components/sections/hero/StudioRoomBackground';
import { Hero3DCanvas } from './components/sections/hero/Hero3DCanvas';
import { HeroOverlay } from './components/sections/hero/HeroOverlay';
import { ScrollyFeaturesOverlay } from './components/sections/features/ScrollyFeaturesOverlay';
import { AboutSectionOverlay } from './components/sections/about/AboutSectionOverlay';
import { DashboardSectionOverlay } from './components/sections/dashboard/DashboardSectionOverlay';
import { VideoModal } from './components/modals/VideoModal';
import { TechnologyPage } from './pages/TechnologyPage';
import { AboutPage } from './pages/AboutPage';
import { BookDemoPage } from './pages/BookDemoPage';
import { ContactPage } from './pages/ContactPage';

export type AppView = 'home' | 'technology' | 'about' | 'book-demo' | 'contact';

export const App: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      if (
        hash.includes('technology') ||
        pathname.includes('technology') ||
        hash.includes('how-it-works') ||
        pathname.includes('how-it-works')
      ) {
        return 'technology';
      }
      if (hash.includes('about') || pathname.includes('about')) {
        return 'about';
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

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const scrollyTrackRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);
  const mobileStageIndexRef = useRef<number>(0);
  const isSnapAnimatingRef = useRef<boolean>(false);
  const snapAnimFrameRef = useRef<number | null>(null);
  const snapCooldownUntilRef = useRef<number>(0);
  const animateMobileSnapRef = useRef<((targetIdx: number, fromIdx?: number) => void) | null>(null);

  // Sync browser back/forward and hash changes
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      if (
        hash.includes('technology') ||
        pathname.includes('technology') ||
        hash.includes('how-it-works') ||
        pathname.includes('how-it-works')
      ) {
        setCurrentView('technology');
      } else if (hash.includes('about') || pathname.includes('about')) {
        setCurrentView('about');
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

    // Ordered mobile snap stops strictly from Hero (Stage 0) to About Us (Stage 4).
    // Everything below About Us (progress > 0.835: Dashboard Intro, Desktop Mockup, Phone Mockup,
    // Partners & Footer) uses normal native free scrolling.
    const MOBILE_STAGE_STOPS = [
      { restP: 0.00,  downStartP: 0.125, upStartP: 0.00,  durationMs: 1050 }, // 0: Hero Section
      { restP: 0.255, downStartP: 0.355, upStartP: 0.25,  durationMs: 1050 }, // 1: Feature 01 (Smart Touch Screen)
      { restP: 0.475, downStartP: 0.575, upStartP: 0.47,  durationMs: 1000 }, // 2: Feature 02 (UV Sanitization)
      { restP: 0.695, downStartP: 0.720, upStartP: 0.685, durationMs: 1000 }, // 3: Feature 03 (Ergonomic Chair)
      { restP: 0.835, downStartP: 0.835, upStartP: 0.815, durationMs: 980 },  // 4: About Us (Our Story)
    ];
    const LAST_SNAP_STAGE = MOBILE_STAGE_STOPS.length - 1; // 4 (About Us)
    const BELOW_ABOUT_STAGE = LAST_SNAP_STAGE + 1;         // 5 (Free native scroll zone below About Us)

    const findNearestStageIndex = (progress: number): number => {
      if (progress > 0.85) return BELOW_ABOUT_STAGE;
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < MOBILE_STAGE_STOPS.length; i++) {
        const dist = Math.abs(progress - MOBILE_STAGE_STOPS[i].restP);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }
      return bestIdx;
    };

    const animateMobileSnapToStage = (targetIdx: number, explicitFromIdx?: number) => {
      const track = scrollyTrackRef.current;
      if (!track) return;
      const trackTop = track.offsetTop;
      const trackSpan = track.offsetHeight - window.innerHeight;
      if (trackSpan <= 0) return;

      const clampedTarget = Math.max(0, Math.min(LAST_SNAP_STAGE, targetIdx));
      const fromIdx = explicitFromIdx !== undefined ? explicitFromIdx : mobileStageIndexRef.current;

      if (snapAnimFrameRef.current !== null) {
        cancelAnimationFrame(snapAnimFrameRef.current);
        snapAnimFrameRef.current = null;
      }

      mobileStageIndexRef.current = clampedTarget;
      isSnapAnimatingRef.current = true;

      const durationMs = MOBILE_STAGE_STOPS[clampedTarget].durationMs;
      const startTime = performance.now();
      snapCooldownUntilRef.current = startTime + durationMs + 60;

      const targetP = MOBILE_STAGE_STOPS[clampedTarget].restP;
      let startP = scrollProgressRef.current;

      if (clampedTarget === fromIdx + 1 && fromIdx >= 0 && fromIdx < MOBILE_STAGE_STOPS.length) {
        startP = Math.max(startP, MOBILE_STAGE_STOPS[fromIdx].downStartP);
      } else if (clampedTarget === fromIdx - 1 && fromIdx >= 0 && fromIdx < MOBILE_STAGE_STOPS.length) {
        startP = Math.min(startP, MOBILE_STAGE_STOPS[fromIdx].upStartP);
      }

      const stepStage = (now: number) => {
        const t = Math.min(1, (now - startTime) / durationMs);
        // Smooth sinusoidal ease-in-out: paces the mid-transition window evenly so the
        // 3D model's rotation, zoom, and framing changes are clearly visible across the full transition
        const ease = 0.5 - 0.5 * Math.cos(Math.PI * t);
        const curP = startP + (targetP - startP) * ease;
        scrollProgressRef.current = curP;
        setScrollProgress(curP);
        window.scrollTo({
          top: trackTop + curP * trackSpan,
          behavior: 'instant' as ScrollBehavior,
        });

        if (t < 1) {
          snapAnimFrameRef.current = requestAnimationFrame(stepStage);
        } else {
          scrollProgressRef.current = targetP;
          setScrollProgress(targetP);
          window.scrollTo({
            top: trackTop + targetP * trackSpan,
            behavior: 'instant' as ScrollBehavior,
          });
          // Release lock on the following animation frame so any queued native scroll event
          // from the final instant scrollTo is ignored by handleScroll.
          snapAnimFrameRef.current = requestAnimationFrame(() => {
            isSnapAnimatingRef.current = false;
            snapAnimFrameRef.current = null;
          });
        }
      };

      snapAnimFrameRef.current = requestAnimationFrame(stepStage);
    };

    animateMobileSnapRef.current = animateMobileSnapToStage;

    let ticking = false;
    let lastRawProgress = scrollProgressRef.current;

    const handleScroll = () => {
      if (isSnapAnimatingRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (isSnapAnimatingRef.current) {
            ticking = false;
            return;
          }
          const scrollY = window.scrollY;
          const track = scrollyTrackRef.current;
          if (track) {
            const trackTop = track.offsetTop;
            const trackSpan = track.offsetHeight - window.innerHeight;
            if (trackSpan > 0) {
              const progress = Math.min(1, Math.max(0, (scrollY - trackTop) / trackSpan));

              if (window.innerWidth < 768) {
                // When scrolling UP natively from below About Us (progress > 0.84) back into About Us (<= 0.84),
                // pause cleanly at About Us (0.835) so upward scroll momentum doesn't fly past About Us into Feature 03.
                if (lastRawProgress > 0.84 && progress <= 0.84) {
                  const aboutP = MOBILE_STAGE_STOPS[LAST_SNAP_STAGE].restP;
                  lastRawProgress = aboutP;
                  scrollProgressRef.current = aboutP;
                  setScrollProgress(aboutP);
                  mobileStageIndexRef.current = LAST_SNAP_STAGE;
                  snapCooldownUntilRef.current = performance.now() + 380;
                  window.scrollTo({
                    top: trackTop + aboutP * trackSpan,
                    behavior: 'instant' as ScrollBehavior,
                  });
                  ticking = false;
                  return;
                }

                mobileStageIndexRef.current = findNearestStageIndex(progress);
              }

              lastRawProgress = progress;
              scrollProgressRef.current = progress;
              setScrollProgress(progress);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Helper: check if touch target is inside an element with active vertical overflow
    const canScrollInnerContainer = (target: EventTarget | null, dy: number): boolean => {
      let el = target as HTMLElement | null;
      while (el && el !== document.body && el !== document.documentElement) {
        const style = window.getComputedStyle(el);
        if (
          (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
          el.scrollHeight > el.clientHeight + 8
        ) {
          if (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 4) return true;
          if (dy < 0 && el.scrollTop > 4) return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    // Mobile Touch Step-Snapper: active strictly between Hero (Stage 0) and About Us (Stage 4)
    let touchStartX = 0;
    let touchStartY = 0;
    let ignoreTouchGesture = false;
    let touchGestureConsumed = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.innerWidth >= 768 || e.touches.length === 0) return;
      const targetEl = e.target as HTMLElement | null;
      if (targetEl?.closest('header') || targetEl?.closest('[role="dialog"]')) {
        ignoreTouchGesture = true;
        return;
      }
      ignoreTouchGesture = false;
      touchGestureConsumed = false;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;

      if (!isSnapAnimatingRef.current) {
        mobileStageIndexRef.current = findNearestStageIndex(scrollProgressRef.current);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.innerWidth >= 768 || ignoreTouchGesture || e.touches.length === 0) return;

      const dy = touchStartY - e.touches[0].clientY; // > 0 means scrolling down, < 0 means scrolling up
      const dx = touchStartX - e.touches[0].clientX;

      // Below About Us (stage 5) or scrolling DOWN from About Us (stage 4 + dy > 0):
      // allow 100% free native browser scrolling.
      if (
        mobileStageIndexRef.current === BELOW_ABOUT_STAGE ||
        scrollProgressRef.current > 0.85 ||
        (mobileStageIndexRef.current === LAST_SNAP_STAGE && dy > 0)
      ) {
        return;
      }

      // Allow native pull-to-refresh / overscroll at the very top of Hero
      if (mobileStageIndexRef.current === 0 && window.scrollY <= 4 && dy < 0) {
        return;
      }

      // Allow inner scrollable container if it has remaining scroll room
      if (canScrollInnerContainer(e.target, dy)) {
        return;
      }

      if (Math.abs(dy) >= Math.abs(dx) * 0.6) {
        // Prevent uncontrolled native momentum fling between Hero and About Us
        if (e.cancelable) {
          e.preventDefault();
        }

        if (!touchGestureConsumed && Math.abs(dy) >= 15) {
          const now = performance.now();
          if (!isSnapAnimatingRef.current && now >= snapCooldownUntilRef.current) {
            touchGestureConsumed = true;
            const dir = dy > 0 ? 1 : -1;
            const fromIdx = Math.min(LAST_SNAP_STAGE, mobileStageIndexRef.current);
            const nextIdx = Math.max(0, Math.min(LAST_SNAP_STAGE, fromIdx + dir));
            if (nextIdx !== fromIdx) {
              animateMobileSnapToStage(nextIdx, fromIdx);
            }
          }
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (
        window.innerWidth >= 768 ||
        ignoreTouchGesture ||
        touchGestureConsumed ||
        e.changedTouches.length === 0
      ) {
        return;
      }

      const dy = touchStartY - e.changedTouches[0].clientY;
      const dx = touchStartX - e.changedTouches[0].clientX;

      if (
        mobileStageIndexRef.current === BELOW_ABOUT_STAGE ||
        scrollProgressRef.current > 0.85 ||
        (mobileStageIndexRef.current === LAST_SNAP_STAGE && dy > 0)
      ) {
        return;
      }

      if (Math.abs(dy) >= 12 && Math.abs(dy) > Math.abs(dx)) {
        const now = performance.now();
        if (!isSnapAnimatingRef.current && now >= snapCooldownUntilRef.current) {
          touchGestureConsumed = true;
          const dir = dy > 0 ? 1 : -1;
          const fromIdx = Math.min(LAST_SNAP_STAGE, mobileStageIndexRef.current);
          const nextIdx = Math.max(0, Math.min(LAST_SNAP_STAGE, fromIdx + dir));
          if (nextIdx !== fromIdx) {
            animateMobileSnapToStage(nextIdx, fromIdx);
          }
        }
      }
    };

    // Mobile Wheel Step-Snapper (for Chrome DevTools mobile emulation & trackpads)
    // Strictly active between Hero (Stage 0) and About Us (Stage 4)
    let lastWheelTime = 0;
    let lastWheelAbsDelta = 0;

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth >= 768) return;
      const targetEl = e.target as HTMLElement | null;
      if (targetEl?.closest('header') || targetEl?.closest('[role="dialog"]')) return;

      const dy = e.deltaY;

      // Below About Us or scrolling DOWN from About Us: allow 100% free native scrolling
      if (
        mobileStageIndexRef.current === BELOW_ABOUT_STAGE ||
        scrollProgressRef.current > 0.85 ||
        (mobileStageIndexRef.current === LAST_SNAP_STAGE && dy > 0)
      ) {
        return;
      }

      if (mobileStageIndexRef.current === 0 && window.scrollY <= 4 && dy < 0) {
        return;
      }
      if (canScrollInnerContainer(e.target, dy)) {
        return;
      }

      if (e.cancelable) {
        e.preventDefault();
      }

      const absDy = Math.abs(dy);
      if (absDy < 8) return;

      const now = performance.now();
      const timeSinceLastWheel = now - lastWheelTime;
      const isNewWheelGesture = timeSinceLastWheel > 140 || absDy > lastWheelAbsDelta * 1.6;
      lastWheelTime = now;
      lastWheelAbsDelta = absDy;

      if (isSnapAnimatingRef.current || now < snapCooldownUntilRef.current || !isNewWheelGesture) {
        return;
      }

      const dir = dy > 0 ? 1 : -1;
      const fromIdx = Math.min(LAST_SNAP_STAGE, mobileStageIndexRef.current);
      const nextIdx = Math.max(0, Math.min(LAST_SNAP_STAGE, fromIdx + dir));
      if (nextIdx !== fromIdx) {
        animateMobileSnapToStage(nextIdx, fromIdx);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    handleScroll();

    return () => {
      if (snapAnimFrameRef.current !== null) cancelAnimationFrame(snapAnimFrameRef.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentView]);

  const scrollToStage = (stageVal: number | 'hero' | 'screen' | 'uv' | 'comfort' | 'about' | 'dashboard') => {
    const track = scrollyTrackRef.current;
    if (track) {
      const trackTop = track.offsetTop;
      const trackSpan = track.offsetHeight - window.innerHeight;

      if (window.innerWidth < 768 && animateMobileSnapRef.current && stageVal !== 'dashboard' && typeof stageVal !== 'number') {
        let targetIdx = 0;
        if (stageVal === 'hero') targetIdx = 0;
        else if (stageVal === 'screen') targetIdx = 1;
        else if (stageVal === 'uv') targetIdx = 2;
        else if (stageVal === 'comfort') targetIdx = 3;
        else if (stageVal === 'about') targetIdx = 4;
        animateMobileSnapRef.current(targetIdx, Math.min(4, mobileStageIndexRef.current));
        return;
      }

      let targetProgress = 0;
      if (typeof stageVal === 'number') {
        targetProgress = stageVal;
      } else if (stageVal === 'hero') {
        targetProgress = 0;
      } else if (stageVal === 'screen') {
        targetProgress = 0.28;
      } else if (stageVal === 'uv') {
        targetProgress = 0.50;
      } else if (stageVal === 'comfort') {
        targetProgress = 0.72;
      } else if (stageVal === 'about') {
        targetProgress = 0.84;
      } else if (stageVal === 'dashboard') {
        targetProgress = 0.96;
      }

      window.scrollTo({
        top: trackTop + targetProgress * trackSpan,
        behavior: 'smooth',
      });
    }
  };

  const handleNavigation = (section: 'hero' | 'screen' | 'uv' | 'comfort' | 'dashboard' | 'about' | 'how-it-works' | 'book-demo' | 'contact' | 'technology') => {
    if (section === 'technology' || section === 'how-it-works') {
      if (currentView !== 'technology') {
        window.history.pushState(null, '', '#how-it-works');
        setCurrentView('technology');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (section === 'about') {
      if (currentView !== 'about') {
        window.history.pushState(null, '', '#about');
        setCurrentView('about');
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
        else if (section === 'dashboard') scrollToStage('dashboard');
      }, 60);
      return;
    }

    if (section === 'hero') scrollToStage('hero');
    else if (section === 'screen') scrollToStage('screen');
    else if (section === 'uv') scrollToStage('uv');
    else if (section === 'comfort') scrollToStage('comfort');
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
      ) : currentView === 'about' ? (
        <AboutPage
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
              scrollProgress > 0.90
                ? 'dashboard'
                : scrollProgress > 0.78
                ? 'about'
                : scrollProgress > 0.60
                ? 'comfort'
                : scrollProgress > 0.18
                ? 'screen'
                : 'hero'
            }
          />

          {/* Multi-Stage Scrollytelling Track (h-[1080vh] on mobile, h-[1040vh] on desktop: 3D model flight, feature scrollytelling, About Us, Desktop & Phone Dashboard) */}
          <div ref={scrollyTrackRef} className="relative h-[1080vh] md:h-[1040vh] w-full">
            {/* Sticky 100dvh Viewport Pin (dynamically adapts to mobile browser URL bar) */}
            <div className={`sticky top-0 h-[100dvh] w-full overflow-hidden bg-white ${scrollProgress < 0.825 ? 'max-md:touch-none' : ''}`}>
              {/* Layer 0 (z-0): Studio Room Background */}
              <StudioRoomBackground scrollProgress={scrollProgress} />

              {/* Layer 1 (z-[10]): Editorial About Us Section Overlay (media_1790142628076.png) */}
              <AboutSectionOverlay
                scrollProgress={scrollProgress}
                onOpenVideo={() => setIsVideoModalOpen(true)}
              />

              {/* Layer 2 (z-[15]): Prominent Centered Tagline: YOUR DASHBOARD AWAITS (Popcorn Pop Animation) */}
              <DashboardSectionOverlay
                scrollProgress={scrollProgress}
              />

              {/* Layer 3 (z-[20]): Real-time WebGL 3D Interactive Model Canvas (Transparent canvas, 3D model sweeps over layers) */}
              <Hero3DCanvas scrollProgress={scrollProgress} />

              {/* Layer 4 (z-[30]): Hero Section Overlay (Stage 0: Fades out as user scrolls) */}
              <HeroOverlay
                onDiscover={() => scrollToStage('screen')}
                onOpenVideo={() => setIsVideoModalOpen(true)}
                scrollProgress={scrollProgress}
              />

              {/* Layer 4 (z-[30]): Scrollytelling Feature Overlays (Stage 1: Touch Screen, Stage 2: UV Sanitization, Stage 3: Ergonomic Chair) */}
              <ScrollyFeaturesOverlay
                scrollProgress={scrollProgress}
                onExploreScreen={() => scrollToStage('screen')}
                onExploreUV={() => scrollToStage('uv')}
                onExploreChair={() => scrollToStage('comfort')}
              />
            </div>
          </div>

          {/* Landing Page Bottom Sections (CTA, Partners Marquee & Cinematic Footer) */}
          <LandingBottomSections onBookDemo={() => handleNavigation('book-demo')} />
        </>
      )}

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
};

export default App;
