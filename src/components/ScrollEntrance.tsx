import { useEffect, useRef, useState } from 'react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  index?: number;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollEntrance({
  children,
  index = 0,
  as: Component = 'div',
  className = '',
  style = {},
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [animate, setAnimate] = useState(false);
  const isOdd = index % 2 === 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animate) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return React.createElement(
    Component,
    {
      ref,
      'data-scroll-entrance': true,
      'data-direction': isOdd ? 'left' : 'right',
      'data-animate': animate,
      'data-index': index,
      className,
      style,
    },
    children
  );
}
