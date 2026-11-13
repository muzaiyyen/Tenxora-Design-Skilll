"use client";

import { motion } from "motion/react";
import { footer } from "@/lib/content";
import { blog, postHref, sitemapPage as sm } from "@/lib/pages";
import PageHero from "./PageHero";
import SkyFooter from "./SkyFooter";

const ease = [0.22, 1, 0.36, 1] as const;

type L = { label: string; href: string; external?: boolean };

const Arrow = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Group({ n, heading, links, i, wide }: { n: string; heading: string; links: L[]; i: number; wide?: boolean }) {
  return (
    <motion.section
      className={`wcard smap__card${wide ? " smap__card--wide" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease, delay: (i % 3) * 0.08 }}
      aria-labelledby={`smap-${n}`}
    >
      <div className="why__meta">
        <span className={`num ${i === 0 ? "num--green" : ""}`}>{n}</span>
        <h2 id={`smap-${n}`} className="smap__h">
          {heading}
        </h2>
      </div>
      <ul className="smap__list">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <a href={l.href} className="smap__link" {...(l.external ? { target: "_blank", rel: "noopener" } : {})}>
              <span>{l.label.replace(/\s*↗$/, "")}</span>
              <span className="smap__arrow">
                <Arrow />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

export default function SitemapPage() {
  const groups = [sm.main, ...footer.columns, sm.machine];
  const posts = blog.posts.map((p) => ({ label: p.title, href: postHref(p.href), date: p.date }));
  return (
    <>
      <PageHero title={sm.h1} body={<p>{sm.intro}</p>} />

      <section className="section on-white smap" data-header="light">
        <div className="wrap">
          <div className="capsule smap__grid">
            {groups.map((g, i) => (
              <Group key={g.heading} n={String(i + 1).padStart(2, "0")} heading={g.heading} links={g.links} i={i} />
            ))}

            <motion.section
              className="wcard smap__card smap__card--wide"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, ease }}
              aria-labelledby="smap-posts"
            >
              <div className="why__meta">
                <span className="num">{String(groups.length + 1).padStart(2, "0")}</span>
                <h2 id="smap-posts" className="smap__h">
                  {sm.postsHeading}
                </h2>
              </div>
              <ul className="smap__list smap__list--posts">
                {posts.map((p) => (
                  <li key={p.href}>
                    <a href={p.href} className="smap__link">
                      <span>
                        {p.label}
                        <time className="smap__date">{p.date}</time>
                      </span>
                      <span className="smap__arrow">
                        <Arrow />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>
        </div>
      </section>

      <SkyFooter />
    </>
  );
}
