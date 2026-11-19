// Copy for the Why Tenxora and Blog pages, from the live tenxora.services pages (read 2026-11-12).
// Do not reword. Paragraphs marked PENDING could not be copied verbatim from here (the build environment
// cannot reach tenxora.services); they stay empty until the exact text is supplied, and empty ones are not shown.
import { footer, links } from "./content";
import type { Sec } from "./docs";

export const why = {
  title: "About Tenxora | AI-Assisted Services, Human Reviewed",
  h1: "Why Tenxora",
  tagline: "AI-assisted delivery. Human accountability.",
  intro: "Build a better way to operate, with the right mix of software, AI and people.",
  steps: [
    { n: "01", tag: "Understand", heading: "Start with the work.", body: "" },
    { n: "02", tag: "Build", heading: "Let software do more.", body: "" },
    { n: "03", tag: "Review", heading: "Keep people responsible.", body: "" },
    { n: "04", tag: "Improve", heading: "Make the next step clear.", body: "" },
  ],
  odoo: { heading: "Odoo today. A broader service model ahead.", body: "" }, // the live page has no paragraph here (19 Nov reference)
  // "A practical working relationship." was removed at the user's request (2026-11-12).
  // No buttons here: the 19 Nov copy reference has none on this page.
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

// Blog post bodies, word for word from the live post (19 Nov copy reference). Segments are plain text,
// bold ({ b }) or links ({ a, href }). On WordPress, posts render their own content through the post template.
export type Seg = string | { b: string } | { a: string; href: string };
export type Block =
  | { p: Seg[] }
  | { h2: string }
  | { h3: string }
  | { ul: Seg[][] }
  | { table: { head: string[]; rows: string[][] } }
  | { cta: { h2: string; p: string; link: { label: string; href: string } } };

const T26 = "https://tenxora.services/2026/";
const call = "https://calendly.com/contact-tenxora/odoo-introduction";
// Only posts with a body here get a page in this build; the rest of the cards link to the live posts.
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
        { a: "How Long Does an Odoo Implementation Take?", href: `${T26}11/02/how-long-does-odoo-implementation-take/` },
        " The calendar date depends heavily on one thing your partner cannot supply: your own people’s time.",
      ],
    },
    { h2: "Who on my team needs to be involved?" },
    { p: ["Most Odoo projects need three groups from your side. Small businesses often combine roles, but none of them can be skipped."] },
    {
      ul: [
        [{ b: "Project lead (single point of contact):" }, " makes decisions, chases answers internally and signs off each stage. Odoo’s guide says this person should have authority to decide on their own."],
        [{ b: "Key users:" }, " one per area, such as sales, stock, purchasing and accounts. They explain how work really happens, test the setup and later train colleagues."],
        [{ b: "End users:" }, " everyone who will use Odoo daily. They need time to practise their own tasks before go-live."],
        [{ b: "Owner or senior manager:" }, " settles disputes between departments and approves scope changes."],
      ],
    },
    { h2: "How much time does each role need?" },
    { p: ["Published figures vary by project size and vendor, so treat these as planning guides, not fixed rules."] },
    {
      table: {
        head: ["Role", "When", "Published estimate", "Main work"],
        rows: [
          ["Project lead", "Whole project", "At least 2 full days a week (Odoo); about 70% of working time (APplus)", "Decisions, coordination, sign-offs"],
          ["Key users", "Build and testing", "About 50% of working time (APplus)", "Workshops, testing, feedback"],
          ["Key users", "Go-live period", "About 70% of working time (APplus)", "Training colleagues, support, acceptance"],
          ["End users", "Before go-live", "No standard figure; plan practice time per person", "Training on their own tasks"],
        ],
      },
    },
    { p: ["Odoo’s guide also puts the customer in charge of exporting data from the old system and training its own users once the system works. Those tasks land on your staff, not the partner."] },
    { h2: "Where does my team’s time actually go?" },
    {
      ul: [
        [{ b: "Discovery workshops:" }, " explaining current processes, exceptions and approval rules."],
        [{ b: "Decisions:" }, " agreeing how one process should work when departments disagree."],
        [{ b: "Data preparation:" }, " exporting, cleaning and checking customers, products, stock and opening balances."],
        [{ b: "Testing:" }, " running real transactions in a test copy and recording what breaks."],
        [{ b: "Training:" }, " learning the system, then teaching colleagues."],
        [{ b: "Go-live and the weeks after:" }, " checking the first real invoices, stock moves and bank entries."],
      ],
    },
    { h2: "What happens if my team can’t give that time?" },
    {
      p: [
        "The project waits. A partner can configure Odoo quickly, but it cannot decide your approval rules, clean your product list or accept test results for you. That waiting time is one of the main reasons ",
        { a: "Odoo implementations run over schedule", href: `${T26}11/10/why-odoo-projects-run-over-schedule/` },
        ".",
      ],
    },
    {
      ul: [
        ["Questions sit unanswered, so configuration stalls."],
        ["Testing is rushed, so problems appear after go-live."],
        ["Staff are not trained, so they return to Excel. See ", { a: "how to get staff to use a new ERP instead of Excel", href: `${T26}11/04/get-staff-to-use-erp-instead-of-excel/` }, "."],
      ],
    },
    { p: ["APplus also notes that companies often underestimate the internal time required. A date set without counting it is a guess."] },
    { h2: "How do I free up time without stopping the business?" },
    {
      ul: [
        ["Name the project lead and key users before kick-off, and tell them in writing what share of their week goes to the project."],
        ["Move part of their routine work to others, or hire temporary help, for the busiest weeks."],
        ["Avoid peak periods such as month-end, year-end closing or your busiest sales season for testing and go-live."],
        ["Ask your partner for a calendar of workshops, test cycles and training sessions, with the people needed for each."],
        ["Phase the rollout so one team carries the heavy load at a time."],
        ["Review progress weekly and adjust the plan if your team’s availability changes."],
      ],
    },
    {
      cta: {
        h2: "Plan the people side before you fix a go-live date",
        p: "We map your operations, list who is needed for each step and build a schedule your team can actually keep, so your business keeps running while it moves onto Odoo.",
        link: { label: "Book a call →", href: call },
      },
    },
    { h2: "FAQ" },
    { h3: "Can my Odoo partner do this work instead of my staff?" },
    { p: ["A partner can take on configuration, data imports and much of the training. It cannot make your business decisions or confirm that results match how you operate. Those need someone from your side with authority."] },
    { h3: "Does a small business need less staff time?" },
    { p: ["Fewer people are involved, but each one usually carries more roles. In a small company the owner is often the project lead and a key user at once, so protect that time carefully."] },
    { h3: "When is my team’s workload highest?" },
    { p: ["Usually during testing and the weeks around go-live. APplus estimates key users rise from about 50% to about 70% of their time when the system goes live, because they train and support colleagues."] },
    { p: ["Related service: ", { a: "Odoo Implementation", href: "https://tenxora.services/odoo-services/implementation/" }] },
    {
      p: [
        "Sources: ",
        { a: "Odoo – Odoo Online Implementation guide", href: "https://odoo-users.readthedocs.io/en/latest/getting_started/documentation.html" },
        ", ",
        { a: "APplus (Asseco) – How long does an ERP implementation really take?", href: "https://www.applus-erp.de/en/knowledge/project-management/blog-erp-project-duration/" },
      ],
    },
  ],
};

