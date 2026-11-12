"use client";

import { motion } from "motion/react";
import { why } from "@/lib/pages";
import PageHero from "./PageHero";
import SkyFooter from "./SkyFooter";
import { AiArt, Bars, ChartArt, ChecklistArt, listBars } from "./Skeleton";

const ease = [0.22, 1, 0.36, 1] as const;

const ART = [
  () => <Bars bars={listBars} />,
  () => <AiArt />,
  () => <ChecklistArt />,
  () => <ChartArt delay={0.3} />,
];

export default function WhyTenxora() {
  const heading = why.odoo.heading.split(" ");
  return (
    <>
      <PageHero
        title={why.h1}
        lead={why.tagline}
        body={
          <>
            <p>{why.intro}</p>
            {why.body && <p>{why.body}</p>}
          </>
        }
      />

      <section className="section on-white why" data-header="light">
        <div className="wrap">
          <ol className="capsule why__steps">
            {why.steps.map((s, i) => {
              const Art = ART[i];
              return (
                <motion.li
                  key={s.n}
                  className="wcard why__card"
                  initial={{ opacity: 0, y: 60, rotate: i % 2 ? 3 : -3 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ type: "spring", stiffness: 70, damping: 15, delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="why__art" aria-hidden>
                    <Art />
                  </div>
                  <div className="why__meta">
                    <span className={`num ${i === 0 ? "num--green" : ""}`}>{s.n}</span>
                    <span className="why__tag">{s.tag}</span>
                  </div>
                  <h2 className="why__h">{s.heading}</h2>
                  {s.body && <p className="why__body">{s.body}</p>}
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section on-white why-co" data-header="light" aria-labelledby="odoo-title">
        <div className="wrap why-co__grid">
          <div>
            <h2 id="odoo-title" className="h-section">
              {heading.map((w, i) => (
                <motion.span
                  key={i}
                  className={i >= 2 ? "dim" : undefined}
                  style={{ display: "inline-block", whiteSpace: "pre" }}
                  initial={{ opacity: 0, y: "0.5em", filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.9, ease, delay: 0.05 + i * 0.045 }}
                >
                  {w}
                  {i < heading.length - 1 ? " " : ""}
                </motion.span>
              ))}
            </h2>
            {why.odoo.body && <p className="body why-co__body">{why.odoo.body}</p>}
          </div>

          <motion.div
            className="wcard why-co__card"
            initial={{ opacity: 0, y: 60, rotate: 3 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 70, damping: 15 }}
          >
            <h2 className="why-co__h">{why.company.heading}</h2>
            <dl className="why-co__list">
              {why.company.rows.map((r, i) => (
                <motion.div
                  key={r.label}
                  className="why-co__row"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease, delay: 0.3 + i * 0.1 }}
                >
                  <dt>{r.label}</dt>
                  <dd>{r.href ? <a href={r.href}>{r.value}</a> : r.value}</dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </section>

      <SkyFooter />
    </>
  );
}
