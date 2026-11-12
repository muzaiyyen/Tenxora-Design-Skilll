// Copy for the Why Tenxora and Blog pages, from the live tenxora.services pages (read 2026-11-12).
// Do not reword. Paragraphs marked PENDING could not be copied verbatim from here (the build environment
// cannot reach tenxora.services); they stay empty until the exact text is supplied, and empty ones are not shown.
import { links } from "./content";

export const why = {
  title: "About Tenxora | AI-Assisted Services, Human Reviewed",
  h1: "Why Tenxora",
  tagline: "AI-assisted delivery. Human accountability.",
  intro: "Build a better way to operate, with the right mix of software, AI and people.",
  body: "", // PENDING: hero paragraph
  steps: [
    { n: "01", tag: "Understand", heading: "Start with the work.", body: "" },
    { n: "02", tag: "Build", heading: "Let software do more.", body: "" },
    { n: "03", tag: "Review", heading: "Keep people responsible.", body: "" },
    { n: "04", tag: "Improve", heading: "Make the next step clear.", body: "" },
  ],
  odoo: { heading: "Odoo today. A broader service model ahead.", body: "" }, // PENDING: body
  // "A practical working relationship." was removed at the user's request (2026-11-12)
  company: {
    heading: "Company details",
    rows: [
      { label: "Founder", value: "Bilal Mashkoor" },
      { label: "Founded", value: "2026" },
      { label: "Team", value: "15 people" },
      { label: "Business address", value: "4th Floor, Interlace Plaza, I-8 Markaz, Islamabad 44000, Pakistan" },
      { label: "Telephone", value: "+92 336 5188711", href: "tel:+923365188711" },
    ] as { label: string; value: string; href?: string }[],
  },
};

export const blog = {
  title: "Odoo & AI-Assisted Operations Insights | Tenxora",
  h1: "Insights",
  kicker: "A fresh start",
  intro: "Practical thinking on Odoo, AI-assisted services and better business workflows.",
  // the live WordPress blog lists posts itself; these mirror the 20 posts live on 2026-11-12 for the preview
  // filter chips (site UI labels, not page copy); each post lists the ones it belongs to
  topics: ["Implementation", "Costs", "Pakistan & FBR", "POS & retail", "Accounting & inventory", "Upgrades & performance", "Choosing Odoo", "Partners"],
  posts: [
    { title: "When Is the Best Time to Go Live With Odoo in Pakistan?", date: "November 11, 2026", href: "https://tenxora.services/2026/11/11/odoo-go-live-date-pakistan/", topics: ["Implementation", "Pakistan & FBR"] },
    { title: "How Long Does Odoo Data Migration Take?", date: "November 11, 2026", href: "https://tenxora.services/2026/11/11/odoo-data-migration-time/", topics: ["Implementation", "Upgrades & performance"] },
    { title: "Is Odoo Good for Restaurants in Pakistan?", date: "November 11, 2026", href: "https://tenxora.services/2026/11/11/odoo-for-restaurants-pakistan/", topics: ["Choosing Odoo", "POS & retail", "Pakistan & FBR"] },
    { title: "How Much Does Odoo Cost Per User in Pakistan?", date: "November 10, 2026", href: "https://tenxora.services/2026/11/10/odoo-cost-per-user-pakistan/", topics: ["Costs", "Pakistan & FBR"] },
    { title: "How Much Time Will My Team Need to Give an Odoo Implementation?", date: "November 10, 2026", href: "https://tenxora.services/2026/11/10/odoo-implementation-team-time/", topics: ["Implementation"] },
    { title: "Why Do Odoo Implementations Run Over Schedule?", date: "November 10, 2026", href: "https://tenxora.services/2026/11/10/why-odoo-projects-run-over-schedule/", topics: ["Implementation"] },
    { title: "Does Odoo POS Work Offline?", date: "November 10, 2026", href: "https://tenxora.services/2026/11/10/odoo-pos-offline/", topics: ["POS & retail"] },
    { title: "Can Odoo Handle Multiple Branches or Companies?", date: "November 10, 2026", href: "https://tenxora.services/2026/11/10/odoo-multiple-branches-companies/", topics: ["Choosing Odoo"] },
    { title: "Odoo vs QuickBooks or Zoho: Which Does a Growing Business Need?", date: "November 10, 2026", href: "https://tenxora.services/2026/11/10/odoo-vs-quickbooks-zoho/", topics: ["Choosing Odoo"] },
    { title: "Why Is My Odoo Slow, and How Do I Speed It Up?", date: "November 10, 2026", href: "https://tenxora.services/2026/11/10/why-is-odoo-slow-speed-up/", topics: ["Upgrades & performance"] },
    { title: "Why Do Odoo Upgrades Break Custom Modules, and What Does an Upgrade Cost?", date: "November 6, 2026", href: "https://tenxora.services/2026/11/06/odoo-upgrade-custom-modules-cost/", topics: ["Upgrades & performance", "Costs"] },
    { title: "How Do I Fix Bank Reconciliation Problems in Odoo?", date: "November 6, 2026", href: "https://tenxora.services/2026/11/06/fix-odoo-bank-reconciliation/", topics: ["Accounting & inventory"] },
    { title: "Why Doesn’t My Odoo Inventory Valuation Match My Balance Sheet?", date: "November 5, 2026", href: "https://tenxora.services/2026/11/05/odoo-inventory-valuation-balance-sheet-mismatch/", topics: ["Accounting & inventory"] },
    { title: "Who Owns My Odoo Database If a Partner Set It Up?", date: "November 4, 2026", href: "https://tenxora.services/2026/11/04/who-owns-odoo-database-partner/", topics: ["Partners"] },
    { title: "How Do I Know It’s Time to Switch My Odoo Partner?", date: "November 4, 2026", href: "https://tenxora.services/2026/11/04/when-to-switch-odoo-partner/", topics: ["Partners"] },
    { title: "How Do I Get My Staff to Actually Use a New ERP Instead of Excel?", date: "November 4, 2026", href: "https://tenxora.services/2026/11/04/get-staff-to-use-erp-instead-of-excel/", topics: ["Implementation"] },
    { title: "Does Odoo Work for Businesses in Pakistan (FBR, Sales Tax, Withholding)?", date: "November 3, 2026", href: "https://tenxora.services/2026/11/03/odoo-pakistan-fbr-sales-tax-withholding/", topics: ["Pakistan & FBR", "Accounting & inventory"] },
    { title: "How Do I Integrate FBR POS With My ERP in Pakistan?", date: "November 3, 2026", href: "https://tenxora.services/2026/11/03/fbr-pos-integration-erp-pakistan/", topics: ["Pakistan & FBR", "POS & retail"] },
    { title: "What Are the Hidden Costs of an Odoo Implementation?", date: "November 2, 2026", href: "https://tenxora.services/2026/11/02/odoo-implementation-hidden-costs/", topics: ["Costs", "Implementation"] },
    { title: "Why Did My Odoo Implementation Fail, and How Do I Rescue It?", date: "November 2, 2026", href: "https://tenxora.services/2026/11/02/odoo-implementation-failed-rescue/", topics: ["Implementation", "Partners"] },
  ],
  closing: {
    before: "Have a question we haven’t answered? ",
    call: { label: "Book a call", href: "https://calendly.com/contact-tenxora/odoo-introduction" },
    mid: " or ",
    odoo: { label: "explore our Odoo services", href: links.odoo },
    after: ".",
  },
};
