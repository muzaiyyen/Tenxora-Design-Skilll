"use client";

import { animate, motion, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { team, type Member } from "@/lib/team";
import { asset } from "@/lib/asset";

/*
 * Figma "Our Team": a row of 371x633 cards on the blurred sky. Bilal's card opens his profile
 * (Figma frame 36:400) with a shared-element morph: the green card grows into the beige page and
 * the portrait window opens out into the full studio photo, then the copy settles in.
 */

const SCENE_RATIO = 1679 / 1085;
// Figma card: the portrait window frames head and shoulders, a 16.65%-wide slice of the studio photo
// starting at the member's photo.left/top. Bilal's sharp card render sits over that slice and fades out
// as the photo opens up.
const SLICE_W = 0.1665;
// the window is 371x441 card px, so the slice is this tall as a share of the photo
const SLICE_H = (SLICE_W * SCENE_RATIO * 441) / 371;
type Photo = NonNullable<Member["profile"]>["photo"];
/** the photo inside the card window, in the window's own units (fractions of its width) */
const inWindow = (ph: Photo) => ({ left: -ph.left / SLICE_W, top: -ph.top / (SLICE_W * SCENE_RATIO), width: 1 / SLICE_W });
const pct = (v: number) => `${(v * 100).toFixed(3)}%`;

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

  /*
   * Scrolling the page walks the card row sideways: the section is as tall as the row is wide, its
   * stage sticks to the screen, and the row's x follows how far the section has been scrolled.
   * Dragging the row (mouse or a sideways swipe) moves the page scroll the same way, so both stay in step.
   */
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const span = useRef(0);
  const dragged = useRef(false);
  const fling = useRef<AnimationPlaybackControls | null>(null);

  useLayoutEffect(() => {
    const sec = section.current!;
    const place = () => {
      const top = sec.getBoundingClientRect().top;
      x.set(-Math.min(span.current, Math.max(0, -top)));
    };
    const measure = () => {
      const st = stage.current!;
      const vw = document.documentElement.clientWidth;
      span.current = Math.max(0, track.current!.scrollWidth - vw);
      const h = st.offsetHeight;
      st.style.top = `${Math.min(0, window.innerHeight - h)}px`;
      sec.style.height = `${h + span.current}px`;
      place();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage.current!);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", place, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", place);
    };
  }, [x]);

  // a sideways trackpad swipe over the row scrolls it too
  useEffect(() => {
    const st = stage.current!;
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        window.scrollBy(0, e.deltaX);
      }
    };
    st.addEventListener("wheel", wheel, { passive: false });
    return () => st.removeEventListener("wheel", wheel);
  }, []);

  const grab = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    // touch: a vertical swipe already scrolls the page; we only take over sideways swipes
    const touch = e.pointerType === "touch";
    fling.current?.stop();
    dragged.current = false;
    const x0 = e.clientX;
    const y0 = e.clientY;
    const s0 = window.scrollY;
    let last = { t: performance.now(), x: x0 };
    let v = 0;
    let mode: "x" | "y" | null = touch ? null : "x";
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - x0;
      if (!mode) {
        if (Math.abs(dx) < 6 && Math.abs(ev.clientY - y0) < 6) return;
        mode = Math.abs(dx) > Math.abs(ev.clientY - y0) ? "x" : "y";
      }
      if (mode !== "x") return;
      if (Math.abs(dx) > 5) dragged.current = true;
      if (!dragged.current) return;
      ev.preventDefault();
      window.scrollTo(0, s0 - dx);
      const now = performance.now();
      const dt = now - last.t;
      if (dt > 0) v = 0.8 * ((ev.clientX - last.x) / dt) + 0.2 * v;
      last = { t: now, x: ev.clientX };
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      document.documentElement.classList.remove("is-grabbing");
      if (dragged.current && Math.abs(v) > 0.1 && performance.now() - last.t < 80) {
        // carry the throw on, easing out like a native fling
        const from = window.scrollY;
        const to = from - v * 320;
        fling.current = animate(from, to, { duration: 0.9, ease: [0.16, 1, 0.3, 1], onUpdate: (y) => window.scrollTo(0, y) });
      }
      // let the click that ends a drag fall through without opening a card
      setTimeout(() => (dragged.current = false), 0);
    };
    if (!touch) document.documentElement.classList.add("is-grabbing");
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }, []);

  return (
    <section ref={section} className="team on-sky" data-header="dark">
      <h1 className="sr-only">Our Team</h1>

      <div ref={stage} className="team__stage">
        <div className="team__sky" aria-hidden>
          <img src={asset("/figma/sky.jpg")} alt="" fetchPriority="high" />
        </div>

        <div ref={viewport} className="team__viewport">
          <motion.div ref={track} className="team__track" style={{ x }} onPointerDown={grab} onDragStart={(e) => e.preventDefault()}>
            {team.map((m, i) => (
              <Card key={m.id} m={m} i={i} c={units.c} intro={intro} open={open === m.id} onOpen={() => !dragged.current && show(m.id)} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* portalled to <body>: the tall scroll section contains layout, which would trap a fixed overlay */}
      {member?.profile &&
        createPortal(<Profile key={member.id} m={member} units={units} leaving={leaving} onClose={hide} onGone={gone} />, document.body)}
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
        <div className="tcard__photo" style={{ background: m.profile!.photo.bg }}>
          <Scene
            photo={m.profile!.photo}
            alt=""
            style={{
              width: pct(inWindow(m.profile!.photo).width),
              left: pct(inWindow(m.profile!.photo).left),
              // top % is of the window's height, which is 441/371 of its width
              top: pct((inWindow(m.profile!.photo).top * 371) / 441),
            }}
          />
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
  const ph = p.photo;
  const [box, setBox] = useState(() => frame(units.phone, ph));
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
      pic: { left: inWindow(ph).left * w, top: inWindow(ph).top * w, width: inWindow(ph).width * w },
    };
  }, [m.id, ph]);

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
      const b = frame(window.innerWidth <= 760, ph);
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
    <div ref={root} className="profile" style={{ "--scene-bg": ph.bg } as React.CSSProperties} data-header="light" role="dialog" aria-modal="true" aria-label={`${m.first} ${m.last}`}>
      <div ref={bg} className="profile__bg">
        <div ref={tint} className="profile__tint" />
      </div>

      <div ref={win} className="profile__photo">
        <Scene ref={pic} photo={ph} alt={`${m.first} ${m.last}`} cardOpacity={leaving ? 1 : shown ? 0 : 1} leaving={leaving} />
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
        <motion.a
          className="profile__linkedin"
          href={p.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Connect with ${m.first} on LinkedIn`}
          {...rise(4)}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
            <path
              fill="currentColor"
              d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
            />
          </svg>
          Connect on LinkedIn
        </motion.a>
        <motion.p className="profile__with" {...rise(4)}>
          {p.workedWith}
        </motion.p>
        <motion.ul className={`profile__clients${p.clients.some((c) => c.x == null) ? " profile__clients--row" : ""}`} {...rise(5)}>
          {p.clients.map((c) => (
            <li key={c.name} style={c.x != null ? ({ "--x": c.x, "--y": c.y, "--w": c.w } as React.CSSProperties) : undefined}>
              {c.logo ? <img src={asset(`/figma/clients/${c.logo}.svg`)} alt={c.name} draggable={false} /> : <span>{c.name}</span>}
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
  photo,
  alt,
  style,
  cardOpacity = 1,
  leaving = false,
}: {
  ref?: React.Ref<HTMLDivElement>;
  photo: Photo;
  alt: string;
  style?: React.CSSProperties;
  cardOpacity?: number;
  leaving?: boolean;
}) {
  return (
    <div ref={ref} className="scene" style={style}>
      <img src={asset(photo.scene)} alt={alt} draggable={false} />
      {photo.card && (
        <motion.img
          className="scene__card"
          src={asset(photo.card)}
          alt=""
          draggable={false}
          style={{ left: pct(photo.left), top: pct(photo.top), width: pct(SLICE_W), height: pct(SLICE_H) }}
          initial={false}
          animate={{ opacity: cardOpacity }}
          transition={leaving ? { duration: 0.25, delay: 0.38 } : { duration: 0.45, delay: 0.12 }}
        />
      )}
    </div>
  );
}

/** Where the studio photo sits when open: filling the screen on desktop, a framed top band on phones. */
function frame(phone: boolean, ph: Photo) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (phone) {
    const winH = Math.round(vh * 0.6);
    const imgH = winH / 0.8;
    const imgW = imgH * SCENE_RATIO;
    // keep the person (focus = how far across the photo they stand) in the middle of the band
    return { winH, imgW, left: vw / 2 - ph.focus * imgW, top: (ph.phoneTop ?? -0.1) * imgH };
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
