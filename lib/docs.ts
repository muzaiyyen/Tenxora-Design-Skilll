// Copy for the Odoo service detail pages, Contact, Book a call and the policy pages, from the live
// tenxora.services pages (read 2026-11-13). Headings, labels, buttons and links are word for word.
// Paragraph text could not be copied verbatim from this environment (tenxora.services is blocked here),
// so every `body` is PENDING (empty) until the exact text is supplied. Empty bodies are not shown.
// Do not reword or add copy.
import { footer, links } from "./content";

export type L = { label: string; href: string };
export type Sub = { heading: string; body?: string };
export type Sec =
  | { kind: "text"; heading: string; body?: string; subs?: Sub[]; links?: L[]; list?: string[]; ordered?: boolean; id?: string }
  | { kind: "steps"; heading?: string; body?: string; items: { n: string; tag?: string; heading: string; body?: string }[] }
  | { kind: "offer"; id?: string; label?: string; heading: string; price?: string; body?: string; links?: L[]; cta: L }
  | { kind: "feature"; heading: string; body?: string; links?: L[]; cta?: L }
  | { kind: "links"; heading: string; links: L[] }
  | { kind: "refs"; heading: string; links: L[]; note?: string }
  | { kind: "actions"; heading?: string; body?: string; actions: L[] }
  | { kind: "badges"; heading: string; body?: string; badges: string[] }
  | { kind: "embed"; heading: string; body?: string; src: string; fallback: L }
  | { kind: "form" }
  | { kind: "cards"; heading: string; items: { heading: string; body?: string; link: L }[] };

export type Doc = {
  slug: string;
  title: string;
  label?: string;
  h1: string;
  lead?: string;
  body?: string; // PENDING intro paragraph
  updated?: string;
  actions?: L[];
  sections: Sec[];
};

const contact = links.contact;
const book: L = { label: "Book a 15-minute introduction", href: "https://tenxora.services/book-a-call/" };
const email: L = { label: footer.email, href: `mailto:${footer.email}` };
const portal = "https://odoo.tenxora.services/";
const S = "https://tenxora.services/odoo-services/";
const partnerLink: L = { label: "Tenxora (Private) Limited as a Ready partner", href: "https://www.odoo.com/partners/tenxora-private-limited-14366535" };
const T = (heading: string, extra: Partial<Extract<Sec, { kind: "text" }>> = {}): Sec => ({ kind: "text", heading, ...extra });
const aiHuman = T("AI-assisted work. Human-reviewed delivery.");

