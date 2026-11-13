// Copy for the Why Tenxora and Blog pages, from the live tenxora.services pages (read 2026-11-12).
// Do not reword. Paragraphs marked PENDING could not be copied verbatim from here (the build environment
// cannot reach tenxora.services); they stay empty until the exact text is supplied, and empty ones are not shown.
import { footer, links } from "./content";

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

// Blog post bodies. Text is copied exactly from the live post; segments are plain text, bold ({ b }) or links ({ a, href }).
export type Seg = string | { b: string } | { a: string; href: string };
export type Block = { p: Seg[] } | { h2: string } | { ul: Seg[][] };

// Only posts with a body here get a page in this build; the rest of the cards link to the live posts.
// PENDING: this body stops where the user's screenshot did (before "How much time does each role need?").
export const articles: Record<string, Block[]> = {
  "odoo-implementation-team-time": [
    {
      p: [
        "More than most owners plan for. Odoo’s own implementation guide asked customers for a project lead available at least 2 full days a week. One ERP vendor’s project manager puts the internal project lead at about 70% of their working time, and key users at about 50% during the build. Block that time before you sign.",
      ],
    },
    {
      p: [
        "This is a follow-up to ",
        // PENDING: the exact URL of this post (not in the blog listing read on 2026-11-12); points at the blog for now
        { a: "How Long Does an Odoo Implementation Take?", href: "https://tenxora.services/blog/" },
        " The calendar date depends heavily on one thing your partner cannot supply: your own people’s time.",
      ],
    },
    { h2: "Who on my team needs to be involved?" },
    {
      p: [
        "Most Odoo projects need three groups from your side. Small businesses often combine roles, but none of them can be skipped.",
      ],
    },
    {
      ul: [
        [{ b: "Project lead (single point of contact):" }, " makes decisions, chases answers internally and signs off each stage. Odoo’s guide says this person should have authority to decide on their own."],
        [{ b: "Key users:" }, " one per area, such as sales, stock, purchasing and accounts. They explain how work really happens, test the setup and later train colleagues."],
        [{ b: "End users:" }, " everyone who will use Odoo daily. They need time to practise their own tasks before go-live."],
        [{ b: "Owner or senior manager:" }, " settles disputes between departments and approves scope changes."],
      ],
    },
  ],
};

const postBase = process.env.NEXT_PUBLIC_POST_BASE; // preview build: "./post-" (pages are flattened to post-<slug>.html)
export const slugOf = (href: string) => href.replace(/\/$/, "").split("/").pop() as string;
export const postHref = (href: string) => {
  const slug = slugOf(href);
  if (!articles[slug]) return href;
  return postBase ? `${postBase}${slug}.html` : `/blog/${slug}/`;
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

// Odoo Services, copied from the user's screenshot of the live page (2026-11-12).
// PENDING: the bodies and link labels of cards 03 and 04, and anything below them, were cut off in the screenshot.
export const odooServices = {
  title: "Odoo Services | Tenxora",
  h1: "Odoo services",
  eyebrow: "Odoo ERP services • AI-assisted, human-reviewed",
  lead: "Make Odoo work around the way your business operates.",
  body: "Tenxora.Services helps English-speaking businesses worldwide plan, implement and improve Odoo. We are an AI-assisted Service as a Software company: AI and code prepare initial work, then a human reviews it against the agreed requirements. Your team approves the business workflows before an agreed production handover.",
  // the button's destination wasn't visible in the screenshot; the contact page is assumed
  cta: { label: "Discuss your Odoo project →", href: links.contact },
  email: { label: footer.email, href: `mailto:${footer.email}` },
  services: [
    {
      n: "01",
      kicker: "Build your foundation",
      title: "Odoo implementation",
      body: "For a new rollout or a defined next phase: agree processes, configure the relevant applications, prepare data and test the workflows your team needs.",
      link: { label: "Explore Odoo implementation →", href: "https://tenxora.services/odoo-services/implementation/" },
    },
    {
      n: "02",
      kicker: "Decide before you build",
      title: "Odoo consulting",
      body: "For unclear requirements or an existing setup that needs direction: assess fit, identify gaps and turn competing requests into a prioritized delivery plan.",
      link: { label: "Explore Odoo consulting →", href: links.odooConsulting },
    },
    {
      n: "03",
      kicker: "Understand the method",
      title: "AI-assisted implementation",
      body: "",
      link: { label: "", href: "https://tenxora.services/odoo-services/ai-assisted-implementation/" },
    },
    {
      n: "04",
      kicker: "Improve an existing system",
      title: "Integrations and improvements",
      body: "",
      link: { label: "", href: "https://tenxora.services/odoo-services/integration/" },
    },
  ],
};

// Sitemap page (new page, 2026-11-13). Headings and the intro line are NEW copy: Bilal to approve.
export const sitemapPage = {
  title: "Sitemap | Tenxora",
  h1: "Sitemap",
  intro: "Every page on Tenxora.Services in one place.",
  main: {
    heading: "Main pages",
    links: [
      { label: "Home", href: links.home },
      { label: "Odoo Services", href: links.odoo },
      { label: "Blog", href: links.blog },
      { label: "Our Team", href: links.ourTeam },
      { label: "Why Tenxora", href: links.whyTenxora },
      { label: "Contact Us", href: links.contact },
    ],
  },
  postsHeading: "Insights",
  machine: {
    heading: "For search engines and AI",
    links: [
      { label: "XML sitemap", href: links.sitemapXml },
      { label: "llms.txt", href: footer.llms.href },
    ],
  },
};
