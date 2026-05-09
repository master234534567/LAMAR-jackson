import { useEffect, useState, useCallback } from 'react';
import FoamFingerCursor from './components/FoamFingerCursor';
import ScrollProgress from './components/ScrollProgress';
import IntroScreen from './components/IntroScreen';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import StatsTicker from './components/StatsTicker';
import StatsCards from './components/StatsCards';
import GoatMeter from './components/GoatMeter';
import Timeline from './components/Timeline';
import FilterCards from './components/FilterCards';
import CareerMap from './components/CareerMap';
import WeatherWidget from './components/WeatherWidget';
import EasterEggs from './components/EasterEggs';
import AchievementToast, { useAchievements } from './components/AchievementToast';
import DevBadge from './components/DevBadge';
import Footer from './components/Footer';
import Confetti from './components/Confetti';
import { printConsoleArt } from './utils/consoleArt';
import { getUnlocked } from './utils/achievements';

const INTRO_KEY = 'lj8_intro_seen';

export default function App() {
  const [showIntro, setShowIntro] = useState(false);
  const [siteReady, setSiteReady] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const { queue, dismiss, showToast } = useAchievements();

  useEffect(() => {
    printConsoleArt();
    const seen = localStorage.getItem(INTRO_KEY);
    if (!seen) {
      setShowIntro(true);
    } else {
      setSiteReady(true);
    }
  }, []);

  const handleIntroComplete = useCallback(() => {
    localStorage.setItem(INTRO_KEY, '1');
    setShowIntro(false);
    setSiteReady(true);
  }, []);

  useEffect(() => {
    if (!siteReady) return;
    const check = () => {
      const unlocked = getUnlocked();
      if (unlocked.has('franchise') && !confettiActive) {
        setConfettiActive(true);
        showToast('🏆', 'The Franchise', 'unlocked all achievements');
        setTimeout(() => setConfettiActive(false), 5000);
      }
    };
    const interval = setInterval(check, 2000);
    return () => clearInterval(interval);
  }, [siteReady, confettiActive, showToast]);

  const handleEasterToast = (icon: string, title: string, desc: string) => {
    showToast(icon, title, desc);
  };

  return (
    <>
      <FoamFingerCursor />

      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}

      {siteReady && (
        <div style={{ position: 'relative' }}>
          <ScrollProgress />
          <GoatMeter />
          <DevBadge />

          <main>
            <Hero />
            <Gallery />
            <StatsTicker />
            <StatsCards />

            <div style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,184,0,0.2), transparent)',
              margin: '0 8%',
            }} />

            <Timeline />

            <div style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(123,47,190,0.2), transparent)',
              margin: '0 8%',
            }} />

            <FilterCards />

            <CareerMap />

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '0 clamp(20px, 5vw, 80px) 80px',
            }}>
              <WeatherWidget />
            </div>
          </main>

          <Footer />
        </div>
      )}

      <EasterEggs onToast={handleEasterToast} />
      <AchievementToast queue={queue} onDismiss={dismiss} />
      <Confetti active={confettiActive} />
    </>
  );
}