export const services: Record<string, Doc> = {
  implementation: {
    slug: "implementation",
    title: "Odoo Implementation Services | Tenxora",
    label: "A rollout with clear decisions and review gates",
    h1: "Odoo implementation services",
    actions: [{ label: "Discuss a scoped implementation →", href: contact }, email],
    sections: [
      T("Is this the right starting point?", { links: [{ label: "Odoo consulting", href: `${S}consulting/` }] }),
      {
        kind: "steps",
        items: [
          { n: "01", tag: "Define", heading: "A scope your team can approve" },
          { n: "02", tag: "Prepare", heading: "A review environment" },
          { n: "03", tag: "Validate", heading: "Evidence from real workflows" },
          { n: "04", tag: "Handover", heading: "An approved transition" },
        ],
      },
      T("What can be included?"),
      T("What your team provides"),
      T("Which Odoo environments can you support?"),
      T("How long will implementation take?"),
      T("How is the price agreed?"),
      { kind: "feature", heading: "Check the partner evidence", links: [partnerLink] },
      { kind: "feature", heading: "Explore the delivery approach", cta: { label: "Explore AI-assisted Odoo delivery →", href: portal } },
      {
        kind: "links",
        heading: "Plan your next step",
        links: [
          { label: "All Odoo services", href: links.odoo },
          { label: "AI-assisted implementation", href: `${S}ai-assisted-implementation/` },
          { label: "Odoo consulting", href: `${S}consulting/` },
        ],
      },
      { kind: "actions", actions: [{ label: "Discuss a scoped implementation →", href: contact }, email] },
    ],
  },

  "ai-assisted-implementation": {
    slug: "ai-assisted-implementation",
    title: "AI-Assisted Odoo Implementation | Human Review | Tenxora",
    label: "AI prepares. People review and approve.",
    h1: "AI-assisted Odoo implementation",
    lead: "Use AI to prepare Odoo work, with clear human responsibility.",
    actions: [
      { label: "Sign up on the Odoo portal →", href: portal },
      { label: "Discuss a scoped project", href: contact },
    ],
    sections: [
      {
        kind: "steps",
        heading: "What can AI and code help prepare?",
        items: [
          { n: "01", tag: "Agree inputs", heading: "Set the boundary" },
          { n: "02", tag: "Prepare a candidate", heading: "Work away from production" },
          { n: "03", tag: "Human review", heading: "Check the actual behavior" },
          { n: "04", tag: "Customer approval", heading: "Confirm the business result" },
        ],
      },
      T("A practical review example"),
      T("Who approves what?"),
      T("Will AI have access to our business data?"),
      T("Does the portal automatically implement Odoo?"),
      T("Does AI guarantee a lower price or faster completion?"),
      { kind: "feature", heading: "Explore the delivery approach", cta: { label: "Explore AI-assisted Odoo delivery →", href: portal } },
      {
        kind: "links",
        heading: "Plan your next step",
        links: [
          { label: "All Odoo services", href: links.odoo },
          { label: "Odoo implementation", href: `${S}implementation/` },
          { label: "Odoo consulting", href: `${S}consulting/` },
        ],
      },
      {
        kind: "actions",
        actions: [
          { label: "Explore the portal and sign up →", href: portal },
          { label: "Discuss a scoped project", href: contact },
        ],
      },
    ],
  },

  consulting: {
    slug: "consulting",
    title: "Odoo Consulting Services | Fit-Gap & Planning | Tenxora",
    label: "Make the next Odoo decision with better evidence",
    h1: "Odoo consulting services",
    lead: "Clarify what to change before you commit to building it.",
    actions: [{ label: "Discuss your consulting needs →", href: contact }, email],
    sections: [
      {
        kind: "offer",
        id: "workflow-review-blueprint",
        label: "A focused first engagement",
        heading: "Odoo Workflow Review & Blueprint",
        price: "US$299, one-time",
        cta: { label: "Request the $299 review →", href: contact },
      },
      T("When consulting is useful"),
      T("Requirements and process mapping"),
      T("Fit-gap assessment"),
      T("Existing-system review"),
      T("Implementation planning"),
      T("What you receive"),
      T("What we need from you"),
      T("Does consulting include implementation?", { links: [{ label: "Odoo implementation services", href: `${S}implementation/` }] }),
      T("Can you advise on cost and timing?"),
      { kind: "feature", heading: "Check the partner evidence", links: [partnerLink] },
      {
        kind: "links",
        heading: "Plan your next step",
        links: [
          { label: "All Odoo services", href: links.odoo },
          { label: "Odoo implementation", href: `${S}implementation/` },
          { label: "AI-assisted implementation", href: `${S}ai-assisted-implementation/` },
        ],
      },
      { kind: "actions", actions: [{ label: "Discuss your consulting needs →", href: contact }] },
    ],
  },

  integration: {
    slug: "integration",
    title: "Odoo Integration Services & API Planning | Tenxora",
    label: "Connected workflows",
    h1: "Odoo Integration Services for Connected Workflows",
    lead: "Make the handoff between systems dependable.",
    actions: [{ label: "Discuss an Odoo integration →", href: contact }, book],
    sections: [
      T("What can we assess?"),
      T("Map the data"),
      T("Design for exceptions"),
      T("Does your Odoo plan support the connection?"),
      {
        kind: "steps",
        heading: "From one flow to an accepted integration",
        items: [
          { n: "01", heading: "Assess" },
          { n: "02", heading: "Specify" },
          { n: "03", heading: "Prepare and review" },
          { n: "04", heading: "Test and hand over" },
        ],
      },
      T("What would the scope include?"),
      T("Can every connection run in real time?"),
      T("Who maintains it after launch?"),
      aiHuman,
      { kind: "feature", heading: "Partner evidence, clearly attributed", links: [partnerLink] },
      { kind: "actions", actions: [{ label: "Describe your systems and data flow →", href: contact }, book] },
      {
        kind: "links",
        heading: "Related Odoo services",
        links: [
          { label: "All Odoo services", href: links.odoo },
          { label: "Data migration", href: `${S}migration/` },
          { label: "Customization", href: `${S}customization/` },
          { label: "Cost and scope", href: `${S}implementation-cost/` },
        ],
      },
      {
        kind: "refs",
        heading: "Technical references",
        links: [{ label: "Odoo external API documentation", href: "https://www.odoo.com/documentation/19.0/developer/reference/external_api.html" }],
        note: "Technical references checked 2 November 2026. Features and access depend on your version, plan and hosting.",
      },
    ],
  },

  migration: {
    slug: "migration",
    title: "Odoo Data Migration Services & Cutover | Tenxora",
    label: "Data you can account for",
    h1: "Odoo Data Migration and Cutover Planning",
    lead: "Move the right records. Check what arrives.",
    actions: [{ label: "Review your migration scope →", href: contact }, book],
    sections: [
      T("Data migration or an Odoo version upgrade?"),
      T("What data belongs in the move?"),
      T("Prepare a mapping register"),
      T("Reconcile business meaning"),
      {
        kind: "steps",
        heading: "How the migration is controlled",
        items: [
          { n: "01", heading: "Inventory" },
          { n: "02", heading: "Clean and map" },
          { n: "03", heading: "Trial" },
          { n: "04", heading: "Reconcile" },
          { n: "05", heading: "Cut over" },
        ],
      },
      T("Can an import simply be undone?"),
      T("What do you receive, and what must your team provide?"),
      T("How long does a migration take?"),
      aiHuman,
      { kind: "feature", heading: "Partner evidence, clearly attributed", links: [partnerLink] },
      { kind: "actions", actions: [{ label: "Discuss the data you need to move →", href: contact }, book] },
      {
        kind: "links",
        heading: "Related Odoo services",
        links: [
          { label: "All Odoo services", href: links.odoo },
          { label: "Implementation", href: `${S}implementation/` },
          { label: "Ongoing integrations", href: `${S}integration/` },
          { label: "Cost and scope", href: `${S}implementation-cost/` },
        ],
      },
      {
        kind: "refs",
        heading: "Technical references",
        links: [{ label: "Odoo import and export documentation", href: "https://www.odoo.com/documentation/19.0/applications/essentials/export_import_data.html" }],
      },
    ],
  },

  customization: {
    slug: "customization",
    title: "Odoo Customization & Module Development | Tenxora",
    label: "Change with a reason",
    h1: "Odoo Customization with Human-Reviewed Delivery",
    lead: "Solve a workflow gap without adding needless complexity.",
    actions: [{ label: "Discuss a custom workflow →", href: contact }, book],
    sections: [
      T("Configuration, Studio or a custom module?", { subs: [{ heading: "Start with configuration" }, { heading: "Choose the right extension" }] }),
      T("Can custom code run on Odoo Online?"),
      T("Does Studio change the subscription cost?"),
      {
        kind: "steps",
        heading: "What is the delivery process?",
        items: [
          { n: "01", heading: "Define the gap" },
          { n: "02", heading: "Choose an approach" },
          { n: "03", heading: "Prepare and review" },
          { n: "04", heading: "Test" },
          { n: "05", heading: "Release and hand over" },
        ],
      },
      T("What should be in the handover?"),
      T("Will the change survive every future upgrade?"),
      aiHuman,
      { kind: "feature", heading: "Explore the AI-assisted approach", cta: { label: "Explore discovery and sign-up options on the Odoo portal →", href: portal } },
      { kind: "feature", heading: "Partner evidence, clearly attributed", links: [partnerLink] },
      { kind: "actions", actions: [{ label: "Describe your workflow gap →", href: contact }, book] },
      {
        kind: "links",
        heading: "Related Odoo services",
        links: [
          { label: "All Odoo services", href: links.odoo },
          { label: "Fit-gap consulting", href: `${S}consulting/` },
          { label: "Integration", href: `${S}integration/` },
          { label: "Cost and scope", href: `${S}implementation-cost/` },
        ],
      },
      {
        kind: "refs",
        heading: "Technical references",
        links: [
          { label: "Odoo Online restrictions", href: "https://www.odoo.com/documentation/19.0/administration/odoo_online.html" },
          { label: "Odoo Studio documentation", href: "https://www.odoo.com/documentation/19.0/applications/studio.html" },
        ],
      },
    ],
  },

  "implementation-cost": {
    slug: "implementation-cost",
    title: "Odoo Implementation Cost & Scope | Tenxora",
    label: "Budget from an agreed scope",
    h1: "What Determines Odoo Implementation Cost",
    lead: "An estimate should explain the work behind the number.",
    actions: [{ label: "Request a scoped implementation estimate →", href: contact }, book],
    sections: [
      T("What costs should you separate?", { subs: [{ heading: "Software and infrastructure" }, { heading: "Delivery and continued operation" }] }),
      T("Which requirements change the estimate?", {
        subs: [
          { heading: "Workflow complexity" },
          { heading: "Data quality and history" },
          { heading: "Interfaces" },
          { heading: "Custom changes" },
          { heading: "People and rollout" },
        ],
      }),
      T("What do we need to prepare an estimate?"),
      T("What should the proposal make clear?"),
      {
        kind: "offer",
        heading: "A defined planning option: US$299 one-time",
        links: [{ label: "Odoo Workflow Review & Blueprint", href: `${S}consulting/#workflow-review-blueprint` }],
        cta: { label: "Request the $299 workflow review →", href: contact },
      },
      T("Are Odoo licence prices included in this page?", { links: [{ label: "Odoo's current pricing", href: "https://www.odoo.com/pricing-plan" }] }),
      T("Does a portal trial include an implementation?", {
        links: [{ label: "Explore current discovery and sign-up options on the Odoo portal", href: portal }],
      }),
      aiHuman,
      { kind: "feature", heading: "Partner evidence, clearly attributed", links: [partnerLink] },
      { kind: "actions", actions: [{ label: "Discuss the scope behind your budget →", href: contact }, book] },
      {
        kind: "links",
        heading: "Related Odoo services",
        links: [
          { label: "All Odoo services", href: links.odoo },
          { label: "Implementation", href: `${S}implementation/` },
          { label: "Data migration", href: `${S}migration/` },
          { label: "Customization", href: `${S}customization/` },
        ],
      },
      {
        kind: "refs",
        heading: "Technical references",
        links: [
          { label: "External API plan requirements", href: "https://www.odoo.com/documentation/19.0/developer/reference/external_api.html" },
          { label: "Studio plan requirements", href: "https://www.odoo.com/documentation/19.0/applications/studio.html" },
        ],
      },
    ],
  },
};

