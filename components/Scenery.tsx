"use client";

import { useReduce } from "@/lib/hooks";
import { motion, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect } from "react";

/** Pointer position normalised to -1..1, smoothed with a heavy spring. */
export function usePointer() {
  const x = useSpring(0, { stiffness: 60, damping: 20, mass: 1 });
  const y = useSpring(0, { stiffness: 60, damping: 20, mass: 1 });
  const reduce = useReduce();
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set((e.clientX / window.innerWidth) * 2 - 1);
      y.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, x, y]);
  return { x, y };
}

// anchored to the bottom of the sky so they stay clear of the headline
const clouds = [
  { left: "-8%", bottom: 300, w: 560, h: 160, depth: 26, dur: 34 },
  { left: "64%", bottom: 380, w: 620, h: 170, depth: 18, dur: 40 },
  { left: "22%", bottom: 170, w: 520, h: 130, depth: 34, dur: 30 },
  { left: "80%", bottom: 200, w: 400, h: 120, depth: 40, dur: 28 },
  { left: "40%", bottom: 470, w: 380, h: 90, depth: 12, dur: 46 },
];

export function Clouds({ px }: { px: MotionValue<number> }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {clouds.map((c, i) => (
        <Cloud key={i} {...c} px={px} i={i} />
      ))}
    </div>
  );
}

function Cloud({ left, bottom, w, h, depth, dur, px, i }: (typeof clouds)[number] & { px: MotionValue<number>; i: number }) {
  const x = useTransform(px, (v) => v * -depth);
  return (
    <motion.div className="absolute" style={{ left, bottom, x }}>
      <motion.div
        className="cloud"
        style={{ width: w, height: h, position: "relative" }}
        animate={{ x: [0, 40, 0] }}
        transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.3 }}
      />
    </motion.div>
  );
}

/** Rolling hills tinted toward Treen. Pure SVG, scales with the container. */
export function Hills({ className = "", px }: { className?: string; px?: MotionValue<number> }) {
  const zero = useSpring(0);
  const p = px ?? zero;
  const back = useTransform(p, (v) => v * -10);
  const mid = useTransform(p, (v) => v * -20);
  const front = useTransform(p, (v) => v * -34);
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 ${className}`}>
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute inset-x-[-4%] bottom-0 h-full w-[108%]">
        <defs>
          <linearGradient id="hill-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d6faea" />
            <stop offset="1" stopColor="#a6f2cf" />
          </linearGradient>
          <linearGradient id="hill-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9cefc8" />
            <stop offset="1" stopColor="#5fe3a9" />
          </linearGradient>
          <linearGradient id="hill-c" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5ee6a8" />
            <stop offset="1" stopColor="#21d58c" />
          </linearGradient>
        </defs>
        <motion.path style={{ x: back }} fill="url(#hill-a)" d="M0 150 C 220 70, 420 120, 640 110 S 1060 40, 1440 120 L1440 320 L0 320Z" />
        <motion.path style={{ x: mid }} fill="url(#hill-b)" d="M0 210 C 260 140, 520 200, 760 170 S 1180 120, 1440 190 L1440 320 L0 320Z" />
        <motion.path style={{ x: front }} fill="url(#hill-c)" d="M0 270 C 300 220, 560 280, 860 250 S 1260 220, 1440 260 L1440 320 L0 320Z" />
      </svg>
    </div>
  );
}
