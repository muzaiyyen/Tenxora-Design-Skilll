"use client";

import { MotionConfig } from "motion/react";
import { useEffect } from "react";
import Lenis from "lenis";

/** Inertia scrolling (Lenis), reduced-motion aware springs, and the glass specular tracker. */
export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let raf = 0;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
      const loop = (t: number) => {
        lenis!.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      // in-page anchors go through Lenis so they glide
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute("href")!;
        const el = id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
        if (!el) return;
        e.preventDefault();
        lenis!.scrollTo(el, { offset: 0, duration: 1.4 });
        el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      };
      document.addEventListener("click", onClick);
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
      return () => {
        document.removeEventListener("click", onClick);
        cancelAnimationFrame(raf);
        lenis?.destroy();
      };
    }
  }, []);

  // One delegated listener moves the specular highlight on whichever glass element is under the pointer.
  useEffect(() => {
    let frame = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      frame = 0;
      if (!last) return;
      const el = (last.target as HTMLElement | null)?.closest?.<HTMLElement>(".glass");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${last.clientX - r.left}px`);
      el.style.setProperty("--my", `${last.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
