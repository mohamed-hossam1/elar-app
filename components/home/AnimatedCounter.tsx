"use client";

import { useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

interface AnimatedCounterProps {
  to: number;
  suffix?: string;
  className?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function AnimatedCounter({
  to,
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start: number | null = null;
    const duration = 1500;

    function animate(now: number) {
      if (!start) start = now;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(easeOutCubic(progress) * to));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(to);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, to]);

  return (
    <span ref={ref} className={className}>
      {count}
      {suffix}
    </span>
  );
}
