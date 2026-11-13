"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { Fragment, useEffect, useState } from "react";
import { articles, blog, postHref, slugOf, type Block, type Seg } from "@/lib/pages";
import { links } from "@/lib/content";
import { asset } from "@/lib/asset";
import Magnetic from "./Magnetic";
import SkyFooter from "./SkyFooter";
import Share from "./Share";

const ease = [0.22, 1, 0.36, 1] as const;
const c = blog.closing;
const idOf = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function Rich({ segs }: { segs: Seg[] }) {
  return (
    <>
      {segs.map((s, i) =>
        typeof s === "string" ? (
          <Fragment key={i}>{s}</Fragment>
        ) : "b" in s ? (
          <strong key={i}>{s.b}</strong>
        ) : (
          <a key={i} href={s.href}>
            {s.a}
          </a>
        ),
      )}
    </>
  );
}

function Body({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) =>
        "h2" in b ? (
          <h2 key={i} id={idOf(b.h2)}>
            {b.h2}
          </h2>
        ) : "ul" in b ? (
          <ul key={i}>
            {b.ul.map((li, j) => (
              <li key={j}>
                <Rich segs={li} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            <Rich segs={b.p} />
          </p>
        ),
      )}
    </>
  );
}

export default function Article({ slug }: { slug: string }) {
  const post = blog.posts.find((p) => slugOf(p.href) === slug)!;
  const blocks = articles[slug];
  const heads = blocks.flatMap((b) => ("h2" in b ? [b.h2] : []));
  const related = blog.posts
    .filter((p) => p !== post && p.topics.some((t) => post.topics.includes(t)))
    .slice(0, 3);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 });

  // highlight the section being read in "On this page"
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = heads.map((h) => document.getElementById(idOf(h))).filter(Boolean) as HTMLElement[];
    const onScroll = () => {
      let cur: string | null = null;
      for (const el of els) if (el.getBoundingClientRect().top < window.innerHeight * 0.35) cur = el.id;
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [heads]);

  return (
    <>
      <motion.div className="art__progress" style={{ scaleX: progress }} aria-hidden />

      <section className="phero art__hero on-sky" data-header="dark">
        <div className="hero__sky phero__sky" aria-hidden>
          <img src={asset("/figma/sky.jpg")} alt="" fetchPriority="high" />
        </div>
        <div className="wrap art__head">
          <motion.div
            className="art__meta"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
          >
            <a href={links.blog} className="pill pill--ghost glass art__back">
              <span style={{ position: "relative", zIndex: 2 }}>← {blog.h1}</span>
            </a>
            {post.topics.map((t) => (
              <span key={t} className="art__topic">
                {t}
              </span>
            ))}
          </motion.div>
          <motion.h1
            className="h-display art__title"
            initial={{ opacity: 0, y: 46, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease, delay: 0.25 }}
          >
            {post.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.6 }}
          >
            <span className="status">
              <span className="status__dot" aria-hidden />
              <time>{post.date}</time>
            </span>
          </motion.p>
        </div>
      </section>

      <section className="section on-white art" data-header="light">
        <div className="wrap">
          <motion.div
            className="capsule art__sheet"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.5 }}
          >
            <article className="wcard prose">
              <Body blocks={blocks} />
              <div className="art__share-end">
                <Share url={post.href} title={post.title} label="Share this post" />
              </div>
            </article>
            <aside className="art__aside">
              <div className="art__sticky">
                {heads.length > 0 && (
                  <nav className="wcard art__toc" aria-label="On this page">
                    <p className="art__toc-h">On this page</p>
                    <ol>
                      {heads.map((h) => (
                        <li key={h}>
                          <a href={`#${idOf(h)}`} aria-current={active === idOf(h) ? "location" : undefined}>
                            {h}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}
                <div className="wcard art__share">
                  <Share url={post.href} title={post.title} />
                </div>
                <div className="wcard art__cta">
                  <p>{c.before.trim()}</p>
                  <Magnetic strength={0.15}>
                    <a href={c.call.href} className="pill pill--green glass">
                      <span style={{ position: "relative", zIndex: 2 }}>{c.call.label}</span>
                    </a>
                  </Magnetic>
                </div>
              </div>
            </aside>
          </motion.div>

          {related.length > 0 && (
            <div className="art__more">
              <div className="label-row">
                <span>{blog.h1}</span>
              </div>
              <ul className="posts__grid art__related">
                {related.map((p, i) => (
                  <motion.li
                    key={p.href}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease, delay: i * 0.08 }}
                  >
                    <motion.a href={postHref(p.href)} className="wcard post" whileHover={{ y: -6 }}>
                      <span className="status post__date">
                        <span className="status__dot" aria-hidden />
                        <time>{p.date}</time>
                      </span>
                      <h2 className="post__title">{p.title}</h2>
                      <span className="post__foot">
                        <span className="post__tags">
                          {p.topics.map((t) => (
                            <span key={t} className="post__tag">
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
              </ul>
            </div>
          )}
        </div>
      </section>

      <SkyFooter>
        <p className="lead skyfoot__line">
          {c.before}
          <a href={c.call.href}>{c.call.label}</a>
          {c.mid}
          <a href={c.odoo.href}>{c.odoo.label}</a>
          {c.after}
        </p>
      </SkyFooter>
    </>
  );
}
