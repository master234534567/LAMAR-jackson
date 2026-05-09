import { useState } from 'react';
import { unlockAchievement } from '../utils/achievements';
import { X, Zap } from 'lucide-react';

interface MapPin {
  id: string;
  cx: number; cy: number;
  city: string;
  year: string;
  headline: string;
  oneliner: string;
  isHidden?: boolean;
}

const PINS: MapPin[] = [
  {
    id: 'louisville',
    cx: 620, cy: 310,
    city: 'Louisville, KY',
    year: '2015–2017',
    headline: 'WHERE IT STARTED',
    oneliner: 'Won the Heisman. Left them no choice.',
  },
  {
    id: 'baltimore',
    cx: 700, cy: 245,
    city: 'Baltimore, MD',
    year: '2018–present',
    headline: 'HOME. THE KINGDOM.',
    oneliner: 'Purple and black. The throne was always his.',
  },
  {
    id: 'vegas',
    cx: 165, cy: 290,
    city: 'Las Vegas, NV',
    year: 'February 2024',
    headline: 'SUPER BOWL LVIII. RING SECURED.',
    oneliner: 'What they said couldn\'t happen. Happened.',
  },
  {
    id: 'indianapolis',
    cx: 610, cy: 270,
    city: 'Indianapolis, IN',
    year: '2018',
    headline: 'THE COMBINE. THEY SLEPT.',
    oneliner: 'Scouts had questions. Lamar had answers — for years.',
  },
  {
    id: 'hidden',
    cx: 390, cy: 420,
    city: '???',
    year: 'Classified',
    headline: 'DOUBTERS\' LAST KNOWN LOCATION',
    oneliner: 'coordinates lost',
    isHidden: true,
  },
];

// Simplified US outline path
const US_PATH = `M 90 180 L 100 160 L 130 155 L 160 140 L 200 135 L 240 130 L 280 128 L 320 125
L 360 122 L 390 118 L 420 120 L 450 115 L 480 112 L 510 110 L 540 115 L 570 118
L 600 115 L 630 118 L 650 125 L 660 135 L 665 150 L 660 165 L 650 175 L 640 185
L 650 195 L 660 210 L 665 230 L 660 250 L 650 265 L 640 275 L 625 280 L 610 285
L 600 295 L 590 310 L 580 325 L 570 340 L 560 355 L 545 365 L 530 370 L 515 375
L 500 378 L 480 380 L 460 382 L 440 383 L 420 382 L 400 378 L 380 372 L 360 365
L 340 358 L 320 355 L 305 360 L 290 370 L 275 378 L 260 382 L 245 378 L 235 368
L 225 358 L 215 350 L 205 345 L 190 342 L 175 340 L 160 335 L 145 325 L 135 315
L 128 305 L 122 295 L 115 285 L 108 270 L 102 255 L 96 240 L 92 225 L 90 210 L 90 180 Z`;

const ALASKA = `M 95 355 L 105 345 L 120 340 L 135 342 L 148 350 L 155 360 L 150 370 L 138 375 L 125 372 L 110 366 L 95 355 Z`;
const HAWAII = `M 200 390 L 210 385 L 220 388 L 225 395 L 218 400 L 208 398 L 200 390 Z M 228 386 L 235 382 L 242 385 L 242 392 L 235 394 L 228 386 Z`;

interface ActivePin {
  pin: MapPin;
  x: number;
  y: number;
}

