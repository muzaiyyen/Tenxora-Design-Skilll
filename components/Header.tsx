"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { Icon, Logo, Roll } from "./ui";

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 240 && y > prev && !open);
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 pt-3 md:pt-4"
      animate={{ y: hidden ? -110 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <div className="wrap">
        <div style={{ ["--g-bg" as string]: "rgb(255 255 255 / 0.84)" }} className="glass glass-solid flex h-[64px] items-center justify-between rounded-full pl-5 pr-2 md:h-[68px] md:pl-7">
          <a href="/" className="flex items-center" aria-label="Tenxora home">
            <Logo variant="blue-bird" height={26} />
          </a>

          <nav aria-label="Main" className="hidden md:block">
            <ul className="relative flex items-center gap-1" onPointerLeave={() => setHover(null)}>
              {nav.map((item, i) => (
                <li key={item.label} className="relative">
                  {hover === i && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-black/[0.07]"
                      transition={{ type: "spring", stiffness: 500, damping: 36 }}
                    />
                  )}
                  <a
                    href={item.href}
                    onPointerEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    className={`relative flex min-h-[48px] items-center rounded-full px-5 text-[16px] font-[560] ${
                      i === nav.length - 1 ? "bg-black text-white" : "text-black"
                    }`}
                  >
                    <Roll>{item.label}</Roll>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="grid h-[48px] w-[48px] place-items-center rounded-full bg-black text-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-nav"
              aria-label="Main"
              className="glass glass-solid mt-2 overflow-hidden rounded-[32px] p-3 md:hidden"
              initial={{ opacity: 0, scaleY: 0.6, y: -16 }}
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              exit={{ opacity: 0, scaleY: 0.7, y: -10, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              style={{ transformOrigin: "top center" }}
            >
              <ul>
                {nav.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.04 * i } }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-[56px] items-center rounded-[20px] px-4 text-[22px] font-[700] tracking-[-0.01em] active:bg-black/5"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