export const contactPage: Doc = {
  slug: "contactus",
  title: "Contact Tenxora | Odoo Consulting & Implementation",
  h1: "Let’s improve the way your business works.",
  sections: [
    { kind: "feature", heading: "Prefer a conversation?", cta: { label: "Book a 15-minute call →", href: "https://tenxora.services/book-a-call/" } },
    { kind: "feature", heading: "What would you like to change?", links: [email] },
    T("What happens next", {
      ordered: true,
      list: ["We review your message.", "We clarify your requirements and fit.", "We agree scope before starting work."],
    }),
    { kind: "form" },
  ],
};

// Contact form labels, word for word. The live form is the mu-plugin's; this one is display-only.
export const contactForm = {
  name: "Your name *",
  email: "Email address *",
  company: "Company (optional)",
  area: "What can we help with? *",
  areaPlaceholder: "Choose an area",
  areas: ["Odoo implementation", "Odoo improvement", "Integrations and automation", "General enquiry"],
  message: "Your message *",
  messageHint: "20–5,000 characters. Please leave out passwords and sensitive information.",
  consent: { before: "I have read the ", link: { label: "privacy policy", href: "https://tenxora.services/privacy/" }, after: " and understand that Tenxora will use my details to respond to this enquiry. *" },
  submit: "Send enquiry →",
};

