"use client";

import { motion } from "motion/react";
import { footer, links } from "@/lib/content";
import { asset } from "@/lib/asset";

const n = footer.newsletter;

export default function Footer() {
  return (
    <footer className="footer wrap">
      <div className="footer__top">
        <div className="footer__brand">
          <a href={links.home} aria-label="Tenxora home">
            <img className="footer__logo" src={asset("/brand/logo-white.svg")} alt="Tenxora" />
          </a>
          <p className="footer__tagline">{footer.tagline}</p>
        </div>

        <form
          className="footer__news"
          onSubmit={(e) => {
            // the live WordPress site handles sign-ups; this static build only shows the form
            e.preventDefault();
          }}
        >
          <p className="footer__kicker">{n.kicker}</p>
          <h2 className="footer__news-h">{n.heading}</h2>
          <p className="footer__news-body">{n.body}</p>
          <div className="footer__field">
            <input type="email" name="email" required placeholder={n.placeholder} aria-label={n.placeholder} />
            <button type="submit" className="pill pill--green glass">
              <span style={{ position: "relative", zIndex: 2 }}>{n.button}</span>
            </button>
          </div>
          <label className="footer__consent">
            <input type="checkbox" name="consent" required />
            <span>
              {n.consent[0]}
              <a href={links.privacy}>{n.consent[1]}</a>
              {n.consent[2]}
            </span>
          </label>
          <p className="footer__note">{n.note}</p>
        </form>
      </div>

      <div className="footer__cols">
        {footer.columns.map((c, i) => (
          <motion.div
            key={c.heading}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <p className="footer__h">{c.heading}</p>
            <ul className="footer__list">
              {c.links.map((l) => (
                <li key={l.label}>
                  <a
                    className="footer__link"
                    href={l.href}
                    {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="footer__bottom">
        <p className="footer__copy">{footer.copyright}</p>
        <div className="footer__meta">
          <a className="footer__llms" href={footer.llms.href}>
            <code>{footer.llms.label}</code>
            <span>{footer.llms.note}</span>
          </a>
          <a className="footer__sitemap glass" href={footer.sitemap.href}>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden>
              <rect x="7.5" y="2.5" width="5" height="4" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
              <rect x="2.5" y="13.5" width="5" height="4" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
              <rect x="12.5" y="13.5" width="5" height="4" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M10 6.5v3.5M5 13.5V10h10v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            <span style={{ position: "relative", zIndex: 2 }}>{footer.sitemap.label}</span>
          </a>
        </div>
        <a className="footer__copy footer__mail" href={`mailto:${footer.email}`}>
          {footer.email}
        </a>
      </div>
    </footer>
  );
}
