"use client";

import { motion } from "motion/react";
import type { Doc, L, Sec } from "@/lib/docs";
import { contactForm as f } from "@/lib/docs";
import PageHero from "./PageHero";
import SkyFooter from "./SkyFooter";
import Magnetic from "./Magnetic";
import { route } from "@/lib/route";

const ease = [0.22, 1, 0.36, 1] as const;
const ext = (href: string) => /^https?:/.test(href) && !href.includes("tenxora.services/") ? { target: "_blank", rel: "noopener" } : {};

const Arrow = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Pill({ l, green }: { l: L; green?: boolean }) {
  return (
    <Magnetic>
      <a href={route(l.href)} className={`pill ${green ? "pill--green" : "pill--ghost"} glass`} {...ext(l.href)}>
        <span style={{ position: "relative", zIndex: 2 }}>{l.label}</span>
      </a>
    </Magnetic>
  );
}

function LinkRows({ links }: { links: L[] }) {
  return (
    <ul className="doc__links">
      {links.map((l) => (
        <li key={l.href + l.label}>
          <a href={route(l.href)} className="smap__link" {...ext(l.href)}>
            <span>{l.label.replace(/\s*[→↗]$/, "")}</span>
            <span className="smap__arrow">
              <Arrow />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

const rise = (i: number) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease, delay: (i % 2) * 0.08 },
});

function Card({ s, i }: { s: Extract<Sec, { kind: "text" | "feature" | "badges" }>; i: number }) {
  return (
    <motion.section className={`wcard doc__card doc__card--${s.kind}`} {...rise(i)} id={"id" in s ? s.id : undefined}>
      <h2 className="doc__h">{s.heading}</h2>
      {s.body && <p className="doc__p">{s.body}</p>}
      {s.kind === "badges" && (
        <ul className="doc__badges">
          {s.badges.map((b) => (
            <li key={b} className="status">
              <span className="status__dot" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      )}
      {s.kind === "text" && s.list && (
        s.ordered ? (
          <ol className="doc__ol">
            {s.list.map((t, j) => (
              <li key={t}>
                <span className="num">{String(j + 1).padStart(2, "0")}</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        ) : (
          <ul className="doc__ul">{s.list.map((t) => <li key={t}>{t}</li>)}</ul>
        )
      )}
      {s.kind === "text" && s.subs && (
        <div className="doc__subs">
          {s.subs.map((sub) => (
            <div key={sub.heading} className="doc__sub">
              <h3>{sub.heading}</h3>
              {sub.body && <p className="doc__p">{sub.body}</p>}
            </div>
          ))}
        </div>
      )}
      {s.kind !== "badges" && s.links && <LinkRows links={s.links} />}
      {s.kind === "feature" && s.cta && (
        <div className="doc__cta">
          <Pill l={s.cta} green />
        </div>
      )}
    </motion.section>
  );
}

function Steps({ s }: { s: Extract<Sec, { kind: "steps" }> }) {
  return (
    <div className="doc__block">
      {s.heading && <h2 className="doc__bh">{s.heading}</h2>}
      <ol className={`doc__steps doc__steps--${s.items.length}`}>
        {s.items.map((it, i) => (
          <motion.li
            key={it.n}
            className="wcard doc__step"
            initial={{ opacity: 0, y: 50, rotate: i % 2 ? 2 : -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 70, damping: 15, delay: i * 0.06 }}
          >
            <div className="why__meta">
              <span className={`num ${i === 0 ? "num--green" : ""}`}>{it.n}</span>
              {it.tag && <span className="why__tag">{it.tag}</span>}
            </div>
            <h3 className="doc__sh">{it.heading}</h3>
            {it.body && <p className="doc__p">{it.body}</p>}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function Form() {
  return (
    <motion.form className="wcard doc__form" {...rise(1)} onSubmit={(e) => e.preventDefault()} aria-label="Enquiry form">
      <label className="doc__field">
        <span>{f.name}</span>
        <input type="text" name="name" required autoComplete="name" />
      </label>
      <label className="doc__field">
        <span>{f.email}</span>
        <input type="email" name="email" required autoComplete="email" />
      </label>
      <label className="doc__field">
        <span>{f.company}</span>
        <input type="text" name="company" autoComplete="organization" />
      </label>
      <label className="doc__field">
        <span>{f.area}</span>
        <select name="area" required defaultValue="">
          <option value="" disabled>
            {f.areaPlaceholder}
          </option>
          {f.areas.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </label>
      <label className="doc__field">
        <span>{f.message}</span>
        <textarea name="message" required minLength={20} maxLength={5000} rows={6} />
        <small>{f.messageHint}</small>
      </label>
      <label className="doc__check">
        <input type="checkbox" required />
        <span>
          {f.consent.before}
          <a href={route(f.consent.link.href)}>{f.consent.link.label}</a>
          {f.consent.after}
        </span>
      </label>
      <button type="submit" className="pill pill--green glass doc__submit">
        <span style={{ position: "relative", zIndex: 2 }}>{f.submit}</span>
      </button>
    </motion.form>
  );
}

function Block({ s, i }: { s: Sec; i: number }) {
  switch (s.kind) {
    case "steps":
      return <Steps s={s} />;
    case "offer":
      return (
        <motion.section className="wcard doc__offer" id={s.id} {...rise(0)}>
          <div>
            {s.label && (
              <p className="status">
                <span className="status__dot" aria-hidden />
                {s.label}
              </p>
            )}
            <h2 className="doc__oh">{s.heading}</h2>
            {s.body && <p className="doc__p">{s.body}</p>}
            {s.links && <LinkRows links={s.links} />}
          </div>
          <div className="doc__price">
            {s.price && <p className="doc__amount">{s.price}</p>}
            <Pill l={s.cta} green />
          </div>
        </motion.section>
      );
    case "links":
      return (
        <div className="doc__block doc__related">
          <h2 className="doc__bh">{s.heading}</h2>
          <ul className="doc__chips">
            {s.links.map((l) => (
              <li key={l.href + l.label}>
                <a href={route(l.href)} className="chip glass">
                  {l.label}
                  <span className="post__arrow">
                    <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
    case "refs":
      return (
        <div className="doc__refs">
          <h2>{s.heading}</h2>
          <ul>
            {s.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} {...ext(l.href)}>
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
          {s.note && <p>{s.note}</p>}
        </div>
      );
    case "actions":
      return (
        <motion.div className="doc__actions" {...rise(0)}>
          {s.heading && <h2 className="doc__bh">{s.heading}</h2>}
          <div className="doc__pills">
            {s.actions.map((a, j) => (
              <Pill key={a.href + a.label} l={a} green={j === 0} />
            ))}
          </div>
        </motion.div>
      );
    case "embed":
      return (
        <motion.section className="wcard doc__embed" {...rise(0)}>
          <h2 className="doc__h">{s.heading}</h2>
          {s.body && <p className="doc__p">{s.body}</p>}
          <div className="doc__frame">
            <iframe src={`${s.src}?hide_gdpr_banner=1`} title={s.heading} loading="lazy" />
          </div>
          <a href={s.fallback.href} className="doc__fallback" target="_blank" rel="noopener">
            {s.fallback.label}
          </a>
        </motion.section>
      );
    case "form":
      return <Form />;
    case "cards":
      return (
        <div className="doc__block">
          <h2 className="doc__bh">{s.heading}</h2>
          <div className="doc__cards">
            {s.items.map((c, j) => (
              <motion.a key={c.heading} href={route(c.link.href)} className="wcard doc__mini" {...rise(j)} whileHover={{ y: -6 }}>
                <span className="num">{String(j + 1).padStart(2, "0")}</span>
                <h3 className="doc__sh">{c.heading}</h3>
                {c.body && <p className="doc__p">{c.body}</p>}
                <span className="svc__link">
                  <span>{c.link.label.replace(/\s*→$/, "")}</span>
                  <span className="post__arrow">
                    <Arrow />
                  </span>
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      );
    default:
      return <Card s={s} i={i} />;
  }
}

// consecutive text / feature / badges sections share a two-column grid
type Run = { grid: true; items: Sec[] } | { grid: false; s: Sec };
function runs(sections: Sec[]): Run[] {
  const out: Run[] = [];
  for (const s of sections) {
    const g = s.kind === "text" || s.kind === "feature" || s.kind === "badges";
    const last = out[out.length - 1];
    if (g && last && last.grid) last.items.push(s);
    else out.push(g ? { grid: true, items: [s] } : { grid: false, s });
  }
  return out;
}

export function DocSections({ sections }: { sections: Sec[] }) {
  return (
    <>
      {runs(sections).map((r, k) =>
        r.grid ? (
          <div key={k} className={`doc__grid${r.items.length === 1 ? " doc__grid--one" : ""}`}>
            {r.items.map((s, i) => (
              <Block key={i} s={s} i={i} />
            ))}
          </div>
        ) : (
          <Block key={k} s={r.s} i={0} />
        ),
      )}
    </>
  );
}

export default function DocPage({ doc }: { doc: Doc }) {
  const form = doc.sections.some((s) => s.kind === "form");
  const [first, ...rest] = doc.actions ?? [];
  return (
    <>
      <PageHero
        label={doc.label}
        title={doc.h1}
        lead={doc.lead}
        body={doc.body || doc.updated ? <>{doc.body && <p>{doc.body}</p>}{doc.updated && <p className="doc__updated">{doc.updated}</p>}</> : undefined}
        actions={
          first ? (
            <>
              <Pill l={first} green />
              {rest.map((a) => (
                <Pill key={a.href + a.label} l={a} />
              ))}
            </>
          ) : undefined
        }
      />

      <section className="section on-white doc" data-header="light">
        <div className="wrap">
          <div className={`capsule doc__sheet${form ? " doc__sheet--form" : ""}`}>
            {form ? (
              <>
                <div className="doc__side">
                  <DocSections sections={doc.sections.filter((s) => s.kind !== "form")} />
                </div>
                <Form />
              </>
            ) : (
              <DocSections sections={doc.sections} />
            )}
          </div>
        </div>
      </section>

      <SkyFooter />
    </>
  );
}
