import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function randLatency() {
  return Math.floor(Math.random() * 30) + 8;
}

export default function NetworkPanel({ isOpen, onClose }: Props) {
  const [latency, setLatency] = useState(randLatency());
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (isOpen) {
      intervalRef.current = setInterval(() => {
        setLatency(randLatency());
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isOpen]);

  const rows = [
    { key: 'SITE LATENCY', value: `${latency}ms`, color: '#00ff88', dynamic: true },
    { key: 'DNS RESOLVED', value: 'master234534567.github.io', color: '#00ff88' },
    { key: 'PROTOCOL', value: 'HTTPS/2', color: '#00ff88' },
    { key: 'SERVER', value: 'GitHub Pages', color: '#00ff88' },
    { key: 'PACKETS LOST', value: "0 (Lamar doesn't fumble)", color: '#00ff88' },
    { key: 'UPTIME', value: '100%', color: '#FFB800' },
    { key: 'TLS VERSION', value: 'TLS 1.3', color: '#00ff88' },
    { key: 'BUILD', value: 'v1.0 — THE FRANCHISE', color: 'var(--purple)' },
  ];

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9000,
      background: 'rgba(2,8,2,0.97)',
      border: '1px solid rgba(0,255,136,0.15)',
      borderBottom: 'none',
      borderRadius: '12px 12px 0 0',
      padding: '20px 24px',
      backdropFilter: 'blur(20px)',
      animation: 'terminal-slide-up 0.35s ease',
      maxHeight: '340px',
      overflow: 'auto',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '16px', borderBottom: '1px solid rgba(0,255,136,0.1)', paddingBottom: '12px',
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem',
          color: 'rgba(0,255,136,0.6)', letterSpacing: '0.2em',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#00ff88', boxShadow: '0 0 6px #00ff88',
            animation: 'pulse-glow 2s infinite',
          }} />
          NETWORK DIAGNOSTICS — LIVE
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'rgba(0,255,136,0.5)', padding: '2px' }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 24px' }}>
        {rows.map(row => (
          <>
            <div key={`k-${row.key}`} style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em',
              whiteSpace: 'nowrap', padding: '4px 0',
            }}>
              {row.key}:
            </div>
            <div key={`v-${row.key}`} style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem',
              color: row.color,
              textShadow: row.dynamic ? `0 0 10px ${row.color}` : 'none',
              padding: '4px 0',
              transition: 'color 0.3s ease',
            }}>
              {row.value}
            </div>
          </>
        ))}
      </div>

      <div style={{
        marginTop: '16px', paddingTop: '12px',
        borderTop: '1px solid rgba(0,255,136,0.08)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem',
        color: 'rgba(0,255,136,0.4)', fontStyle: 'italic',
      }}>
        {'> connection maintained. always.'}
      </div>
    </div>
  );
}
