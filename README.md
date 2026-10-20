# Tenxora Design

Design system for the Tenxora website, built from the Tenxora Brand Guidelines v1.0.

- `design-system/tenxora/MASTER.md` is the global source of truth: colors, typography, liquid glass controls, layout, motion and the accessibility checklist.
- `design-system/tenxora/pages/<page>.md` holds page-specific overrides, which take precedence over MASTER.md.

## Home page (Next.js)

Built from the Figma design (file `XpwNsMZvZVHYwMGLo7gRr8`): the hero and Operations Map follow it exactly, and the other sections reuse its pieces (skeleton cards, grey capsules, status pills, treen buttons, the sky).

```bash
npm ci
npm run dev            # http://localhost:3000
STATIC_EXPORT=1 NEXT_PUBLIC_ASSET_BASE=. npx next build   # static copy in out/
```

Sizes are written in Figma pixels through `--u` (one artboard pixel, 1679px wide) so the page scales like the artboard. All copy lives in `lib/content.ts`.

## WordPress

The site ships as a WordPress theme in `wordpress/tenxora` (install steps in its README). Build the zip with `scripts/build-wp-theme.sh`.
