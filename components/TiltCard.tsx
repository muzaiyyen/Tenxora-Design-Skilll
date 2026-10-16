"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

/** A card that leans toward the pointer in 3D and lifts slightly, with a moving glare. */
export default function TiltCard({
  className,
  children,
  max = 8,
  style,
}: {
  className?: string;
  children: React.ReactNode;
  max?: number;
  style?: React.CSSProperties;
}) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glare = useTransform(
    [sx, sy],
    ([x, y]: number[]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,.55), rgba(255,255,255,0) 55%)`,
  );

  return (
    <motion.div
      className={className}
      style={{ ...style, rotateX, rotateY, transformPerspective: 1200 }}
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      {children}
      <motion.span
        aria-hidden
        style={{ position: "absolute", inset: 0, borderRadius: "inherit", background: glare, pointerEvents: "none", mixBlendMode: "soft-light" }}
      />
    </motion.div>
  );
}
