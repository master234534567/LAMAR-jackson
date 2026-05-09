import { useEffect, useRef, useState } from 'react';
import { Zap, Wind, Trophy, BookOpen, BarChart2, Star, Clock } from 'lucide-react';

type Category = 'ALL' | 'SPEED' | 'ARM TALENT' | 'AWARDS' | 'RECORDS' | 'PLAYOFFS' | 'HISTORIC';

interface HighlightCard {
  icon: React.ReactNode;
  title: string;
  desc: string;
  category: Exclude<Category, 'ALL'>;
  tag: string;
}

const CARDS: HighlightCard[] = [
  { icon: <Wind size={22} />, title: '4.34 Forty', desc: 'Blazing 40-yard dash time at the combine they slept on. Fastest QB prospect in history.', category: 'SPEED', tag: 'SPEED' },
  { icon: <Zap size={22} />, title: '1,206 Rush Yds (2019)', desc: 'Single-season QB rushing record. More than most running backs that year.', category: 'RECORDS', tag: 'RECORD' },
  { icon: <Trophy size={22} />, title: 'Unanimous 2019 MVP', desc: '50 out of 50 first-place votes. The last player to do it was Tom Brady in 2010.', category: 'AWARDS', tag: 'AWARD' },
  { icon: <BarChart2 size={22} />, title: '36 Total TDs (2019)', desc: 'Combined passing and rushing touchdowns in a single season. Elite.', category: 'RECORDS', tag: 'RECORD' },
  { icon: <Star size={22} />, title: 'Super Bowl LVIII', desc: 'Delivered the Ravens their first ring since 2012. The Kingdom waited. He delivered.', category: 'HISTORIC', tag: 'HISTORIC' },
  { icon: <BookOpen size={22} />, title: 'Back-to-Back AFC Title', desc: '2023 season saw the Ravens return to dominance with the best record in the AFC.', category: 'PLAYOFFS', tag: 'PLAYOFFS' },
  { icon: <Wind size={22} />, title: 'Most Rushing TDs (QB)', desc: '75 career rushing touchdowns. The most in NFL history for a quarterback.', category: 'RECORDS', tag: 'RECORD' },
  { icon: <Zap size={22} />, title: 'Arm Talent Unlocked', desc: '66.9% completion rate — the critics who said he couldn\'t throw left the chat.', category: 'ARM TALENT', tag: 'ARM' },
  { icon: <Clock size={22} />, title: 'Youngest 2x MVP', desc: 'Won his second MVP at 26. The youngest QB in history to win multiple league MVPs.', category: 'HISTORIC', tag: 'HISTORIC' },
  { icon: <Trophy size={22} />, title: '2023 Second MVP', desc: 'Only the 3rd player in NFL history with multiple MVP awards. Brady. Manning. Jackson.', category: 'AWARDS', tag: 'AWARD' },
  { icon: <Star size={22} />, title: 'Pro Bowl Machine', desc: 'Multiple Pro Bowl selections. The vote totals don\'t need explaining.', category: 'AWARDS', tag: 'AWARD' },
  { icon: <BarChart2 size={22} />, title: 'Playoff Passer Rating 100+', desc: 'When the stakes are highest, Lamar elevates. Silenced the "can\'t win big" narrative.', category: 'PLAYOFFS', tag: 'PLAYOFFS' },
];

const CATEGORIES: Category[] = ['ALL', 'SPEED', 'ARM TALENT', 'AWARDS', 'RECORDS', 'PLAYOFFS', 'HISTORIC'];

