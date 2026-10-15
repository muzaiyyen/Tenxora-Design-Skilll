"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { hero, heroDesign } from "@/lib/content";
import { asset } from "@/lib/asset";
import { Bars, ChartArt, ChecklistArt, listBars } from "./Skeleton";
import Magnetic from "./Magnetic";

const ease = [0.22, 1, 0.36, 1] as const;
const u = (n: number) => `calc(${n} * var(--u))`;

/* Card centres and tilts inside the 1375 x 428 Figma stage ("Frame 3"). */
const CARDS = [
  { key: "erp", cx: 165.74, cy: 239.14, rot: -10, z: 1 },
  { key: "integrations", cx: 431.33, cy: 187.19, rot: -3, z: 2 },
  { key: "automation", cx: 686.75, cy: 167.58, rot: 0, z: 3 },
  { key: "team", cx: 941.33, cy: 187.19, rot: 3, z: 2 },
  { key: "managed", cx: 1209.5, cy: 237.35, rot: 10, z: 1 },
] as const;
const MID = 686.75;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // pointer position over the hero, -1..1, smoothed
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 160, damping: 22, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 160, damping: 22, mass: 0.5 });

  const skyY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const skyScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);
  const skyX = useTransform(sx, [-1, 1], [14, -14]);
  const copyY = useTransform(scrollYProgress, [0, 0.6], [0, -120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const stageRX = useTransform(sy, [-1, 1], [7, -7]);
  const stageRY = useTransform(sx, [-1, 1], [-9, 9]);
  const spread = useTransform(scrollYProgress, [0, 0.7], [0, 1]);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section ref={ref} className="hero on-sky" data-header="dark" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div className="hero__sky" style={{ y: skyY, scale: skyScale, x: skyX }} aria-hidden>
        <img src={asset("/figma/sky.jpg")} alt="" fetchPriority="high" />
      </motion.div>

      <motion.div className="hero__copy wrap" style={{ y: copyY, opacity: copyOpacity }}>
        <p className="sr-only">{hero.eyebrow}</p>
        <h1 className="h-display hero__h1">
          <Line i={0}>{heroDesign.headline[0]}</Line>
          <Line i={1} className="dim-white">
            {heroDesign.headline[1]}
          </Line>
          <Line i={2}>
            {heroDesign.headline[2]}
            <Smarter>{heroDesign.headline[3]}</Smarter>
          </Line>
        </h1>

        <motion.p
          className="lead hero__lead"
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease, delay: 1.05 }}
        >
          {heroDesign.lead[0]}
          <br />
          {heroDesign.lead[1]}
        </motion.p>

        <motion.div
          className="body hero__body"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 1.2 }}
        >
          <p>{hero.body[0]}</p>
          <p>{hero.body[1]}</p>
        </motion.div>
      </motion.div>

      <div className="hero__stage-wrap">
        <motion.div className="hero__stage" style={{ rotateX: stageRX, rotateY: stageRY }}>
          {CARDS.map((c, i) => (
            <HeroCard key={c.key} card={c} index={i} sx={sx} sy={sy} spread={spread} />
          ))}
        </motion.div>
      </div>

      <motion.div
        className="hero__ctas"
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 18, delay: 1.9 }}
      >
        <Magnetic>
          <a href={heroDesign.primary.href} className="pill pill--green glass">
            <span style={{ position: "relative", zIndex: 2 }}>{heroDesign.primary.label}</span>
          </a>
        </Magnetic>
        <Magnetic>
          <a href={heroDesign.secondary.href} className="pill pill--ghost glass">
            <span style={{ position: "relative", zIndex: 2 }}>{heroDesign.secondary.label}</span>
          </a>
        </Magnetic>
      </motion.div>
    </section>
  );
}

function Line({ i, className, children }: { i: number; className?: string; children: React.ReactNode }) {
  return (
    <motion.span
      className={`line ${className ?? ""}`}
      initial={{ opacity: 0, y: 46, filter: "blur(14px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.2, ease, delay: 0.25 + i * 0.14 }}
    >
      {children}
    </motion.span>
  );
}

/** "Smarter" on the Figma treen block: the block sweeps in, then the word flips to black. */
function Smarter({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      className="smarter"
      initial={{ color: "#ffffff" }}
      animate={{ color: "#000000" }}
      transition={{ duration: 0.35, delay: 1.05 }}
    >
      <motion.span
        className="smarter__hl"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1], delay: 0.8 }}
        aria-hidden
      />
      {children}
    </motion.span>
  );
}

type Card = (typeof CARDS)[number];

