"use client";

import { useSyncExternalStore } from "react";

// Shared "intro finished" flag: the preloader flips it, the hero waits for it.
let done = false;
const subs = new Set<() => void>();

export function finishIntro() {
  if (done) return;
  done = true;
  subs.forEach((f) => f());
}

export function useIntroDone() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => done,
    () => false,
  );
}
