"use client";

import { motion } from "motion/react";
import { footer } from "@/lib/content";
import { asset } from "@/lib/asset";

const ICONS: Record<string, React.ReactNode> = {
  Facebook: <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z" />,
  LinkedIn: (
    <path d="M6.9 8.8H3.8V20h3.1V8.8ZM5.3 3.8a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM20.2 13.6c0-3-1.6-4.9-4.2-4.9-1.4 0-2.4.8-2.8 1.5V8.8h-3V20h3.1v-5.6c0-1.5.3-2.9 2.1-2.9s1.8 1.7 1.8 3V20h3.1v-6.4Z" />
  ),
  Instagram: (
    <path d="M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.8-8.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2ZM12 4.6c2.4 0 2.7 0 3.6.1 2.4.1 3.6 1.3 3.7 3.7.1.9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.3 3.6-3.7 3.7-.9.1-1.2.1-3.6.1s-2.7 0-3.6-.1c-2.4-.1-3.6-1.3-3.7-3.7-.1-.9-.1-1.2-.1-3.6s0-2.7.1-3.6C4.8 6 6 4.8 8.4 4.7c.9-.1 1.2-.1 3.6-.1Z" />
  ),
};

export default function Footer() {
  return (
    <footer className="footer wrap">
      <div className="footer__row">
        <img className="footer__logo" src={asset("/brand/logo-white.svg")} alt="Tenxora" />
        <a href={footer.contact.href} className="pill pill--dark glass">
          <span style={{ position: "relative", zIndex: 2 }}>{footer.contact.label}</span>
        </a>
      </div>
      <div className="footer__cols">
        <div>
          <p className="footer__h">{footer.follow}</p>
          <ul className="footer__socials">
            {footer.socials.map((s, i) => (
              <motion.li
                key={s.network}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <a href={s.href} target="_blank" rel="noreferrer" className="footer__social">
                  <span className="footer__icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      {ICONS[s.network]}
                    </svg>
                  </span>
                  <span className="sr-only">{s.network} </span>
                  {s.handle}
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="footer__legal">
          <p className="footer__h">{footer.privacyHeading}</p>
          <a className="footer__link" href={footer.privacyLink.href}>
            {footer.privacyLink.label}
          </a>
        </div>
      </div>
      <p className="footer__copy">{footer.copyright}</p>
    </footer>
  );
}
