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
    left: r2(6 + col * 18.5 + (rand(i) - 0.5) * 6),
    top: r2(22 + row * 18 + (rand(i + 40) - 0.5) * 8),
    rot: r2((rand(i + 80) - 0.5) * 16),
  };
});
// tangled links between random pains in the "before" state
const TANGLE = Array.from({ length: 14 }, (_, i) => [Math.floor(rand(i + 7) * 20), Math.floor(rand(i + 23) * 20)] as const).filter(
  ([a, b]) => a !== b,
);

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
              <span className="status__dot" style={on ? undefined : { background: "rgba(239,75,75,.7)" }} />
              {on ? beforeWith.withLabel : beforeWith.beforeLabel}
            </span>
          </motion.div>

          {/* before: tangled lines */}
          <svg className="bw__tangle" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {TANGLE.map(([a, b], i) => (
              <motion.path
                key={i}
                d={`M${SCATTER[a].left + 6} ${SCATTER[a].top + 3} Q 50 ${45 + (rand(i) - 0.5) * 50} ${SCATTER[b].left + 6} ${SCATTER[b].top + 3}`}
                fill="none"
                stroke="rgba(239,75,75,.35)"
                strokeWidth="0.15"
                vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: 1.2 }}
                animate={{ pathLength: on ? 0 : 1, opacity: on ? 0 : 1 }}
                transition={{ duration: on ? 0.5 : 1.2, ease, delay: on ? 0 : 0.5 + i * 0.04 }}
              />
            ))}
          </svg>

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