const postBase = process.env.NEXT_PUBLIC_POST_BASE; // preview build: "./post-" (pages are flattened to post-<slug>.html)
export const slugOf = (href: string) => href.replace(/\/$/, "").split("/").pop() as string;
export const postHref = (href: string) => {
  const slug = slugOf(href);
  // WordPress build: every post lives at its real permalink, so keep it
  if (!articles[slug] || process.env.NEXT_PUBLIC_POSTS_LIVE === "1") return href;
  return postBase ? `${postBase}${slug}.html` : `/blog/${slug}/`;
};

export const blog = {
  title: "Odoo & AI-Assisted Operations Insights | Tenxora",
  h1: "Insights",
  kicker: "A fresh start",
  intro: "Practical thinking on Odoo, AI-assisted services and better business workflows.",
  // the live WordPress blog lists posts itself; these mirror the 20 posts live on 2026-11-12 for the preview
  // filter chips (site UI labels, not page copy); each post lists the ones it belongs to
  topics: ["Implementation", "Costs", "Pakistan & FBR", "POS & retail", "Accounting & inventory", "Upgrades & performance", "Choosing Odoo", "Partners", "Guides"],
  // all 32 posts and their categories as on the live blog (read 2026-11-17)
  posts: [
    { title: "What Is an Odoo Success Pack, and Is It Worth It?", date: "November 17, 2026", href: "https://tenxora.services/2026/11/17/odoo-success-pack-worth-it/", topics: ["Guides"] },
    { title: "What Should Be on My Odoo Go-Live Cutover Checklist?", date: "November 16, 2026", href: "https://tenxora.services/2026/11/16/odoo-go-live-cutover-checklist/", topics: ["Guides"] },
    { title: "Which Odoo Apps Should a Small Business Start With?", date: "November 16, 2026", href: "https://tenxora.services/2026/11/16/odoo-apps-small-business-start/", topics: ["Guides"] },
    { title: "Is Odoo Good for Manufacturing Companies?", date: "November 16, 2026", href: "https://tenxora.services/2026/11/16/odoo-manufacturing-companies/", topics: ["Guides"] },
    { title: "Is Odoo Good for Retail and Trading Businesses?", date: "November 16, 2026", href: "https://tenxora.services/2026/11/16/odoo-retail-trading-business/", topics: ["Guides"] },
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
    { title: "What Happens After Odoo Go-Live, and What Support Do I Need?", date: "November 2, 2026", href: "https://tenxora.services/2026/11/02/after-odoo-go-live-support/", topics: ["Guides"] },
    { title: "Is Odoo Worth It for a Small Business?", date: "November 2, 2026", href: "https://tenxora.services/2026/11/02/is-odoo-worth-it-small-business/", topics: ["Guides"] },
    { title: "What Should I Ask an Odoo Partner Before Signing?", date: "November 2, 2026", href: "https://tenxora.services/2026/11/02/questions-to-ask-odoo-partner/", topics: ["Guides"] },
    { title: "How Do I Move From Excel, QuickBooks or Tally to Odoo Without Losing Data?", date: "November 2, 2026", href: "https://tenxora.services/2026/11/02/migrate-excel-quickbooks-tally-to-odoo/", topics: ["Guides"] },
    { title: "Odoo Community or Enterprise: Which One Does My Business Need?", date: "November 2, 2026", href: "https://tenxora.services/2026/11/02/odoo-community-vs-enterprise/", topics: ["Guides"] },
    { title: "Can I Implement Odoo Myself, or Do I Need a Partner?", date: "November 2, 2026", href: "https://tenxora.services/2026/11/02/implement-odoo-yourself-or-partner/", topics: ["Guides"] },
    { title: "How Long Does an Odoo Implementation Take?", date: "November 2, 2026", href: "https://tenxora.services/2026/11/02/how-long-does-odoo-implementation-take/", topics: ["Guides"] },
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
  title: "Odoo Services | Implementation & Consulting | Tenxora",
  h1: "Odoo services",
  eyebrow: "Odoo ERP services • AI-assisted, human-reviewed",
  lead: "Make Odoo work around the way your business operates.",
  body: "Tenxora.Services helps businesses worldwide plan, implement and improve Odoo. We are an AI-assisted Service as a Software company: AI and code prepare initial work, then a human reviews it against the agreed requirements. Your team approves the business workflows before an agreed production handover.",
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
      body: "See where AI and code can prepare work, what a human checks and which decisions remain with your business.",
      link: { label: "See the review process →", href: "https://tenxora.services/odoo-services/ai-assisted-implementation/" },
    },
    {
      n: "04",
      kicker: "Improve an existing system",
      title: "Integrations and improvements",
      body: "Discuss a disconnected tool, repetitive task or configuration gap. We assess the interface, edition, hosting and maintenance needs before proposing integration or custom work.",
      link: { label: "Describe your improvement →", href: links.contact },
    },
  ],
  // the rest of the live page, word for word from the 19 Nov copy reference
  more: [
    {
      kind: "text",
      heading: "Start with one business problem",
      body: "You do not need a complete ERP specification to enquire. Tell us which process is difficult today, who uses it and what a successful result would look like. If the requirements are uncertain, a separately scoped paid discovery engagement can establish the implementation plan before you commit to a wider rollout.",
    },
    {
      kind: "text",
      heading: "What we agree before delivery",
      list: [
        "The applications, workflows and measurable acceptance checks in scope.",
        "Your Odoo version, edition and hosting, plus any technical restrictions.",
        "Data preparation, access, testing and approval responsibilities.",
        "Milestones, price, licensing and hosting assumptions, and handover or support arrangements.",
      ],
    },
    {
      kind: "text",
      heading: "What does an Odoo project cost?",
      body: "The cost depends on process complexity, data quality, integrations, custom changes and the help your users need. Licensing, hosting and implementation services are separate cost categories. We propose scope and commercial terms after reviewing your requirements; there is no published fixed price or universal delivery time.",
    },
    {
      kind: "feature",
      heading: "Check the partner evidence",
      body: "The official Odoo directory lists [Tenxora (Private) Limited as a Ready partner](https://www.odoo.com/partners/tenxora-private-limited-14366535). This credential belongs to the company named in that listing. Your proposal will identify the contracting entity, delivery responsibilities and applicable terms.",
    },
    {
      kind: "feature",
      heading: "Explore the delivery approach",
      body: "Our separate Odoo portal introduces AI-assisted delivery. An exploration or discovery step is not a completed implementation. Service scope, environment compatibility and production changes need assessment and approval.",
      cta: { label: "Explore AI-assisted Odoo delivery →", href: "https://odoo.tenxora.services/" },
    },
    {
      kind: "actions",
      heading: "Bring the right context to the first discussion",
      body: "Share your current system, Odoo version if known, key workflow, team size and desired timing. Use a short example without sensitive customer data or credentials.",
      actions: [{ label: "Discuss your Odoo project →", href: links.contact }, { label: footer.email, href: `mailto:${footer.email}` }],
    },
    {
      kind: "cards",
      heading: "Explore your next Odoo step",
      items: [
        { heading: "Connect your systems", body: "Map data flows, exceptions and reconciliation.", link: { label: "Odoo integrations →", href: "https://tenxora.services/odoo-services/integration/" } },
        { heading: "Move business data", body: "Plan trial imports, validation and cutover.", link: { label: "Odoo data migration →", href: "https://tenxora.services/odoo-services/migration/" } },
        { heading: "Adapt a workflow", body: "Compare standard configuration, Studio and reviewed code.", link: { label: "Odoo customization →", href: "https://tenxora.services/odoo-services/customization/" } },
        { heading: "Understand the budget", body: "Separate cost categories and define a scoped estimate.", link: { label: "Implementation cost →", href: "https://tenxora.services/odoo-services/implementation-cost/" } },
      ],
    },
  ] as Sec[],
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
