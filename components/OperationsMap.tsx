"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { opsMapDesign } from "@/lib/content";
import { asset } from "@/lib/asset";
import { useMedia } from "@/lib/hooks";

const ease = [0.22, 1, 0.36, 1] as const;
const u = (n: number) => `calc(${n} * var(--u))`;

/* Paths in canvas coordinates (Figma capsule 1388 x 316). The canvas is centred in the capsule; the
   tenxora pill sits on its centre line and the sources and outputs keep equal margins to the edges. */
const LEFT = [
  { d: "M291 105.5 H452 C492 105.5 498 161 538 161 H626", stroke: "url(#ops-green)" },
  { d: "M300 161 H632", stroke: "url(#ops-red)" },
  { d: "M351 211 H452 C492 211 498 161 538 161 H626", stroke: "url(#ops-green)" },
];
const RIGHT = [
  { d: "M762 161 H795 C835 161 842 105.5 882 105.5 H1020", stroke: "url(#ops-yellow)" },
  { d: "M762 161 H795 C835 161 842 204 882 204 H1020", stroke: "url(#ops-yellow)" },
];

const DESK_LENSES = [lens("enter-left", { x: 1054, y: 105.5, r: 34 }), lens("enter-left", { x: 1054, y: 204, r: 34 })];

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
      <LensDefs id={pulses ? "d" : "dg"} lenses={DESK_LENSES} />
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
      <Lenses id={pulses ? "d" : "dg"} lenses={DESK_LENSES} play={play} delay={2.1} color="#fff0a0" width={2} />
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
      <Icon src="/figma/whatsapp.png" x={181} y={51} play={play} delay={0.1} bob={5} />
      <Icon src="/figma/gmail.png" x={122} y={156} play={play} delay={0.22} bob={4} />
      <Icon src="/figma/excel.png" x={241} y={156} play={play} delay={0.3} bob={6} />
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
  // bars sized as a share of the badge so the group stays centred at any badge size
  return (
    <span className="lbars" aria-hidden>
      {[28, 22, 17].map((h, i) => (
        <motion.span
          key={i}
          className="lbar"
          style={{ height: `${(h / 28) * 100}%` }}
          initial={{ scaleY: 0 }}
          animate={play ? { scaleY: [0, 1, 0.75, 1] } : {}}
          transition={{ duration: 1.4, delay: 1.5 + i * 0.1, ease }}
        />
      ))}
    </span>
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
  const host = useRef<HTMLDivElement>(null);
  return (
    <div className="ops-m" ref={host}>
      <OutLines host={host} play={play} />
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
        className="ops__core ops-breathe ops-m__core"
        style={{ position: "relative", left: 0, top: 0, width: 150, height: 50 }}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={play ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1 }}
      >
        <img src={asset("/brand/wordmark-black.svg")} alt="tenxora" style={{ width: 96 }} />
      </motion.div>
      {/* spacer: the output lines are drawn by OutLines from measured positions */}
      <div style={{ height: 50 }} aria-hidden />
      <div className="ops-m__outs">
        <Outputs play={play} mobile />
      </div>
    </div>
  );
}

/** Phone: lines from the tenxora pill to each output badge, drawn from measured positions so each one
 * lands on its badge. The second runs on behind the AI badge down to Live Reporting. */
function OutLines({ host, play }: { host: React.RefObject<HTMLDivElement | null>; play: boolean }) {
  const [g, setG] = useState<{ w: number; h: number; d: string[]; lenses: LensShape[] } | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const measure = () => {
      const core = el.querySelector<HTMLElement>(".ops-m__core");
      const badges = el.querySelectorAll<HTMLElement>(".ops__badge");
      if (!core || badges.length < 2) return;
      const box = el.getBoundingClientRect();
      // layout boxes, not transformed ones, so entrance animations don't skew the numbers
      const at = (n: HTMLElement) => {
        let x = 0;
        let y = 0;
        for (let c: HTMLElement | null = n; c && c !== el; c = c.offsetParent as HTMLElement | null) {
          x += c.offsetLeft;
          y += c.offsetTop;
        }
        return { x, y, w: n.offsetWidth, h: n.offsetHeight };
      };
      const c = at(core);
      const b1 = at(badges[0]);
      const b2 = at(badges[1]);
      const sx = c.x + c.w / 2;
      const sy = c.y + c.h;
      const bx = b1.x + b1.w / 2;
      const top1 = b1.y;
      const reach = `M${sx} ${sy} V${sy + 10} C${sx} ${sy + 34} ${bx} ${top1 - 26} ${bx} ${top1}`;
      const r1 = b1.w / 2;
      const r2 = b2.w / 2;
      const c1 = { x: bx, y: b1.y + r1, r: r1 };
      const c2 = { x: b2.x + r2, y: b2.y + r2, r: r2 };
      setG({
        w: box.width,
        h: box.height,
        d: [reach, `M${bx} ${b1.y + b1.h} V${b2.y}`],
        lenses: [lens("through", c1), lens("enter-top", c2)],
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [host]);

  if (!g) return null;
  return (
    <svg className="ops-m__out-lines" viewBox={`0 0 ${g.w} ${g.h}`} aria-hidden>
      <LensDefs id="m" lenses={g.lenses} />
      {g.d.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="#fec700"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={play ? { pathLength: 1 } : {}}
          transition={{ duration: 0.9, delay: 1.2 + i * 0.5 }}
        />
      ))}
      <Lenses id="m" lenses={g.lenses} play={play} delay={1.6} color="#fff0a0" width={2} />
    </svg>
  );
}

/* Light through the glass badges: where a line runs behind a badge it is drawn bent, a touch wider and
   softly blurred, the way a liquid glass lens would refract it, and clipped to the circle. */
type LensShape = { x: number; y: number; r: number; d: string };

function lens(kind: "through" | "enter-top" | "enter-left", c: { x: number; y: number; r: number }): LensShape {
  const { x, y, r } = c;
  const d =
    kind === "through"
      ? `M${x} ${y - r} C${x + r * 0.5} ${y - r * 0.45} ${x + r * 0.5} ${y + r * 0.45} ${x} ${y + r}`
      : kind === "enter-top"
        ? `M${x} ${y - r} C${x + r * 0.45} ${y - r * 0.6} ${x + r * 0.35} ${y - r * 0.1} ${x + r * 0.05} ${y + r * 0.15}`
        : `M${x - r} ${y} C${x - r * 0.6} ${y - r * 0.45} ${x - r * 0.1} ${y - r * 0.35} ${x + r * 0.15} ${y - r * 0.05}`;
  return { x, y, r, d };
}

function LensDefs({ id, lenses }: { id: string; lenses: LensShape[] }) {
  return (
    <defs>
      <filter id={`lens-blur-${id}`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="0.9" />
      </filter>
      {lenses.map((l, i) => (
        <clipPath key={i} id={`lens-clip-${id}-${i}`}>
          <circle cx={l.x} cy={l.y} r={l.r - 0.5} />
        </clipPath>
      ))}
    </defs>
  );
}

function Lenses({ id, lenses, play, delay, color, width }: { id: string; lenses: LensShape[]; play: boolean; delay: number; color: string; width: number }) {
  return (
    <>
      {lenses.map((l, i) => (
        <g key={i} clipPath={`url(#lens-clip-${id}-${i})`}>
          <motion.path
            d={l.d}
            fill="none"
            stroke={color}
            strokeWidth={width * 1.6}
            strokeLinecap="round"
            filter={`url(#lens-blur-${id})`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={play ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: delay + i * 0.5 }}
          />
        </g>
      ))}
    </>
  );
}
