"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { audit } from "@/lib/content";
import { asset } from "@/lib/asset";
import Magnetic from "./Magnetic";
import Footer from "./Footer";

const ease = [0.22, 1, 0.36, 1] as const;

/** The page closes back in the Figma sky: clouds at the top, deepening to blue under the footer. */
export default function Audit() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const skyY = useTransform(scrollYProgress, [0, 1], ["-12%", "0%"]);

  return (
    <section ref={ref} className="audit on-sky" data-header="dark" aria-labelledby="audit-title">
      <motion.div className="audit__sky" style={{ y: skyY }} aria-hidden>
        <img src={asset("/figma/sky.jpg")} alt="" />
      </motion.div>
      {/* the cloud-white top of this band needs the dark header */}
      <div className="audit__light" data-header="light" aria-hidden />
      <div className="wrap audit__inner">
        <div className="audit__grid">
          <div>
            <motion.div
              className="label-row"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            >
              <span>{audit.eyebrow}</span>
            </motion.div>
            <motion.h2
              id="audit-title"
              className="h-display audit__title"
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.1, ease }}
            >
              {audit.heading}
            </motion.h2>
            <motion.p
              className="body audit__body"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
            >
              {audit.body}
            </motion.p>
          </div>

          <motion.div
            className="audit__card"
            initial={{ opacity: 0, y: 60, rotate: 4 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: "spring", stiffness: 70, damping: 15 }}
          >
            <ul className="audit__list">
              {audit.checklist.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease, delay: 0.4 + i * 0.15 }}
                >
                  <motion.span
                    className="audit__check"
                    initial={{ backgroundColor: "rgba(0,0,0,0.31)" }}
                    whileInView={{ backgroundColor: "#08e88c" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.8 + i * 0.25 }}
                  >
                    <svg viewBox="0 0 12 12" fill="none" aria-hidden>
                      <motion.path
                        d="M2.2 6.4 4.8 9 9.8 3.2"
                        stroke="#000"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.9 + i * 0.25 }}
                      />
                    </svg>
                  </motion.span>
                  {item}
                </motion.li>
              ))}
            </ul>
            <Magnetic strength={0.15}>
              <a href={audit.cta.href} className="pill pill--green glass audit__cta">
                <span style={{ position: "relative", zIndex: 2 }}>{audit.cta.label}</span>
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
