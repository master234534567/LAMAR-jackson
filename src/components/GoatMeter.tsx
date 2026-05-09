import { useEffect, useRef, useState } from 'react';
import { Zap } from 'lucide-react';
import { unlockAchievement } from '../utils/achievements';
import { playCrowdRoar } from '../utils/sounds';

export default function GoatMeter() {
  const [scrollPct, setScrollPct] = useState(0);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [glitched, setGlitched] = useState(false);
  const [edgeFlash, setEdgeFlash] = useState(false);
  const witnessedRef = useRef(false);
  const frameRef = useRef(0);
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = el.scrollHeight > el.clientHeight
        ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
        : 0;

      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => setScrollPct(pct));

      if (pct >= 33 && pct < 66 && tooltip !== 'tier1') {
        setTooltip('tier1');
        clearTimeout(tooltipTimeout.current);
        tooltipTimeout.current = setTimeout(() => setTooltip(null), 2500);
      } else if (pct >= 66 && pct < 100 && tooltip !== 'tier2') {
        setTooltip('tier2');
        clearTimeout(tooltipTimeout.current);
        tooltipTimeout.current = setTimeout(() => setTooltip(null), 2500);
      } else if (pct >= 99.5 && !witnessedRef.current) {
        witnessedRef.current = true;
        setGlitched(true);
        setTooltip('tier3');
        setEdgeFlash(true);
        playCrowdRoar();
        unlockAchievement('witness');
        setTimeout(() => setEdgeFlash(false), 1000);
        setTimeout(() => setGlitched(false), 3000);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frameRef.current);
      clearTimeout(tooltipTimeout.current);
    };
  }, [tooltip]);

  const getFillColor = () => {
    if (scrollPct < 33) return `linear-gradient(180deg, #FFD700, #FFB800)`;
    if (scrollPct < 66) return `linear-gradient(180deg, #9B4FDE, #7B2FBE)`;
    return `linear-gradient(180deg, #ffffff, #e0e0e0, #7B2FBE)`;
  };

  const getLabel = () => {
    if (glitched) return (
      <span style={{
        animation: 'glitch-anim 0.3s infinite',
        color: '#fff',
        textShadow: '0 0 10px #fff',
      }}>
        SCALE:<br />BROKEN
      </span>
    );
    return 'GOAT\nLEVEL';
  };

  const tooltipText: Record<string, string> = {
    tier1: 'still better than your top 5',
    tier2: 'mathematically unfair at this point',
    tier3: '100% WITNESSED',
  };

  return (
    <>
      {/* Edge flash overlay */}
      {edgeFlash && (
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99997,
          boxShadow: 'inset 0 0 80px rgba(255,255,255,0.7)',
          animation: 'edge-flash 1s ease',
        }} />
      )}

      <div style={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}>
        {/* Tooltip */}
        {tooltip && (
          <div
            className="glass"
            style={{
              position: 'absolute',
              right: '56px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '8px 14px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.72rem',
              color: 'var(--gold)',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--glow-gold)',
              borderColor: 'rgba(255,184,0,0.3)',
              animation: 'toast-in 0.3s ease',
              maxWidth: '220px',
              textAlign: 'right',
            }}
          >
            {tooltipText[tooltip]}
          </div>
        )}

        {/* Label */}
        <div style={{
          fontFamily: 'Bebas Neue, cursive',
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          color: 'var(--dim)',
          textAlign: 'center',
          lineHeight: 1.2,
          whiteSpace: 'pre-line',
          maxWidth: '40px',
        }}>
          {getLabel()}
        </div>

        {/* Tube container */}
        <div style={{
          width: '32px',
          height: '180px',
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '100px',
          overflow: 'hidden',
          position: 'relative',
          backdropFilter: 'blur(10px)',
          boxShadow: scrollPct > 90
            ? '0 0 20px rgba(255,255,255,0.3)'
            : scrollPct > 60
            ? 'var(--glow-purple)'
            : 'var(--glow-gold)',
        }}>
          {/* Fill */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${scrollPct}%`,
            background: getFillColor(),
            transition: 'height 0.2s ease, background 0.5s ease',
            borderRadius: '100px',
          }}>
            {/* Liquid shine */}
            <div style={{
              position: 'absolute',
              top: 0, left: '20%', right: '60%',
              height: '100%',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '100px',
            }} />
          </div>

          {/* Tick marks */}
          {[33, 66].map(pct => (
            <div key={pct} style={{
              position: 'absolute',
              bottom: `${pct}%`,
              left: 0, right: 0,
              height: '1px',
              background: 'rgba(255,255,255,0.2)',
            }} />
          ))}
        </div>

        {/* Percentage */}
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem',
          color: scrollPct > 90 ? '#fff' : 'var(--gold)',
          textShadow: scrollPct > 90 ? '0 0 10px #fff' : 'none',
        }}>
          {Math.round(scrollPct)}%
        </div>

        {/* Bolt icon */}
        <Zap
          size={14}
          style={{
            color: 'var(--gold)',
            animation: 'pulse-gold 2s ease infinite',
          }}
        />
      </div>
    </>
  );
}
