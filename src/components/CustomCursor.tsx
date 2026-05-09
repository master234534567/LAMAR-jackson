import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  id: number;
  size: number;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const counterRef = useRef(0);
  const posRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
      spawnParticle(e.clientX, e.clientY);
    };

    const spawnParticle = (x: number, y: number) => {
      const id = ++counterRef.current;
      const size = Math.random() * 5 + 3;
      particlesRef.current.push({ x, y, id, size });
      if (particlesRef.current.length > 15) {
        particlesRef.current.shift();
      }
      renderParticles();
    };

    const renderParticles = () => {
      if (!containerRef.current) return;
      const existing = containerRef.current.querySelectorAll('.cp');
      existing.forEach(el => el.remove());

      particlesRef.current.forEach((p, i) => {
        const el = document.createElement('div');
        el.className = 'cp';
        const ratio = i / particlesRef.current.length;
        const size = p.size * ratio;
        el.style.cssText = `
          position: fixed;
          left: ${p.x - size / 2}px;
          top: ${p.y - size / 2}px;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${ratio > 0.7 ? '#FFB800' : ratio > 0.4 ? '#7B2FBE' : 'rgba(255,184,0,0.4)'};
          pointer-events: none;
          z-index: 99998;
          opacity: ${ratio * 0.8};
          box-shadow: 0 0 ${size * 2}px rgba(255,184,0,${ratio * 0.5});
          transition: none;
        `;
        containerRef.current!.appendChild(el);
      });
    };

    document.addEventListener('mousemove', onMove);

    const tick = () => {
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99998 }} />
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'none',
        }}
      >
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
          <path
            d="M13 0L0 18H10L8 32L24 12H14L13 0Z"
            fill="#FFB800"
            stroke="#7B2FBE"
            strokeWidth="1"
          />
          <path
            d="M13 0L0 18H10L8 32L24 12H14L13 0Z"
            fill="rgba(255,184,0,0.3)"
            style={{ filter: 'blur(4px)' }}
          />
        </svg>
      </div>
    </>
  );
}
