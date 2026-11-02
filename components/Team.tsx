"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { team, type Member } from "@/lib/team";
import { asset } from "@/lib/asset";

/*
 * Figma "Our Team": a row of 371x633 cards on the blurred sky. Bilal's card opens his profile
 * (Figma frame 36:400) with a shared-element morph: the green card grows into the beige page and
 * the portrait window opens out into the full studio photo, then the copy settles in.
 */

// Apple-like: quick start, soft landing, a hint of overshoot
const MORPH = { type: "spring", bounce: 0.16, duration: 0.8 } as const;
const SCENE = "/figma/bilal-scene.jpg";
const CARD_PHOTO = "/figma/bilal-card.png";
const SCENE_RATIO = 1679 / 1085;
// Figma card: the portrait window frames head and shoulders, a 16.65%-wide slice of the studio photo
// from (53.9%, 12.24%). The sharp card render sits over that slice and fades out as the photo opens up.
const CARD_IMG = { w: "600.587%", left: "-323.754%", top: "-40%" };
const CARD_SLICE = { left: "53.906%", top: "12.236%", width: "16.65%", height: "30.589%" };

/** px per Figma pixel for the page (--u) and for the cards (--c), mirrored from the CSS */
function useUnits() {
  const [k, setK] = useState({ u: 1, c: 1, phone: false });
  useLayoutEffect(() => {
    const read = () => {
      const vw = window.innerWidth;
      const phone = vw <= 760;
      const u = phone ? vw / 760 : Math.min(1, vw / 1679);
      setK({ u, c: phone ? 280 / 371 : u, phone });
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return k;
}

// the header picks its colours from whatever [data-header] block sits under it; nudge it after we swap
const nudgeHeader = () => requestAnimationFrame(() => window.dispatchEvent(new Event("scroll")));

export default function Team() {
  const [open, setOpen] = useState<string | null>(null);
  const units = useUnits();
  const viewport = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);
  // cards rise in on first load only; after a profile closes the card just morphs back
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 1500);
    return () => clearTimeout(t);
  }, []);

  // #bilal opens the profile directly, and the browser back button closes it
  useEffect(() => {
    const sync = () => {
      const id = location.hash.slice(1);
      setOpen(team.some((m) => m.id === id && m.profile) ? id : null);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    nudgeHeader();
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  const show = useCallback((id: string) => {
    history.pushState({ member: id }, "", `#${id}`);
    pushed.current = true;
    setOpen(id);
  }, []);

  const hide = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      history.back();
    } else {
      history.replaceState(null, "", location.pathname + location.search);
      setOpen(null);
    }
  }, []);

  const member = team.find((m) => m.id === open);

  return (
    <section className="team on-sky" data-header="dark">
      <div className="team__sky" aria-hidden>
        <img src={asset("/figma/sky.jpg")} alt="" fetchPriority="high" />
      </div>

      <h1 className="sr-only">Our Team</h1>

      <LayoutGroup>
        <div ref={viewport} className="team__viewport">
          <motion.div className="team__track" drag="x" dragConstraints={viewport} dragElastic={0.08} dragMomentum>
            {team.map((m, i) => (
              <Card key={m.id} m={m} i={i} c={units.c} intro={intro} open={open === m.id} onOpen={() => show(m.id)} />
            ))}
          </motion.div>
        </div>

        <AnimatePresence onExitComplete={nudgeHeader}>
          {member?.profile && <Profile key={member.id} m={member} units={units} onClose={hide} />}
        </AnimatePresence>
      </LayoutGroup>
    </section>
  );
}

function Card({ m, i, c, intro, open, onOpen }: { m: Member; i: number; c: number; intro: boolean; open: boolean; onOpen: () => void }) {
  const live = Boolean(m.profile);
  const ref = useRef<HTMLDivElement>(null);

  // hand focus back to the card when its profile closes
  const wasOpen = useRef(open);
  useEffect(() => {
    if (wasOpen.current && !open) ref.current?.focus({ preventScroll: true });
    wasOpen.current = open;
  }, [open]);

  // while its profile is open the card leaves a same-sized gap, so the row doesn't shift
  if (open) return <div className="tcard tcard--gap" aria-hidden />;

  return (
    <motion.div
      ref={ref}
      layoutId={live ? `card-${m.id}` : undefined}
      className={`tcard${live ? " tcard--live" : ""}`}
      style={{ borderRadius: 42 * c }}
      initial={intro ? { opacity: 0, y: 40 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...MORPH, opacity: { duration: 0.5, delay: 0.15 + i * 0.07 }, y: { type: "spring", bounce: 0.2, duration: 0.9, delay: 0.15 + i * 0.07 } }}
      onTap={live ? onOpen : undefined}
      {...(live
        ? {
            role: "button",
            tabIndex: 0,
            "aria-label": `Meet ${m.first} ${m.last}`,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen();
              }
            },
          }
        : {})}
    >
      <h2 className="tcard__name">
        {m.first}
        <br />
        {m.last}
      </h2>
      <p className="tcard__role">{m.role}</p>

      {live ? (
        <motion.div
          layoutId={`photo-${m.id}`}
          className="tcard__photo"
          style={{ borderTopLeftRadius: 185.5 * c, borderTopRightRadius: 185.5 * c, borderBottomLeftRadius: 42 * c, borderBottomRightRadius: 42 * c }}
          transition={MORPH}
        >
          <Scene id={m.id} alt="" style={{ width: CARD_IMG.w, left: CARD_IMG.left, top: CARD_IMG.top }} />
        </motion.div>
      ) : (
        <div className="tcard__photo tcard__photo--empty" aria-hidden>
          <span className="tcard__head" />
          <span className="tcard__body" />
        </div>
      )}

      <span className="tcard__meet">
        Meet {m.first}
        <span className="tcard__go" aria-hidden>
          <Arrow />
        </span>
      </span>
    </motion.div>
  );
}

