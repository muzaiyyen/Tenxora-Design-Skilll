"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { framework as c } from "@/lib/content";
import { useMedia } from "@/lib/hooks";
import { Reveal } from "./Reveal";

export default function Framework() {
  const desktop = useMedia("(min-width: 1024px) and (min-height: 680px)");
  return (
    <section id="tx-framework" aria-labelledby="fw-title" className="on-dark relative bg-black text-white">
      <div className="wrap pt-24 md:pt-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="t-eyebrow text-[var(--tx-lavender)]">{c.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="fw-title" className="t-h2 mt-5 max-w-[16ch]">
                {c.heading}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="t-body text-white/80">{c.body}</p>
          </Reveal>
        </div>
      </div>
      {desktop ? <StickySteps /> : <StackedSteps />}
      {/* black hands off to open sky, then to the white capabilities section */}
      <div aria-hidden="true" className="relative h-[34vh] min-h-[220px] bg-[linear-gradient(180deg,#000_0%,#062a66_30%,#1a6fe0_58%,#9fcbff_80%,#fff_100%)]" />
    </section>
  );
}

function StickySteps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(c.steps.length - 1, Math.floor(v * c.steps.length))));
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const y = top + span * ((i + 0.5) / c.steps.length);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div ref={ref} style={{ height: `${c.steps.length * 85 + 15}vh` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="wrap grid grid-cols-12 items-center gap-10">
          <ol className="col-span-6" aria-label={c.eyebrow}>
            {c.steps.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.n}>
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    aria-current={on ? "step" : undefined}
                    className="group flex min-h-[44px] w-full items-center gap-5 py-1 text-left"
                  >
                    <span className="relative grid h-5 w-5 place-items-center" aria-hidden="true">
                      <motion.span
                        className="block h-3 w-3 rounded-full bg-[var(--tx-treen)]"
                        initial={false}
                        animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 26 }}
                      />
                    </span>
                    <motion.span
                      className="block origin-left text-[clamp(44px,5.6vw,92px)] font-[850] leading-[1.02] tracking-[-0.04em]"
                      initial={false}
                      animate={{ opacity: on ? 1 : 0.5, x: on ? 8 : 0, scale: on ? 1 : 0.94 }}
                      transition={{ type: "spring", stiffness: 260, damping: 26 }}
                    >
                      {s.name}
                    </motion.span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="col-span-6">
            <div className="relative h-[460px]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={active}
                  className="glass glass-dark absolute inset-0 flex flex-col rounded-[40px] p-10"
                  initial={{ opacity: 0, y: 80, rotateX: -18, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -60, scale: 0.96, transition: { duration: 0.25 } }}
                  transition={{ type: "spring", stiffness: 140, damping: 20 }}
                  style={{ transformPerspective: 1200 }}
                >
                  <StepCard i={active} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-6 h-[3px] w-full overflow-hidden rounded-full bg-white/15" aria-hidden="true">
              <motion.div className="h-full origin-left rounded-full bg-white" style={{ scaleX: bar }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StackedSteps() {
  return (
    <ol className="wrap mt-14 grid gap-4 pb-8">
      {c.steps.map((s, i) => (
        <Reveal as="li" key={s.n} delay={0.04 * i}>
          <div className="glass glass-dark flex flex-col rounded-[32px] p-7">
            <StepCard i={i} compact />
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

function StepCard({ i, compact = false }: { i: number; compact?: boolean }) {
  const s = c.steps[i];
  return (
    <>
      <div className="flex items-start justify-between">
        <span className="text-[15px] font-[700] tracking-[0.1em] text-white/70">{s.n}</span>
        <StepVisual i={i} />
      </div>
      <div className={compact ? "mt-8" : "mt-auto"}>
        <h3 className={`font-[850] leading-none tracking-[-0.03em] ${compact ? "text-[40px]" : "text-[56px]"}`}>{s.name}</h3>
        <p className="mt-4 max-w-[36ch] text-[18px] leading-[1.5] text-white/80">{s.body}</p>
      </div>
    </>
  );
}

/** Small abstract diagram per step: map, strip back, foundation, automate, scale. */
function StepVisual({ i }: { i: number }) {
  const common = "h-[96px] w-[140px] md:h-[120px] md:w-[180px]";
  const dot = "rgb(255 255 255 / 0.85)";
  const dim = "rgb(255 255 255 / 0.25)";
  const visuals = [
    // understand: nodes being mapped
    <svg key="u" viewBox="0 0 180 120" className={common} aria-hidden="true">
      {[
        [20, 30],
        [80, 18],
        [150, 40],
        [50, 90],
        [120, 96],
      ].map(([x, y], k, a) => (
        <g key={k}>
          {k > 0 && <line x1={a[k - 1][0]} y1={a[k - 1][1]} x2={x} y2={y} stroke={dim} strokeWidth="2" strokeDasharray="4 5" />}
          <circle cx={x} cy={y} r="7" fill={dot} />
        </g>
      ))}
    </svg>,
    // simplify: many steps reduced to few
    <svg key="s" viewBox="0 0 180 120" className={common} aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <rect key={k} x={10 + k * 28} y={k % 2 ? 30 : 70} width="20" height="20" rx="6" fill={k % 2 ? dim : dot} />
      ))}
      <path d="M20 80 L 160 80" stroke={dot} strokeWidth="2" />
    </svg>,
    // systemize: foundation blocks
    <svg key="y" viewBox="0 0 180 120" className={common} aria-hidden="true">
      <rect x="20" y="84" width="140" height="22" rx="8" fill={dot} />
      <rect x="30" y="56" width="56" height="22" rx="8" fill={dim} />
      <rect x="94" y="56" width="56" height="22" rx="8" fill={dim} />
      <rect x="60" y="28" width="60" height="22" rx="8" fill={dim} />
    </svg>,
    // automate: loop
    <div key="a" className={`${common} grid place-items-center`} aria-hidden="true">
      <motion.div className="text-white/85" animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
        <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3" />
          <path d="M18 3v4h-4M6 21v-4h4" />
        </svg>
      </motion.div>
    </div>,
    // scale: rising bars
    <div key="c" className={`${common} flex items-end gap-2`} aria-hidden="true">
      {[30, 45, 60, 78, 100].map((h, k) => (
        <motion.span
          key={k}
          className="flex-1 rounded-[8px]"
          style={{ background: k === 4 ? "white" : dim, originY: 1 }}
          initial={{ scaleY: 0.2, height: `${h}%` }}
          animate={{ scaleY: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.1 + k * 0.06 }}
        />
      ))}
    </div>,
  ];
  return visuals[i];
}
