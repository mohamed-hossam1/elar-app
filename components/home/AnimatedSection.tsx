"use client";

import { ReactNode, useRef, useEffect, useLayoutEffect, useState } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
  distance?: number;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.6,
  once = true,
  distance = 48,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"init" | "visible" | "hidden" | "animating">("init");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight - 80 && rect.bottom > 0;
    setPhase(isInViewport ? "visible" : "hidden");
  }, []);

  useEffect(() => {
    if (phase !== "hidden") return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("animating");
          if (once) observer.unobserve(el);
        } else if (!once) {
          setPhase("hidden");
        }
      },
      { rootMargin: "-80px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, phase]);

  let style: React.CSSProperties | undefined;
  switch (phase) {
    case "init":
      break;
    case "visible":
      break;
    case "hidden":
      style = { opacity: 0 };
      break;
    case "animating":
      style = {
        ["--as-d" as string]: `${distance}px`,
        animation: `as-${direction} ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s forwards`,
        willChange: "transform, opacity",
      };
      break;
  }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}