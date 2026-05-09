import { useEffect, useState, useCallback, useRef } from 'react';
import { unlockAchievement } from '../utils/achievements';
import { playCrowdRoar, playLightningSound, playTerminalBeep } from '../utils/sounds';

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
const WHOBUILT = 'whobuiltthis';
const EXIT_WORD = 'exit';

const JOKES = [
  'ping lamar.god — 0ms response time',
  'TCP/IP? more like The GOAT Protocol',
  'your firewall couldn\'t stop him either',
  'IPv6 barely has more addresses than his highlights',
];

interface Props {
  onToast: (icon: string, title: string, desc: string) => void;
}

export default function EasterEggs({ onToast }: Props) {
  const [konamiFlash, setKonamiFlash] = useState(false);
  const [pressEightFlash, setPressEightFlash] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [screenFlashColor, setScreenFlashColor] = useState<string | null>(null);

  const konamiSeqRef = useRef<string[]>([]);
  const whoBuiltSeqRef = useRef<string>('');
  const exitSeqRef = useRef<string>('');
  const terminalRef = useRef<HTMLDivElement>(null);

  const openTerminal = useCallback(() => {
    playTerminalBeep();
    const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
    setTerminalLines([]);
    setTerminalOpen(true);
    unlockAchievement('ghost');
    onToast('👻', 'Ghost in the Shell', 'found whobuiltthis panel');

    const lines = [
      '> DEVELOPER: DNS',
      '> STACK: HTML / CSS / JS / DNS / Systems',
      '> STATUS: building things you search how to do',
      '> THREAT LEVEL: architect',
      `> ${joke}`,
      '> press ESC or type "exit" to close',
    ];

    lines.forEach((line, i) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line]);
        playTerminalBeep();
      }, i * 300);
    });
  }, [onToast]);

  const closeTerminal = useCallback(() => {
    if (!terminalOpen) return;
    const shutdownLines = [
      '> closing terminal...',
      '> session terminated.',
      '> connection maintained. always.',
    ];
    let added = 0;
    const addLine = () => {
      if (added >= shutdownLines.length) {
        setTimeout(() => setTerminalOpen(false), 300);
        return;
      }
      setTerminalLines(prev => [...prev, shutdownLines[added]]);
      added++;
      setTimeout(addLine, 200);
    };
    addLine();
  }, [terminalOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      // Konami
      konamiSeqRef.current = [...konamiSeqRef.current, key].slice(-KONAMI.length);
      if (konamiSeqRef.current.join(',') === KONAMI.join(',')) {
        setKonamiFlash(true);
        playCrowdRoar();
        playLightningSound();
        setScreenFlashColor('rgba(0,255,136,0.15)');
        setTimeout(() => setKonamiFlash(false), 3000);
        setTimeout(() => setScreenFlashColor(null), 2000);
        unlockAchievement('kombat');
        onToast('⌨️', 'Kombat Ready', 'entered Konami code');
      }

      // Press "8"
      if (key === '8' && !terminalOpen) {
        setPressEightFlash(true);
        setScreenFlashColor('rgba(123,47,190,0.3)');
        setTimeout(() => setPressEightFlash(false), 1500);
        setTimeout(() => setScreenFlashColor(null), 1000);
      }

      // whobuiltthis
      whoBuiltSeqRef.current = (whoBuiltSeqRef.current + key.toLowerCase()).slice(-WHOBUILT.length);
      if (whoBuiltSeqRef.current === WHOBUILT && !terminalOpen) {
        openTerminal();
        whoBuiltSeqRef.current = '';
      }

      // exit
      if (terminalOpen) {
        exitSeqRef.current = (exitSeqRef.current + key.toLowerCase()).slice(-EXIT_WORD.length);
        if (exitSeqRef.current === EXIT_WORD) {
          closeTerminal();
          exitSeqRef.current = '';
        }
        if (key === 'Escape') closeTerminal();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [terminalOpen, openTerminal, closeTerminal, onToast]);

  // Context menu
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    };
    const onClose = () => setContextMenu(null);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('click', onClose);
    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('click', onClose);
    };
  }, []);


  return (
    <>
      {/* Screen flash overlay */}
      {screenFlashColor && (
        <div style={{
          position: 'fixed', inset: 0, background: screenFlashColor,
          pointerEvents: 'none', zIndex: 99996,
          animation: 'flash-anim 1.5s ease forwards',
        }} />
      )}

      {/* Konami overlay */}
      {konamiFlash && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99997,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(36px, 6vw, 72px)',
            color: '#00ff88',
            textShadow: '0 0 40px #00ff88, 0 0 80px #00ff88',
            letterSpacing: '0.2em',
            animation: 'number-slam 0.5s ease',
          }}>
            ACCESS GRANTED
          </div>
        </div>
      )}

      {/* Press 8 flash */}
      {pressEightFlash && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99997,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            fontFamily: 'Bebas Neue, cursive',
            fontSize: 'clamp(40px, 8vw, 100px)',
            color: 'var(--white)',
            textShadow: '0 0 40px var(--purple), 0 0 80px var(--purple)',
            letterSpacing: '0.15em',
            animation: 'number-slam 0.4s ease',
          }}>
            #8 — no further explanation needed
          </div>
        </div>
      )}

      {/* Context menu */}
      {contextMenu && (
        <div
          className="custom-context-menu"
          style={{ left: Math.min(contextMenu.x, window.innerWidth - 230), top: Math.min(contextMenu.y, window.innerHeight - 100) }}
          onClick={e => e.stopPropagation()}
        >
          {['Open Link in New Tab', 'Save Page As...', 'Print...', 'View Page Source'].map(item => (
            <div key={item} className="context-menu-item" style={{ padding: '8px 14px', borderRadius: '6px', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'var(--dim)', transition: 'all 0.15s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = 'var(--dim)'; }}
            >
              {item}
            </div>
          ))}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
          <div
            style={{ padding: '8px 14px', borderRadius: '6px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: 'var(--gold)', transition: 'all 0.15s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,184,0,0.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
          >
            You really right-clicked on a Lamar site?
          </div>
        </div>
      )}

      {/* Terminal panel */}
      {terminalOpen && (
        <div
          ref={terminalRef}
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9998,
            background: 'rgba(2,8,2,0.97)',
            border: '1px solid rgba(0,255,136,0.2)',
            borderBottom: 'none',
            borderRadius: '12px 12px 0 0',
            padding: '24px',
            backdropFilter: 'blur(20px)',
            animation: 'terminal-slide-up 0.4s ease',
            maxHeight: '50vh',
            overflow: 'auto',
          }}
        >
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '16px',
            borderBottom: '1px solid rgba(0,255,136,0.1)', paddingBottom: '12px',
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
              color: 'rgba(0,255,136,0.6)', letterSpacing: '0.2em',
            }}>
              TERMINAL — SESSION ACTIVE
            </div>
            <button
              onClick={closeTerminal}
              style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem',
                background: 'none', border: '1px solid rgba(0,255,136,0.2)',
                borderRadius: '4px', color: 'rgba(0,255,136,0.6)',
                padding: '2px 8px',
              }}
            >
              ESC
            </button>
          </div>
          {terminalLines.map((line, i) => (
            <div key={i} style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.85rem',
              color: line.startsWith('> closing') || line.startsWith('> session') || line.startsWith('> connection')
                ? 'rgba(0,255,136,0.5)'
                : '#00ff88',
              marginBottom: '6px',
              lineHeight: 1.5,
              animation: 'fade-in-up 0.2s ease',
            }}>
              {line}
            </div>
          ))}
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem',
            color: '#00ff88', display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <span>{'>'}</span>
            <span style={{ animation: 'pulse-glow 1s infinite', marginLeft: '4px' }}>█</span>
          </div>
        </div>
      )}
    </>
  );
}
