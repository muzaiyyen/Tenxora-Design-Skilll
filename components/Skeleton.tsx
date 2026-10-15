"use client";

import { motion } from "motion/react";

// Skeleton UI pieces drawn from the Figma cards. All positions are Figma pixels inside a 277.5 x 335 card.

const u = (n: number) => `calc(${n} * var(--u))`;

type Bar = { x: number; y: number; w: number; tone?: "dark" | "purple" };

export function Bars({ bars, delay = 0 }: { bars: Bar[]; delay?: number }) {
  return (
    <>
      {bars.map((b, i) => (
        <span
          key={i}
          className={`bar${b.tone ? ` bar--${b.tone}` : ""}`}
          style={{ left: u(b.x), top: u(b.y), width: u(b.w), ["--d" as string]: `${delay + i * 0.12}s` }}
        />
      ))}
    </>
  );
}

/** ERP / Team Augmentation card: a heading bar, three lines, and a short column on the right. */
export const listBars: Bar[] = [
  { x: 27, y: 30, w: 86.5, tone: "dark" },
  { x: 215, y: 30, w: 35.1, tone: "purple" },
  { x: 27, y: 55, w: 115.3 },
  { x: 27, y: 80, w: 91.9 },
  { x: 27, y: 104, w: 68.5 },
  { x: 225, y: 55, w: 25.2 },
  { x: 225, y: 80, w: 25.2 },
  { x: 225, y: 104, w: 25.2 },
];

export function Check({ x, y, on = true }: { x: number; y: number; on?: boolean }) {
  return (
    <span className={`check${on ? "" : " check--off"}`} style={{ left: u(x), top: u(y) }}>
      {on && (
        <svg viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2.2 6.4 4.8 9 9.8 3.2" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

/** Integrations card: two checked rows and one pending row. */
export function ChecklistArt() {
  return (
    <>
      <Check x={27} y={28} />
      <Check x={27} y={65} />
      <Check x={27} y={107} on={false} />
      <Bars
        bars={[
          { x: 61, y: 33.5, w: 115.3 },
          { x: 61, y: 70.5, w: 88.3 },
          { x: 61, y: 112.5, w: 66.7 },
        ]}
        delay={0.4}
      />
    </>
  );
}

/** Managed Operations card: the blue area chart. The line draws itself once it is on screen. */
export function ChartArt({ delay = 0 }: { delay?: number }) {
  const line = "M2 84 C30 92 52 62 88 58 C118 54 126 68 150 60 C176 51 186 22 203 9";
  return (
    <svg
      viewBox="0 0 205 119"
      style={{ position: "absolute", left: u(36), top: u(56), width: u(205), height: u(119), overflow: "visible" }}
      aria-hidden
    >
      <defs>
        <linearGradient id="chart-fill" x1="0.75" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#1a73e9" stopOpacity="0.55" />
          <stop offset="1" stopColor="#1a73e9" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${line} L190 117 Z`}
        fill="url(#chart-fill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: delay + 0.6 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="#3b82ec"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, delay, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}
