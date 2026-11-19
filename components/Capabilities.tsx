"use client";

import { motion } from "motion/react";
import { capabilities } from "@/lib/content";
import { asset } from "@/lib/asset";
import Intro from "./Intro";
import TiltCard from "./TiltCard";
import { Bars, listBars } from "./Skeleton";

export default function Capabilities() {
  return (
    <section className="section on-white" data-header="light" aria-labelledby="cap-title">
      <div className="wrap">
        <Intro
          id="cap-title"
          label={capabilities.eyebrow}
          heading={capabilities.heading}
          split={2}
          body={
            <>
              <p>{capabilities.body[0]}</p>
              <p style={{ marginTop: "0.8em" }}>{capabilities.body[1]}</p>
            </>
          }
        />
        <div className="capsule cap__capsule">
          {capabilities.cards.map((c, i) => (
            <motion.div
              key={c.eyebrow}
              className="cap__slot"
              initial={{ opacity: 0, y: 60, rotate: i ? 3 : -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ type: "spring", stiffness: 70, damping: 16, delay: i * 0.12 }}
            >
              <TiltCard className="wcard cap__card" max={6}>
                <div className="cap__visual" aria-hidden>
                  {i === 0 ? (
                    <div className="wcard cap__mini" style={{ rotate: "-6deg" }}>
                      <Bars bars={listBars} />
                    </div>
                  ) : (
                    <div className="cap__mini cap__mini--img" style={{ rotate: "6deg" }}>
                      <img src={asset("/figma/automation-card.png")} alt="" />
                    </div>
                  )}
                </div>
                <span className="status">
                  <span className="status__dot" />
                  {c.eyebrow}
                </span>
                <h3 className="cap__title">{c.title}</h3>
                <p className="cap__body">{c.body}</p>
                <ul className="cap__tags">
                  {c.tags.map((t, j) => (
                    <motion.li
                      key={t}
                      className="tag"
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.4 + j * 0.06 }}
                    >
                      {t}
                    </motion.li>
                  ))}
                </ul>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