function Profile({ m, units, onClose }: { m: Member; units: { u: number; phone: boolean }; onClose: () => void }) {
  const p = m.profile!;
  const close = useRef<HTMLButtonElement>(null);
  const [box, setBox] = useState(() => frame(units.phone));

  useEffect(() => {
    const on = () => setBox(frame(window.innerWidth <= 760));
    window.addEventListener("resize", on);
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    close.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("resize", on);
      window.removeEventListener("keydown", key);
    };
  }, [onClose]);

  const settle = { type: "spring", bounce: 0.1, duration: 0.7 } as const;
  const rise = (d: number) => ({
    initial: { opacity: 0, y: 28, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { ...settle, delay: 0.32 + d * 0.06 } },
    exit: { opacity: 0, y: 12, filter: "blur(4px)", transition: { duration: 0.16 } },
  });

  return (
    <motion.div className="profile" data-header="light" role="dialog" aria-modal="true" aria-label={`${m.first} ${m.last}`} layoutScroll>
      <motion.div
        layoutId={`card-${m.id}`}
        className="profile__bg"
        style={{ borderRadius: 0 }}
        initial={{ backgroundColor: "#08e88c" }}
        animate={{ backgroundColor: "#ebe0d1" }}
        exit={{ backgroundColor: "#08e88c" }}
        transition={MORPH}
      />

      <motion.div
        layoutId={`photo-${m.id}`}
        className="profile__photo"
        style={{ height: box.winH, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        transition={MORPH}
      >
        <Scene id={m.id} alt={`${m.first} ${m.last}`} open style={{ width: box.imgW, left: box.left, top: box.top }} />
      </motion.div>

      <div className="profile__page" style={units.phone ? { paddingTop: box.winH } : { minHeight: box.winH }}>
        <motion.h2 className="profile__name" {...rise(0)}>
          {m.first}
          <br />
          {m.last}
        </motion.h2>
        <motion.p className="profile__role" {...rise(1)}>
          {m.role}
        </motion.p>
        <motion.p className="profile__intro" {...rise(2)}>
          {p.intro}
        </motion.p>
        <motion.ul className="profile__points" {...rise(3)}>
          {p.points.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </motion.ul>
        <motion.p className="profile__with" {...rise(4)}>
          {p.workedWith}
        </motion.p>
        <motion.ul className="profile__clients" {...rise(5)}>
          {p.clients.map((c) => (
            <li key={c.logo} style={{ "--x": c.x, "--y": c.y, "--w": c.w } as React.CSSProperties}>
              <img src={asset(`/figma/clients/${c.logo}.svg`)} alt={c.name} draggable={false} />
            </li>
          ))}
        </motion.ul>
      </div>

      <motion.button
        ref={close}
        type="button"
        className="profile__close glass"
        aria-label="Back to the team"
        onClick={onClose}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1, transition: { ...settle, delay: 0.45 } }}
        exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.15 } }}
      >
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden>
          <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.button>
    </motion.div>
  );
}

/** The studio photo, with the card's sharper head-and-shoulders render laid over its matching slice. */
function Scene({ id, alt, open = false, style }: { id: string; alt: string; open?: boolean; style: React.CSSProperties }) {
  return (
    <motion.div layoutId={`photo-img-${id}`} transition={MORPH} className="scene" style={style}>
      <img src={asset(SCENE)} alt={alt} draggable={false} />
      <motion.img
        className="scene__card"
        src={asset(CARD_PHOTO)}
        alt=""
        draggable={false}
        style={CARD_SLICE}
        initial={{ opacity: open ? 1 : 0 }}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: open ? 0.45 : 0.3, delay: open ? 0.12 : 0.35 }}
      />
    </motion.div>
  );
}

/** Where the studio photo sits when open: filling the screen on desktop, a framed top band on phones. */
function frame(phone: boolean) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (phone) {
    const winH = Math.round(vh * 0.6);
    const imgH = winH / 0.8;
    const imgW = imgH * SCENE_RATIO;
    // keep Bilal (about 67% across the photo) in the middle of the band
    return { winH, imgW, left: vw / 2 - 0.675 * imgW, top: -0.1 * imgH };
  }
  if (vw / vh >= SCENE_RATIO) return { winH: vw / SCENE_RATIO, imgW: vw, left: 0, top: 0 };
  const imgW = vh * SCENE_RATIO;
  return { winH: vh, imgW, left: (vw - imgW) / 2, top: 0 };
}

function Arrow() {
  // Figma "Vector 25": a solid navigation arrow
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden>
      <path d="M4 4.5 21 12 4 19.5l3.2-7.5z" fill="currentColor" />
    </svg>
  );
}
