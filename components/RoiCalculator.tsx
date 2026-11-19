"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import Magnetic from "./Magnetic";
import { route } from "@/lib/route";

// ROI calculator for the Odoo Services page (2026-11-19). New copy: needs Bilal's sign-off before it goes live.

type Field = { key: keyof Inputs; label: string; min: number; max: number; step: number; unit?: "$" | "%" | "h" };
type Inputs = { people: number; hours: number; rate: number; share: number; project: number; licence: number };

const FIELDS: Field[] = [
  { key: "people", label: "People doing manual admin work", min: 1, max: 100, step: 1 },
  { key: "hours", label: "Hours each spends on it per week", min: 1, max: 30, step: 1, unit: "h" },
  { key: "rate", label: "Average cost per hour (USD)", min: 2, max: 100, step: 1, unit: "$" },
  { key: "share", label: "Share of that work Odoo automates", min: 10, max: 70, step: 5, unit: "%" },
  { key: "project", label: "One-time implementation cost (USD)", min: 500, max: 30000, step: 250, unit: "$" },
  { key: "licence", label: "Odoo subscription per month (USD)", min: 0, max: 3000, step: 25, unit: "$" },
];

const START: Inputs = { people: 8, hours: 6, rate: 10, share: 30, project: 3500, licence: 200 };
const WEEKS = 52 / 12;

const money = (n: number) => `${n < 0 ? "−" : ""}$${Math.round(Math.abs(n)).toLocaleString("en-US")}`;
const fmt = (f: Field, v: number) => (f.unit === "$" ? money(v) : f.unit === "%" ? `${v}%` : f.unit === "h" ? `${v} h` : String(v));

function Count({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const last = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const c = animate(last.current, value, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => (el.textContent = format(n)),
    });
    last.current = value;
    return () => c.stop();
  }, [value, format]);
  return <span ref={ref}>{format(value)}</span>;
}

const months = (n: number) => (Number.isFinite(n) ? `${n < 10 ? n.toFixed(1) : Math.round(n)} months` : "—");
const pct = (n: number) => `${n < -0.5 ? "−" : ""}${Math.abs(Math.round(n))}%`;
const hrs = (n: number) => `${Math.round(n).toLocaleString("en-US")} h`;

export default function RoiCalculator() {
  const [v, setV] = useState<Inputs>(START);

  const hoursSaved = v.people * v.hours * WEEKS * (v.share / 100);
  const monthlyValue = hoursSaved * v.rate;
  const monthlyNet = monthlyValue - v.licence;
  const yearCost = v.project + v.licence * 12;
  const yearNet = monthlyValue * 12 - yearCost;
  const roi = yearCost > 0 ? (yearNet / yearCost) * 100 : 0;
  const payback = monthlyNet > 0 ? v.project / monthlyNet : Infinity;
  const good = yearNet >= 0;

  return (
    <section className="section on-white doc doc--next roi" data-header="light" id="roi-calculator">
      <div className="wrap">
        <div className="capsule doc__sheet roi__sheet">
          <motion.form
            className="wcard roi__inputs"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 70, damping: 16 }}
            onSubmit={(e) => e.preventDefault()}
            aria-label="ROI calculator"
          >
            <span className="why__tag roi__tag">ROI calculator</span>
            <h2 className="doc__oh roi__h">Estimate your return on Odoo</h2>
            <div className="roi__fields">
              {FIELDS.map((f) => {
                const p = ((v[f.key] - f.min) / (f.max - f.min)) * 100;
                return (
                  <label key={f.key} className="roi__field">
                    <span className="roi__row">
                      <span>{f.label}</span>
                      <output className="roi__val">{fmt(f, v[f.key])}</output>
                    </span>
                    <input
                      type="range"
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      value={v[f.key]}
                      style={{ ["--p" as string]: `${p}%` }}
                      onChange={(e) => setV((o) => ({ ...o, [f.key]: Number(e.target.value) }))}
                    />
                  </label>
                );
              })}
            </div>
          </motion.form>

          <motion.div
            className={`roi__result${good ? "" : " is-neg"}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.08 }}
            aria-live="polite"
          >
            <div className="roi__big">
              <span className="roi__label">First-year net return</span>
              <span className="roi__num">
                <Count value={yearNet} format={money} />
              </span>
              <span className="roi__pill glass">
                <Count value={roi} format={pct} /> ROI in year one
              </span>
            </div>
            <dl className="roi__stats">
              <div className="wcard roi__stat">
                <dt>Hours saved per month</dt>
                <dd>
                  <Count value={hoursSaved} format={hrs} />
                </dd>
              </div>
              <div className="wcard roi__stat">
                <dt>Value per month</dt>
                <dd>
                  <Count value={monthlyValue} format={money} />
                </dd>
              </div>
              <div className="wcard roi__stat">
                <dt>Payback period</dt>
                <dd>
                  <Count value={Number.isFinite(payback) ? payback : 0} format={(n) => (Number.isFinite(payback) ? months(n) : "—")} />
                </dd>
              </div>
              <div className="wcard roi__stat">
                <dt>Year-one cost</dt>
                <dd>
                  <Count value={yearCost} format={money} />
                </dd>
              </div>
            </dl>
            <p className="roi__note">An estimate from the numbers you enter, not a quote.</p>
            <div className="roi__ctas">
              <Magnetic>
                <a href={route("https://tenxora.services/odoo-services/consulting/#workflow-review-blueprint")} className="pill pill--green glass">
                  <span style={{ position: "relative", zIndex: 2 }}>Request the $299 workflow review →</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a href={route("https://tenxora.services/book-a-call/")} className="pill pill--ghost glass">
                  <span style={{ position: "relative", zIndex: 2 }}>Book a 15-minute call</span>
                </a>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
