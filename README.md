# Tenxora

The redesigned tenxora.com home page, plus the design system it is built on.

- `design-system/tenxora/MASTER.md` is the global source of truth: colors, typography, liquid glass controls, layout, motion and the accessibility checklist.
- `design-system/tenxora/pages/<page>.md` holds page-specific overrides, which take precedence over MASTER.md.

## The site

Next.js (App Router, TypeScript), Tailwind CSS 4, Motion for springs and scroll-linked animation, and Lenis for inertia scrolling.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

Deploys to Vercel with the default Next.js settings (project root is the repo root).

### Where things live

| Path | What |
| --- | --- |
| `lib/content.ts` | Every visible word on the page, copied verbatim from the current tenxora.com. Change wording only here, and only when the live site changes. |
| `app/globals.css` | Brand tokens, type scale, the `.glass` liquid glass system and its reduced-transparency fallbacks. |
| `components/` | One file per section, in page order: Hero, OperationsMap, BeforeWith, Problem, Framework, Capabilities, Audit, Footer, plus Header, Preloader and CookieBanner. |
| `components/ui.tsx` | Shared pieces: magnetic links, text roll, logo, icons, the decorative mini business UI. |
| `public/brand/` | The logo as SVG, traced from the brand guidelines PDF. |

### Motion rules

Only `transform` and `opacity` animate, all with springs. With `prefers-reduced-motion` on, Lenis is off and every staged section renders its finished state. Scroll-staged sections (operations map, framework) pin on desktop and play once on entering view on phones, so nothing depends on a sticky viewport on small screens.
