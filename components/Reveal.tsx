"use client";

import { motion } from "motion/react";

/** Fade-and-rise on entering the viewport, with a soft spring. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const M = as === "li" ? motion.li : as === "span" ? motion.span : motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 110, damping: 20, delay }}
    >
      {children}
    </M>
  );
}
