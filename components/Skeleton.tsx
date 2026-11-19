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

/** AI-assisted card: a sparkle drafts three lines, then a person checks the draft. */
export function AiArt() {
  const star = "M14 0 C15.5 9 19 12.5 28 14 C19 15.5 15.5 19 14 28 C12.5 19 9 15.5 0 14 C9 12.5 12.5 9 14 0 Z";
  return (
    <>
      <motion.svg
        viewBox="0 0 28 28"
        style={{ position: "absolute", left: u(27), top: u(26), width: u(30), height: u(30), overflow: "visible" }}
        aria-hidden
        initial={{ scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 160, damping: 12 }}
      >
        <motion.g
          animate={{ scale: [1, 1.18, 1], rotate: [0, 12, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "14px 14px" }}
        >
          <path d={star} fill="#6b71cd" />
        </motion.g>
        <path d={star} fill="#bfc5ff" transform="translate(26 -6) scale(0.42)" />
      </motion.svg>
      <Bars
        bars={[
          { x: 70, y: 34, w: 120, tone: "purple" },
          { x: 70, y: 59, w: 150 },
          { x: 70, y: 84, w: 104 },
        ]}
        delay={0.3}
      />
      {/* the human review step */}
      <motion.span
        className="ai-review"
        style={{ left: u(27), top: u(112) }}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        <svg viewBox="0 0 20 20" aria-hidden>
          <circle cx="10" cy="7" r="3.6" fill="currentColor" />
          <path d="M3 18c.8-3.6 3.6-5.4 7-5.4s6.2 1.8 7 5.4" fill="currentColor" />
        </svg>
      </motion.span>
      <Check x={58} y={115} />
      <Bars bars={[{ x: 92, y: 120.5, w: 64, tone: "dark" }]} delay={1.3} />
    </>
  );
}
