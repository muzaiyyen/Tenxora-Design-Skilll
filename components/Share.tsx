"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const I = {
  share: <path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  linkedin: <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z" fill="currentColor" />,
  x: <path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" fill="currentColor" />,
  facebook: <path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" fill="currentColor" />,
  whatsapp: (
    <>
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
      <path d="M9 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c0 .2 0 .4-.1.5l-.5.6c-.1.1-.2.3 0 .5.5.9 1.4 1.8 2.4 2.3.2.1.4.1.5 0l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.3.2.3.4 0 .5-.2 1.2-.8 1.5-.6.4-1.5.5-2.8 0-1.6-.6-3.3-2.2-4.1-3.6-.8-1.3-.6-2.5-.1-3.3Z" fill="currentColor" />
    </>
  ),
  mail: <path d="M3.5 6.5h17v11h-17zM4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none" />,
  link: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />,
  check: <path d="M5 12.5 10 17l9-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
};

const Icon = ({ k }: { k: keyof typeof I }) => (
  <svg viewBox="0 0 24 24" aria-hidden>
    {I[k]}
  </svg>
);

/** Share a post: the phone's own share sheet where there is one, plus direct links and copy-link. */
export default function Share({ url, title, label = "Share" }: { url: string; title: string; label?: string }) {
  const [native, setNative] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => setNative(typeof navigator !== "undefined" && "share" in navigator), []);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const targets = [
    { k: "linkedin" as const, name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { k: "x" as const, name: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { k: "facebook" as const, name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { k: "whatsapp" as const, name: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
    { k: "mail" as const, name: "Email", href: `mailto:?subject=${t}&body=${u}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="share">
      <p className="share__h">{label}</p>
      <ul className="share__row">
        {native && (
          <li>
            <motion.button
              type="button"
              className="share__btn share__btn--native"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigator.share({ title, url }).catch(() => {})}
              aria-label="Share with an app on this device"
            >
              <Icon k="share" />
            </motion.button>
          </li>
        )}
        {targets.map((s) => (
          <li key={s.k}>
            <motion.a
              className="share__btn"
              href={s.href}
              target={s.k === "mail" ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={`Share on ${s.name}`}
              title={s.name}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.92 }}
            >
              <Icon k={s.k} />
            </motion.a>
          </li>
        ))}
        <li>
          <motion.button
            type="button"
            className="share__btn"
            onClick={copy}
            aria-label="Copy link"
            title="Copy link"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.92 }}
            data-on={copied || undefined}
          >
            <Icon k={copied ? "check" : "link"} />
          </motion.button>
        </li>
      </ul>
      <AnimatePresence>
        {copied && (
          <motion.span
            className="share__toast"
            role="status"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Link copied
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
