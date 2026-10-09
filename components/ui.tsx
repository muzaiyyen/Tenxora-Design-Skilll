"use client";

import { useReduce } from "@/lib/hooks";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";

/** Label that rolls to an identical copy of itself on hover. Same words, no new copy. */
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

const spring = { stiffness: 220, damping: 18, mass: 0.6 };

/** A link that pulls gently toward the pointer and squishes on press. */
export function MagneticLink({
  href,
  className = "",
  children,
  strength = 0.28,
  ...rest
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  strength?: number;
} & Omit<React.ComponentProps<typeof motion.a>, "href" | "children" | "className">) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReduce();
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scaleX: 1.06, scaleY: 0.92 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

export function Logo({ variant = "black", className = "", height = 28 }: { variant?: "black" | "white" | "blue-bird"; className?: string; height?: number }) {
  return (
    // The logo ships as SVG and is never recolored or given effects.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/brand/logo-${variant}.svg`}
      alt="Tenxora"
      height={height}
      width={Math.round(height * 7.78)}
      className={className}
      style={{ height, width: "auto" }}
    />
  );
}

type IconName =
  | "mail"
  | "crm"
  | "ai"
  | "report"
  | "check"
  | "menu"
  | "close"
  | "facebook"
  | "linkedin"
  | "instagram"
  | "erp";

/** Lucide-style icons, 1.75 stroke. */
export function Icon({ name, size = 22, className = "" }: { name: IconName; size?: number; className?: string }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (name) {
    case "mail":
      return (
        <svg {...p}>
          <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case "crm":
      return (
        <svg {...p}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20c.8-3.6 3.3-5.5 6.5-5.5s5.7 1.9 6.5 5.5" />
          <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .7 3.2 2.4 3.6 5.2" />
        </svg>
      );
    case "ai":
      return (
        <svg {...p}>
          <rect x="5" y="5" width="14" height="14" rx="3" />
          <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
          <path d="M9.5 14.5 12 9l2.5 5.5M10.3 12.8h3.4" />
        </svg>
      );
    case "report":
      return (
        <svg {...p}>
          <path d="M3 3v18h18" />
          <path d="M7 15v2M11 11v6M15 8v9M19 5v12" />
        </svg>
      );
    case "erp":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
        </svg>
      );
    case "check":
      return (
        <svg {...p} strokeWidth={2.4}>
          <path d="m5 12.5 4.5 4.5L19 7" />
        </svg>
      );
    case "menu":
      return (
        <svg {...p}>
          <path d="M4 8h16M4 16h16" />
        </svg>
      );
    case "close":
      return (
        <svg {...p}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...p}>
          <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M8 10.5V16M8 7.5v.01M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.4-2.6S16 11.3 16 13v3" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <path d="M17.5 6.5v.01" />
        </svg>
      );
  }
}

/** Abstract business UI used inside floating cards. Purely decorative: no words. */
export function MiniUI({ kind, tone = "light" }: { kind: "order" | "invoice" | "stock" | "approval" | "report"; tone?: "light" | "dark" }) {
  const line = tone === "light" ? "bg-black/12" : "bg-white/18";
  const strong = tone === "light" ? "bg-black/70" : "bg-white/80";
  const L = ({ w, s = false }: { w: string; s?: boolean }) => <span className={`block h-[7px] rounded-full ${s ? strong : line}`} style={{ width: w }} />;
  if (kind === "report")
    return (
      <div aria-hidden="true" className="flex h-full flex-col gap-2">
        <L w="45%" s />
        <svg viewBox="0 0 120 50" className="mt-auto w-full" preserveAspectRatio="none">
          <path d="M0 42 C 18 38, 26 30, 40 31 S 62 18, 76 20 S 100 8, 120 4 L120 50 L0 50Z" fill="rgb(26 115 233 / 0.25)" />
          <path d="M0 42 C 18 38, 26 30, 40 31 S 62 18, 76 20 S 100 8, 120 4" fill="none" stroke="#1a73e9" strokeWidth="2.5" />
        </svg>
      </div>
    );
  if (kind === "stock")
    return (
      <div aria-hidden="true" className="flex h-full flex-col gap-2">
        <L w="40%" s />
        <div className="mt-auto flex h-[52px] items-end gap-[6px]">
          {[60, 85, 45, 95, 70, 55].map((h, i) => (
            <span key={i} className="flex-1 rounded-[6px]" style={{ height: `${h}%`, background: i === 3 ? "#1a73e9" : tone === "light" ? "rgb(0 0 0 / 0.14)" : "rgb(255 255 255 / 0.25)" }} />
          ))}
        </div>
      </div>
    );
  if (kind === "approval")
    return (
      <div aria-hidden="true" className="flex h-full flex-col gap-[10px]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={`grid h-[18px] w-[18px] place-items-center rounded-full ${i < 2 ? "bg-black text-white" : line}`}>
              {i < 2 && <Icon name="check" size={11} />}
            </span>
            <L w={`${70 - i * 12}%`} />
          </div>
        ))}
      </div>
    );
  // order / invoice: rows with amounts
  return (
    <div aria-hidden="true" className="flex h-full flex-col gap-[9px]">
      <div className="flex items-center justify-between">
        <L w="38%" s />
        <span className="h-[16px] w-[34px] rounded-full bg-[#bfc5ff]" />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <L w={`${52 - i * 8}%`} />
          <L w="18%" />
        </div>
      ))}
      {kind === "invoice" && <span className="mt-auto block h-[10px] w-[42%] self-end rounded-full bg-black/80" />}
    </div>
  );
}
