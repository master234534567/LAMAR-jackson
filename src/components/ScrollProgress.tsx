import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 9999,
        background: 'rgba(255,255,255,0.05)',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #FFB800, #7B2FBE)',
          transition: 'width 0.1s linear',
          boxShadow: '0 0 10px rgba(255,184,0,0.6)',
        }}
      />
    </div>
  );
}
