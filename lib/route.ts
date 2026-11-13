// Preview builds have no WordPress behind them, so live URLs of pages that exist in the preview are
// pointed at the preview's own files. Production builds leave every URL as it is.
const LIVE = "https://tenxora.services/";
const flat: Record<string, string> = {
  "contactus/": "contactus",
  "book-a-call/": "book-a-call",
  "privacy/": "privacy",
  "cookie-policy/": "cookie-policy",
};
export function route(href: string): string {
  if (process.env.NEXT_PUBLIC_PREVIEW !== "1" || !href.startsWith(LIVE)) return href;
  const [path, hash] = href.slice(LIVE.length).split("#");
  const h = hash ? `#${hash}` : "";
  if (flat[path]) return `./${flat[path]}.html${h}`;
  const m = path.match(/^odoo-services\/([a-z-]+)\/$/);
  if (m) return `./svc-${m[1]}.html${h}`;
  return href;
}
