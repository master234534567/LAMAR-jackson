import { useEffect, useState } from 'react';
import { playLightningSound } from '../utils/sounds';

interface Props {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<'bolt' | 'number' | 'flash' | 'done'>('bolt');
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    playLightningSound();

    const t1 = setTimeout(() => setPhase('number'), 600);
    const t2 = setTimeout(() => setPhase('flash'), 1400);
    const t3 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 2000);
    const t4 = setTimeout(() => setShowSkip(true), 1000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <div className="intro-overlay">
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, background: '#000' }} />

      {/* Flash overlay */}
      {phase === 'flash' && (
        <div
          style={{
            position: 'absolute', inset: 0,
            background: '#fff',
            animation: 'white-flash 0.6s ease forwards',
            zIndex: 10,
          }}
        />
      )}

      {/* Lightning bolt */}
      {(phase === 'bolt' || phase === 'number') && (
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'bolt-strike 1s ease forwards',
          zIndex: 5,
        }}>
          <svg width="60" height="200" viewBox="0 0 60 200" fill="none">
            <path
              d="M35 0L5 90H28L20 200L58 95H34L35 0Z"
              fill="#FFB800"
            />
            <path
              d="M35 0L5 90H28L20 200L58 95H34L35 0Z"
              fill="rgba(255,184,0,0.6)"
              style={{ filter: 'blur(12px)' }}
            />
          </svg>
        </div>
      )}

      {/* #8 number */}
      {phase === 'number' && (
        <div
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'Bebas Neue, cursive',
            fontSize: 'clamp(120px, 25vw, 280px)',
            color: '#FFB800',
            textShadow: '0 0 60px rgba(255,184,0,0.9), 0 0 120px rgba(255,184,0,0.5)',
            animation: 'number-slam 0.6s ease forwards',
            zIndex: 8,
            lineHeight: 1,
          }}
        >
          #8
        </div>
      )}

      {/* Skip button */}
      {showSkip && (
        <button
          onClick={onComplete}
          style={{
            position: 'absolute', bottom: '40px', right: '40px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '100px',
            color: '#A0A0A0',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8rem',
            padding: '8px 18px',
            zIndex: 20,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.color = '#fff'; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.color = '#A0A0A0'; }}
        >
          SKIP
        </button>
      )}
    </div>
  );
}
