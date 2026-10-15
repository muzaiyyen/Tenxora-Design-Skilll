"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { framework } from "@/lib/content";
import { useMedia } from "@/lib/hooks";
import Intro from "./Intro";
import { Bars, ChartArt, ChecklistArt } from "./Skeleton";

const u = (n: number) => `calc(${n} * var(--u))`;
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * How we work: on desktop the section pins and the five steps glide past horizontally,
 * a treen line filling as each step becomes active. On phones it is a simple stack.
 */
export default function Framework() {
  const mobile = useMedia("(max-width: 760px)");
  return (
    <section id="tx-framework" className="fw on-white" data-header="light" aria-labelledby="fw-title">
      {mobile ? <Stack /> : <Pinned />}
    </section>
  );
}

function Head() {
  return (
    <Intro id="fw-title" label={framework.eyebrow} heading={framework.heading} split={3} body={<p>{framework.body}</p>} />
  );
}

function Pinned() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });
  const x = useTransform(p, [0.05, 0.95], ["0%", "-27%"]);
  const fill = useTransform(p, [0.05, 0.95], [0, 1]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(4, Math.max(0, Math.floor(((v - 0.05) / 0.9) * 5))));
  });

  return (
    <div ref={ref} className="fw__pin-wrap">
      <div className="fw__sticky">
        <div className="section" style={{ paddingTop: u(120) }}>
          <div className="wrap">
            <Head />
            <div className="capsule fw__capsule">
              <svg className="fw__line" viewBox="0 0 1000 4" preserveAspectRatio="none" aria-hidden>
                <line x1="0" y1="2" x2="1000" y2="2" stroke="rgba(0,0,0,.08)" strokeWidth="4" />
                <motion.line x1="0" y1="2" x2="1000" y2="2" stroke="#08e88c" strokeWidth="4" style={{ pathLength: fill }} />
              </svg>
              <motion.ol className="fw__track" style={{ x }}>
                {framework.steps.map((s, i) => (
                  <Step key={s.n} step={s} i={i} active={i === active} done={i < active} />
                ))}
              </motion.ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stack() {
  return (
    <div className="section">
      <div className="wrap">
        <Head />
        <ol className="fw__stack">
          {framework.steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease }}
            >
              <Step step={s} i={i} active done={false} />
            </motion.div>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Step({ step, i, active, done }: { step: (typeof framework.steps)[number]; i: number; active: boolean; done: boolean }) {
  return (
    <motion.li
      className="fw__step"
      animate={{ y: active ? -14 : 0, scale: active ? 1.03 : 1, opacity: active || done ? 1 : 0.6 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
    >
      <div className="wcard fw__card">
        <span className="fw__node" data-on={active || done} />
        <div className="fw__art">
          <StepArt i={i} />
        </div>
        <span className={`num${active || done ? " num--green" : ""}`}>{step.n}</span>
        <h3 className="fw__name">{step.name}</h3>
        <p className="fw__body">{step.body}</p>
      </div>
    </motion.li>
  );
}

function StepArt({ i }: { i: number }) {
  if (i === 0)
    return (
      <>
        <Bars
          bars={[
            { x: 27, y: 30, w: 86.5, tone: "dark" },
            { x: 27, y: 55, w: 140 },
            { x: 27, y: 80, w: 110 },
            { x: 27, y: 104, w: 70 },
          ]}
        />
        <motion.span
          className="fw__lens"
          animate={{ x: [0, 60, 20, 0].map((v) => `calc(${v} * var(--u))`), y: [0, 20, 50, 0].map((v) => `calc(${v} * var(--u))`) }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </>
    );
  if (i === 1)
    return (
      <Bars
        bars={[
          { x: 27, y: 30, w: 160, tone: "dark" },
          { x: 27, y: 55, w: 60 },
          { x: 27, y: 80, w: 100, tone: "purple" },
        ]}
      />
    );
  if (i === 2) return <ChecklistArt />;
  if (i === 3) return <AutoArt />;
  return <ChartArt />;
}

function AutoArt() {
  const H = [18, 29, 23, 42, 31, 23];
  return (
    <>
      {H.map((h, i) => (
        <motion.span
          key={i}
          className={`eq${i === 3 ? " eq--blue" : ""}`}
          style={{ left: u(27 + i * 36), width: u(30), height: u(h), bottom: "auto", top: u(120 - h) }}
          animate={{ scaleY: [1, 1.35, 0.7, 1] }}
          transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}
