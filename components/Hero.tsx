"use client";

import { useReduce } from "@/lib/hooks";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { hero } from "@/lib/content";
import { useIntroDone } from "@/lib/intro";
import { Clouds, Hills, usePointer } from "./Scenery";
import { MagneticLink, MiniUI, Roll } from "./ui";

const cardKinds = ["order", "stock", "approval", "invoice", "report"] as const;

const rise = {
  hidden: { y: "105%" },
  show: (i: number) => ({ y: "0%", transition: { type: "spring" as const, stiffness: 90, damping: 18, delay: 0.08 * i } }),
};
const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 20, delay: 0.25 + 0.07 * i } }),
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const ready = useIntroDone();
  const reduce = useReduce();
  const { x: px, y: py } = usePointer();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const textO = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0]);
  const state = ready ? "show" : "hidden";

  const [line1, line2] = hero.headline;
  const smarter = "smarter.";
  const line2Head = line2.slice(0, line2.length - smarter.length);

  return (
    <section ref={ref} aria-labelledby="hero-title" className="sky relative overflow-hidden text-white">
      <Clouds px={px} />

      <motion.div style={{ y: textY, opacity: textO }} className="wrap relative z-10 flex flex-col items-center pt-[120px] text-center md:pt-[136px]">
        <motion.p
          custom={0}
          variants={fade}
          initial="hidden"
          animate={state}
          className="glass chip t-eyebrow mb-7 !text-[12px] text-white md:mb-9"
          style={{ ["--g-bg" as string]: "rgb(255 255 255 / 0.14)" }}
        >
          <span className="h-[7px] w-[7px] rounded-full bg-white" aria-hidden="true" />
          {hero.eyebrow}
        </motion.p>

        <h1 id="hero-title" className="t-ultra max-w-[14ch] md:max-w-[15ch]">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span className="block" custom={0} variants={rise} initial="hidden" animate={state}>
              {line1}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <motion.span className="block" custom={1} variants={rise} initial="hidden" animate={state}>
              {line2Head}
              <span className="relative inline-block">
                <motion.span
                  aria-hidden="true"
                  className="glass absolute inset-x-[-0.12em] inset-y-[0.04em] -z-0 rounded-[0.32em]"
                  style={{ ["--g-bg" as string]: "rgb(255 255 255 / 0.16)" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: ready ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.55 }}
                />
                <span className="relative">{smarter}</span>
              </span>
            </motion.span>
          </span>
        </h1>

        <motion.p custom={1} variants={fade} initial="hidden" animate={state} className="t-h3 mt-7 max-w-[26ch] font-[650] md:mt-8">
          {hero.lead}
        </motion.p>
        {hero.body.map((p, i) => (
          <motion.p key={i} custom={2 + i} variants={fade} initial="hidden" animate={state} className="t-body mt-4 max-w-[58ch] text-white">
            {p}
          </motion.p>
        ))}

        <motion.div custom={4} variants={fade} initial="hidden" animate={state} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <MagneticLink href={hero.primary.href} className="glass glass-treen btn">
            <Roll>{hero.primary.label}</Roll>
          </MagneticLink>
          <MagneticLink href={hero.secondary.href} className="glass btn text-white" strength={0.2}>
            <Roll>{hero.secondary.label}</Roll>
          </MagneticLink>
        </motion.div>
      </motion.div>

      <CardArc px={px} py={py} progress={scrollYProgress} ready={ready} />

      <div className="relative z-20 mt-10 pb-16 md:mt-16 md:pb-24">
        <ul className="wrap flex flex-wrap justify-center gap-2 md:gap-3" aria-label="Badges">
          {hero.badges.map((b, i) => (
            <motion.li
              key={b}
              custom={6 + i}
              variants={fade}
              initial="hidden"
              animate={state}
              className="glass glass-solid chip text-black"
            >
              <span className="h-[6px] w-[6px] rounded-full bg-[var(--tx-blue)]" aria-hidden="true" />
              {b}
            </motion.li>
          ))}
        </ul>
      </div>

      <Hills px={px} className="z-0 h-[140px] md:h-[200px]" />
    </section>
  );
}

function CardArc({
  px,
  py,
  progress,
  ready,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  progress: MotionValue<number>;
  ready: boolean;
}) {
  const reduce = useReduce();
  const rotY = useTransform(px, (v) => v * 8);
  const rotX = useTransform(py, (v) => -v * 5);
  // as the visitor scrolls on, the arc sinks toward the operations map below
  const sink = useTransform(progress, [0, 1], [0, reduce ? 0 : 90]);
  const spread = useTransform(progress, [0, 1], [1, reduce ? 1 : 1.1]);

  return (
    <div className="relative z-10 mt-14 md:mt-20" style={{ perspective: "1400px" }}>
      <motion.ul
        aria-label="Services"
        className="relative mx-auto flex h-[260px] w-full max-w-[1200px] items-start justify-center md:h-[330px]"
        style={{ rotateY: rotY, rotateX: rotX, y: sink, scale: spread }}
      >
        {hero.services.map((s, i) => {
          const off = i - 2; // -2..2
          return (
            <li
              key={s}
              className="absolute top-0"
              style={{
                left: `calc(50% + clamp(${Math.min(off * 124, off * 226)}px, ${off * 16}vw, ${Math.max(off * 124, off * 226)}px))`,
                transform: `translateX(-50%) translateY(${off * off * 16}px) rotate(${off * 4}deg) scale(${1 - Math.abs(off) * 0.05})`,
                zIndex: 10 - Math.abs(off),
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 160 }}
                animate={ready ? { opacity: 1, y: 0 } : undefined}
                transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.45 + Math.abs(off) * 0.09 }}
              >
                <motion.div
                  className="glass glass-solid flex h-[190px] w-[144px] flex-col rounded-[28px] p-4 text-black md:h-[250px] md:w-[200px] md:rounded-[32px] md:p-5"
                  animate={reduce ? undefined : { y: [0, -10, 0] }}
                  transition={{ duration: 5 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  whileHover={{ scale: 1.06 }}
                >
                  <div className="min-h-0 flex-1">
                    <MiniUI kind={cardKinds[i]} />
                  </div>
                  <p className="mt-3 text-[15px] font-[700] leading-tight tracking-[-0.01em] md:text-[18px]">{s}</p>
                </motion.div>
              </motion.div>
            </li>
          );
        })}
      </motion.ul>
    </div>
  );
}
