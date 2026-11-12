"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useState } from "react";
import { blog } from "@/lib/pages";
import PageHero from "./PageHero";
import SkyFooter from "./SkyFooter";

const ease = [0.22, 1, 0.36, 1] as const;
const c = blog.closing;

export default function Blog() {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("All");
  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return blog.posts.filter(
      (p) =>
        (topic === "All" || p.topics.includes(topic)) &&
        words.every((w) => (p.title + " " + p.topics.join(" ")).toLowerCase().includes(w)),
    );
  }, [q, topic]);

  return (
    <>
      <PageHero label={blog.kicker} title={blog.h1} body={<p>{blog.intro}</p>} />

      <section className="section on-white posts" data-header="light">
        <div className="wrap">
          <div className="capsule posts__panel">
            <Filters q={q} setQ={setQ} topic={topic} setTopic={setTopic} />
            <p className="sr-only" aria-live="polite">
              {list.length} of {blog.posts.length} posts
            </p>
            <LayoutGroup>
              <motion.ul className="posts__grid" layout>
                <AnimatePresence mode="popLayout" initial={false}>
                  {list.map((p, i) => (
                    <motion.li
                      key={p.href}
                      layout
                      initial={{ opacity: 0, y: 40, scale: 0.96 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.6, ease, delay: (i % 3) * 0.06 }}
                    >
                      <motion.a
                        href={p.href}
                        className="wcard post"
                        whileHover={{ y: -6 }}
                        transition={{ type: "spring", stiffness: 260, damping: 22 }}
                      >
                        <span className="status post__date">
                          <span className="status__dot" aria-hidden />
                          <time>{p.date}</time>
                        </span>
                        <h2 className="post__title">{p.title}</h2>
                        <span className="post__foot">
                          <span className="post__tags">
                            {p.topics.map((t) => (
                              <span key={t} className={`post__tag${t === topic ? " is-on" : ""}`}>
                                {t}
                              </span>
                            ))}
                          </span>
                          <span className="post__arrow" aria-hidden>
                            <svg viewBox="0 0 20 20" fill="none">
                              <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </span>
                      </motion.a>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            </LayoutGroup>
            <AnimatePresence>
              {list.length === 0 && (
                <motion.div
                  className="posts__empty"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="body">No posts match that search.</p>
                  <button
                    type="button"
                    className="pill pill--green glass"
                    onClick={() => {
                      setQ("");
                      setTopic("All");
                    }}
                  >
                    <span style={{ position: "relative", zIndex: 2 }}>Show all posts</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <SkyFooter>
        <motion.p
          className="lead skyfoot__line"
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease }}
        >
          {c.before}
          <a href={c.call.href}>{c.call.label}</a>
          {c.mid}
          <a href={c.odoo.href}>{c.odoo.label}</a>
          {c.after}
        </motion.p>
      </SkyFooter>
    </>
  );
}

function Filters({
  q,
  setQ,
  topic,
  setTopic,
}: {
  q: string;
  setQ: (v: string) => void;
  topic: string;
  setTopic: (v: string) => void;
}) {
  const chips = ["All", ...blog.topics];
  const count = (t: string) => (t === "All" ? blog.posts.length : blog.posts.filter((p) => p.topics.includes(t)).length);
  return (
    <div className="posts__filters">
      <label className="posts__search glass">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden>
          <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="m13.2 13.2 3.6 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="sr-only">Search posts</span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts" />
        {q && (
          <button type="button" className="posts__clear" onClick={() => setQ("")} aria-label="Clear search">
            ×
          </button>
        )}
      </label>
      <div className="posts__chips" role="group" aria-label="Filter by topic">
        {chips.map((t) => (
          <button
            key={t}
            type="button"
            className="posts__chip"
            aria-pressed={topic === t}
            onClick={() => setTopic(t)}
          >
            {topic === t && (
              <motion.span
                layoutId="chip-thumb"
                className="posts__chip-thumb"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="posts__chip-label">
              {t} <span className="posts__chip-n">{count(t)}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
