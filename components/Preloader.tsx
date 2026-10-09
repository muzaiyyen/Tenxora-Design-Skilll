"use client";

import { useReduce } from "@/lib/hooks";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { finishIntro } from "@/lib/intro";

/** Short 0 to 100% counter that hands off to the hero. Numbers only, no copy. */
export default function Preloader() {
  const reduce = useReduce();
  const [n, setN] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (reduce) {
      setShow(false);
      finishIntro();
      return;
    }
    const start = performance.now();
    const dur = 1000;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setShow(false);
          finishIntro();
        }, 120);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[90] flex items-end justify-between bg-[var(--sky-deep)] p-[clamp(20px,4vw,48px)] text-white"
          exit={{ y: "-100%", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-white.svg" alt="" className="h-[26px] w-auto" />
          <span className="t-ultra tabular-nums leading-none">{n}%</span>
          <motion.span
            className="absolute bottom-0 left-0 h-[3px] bg-white"
            style={{ width: `${n}%` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
