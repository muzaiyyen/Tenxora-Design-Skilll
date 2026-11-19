"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { DEFAULTS, resetA11y, setA11y, useA11y, type A11y } from "@/lib/a11y";

type Toggle = { key: Exclude<keyof A11y, "size">; label: string; hint: string; icon: React.ReactNode };

const sv = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d}
  </svg>
);

const GROUPS: { title: string; items: Toggle[] }[] = [
  {
    title: "Motion",
    items: [
      {
        key: "motion",
        label: "Pause animations",
        hint: "Stops moving cards, loops and scroll effects",
        icon: sv(
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M10 9v6M14 9v6" />
          </>,
        ),
      },
    ],
  },
  {
    title: "Reading",
    items: [
      { key: "font", label: "Readable font", hint: "Atkinson Hyperlegible, made for easy reading", icon: sv(<path d="M4 19 9.5 5h1L16 19M6.2 14h7.6M18 10v9M16 12.5c.6-1.5 3.4-1.5 3.8.3" />) },
      { key: "spacing", label: "Text spacing", hint: "More room between letters, words and lines", icon: sv(<path d="M4 7h16M4 12h16M4 17h10M2 4l2 3-2 3M22 14l-2 3 2 3" />) },
      { key: "align", label: "Left-align text", hint: "Every line starts in the same place", icon: sv(<path d="M4 6h16M4 10h10M4 14h16M4 18h10" />) },
      { key: "links", label: "Highlight links", hint: "Underlines and marks every link", icon: sv(<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />) },
      { key: "guide", label: "Reading guide", hint: "A line that follows your pointer", icon: sv(<path d="M3 12h18M7 8h10M7 16h10" />) },
      { key: "tint", label: "Soft background", hint: "Calmer, warm-tinted page", icon: sv(<path d="M12 3a9 9 0 1 0 9 9c-5 0-9-4-9-9Z" />) },
    ],
  },
  {
    title: "Colour and vision",
    items: [
      { key: "contrast", label: "Higher contrast", hint: "Darker text and stronger edges", icon: sv(<><circle cx="12" cy="12" r="9" /><path d="M12 3v18a9 9 0 0 0 0-18Z" fill="currentColor" /></>) },
      { key: "colour", label: "Colour-blind friendly", hint: "Swaps red for blue so problems and fixes differ", icon: sv(<><circle cx="9" cy="10" r="5" /><circle cx="15" cy="10" r="5" /><circle cx="12" cy="15" r="5" /></>) },
      { key: "sat", label: "Low saturation", hint: "Softens strong colours", icon: sv(<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />) },
      { key: "cursor", label: "Big cursor", hint: "A larger, easier to find pointer", icon: sv(<path d="M5 3l14 7-6 1.8L10.5 18Z" />) },
    ],
  },
];

const SIZES = ["A", "A+", "A++"];

export default function A11yMenu() {
  const s = useA11y();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const fab = useRef<HTMLButtonElement>(null);
  const id = useId();
  const changed = (Object.keys(DEFAULTS) as (keyof A11y)[]).some((k) => s[k] !== DEFAULTS[k]);

  // Escape closes; Tab stays inside the panel while it is open; focus returns to the button
  useEffect(() => {
    if (!open) return;
    const el = panel.current;
    el?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        fab.current?.focus();
      }
      if (e.key === "Tab" && el) {
        const f = Array.from(el.querySelectorAll<HTMLElement>("button, a[href]"));
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    fab.current?.focus();
  };

  return (
    <>
      <motion.button
        ref={fab}
        type="button"
        className="a11y-fab glass"
        aria-label="Accessibility settings"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        data-on={changed || undefined}
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="4.6" r="2.1" fill="currentColor" />
          <path
            d="M4.5 8.4c2.4.8 4.9 1.2 7.5 1.2s5.1-.4 7.5-1.2M12 9.6v4.6m0 0-3 6.5m3-6.5 3 6.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="a11y-scrim"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-hidden
            />
            <motion.div
              ref={panel}
              id={id}
              className="a11y"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${id}-t`}
              initial={{ opacity: 0, y: 24, scale: 0.94, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 16, scale: 0.96, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <div className="a11y__head">
                <div>
                  <h2 id={`${id}-t`} className="a11y__title">
                    Accessibility
                  </h2>
                  <p className="a11y__sub">Adjust the site to suit you. Your choices stay on this device.</p>
                </div>
                <button type="button" className="a11y__close" onClick={close} aria-label="Close accessibility settings">
                  {sv(<path d="M6 6l12 12M18 6 6 18" />)}
                </button>
              </div>

              <div className="a11y__body">
                <section className="a11y__group" aria-label="Text size">
                  <h3 className="a11y__label">Text size</h3>
                  <div className="a11y__seg" role="radiogroup" aria-label="Text size">
                    {SIZES.map((t, i) => (
                      <button
                        key={t}
                        type="button"
                        role="radio"
                        aria-checked={s.size === i}
                        className="a11y__seg-btn"
                        onClick={() => setA11y({ size: i as A11y["size"] })}
                        style={{ fontSize: 14 + i * 3 }}
                      >
                        {s.size === i && (
                          <motion.span layoutId="a11y-seg" className="a11y__seg-thumb" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                        )}
                        <span className="a11y__seg-t">{t}</span>
                        <span className="sr-only">{["Default", "Larger", "Largest"][i]}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {GROUPS.map((g) => (
                  <section key={g.title} className="a11y__group" aria-label={g.title}>
                    <h3 className="a11y__label">{g.title}</h3>
                    <div className="a11y__grid">
                      {g.items.map((t) => (
                        <button
                          key={t.key}
                          type="button"
                          role="switch"
                          aria-checked={!!s[t.key]}
                          className="a11y__tile"
                          onClick={() => setA11y({ [t.key]: !s[t.key] } as Partial<A11y>)}
                        >
                          <span className="a11y__icon">{t.icon}</span>
                          <span className="a11y__name">{t.label}</span>
                          <span className="a11y__hint">{t.hint}</span>
                          <span className="a11y__switch" aria-hidden>
                            <span />
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="a11y__foot">
                <button type="button" className="pill pill--green glass a11y__reset" onClick={resetA11y} disabled={!changed}>
                  <span style={{ position: "relative", zIndex: 2 }}>Reset all</span>
                </button>
                <p className="a11y__note">These options change how the site looks here. Your device&rsquo;s own accessibility settings still apply.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {s.guide && <ReadingGuide />}
    </>
  );
}


/** A soft band that follows the pointer, with the rest of the page slightly dimmed. */
function ReadingGuide() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    let y = window.innerHeight / 2;
    const draw = () => {
      raf = 0;
      ref.current?.style.setProperty("--gy", `${y}px`);
    };
    const move = (e: PointerEvent) => {
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className="a11y-guide" aria-hidden />;
}
