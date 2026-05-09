import { useEffect, useRef } from 'react';

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  life: number;
}

interface Props {
  active: boolean;
}

export default function Confetti({ active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FFB800', '#7B2FBE', '#fff', '#FFD700', '#9B4FDE', '#FFCC00'];

    for (let i = 0; i < 120; i++) {
      piecesRef.current.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 6,
        life: 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      piecesRef.current = piecesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.rotation += p.rotationSpeed;
        p.life -= 0.005;
        if (p.y > canvas.height || p.life <= 0) return false;

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();

        return true;
      });

      if (piecesRef.current.length > 0) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameRef.current);
      piecesRef.current = [];
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        zIndex: 99995,
      }}
    />
  );
}
