"use client";

import { useReduce } from "@/lib/hooks";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";
import { capabilities as c } from "@/lib/content";
import { Reveal } from "./Reveal";

export default function Capabilities() {
  return (
    <section aria-labelledby="cap-title" className="relative overflow-hidden bg-white pb-24 pt-10 md:pb-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(60%_50%_at_20%_30%,#dcebff_0%,transparent_70%),radial-gradient(50%_50%_at_85%_60%,#e4e7ff_0%,transparent_70%)]" />
      <div className="wrap relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="t-eyebrow text-[var(--tx-blue-ink)]">{c.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="cap-title" className="t-h2 mt-5 max-w-[15ch]">
                {c.heading}
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            {c.body.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.05}>
                <p className={`t-body ${i ? "mt-3 text-[var(--ink-soft)]" : "font-[650]"}`}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:mt-20 lg:grid-cols-12">
          {c.cards.map((card, i) => (
            <Reveal key={card.eyebrow} delay={i * 0.08} className={i === 0 ? "lg:col-span-7" : "lg:col-span-5"}>
              <article
                className={`glass relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-[40px] p-7 md:p-10 ${i === 0 ? "text-white" : "text-black"}`}
                style={{ ["--g-bg" as string]: i === 0 ? "rgb(21 101 207 / 0.94)" : "rgb(191 197 255 / 0.78)" }}
              >
                <p className={`t-eyebrow ${i === 0 ? "text-white" : "text-black"}`}>{card.eyebrow}</p>
                <h3 className="mt-4 max-w-[16ch] text-[clamp(32px,3.6vw,52px)] font-[850] leading-[1] tracking-[-0.035em]">{card.title}</h3>
                <p className={`mt-4 max-w-[42ch] text-[18px] leading-[1.5] ${i === 0 ? "text-white" : "text-black/80"}`}>{card.body}</p>
                <div className="my-8 flex-1">{i === 0 ? <ModuleGrid /> : <FlowLine />}</div>
                <ul className="flex flex-wrap gap-2.5">
                  {card.tags.map((t, k) => (
                    <FloatPill key={t} label={t} k={k} dark={i === 0} />
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FloatPill({ label, k, dark }: { label: string; k: number; dark: boolean }) {
  const reduce = useReduce();
  const ref = useRef<HTMLLIElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 15 });
  return (
    <motion.li
      ref={ref}
      animate={reduce ? undefined : { y: [0, -4, 0] }}
      transition={{ duration: 3 + k * 0.4, repeat: Infinity, ease: "easeInOut", delay: k * 0.3 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.span
        className={`glass chip min-h-[44px] px-5 text-[16px] font-[650] ${dark ? "text-white" : "text-black"}`}
        style={{ x, y, ["--g-bg" as string]: dark ? "rgb(255 255 255 / 0.16)" : "rgb(255 255 255 / 0.55)" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {label}
      </motion.span>
    </motion.li>
  );
}

/** Business modules snapping together into one foundation. Decorative. */
function ModuleGrid() {
  return (
    <div aria-hidden="true" className="grid h-full min-h-[150px] grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, k) => (
        <motion.div
          key={k}
          className="rounded-[20px] border border-white/30 bg-white/10 p-3"
          initial={{ opacity: 0, scale: 0.6, rotate: (k % 2 ? 1 : -1) * 10 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.1 + k * 0.06 }}
        >
          <span className="block h-6 w-6 rounded-[8px] bg-white/80" />
          <span className="mt-3 block h-[6px] w-3/4 rounded-full bg-white/40" />
          <span className="mt-2 block h-[6px] w-1/2 rounded-full bg-white/25" />
        </motion.div>
      ))}
    </div>
  );
}

/** Work moving along a connected line. Decorative. */
function FlowLine() {
  const reduce = useReduce();
  return (
    <div aria-hidden="true" className="relative h-full min-h-[150px]">
      <svg viewBox="0 0 400 150" className="h-full w-full" preserveAspectRatio="none">
        <path id="cap-flow" d="M10 120 C 90 120, 110 30, 200 30 S 310 110, 390 40" fill="none" stroke="rgb(0 0 0 / 0.75)" strokeWidth="2.5" strokeLinecap="round" />
        {[10, 200, 390].map((x, k) => (
          <circle key={k} cx={x} cy={k === 0 ? 120 : k === 1 ? 30 : 40} r="9" fill="#000" />
        ))}
        {!reduce &&
          [0, 1, 2].map((k) => (
            <circle key={k} r="6" fill="#fff" stroke="#000" strokeWidth="2">
              <animateMotion dur="3.6s" begin={`${k * 1.2}s`} repeatCount="indefinite" rotate="auto">
                <mpath href="#cap-flow" />
              </animateMotion>
            </circle>
          ))}
      </svg>
    </div>
  );
}
