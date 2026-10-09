# Tenxora Design System — MASTER

Source of truth for the Tenxora website redesign. Built from *Tenxora Brand Guidelines v1.0* (`/mnt/project-files/tenxora brand guidlines.PDF`) plus direction from Muzaiyyen Khan (2026-10-09), checked against the ui-ux-pro-max skill's accessibility and UX rules.

Page-specific overrides go in `pages/<page>.md` and win over this file.

---

## 1. Brand essence

- **What Tenxora is:** a business operations, automation and systems partner. "We connect the people, processes, and technology behind your work, making operations simpler, clearer, and ready to scale."
- **Tagline / brand line:** *Work without friction.* Mission: *Make work simpler. Make growth easier.* Vision: *A future where business runs smarter, not harder.*
- **Values:** Clarity, Efficiency, Reliability, Growth.
- **Voice:** a smart partner who makes complex things feel simple. Direct, confident, practical, no jargon. Short, punchy headlines; plain-language body copy.
- **Messaging tiers:** Brand lines (what we believe), Business quotes (real problems: repetitive work, disconnected systems), Product value (automation, connected systems, practical benefit).

## 2. Color

| Token | Name | Hex | Use |
|---|---|---|---|
| `--tx-treen` | Treen (core green) | `#08E88C` | The one flash of brand color. Primary CTA fill, hero blocks, highlights. |
| `--tx-black` | Black | `#000000` | Grounds everything. Text, dark sections, the logo. |
| `--tx-white` | White | `#FFFFFF` | Light surfaces. |
| `--tx-blue` | Blue | `#1A73E9` | Secondary brand color, section backgrounds, highlight chips. |
| `--tx-purple` | Purple | `#6B71CD` | Tertiary; message cards, chips. |
| `--tx-yellow` | Yellow | `#FFDD53` | Accent only, sparingly. |
| `--tx-lavender` | Lavender | `#BFC5FF` | Soft accent surfaces. (The guidelines PDF mislabels it as `#08E88C`; #BFC5FF was confirmed by Muzaiyyen on 2026-10-09.) |

**Approved pairings (from the guidelines):** Black + Treen, White + Purple, Blue + Yellow, Purple + Yellow, Blue + White, Black + Yellow, White + Black, Treen + Blue, Purple + White.

**Contrast rules (WCAG AA, computed):**

| Text on background | Ratio | Allowed for |
|---|---|---|
| Black on Treen | 12.9:1 | Everything. This is the CTA button. |
| Black on Yellow / Lavender | 15.7 / 12.7:1 | Everything |
| White on Black | 21:1 | Everything |
| White on Blue `#1A73E9` | 4.49:1 | **Large text only** (≥24px, or ≥18.7px bold). |
| White on Purple `#6B71CD` | 4.31:1 | **Large text only.** |
| Treen or Yellow text on White | 1.6 / 1.3:1 | **Never.** Use them as fills behind black text instead. |

For small white text on blue or purple, and for blue links on white, use the accessible shades `--tx-blue-ink: #1565CF` (5.5:1 with white) and `--tx-purple-ink: #5A5FBD` (5.5:1). They read as the same color.

**Rule of one:** Treen is reserved for the single most important action or highlight in a view (guidelines p.28: "the green stays reserved for the one clickable element").

## 3. Typography

| Role | Font | Weight | Size (desktop → mobile) | Line height | Tracking |
|---|---|---|---|---|---|
| Logo wordmark | **Anybody** | — | — | — | — |
| Ultra headline | Google Sans Flex | 900 Black | clamp(56px, 9vw, 160px) | 0.90 (0.95 for longer copy) | -0.04em |
| Primary headline | Google Sans Flex | 800 ExtraBold | clamp(36px, 5vw, 72px) | 0.95 (1.0 longer) | 0 |
| Secondary headline | Google Sans Flex | 500–700 | clamp(22px, 2.6vw, 34px) | 1.0 | 0 |
| Body | Google Sans Flex | 400 | 16–18px (never under 16 on mobile) | 1.45 | 0 |
| Label / eyebrow | Google Sans Flex | 600, uppercase | 12–13px | 1.2 | +0.04em |

- **Anybody is used only in the logo.** Ship the logo as SVG, so the website never loads the Anybody font.
- Everything else is **Google Sans Flex** (available on Google Fonts):
  `https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,100..1000&display=swap`
- Fallbacks from the guidelines: Arial Bold for headlines, Arial Regular for body.
- Headlines are short and punchy, and are often stacked and centered. Use `text-wrap: balance` on headlines.

## 4. Liquid glass (buttons, controls, nav)

The look is Apple-style liquid glass on interactive elements: buttons, the nav bar, pills and toggles, and floating cards. Content stays on solid layers, and glass sits on top.

```css
.glass {
  background: rgb(255 255 255 / 0.14);
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  border: 1px solid rgb(255 255 255 / 0.35);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.55),   /* top specular edge */
    inset 0 -1px 0 rgb(255 255 255 / 0.12),
    0 8px 32px rgb(0 0 0 / 0.18);
  border-radius: 999px;
}
.glass--tinted-treen { background: rgb(8 232 140 / 0.75); color: #000; }  /* primary CTA */
@media (prefers-reduced-transparency: reduce) { .glass { background: #fff; backdrop-filter: none; color: #000; } }
@supports not (backdrop-filter: blur(1px)) { .glass { background: rgb(255 255 255 / 0.9); } }
```

- **Primary CTA:** a Treen-tinted glass pill with black label. Secondary actions use clear glass with a label in the surface's text color.
- Optional refraction/lensing: an SVG `feDisplacementMap` filter on hero controls. It only works in Chromium, so treat it as progressive enhancement.
- Glass needs something behind it (imagery, gradients, color blocks) to read as glass. On a flat white page, use the tinted variant.
- Hover: brighten the specular edge and scale to 1.02 over 180ms. Press: scale to 0.97. Always give it a visible 2px focus ring (`--tx-blue-ink`, 2px offset).
- Text on glass must still meet 4.5:1 against the worst-case backdrop. Test it over the busiest image.

## 5. Shape, layout, spacing

- **Shapes:** pills and stadium shapes, generous radii (cards 28–40px, buttons fully rounded), and big circles for value statements. This matches the logo combinations and the "Efficiency / Automation" pages.
- **Section rhythm:** bold full-bleed color blocks (Treen, Black, Blue, White) that alternate down the page, like the guideline spreads.
- **Spacing:** spacious 8px scale (8, 16, 24, 32, 48, 64, 96, 128). Section padding is 96–128px on desktop and 64px on mobile.
- **Grid:** 12 columns, 1280px max content width, 24px gutters, 16–20px side padding on mobile. Breakpoints at 375, 768, 1024 and 1440px. Design mobile-first.
- **Highlight chips:** short keywords in rounded rectangles behind words ("Automation", "Efficiency"), as on the billboard and tote examples.

## 6. Logo

- The logo is the bird symbol plus the "tenxora" wordmark. Never modify, distort, recolor, stretch or add effects to it (guidelines p.23).
- Clear space is equal to the width of the bird symbol on all four sides.
- Preferred versions: black on Treen; blue bird on white; white on black. (The guidelines' cream is replaced by white, per Muzaiyyen, 2026-10-09.)
- Favicon and avatar: the bird alone.
- Website header: small logo on the left, glass pill nav in the center, Treen CTA ("Book an Appointment") on the right, as in the guidelines' web mockup (p.41).

## 7. Motion

- Medium motion: staggered reveals on scroll (300–450ms), with a soft overshoot only on cards and pills.
- Glass controls can morph fluidly, for example a nav pill expanding into a menu.
- Exits run faster than entrances. Animate only `transform` and `opacity`.
- Respect `prefers-reduced-motion`: show the final state and turn off parallax.

## 8. Imagery

Real people at work in warm, natural light; product UI on devices; neon-blue abstract "X" light renders. Text over imagery sits on a solid or glass panel.

## 9. Avoid

- Treen or yellow text on white.
- Small white text on Blue `#1A73E9` or Purple `#6B71CD` (use the `-ink` shades).
- Anybody anywhere other than the logo.
- Glass on body content or long text.
- Emoji as icons. Use one SVG icon set (Lucide), stroke 1.75.
- Hover-only interactions. Touch targets must be at least 44×44px.
- Logo effects (glow, drop shadow, skew), as shown in the "unsuccessful" examples.

## 10. Pre-delivery checklist

- [ ] Text contrast is at least 4.5:1 (3:1 for large text), including text on glass over the busiest backdrop
- [ ] Reduced motion and reduced transparency fallbacks work
- [ ] Visible focus rings; everything works by keyboard
- [ ] No horizontal scroll at 375px; the viewport meta allows zoom
- [ ] Images in WebP/AVIF, lazy-loaded, with space reserved (CLS under 0.1)
- [ ] The logo is SVG and follows the clear-space rule
- [ ] Only one Treen action per view

## Open questions

1. Stack: React with Next.js or Vite (not yet confirmed).
