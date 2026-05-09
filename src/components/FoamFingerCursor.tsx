import { useEffect, useRef, useState } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export default function FoamFingerCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const trailPointsRef = useRef<TrailPoint[]>([]);
  const idRef = useRef(0);
  const isClickingRef = useRef(false);
  const isHoveringRef = useRef(false);
  const wobbleRef = useRef(0);

  useEffect(() => {
    const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile()) {
      document.documentElement.style.cursor = 'auto';
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }

      // Add trail point
      const id = ++idRef.current;
      trailPointsRef.current.push({ x: e.clientX, y: e.clientY, id });

      // Keep last 6 points
      if (trailPointsRef.current.length > 6) {
        trailPointsRef.current.shift();
      }

      renderTrail();
    };

    const renderTrail = () => {
      if (!trailRef.current) return;
      const existing = trailRef.current.querySelectorAll('.trail-dot');
      existing.forEach(el => el.remove());

      trailPointsRef.current.forEach((p, i) => {
        const el = document.createElement('div');
        el.className = 'trail-dot';
        const ratio = (i + 1) / trailPointsRef.current.length;
        el.style.cssText = `
          position: fixed;
          left: ${p.x - 3}px;
          top: ${p.y - 3}px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #CC0000, #FFB800);
          pointer-events: none;
          z-index: 99998;
          opacity: ${ratio * 0.6};
          box-shadow: 0 0 ${4 * ratio}px rgba(204,0,0,${ratio * 0.5});
          transition: none;
        `;
        trailRef.current!.appendChild(el);
      });
    };

    const onMouseDown = () => {
      isClickingRef.current = true;
      if (cursorRef.current) {
        cursorRef.current.style.animation = 'foam-bounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }
      setTimeout(() => {
        isClickingRef.current = false;
        if (cursorRef.current) {
          cursorRef.current.style.animation = 'none';
        }
      }, 300);
    };

    const onMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.classList.contains('filter-pill')) {
        isHoveringRef.current = true;
      }
    };

    const onMouseLeave = () => {
      isHoveringRef.current = false;
      wobbleRef.current = 0;
    };

    const animate = () => {
      if (isHoveringRef.current) {
        wobbleRef.current += 0.15;
        if (cursorRef.current) {
          const wobble = Math.sin(wobbleRef.current) * 4;
          cursorRef.current.style.transform = `translate(-50%, -50%) rotate(${wobble}deg)`;
        }
      } else {
        wobbleRef.current = 0;
        if (cursorRef.current) {
          cursorRef.current.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        }
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseenter', onMouseEnter, true);
    document.addEventListener('mouseleave', onMouseLeave, true);

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseenter', onMouseEnter, true);
      document.removeEventListener('mouseleave', onMouseLeave, true);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <>
      <div ref={trailRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99998 }} />
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
        {/* SVG foam finger */}
        <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
          {/* Main fist body */}
          <rect x="2" y="20" width="22" height="24" rx="3" fill="#CC0000" stroke="#6B0000" strokeWidth="1.2" />

          {/* Pointing finger */}
          <path
            d="M 20 5 Q 22 12 20 20 Q 20 22 18 22 Q 16 22 16 20 Q 14 12 16 5 Q 17 2 20 2 Q 23 2 20 5"
            fill="#CC0000"
            stroke="#6B0000"
            strokeWidth="1.2"
          />

          {/* Three other fingers hint */}
          <circle cx="9" cy="36" r="2.5" fill="#CC0000" stroke="#6B0000" strokeWidth="1" opacity="0.8" />
          <circle cx="14" cy="38" r="2.5" fill="#CC0000" stroke="#6B0000" strokeWidth="1" opacity="0.8" />
          <circle cx="19" cy="39" r="2.5" fill="#CC0000" stroke="#6B0000" strokeWidth="1" opacity="0.8" />

          {/* Number plate on fist */}
          <rect x="5" y="26" width="16" height="14" rx="1.5" fill="#FFFFFF" stroke="#CC0000" strokeWidth="1" />

          {/* #1 text */}
          <text
            x="13"
            y="36"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="10"
            fontWeight="bold"
            fill="#CC0000"
          >
            #1
          </text>

          {/* Highlight on finger for 3D effect */}
          <ellipse cx="19" cy="10" rx="1.5" ry="2.5" fill="rgba(255,255,255,0.3)" />

          {/* Outline shadow for depth */}
          <rect x="1" y="19" width="24" height="26" rx="4" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
        </svg>
      </div>
    </>
  );
}
