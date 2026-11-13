"use client";

import { motion } from "motion/react";
import { odooServices as o } from "@/lib/pages";
import PageHero from "./PageHero";
import { DocSections } from "./DocPage";
import SkyFooter from "./SkyFooter";
import Magnetic from "./Magnetic";
import { AiArt, Bars, ChartArt, ChecklistArt, listBars } from "./Skeleton";
import { route } from "@/lib/route";

const ART = [
  () => <ChecklistArt />,
  () => <Bars bars={listBars} />,
  () => <AiArt />,
  () => <ChartArt />,
];

const Arrow = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function OdooServices() {
  return (
    <>
      <PageHero
        label={o.eyebrow}
        title={o.h1}
        lead={o.lead}
        body={<p>{o.body}</p>}
        actions={
          <>
            <Magnetic>
              <a href={route(o.cta.href)} className="pill pill--green glass">
                <span style={{ position: "relative", zIndex: 2 }}>{o.cta.label}</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href={o.email.href} className="pill pill--ghost glass">
                <span style={{ position: "relative", zIndex: 2 }}>{o.email.label}</span>
              </a>
            </Magnetic>
          </>
        }
      />

      <section className="section on-white svc" data-header="light">
        <div className="wrap">
          <ul className="capsule svc__grid">
            {o.services.map((s, i) => {
              const Art = ART[i];
              return (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, y: 60, rotate: i % 2 ? 2.5 : -2.5 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ type: "spring", stiffness: 70, damping: 15, delay: (i % 2) * 0.1 }}
                >
                  <motion.a
                    href={route(s.link.href)}
                    className="wcard svc__card"
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    aria-label={s.link.label ? undefined : s.title}
                  >
                    <div className="svc__art" aria-hidden>
                      <Art />
                    </div>
                    <div className="why__meta">
                      <span className={`num ${i === 0 ? "num--green" : ""}`}>{s.n}</span>
                      <span className="why__tag">{s.kicker}</span>
                    </div>
                    <h2 className="svc__title">{s.title}</h2>
                    {s.body && <p className="svc__body">{s.body}</p>}
                    <span className="svc__link">
                      {s.link.label && <span>{s.link.label.replace(/\s*→$/, "")}</span>}
                      <span className="post__arrow">
                        <Arrow />
                      </span>
                    </span>
                  </motion.a>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section on-white doc doc--next" data-header="light">
        <div className="wrap">
          <div className="capsule doc__sheet">
            <DocSections sections={o.more} />
          </div>
        </div>
      </section>

      <SkyFooter />
    </>
  );
}
