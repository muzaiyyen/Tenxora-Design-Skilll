"use client";

import { animate, motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { team, type Member } from "@/lib/team";
import { asset } from "@/lib/asset";

/*
 * Figma "Our Team": a row of 371x633 cards on the blurred sky. Bilal's card opens his profile
 * (Figma frame 36:400) with a shared-element morph: the green card grows into the beige page and
 * the portrait window opens out into the full studio photo, then the copy settles in.
 */

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
  // the profile plays its closing morph before it unmounts
  const [leaving, setLeaving] = useState(false);
  const units = useUnits();
  const viewport = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);
  // cards rise in on first load only
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 1500);
    return () => clearTimeout(t);
  }, []);

  // #bilal opens the profile directly, and the browser back button closes it
  useEffect(() => {
    const sync = () => {
      const id = location.hash.slice(1);
      const want = team.some((m) => m.id === id && m.profile) ? id : null;
      setOpen((cur) => {
        if (cur && !want) {
          setLeaving(true);
          return cur;
        }
        return want;
      });
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
    setLeaving(false);
    setOpen(id);
  }, []);

  const hide = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      history.back();
    } else {
      history.replaceState(null, "", location.pathname + location.search);
      setLeaving(true);
    }
  }, []);

  const gone = useCallback(() => {
    setLeaving(false);
    setOpen(null);
  }, []);

  const member = team.find((m) => m.id === open);

  return (
    <section className="team on-sky" data-header="dark">
      <div className="team__sky" aria-hidden>
        <img src={asset("/figma/sky.jpg")} alt="" fetchPriority="high" />
      </div>

      <h1 className="sr-only">Our Team</h1>

      <div ref={viewport} className="team__viewport">
        <motion.div className="team__track" drag="x" dragConstraints={viewport} dragElastic={0.08} dragMomentum>
          {team.map((m, i) => (
            <Card key={m.id} m={m} i={i} c={units.c} intro={intro} open={open === m.id} onOpen={() => show(m.id)} />
          ))}
        </motion.div>
      </div>

      {member?.profile && <Profile key={member.id} m={member} units={units} leaving={leaving} onClose={hide} onGone={gone} />}
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

  // while its profile is open the card leaves a same-sized gap, which is also where the profile
  // measures from when it morphs back
  if (open) return <div className="tcard tcard--gap" data-card={m.id} aria-hidden />;

  const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } };

  return (
    <motion.div
      ref={ref}
      data-card={m.id}
      className={`tcard${live ? " tcard--live" : ""}`}
      initial={intro ? { opacity: 0, y: 40 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ opacity: { duration: 0.5, delay: 0.15 + i * 0.07 }, y: { type: "spring", bounce: 0.2, duration: 0.9, delay: 0.15 + i * 0.07 } }}
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
      <motion.h2 className="tcard__name" {...fadeIn}>
        {m.first}
        <br />
        {m.last}
      </motion.h2>
      <motion.p className="tcard__role" {...fadeIn}>
        {m.role}
      </motion.p>

      {live ? (
        <div className="tcard__photo">
          <Scene alt="" style={{ width: CARD_IMG.w, left: CARD_IMG.left, top: CARD_IMG.top }} />
        </div>
      ) : (
        <div className="tcard__photo tcard__photo--empty" aria-hidden>
          <span className="tcard__head" />
          <span className="tcard__body" />
        </div>
      )}

      <motion.span className="tcard__meet" {...fadeIn}>
        Meet {m.first}
        <span className="tcard__go" aria-hidden>
          <Arrow />
        </span>
      </motion.span>
    </motion.div>
  );
}

/*
 * The morph is driven by real geometry, not layout transforms: the backdrop, the photo window and the
 * photo inside it each animate left/top/size from the card's measured slot to their open spots on one
 * spring, so the photo stays locked to the window the whole way (no scale distortion, no drift).
 */