function CategoryPill({ label, active, onClick }: { label: Category; active: boolean; onClick: () => void }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [hovering, setHovering] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rr => rr.id !== id)), 600);
    onClick();
  };

  const handleMouseEnter = () => {
    setHovering(true);
    if (label === 'HISTORIC') {
      hoverTimer.current = setTimeout(() => {
        // tooltip handled inline
      }, 3000);
    }
  };

  const handleMouseLeave = () => {
    setHovering(false);
    clearTimeout(hoverTimer.current);
  };

  const [showHistoricTip, setShowHistoricTip] = useState(false);
  useEffect(() => {
    if (label !== 'HISTORIC') return;
    if (hovering) {
      hoverTimer.current = setTimeout(() => setShowHistoricTip(true), 3000);
    } else {
      clearTimeout(hoverTimer.current);
      setShowHistoricTip(false);
    }
    return () => clearTimeout(hoverTimer.current);
  }, [hovering, label]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        className={`filter-pill${active ? ' active' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="ripple-container">
          {ripples.map(r => (
            <div
              key={r.id}
              className="ripple-wave"
              style={{
                left: r.x - 10, top: r.y - 10,
                width: 20, height: 20,
                animation: 'ripple-anim 0.6s linear forwards',
              }}
            />
          ))}
        </div>
        {label}
      </button>
      {showHistoricTip && (
        <div className="glass" style={{
          position: 'absolute', top: '110%', left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 14px', whiteSpace: 'nowrap',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem',
          color: 'var(--gold)', borderColor: 'rgba(255,184,0,0.3)',
          boxShadow: 'var(--glow-gold)', zIndex: 100,
          animation: 'toast-in 0.3s ease',
        }}>
          yeah your defensive coordinator knows too
        </div>
      )}
    </div>
  );
}

function CardItem({ card, index }: { card: HighlightCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tagColors: Record<string, string> = {
    SPEED: '#00bcd4',
    ARM: '#7B2FBE',
    AWARD: '#FFB800',
    RECORD: '#ff6b35',
    PLAYOFFS: '#4caf50',
    HISTORIC: '#FFB800',
  };
  const tagColor = tagColors[card.tag] || 'var(--dim)';

  return (
    <div
      ref={ref}
      className="glass"
      data-category={card.category}
      style={{
        padding: '24px',
        opacity: visible ? 1 : 0,
        transform: visible ? (hovered ? 'translateY(-6px)' : 'translateY(0)') : 'translateY(40px)',
        transition: `all 0.5s ease ${(index % 4) * 0.08}s`,
        cursor: 'none',
        boxShadow: hovered ? `0 8px 40px rgba(255,184,0,0.15)` : 'none',
        borderColor: hovered ? 'rgba(255,184,0,0.3)' : 'rgba(255,255,255,0.08)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tag */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '14px',
      }}>
        <div style={{ color: tagColor, opacity: 0.9 }}>{card.icon}</div>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem',
          padding: '3px 10px',
          background: `${tagColor}18`,
          border: `1px solid ${tagColor}40`,
          borderRadius: '100px',
          color: tagColor,
          letterSpacing: '0.1em',
        }}>
          {card.tag}
        </span>
      </div>
      <div style={{
        fontFamily: 'Bebas Neue, cursive',
        fontSize: '1.2rem', letterSpacing: '0.05em',
        color: 'var(--white)', marginBottom: '8px',
      }}>
        {card.title}
      </div>
      <div style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.82rem', color: 'var(--dim)', lineHeight: 1.6,
      }}>
        {card.desc}
      </div>
    </div>
  );
}

export default function FilterCards() {
  const [active, setActive] = useState<Category>('ALL');
  const [visible, setVisible] = useState<HighlightCard[]>(CARDS);

  useEffect(() => {
    setVisible(
      active === 'ALL' ? CARDS : CARDS.filter(c => c.category === active)
    );
  }, [active]);

  return (
    <section style={{
      padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)',
      background: 'linear-gradient(180deg, var(--bg) 0%, rgba(4,4,12,0.9) 100%)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
          color: 'var(--purple)', letterSpacing: '0.3em', marginBottom: '12px',
        }}>
          THE RESUME
        </div>
        <h2 style={{
          fontFamily: 'Bebas Neue, cursive',
          fontSize: 'clamp(40px, 6vw, 80px)',
          letterSpacing: '0.05em',
        }}>
          THE <span style={{ color: 'var(--purple)' }}>HIGHLIGHTS</span>
        </h2>
      </div>

      {/* Filter pills */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '10px',
        justifyContent: 'center', marginBottom: '50px',
      }}>
        {CATEGORIES.map(cat => (
          <CategoryPill
            key={cat}
            label={cat}
            active={active === cat}
            onClick={() => setActive(cat)}
          />
        ))}
      </div>

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {visible.map((card, i) => (
          <CardItem key={`${card.title}-${active}`} card={card} index={i} />
        ))}
      </div>
    </section>
  );
}
