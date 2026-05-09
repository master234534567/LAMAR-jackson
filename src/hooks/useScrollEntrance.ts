import { useEffect, useRef, useState } from 'react';

export function useScrollEntrance(index: number = 0, threshold = 0.2) {
  const ref = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);
  const isOdd = index % 2 === 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animated]);

  useEffect(() => {
    if (!ref.current) return;
    if (animated) {
      ref.current.style.opacity = '1';
      ref.current.style.transform = 'translateX(0)';
    } else {
      const offset = window.innerWidth < 768 ? 40 : 80;
      ref.current.style.opacity = '0';
      ref.current.style.transform = isOdd
        ? `translateX(-${offset}px)`
        : `translateX(${offset}px)`;
    }
  }, [animated, isOdd]);

  return ref;
}
