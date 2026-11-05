"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cookies } from "@/lib/content";

const KEY = "tx-cookies";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let seen: string | null = null;
    try {
      seen = localStorage.getItem(KEY);
    } catch {}
    if (seen) return;
    const t = setTimeout(() => setShow(true), 2800);
    return () => clearTimeout(t);
  }, []);
  const close = (v: string) => {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
    setShow(false);
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="cookie"
          role="dialog"
          aria-label="Cookies"
          initial={{ y: 120, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: 120, opacity: 0, x: "-50%" }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
        >
          <p>
            {cookies.text}{" "}
            <a href={cookies.policy.href} className="cookie__link">
              {cookies.policy.label}
            </a>
          </p>
          <div className="cookie__btns">
            <button type="button" className="pill pill--ghost glass cookie__btn" onClick={() => close("essentials")}>
              <span style={{ position: "relative", zIndex: 2 }}>{cookies.essentials}</span>
            </button>
            <button type="button" className="pill pill--green glass cookie__btn" onClick={() => close("all")}>
              <span style={{ position: "relative", zIndex: 2 }}>{cookies.agree}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
