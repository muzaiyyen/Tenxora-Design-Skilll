"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Section opener in the Figma's language: a small label row (like "Operations Map / Live Model"),
 * a two-tone heading in regular Google Sans Flex, and supporting copy to the right.
 * `split` is where the heading turns grey; the words themselves are untouched.
 */
export default function Intro({
  id,
  label,
  aside,
  heading,
  split,
  body,
}: {
  id: string;
  label: string;
  aside?: React.ReactNode;
  heading: string;
  split: number;
  body: React.ReactNode;
}) {
  const words = heading.split(" ");
  return (
    <div className="intro">
      <div className="intro__head">
        <motion.div
          className="label-row"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, ease }}
        >
          <span>{label}</span>
          {aside}
        </motion.div>
        <h2 id={id} className="h-section">
          {words.map((w, i) => (
            <motion.span
              key={i}
              className={i >= split ? "dim" : undefined}
              style={{ display: "inline-block", whiteSpace: "pre" }}
              initial={{ opacity: 0, y: "0.5em", filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9, ease, delay: 0.05 + i * 0.045 }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </h2>
      </div>
      <motion.div
        className="body"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease, delay: 0.3 }}
      >
        {body}
      </motion.div>
    </div>
  );
}
