"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { asset } from "@/lib/asset";
import { useReduce } from "@/lib/hooks";
import Footer from "./Footer";

/** The closing sky band and footer from the home page, with optional content above the footer. */
export default function SkyFooter({ children }: { children?: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const skyY = useTransform(scrollYProgress, [0, 1], ["-12%", "0%"]);
  const still = useReduce();
  return (
    <section ref={ref} className="audit skyfoot on-sky" data-header="dark">
      <motion.div className="audit__sky" style={still ? undefined : { y: skyY }} aria-hidden>
        <img src={asset("/figma/sky.jpg")} alt="" />
      </motion.div>
      <div className="audit__light" data-header="light" aria-hidden />
      <div className="wrap skyfoot__inner">{children}</div>
      <Footer />
    </section>
  );
}
