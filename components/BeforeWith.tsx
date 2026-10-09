"use client";

import { animate, motion, useMotionValue, useTransform, useVelocity, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { beforeWith as c } from "@/lib/content";
import { Reveal } from "./Reveal";
import { useMedia, useReduce } from "@/lib/hooks";

// deterministic "messy" offsets for the before state
const mess = c.pains.map((_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const r = a - Math.floor(a);
  const b = Math.sin(i * 78.233) * 12543.123;
  const r2 = b - Math.floor(b);
  return { rot: (r - 0.5) * 14, x: (r2 - 0.5) * 26, y: (r - 0.5) * 18 };
});

export default function BeforeWith() {
  const [on, setOn] = useState(false);
  const narrow = useMedia("(max-width: 639px)");
  const m = narrow ? 0.35 : 1;
  const stage = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [pull, setPull] = useState<{ x: number; y: number }[]>(() => c.pains.map(() => ({ x: 0, y: 0 })));

  // measure how far each chip has to travel to be absorbed into the centre
  useEffect(() => {
    const measure = () => {
      if (on) return;
      const s = stage.current?.getBoundingClientRect();
      if (!s) return;
      const cx = s.left + s.width / 2;
      const cy = s.top + s.height / 2;
      setPull(
        chipRefs.current.map((el) => {
          if (!el) return { x: 0, y: 0 };
          const r = el.getBoundingClientRect();
          return { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2) };
        }),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [on]);

  return (
    <section aria-labelledby="bw-title" className="relative bg-white py-24 md:py-32">
      <div className="wrap">
        <div className="mx-auto max-w-[980px] text-center">
          <Reveal>
            <p className="t-eyebrow text-[var(--tx-blue-ink)]">{c.kicker}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="bw-title" className="t-h2 mt-5">
              {c.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-body mx-auto mt-6 max-w-[60ch] text-[var(--ink-soft)]">{c.body}</p>
          </Reveal>
        </div>

        <div
          className="relative mt-12 overflow-hidden rounded-[36px] md:mt-16 md:rounded-[48px]"
          style={{
            background:
              "radial-gradient(70% 60% at 20% 10%, #dfe3ff 0%, transparent 60%), radial-gradient(60% 60% at 90% 100%, #cfe6ff 0%, transparent 60%), linear-gradient(160deg, #eef1ff, #e3efff)",
          }}
        >
          <div className="flex justify-center px-4 pt-8 md:pt-12">
            <LiquidSwitch on={on} setOn={setOn} />
          </div>

          <div ref={stage} className="relative mx-auto min-h-[560px] max-w-[1080px] px-4 pb-10 pt-8 sm:min-h-[460px] md:px-10 md:pb-16">
            {/* BEFORE */}
            <div aria-hidden={on} className={on ? "pointer-events-none" : ""}>
              <motion.p
                className="t-eyebrow mb-6 text-center text-black"
                animate={{ opacity: on ? 0 : 1, y: on ? -10 : 0 }}
              >
                {c.beforeLabel}
              </motion.p>
              <ul className="flex flex-wrap justify-center gap-x-2 gap-y-3 md:gap-x-3 md:gap-y-4">
                {c.pains.map((pain, i) => (
                  <motion.li
                    key={pain}
                    ref={(el) => void (chipRefs.current[i] = el)}
                    className="glass glass-solid chip text-[15px] text-black md:text-[16px]"
                    initial={false}
                    animate={
                      on
                        ? { x: pull[i].x * 0.9, y: pull[i].y * 0.9, rotate: 0, scale: 0.3, opacity: 0 }
                        : { x: mess[i].x * m, y: mess[i].y * m, rotate: mess[i].rot * (narrow ? 0.6 : 1), scale: 1, opacity: 1 }
                    }
                    transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.9, delay: on ? i * 0.018 : (19 - i) * 0.015 }}
                    whileHover={on ? undefined : { rotate: 0, scale: 1.06 }}
                  >
                    {pain}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* WITH */}
            <motion.div
              aria-hidden={!on}
              className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
              initial={false}
              animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.9 }}
              transition={{ type: "spring", stiffness: 120, damping: 18, delay: on ? 0.35 : 0 }}
              style={{ pointerEvents: on ? "auto" : "none" }}
            >
              <div className="rounded-[40px] bg-[var(--tx-treen)] px-10 py-6 shadow-[0_24px_60px_rgb(8_160_96/0.35)] md:px-14 md:py-8">
                <p className="text-[clamp(48px,7vw,104px)] font-[900] leading-none tracking-[-0.05em] text-black">{c.withBrand}</p>
              </div>
              <p className="mt-6 text-[clamp(15px,1.4vw,18px)] font-[650] text-black">{c.withFlow}</p>
              <p className="t-h3 mt-8">{c.withLabel}</p>
              <ol className="mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-3">
                {c.withStages.map((s, i) => (
                  <motion.li
                    key={s}
                    className="glass glass-solid chip min-h-[44px] px-5 text-[16px] font-[650] text-black"
                    initial={false}
                    animate={{ opacity: on ? 1 : 0, y: on ? 0 : 16 }}
                    transition={{ type: "spring", stiffness: 160, damping: 18, delay: on ? 0.5 + i * 0.07 : 0 }}
                  >
                    <span className="h-2 w-2 rounded-full bg-black" aria-hidden="true" />
                    {s}
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Big glass switch with a liquid knob that stretches while it moves. Drag or tap. */
function LiquidSwitch({ on, setOn }: { on: boolean; setOn: (v: boolean) => void }) {
  const reduce = useReduce();
  const track = useRef<HTMLButtonElement>(null);
  const TRAVEL = 64;
  const x = useMotionValue(0);
  const vx = useVelocity(x);
  const stretch = useSpring(useTransform(vx, [-1600, 0, 1600], [1.45, 1, 1.45]), { stiffness: 500, damping: 30 });
  const squash = useTransform(stretch, (s) => 1 / Math.sqrt(s));
  const dragged = useRef(false);

  useEffect(() => {
    const ctl = animate(x, on ? TRAVEL : 0, reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 20, mass: 0.9 });
    return () => ctl.stop();
  }, [on, reduce, x]);

  const fill = useTransform(x, [0, TRAVEL], ["rgb(0 0 0 / 0.08)", "rgb(0 0 0 / 0.9)"]);

  return (
    <div className="flex items-center gap-4 md:gap-6">
      <span id="bw-before" className={`text-[17px] font-[650] transition-opacity md:text-[20px] ${on ? "opacity-70" : "opacity-100"}`}>
        {c.before}
      </span>
      <motion.button
        ref={track}
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby="bw-with"
        onClick={() => {
          if (dragged.current) return;
          setOn(!on);
        }}
        className="glass relative h-[64px] w-[132px] shrink-0 cursor-pointer rounded-full p-1"
        style={{ ["--g-bg" as string]: "rgb(255 255 255 / 0.35)", backgroundColor: fill }}
        whileTap={{ scale: 0.97 }}
      >
        <motion.span
          aria-hidden="true"
          drag="x"
          dragConstraints={{ left: 0, right: TRAVEL }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={() => {
            setOn(x.get() > TRAVEL / 2);
            setTimeout(() => (dragged.current = false), 0);
          }}
          className="glass glass-solid absolute left-1 top-1 block h-[56px] w-[60px] rounded-full"
          style={{ x, scaleX: stretch, scaleY: squash, ["--g-bg" as string]: "rgb(255 255 255 / 0.92)" }}
        />
      </motion.button>
      <span id="bw-with" className={`text-[17px] font-[650] transition-opacity md:text-[20px] ${on ? "opacity-100" : "opacity-70"}`}>
        {c.with}
      </span>
    </div>
  );
}