export default function CareerMap() {
  const [activePin, setActivePin] = useState<ActivePin | null>(null);
  const [clickedPins, setClickedPins] = useState<Set<string>>(new Set());

  const handlePinClick = (pin: MapPin, e: React.MouseEvent) => {
    e.stopPropagation();
    const svgEl = (e.currentTarget as SVGElement).closest('svg')!;
    const rect = svgEl.getBoundingClientRect();
    const scaleX = rect.width / 760;
    const scaleY = rect.height / 500;
    const x = pin.cx * scaleX + rect.left;
    const y = pin.cy * scaleY + rect.top;

    setActivePin({ pin, x, y });

    const next = new Set(clickedPins);
    next.add(pin.id);
    setClickedPins(next);

    const nonHidden = PINS.filter(p => !p.isHidden);
    if (nonHidden.every(p => next.has(p.id))) {
      unlockAchievement('scout');
    }
  };

  return (
    <section style={{
      padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)',
      position: 'relative',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
          color: 'var(--gold)', letterSpacing: '0.3em', marginBottom: '12px',
        }}>
          GEOGRAPHIC DOMINANCE
        </div>
        <h2 style={{
          fontFamily: 'Bebas Neue, cursive',
          fontSize: 'clamp(40px, 6vw, 80px)', letterSpacing: '0.05em',
        }}>
          CAREER <span style={{ color: 'var(--gold)' }}>MAP</span>
        </h2>
        <p style={{ color: 'var(--dim)', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginTop: '8px' }}>
          Click the pins. Find the hidden one.
        </p>
      </div>

      <div
        className="glass"
        style={{
          maxWidth: '900px', margin: '0 auto',
          padding: '30px', position: 'relative',
          overflow: 'visible',
        }}
        onClick={() => setActivePin(null)}
      >
        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '12px', overflow: 'hidden',
          backgroundImage: `
            linear-gradient(rgba(255,184,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,184,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        <svg
          viewBox="0 0 760 500"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          {/* US outline */}
          <path d={US_PATH} fill="rgba(123,47,190,0.08)" stroke="rgba(255,184,0,0.2)" strokeWidth="1.5" />
          <path d={ALASKA} fill="rgba(123,47,190,0.06)" stroke="rgba(255,184,0,0.15)" strokeWidth="1" />
          <path d={HAWAII} fill="rgba(123,47,190,0.06)" stroke="rgba(255,184,0,0.15)" strokeWidth="1" />

          {/* State borders suggestion */}
          {[
            'M 400 120 L 400 380', 'M 550 120 L 550 360',
            'M 300 130 L 300 375', 'M 200 135 L 200 360',
          ].map((d, i) => (
            <path key={i} d={d} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}

          {/* Pins */}
          {PINS.map(pin => (
            <g
              key={pin.id}
              onClick={e => handlePinClick(pin, e)}
              style={{ cursor: 'none' }}
            >
              {/* Ripple ring */}
              <circle
                cx={pin.cx} cy={pin.cy} r="16"
                fill="none"
                stroke={pin.isHidden ? 'rgba(0,255,136,0.3)' : 'rgba(255,184,0,0.3)'}
                strokeWidth="1"
                style={{ animation: 'map-pulse 2s ease-out infinite' }}
              />
              <circle
                cx={pin.cx} cy={pin.cy} r="10"
                fill="none"
                stroke={pin.isHidden ? 'rgba(0,255,136,0.5)' : 'rgba(255,184,0,0.5)'}
                strokeWidth="1"
                style={{ animation: 'map-pulse 2s ease-out 0.5s infinite' }}
              />

              {/* Core dot */}
              <circle
                cx={pin.cx} cy={pin.cy} r="6"
                fill={pin.isHidden ? '#00ff88' : (clickedPins.has(pin.id) ? '#7B2FBE' : '#FFB800')}
                style={{
                  filter: `drop-shadow(0 0 8px ${pin.isHidden ? '#00ff88' : '#FFB800'})`,
                  transition: 'fill 0.3s ease',
                }}
              />

              {/* Bolt icon at top */}
              <text
                x={pin.cx} y={pin.cy - 14}
                textAnchor="middle"
                style={{ fontSize: '10px' }}
                fill={pin.isHidden ? '#00ff88' : '#FFB800'}
              >
                ⚡
              </text>

              {/* Label */}
              {!pin.isHidden && (
                <text
                  x={pin.cx} y={pin.cy + 24}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.6)"
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', letterSpacing: '0.05em' }}
                >
                  {pin.city.split(',')[0].toUpperCase()}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Corner labels */}
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
          color: 'rgba(255,184,0,0.4)', pointerEvents: 'none',
        }}>
          LJ8_ATLAS v1.0
        </div>
        <div style={{
          position: 'absolute', bottom: '10px', right: '10px',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.2)', pointerEvents: 'none',
        }}>
          {PINS.filter(p => !p.isHidden && clickedPins.has(p.id)).length}/{PINS.filter(p => !p.isHidden).length} locations explored
        </div>
      </div>

      {/* Card popup */}
      {activePin && (
        <div
          className="glass"
          style={{
            position: 'fixed',
            left: Math.min(Math.max(activePin.x - 150, 20), window.innerWidth - 340),
            top: Math.min(activePin.y - 180, window.innerHeight - 220),
            width: '300px',
            padding: '20px',
            zIndex: 1000,
            animation: 'toast-in 0.3s ease',
            borderColor: activePin.pin.isHidden ? 'rgba(0,255,136,0.3)' : 'rgba(255,184,0,0.3)',
            boxShadow: activePin.pin.isHidden ? '0 0 30px rgba(0,255,136,0.2)' : 'var(--glow-gold)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => setActivePin(null)}
            style={{
              position: 'absolute', top: '12px', right: '12px',
              background: 'none', border: 'none', color: 'var(--dim)',
              padding: '2px',
            }}
          >
            <X size={14} />
          </button>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
            color: activePin.pin.isHidden ? '#00ff88' : 'var(--gold)',
            letterSpacing: '0.15em', marginBottom: '6px',
          }}>
            {activePin.pin.city} • {activePin.pin.year}
          </div>
          <div style={{
            fontFamily: 'Bebas Neue, cursive', fontSize: '1.2rem',
            letterSpacing: '0.05em', color: 'var(--white)', marginBottom: '10px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Zap size={16} color="var(--gold)" fill="var(--gold)" />
            {activePin.pin.headline}
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem',
            color: activePin.pin.isHidden ? '#00ff88' : 'var(--dim)',
            lineHeight: 1.5, fontStyle: 'italic',
          }}>
            "{activePin.pin.oneliner}"
          </div>
        </div>
      )}
    </section>
  );
}
