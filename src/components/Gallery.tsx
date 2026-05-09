import { useEffect, useRef, useState } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  isLeft: boolean;
}

const IMAGES: GalleryImage[] = [
  { src: '/Screenshot_2026-05-08_221910.png', alt: 'TD Reception', caption: 'UNSTOPPABLE ON THE FIELD', isLeft: true },
  { src: '/Screenshot_2026-05-08_221920.png', alt: 'Purple Lightning', caption: 'KINGDOM ENERGY', isLeft: false },
  { src: '/Screenshot_2026-05-08_222004.png', alt: 'Championship Night', caption: 'THE THRONE', isLeft: true },
  { src: '/giphy.gif', alt: 'Celebration', caption: 'ELECTRIC MOMENTS', isLeft: false },
];

interface GalleryItemProps {
  image: GalleryImage;
  index: number;
}

function GalleryImage({ image, index }: GalleryItemProps) {
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
        gridTemplateColumns: image.isLeft ? '1fr 1fr' : '1fr 1fr',
        gap: '40px',
        alignItems: 'center',
        marginBottom: '80px',
        maxWidth: '1100px',
        margin: '0 auto 80px auto',
      }}
      className="gallery-item"
    >
      {/* Image - slides in */}
      <div
        style={{
          order: image.isLeft ? 1 : 2,
          opacity: visible ? 1 : 0,
          transform: visible
            ? 'translateX(0) scale(1)'
            : image.isLeft
            ? 'translateX(-100px) scale(0.85)'
            : 'translateX(100px) scale(0.85)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            aspectRatio: '4/5',
            border: '2px solid rgba(255,184,0,0.2)',
            boxShadow: '0 20px 60px rgba(123,47,190,0.3), 0 0 40px rgba(255,184,0,0.15)',
            background: 'linear-gradient(135deg, rgba(123,47,190,0.1), rgba(255,184,0,0.05))',
            zIndex: 2,
          }}
        >
          <img
            src={image.src}
            alt={image.alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'contrast(1.05) brightness(1.02)',
            }}
          />

          {/* Scanline overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
              pointerEvents: 'none',
            }}
          />

          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, transparent 30%, rgba(123,47,190,0.1) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Glow halo behind image */}
        {visible && (
          <div
            style={{
              position: 'absolute',
              inset: '-20px',
              borderRadius: '16px',
              background: `radial-gradient(ellipse 60% 100% at 50% 50%, ${image.isLeft ? 'rgba(255,184,0,0.2)' : 'rgba(123,47,190,0.2)'}, transparent)`,
              filter: 'blur(40px)',
              zIndex: -1,
              animation: 'pulse-glow 3s ease-in-out infinite',
            }}
          />
        )}
      </div>

      {/* Text - slides in opposite */}
      <div
        style={{
          order: image.isLeft ? 2 : 1,
          opacity: visible ? 1 : 0,
          transform: visible
            ? 'translateX(0)'
            : image.isLeft
            ? 'translateX(100px)'
            : 'translateX(-100px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transitionDelay: '0.1s',
        }}
      >
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.7rem',
            color: image.isLeft ? 'var(--gold)' : 'var(--purple)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          {'> '}{image.isLeft ? 'MOMENT' : 'LEGACY'}
        </div>

        <h3
          style={{
            fontFamily: 'Bebas Neue, cursive',
            fontSize: 'clamp(32px, 5vw, 56px)',
            letterSpacing: '0.08em',
            color: 'var(--white)',
            marginBottom: '20px',
            lineHeight: 1.1,
            textShadow: `0 4px 20px ${image.isLeft ? 'rgba(255,184,0,0.2)' : 'rgba(123,47,190,0.2)'}`,
          }}
        >
          {image.caption}
        </h3>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            color: 'var(--dim)',
            lineHeight: 1.7,
            marginBottom: '24px',
            maxWidth: '100%',
          }}
        >
          {index === 0 && "The moment defines the season. Every pass, every yard, every decision made under pressure. This is where MVPs separate themselves from the rest."}
          {index === 1 && "When the Kingdom rises, the opposition falls. Electric energy, unstoppable momentum, a quarterback who makes everyone around him better. This is dynasty football."}
          {index === 2 && "Super Bowl LVIII. The ultimate stage. The moment where all the doubters finally understand what they've been watching for six years. The ring. The legacy."}
          {index === 3 && "These are the moments that get replayed forever. The celebrations, the realization, the pure joy of excellence. This is what the pursuit looks like when you've arrived."}
        </p>

        {/* Accent line */}
        <div
          style={{
            width: '80px',
            height: '3px',
            background: `linear-gradient(90deg, ${image.isLeft ? 'var(--gold)' : 'var(--purple)'}, transparent)`,
            borderRadius: '2px',
            marginTop: '20px',
          }}
        />
      </div>
    </div>
  );
}

export default function Gallery() {
  return (
    <section
      style={{
        padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)',
        position: 'relative',
        background: 'linear-gradient(180deg, var(--bg) 0%, rgba(2,8,4,0.9) 50%, var(--bg) 100%)',
      }}
    >
      {/* Top section */}
      <div style={{ textAlign: 'center', marginBottom: '100px' }}>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.75rem',
            color: 'var(--gold)',
            letterSpacing: '0.3em',
            marginBottom: '16px',
          }}
        >
          VISUAL EXCELLENCE
        </div>
        <h2
          style={{
            fontFamily: 'Bebas Neue, cursive',
            fontSize: 'clamp(40px, 6vw, 80px)',
            letterSpacing: '0.05em',
            marginBottom: '16px',
          }}
        >
          THE <span style={{ color: 'var(--purple)' }}>ARCHIVE</span>
        </h2>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.95rem',
            color: 'var(--dim)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          These moments define a generation. Scroll through the visual story of an era rewritten.
        </p>
      </div>

      {/* Gallery items */}
      <div style={{ position: 'relative' }}>
        {IMAGES.map((img, i) => (
          <GalleryImage key={i} image={img} index={i} />
        ))}
      </div>

      {/* Bottom accent */}
      <div
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,184,0,0.2), transparent)',
          marginTop: '100px',
        }}
      />
    </section>
  );
}
