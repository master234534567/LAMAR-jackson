import { useEffect, useState, useRef } from 'react';

function getOrInitCount(): number {
  const stored = localStorage.getItem('lj8_visitors');
  if (stored) return parseInt(stored);
  const base = 847293 + Math.floor(Math.random() * 50000);
  localStorage.setItem('lj8_visitors', base.toString());
  return base;
}

export default function VisitorCounter() {
  const [count, setCount] = useState(0);
  const [flickering, setFlickering] = useState(false);
  const [goldFlash, setGoldFlash] = useState(false);
  const baseRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const base = getOrInitCount();
    baseRef.current = base;

    // Increment
    const newCount = base + 1;
    localStorage.setItem('lj8_visitors', newCount.toString());
    baseRef.current = newCount;

    // Animate count up
    let current = newCount - 500;
    const target = newCount;
    const duration = 2000;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(current + (target - current) * eased);
      setCount(val);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);

    // Check round numbers
    if (newCount % 1000 === 0) setGoldFlash(true);

    // Subtle variance
    const interval = setInterval(() => {
      const variance = Math.random() > 0.7 ? 1 : 0;
      setCount(c => c + variance);
      if (Math.random() > 0.95) {
        setFlickering(true);
        setTimeout(() => setFlickering(false), 100);
      }
    }, 4000);

    return () => { clearInterval(interval); cancelAnimationFrame(frameRef.current); };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.65rem',
        color: 'var(--dim)',
        letterSpacing: '0.25em',
        marginBottom: '10px',
        textTransform: 'uppercase',
      }}>
        ACTIVE WITNESSES TO GREATNESS
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 'clamp(28px, 4vw, 48px)',
        color: goldFlash ? 'var(--gold)' : '#00ff88',
        textShadow: goldFlash
          ? '0 0 20px rgba(255,184,0,0.8)'
          : '0 0 15px rgba(0,255,136,0.5)',
        letterSpacing: '0.1em',
        opacity: flickering ? 0.6 : 1,
        transition: 'opacity 0.1s, color 0.5s, text-shadow 0.5s',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {count.toLocaleString()}
      </div>
    </div>
  );
}
