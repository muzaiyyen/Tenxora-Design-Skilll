Tenxora 2026 - update: all redesigned pages (19 Nov 2026)

WHAT THIS IS
Changed files only, for the live "Tenxora 2026" theme. Not a theme zip.
DO NOT upload this through Appearance > Themes. FOR BILAL'S REVIEW: nothing here is published yet.
Not touched: the must-use plugin (tenxora-site-integration.php), front-page.php, page-our-team.php,
functions.php, style.css, page content, SEO fields, menus, plugins. The SEO layer stays as it is.
This replaces the earlier 19 Nov "why-tenxora" bundle (it includes everything in it).

AFFECTED PAGES
Already redesigned (rebuilt with this bundle's shared files, no visible change):
  /  (Home)   /our-team/   /sitemap/
Why Tenxora (approved by Bilal 19 Nov; serves automatically, as in the earlier bundle):
  /why-tenxora/
New - each one changes ONLY when its Template is set to "Tenxora 2026 design" (see step 4):
  /odoo-services/
  /odoo-services/implementation/            /odoo-services/ai-assisted-implementation/
  /odoo-services/consulting/                /odoo-services/integration/
  /odoo-services/migration/                 /odoo-services/customization/
  /odoo-services/implementation-cost/
  /contactus/      /book-a-call/      /privacy/      /cookie-policy/
  /partners/       /partners/pricing/ /partners/terms/
  /2026/11/10/odoo-implementation-team-time/   (blog post)
URLs, slugs, titles, descriptions, canonicals and schema do not change: WordPress keeps printing them.

CONTENTS
- tenxora-2026/site/                        built pages, scripts, styles, images (whole folder replaces "site")
- tenxora-2026/template-tenxora-design.php  NEW: page/post template "Tenxora 2026 design" (opt-in per page)
- tenxora-2026/page-why-tenxora.php         Why Tenxora template (now also removes the built page's own
                                            meta description so WordPress's is the only one)
- tenxora-2026/page-sitemap.php             same file as before

HOW THE INTEGRATIONS ARE KEPT
The built pages have empty slots where forms and the calendar go. The template fills each slot with the
live page's OWN working markup, rendered by WordPress, so submissions keep going to the same handlers:
  Contact (/contactus/)            [tenxora_contact] shortcode (admin-post.php, nonce, honeypot, rate limit);
                                   if that shortcode is missing, the first form in the page content
  Partners hiring enquiry          the first form in the /partners/ page content
  Partner checkout (/pricing/)     the first form in the /partners/pricing/ page content: plan selection,
                                   terms checkbox and the Stripe handoff stay exactly as they are now,
                                   plus any scripts in that content
  Booking calendar (/book-a-call/) the Calendly embed in the page content; if none, the same Calendly
                                   iframe as live (calendly.com/contact-tenxora/odoo-introduction)
  Cookie consent, newsletter,      come from wp_head()/wp_footer(), which are spliced into every page
  analytics, schema
SAFETY: if a page's form cannot be found, that page is NOT redesigned: WordPress shows the normal template,
so a form can never disappear. A developer can point a slot at a specific form with the
'tenxora_design_slot' filter ($html, $slot_name, $post).

HOW TO APPLY (needs server/file access; files 0644, folders 0755)
1. Back up: rename wp-content/themes/tenxora-2026/site to site-backup-2026-11-19b and save copies of
   page-why-tenxora.php and page-sitemap.php.
2. Upload tenxora-2026/site, template-tenxora-design.php, page-why-tenxora.php and page-sitemap.php into
   wp-content/themes/tenxora-2026/.
3. Purge the LiteSpeed cache. Check /, /our-team/, /sitemap/ and /why-tenxora/ (should look as before).
4. Turn pages on one at a time (best on staging first): edit the page (or the blog post) > Page/Post
   settings > Template > "Tenxora 2026 design" > Update. Do NOT change its content or SEO fields.
   Suggested order: Privacy, Cookie policy, the 7 service pages, Odoo Services, the blog post,
   Partners terms, then the pages with integrations: Book a call, Contact, Partners, Partners pricing.
5. After each one: purge cache, open it on phone and desktop, view source and check the head has one
   title, description, canonical, OG/Twitter, Bing tag and schema. On integration pages also:
   - Contact: send a test message; confirm it arrives and the success message shows.
   - Book a call: the calendar loads and a slot can be picked (no need to book).
   - Partners: send a test hiring enquiry.
   - Pricing: pick a plan, leave terms unticked (must be blocked), tick terms, continue and confirm the
     Stripe page opens with the right plan. Close it without paying.
   - Cookie banner appears for a new visitor and the choice is remembered; the newsletter form works.

ROLLBACK
- One page: set its Template back to "Default template" > Update > purge cache. Instant, nothing else needed.
- Everything: set any changed pages back to Default template, delete template-tenxora-design.php,
  delete the new "site" folder, rename site-backup-2026-11-19b back to "site", restore the saved
  page-why-tenxora.php, purge cache.

TEST RESULTS (19 Nov, details in TEST-RESULTS.txt)
- Copy: every page matches the 19 Nov live copy reference word for word, with the same heading outline,
  titles and link destinations, except the items under NEEDS BILAL'S DECISION.
- Template run in PHP 8 with WordPress stand-ins for all 17 pages at 1440px and 390px (34 checks):
  one title, one description, one canonical, one H1, title equal to the live title, every form and
  calendar slot filled, no sideways scrolling, no console errors. 0 problems.
- The injected forms survive the page's JavaScript start-up (checked after load), take the design's
  field styles, and submit to their own targets: contact posted to /wp-admin/admin-post.php; checkout was
  blocked until the terms box was ticked, then handed off to the checkout URL with the chosen plan.
- Fallback: a page with no form, and a URL not in the list, both rendered the normal template.
- Keyboard: Tab reaches every control; each focused element shows a ring (newsletter field ring on its box).
- No tenxora.com anywhere in the built files.
- NOT tested: a real WordPress install, the real [tenxora_contact] output, the real partner/checkout
  forms and Stripe, the real cookie tool (no server access from here). Step 5 covers these.

NEEDS BILAL'S DECISION
1. Odoo Services hero: the "English-speaking" sentence is left out (owner's request to remove that line
   site-wide). Live still has it.
2. ROI calculator on Odoo Services: new copy, so it is NOT in this bundle (preview only). Say if you want it.
3. Footer Sitemap button opens the designed /sitemap/ page; live links /sitemap.xml.
4. The 7 service pages use the standard footer; live uses a shorter footer on those pages.
5. Live form wording wins: field labels, consent text and buttons inside the forms come from the live
   forms, not the preview, so they may differ slightly from the preview screenshots.
6. Home: the built Home page no longer carries its own meta description (WordPress prints the real one),
   which removes a duplicate. Check the Home head once after step 3.

NOT IN THIS BUNDLE
Blog index, the other blog posts (they need a WordPress post template) and the 404 page.
