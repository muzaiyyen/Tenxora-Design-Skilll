"use client";

import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { opsMap } from "@/lib/content";
import { useMedia, useStageProgress } from "@/lib/hooks";
import { Hills } from "./Scenery";
import { Icon } from "./ui";

type Pt = { d: string };

// where each source card starts before it is "connected" (px, deg)
const scatter = [
  { x: -36, y: -14, r: -8 },
  { x: 48, y: 10, r: 6 },
  { x: -22, y: 30, r: -5 },
];

export default function OperationsMap() {
  const section = useRef<HTMLElement>(null);
  const desktop = useMedia("(min-width: 1024px) and (min-height: 700px)");
  const p = useStageProgress(section, desktop);

  const panel = useRef<HTMLDivElement>(null);
  const srcRefs = useRef<(HTMLDivElement | null)[]>([]);
  const coreRef = useRef<HTMLDivElement>(null);
  const outRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [paths, setPaths] = useState<{ inbound: Pt[]; outbound: Pt[] }>({ inbound: [], outbound: [] });
  const [connected, setConnected] = useState(false);

  useMotionValueEvent(p, "change", (v) => setConnected(v > 0.62));

  // Measure the cards and draw connector curves between them.
  useLayoutEffect(() => {
    const measure = () => {
      const host = panel.current;
      const core = coreRef.current;
      if (!host || !core) return;
      const h = host.getBoundingClientRect();
      // layout positions, ignoring the scatter transforms
      const box = (el: HTMLElement) => {
        const r = { left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight };
        let parent = el.offsetParent as HTMLElement | null;
        while (parent && parent !== host) {
          r.left += parent.offsetLeft;
          r.top += parent.offsetTop;
          parent = parent.offsetParent as HTMLElement | null;
        }
        return r;
      };
      const c = box(core);
      const vertical = c.top > box(srcRefs.current[0]!).top + box(srcRefs.current[0]!).height;
      const curve = (x1: number, y1: number, x2: number, y2: number) =>
        vertical
          ? `M${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`
          : `M${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;
      // stacked on a phone: one line in from the last source and one out to the first output
      const srcs = vertical ? srcRefs.current.slice(-1) : srcRefs.current;
      const outs = vertical ? outRefs.current.slice(0, 1) : outRefs.current;
      const inbound = srcs.map((el, i, all) => {
        const s = box(el!);
        if (vertical) return { d: curve(s.left + s.width / 2, s.top + s.height, c.left + (c.width * (i + 1)) / (all.length + 1), c.top) };
        return { d: curve(s.left + s.width, s.top + s.height / 2, c.left, c.top + (c.height * (i + 1)) / (all.length + 1)) };
      });
      const outbound = outs.map((el, i, all) => {
        const o = box(el!);
        if (vertical) return { d: curve(c.left + (c.width * (i + 1)) / (all.length + 1), c.top + c.height, o.left + o.width / 2, o.top) };
        return { d: curve(c.left + c.width, c.top + (c.height * (i + 1)) / (all.length + 1), o.left, o.top + o.height / 2) };
      });
      void h;
      setPaths({ inbound, outbound });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (panel.current) ro.observe(panel.current);
    return () => ro.disconnect();
  }, []);

  const inDraw = useTransform(p, [0.3, 0.58], [0, 1]);
  const outDraw = useTransform(p, [0.58, 0.8], [0, 1]);
  const coreGlow = useTransform(p, [0.5, 0.65], [0, 1]);
  const outOpacity = useTransform(p, [0.6, 0.8], [0.35, 1]);
  const outScale = useTransform(p, [0.6, 0.8], [0.94, 1]);

  return (
    <section
      ref={section}
      aria-labelledby="map-title"
      className="relative bg-[linear-gradient(180deg,#fff_0%,var(--sky-haze)_18%,#cfe5ff_55%,#bfe0ff_100%)] lg:h-[260vh]"
    >
      <div className="relative flex min-h-[100svh] items-center overflow-hidden py-24 lg:sticky lg:top-0 lg:h-[100svh] lg:py-0">
        <Hills className="h-[34%]" />
        <div className="wrap relative z-10">
          <div ref={panel} className="glass relative rounded-[36px] p-5 md:rounded-[44px] md:p-10" style={{ ["--g-bg" as string]: "rgb(255 255 255 / 0.38)" }}>
            {/* header row */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 md:mb-12">
              <h2 id="map-title" className="t-eyebrow text-black">
                {opsMap.title}
              </h2>
              <p
                className={`chip text-[13px] font-[700] tracking-[0.08em] transition-colors duration-500 ${
                  connected ? "bg-black text-white" : "bg-black/[0.08] text-black"
                }`}
                aria-live="polite"
              >
                <span className={connected ? "pulse-dot" : "h-[10px] w-[10px] rounded-full bg-black/30"} aria-hidden="true" />
                {opsMap.status}
              </p>
            </div>

            {/* connectors */}
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              {paths.inbound.map((pt, i) => (
                <Connector key={`i${i}`} d={pt.d} draw={inDraw} live={connected} />
              ))}
              {paths.outbound.map((pt, i) => (
                <Connector key={`o${i}`} d={pt.d} draw={outDraw} live={connected} />
              ))}
            </svg>

            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr_1fr] lg:items-center lg:gap-16">
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
                {opsMap.sources.map((s, i) => (
                  <SourceCard key={s.name} s={s} i={i} p={p} refCb={(el) => (srcRefs.current[i] = el)} />
                ))}
              </ul>

              <motion.div
                ref={coreRef}
                className="relative mx-auto w-full max-w-[420px] rounded-[32px] bg-black p-6 text-white md:p-8"
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute -inset-[3px] -z-10 rounded-[35px] bg-[var(--tx-treen)]"
                  style={{ opacity: coreGlow }}
                />
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                    <Icon name="erp" />
                  </span>
                  <p className="text-[clamp(40px,4.4vw,64px)] font-[900] leading-none tracking-[-0.04em]">{opsMap.core.name}</p>
                </div>
                <p className="mt-5 text-[20px] font-[650]">{opsMap.core.lines[0]}</p>
                <p className="mt-1 text-[17px] text-white/80">{opsMap.core.lines[1]}</p>
                <div aria-hidden="true" className="mt-6 grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, k) => (
                    <motion.span
                      key={k}
                      className="h-2 rounded-full bg-white/20"
                      style={{ scaleX: useTransform(p, [0.5 + k * 0.02, 0.62 + k * 0.02], [0.2, 1]), originX: 0 }}
                    />
                  ))}
                </div>
              </motion.div>

              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:gap-4">
                {opsMap.outputs.map((o, i) => (
                  <motion.li key={o.name} style={{ opacity: outOpacity, scale: outScale }}>
                    <div ref={(el) => void (outRefs.current[i] = el)} className="glass glass-solid flex items-start gap-4 rounded-[28px] p-5">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--tx-lavender)] text-black">
                        <Icon name={o.icon as "ai" | "report"} />
                      </span>
                      <div>
                        <p className="text-[22px] font-[800] leading-tight tracking-[-0.02em]">{o.name}</p>
                        {o.lines.map((l) => (
                          <p key={l} className="text-[16px] text-[var(--ink-soft)]">
                            {l}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* flow + shifts */}
            <div className="mt-10 flex flex-col items-start gap-3 border-t border-black/10 pt-6 md:mt-14 md:flex-row md:items-center md:justify-between">
              <p className="text-[17px] font-[650]">{opsMap.flow}</p>
              <ul className="flex flex-wrap gap-2">
                {opsMap.shifts.map(([a, b]) => (
                  <Shift key={a} from={a} to={b} p={p} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SourceCard({
  s,
  i,
  p,
  refCb,
}: {
  s: (typeof opsMap.sources)[number];
  i: number;
  p: MotionValue<number>;
  refCb: (el: HTMLDivElement | null) => void;
}) {
  const sc = scatter[i];
  const x = useTransform(p, [0, 0.4], [sc.x, 0]);
  const y = useTransform(p, [0, 0.4], [sc.y, 0]);
  const rotate = useTransform(p, [0, 0.4], [sc.r, 0]);
  return (
    <li>
      <motion.div ref={refCb} style={{ x, y, rotate }} className="glass glass-solid flex items-start gap-4 rounded-[28px] p-5" whileHover={{ scale: 1.03 }}>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-black/[0.06] text-[14px] font-[800]">
          {s.icon === "XL" ? s.icon : <Icon name={s.icon as "mail" | "crm"} />}
        </span>
        <div>
          <p className="text-[22px] font-[800] leading-tight tracking-[-0.02em]">{s.name}</p>
          {s.lines.map((l) => (
            <p key={l} className="text-[16px] text-[var(--ink-soft)]">
              {l}
            </p>
          ))}
        </div>
      </motion.div>
    </li>
  );
}

function Connector({ d, draw, live }: { d: string; draw: MotionValue<number>; live: boolean }) {
  return (
    <g>
      <path d={d} fill="none" stroke="rgb(0 0 0 / 0.08)" strokeWidth="2" strokeDasharray="4 6" />
      <motion.path d={d} fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" style={{ pathLength: draw }} />
      {live && (
        <path d={d} fill="none" stroke="var(--tx-treen)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="10 190" className="[animation:flow_2.2s_linear_infinite]" />
      )}
    </g>
  );
}

function Shift({ from, to, p }: { from: string; to: string; p: MotionValue<number> }) {
  const [on, setOn] = useState(false);
  useMotionValueEvent(p, "change", (v) => setOn(v > 0.7));
  return (
    <li className={`chip transition-colors duration-500 ${on ? "bg-black text-white" : "bg-black/[0.06] text-black"}`}>
      <span className={on ? "text-white/75" : ""}>{from}</span>
      <span>→</span>
      <span>{to}</span>
    </li>
  );
}