function Profile({
  m,
  units,
  leaving,
  onClose,
  onGone,
}: {
  m: Member;
  units: { u: number; phone: boolean };
  leaving: boolean;
  onClose: () => void;
  onGone: () => void;
}) {
  const p = m.profile!;
  const root = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const pic = useRef<HTMLDivElement>(null);
  const tint = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const [box, setBox] = useState(() => frame(units.phone));
  const [shown, setShown] = useState(false);

  /** card geometry, measured from its slot in the row (viewport coordinates) */
  const fromCard = useCallback(() => {
    const slot = document.querySelector<HTMLElement>(`[data-card="${m.id}"]`);
    const r = slot?.getBoundingClientRect() ?? new DOMRect(window.innerWidth / 2 - 185, window.innerHeight / 2 - 316, 371, 633);
    const c = r.width / 371;
    const w = r.width;
    const h = 441 * c;
    return {
      bg: { left: r.left, top: r.top, width: w, height: r.height, borderRadius: 42 * c },
      win: { left: r.left, top: r.top + 192 * c, width: w, height: h, borderTopLeftRadius: 185.5 * c, borderTopRightRadius: 185.5 * c, borderBottomLeftRadius: 42 * c, borderBottomRightRadius: 42 * c },
      pic: { left: -3.23754 * w, top: -0.4 * h, width: 6.00587 * w },
    };
  }, [m.id]);

  const toOpen = useCallback((b: ReturnType<typeof frame>) => {
    const vw = document.documentElement.clientWidth;
    return {
      bg: { left: 0, top: 0, width: vw, height: window.innerHeight, borderRadius: 0 },
      win: { left: 0, top: 0, width: vw, height: b.winH, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
      pic: { left: b.left, top: b.top, width: b.imgW },
    };
  }, []);

  // open: jump to the card's geometry, then spring out to the full page
  useLayoutEffect(() => {
    const a = fromCard();
    const z = toOpen(box);
    Object.assign(bg.current!.style, px(a.bg));
    Object.assign(win.current!.style, px(a.win));
    Object.assign(pic.current!.style, px(a.pic));
    const spring = { type: "spring", bounce: 0.16, duration: 0.8 } as const;
    tint.current!.style.opacity = "1";
    const runs = [
      ...morph(bg.current!, z.bg, spring),
      ...morph(win.current!, z.win, spring),
      ...morph(pic.current!, z.pic, spring),
      animate(tint.current!, { opacity: 0 }, { duration: 0.6, ease: [0.32, 0.72, 0, 1] }),
    ];
    setShown(true);
    close.current?.focus({ preventScroll: true });
    return () => runs.forEach((r) => r.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // close: spring back into the card's slot (allowing for how far the profile was scrolled), then unmount
  useEffect(() => {
    if (!leaving) return;
    const a = fromCard();
    const st = root.current?.scrollTop ?? 0;
    const spring = { type: "spring", bounce: 0.1, duration: 0.65 } as const;
    const runs = [
      ...morph(bg.current!, a.bg, spring),
      ...morph(win.current!, { ...a.win, top: a.win.top + st }, spring),
      ...morph(pic.current!, a.pic, spring),
      animate(tint.current!, { opacity: 1 }, { duration: 0.45, ease: [0.32, 0.72, 0, 1] }),
    ];
    let done = false;
    Promise.all(runs.map((r) => r.finished)).then(() => {
      if (!done) onGone();
    });
    return () => {
      done = true;
      runs.forEach((r) => r.stop());
    };
  }, [leaving, fromCard, onGone]);

  // keep the open layout right if the window is resized
  useEffect(() => {
    const on = () => {
      if (leaving) return;
      const b = frame(window.innerWidth <= 760);
      setBox(b);
      const z = toOpen(b);
      Object.assign(bg.current!.style, px(z.bg));
      Object.assign(win.current!.style, px(z.win));
      Object.assign(pic.current!.style, px(z.pic));
    };
    window.addEventListener("resize", on);
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("resize", on);
      window.removeEventListener("keydown", key);
    };
  }, [onClose, leaving, toOpen]);

  const settle = { type: "spring", bounce: 0.1, duration: 0.7 } as const;
  const rise = (d: number) => ({
    initial: { opacity: 0, y: 28, filter: "blur(6px)" },
    animate: leaving
      ? { opacity: 0, y: 12, filter: "blur(4px)", transition: { duration: 0.16 } }
      : { opacity: 1, y: 0, filter: "blur(0px)", transition: { ...settle, delay: 0.32 + d * 0.06 } },
  });

  return (
    <div ref={root} className="profile" data-header="light" role="dialog" aria-modal="true" aria-label={`${m.first} ${m.last}`}>
      <div ref={bg} className="profile__bg">
        <div ref={tint} className="profile__tint" />
      </div>

      <div ref={win} className="profile__photo">
        <Scene ref={pic} alt={`${m.first} ${m.last}`} cardOpacity={leaving ? 1 : shown ? 0 : 1} leaving={leaving} />
      </div>

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
        animate={leaving ? { opacity: 0, scale: 0.6, transition: { duration: 0.15 } } : { opacity: 1, scale: 1, transition: { ...settle, delay: 0.45 } }}
      >
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden>
          <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.button>
    </div>
  );
}

// box geometry rides the spring; corner rounding eases alongside it (springs don't carry those)
const SHAPE = new Set(["borderRadius", "borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"]);
function morph(el: HTMLElement, to: Record<string, string | number>, spring: { type: "spring"; bounce: number; duration: number }) {
  const box: Record<string, string | number> = {};
  const look: Record<string, string> = {};
  for (const [k, v] of Object.entries(to)) {
    if (SHAPE.has(k)) look[k] = typeof v === "number" ? `${v}px` : v;
    else box[k] = v;
  }
  const runs = [animate(el, box, spring)];
  if (Object.keys(look).length) runs.push(animate(el, look, { duration: spring.duration * 0.75, ease: [0.32, 0.72, 0, 1] }));
  return runs;
}

const px = (o: Record<string, string | number>) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === "number" ? `${v}px` : v])) as Partial<CSSStyleDeclaration>;

/** The studio photo, with the card's sharper head-and-shoulders render laid over its matching slice. */
function Scene({
  ref,
  alt,
  style,
  cardOpacity = 1,
  leaving = false,
}: {
  ref?: React.Ref<HTMLDivElement>;
  alt: string;
  style?: React.CSSProperties;
  cardOpacity?: number;
  leaving?: boolean;
}) {
  return (
    <div ref={ref} className="scene" style={style}>
      <img src={asset(SCENE)} alt={alt} draggable={false} />
      <motion.img
        className="scene__card"
        src={asset(CARD_PHOTO)}
        alt=""
        draggable={false}
        style={CARD_SLICE}
        initial={false}
        animate={{ opacity: cardOpacity }}
        transition={leaving ? { duration: 0.25, delay: 0.38 } : { duration: 0.45, delay: 0.12 }}
      />
    </div>
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