export const bookPage: Doc = {
  slug: "book-a-call",
  title: "Book an Odoo Introduction | Tenxora",
  label: "Your next step with Odoo",
  h1: "Book a call",
  sections: [
    { kind: "badges", heading: "A short conversation. A clearer way forward.", badges: ["15-minute intro", "Google Meet", "No charge"] },
    T("Bring one workflow."),
    T("Choose a time that fits."),
    {
      kind: "embed",
      heading: "Choose your 15-minute introduction",
      src: "https://calendly.com/contact-tenxora/odoo-introduction",
      fallback: { label: "Open the booking calendar in a new tab ↗", href: "https://calendly.com/contact-tenxora/odoo-introduction" },
    },
    { kind: "feature", heading: "Prefer to start with a message?", links: [{ label: "Send a project enquiry", href: contact }, email] },
  ],
};

export const privacyPage: Doc = {
  slug: "privacy",
  title: "Privacy Policy | Tenxora",
  label: "Website enquiries & privacy",
  h1: "Privacy policy",
  updated: "Updated 29 October 2026.",
  sections: [
    T("Information you choose to share"),
    T("Where enquiries go"),
    T("Technical information"),
    T("AI and service delivery"),
    T("Cookies and external resources", { links: [{ label: "cookie policy", href: "https://tenxora.services/cookie-policy/" }] }),
    T("Retention and requests", { links: [email] }),
    T("Scope of this policy"),
  ],
};

export const cookiePage: Doc = {
  slug: "cookie-policy",
  title: "Cookie Policy | Tenxora",
  label: "How this website works",
  h1: "Cookie policy",
  updated: "Updated 29 October 2026.",
  sections: [
    T("Website functionality"),
    T("Marketing and analytics"),
    T("External resources and links"),
    T("Your choices", { links: [email, { label: "privacy policy", href: "https://tenxora.services/privacy/" }] }),
  ],
};
