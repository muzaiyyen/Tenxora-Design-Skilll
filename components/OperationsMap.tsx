"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { opsMapDesign } from "@/lib/content";
import { asset } from "@/lib/asset";
import { useMedia } from "@/lib/hooks";

const ease = [0.22, 1, 0.36, 1] as const;
const u = (n: number) => `calc(${n} * var(--u))`;

/* Paths in capsule coordinates (Figma: capsule 1388 x 316 at x139 y1789). */
const LEFT = [
  { d: "M297 105.5 H406 C446 105.5 452 161 492 161 H580", stroke: "url(#ops-green)" },
  { d: "M333 161 H586", stroke: "url(#ops-red)" },
  { d: "M337.5 216.5 H406 C446 216.5 452 161 492 161 H580", stroke: "url(#ops-green)" },
];
const RIGHT = [
  { d: "M716 161 H821 C861 161 868 105.5 908 105.5 H1021.5", stroke: "url(#ops-yellow)" },
  { d: "M716 161 H821 C861 161 868 216.5 908 216.5 H1021.5", stroke: "url(#ops-yellow)" },
];

export default function OperationsMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  const mobile = useMedia("(max-width: 760px)");

  return (
    <section className="section ops on-white" data-header="light" aria-labelledby="ops-title">
      <div className="wrap">
        <motion.div
          className="label-row ops__head"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, ease }}
        >
          <h2 id="ops-title" style={{ font: "inherit", margin: 0 }}>
            {opsMapDesign.title}
          </h2>
          <span className="status">
            <span className="status__dot" />
            {opsMapDesign.status}
          </span>
        </motion.div>

        <motion.div
          ref={ref}
          className="capsule ops__capsule"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease }}
        >
          {mobile ? <MobileMap play={inView} /> : <DesktopMap play={inView} />}
        </motion.div>
      </div>
    </section>
  );
}

function Gradients() {
  return (
    <defs>
      <linearGradient id="ops-green" x1="0" x2="1">
        <stop offset="0" stopColor="#08e88c" stopOpacity="0.7" />
        <stop offset="1" stopColor="#1fd67a" />
      </linearGradient>
      <linearGradient id="ops-red" x1="0" x2="1">
        <stop offset="0" stopColor="#ef4b4b" />
        <stop offset="0.35" stopColor="#ef4b4b" stopOpacity="0.8" />
        <stop offset="0.7" stopColor="#08e88c" />
      </linearGradient>
      <linearGradient id="ops-yellow" x1="0" x2="1">
        <stop offset="0" stopColor="#08e88c" />
        <stop offset="1" stopColor="#fec700" />
      </linearGradient>
    </defs>
  );
}

