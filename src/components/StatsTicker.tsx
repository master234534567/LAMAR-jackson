import { useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface StatItem {
  label: string;
  value: string | number;
  suffix?: string;
  isSpecial?: boolean;
}

const STATS: StatItem[] = [
  { label: 'Career TD Passes', value: 281, suffix: ' TDs' },
  { label: 'Rushing TDs', value: 75, suffix: ' TDs' },
  { label: 'MVP Awards', value: 2 },
  { label: 'Passer Rating', value: 100.4 },
  { label: 'Completion %', value: 66.9, suffix: '%' },
  { label: 'Super Bowl Rings', value: 1 },
  { label: 'Rushing Yards', value: 7386, suffix: ' yds' },
  { label: 'Excuses by doubters', value: 0, suffix: ' remaining', isSpecial: true },
  { label: '2019 Unanimous MVP Votes', value: 50, suffix: '/50' },
];

function AnimatedNumber({ target, decimals = 0, started }: { target: number; decimals?: number; started: boolean }) {
  const [current, setCurrent] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const duration = 2000;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(eased * target);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [started, target]);

  return <>{current.toFixed(decimals)}</>;
}

export default function StatsTicker() {
  const { ref, isVisible } = useScrollAnimation();
  const items = [...STATS, ...STATS];

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        position: 'relative',
        background: 'rgba(0,0,0,0.6)',
        borderTop: '1px solid rgba(255,184,0,0.15)',
        borderBottom: '1px solid rgba(255,184,0,0.15)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        padding: '14px 0',
        zIndex: 10,
      }}
    >
      {/* Gold glow left/right fade */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px',
        background: 'linear-gradient(90deg, rgba(8,8,8,0.9), transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px',
        background: 'linear-gradient(270deg, rgba(8,8,8,0.9), transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      <div className="ticker-track">
        {items.map((stat, i) => (
          <div
            key={i}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '0 40px',
              fontFamily: 'JetBrains Mono, monospace',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{
              fontSize: '0.7rem', color: 'var(--dim)',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              {stat.label}
            </span>
            <span style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: stat.isSpecial ? '#00ff88' : 'var(--gold)',
              textShadow: `0 0 20px ${stat.isSpecial ? 'rgba(0,255,136,0.6)' : 'rgba(255,184,0,0.6)'}`,
            }}>
              {typeof stat.value === 'number' ? (
                <>
                  <AnimatedNumber
                    target={stat.value}
                    decimals={stat.value % 1 !== 0 ? 1 : 0}
                    started={isVisible}
                  />
                  {stat.suffix}
                </>
              ) : stat.value}
            </span>
            <span style={{ color: 'rgba(255,184,0,0.3)', fontSize: '0.6rem' }}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
