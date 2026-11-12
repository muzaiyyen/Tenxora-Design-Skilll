"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { asset } from "@/lib/asset";
import { useMedia } from "@/lib/hooks";

const ease = [0.22, 1, 0.36, 1] as const;

/** Inner-page opener: the home hero's sky, a label row, the page title and its lead copy, centred. */
export default function PageHero({
  label,
  title,
  lead,
  body,
  actions,
}: {
  label?: string;
  title: string;
  lead?: string;
  body?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const mobile = useMedia("(max-width: 760px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const skyY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const copyY = useTransform(scrollYProgress, [0, 0.8], [0, -90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="phero on-sky" data-header="dark">
      <motion.div className="hero__sky phero__sky" style={mobile ? undefined : { y: skyY }} aria-hidden>
        <img src={asset("/figma/sky.jpg")} alt="" fetchPriority="high" />
      </motion.div>
      <motion.div className="wrap phero__copy" style={mobile ? undefined : { y: copyY, opacity: copyOpacity }}>
        {label && (
          <motion.p
            className="phero__label"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
          >
            <span className="status">
              <span className="status__dot" aria-hidden />
              {label}
            </span>
          </motion.p>
        )}
        <motion.h1
          className="h-display phero__title"
          initial={{ opacity: 0, y: 46, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease, delay: 0.25 }}
        >
          {title}
        </motion.h1>
        {lead && (
          <motion.p
            className="lead phero__lead"
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease, delay: 0.55 }}
          >
            {lead}
          </motion.p>
        )}
        {body && (
          <motion.div
            className="body phero__body"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.75 }}
          >
            {body}
          </motion.div>
        )}
        {actions && (
          <motion.div
            className="hero__ctas phero__ctas"
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 18, delay: 1 }}
          >
            {actions}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
