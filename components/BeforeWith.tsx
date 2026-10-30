"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { beforeWith } from "@/lib/content";
import { asset } from "@/lib/asset";
import { useMedia } from "@/lib/hooks";
import Intro from "./Intro";
import { Bars, ChartArt, ChecklistArt, listBars } from "./Skeleton";

const ease = [0.22, 1, 0.36, 1] as const;
const u = (n: number) => `calc(${n} * var(--u))`;

// deterministic scatter so server and client agree
function rand(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
const SCATTER = beforeWith.pains.map((_, i) => {
  const col = i % 5;
  const row = Math.floor(i / 5);
  const r2 = (n: number) => Math.round(n * 100) / 100;
  return {
    left: r2(5 + col * 18.8 + (rand(i) - 0.5) * 2.4),
    top: r2(22 + row * 18 + (rand(i + 40) - 0.5) * 8),
    rot: r2((rand(i + 80) - 0.5) * 16),
  };
});
// tangled links between pains: each pain is tied to one or two others across the card
const TANGLE: (readonly [number, number])[] = [];
for (let i = 0; i < 20; i++) {
  const add = (b: number) => {
    if (b !== i && !TANGLE.some(([x, y]) => (x === i && y === b) || (x === b && y === i))) TANGLE.push([i, b] as const);
  };
  add((i * 7 + 3) % 20);
  if (i % 3 === 0) add((i + 9) % 20);
}

export default function BeforeWith() {
  const [on, setOn] = useState(false);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.55 });
  const mobile = useMedia("(max-width: 760px)");

  // flip once by itself after the visitor has had a look at the mess
  useEffect(() => {
    if (!inView || touched) return;
    const t = setTimeout(() => setOn(true), 2600);
    return () => clearTimeout(t);
  }, [inView, touched]);

  const set = (v: boolean) => {
    setTouched(true);
    setOn(v);
  };

  return (
    <section className="section bw on-white" data-header="light" aria-labelledby="bw-title">
      <div className="wrap">
        <Intro
          id="bw-title"
          label={beforeWith.kicker}
          heading={beforeWith.heading}
          split={4}
          body={<p>{beforeWith.body}</p>}
          aside={<Switch on={on} set={set} />}
        />

        <div ref={ref} className="capsule bw__capsule" aria-live="polite">
          <motion.div className="bw__state-label" key={on ? "with" : "before"} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <span className="status">
              <span className={`status__dot${on ? "" : " status__dot--red"}`} />
              {on ? beforeWith.withLabel : beforeWith.beforeLabel}
            </span>
          </motion.div>

          {/* before: tangled threads running from pain to pain */}
          {!mobile && <Tangle on={on} host={ref} />}

          {/* the 20 pains: scattered before, pulled into tenxora with */}
          <ul className="bw__pains">
            {beforeWith.pains.map((p, i) => {
              const s = SCATTER[i];
              const pos = { left: `${s.left}%`, top: `${s.top}%` };
              return (
                <motion.li
                  key={p}
                  className="bw__pain"
                  initial={false}
                  animate={
                    on
                      ? mobile
                        ? { opacity: 0, scale: 0.5, rotate: 0, x: "0%", y: "0%" }
                        : { left: "50%", top: "50%", x: "-50%", y: "-50%", opacity: 0, scale: 0.3, rotate: 0 }
                      : { ...pos, x: "0%", y: "0%", opacity: 1, scale: 1, rotate: mobile ? 0 : s.rot }
                  }
                  transition={{ type: "spring", stiffness: 90, damping: 16, delay: on ? i * 0.02 : 0.1 + i * 0.03 }}
                  whileHover={on ? undefined : { scale: 1.08, rotate: 0, zIndex: 5 }}
                >
                  <span className="bw__pain-dot" />
                  {p}
                </motion.li>
              );
            })}
          </ul>

          {/* with: tenxora, the flow and the four stages */}
          <AnimatePresence>
            {on && (
              <motion.div key="with" className="bw__with" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <motion.div
                  className="bw__brand ops-breathe"
                  initial={{ scale: 0.3 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.3 }}
                  transition={{ type: "spring", stiffness: 180, damping: 13, delay: 0.25 }}
                >
                  <img src={asset("/brand/wordmark-black.svg")} alt="" />
                  <span className="sr-only">{beforeWith.withBrand}</span>
                </motion.div>
                <div className="bw__stages">
                  {beforeWith.withStages.map((st, i) => (
                    <StageCard key={st} name={st} i={i} mobile={mobile} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Switch({ on, set }: { on: boolean; set: (v: boolean) => void }) {
  return (
    <span className="switch" role="group" aria-label="Compare">
      <motion.span
        className="switch__thumb"
        layout
        style={{ left: on ? "50%" : u(4), right: on ? u(4) : "50%" }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
      />
      <button type="button" aria-pressed={!on} onClick={() => set(false)} style={{ width: "50%" }}>
        {beforeWith.before}
      </button>
      <button type="button" aria-pressed={on} onClick={() => set(true)} style={{ width: "50%" }}>
        {beforeWith.with}
      </button>
    </span>
  );
}

const ROTS = [-8, -3, 3, 8];
/** Curves drawn between the real centres of the pain pills (measured from layout), so every thread
 * starts and ends under a pill and the knot reads as connections, not loose strokes. */
function Tangle({ on, host }: { on: boolean; host: React.RefObject<HTMLDivElement | null> }) {
  const [box, setBox] = useState<{ w: number; h: number; pts: { x: number; y: number }[] } | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const measure = () => {
      const pills = el.querySelectorAll<HTMLElement>(".bw__pain");
      const pts = Array.from(pills, (p) => ({ x: p.offsetLeft + p.offsetWidth / 2, y: p.offsetTop + p.offsetHeight / 2 }));
      setBox({ w: el.clientWidth, h: el.clientHeight, pts });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [host]);

  if (!box || box.pts.length < 20) return null;
  return (
    <svg className="bw__tangle" viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden>
      {TANGLE.map(([a, b], i) => {
        const A = box.pts[a];
        const B = box.pts[b];
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        // perpendicular swing, opposite at each end, so threads bow, cross and loop past each other
        const k1 = (rand(i + 3) - 0.5) * 0.9;
        const k2 = (rand(i + 11) - 0.5) * 0.9;
        // control points stay inside the card so no thread runs off the edge
        const cx = (x: number) => Math.min(box.w - 40, Math.max(40, x));
        const cy = (y: number) => Math.min(box.h - 30, Math.max(110, y));
        const c1 = `${cx(A.x + dx * 0.3 - dy * k1)} ${cy(A.y + dy * 0.3 + dx * k1)}`;
        const c2 = `${cx(A.x + dx * 0.7 + dy * k2)} ${cy(A.y + dy * 0.7 - dx * k2)}`;
        return (
          <motion.path
            key={i}
            d={`M${A.x} ${A.y} C${c1} ${c2} ${B.x} ${B.y}`}
            fill="none"
            stroke="rgba(239,75,75,.32)"
            strokeWidth={1.4}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: on ? 0 : 1, opacity: on ? 0 : 1 }}
            transition={{ duration: on ? 0.5 : 1.4, ease, delay: on ? 0 : 0.6 + i * 0.04 }}
          />
        );
      })}
    </svg>
  );
}

function StageCard({ name, i, mobile }: { name: string; i: number; mobile: boolean }) {
  // phones: a calmer tilt and no drop, so the two-column grid keeps clear gaps
  const rot = mobile ? ROTS[i] * 0.3 : ROTS[i];
  return (
    <motion.div
      className="bw__stage"
      initial={{ opacity: 0, y: 80, rotate: 0, scale: 0.8 }}
      animate={{ opacity: 1, y: !mobile && (i === 0 || i === 3) ? 18 : 0, rotate: rot, scale: 1 }}
      exit={{ opacity: 0, y: 60, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 110, damping: 14, delay: 0.7 + i * 0.09 }}
      whileHover={{ y: -14, rotate: ROTS[i] * 0.3, scale: 1.05, zIndex: 4 }}
    >
      <div className="wcard bw__stage-card">
        <div className="bw__stage-art">
          {i === 0 && <Bars bars={listBars.slice(0, 3)} />}
          {i === 1 && <ChecklistArt />}
          {i === 2 && <EqArt />}
          {i === 3 && <ChartArt delay={0.9} />}
        </div>
        <span className="hcard__label bw__stage-label">{name}</span>
      </div>
    </motion.div>
  );
}

function EqArt() {
  const H = [18, 29, 23, 42, 31, 23];
  return (
    <>
      {H.map((h, i) => (
        <motion.span
          key={i}
          className={`eq${i === 3 ? " eq--blue" : ""}`}
          style={{ left: u(27 + i * 36), width: u(30), height: u(h), bottom: "auto", top: u(110 - h) }}
          animate={{ scaleY: [1, 1.3, 0.7, 1] }}
          transition={{ duration: 2.4 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}
