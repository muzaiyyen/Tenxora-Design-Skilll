"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { asset } from "@/lib/asset";

/**
 * Figma "Frame 11": logo left, three links centred, dark "Contact Us" pill right.
 * Scrolling turns the link row into a glass capsule; over white sections the text goes dark.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      setScrolled(window.scrollY > 40);
      // whichever section sits under the header decides the text colour
      const probe = 40;
      const els = document.querySelectorAll<HTMLElement>("[data-header]");
      let mode = "dark";
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) mode = el.dataset.header || "dark";
      });
      setLight(mode === "light");
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  const links = nav.slice(0, 3);
  const contact = nav[3];

  return (
    <motion.header
      className={`header${scrolled ? " is-scrolled" : ""}${light ? " is-light" : ""}`}
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
    >
      <div className="header__inner">
        <a href="/" className="header__logo" aria-label="Tenxora home">
          <img src={asset("/brand/logo-white.svg")} alt="" style={{ opacity: light ? 0 : 1 }} />
          <img src={asset("/brand/logo-black.svg")} alt="" style={{ opacity: light ? 1 : 0 }} />
        </a>

        <nav className="header__nav" aria-label="Main" onPointerLeave={() => setHover(null)}>
          {links.map((l, i) => (
            <a key={l.label} href={l.href} className="header__link" onPointerEnter={() => setHover(i)} onFocus={() => setHover(i)}>
              {hover === i && (
                <motion.span
                  layoutId="nav-hl"
                  className="header__link-hl"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {l.label}
            </a>
          ))}
        </nav>

        <a href={contact.href} className="pill pill--dark glass header__cta">
          <span style={{ position: "relative", zIndex: 2 }}>{contact.label}</span>
        </a>
      </div>
    </motion.header>
  );
}
