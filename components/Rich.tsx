import { Fragment } from "react";
import { route } from "@/lib/route";

// Copy text from lib/docs.ts: paragraphs split by a blank line, "[label](href)" for links and
// "**bold**" for bold, so live wording with inline links can be kept exactly.
const ext = (href: string) => (/^https?:/.test(href) && !href.includes("tenxora.services/") ? { target: "_blank", rel: "noopener" } : {});

export function inline(t: string) {
  const out: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    if (m.index > last) out.push(t.slice(last, m.index));
    if (m[1]) out.push(<a key={m.index} href={route(m[2])} {...ext(m[2])}>{m[1]}</a>);
    else out.push(<strong key={m.index}>{m[3]}</strong>);
    last = re.lastIndex;
  }
  if (last < t.length) out.push(t.slice(last));
  return out.map((n, i) => <Fragment key={i}>{n}</Fragment>);
}

export default function Rich({ text, className = "doc__p" }: { text?: string; className?: string }) {
  if (!text) return null;
  return (
    <>
      {text.split(/\n\n+/).map((p, i) => (
        <p key={i} className={className}>
          {inline(p)}
        </p>
      ))}
    </>
  );
}
