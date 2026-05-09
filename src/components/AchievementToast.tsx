import { useEffect, useState } from 'react';
import { unlockAchievement, type AchievementId } from '../utils/achievements';

interface Toast {
  id: number;
  icon: string;
  title: string;
  desc: string;
}

interface Props {
  queue: Toast[];
  onDismiss: (id: number) => void;
}

export default function AchievementToast({ queue, onDismiss }: Props) {
  return (
    <div style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {queue.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onDismiss(toast.id), 400);
    }, 3600);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      background: 'rgba(8,8,8,0.96)',
      border: '1px solid rgba(255,184,0,0.4)',
      borderRadius: '100px',
      padding: '10px 18px',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.78rem',
      color: 'var(--white)',
      boxShadow: 'var(--glow-gold)',
      backdropFilter: 'blur(16px)',
      animation: leaving ? 'toast-out 0.4s ease forwards' : 'toast-in 0.4s ease',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: '1rem' }}>{toast.icon}</span>
      <div>
        <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.75rem' }}>{toast.title}</div>
        <div style={{ color: 'var(--dim)', fontSize: '0.68rem' }}>{toast.desc}</div>
      </div>
    </div>
  );
}

export function useAchievements() {
  const [queue, setQueue] = useState<Toast[]>([]);

  const showToast = (icon: string, title: string, desc: string) => {
    const id = Date.now() + Math.random();
    setQueue(q => [...q, { id, icon, title, desc }]);
  };

  const dismiss = (id: number) => {
    setQueue(q => q.filter(t => t.id !== id));
  };

  const triggerAchievement = (achievementId: AchievementId) => {
    const result = unlockAchievement(achievementId);
    if (result) showToast(result.icon, result.title, result.desc);
  };

  return { queue, dismiss, showToast, triggerAchievement };
}
