import { useEffect, useRef, useState } from 'react';
import { Zap, Trophy, Target, TrendingUp, Wind, Star, Award, Shield } from 'lucide-react';
import { unlockAchievement } from '../utils/achievements';

interface StatCard {
  icon: React.ReactNode;
  value: string;
  label: string;
  desc: string;
  color: string;
}

const CARDS: StatCard[] = [
  { icon: <Trophy size={28} />, value: '2×', label: 'NFL MVP', desc: 'Unanimous in 2019. Back again in 2023. Debate closed.', color: '#FFB800' },
  { icon: <Award size={28} />, value: '1', label: 'Super Bowl Ring', desc: 'Super Bowl LVIII. The Kingdom got its crown.', color: '#FFB800' },
  { icon: <Zap size={28} />, value: '281', label: 'Career TD Passes', desc: 'Numbers that redefine what a QB can be.', color: '#7B2FBE' },
  { icon: <Wind size={28} />, value: '7,386', label: 'Rushing Yards', desc: 'Most rushing yards by a QB in NFL history.', color: '#7B2FBE' },
  { icon: <Target size={28} />, value: '100.4', label: 'Career Passer Rating', desc: 'Elite arm talent backing elite athleticism.', color: '#FFB800' },
  { icon: <TrendingUp size={28} />, value: '66.9%', label: 'Completion Rate', desc: 'Accuracy they said he didn\'t have.', color: '#7B2FBE' },
  { icon: <Star size={28} />, value: '50/50', label: 'Unanimous MVP Votes', desc: '2019: every single voter. No debate.', color: '#FFB800' },
  { icon: <Shield size={28} />, value: '75', label: 'Rushing TDs', desc: 'Most rushing TDs for a QB in NFL history.', color: '#7B2FBE' },
];

function AnimatedNumber({ target, decimals = 0, started }: { target: number; decimals?: number; started: boolean }) {
  const [current, setCurrent] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const duration = 1500;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(eased * target);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [started, target]);

  return <>{current.toFixed(decimals)}</>;
}

interface CardProps {
  card: StatCard;
  index: number;
  started: boolean;
  onHover: (index: number) => void;
  hoveredCount: number;
}

function StatCardItem({ card, index, started, onHover, hoveredCount }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const [wasHovered, setWasHovered] = useState(false);

  const handleEnter = () => {
    setHovered(true);
    if (!wasHovered) {
      setWasHovered(true);
      onHover(index);
    }
  };

  const numericVal = parseFloat(card.value.replace(/[^0-9.]/g, ''));
  const hasAnimation = !isNaN(numericVal) && card.value !== '2×' && card.value !== '1';

  return (
    <div
      className={`glass fade-in-up delay-${Math.min(index * 100, 600) as 100 | 200 | 300 | 400 | 500 | 600}`}
      style={{
        padding: '28px 24px',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? `0 0 30px ${card.color}40, 0 0 60px ${card.color}20` : 'none',
        borderColor: hovered ? card.color : 'rgba(255,255,255,0.08)',
        opacity: started ? 1 : 0,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setHovered(false)}
      data-index={index}
    >
      <div style={{ color: card.color, marginBottom: '16px', opacity: 0.9 }}>
        {card.icon}
      </div>
      <div style={{
        fontFamily: 'Bebas Neue, cursive',
        fontSize: 'clamp(40px, 5vw, 56px)',
        color: card.color,
        textShadow: `0 0 20px ${card.color}80`,
        lineHeight: 1,
        marginBottom: '8px',
      }}>
        {hasAnimation ? (
          <>
            <AnimatedNumber
              target={numericVal}
              decimals={card.value.includes('.') ? 1 : 0}
              started={started}
            />
            {card.value.replace(/[0-9.,]/g, '')}
          </>
        ) : card.value}
      </div>
      <div style={{
        fontFamily: 'Bebas Neue, cursive',
        fontSize: '1.1rem',
        letterSpacing: '0.1em',
        color: 'var(--white)',
        marginBottom: '8px',
      }}>
        {card.label}
      </div>
      <div style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.82rem',
        color: 'var(--dim)',
        lineHeight: 1.5,
      }}>
        {card.desc}
      </div>
      {hovered && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
          borderRadius: '0 0 12px 12px',
        }} />
      )}
    </div>
  );
}

export default function StatsCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [hoveredIndices, setHoveredIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleHover = (index: number) => {
    const next = new Set(hoveredIndices);
    next.add(index);
    setHoveredIndices(next);
    if (next.size === CARDS.length) {
      unlockAchievement('analyst');
    }
  };

  return (
    <section ref={sectionRef} style={{ padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{
          fontFamily: 'Bebas Neue, cursive',
          fontSize: 'clamp(40px, 6vw, 80px)',
          letterSpacing: '0.05em',
          color: 'var(--white)',
        }}>
          THE <span style={{ color: 'var(--gold)' }}>NUMBERS</span>
        </h2>
        <p style={{ color: 'var(--dim)', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', marginTop: '8px' }}>
          Statistics don't lie. Neither does the film.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {CARDS.map((card, i) => (
          <div key={i} style={{ position: 'relative' }}>
            <StatCardItem
              card={card}
              index={i}
              started={started}
              onHover={handleHover}
              hoveredCount={hoveredIndices.size}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
