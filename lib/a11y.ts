"use client";

import { useSyncExternalStore } from "react";

// Reader settings from the Accessibility menu. Stored only in this browser (localStorage), never sent anywhere.
export type A11y = {
  motion: boolean; // pause animations
  size: 0 | 1 | 2; // text size steps: 100%, 115%, 130%
  font: boolean; // readable font (Atkinson Hyperlegible)
  spacing: boolean; // WCAG 1.4.12 text spacing
  align: boolean; // left-align text
  links: boolean; // highlight links
  contrast: boolean; // higher contrast
  colour: boolean; // colour-blind friendly colours
  tint: boolean; // soft tinted background (BDA dyslexia style guide)
  sat: boolean; // low saturation
  cursor: boolean; // big cursor
  guide: boolean; // reading guide line
};

export const DEFAULTS: A11y = {
  motion: false,
  size: 0,
  font: false,
  spacing: false,
  align: false,
  links: false,
  contrast: false,
  colour: false,
  tint: false,
  sat: false,
  cursor: false,
  guide: false,
};

const KEY = "tx-a11y";
let state: A11y = DEFAULTS;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {}
  apply();
}

function apply() {
  const el = document.documentElement;
  (Object.keys(DEFAULTS) as (keyof A11y)[]).forEach((k) => {
    const v = state[k];
    const attr = `data-a11y-${k}`;
    if (v === false || v === 0) el.removeAttribute(attr);
    else el.setAttribute(attr, String(v));
  });
  if (state.font && !document.getElementById("tx-a11y-font")) {
    const l = document.createElement("link");
    l.id = "tx-a11y-font";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap";
    document.head.appendChild(l);
  }
}

export function setA11y(patch: Partial<A11y>) {
  load();
  state = { ...state, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  apply();
  subs.forEach((f) => f());
}

export function resetA11y() {
  state = DEFAULTS;
  try {
    localStorage.removeItem(KEY);
  } catch {}
  apply();
  subs.forEach((f) => f());
}

function subscribe(f: () => void) {
  load();
  subs.add(f);
  return () => subs.delete(f);
}

export function useA11y(): A11y {
  return useSyncExternalStore(
    subscribe,
    () => (load(), state),
    () => DEFAULTS,
  );
}

/** true when the reader turned animations off in the menu */
export function useMotionPaused() {
  return useA11y().motion;
}
