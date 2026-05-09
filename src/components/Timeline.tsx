import { useEffect, useRef, useState } from 'react';
import { Zap } from 'lucide-react';

interface TimelineEntry {
  year: string;
  title: string;
  desc: string;
  isLeft: boolean;
  highlight?: boolean;
}

const ENTRIES: TimelineEntry[] = [
  {
    year: '2018',
    title: 'THE ROOKIE AWAKENING',
    desc: "Drafted 32nd overall by Baltimore. Took over as starter mid-season. Went 6-1. The doubters started a countdown they'd never reach.",
    isLeft: true,
  },
  {
    year: '2019',
    title: 'UNANIMOUS MVP',
    desc: '50 out of 50 first-place votes. No debate. Broke Michael Vick\'s single-season rushing record for a QB. The league had no answer.',
    isLeft: false,
    highlight: true,
  },
  {
    year: '2020',
    title: 'ADVERSITY CHAPTER',
    desc: 'COVID-19 season. Injuries hit. The critics got loud. Lamar stayed quiet and put in the work.',
    isLeft: true,
  },
  {
    year: '2021',
    title: 'THE BOUNCE BACK',
    desc: '16 TDs, 2 INTs in his first 8 games. Reminded everyone who they were dealing with.',
    isLeft: false,
  },
  {
    year: '2022',
    title: 'RESILIENCE OVER RESTRICTION',
    desc: 'PCL injury ended the season. Contract standoff headlines everywhere. Lamar never wavered.',
    isLeft: true,
  },
  {
    year: '2023',
    title: 'SECOND MVP. SILENCED.',
    desc: 'Won his second MVP award — only the 3rd player ever with multiple MVPs. 102.7 passer rating. No one had arguments left.',
    isLeft: false,
    highlight: true,
  },
  {
    year: '2024',
    title: 'SUPER BOWL CHAMPION',
    desc: 'Super Bowl LVIII. The ring. The Kingdom. The legacy cemented. The Franchise delivered everything they said he couldn\'t.',
    isLeft: true,
    highlight: true,
  },
];

