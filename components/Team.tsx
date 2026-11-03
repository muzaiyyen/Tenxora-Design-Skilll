"use client";

import { animate, AnimatePresence, motion, useMotionValue, useTransform, type AnimationPlaybackControls, type MotionValue, type Variants } from "motion/react";
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
type Photo = NonNullable<NonNullable<Member["profile"]>["photo"]>;
/** the photo inside the card window, in the window's own units (fractions of its width) */
const inWindow = (ph: Photo) => ({ left: -ph.left / SLICE_W, top: -ph.top / (SLICE_W * SCENE_RATIO), width: 1 / SLICE_W });
const pct = (v: number) => `${(v * 100).toFixed(3)}%`;

/** px per Figma pixel for the page (--u) and for the cards (--c), mirrored from the CSS */
/*
 * Phones: the cards ride a wheel. Each one is pinned to a point R px below its own centre and turned by
 * `deg` per place away from the middle, so the row bends into an arch; `step` px of scroll or drag turns
 * the wheel one card.
 */
const ARC = { w: 176, deg: 16, R: 660, step: 184 };

function useUnits() {
  const [k, setK] = useState({ u: 1, c: 1, phone: false });
  useLayoutEffect(() => {
    const read = () => {
      const vw = window.innerWidth;
      const phone = vw <= 760;
      const u = phone ? vw / 760 : Math.min(1, vw / 1679);
      setK({ u, c: phone ? ARC.w / 371 : u, phone });
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
  // which way the last arrow press slid the profile (1 = next, -1 = previous)
  const [dir, setDir] = useState<1 | -1>(1);
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
      const want = team.some((m) => m.id === id && m.profile?.photo) ? id : null;
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
    // going back to close a profile must not jump the page (and the card row) back to where it was opened
    const restore = history.scrollRestoration;
    history.scrollRestoration = "manual";
    return () => {
      window.removeEventListener("popstate", sync);
      history.scrollRestoration = restore;
    };
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

  // the profile's arrows step through everyone who has a profile, wrapping round at the ends
  const go = useCallback(
    (d: 1 | -1) => {
      const live = team.filter((t) => t.profile?.photo);
      const i = live.findIndex((t) => t.id === open);
      if (i < 0 || live.length < 2) return;
      const next = live[(i + d + live.length) % live.length];
      history.replaceState(history.state, "", `#${next.id}`);
      setDir(d);
      setOpen(next.id);
      // walk the row behind the overlay so the new member's card sits mid-screen, ready for the close morph
      requestAnimationFrame(() => {
        const sec = section.current;
        const slot = document.querySelector<HTMLElement>(`[data-card="${next.id}"]`);
        if (!sec || !slot) return;
        const r = slot.getBoundingClientRect();
        const top = sec.getBoundingClientRect().top;
        const idx = team.findIndex((t) => t.id === next.id);
        const want = units.phone
          ? Math.min(span.current, idx * ARC.step)
          : Math.min(span.current, Math.max(0, -top + r.left + r.width / 2 - document.documentElement.clientWidth / 2));
        window.scrollTo({ top: top + window.scrollY + want, behavior: "instant" as ScrollBehavior });
      });
    },
    [open, units.phone],
  );

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
  // phones: how far round the wheel has turned, in cards (0 = Bilal in the middle)
  const turn = useTransform(x, (v) => -v / ARC.step);
  const phone = useRef(units.phone);
  phone.current = units.phone;
  const holding = useRef(false);

  /** phones: ease the page scroll so the nearest card (or card i) settles in the middle of the arch */
  const settleTo = useCallback((i?: number) => {
    const sec = section.current;
    if (!sec) return;
    const top = sec.getBoundingClientRect().top + window.scrollY;
    const cur = window.scrollY - top;
    const k = Math.max(0, Math.min(team.length - 1, i ?? Math.round(cur / ARC.step)));
    const to = top + k * ARC.step;
    if (Math.abs(to - window.scrollY) < 1) return Promise.resolve();
    fling.current?.stop();
    const run = animate(window.scrollY, to, { type: "spring", bounce: 0.18, duration: 0.7, onUpdate: (y) => window.scrollTo(0, y) });
    fling.current = run;
    return run.finished.then(() => {
      if (fling.current === run) fling.current = null;
    });
  }, []);

  useLayoutEffect(() => {
    const sec = section.current!;
    let rest: ReturnType<typeof setTimeout> | undefined;
    const place = () => {
      const top = sec.getBoundingClientRect().top;
      x.set(-Math.min(span.current, Math.max(0, -top)));
      // phones: once a scroll or throw comes to rest inside the arch, click the nearest card into the middle
      clearTimeout(rest);
      if (phone.current && top <= 1 && -top <= span.current + 1) {
        rest = setTimeout(() => {
          if (!holding.current && !fling.current) settleTo();
        }, 140);
      }
    };
    const measure = () => {
      const st = stage.current!;
      const vw = document.documentElement.clientWidth;
      span.current = phone.current ? (team.length - 1) * ARC.step : Math.max(0, track.current!.scrollWidth - vw);
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
    // a new touch or wheel takes the page back from a settle that is still easing in
    const interrupt = () => {
      if (!phone.current || !fling.current) return;
      fling.current.stop();
      fling.current = null;
    };
    window.addEventListener("touchstart", interrupt, { passive: true });
    window.addEventListener("wheel", interrupt, { passive: true });
    return () => {
      window.removeEventListener("touchstart", interrupt);
      window.removeEventListener("wheel", interrupt);
      clearTimeout(rest);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", place);
    };
  }, [x, units.phone, settleTo]);

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
    fling.current = null;
    dragged.current = false;
    holding.current = true;
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
      holding.current = false;
      if (phone.current && dragged.current) {
        // phones: a throw spins the wheel on, then it lands on the nearest card
        const sec = section.current!;
        const top = sec.getBoundingClientRect().top + window.scrollY;
        const flick = performance.now() - last.t < 80 ? v * 260 : 0;
        settleTo(Math.round((window.scrollY - flick - top) / ARC.step));
      } else if (dragged.current && Math.abs(v) > 0.1 && performance.now() - last.t < 80) {
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
  }, [settleTo]);

  return (
    <section ref={section} className={`team on-sky${units.phone ? " team--arc" : ""}`} data-header="dark">
      <h1 className="sr-only">Our Team</h1>

      <div ref={stage} className="team__stage">
        <div className="team__sky" aria-hidden>
          <img src={asset("/figma/sky.jpg")} alt="" fetchPriority="high" />
        </div>

        <div ref={viewport} className="team__viewport">
          <motion.div ref={track} className="team__track" style={units.phone ? undefined : { x }} onPointerDown={grab} onDragStart={(e) => e.preventDefault()}>
            {team.map((m, i) => (
              <Card
                key={m.id}
                m={m}
                i={i}
                c={units.c}
                intro={intro}
                open={open === m.id}
                turn={units.phone ? turn : null}
                onOpen={() => {
                  if (dragged.current) return;
                  // phones: a card off to the side swings into the middle first, then opens from there
                  if (units.phone && Math.abs(turn.get() - i) > 0.25) {
                    settleTo(i)?.then(() => show(m.id));
                  } else show(m.id);
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* portalled to <body>: the tall scroll section contains layout, which would trap a fixed overlay */}
      {member?.profile?.photo &&
        createPortal(<Profile key="profile" m={member} dir={dir} units={units} leaving={leaving} onClose={hide} onGone={gone} onNav={go} />, document.body)}
    </section>
  );
}

function Card({
  m,
  i,
  c,
  intro,
  open,
  turn,
  onOpen,
}: {
  m: Member;
  i: number;
  c: number;
  intro: boolean;
  open: boolean;
  turn: MotionValue<number> | null;
  onOpen: () => void;
}) {
  const live = Boolean(m.profile?.photo);
  // phones: this card's place on the wheel, from how far it is from the middle
  const zero = useMotionValue(0);
  const off = useTransform(turn ?? zero, (t) => i - t);
  const rotate = useTransform(off, (o) => o * ARC.deg);
  const scale = useTransform(off, (o) => 1 - Math.min(Math.abs(o), 3) * 0.045);
  const zIndex = useTransform(off, (o) => 50 - Math.round(Math.abs(o) * 10));
  const arc = turn ? { rotate, scale, zIndex } : undefined;
  const ref = useRef<HTMLDivElement>(null);

  // hand focus back to the card when its profile closes
  const wasOpen = useRef(open);
  useEffect(() => {
    if (wasOpen.current && !open) ref.current?.focus({ preventScroll: true });
    wasOpen.current = open;
  }, [open]);

  // while its profile is open the card leaves a same-sized gap, which is also where the profile
  // measures from when it morphs back
  if (open) return <motion.div className="tcard tcard--gap" data-card={m.id} aria-hidden style={arc} />;

  const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } };

  return (
    <motion.div
      ref={ref}
      data-card={m.id}
      className={`tcard${live ? " tcard--live" : ""}`}
      style={arc ? { rotate, scale, zIndex } : undefined}
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
        <div className="tcard__photo" style={{ background: m.profile!.photo!.bg }}>
          <Scene
            photo={m.profile!.photo!}
            alt=""
            style={{
              width: pct(inWindow(m.profile!.photo!).width),
              left: pct(inWindow(m.profile!.photo!).left),
              // top % is of the window's height, which is 441/371 of its width
              top: pct((inWindow(m.profile!.photo!).top * 371) / 441),
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
  dir,
  units,
  leaving,
  onClose,
  onGone,
  onNav,
}: {
  m: Member;
  dir: 1 | -1;
  onNav: (d: 1 | -1) => void;
  units: { u: number; phone: boolean };
  leaving: boolean;
  onClose: () => void;
  onGone: () => void;
}) {
  const p = m.profile!;
  const root = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const pic = useRef<HTMLDivElement | null>(null);
  const tint = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const ph = p.photo!;
  const [box, setBox] = useState(() => frame(units.phone, ph));
  const [shown, setShown] = useState(false);
  // each arrow press mounts a fresh slide; slide 0 is the one that grew out of the card
  const lastId = useRef(m.id);
  const slideN = useRef(0);
  if (lastId.current !== m.id) {
    lastId.current = m.id;
    slideN.current += 1;
  }
  const n = slideN.current;
  const slideKey = `${m.id}-${n}`;
  const setPic = useCallback((el: HTMLDivElement | null) => {
    if (el) pic.current = el;
  }, []);

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
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (!leaving && e.key === "ArrowRight") onNav(1);
      else if (!leaving && e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("resize", on);
      window.removeEventListener("keydown", key);
    };
  }, [onClose, onNav, leaving, toOpen]);

  // a new member slides in at the top of their profile
  useEffect(() => {
    if (n > 0) root.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [n]);

  // a sideways swipe on a phone steps to the next or previous member
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s0 = touch.current;
    touch.current = null;
    if (!s0 || leaving) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s0.x;
    const dy = t.clientY - s0.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) onNav(dx < 0 ? 1 : -1);
  };

  const settle = { type: "spring", bounce: 0.1, duration: 0.7 } as const;
  // the copy is the near layer: after an arrow press it travels further and faster than the photo
  const rise = (d: number) => ({
    initial: n > 0 ? { opacity: 0, x: dir * 120, y: 0, filter: "blur(8px)" } : { opacity: 0, y: 28, filter: "blur(6px)" },
    animate: leaving
      ? { opacity: 0, y: 12, filter: "blur(4px)", transition: { duration: 0.16 } }
      : {
          opacity: 1,
          x: 0,
          y: 0,
          filter: "blur(0px)",
          transition: n > 0 ? { type: "spring" as const, bounce: 0.12, duration: 0.85, delay: 0.18 + d * 0.05 } : { ...settle, delay: 0.32 + d * 0.06 },
        },
  });

  return (
    <div
      ref={root}
      className="profile"
      style={{ "--scene-bg": ph.bg } as React.CSSProperties}
      data-header="light"
      role="dialog"
      aria-modal="true"
      aria-label={`${m.first} ${m.last}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div ref={bg} className="profile__bg">
        <div ref={tint} className="profile__tint" />
      </div>

      <div ref={win} className="profile__photo">
        {/* the new photo wipes in over the old one while sliding against it, so the person drifts slower than the frame */}
        <AnimatePresence initial={false} custom={dir}>
          <motion.div key={slideKey} className="profile__slide" custom={dir} variants={WIPE} initial="enter" animate="center" exit="exit">
            <motion.div className="profile__depth" custom={dir} variants={DEPTH} initial="enter" animate="center" exit="exit">
              <Scene
                ref={setPic}
                photo={ph}
                alt={`${m.first} ${m.last}`}
                style={n > 0 ? (px(toOpen(frame(units.phone, ph)).pic) as React.CSSProperties) : undefined}
                cardOpacity={leaving ? 1 : shown ? 0 : 1}
                leaving={leaving}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait" initial={false} custom={dir}>
      <motion.div
        key={slideKey}
        className="profile__page"
        style={units.phone ? { paddingTop: box.winH + 36 } : { minHeight: box.winH }}
        custom={dir}
        variants={COPY_OUT}
        exit="exit"
      >
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
        <motion.ul className={`profile__clients${p.clients.some((c) => c.x == null) ? " profile__clients--row" : ""}`} {...rise(5)}>
          {p.clients.map((c) => (
            <li key={c.name} style={c.x != null ? ({ "--x": c.x, "--y": c.y, "--w": c.w } as React.CSSProperties) : undefined}>
              {c.logo ? <img src={asset(`/figma/clients/${c.logo}.svg`)} alt={c.name} draggable={false} /> : <span>{c.name}</span>}
            </li>
          ))}
        </motion.ul>
        {p.linkedin && (
        <motion.a
          className="profile__linkedin"
          href={p.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Connect with ${m.first} on LinkedIn`}
          {...rise(6)}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
            <path
              fill="currentColor"
              d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
            />
          </svg>
          Connect on LinkedIn
        </motion.a>
        )}
      </motion.div>
      </AnimatePresence>

      {(
        [
          [-1, "prev", "Previous team member"],
          [1, "next", "Next team member"],
        ] as const
      ).map(([d, side, label]) => (
        <motion.button
          key={side}
          type="button"
          className={`profile__arrow profile__arrow--${side} glass`}
          style={units.phone ? { top: box.winH / 2 } : undefined}
          aria-label={label}
          onClick={() => onNav(d)}
          initial={{ opacity: 0, x: d * -16 }}
          animate={leaving ? { opacity: 0, x: d * -16, transition: { duration: 0.15 } } : { opacity: 1, x: 0, transition: { ...settle, delay: 0.5 } }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden style={side === "prev" ? { transform: "scaleX(-1)" } : undefined}>
            <path d="M7 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      ))}

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

// arrow slides: the incoming frame wipes across while its photo counter-slides (parallax), the outgoing one
// drifts a little the other way and dims, so the new member reads as passing in front
const SLIDE_EASE = [0.77, 0, 0.18, 1] as const;
const WIPE: Variants = {
  enter: (d: number) => ({ x: `${d * 100}%`, zIndex: 2 }),
  center: { x: "0%", zIndex: 2, transition: { duration: 0.95, ease: SLIDE_EASE } },
  exit: (d: number) => ({ x: `${d * -30}%`, zIndex: 1, transition: { duration: 0.95, ease: SLIDE_EASE } }),
};
const DEPTH: Variants = {
  enter: (d: number) => ({ x: `${d * -72}%`, scale: 1.12 }),
  center: { x: "0%", scale: 1, filter: "brightness(1)", transition: { duration: 1.05, ease: SLIDE_EASE } },
  exit: { scale: 1.05, filter: "brightness(0.82)", transition: { duration: 0.95, ease: SLIDE_EASE } },
};
const COPY_OUT: Variants = {
  exit: (d: number) => ({ opacity: 0, x: d * -70, filter: "blur(6px)", transition: { duration: 0.26, ease: [0.4, 0, 1, 1] as const } }),
};

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
