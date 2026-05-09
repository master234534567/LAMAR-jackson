import { useState, useRef } from 'react';
import { Zap, Github } from 'lucide-react';
import { playTerminalBeep } from '../utils/sounds';

export default function DevBadge() {
  const [expanded, setExpanded] = useState(false);
  const [terminalMode, setTerminalMode] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [bounceClass, setBounceClass] = useState('bounce-once');
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const typeTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleClick = () => {
    clickCountRef.current++;
    clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0; }, 600);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      triggerTerminal();
    }
  };

  const triggerTerminal = () => {
    setTerminalMode(true);
    const target = 'sudo make lamar_goat.exe --force';
    typeTimeouts.current.forEach(clearTimeout);
    typeTimeouts.current = [];

    let i = 0;
    setTerminalText('');
    const type = () => {
      if (i <= target.length) {
        setTerminalText(target.slice(0, i));
        playTerminalBeep();
        i++;
        typeTimeouts.current.push(setTimeout(type, 55));
      } else {
        typeTimeouts.current.push(setTimeout(() => {
          setTerminalMode(false);
          setTerminalText('');
        }, 2000));
      }
    };
    type();
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9990,
      }}
    >
      {terminalMode && (
        <div
          className="glass"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            right: 0,
            padding: '10px 16px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.78rem',
            color: '#00ff88',
            whiteSpace: 'nowrap',
            borderColor: 'rgba(0,255,136,0.2)',
            minWidth: '280px',
          }}
        >
          <span style={{ color: 'rgba(0,255,136,0.5)' }}>{'$ '}</span>
          {terminalText}
          <span style={{ animation: 'pulse-glow 0.5s infinite' }}>█</span>
        </div>
      )}

      <button
        className={bounceClass}
        onClick={handleClick}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onAnimationEnd={() => setBounceClass('')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: expanded ? '10px 18px' : '10px 14px',
          background: 'rgba(8,8,8,0.95)',
          border: '1px solid transparent',
          borderRadius: '100px',
          color: 'var(--white)',
          fontFamily: expanded ? 'Inter, sans-serif' : 'JetBrains Mono, monospace',
          fontSize: '0.8rem',
          backdropFilter: 'blur(16px)',
          transition: 'all 0.3s ease',
          backgroundImage: 'linear-gradient(rgba(8,8,8,0.95), rgba(8,8,8,0.95)), linear-gradient(90deg, #FFB800, #7B2FBE, #FFB800)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          backgroundSize: '100%, 200%',
          animation: `${bounceClass} ${bounceClass ? '0.8s ease' : 'badge-shimmer-anim 3s linear infinite'}`,
        }}
      >
        <Zap size={14} color="var(--gold)" fill="var(--gold)" />
        {expanded ? (
          <span>
            Crafted with fire &nbsp;|&nbsp; Systems thinker &nbsp;|&nbsp; DNS goes hard
          </span>
        ) : (
          <span>Built by DNS</span>
        )}
        {expanded && (
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--dim)', transition: 'color 0.2s ease' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--dim)'; }}
            onClick={e => e.stopPropagation()}
          >
            <Github size={14} />
          </a>
        )}
      </button>
    </div>
  );
}
