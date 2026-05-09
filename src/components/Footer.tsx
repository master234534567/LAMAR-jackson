import { useState } from 'react';
import { Zap } from 'lucide-react';
import NetworkPanel from './NetworkPanel';
import VisitorCounter from './VisitorCounter';

export default function Footer() {
  const [networkOpen, setNetworkOpen] = useState(false);

  return (
    <>
      <NetworkPanel isOpen={networkOpen} onClose={() => setNetworkOpen(false)} />

      <footer style={{
        position: 'relative',
        background: 'rgba(4,4,8,0.95)',
        borderTop: '1px solid rgba(255,184,0,0.12)',
        padding: '0 clamp(20px, 5vw, 80px)',
      }}>
        <VisitorCounter />

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          padding: '24px 0',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          {/* Brand */}
          <div style={{
            fontFamily: 'Bebas Neue, cursive',
            fontSize: '1.2rem',
            letterSpacing: '0.1em',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Zap size={16} color="var(--gold)" fill="var(--gold)" />
            <span style={{ color: 'var(--white)' }}>LAMAR JACKSON</span>
            <span style={{ color: 'var(--dim)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
              — #8
            </span>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
            {[
              { label: 'Stats', href: '#hero' },
              { label: 'Ascent', href: '#hero' },
              { label: 'Highlights', href: '#hero' },
              { label: 'Map', href: '#hero' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.82rem',
                  color: 'var(--dim)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  letterSpacing: '0.05em',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--white)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--dim)'; }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Network button */}
          <button
            onClick={() => setNetworkOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(0,255,136,0.05)',
              border: '1px solid rgba(0,255,136,0.15)',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#00ff88',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,136,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,255,136,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,136,0.15)'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,255,136,0.05)'; }}
          >
            {'</>'}
            <span>NETWORK</span>
          </button>
        </div>

        {/* Bottom line */}
        <div style={{
          paddingBottom: '20px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.2)',
          textAlign: 'center',
          letterSpacing: '0.1em',
        }}>
          v1.0 — THE FRANCHISE. BUILT DIFFERENT. — DNS &nbsp;|&nbsp; NOT AFFILIATED WITH THE NFL OR BALTIMORE RAVENS
        </div>
      </footer>
    </>
  );
}
