import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; color: string;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#FFB800', '#7B2FBE', '#fff', '#FFB800', '#FFD700'];

    const spawnBurst = (x: number, y: number, count = 8) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const speed = Math.random() * 3 + 1;
        particlesRef.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          life: 1,
          maxLife: Math.random() * 60 + 40,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    // Ambient particles
    const spawnAmbient = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      spawnBurst(x, y, 3);
    };

    let ambientTimer = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ambientTimer++;
      if (ambientTimer % 12 === 0) spawnAmbient();

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) return false;

        ctx.save();
        ctx.globalAlpha = p.life * 0.8;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Click burst
    const onMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.85) spawnBurst(e.clientX, e.clientY, 2);
    };
    window.addEventListener('mousemove', onMouseMove);

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <section
      id="hero"
      className="scanlines vignette"
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #080808 0%, #0d0008 50%, #080808 100%)',
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      />

      {/* Parallax background layers */}
      <div
        className="parallax-slow"
        style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(123,47,190,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        backgroundImage: `
          linear-gradient(rgba(255,184,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,184,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 3,
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 20px',
      }}>
        {/* Small label */}
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem',
          color: 'var(--gold)',
          letterSpacing: '0.3em',
          marginBottom: '24px',
          opacity: 0.8,
          animation: 'fade-in-up 0.8s ease 0.5s both',
        }}>
          BALTIMORE RAVENS • EST. 2018 • CHAMPIONSHIP DYNASTY
        </div>

        {/* Glitch title */}
        <h1
          className="glitch"
          data-text="THE FRANCHISE"
          style={{
            fontSize: 'clamp(60px, 12vw, 160px)',
            lineHeight: 0.9,
            letterSpacing: '0.05em',
            marginBottom: '20px',
          }}
        >
          THE FRANCHISE
        </h1>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(14px, 2vw, 20px)',
            color: 'var(--dim)',
            letterSpacing: '0.25em',
            marginBottom: '40px',
            animation: 'fade-in-up 1s ease 1s both',
          }}
        >
          LAMAR JACKSON &nbsp;|&nbsp; BALTIMORE RAVENS &nbsp;|&nbsp;{' '}
          <span style={{ color: 'var(--gold)' }}>#8</span>
        </div>

        {/* Stats pills */}
        <div style={{
          display: 'flex', gap: '12px', flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: '60px',
          animation: 'fade-in-up 1s ease 1.3s both',
        }}>
          {['2x MVP', 'Super Bowl Champ', '300+ Career TDs'].map(label => (
            <span
              key={label}
              className="glass"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                padding: '6px 16px',
                color: 'var(--gold)',
                letterSpacing: '0.1em',
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Divider line */}
        <div style={{
          width: '60px', height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          marginBottom: '20px',
        }} />
      </div>

      {/* Scroll indicator */}
      <div
        className="scroll-bounce"
        style={{
          position: 'absolute', bottom: '60px', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3, color: 'var(--dim)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
        }}
      >
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em' }}>
          SCROLL
        </span>
        <ChevronDown size={20} />
      </div>

      {/* Diagonal clip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '120px',
        background: 'var(--bg)',
        clipPath: 'polygon(0 60%, 100% 0, 100% 100%, 0 100%)',
        zIndex: 4,
      }} />
    </section>
  );
}