function HeroCard({
  card,
  index,
  sx,
  sy,
  spread,
}: {
  card: Card;
  index: number;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  spread: MotionValue<number>;
}) {
  const [hover, setHover] = useState(false);
  const off = (card.cx - MID) / MID; // -1 (far left) .. 1 (far right)
  const depth = 1 - Math.abs(off) * 0.6;

  // parallax: nearer cards (centre) move more with the pointer
  const px = useTransform(sx, [-1, 1], [-18 * depth, 18 * depth]);
  const py = useTransform(sy, [-1, 1], [-10 * depth, 10 * depth]);
  // scrolling away fans the cards wider and lifts them
  const spreadX = useTransform(spread, [0, 1], [0, off * 120]);
  const spreadY = useTransform(spread, [0, 1], [0, -60 - Math.abs(off) * 40]);
  const spreadR = useTransform(spread, [0, 1], [0, card.rot * 0.6]);
  const x = useTransform([px, spreadX], ([a, b]: number[]) => a + b);
  const y = useTransform([py, spreadY], ([a, b]: number[]) => a + b);

  const delay = 1.25 + Math.abs(index - 2) * 0.12;
  // once the entrance has played, hover responds immediately
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), (delay + 1.6) * 1000);
    return () => clearTimeout(t);
  }, [delay]);
  const d = ready ? 0 : delay;

  return (
    <motion.div
      className="hcard"
      style={{ left: u(card.cx), top: u(card.cy), zIndex: hover ? 10 : card.z, x, y, rotate: spreadR }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <motion.div
        style={{ position: "absolute", inset: 0 }}
        initial={{ opacity: 0, x: `${((MID - card.cx) / 277.493) * 100}%`, y: 140, rotate: 0, scale: 0.82 }}
        animate={{
          opacity: 1,
          x: "0%",
          y: hover ? -22 : 0,
          rotate: hover ? card.rot * 0.35 : card.rot,
          scale: hover ? 1.06 : 1,
        }}
        transition={{
          opacity: { duration: 0.6, delay },
          x: { type: "spring", stiffness: 70, damping: 15, delay },
          y: ready ? { type: "spring", stiffness: 260, damping: 20 } : { type: "spring", stiffness: 80, damping: 15, delay: d },
          rotate: { type: "spring", stiffness: ready ? 220 : 120, damping: ready ? 18 : 14, delay: d },
          scale: { type: "spring", stiffness: 260, damping: 20, delay: d },
        }}
      >
        <CardFace k={card.key} delay={delay} />
      </motion.div>
    </motion.div>
  );
}

function CardFace({ k, delay }: { k: Card["key"]; delay: number }) {
  const labels = heroDesign.cards;
  if (k === "automation") return <AutomationCard label={labels[2]} />;
  return (
    <div className="wcard" style={{ position: "absolute", inset: 0 }}>
      {k === "erp" && <Bars bars={listBars} delay={0.2} />}
      {k === "team" && <Bars bars={listBars} delay={0.6} />}
      {k === "integrations" && <ChecklistArt />}
      {k === "managed" && <ChartArt delay={delay + 0.5} />}
      <span className="hcard__label">
        {k === "erp" && labels[0]}
        {k === "integrations" && labels[1]}
        {k === "team" && (
          <>
            Team
            <br />
            Augmentation
          </>
        )}
        {k === "managed" && (
          <>
            Managed
            <br />
            Operations
          </>
        )}
      </span>
    </div>
  );
}

const EQ = [
  { x: 35.34, h: 18.02, w: 33.34 },
  { x: 70.48, h: 28.83, w: 34.24 },
  { x: 107, h: 23, w: 33 },
  { x: 141.65, h: 42.34, w: 33.34, blue: true },
  { x: 176.79, h: 30.63, w: 34.24 },
  { x: 212.83, h: 23.42, w: 33.34 },
];

function AutomationCard({ label }: { label: string }) {
  return (
    <div className="hcard--image" style={{ position: "absolute", inset: 0 }}>
      <img src={asset("/figma/automation-card.png")} alt="" />
      <div className="hcard__panel" />
      {EQ.map((b, i) => (
        <motion.span
          key={i}
          className={`eq${b.blue ? " eq--blue" : ""}`}
          style={{ left: u(b.x), width: u(b.w), height: u(b.h) }}
          animate={{ scaleY: b.blue ? [1, 0.7, 1.08, 1] : [1, 1.35, 0.7, 1] }}
          transition={{ duration: 2.6 + i * 0.27, repeat: Infinity, ease: "easeInOut", delay: 2 + i * 0.15 }}
        />
      ))}
      <span className="hcard__label" style={{ left: u(27.23), top: u(283.5), bottom: "auto" }}>
        {label}
      </span>
    </div>
  );
}
