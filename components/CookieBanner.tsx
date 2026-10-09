"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cookies as c } from "@/lib/content";
import { useIntroDone } from "@/lib/intro";

const KEY = "tx-cookie-choice";

export default function CookieBanner() {
  const ready = useIntroDone();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ready) return;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {}
    if (!stored) {
      const t = setTimeout(() => setShow(true), 3500);
      return () => clearTimeout(t);
    }
  }, [ready]);

  const choose = (v: string) => {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="region"
          aria-label="Cookies"
          className="fixed inset-x-3 bottom-3 z-[60] md:inset-x-auto md:bottom-5 md:left-1/2 md:w-max md:max-w-[calc(100vw-40px)] md:-translate-x-1/2"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0, transition: { duration: 0.25 } }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
        >
          <div className="glass glass-solid flex flex-col gap-2.5 rounded-[24px] p-3 pl-4 text-black md:flex-row md:items-center md:gap-5 md:rounded-full md:py-2 md:pl-6 md:pr-2">
            <p className="text-[14px] leading-snug md:text-[15px]">
              {c.text}{" "}
              <a href={c.policy.href} className="font-[650] text-[var(--tx-blue-ink)] underline underline-offset-2">
                {c.policy.label}
              </a>
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => choose("essentials")} className="btn btn-sm flex-1 bg-black/[0.07]">
                {c.essentials}
              </button>
              <button type="button" onClick={() => choose("all")} className="btn btn-sm flex-1 bg-black text-white">
                {c.agree}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
