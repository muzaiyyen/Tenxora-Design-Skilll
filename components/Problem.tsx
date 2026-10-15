"use client";

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { problem } from "@/lib/content";
import { asset } from "@/lib/asset";
import { useMedia } from "@/lib/hooks";
import Intro from "./Intro";
import TiltCard from "./TiltCard";

const u = (n: number) => `calc(${n} * var(--u))`;
const FAN = [
  { x: -1, rot: -7, y: 34 },
  { x: 0, rot: 0, y: 0 },
  { x: 1, rot: 7, y: 34 },
];

export default function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const mobile = useMedia("(max-width: 760px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <section className="section on-white" data-header="light" aria-labelledby="problem-title">
      <div className="wrap">
        <Intro
          id="problem-title"
          label={problem.eyebrow}
          heading={problem.heading}
          split={2}
          body={
            <>
              <p>{problem.body[0]}</p>
              <p style={{ marginTop: "0.8em", color: "#000" }}>{problem.body[1]}</p>
            </>
          }
        />

        <div ref={ref} className="capsule problem__sky">
          <img className="problem__sky-img" src={asset("/figma/sky.jpg")} alt="" aria-hidden />
          <div className="problem__cards">
            {problem.cards.map((c, i) => (
              <ProblemCard key={c.n} card={c} i={i} p={p} mobile={mobile} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemCard({
  card,
  i,
  p,
  mobile,
}: {
  card: (typeof problem.cards)[number];
  i: number;
  p: MotionValue<number>;
  mobile: boolean;
}) {
  const f = FAN[i];
  // cards start stacked in the middle and fan out as the section scrolls into place
  const x = useTransform(p, [0, 1], [`${-f.x * 100}%`, "0%"]);
  const rotate = useTransform(p, [0, 1], [f.rot * 0.2, f.rot]);
  const y = useTransform(p, [0, 1], [80, f.y]);
  return (
    <motion.div className="problem__slot" style={mobile ? undefined : { x, rotate, y, zIndex: i === 1 ? 2 : 1 }}>
      <TiltCard className="wcard problem__card">
        <div className="problem__art">{i === 0 ? <SystemsArt /> : i === 1 ? <ManualArt /> : <VisibilityArt />}</div>
        <span className="num">{card.n}</span>
        <h3 className="problem__title">{card.title}</h3>
        <p className="problem__body">{card.body}</p>
      </TiltCard>
    </motion.div>
  );
}

/* 01 · apps floating apart, a broken dashed link between them */
function SystemsArt() {
  const items = [
    { src: "/figma/excel.png", x: 18, y: 26, s: 70 },
    { src: "/figma/gmail.png", x: 150, y: 8, s: 62 },
    { src: "/figma/whatsapp.png", x: 230, y: 70, s: 56 },
  ];
  return (
    <>
      <svg viewBox="0 0 320 150" className="problem__svg" aria-hidden>
        <path d="M70 70 Q120 20 180 40" stroke="rgba(0,0,0,.25)" strokeWidth="2" strokeDasharray="5 7" fill="none" />
        <path d="M200 70 Q230 110 255 98" stroke="rgba(239,75,75,.5)" strokeWidth="2" strokeDasharray="5 7" fill="none" />
      </svg>
      {items.map((it, i) => (
        <motion.img
          key={it.src}
          src={asset(it.src)}
          alt=""
          className="problem__app"
          style={{ left: u(it.x), top: u(it.y), width: u(it.s), height: u(it.s) }}
          animate={{ y: [0, i % 2 ? -8 : 8, 0], x: [0, i % 2 ? 6 : -6, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

/* 02 · the same row typed again and again */
function ManualArt() {
  return (
    <div className="problem__rows">
      {[0, 1, 2, 3].map((r) => (
        <motion.div
          key={r}
          className="problem__row"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + r * 0.18, duration: 0.6 }}
        >
          <span className="bar bar--dark" style={{ position: "relative", width: u(22), display: "inline-block" }} />
          <span className="bar" style={{ position: "relative", width: u(140 - r * 8), display: "inline-block" }} />
          <span className="bar bar--purple" style={{ position: "relative", width: u(36), display: "inline-block" }} />
        </motion.div>
      ))}
      <motion.span
        className="problem__cursor"
        animate={{ y: [0, 0, 1, 1, 2, 2, 3, 3, 0].map((v) => `calc(${v * 34} * var(--u))`) }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* 03 · the chart is there but blurred and late */
function VisibilityArt() {
  return (
    <svg viewBox="0 0 205 119" className="problem__svg problem__blur" aria-hidden>
      <path d="M2 84 C30 92 52 62 88 58 C118 54 126 68 150 60 C176 51 186 22 203 9 L190 117 Z" fill="rgba(26,115,233,.25)" />
      <path d="M2 84 C30 92 52 62 88 58 C118 54 126 68 150 60" stroke="#3b82ec" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M150 60 C176 51 186 22 203 9" stroke="#3b82ec" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 10" fill="none" />
    </svg>
  );
}
