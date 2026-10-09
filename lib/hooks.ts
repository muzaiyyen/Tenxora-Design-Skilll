"use client";

import { animate, useInView, useMotionValue, useReducedMotion, useScroll, type MotionValue } from "motion/react";
import { useEffect, useState, type RefObject } from "react";

export function useMedia(query: string, initial = false) {
  const [match, setMatch] = useState(initial);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [query]);
  return match;
}

/**
 * 0..1 progress for a scroll-staged section.
 * Desktop: linked to scroll through the (tall) section.
 * Small screens: plays once when the section comes into view, so nothing depends on a sticky viewport.
 * Reduced motion: always 1, the finished state.
 */
export function useStageProgress(ref: RefObject<HTMLElement | null>, sticky: boolean, offset: [string, string] = ["start start", "end end"]): MotionValue<number> {
  const reduce = useReducedMotion();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { scrollYProgress } = useScroll({ target: ref, offset: offset as any });
  const played = useMotionValue(0);
  const inView = useInView(ref, { amount: 0.35, once: true });

  useEffect(() => {
    if (reduce) {
      played.set(1);
      return;
    }
    if (!sticky && inView) {
      const c = animate(played, 1, { duration: 2.2, ease: [0.22, 1, 0.36, 1] });
      return () => c.stop();
    }
  }, [inView, sticky, reduce, played]);

  if (reduce || !sticky) return played;
  return scrollYProgress;
}

/** prefers-reduced-motion, but false during SSR and the first client render so hydration matches. */
export function useReduce() {
  return useMedia("(prefers-reduced-motion: reduce)");
}
