"use client";

import { motion } from "motion/react";
import { blog } from "@/lib/pages";
import PageHero from "./PageHero";
import SkyFooter from "./SkyFooter";

const ease = [0.22, 1, 0.36, 1] as const;
const c = blog.closing;

export default function Blog() {
  return (
    <>
      <PageHero label={blog.kicker} title={blog.h1} body={<p>{blog.intro}</p>} />

      <section className="section on-white posts" data-header="light">
        <div className="wrap">
          <ul className="capsule posts__grid">
            {blog.posts.map((p, i) => (
              <motion.li
                key={p.href}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease, delay: (i % 3) * 0.08 }}
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
                  <span className="post__arrow" aria-hidden>
                    <svg viewBox="0 0 20 20" fill="none">
                      <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </motion.a>
              </motion.li>
            ))}
          </ul>
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