function Lines({ play, pulses }: { play: boolean; pulses: boolean }) {
  return (
    <svg viewBox="0 0 1388 316" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} aria-hidden>
      <Gradients />
      {[...LEFT, ...RIGHT].map((l, i) => {
        const right = i >= LEFT.length;
        const delay = right ? 1.25 : 0.45 + i * 0.08;
        return (
          <g key={i}>
            <motion.path
              d={l.d}
              fill="none"
              stroke={l.stroke}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={play ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, ease: [0.65, 0, 0.35, 1], delay }}
            />
            {pulses && play && (
              <path
                d={l.d}
                fill="none"
                stroke={right ? "#fec700" : "#08e88c"}
                strokeWidth="4"
                strokeLinecap="round"
                pathLength={1}
                className="ops-pulse"
                style={{ animationDelay: `${delay + 1 + i * 0.35}s` }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function Icon({ src, x, y, play, delay, bob }: { src: string; x: number; y: number; play: boolean; delay: number; bob: number }) {
  return (
    <motion.div
      className="ops__icon"
      style={{ left: u(x), top: u(y) }}
      initial={{ scale: 0, opacity: 0 }}
      animate={play ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 220, damping: 14, delay }}
      whileHover={{ scale: 1.08 }}
    >
      <motion.img
        src={asset(src)}
        alt=""
        animate={play ? { y: [0, -bob, 0] } : {}}
        transition={{ duration: 4 + bob / 2, repeat: Infinity, ease: "easeInOut", delay: delay + 0.8 }}
      />
    </motion.div>
  );
}

function Sources({ play }: { play: boolean }) {
  return (
    <>
      <Icon src="/figma/whatsapp.png" x={135} y={51} play={play} delay={0.1} bob={5} />
      <Icon src="/figma/gmail.png" x={76} y={156} play={play} delay={0.22} bob={4} />
      <Icon src="/figma/excel.png" x={195} y={156} play={play} delay={0.3} bob={6} />
    </>
  );
}

function Core({ play }: { play: boolean }) {
  return (
    <motion.div
      className="ops__core ops-breathe"
      initial={{ scale: 0.4, opacity: 0 }}
      animate={play ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.05 }}
      whileHover={{ scale: 1.06 }}
    >
      <img src={asset("/brand/wordmark-black.svg")} alt="tenxora" />
    </motion.div>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 32 32" style={{ width: "50%", height: "50%" }} aria-hidden>
      <defs>
        <linearGradient id="ai-star" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#08e88c" />
          <stop offset="1" stopColor="#fec700" />
        </linearGradient>
      </defs>
      <path d="M16 1.5 C17.4 10 22 14.6 30.5 16 C22 17.4 17.4 22 16 30.5 C14.6 22 10 17.4 1.5 16 C10 14.6 14.6 10 16 1.5 Z" fill="url(#ai-star)" />
    </svg>
  );
}

function ReportIcon({ play }: { play: boolean }) {
  return (
    <>
      {[
        { x: 20, h: 28 },
        { x: 30, h: 22 },
        { x: 40, h: 17 },
      ].map((b, i) => (
        <motion.span
          key={i}
          className="lbar"
          style={{ left: u(b.x), height: u(b.h), bottom: u(20) }}
          initial={{ scaleY: 0 }}
          animate={play ? { scaleY: [0, 1, 0.75, 1] } : {}}
          transition={{ duration: 1.4, delay: 1.5 + i * 0.1, ease }}
        />
      ))}
    </>
  );
}

function Outputs({ play, mobile = false }: { play: boolean; mobile?: boolean }) {
  return (
    <>
      {opsMapDesign.outputs.map((o, i) => (
        <motion.div
          key={o.name}
          className="ops__out"
          style={mobile ? { position: "relative", left: 0 } : { top: u(i === 0 ? 72 : 170) }}
          initial={{ opacity: 0, x: 30 }}
          animate={play ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease, delay: 1.6 + i * 0.15 }}
        >
          <motion.span className="ops__badge" whileHover={{ scale: 1.1, rotate: i === 0 ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
            {i === 0 ? <StarIcon /> : <ReportIcon play={play} />}
          </motion.span>
          <span>
            <span className="ops__out-name" style={{ display: "block" }}>
              {o.name}
            </span>
            <span className="ops__out-sub" style={{ display: "block" }}>
              {o.lines.map((l, j) => (
                <span key={j} style={{ display: "block" }}>
                  {l}
                </span>
              ))}
            </span>
          </span>
        </motion.div>
      ))}
    </>
  );
}

function DesktopMap({ play }: { play: boolean }) {
  return (
    <div className="ops__canvas">
      {/* Figma "Group 55": a 55% copy offset behind the map, softened into a glow */}
      <div className="ops__ghost" aria-hidden>
        <Lines play={play} pulses={false} />
        <Sources play={play} />
        <Core play={play} />
      </div>
      <Lines play={play} pulses />
      <Sources play={play} />
      <Core play={play} />
      <Outputs play={play} />
    </div>
  );
}

/* Phone: the same map stacked vertically so the labels stay readable. */
function MobileMap({ play }: { play: boolean }) {
  return (
    <div className="ops-m">
      <div className="ops-m__sources">
        {["/figma/gmail.png", "/figma/whatsapp.png", "/figma/excel.png"].map((s, i) => (
          <motion.img
            key={s}
            src={asset(s)}
            alt=""
            initial={{ scale: 0 }}
            animate={play ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 + i * 0.1 }}
          />
        ))}
      </div>
      <svg viewBox="0 0 240 70" className="ops-m__lines" aria-hidden>
        <Gradients />
        {["M40 0 V18 C40 40 120 30 120 52 V70", "M120 0 V70", "M200 0 V18 C200 40 120 30 120 52 V70"].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke={i === 1 ? "#ef4b4b" : "#08e88c"}
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={play ? { pathLength: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.4 + i * 0.08 }}
          />
        ))}
      </svg>
      <motion.div
        className="ops__core ops-breathe"
        style={{ position: "relative", left: 0, top: 0, width: 150, height: 50 }}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={play ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1 }}
      >
        <img src={asset("/brand/wordmark-black.svg")} alt="tenxora" style={{ width: 96 }} />
      </motion.div>
      <svg viewBox="0 0 240 50" className="ops-m__lines" aria-hidden>
        <Gradients />
        {["M120 0 V12 C120 30 60 24 60 50", "M120 0 V12 C120 30 180 24 180 50"].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="url(#ops-yellow)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={play ? { pathLength: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          />
        ))}
      </svg>
      <div className="ops-m__outs">
        <Outputs play={play} mobile />
      </div>
    </div>
  );
}
