"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { beforeWith } from "@/lib/content";
import { asset } from "@/lib/asset";
import { useMedia } from "@/lib/hooks";
import Intro from "./Intro";
import { Bars, ChartArt, ChecklistArt, listBars } from "./Skeleton";

const ease = [0.22, 1, 0.36, 1] as const;
const u = (n: number) => `calc(${n} * var(--u))`;

// deterministic scatter so server and client agree
function rand(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
const SCATTER = beforeWith.pains.map((_, i) => {
  const col = i % 5;
  const row = Math.floor(i / 5);
  const r2 = (n: number) => Math.round(n * 100) / 100;
  return {
    left: r2(5 + col * 18.8 + (rand(i) - 0.5) * 2.4),
    top: r2(22 + row * 18 + (rand(i + 40) - 0.5) * 8),
    rot: r2((rand(i + 80) - 0.5) * 16),
  };
});
// tangled links between pains: each pain is tied to one or two others across the card
const TANGLE: (readonly [number, number])[] = [];
for (let i = 0; i < 20; i++) {
  const add = (b: number) => {
    if (b !== i && !TANGLE.some(([x, y]) => (x === i && y === b) || (x === b && y === i))) TANGLE.push([i, b] as const);
  };
  add((i * 7 + 3) % 20);
  if (i % 3 === 0) add((i + 9) % 20);
}

export default function BeforeWith() {
  const [on, setOn] = useState(false);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.55 });
  const mobile = useMedia("(max-width: 760px)");
  // phones: the pills pop in one by one the first time the panel scrolls in
  const listRef = useRef<HTMLUListElement>(null);
  const seen = useInView(listRef, { amount: 0.2, once: true });
  // how far each pill travels to reach the middle of the panel when it is pulled into tenxora
  const [pull, setPull] = useState<{ x: number; y: number }[]>([]);
  const [stackH, setStackH] = useState(0);
  useEffect(() => {
    const ul = listRef.current;
    if (!ul || !mobile) return;
    const measure = () => {
      const cx = ul.clientWidth / 2;
      const cy = Math.min(ul.clientHeight / 2, 230);
      setStackH(ul.offsetHeight);
      setPull(
        Array.from(ul.children as HTMLCollectionOf<HTMLElement>, (li) => ({
          x: Math.round(cx - (li.offsetLeft + li.offsetWidth / 2)),
          y: Math.round(cy - (li.offsetTop + li.offsetHeight / 2)),
        })),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ul);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [mobile]);

  // phones: the pill nearest the middle of the screen turns into dark liquid glass as the page scrolls;
  // a finger or pointer on a pill takes over. Written straight to CSS variables, so scrolling never re-renders.
  useEffect(() => {
    const ul = listRef.current;
    if (!ul || !mobile) return;
    let hot = -1;
    let raf = 0;
    const items = () => Array.from(ul.querySelectorAll<HTMLElement>(".bw__pain-glass"));
    const frame = () => {
      raf = 0;
      const focus = window.innerHeight * 0.48;
      items().forEach((el, i) => {
        const r = el.getBoundingClientRect();
        let p = 1 - Math.abs(r.top + r.height / 2 - focus) / 64;
        p = Math.max(0, Math.min(1, p));
        p = p * p * (3 - 2 * p);
        if (hot >= 0) p = hot === i ? 1 : 0;
        el.style.setProperty("--p", p.toFixed(3));
        // colour only flips on the pill that is really in focus, so its neighbours stay clean coral
        const c = p > 0.45 ? Math.min(1, (p - 0.45) / 0.45) : 0;
        el.style.setProperty("--c", c.toFixed(3));
        (el.closest("li") as HTMLElement).style.zIndex = p > 0.5 ? "40" : String(i + 1);
      });
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const pick = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest?.(".bw__pain-glass");
      const next = el ? items().indexOf(el as HTMLElement) : -1;
      if (next !== hot) {
        hot = next;
        kick();
      }
    };
    const drop = () => {
      hot = -1;
      kick();
    };
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    ul.addEventListener("pointerover", pick);
    ul.addEventListener("pointerdown", pick);
    ul.addEventListener("pointerleave", drop);
    ul.addEventListener("pointercancel", drop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      ul.removeEventListener("pointerover", pick);
      ul.removeEventListener("pointerdown", pick);
      ul.removeEventListener("pointerleave", drop);
      ul.removeEventListener("pointercancel", drop);
    };
  }, [mobile]);

  // flip once by itself after the visitor has had a look at the mess (desktop only: on phones the cards wait for a tap)
  useEffect(() => {
    if (!inView || touched || mobile) return;
    const t = setTimeout(() => setOn(true), 2600);
    return () => clearTimeout(t);
  }, [inView, touched, mobile]);

  const set = (v: boolean) => {
    setTouched(true);
    setOn(v);
  };

  return (
    <section className="section bw on-white" data-header="light" aria-labelledby="bw-title">
      <div className="wrap">
        <Intro
          id="bw-title"
          label={beforeWith.kicker}
          heading={beforeWith.heading}
          split={4}
          body={<p>{beforeWith.body}</p>}
          aside={mobile ? undefined : <Switch on={on} set={set} />}
        />

        {/* phones: the switch sits right on top of the panel it controls */}
        {mobile && (
          <div className="bw__switch-row">
            <Switch on={on} set={set} />
          </div>
        )}

        <motion.div
          ref={ref}
          className="capsule bw__capsule"
          aria-live="polite"
          // phones: the tall pill stack folds down to fit the four cards once tenxora is on
          animate={mobile && stackH ? { height: on ? 680 : stackH } : undefined}
          transition={{ duration: 0.7, ease, delay: on ? 0.3 : 0 }}
        >
          <motion.div className="bw__state-label" key={on ? "with" : "before"} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <span className="status">
              <span className={`status__dot${on ? "" : " status__dot--red"}`} />
              <span className="status__text">{on ? beforeWith.withLabel : beforeWith.beforeLabel}</span>
            </span>
          </motion.div>

          {/* before: tangled threads running from pain to pain */}
          {!mobile && <Tangle on={on} host={ref} />}

          {/* the 20 pains: scattered before, pulled into tenxora with */}
          <ul ref={listRef} className="bw__pains">
            {beforeWith.pains.map((p, i) => {
              if (mobile) return <MobilePain key={`m-${p}`} text={p} i={i} on={on} pull={pull[i]} />;
              const s = SCATTER[i];
              const pos = { left: `${s.left}%`, top: `${s.top}%` };
              return (
                <motion.li
                  key={p}
                  className="bw__pain"
                  initial={false}
                  animate={
                    on
                      ? { left: "50%", top: "50%", x: "-50%", y: "-50%", opacity: 0, scale: 0.3, rotate: 0 }
                      : { ...pos, x: "0%", y: "0%", opacity: 1, scale: 1, rotate: s.rot }
                  }
                  transition={{ type: "spring", stiffness: 90, damping: 16, delay: on ? i * 0.02 : 0.1 + i * 0.03 }}
                  whileHover={on ? undefined : { scale: 1.08, rotate: 0, zIndex: 5 }}
                >
                  <span className="bw__pain-dot" />
                  {p}
                </motion.li>
              );
            })}
          </ul>

          {/* with: tenxora, the flow and the four stages */}
          <AnimatePresence>
            {on && (
              <motion.div key="with" className="bw__with" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                {mobile ? (
                  <span className="sr-only">{beforeWith.withBrand}</span>
                ) : (
                  <motion.div
                    className="bw__brand ops-breathe"
                    initial={{ scale: 0.3, opacity: mobile ? 0 : 1 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.3, opacity: mobile ? 0 : 1 }}
                    transition={
                      mobile
                        ? { type: "spring", stiffness: 300, damping: 18, delay: 0.45 }
                        : { type: "spring", stiffness: 180, damping: 13, delay: 0.25 }
                    }
                  >
                    <img src={asset("/brand/wordmark-black.svg")} alt="" />
                    <span className="sr-only">{beforeWith.withBrand}</span>
                  </motion.div>
                )}
                {mobile ? (
                  <Deck />
                ) : (
                  <div className="bw__stages">
                    {beforeWith.withStages.map((st, i) => (
                      <StageCard key={st} name={st} i={i} mobile={mobile} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// the Figma stack: every pill centred, each a little off-level, overlapping the one above
const STACK = beforeWith.pains.map((_, i) => ({
  rot: Math.round((rand(i + 7) - 0.5) * 6 * 10) / 10,
}));

/** One phone pill: pops in as it scrolls into view, floats while idle, and is pulled into tenxora on "With". */
function MobilePain({ text, i, on, pull }: { text: string; i: number; on: boolean; pull?: { x: number; y: number } }) {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const d = pull ?? { x: 0, y: 0 };
  const n = beforeWith.pains.length;
  const st = STACK[i];
  return (
    <motion.li
      ref={ref}
      className="bw__pain"
      initial={{ opacity: 0, scale: 0.4, y: 26, filter: "blur(8px)" }}
      animate={
        on
          ? { opacity: 0, scale: 0.2, x: d.x, y: d.y, filter: "blur(10px)" }
          : seen
            ? { opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" }
            : { opacity: 0, scale: 0.4, x: 0, y: 26, filter: "blur(8px)" }
      }
      transition={
        on
          ? { duration: 0.55, ease: [0.55, 0, 0.75, 0.2], delay: (n - 1 - i) * 0.018 }
          : {
              default: { type: "spring", stiffness: 340, damping: 20, mass: 0.8, delay: 0.04 * (i % 3) },
              opacity: { duration: 0.25, delay: 0.04 * (i % 3) },
              filter: { duration: 0.35, delay: 0.04 * (i % 3) },
            }
      }
    >
      <span className="bw__pain-float" style={{ animationDelay: `${-(i * 0.73) % 5}s`, ["--rot" as string]: `${st.rot}deg` }}>
        <span className="bw__pain-glass">{text}</span>
      </span>
    </motion.li>
  );
}

function Switch({ on, set }: { on: boolean; set: (v: boolean) => void }) {
  return (
    <span className="switch" role="group" aria-label="Compare">
      <motion.span
        className="switch__thumb"
        layout
        style={{ left: on ? "50%" : u(4), right: on ? u(4) : "50%" }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
      />
      <button type="button" aria-pressed={!on} onClick={() => set(false)} style={{ width: "50%" }}>
        {beforeWith.before}
      </button>
      <button type="button" aria-pressed={on} onClick={() => set(true)} style={{ width: "50%" }}>
        {beforeWith.with}
      </button>
    </span>
  );
}

const ROTS = [-8, -3, 3, 8];
/** Curves drawn between the real centres of the pain pills (measured from layout), so every thread
 * starts and ends under a pill and the knot reads as connections, not loose strokes. */
function Tangle({ on, host }: { on: boolean; host: React.RefObject<HTMLDivElement | null> }) {
  const [box, setBox] = useState<{ w: number; h: number; pts: { x: number; y: number }[] } | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const measure = () => {
      const pills = el.querySelectorAll<HTMLElement>(".bw__pain");
      const pts = Array.from(pills, (p) => ({ x: p.offsetLeft + p.offsetWidth / 2, y: p.offsetTop + p.offsetHeight / 2 }));
      setBox({ w: el.clientWidth, h: el.clientHeight, pts });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [host]);

  if (!box || box.pts.length < 20) return null;
  return (
    <svg className="bw__tangle" viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden>
      {TANGLE.map(([a, b], i) => {
        const A = box.pts[a];
        const B = box.pts[b];
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        // perpendicular swing, opposite at each end, so threads bow, cross and loop past each other
        const k1 = (rand(i + 3) - 0.5) * 0.9;
        const k2 = (rand(i + 11) - 0.5) * 0.9;
        // control points stay inside the card so no thread runs off the edge
        const cx = (x: number) => Math.min(box.w - 40, Math.max(40, x));
        const cy = (y: number) => Math.min(box.h - 30, Math.max(110, y));
        const c1 = `${cx(A.x + dx * 0.3 - dy * k1)} ${cy(A.y + dy * 0.3 + dx * k1)}`;
        const c2 = `${cx(A.x + dx * 0.7 + dy * k2)} ${cy(A.y + dy * 0.7 - dx * k2)}`;
        return (
          <motion.path
            key={i}
            d={`M${A.x} ${A.y} C${c1} ${c2} ${B.x} ${B.y}`}
            fill="none"
            stroke="rgba(239,75,75,.32)"
            strokeWidth={1.4}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: on ? 0 : 1, opacity: on ? 0 : 1 }}
            transition={{ duration: on ? 0.5 : 1.4, ease, delay: on ? 0 : 0.6 + i * 0.04 }}
          />
        );
      })}
    </svg>
  );
}

/* ---------- Phone deck: the four stages as a looping 3D card stack ----------
   Upcoming cards wait above, tilted back so only their top edges show; the front card sits flat in the
   middle; the card before it tips forward and drops out of the bottom of the panel. The deck rolls on
   its own every few seconds, independent of page scroll. Transforms are written per frame, no re-renders. */
const DECK_N = 8; // the four stages twice over, so the stack above always looks full
const HOLD = 1.6; // seconds resting on a card
const ROLL = 1.0; // seconds rolling to the next
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

function place(d: number) {
  if (d >= 0) {
    // waiting in the stack: tipped back, stepping up and shrinking, with a clear gap between edges
    const a = Math.min(d, 1);
    const k = Math.max(0, d - 1);
    const y = -a * 70 - k * 22;
    const rot = 7 + a * 22 + k * 2;
    const sc = 1 - a * 0.08 - k * 0.045;
    const op = d > 4.6 ? clamp01((5.2 - d) / 0.6) : 1;
    return { y, rot, sc, op, shade: Math.min(0.05 + d * 0.06, 0.3) * a, z: Math.round(100 - d * 10) };
  }
  // done: tips toward the viewer and drops well clear of the front card, out of the bottom of the panel
  const e = -d;
  return { y: e * 318, rot: 7 - e * 46, sc: 1 + e * 0.1, op: 1 - clamp01((e - 1) * 2.5), shade: 0, z: 110 };
}

function Deck() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".bw__deck-card"));
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    let clock = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      if (!still) clock += dt;
      const step = Math.floor(clock / (HOLD + ROLL));
      const into = clock - step * (HOLD + ROLL);
      const t = step + easeInOut(clamp01((into - HOLD) / ROLL));
      cards.forEach((c, i) => {
        let d = (((i - t) % DECK_N) + DECK_N) % DECK_N;
        if (d > DECK_N - 1.5) d -= DECK_N;
        const p = place(d);
        c.style.transform = `translate3d(0, ${p.y.toFixed(1)}px, 0) rotateX(${p.rot.toFixed(2)}deg) scale(${p.sc.toFixed(4)})`;
        c.style.opacity = p.op.toFixed(3);
        c.style.zIndex = String(p.z);
        c.style.setProperty("--shade", p.shade.toFixed(3));
      });
    };
    raf = requestAnimationFrame(frame);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
    });
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <motion.div
      ref={host}
      className="bw__deck"
      initial={{ opacity: 0, y: 60, scale: 0.85, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 40, transition: { duration: 0.25 } }}
      transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.7 }}
    >
      {Array.from({ length: DECK_N }, (_, k) => {
        const i = k % 4;
        const name = beforeWith.withStages[i];
        return (
          <div key={k} className="bw__deck-card" aria-hidden={k >= 4 || undefined}>
            <div className="wcard bw__stage-card">
              <div className="bw__stage-art">
                {i === 0 && <Bars bars={listBars.slice(0, 3)} />}
                {i === 1 && <ChecklistArt />}
                {i === 2 && <EqArt />}
                {i === 3 && <ChartArt delay={0.9} />}
              </div>
              <span className="hcard__label bw__stage-label">{name}</span>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

function StageCard({ name, i, mobile }: { name: string; i: number; mobile: boolean }) {
  // phones: a calmer tilt and no drop, so the two-column grid keeps clear gaps
  const rot = mobile ? ROTS[i] * 0.3 : ROTS[i];
  if (mobile)
    return (
      <motion.div
        className="bw__stage"
        initial={{ opacity: 0, scale: 0.35, y: 24, rotate: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: rot, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.6, filter: "blur(6px)", transition: { duration: 0.25 } }}
        transition={{
          default: { type: "spring", stiffness: 260, damping: 18, mass: 0.9, delay: 0.7 + i * 0.12 },
          opacity: { duration: 0.3, delay: 0.7 + i * 0.12 },
          filter: { duration: 0.4, delay: 0.7 + i * 0.12 },
        }}
      >
        <div className="wcard bw__stage-card">
          <div className="bw__stage-art">
            {i === 0 && <Bars bars={listBars.slice(0, 3)} />}
            {i === 1 && <ChecklistArt />}
            {i === 2 && <EqArt />}
            {i === 3 && <ChartArt delay={1.1} />}
          </div>
          <span className="hcard__label bw__stage-label">{name}</span>
        </div>
      </motion.div>
    );
  return (
    <motion.div
      className="bw__stage"
      initial={{ opacity: 0, y: 80, rotate: 0, scale: 0.8 }}
      animate={{ opacity: 1, y: !mobile && (i === 0 || i === 3) ? 18 : 0, rotate: rot, scale: 1 }}
      exit={{ opacity: 0, y: 60, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 110, damping: 14, delay: 0.7 + i * 0.09 }}
      whileHover={{ y: -14, rotate: ROTS[i] * 0.3, scale: 1.05, zIndex: 4 }}
    >
      <div className="wcard bw__stage-card">
        <div className="bw__stage-art">
          {i === 0 && <Bars bars={listBars.slice(0, 3)} />}
          {i === 1 && <ChecklistArt />}
          {i === 2 && <EqArt />}
          {i === 3 && <ChartArt delay={0.9} />}
        </div>
        <span className="hcard__label bw__stage-label">{name}</span>
      </div>
    </motion.div>
  );
}

function EqArt() {
  const H = [18, 29, 23, 42, 31, 23];
  return (
    <>
      {H.map((h, i) => (
        <motion.span
          key={i}
          className={`eq${i === 3 ? " eq--blue" : ""}`}
          style={{ left: u(27 + i * 36), width: u(30), height: u(h), bottom: "auto", top: u(110 - h) }}
          animate={{ scaleY: [1, 1.3, 0.7, 1] }}
          transition={{ duration: 2.4 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}
