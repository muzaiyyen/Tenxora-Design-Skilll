"use client";

import { motion } from "motion/react";
import { audit as c } from "@/lib/content";
import { Reveal } from "./Reveal";
import { MagneticLink, Roll } from "./ui";

export default function Audit() {
  return (
    <section aria-labelledby="audit-title" className="relative overflow-hidden bg-[var(--tx-treen)] py-24 text-black md:py-36">
      <div className="wrap relative grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="t-eyebrow">{c.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="audit-title" className="t-ultra mt-5 max-w-[12ch]">
              {c.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-body mt-8 max-w-[52ch]">{c.body}</p>
          </Reveal>
        </div>

        <div className="flex flex-col justify-end lg:col-span-5">
          <ul className="grid gap-3">
            {c.checklist.map((item, i) => (
              <motion.li
                key={item}
                className="flex min-h-[64px] items-center gap-4 rounded-[24px] bg-white/45 px-5 py-4 text-[18px] font-[650] md:text-[20px]"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ type: "spring", stiffness: 140, damping: 18, delay: i * 0.18 }}
              >
                <motion.span
                  aria-hidden="true"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-black"
                  initial={{ backgroundColor: "rgba(0,0,0,0)" }}
                  whileInView={{ backgroundColor: "rgba(0,0,0,1)" }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ delay: 0.35 + i * 0.18, duration: 0.25 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <motion.path
                      d="m5 12.5 4.5 4.5L19 7"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ delay: 0.45 + i * 0.18, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </svg>
                </motion.span>
                {item}
              </motion.li>
            ))}
          </ul>
          <Reveal delay={0.2} className="mt-8">
            <MagneticLink href={c.cta.href} className="glass glass-black btn w-full sm:w-auto" strength={0.2}>
              <Roll>{c.cta.label}</Roll>
            </MagneticLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