function TimelineItem({ entry, index }: { entry: TimelineEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 60px 1fr',
        gap: '0',
        marginBottom: '40px',
        alignItems: 'start',
      }}
    >
      {/* Left content */}
      <div style={{
        gridColumn: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-60px)',
        transition: `all 0.6s ease ${index * 0.1}s`,
        display: 'flex', justifyContent: 'flex-end', paddingRight: '30px',
      }}>
        {entry.isLeft && (
          <div className="glass" style={{
            padding: '20px 24px', maxWidth: '400px',
            borderColor: entry.highlight ? 'rgba(255,184,0,0.3)' : 'rgba(255,255,255,0.08)',
            boxShadow: entry.highlight ? '0 0 20px rgba(255,184,0,0.1)' : 'none',
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: 'var(--gold)',
              marginBottom: '6px',
              letterSpacing: '0.15em',
            }}>
              {entry.year}
            </div>
            <div style={{
              fontFamily: 'Bebas Neue, cursive',
              fontSize: '1.3rem',
              letterSpacing: '0.05em',
              color: entry.highlight ? 'var(--gold)' : 'var(--white)',
              marginBottom: '8px',
            }}>
              {entry.title}
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.85rem',
              color: 'var(--dim)',
              lineHeight: 1.6,
            }}>
              {entry.desc}
            </div>
          </div>
        )}
      </div>

      {/* Center line + bolt */}
      <div style={{
        gridColumn: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}>
        <div style={{
          width: '2px',
          height: '30px',
          background: 'linear-gradient(180deg, transparent, rgba(255,184,0,0.3))',
        }} />
        <div style={{
          width: '40px', height: '40px',
          background: entry.highlight ? 'rgba(255,184,0,0.15)' : 'rgba(123,47,190,0.15)',
          border: `2px solid ${entry.highlight ? 'var(--gold)' : 'var(--purple)'}`,
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: entry.highlight ? 'var(--glow-gold)' : 'var(--glow-purple)',
          flexShrink: 0,
          opacity: visible ? 1 : 0,
          transition: `opacity 0.4s ease ${index * 0.1 + 0.2}s`,
        }}>
          <Zap size={16} color={entry.highlight ? 'var(--gold)' : 'var(--purple)'} fill="currentColor" />
        </div>
        <div style={{
          width: '2px',
          flex: 1,
          minHeight: '30px',
          background: 'linear-gradient(180deg, rgba(255,184,0,0.3), transparent)',
        }} />
      </div>

      {/* Right content */}
      <div style={{
        gridColumn: 3,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(60px)',
        transition: `all 0.6s ease ${index * 0.1}s`,
        paddingLeft: '30px',
      }}>
        {!entry.isLeft && (
          <div className="glass" style={{
            padding: '20px 24px', maxWidth: '400px',
            borderColor: entry.highlight ? 'rgba(255,184,0,0.3)' : 'rgba(255,255,255,0.08)',
            boxShadow: entry.highlight ? '0 0 20px rgba(255,184,0,0.1)' : 'none',
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: 'var(--gold)',
              marginBottom: '6px',
              letterSpacing: '0.15em',
            }}>
              {entry.year}
            </div>
            <div style={{
              fontFamily: 'Bebas Neue, cursive',
              fontSize: '1.3rem',
              letterSpacing: '0.05em',
              color: entry.highlight ? 'var(--gold)' : 'var(--white)',
              marginBottom: '8px',
            }}>
              {entry.title}
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.85rem',
              color: 'var(--dim)',
              lineHeight: 1.6,
            }}>
              {entry.desc}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Timeline() {
  return (
    <section style={{
      padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)',
      position: 'relative',
      background: 'linear-gradient(180deg, var(--bg) 0%, rgba(8,4,16,0.8) 50%, var(--bg) 100%)',
    }}>
      {/* Top diagonal */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
        background: 'var(--bg)',
        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 100%)',
      }} />

      <div style={{ textAlign: 'center', marginBottom: '70px' }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem', color: 'var(--purple)',
          letterSpacing: '0.3em', marginBottom: '12px',
        }}>
          CHAPTER BY CHAPTER
        </div>
        <h2 style={{
          fontFamily: 'Bebas Neue, cursive',
          fontSize: 'clamp(40px, 6vw, 80px)',
          letterSpacing: '0.05em',
        }}>
          THE <span style={{ color: 'var(--gold)' }}>ASCENT</span>
        </h2>
      </div>

      {/* Timeline entries - desktop */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'block' }} className="timeline-desktop">
        {ENTRIES.map((entry, i) => (
          <TimelineItem key={i} entry={entry} index={i} />
        ))}
      </div>

      {/* Mobile timeline */}
      <style>{`
        @media (max-width: 768px) {
          .timeline-desktop { display: none !important; }
          .timeline-mobile { display: block !important; }
        }
      `}</style>

      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'none', position: 'relative' }} className="timeline-mobile">
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: '20px', top: 0, bottom: 0,
          width: '2px', background: 'linear-gradient(180deg, transparent, var(--gold), transparent)',
        }} />
        {ENTRIES.map((entry, i) => (
          <MobileTimelineItem key={i} entry={entry} index={i} />
        ))}
      </div>
    </section>
  );
}

function MobileTimelineItem({ entry, index }: { entry: TimelineEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'flex-start',
      opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-40px)',
      transition: `all 0.5s ease ${index * 0.08}s`,
    }}>
      <div style={{
        width: '40px', height: '40px', flexShrink: 0, marginLeft: 0,
        background: entry.highlight ? 'rgba(255,184,0,0.15)' : 'rgba(123,47,190,0.15)',
        border: `2px solid ${entry.highlight ? 'var(--gold)' : 'var(--purple)'}`,
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: entry.highlight ? 'var(--glow-gold)' : 'var(--glow-purple)',
      }}>
        <Zap size={16} color={entry.highlight ? 'var(--gold)' : 'var(--purple)'} fill="currentColor" />
      </div>
      <div className="glass" style={{
        flex: 1, padding: '16px 20px',
        borderColor: entry.highlight ? 'rgba(255,184,0,0.3)' : 'rgba(255,255,255,0.08)',
      }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--gold)', marginBottom: '4px' }}>
          {entry.year}
        </div>
        <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.1rem', color: entry.highlight ? 'var(--gold)' : 'var(--white)', marginBottom: '6px' }}>
          {entry.title}
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'var(--dim)', lineHeight: 1.5 }}>
          {entry.desc}
        </div>
      </div>
    </div>
  );
}
