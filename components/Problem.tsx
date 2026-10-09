"use client";

import { useReduce } from "@/lib/hooks";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { problem as c } from "@/lib/content";
import { Reveal } from "./Reveal";
import { MiniUI } from "./ui";

export default function Problem() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduce();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 80, reduce ? 0 : -80]);

  return (
    <section ref={ref} aria-labelledby="problem-title" className="on-dark relative overflow-hidden bg-black py-24 text-white md:py-36">
      {/* scattered paperwork drifting in the dark: the weight the copy talks about */}
      <motion.div aria-hidden="true" style={{ y: drift }} className="pointer-events-none absolute inset-0 opacity-[0.22]">
        {[
          { l: "6%", t: "8%", r: -12, k: "invoice" },
          { l: "78%", t: "4%", r: 9, k: "order" },
          { l: "86%", t: "52%", r: -6, k: "stock" },
          { l: "-2%", t: "62%", r: 7, k: "approval" },
        ].map((d, i) => (
          <div
            key={i}
            className="absolute h-[200px] w-[170px] rounded-[28px] border border-white/20 bg-white/[0.06] p-5"
            style={{ left: d.l, top: d.t, transform: `rotate(${d.r}deg)` }}
          >
            <MiniUI kind={d.k as "invoice"} tone="dark" />
          </div>
        ))}
      </motion.div>

      <div className="wrap relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="t-eyebrow text-[var(--tx-lavender)]">{c.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="problem-title" className="t-ultra mt-5 max-w-[11ch]">
                {c.heading}
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-4">
            {c.body.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.05}>
                <p className={`t-body ${i ? "mt-3 font-[650] text-white" : "text-white/80"}`}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <ul className="mt-16 grid gap-4 md:mt-24 md:grid-cols-12 md:gap-5" style={{ perspective: "1200px" }}>
          {c.cards.map((card, i) => (
            <TiltCard key={card.n} card={card} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function TiltCard({ card, i }: { card: (typeof c.cards)[number]; i: number }) {
  const reduce = useReduce();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const big = i === 0;
  const layout = big ? "md:col-span-7 md:row-span-2" : "md:col-span-5";

  return (
    <motion.li
      className={`group relative ${layout}`}
      initial={{ opacity: 0, y: 60, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 80, damping: 16, delay: i * 0.1 }}
    >
      {/* the pile underneath: splays out on hover */}
      <span aria-hidden="true" className="absolute inset-0 translate-y-3 rotate-[-2.5deg] rounded-[32px] border border-white/10 bg-white/[0.05] transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-5 group-hover:rotate-[-5deg]" />
      <span aria-hidden="true" className="absolute inset-0 translate-y-1.5 rotate-[1.8deg] rounded-[32px] border border-white/10 bg-white/[0.07] transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-3 group-hover:rotate-[4deg]" />
      <motion.div
        ref={ref}
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== "mouse" || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        whileTap={{ scale: 0.98 }}
        className={`glass glass-dark relative flex h-full flex-col rounded-[32px] p-7 md:p-9 ${big ? "min-h-[340px] md:min-h-[520px]" : "min-h-[260px]"}`}
      >
        <p className={`font-[900] leading-none tracking-[-0.05em] text-white/90 ${big ? "text-[clamp(72px,10vw,168px)]" : "text-[72px]"}`} style={{ transform: "translateZ(40px)" }}>
          {card.n}
        </p>
        <div className="mt-auto pt-10" style={{ transform: "translateZ(24px)" }}>
          <h3 className={`font-[800] leading-[1.02] tracking-[-0.025em] ${big ? "text-[clamp(30px,3.6vw,52px)]" : "text-[30px]"}`}>{card.title}</h3>
          <p className="mt-3 max-w-[44ch] text-[17px] leading-[1.5] text-white/80">{card.body}</p>
        </div>
      </motion.div>
    </motion.li>
  );
}
