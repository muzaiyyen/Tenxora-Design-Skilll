// Every visible word on the home page, copied verbatim from https://www.tenxora.com/
// (captured 2026-10-09). Do not edit wording here: the redesign changes the
// presentation only. Order matches the live page.

export const links = {
  home: "/",
  contact: "https://www.tenxora.com/contactus",
  blog: "https://www.tenxora.com/blog",
  whyTenxora: "https://www.tenxora.com/why-tenxora",
  cookiePolicy: "https://www.tenxora.com/cookie-policy",
  facebook: "https://www.facebook.com/people/Tenxora/61572091372256/",
  linkedin: "https://www.linkedin.com/company/tenxora/services/?viewAsMember=true",
  instagram: "https://www.instagram.com/tenxora?igsh=ZTFybjBleTBmMzB3&utm_source=qr",
};

export const nav = [
  { label: "Appointment", href: links.contact },
  { label: "Blog", href: links.blog },
  { label: "Why Tenxora", href: links.whyTenxora },
  { label: "Contact Us", href: links.contact },
];

export const hero = {
  eyebrow: "The AI-Era Operating Shift",
  headline: ["Winning businesses don't work harder.", "They work smarter."],
  lead: 'AI and automation are resetting what "efficient" looks like.',
  body: [
    "Every quarter spent on manual work and disconnected tools is a quarter a competitor spends getting faster.",
    "tenxora simplifies operations, connects your systems, automates the busywork, and gets your business ready for how work happens now.",
  ],
  primary: { label: "Get an Operations Audit →", href: links.contact },
  secondary: { label: "See How We Work ↓", href: "#tx-framework" },
  services: ["ERP & Odoo", "Automation & AI", "Integrations", "Team Augmentation", "Managed Operations"],
  badges: ["AI-enabled", "Open platforms", "Cost-effective", "Scalable"],
};

export const opsMap = {
  title: "Operations Map / Live Model",
  status: "CONNECTED",
  sources: [
    { icon: "XL", name: "Spreadsheets", lines: ["Manual tracking"] },
    { icon: "mail", name: "Email", lines: ["Manual updates"] },
    { icon: "crm", name: "CRM", lines: ["Sales Data", "Disconnected records"] },
  ],
  core: { name: "ERP", lines: ["Business System", "One source of truth"] },
  outputs: [
    { icon: "ai", name: "AI", lines: ["Automation", "Less repetitive work"] },
    { icon: "report", name: "Live Reporting", lines: ["Management visibility"] },
  ],
  flow: "tenxora simplify → systemize → automate",
  shifts: [
    ["Fragmented", "Connected"],
    ["Manual", "Automated"],
  ] as const,
};

export const beforeWith = {
  kicker: "Operations Transformation",
  heading: "See what changes when tenxora enters the operation.",
  body: "Growing businesses accumulate operational complexity. Flip the switch to see what a better operating model looks like.",
  before: "Before tenxora",
  with: "With tenxora",
  beforeLabel: "Operational complexity",
  pains: [
    "Too many spreadsheets",
    "Duplicate data entry",
    "Disconnected software",
    "Manual reporting",
    "Hiring pressure",
    "Slow approvals",
    "Departments in silos",
    "Manual customer updates",
    "Repetitive admin",
    "Poor visibility",
    "People dependency",
    "Inconsistent processes",
    "Communication gaps",
    "Delayed reporting",
    "Too many handoffs",
    "Unnecessary headcount",
    "Manual workflows",
    "Systems that don't scale",
    "No single source of truth",
    "Teams chasing information",
  ],
  withBrand: "tenxora.",
  withFlow: "Understand → Simplify → Systemize → Automate → Scale",
  withLabel: "Better operations, end to end",
  withStages: ["Simplify", "Systemize", "Automate", "Scale"],
};

export const problem = {
  eyebrow: "The problem",
  heading: "Growth creates complexity.",
  body: [
    "As businesses grow, the operation often becomes slower, more manual, and harder to manage.",
    "tenxora helps remove that friction.",
  ],
  cards: [
    {
      n: "01",
      title: "Too many systems",
      body: "Critical work gets spread across spreadsheets, inboxes and separate tools that do not move together.",
    },
    {
      n: "02",
      title: "Too much manual work",
      body: "Teams spend time chasing updates, entering data repeatedly and keeping processes alive by hand.",
    },
    {
      n: "03",
      title: "Too little visibility",
      body: "Reporting arrives late, decisions depend on people, and leadership lacks a clear view of the operation.",
    },
  ],
};

export const framework = {
  eyebrow: "How we work",
  heading: "A simple framework for operational transformation.",
  body: "We improve the operation in the right order: understand it, simplify it, build the right systems, automate what should be automated, then scale.",
  steps: [
    { n: "01", name: "Understand", body: "Map workflows, bottlenecks, systems and reporting gaps." },
    { n: "02", name: "Simplify", body: "Remove unnecessary steps before adding more technology." },
    { n: "03", name: "Systemize", body: "Build the right foundation with ERP, Odoo and connected workflows." },
    { n: "04", name: "Automate", body: "Use workflows, integrations and AI where they genuinely remove repetitive work." },
    { n: "05", name: "Scale", body: "Create capacity, visibility and operational support for growth." },
  ],
};

export const capabilities = {
  eyebrow: "Capabilities",
  heading: "The tools underneath the transformation.",
  body: [
    "We do not lead with a list of unrelated services.",
    "We use the right combination of systems, automation, integrations and support to improve the whole operation.",
  ],
  cards: [
    {
      eyebrow: "Business systems",
      title: "Build one reliable operational foundation.",
      body: "ERP and business systems that connect the functions your company depends on every day.",
      tags: ["Odoo", "ERP", "CRM", "Finance", "Inventory"],
    },
    {
      eyebrow: "Automation & integration",
      title: "Make work move faster with less friction.",
      body: "Connect systems, remove duplicate effort and automate repetitive workflows where it makes sense.",
      tags: ["Automation", "AI", "Integrations", "Managed operations"],
    },
  ],
};

export const audit = {
  eyebrow: "Operations Transformation Audit",
  heading: "Find out what is slowing your operation down.",
  body: "We review your workflows, systems, repetitive tasks and operational structure to identify where you can simplify, integrate, automate and improve visibility.",
  checklist: [
    "Workflow and process bottlenecks",
    "Manual and repetitive tasks",
    "Disconnected systems and data",
    "Opportunities for automation",
  ],
  cta: { label: "Request Your Operations Audit →", href: links.contact },
};

export const footer = {
  contact: { label: "Contact Us", href: links.contact },
  follow: "Follow us",
  socials: [
    { network: "Facebook", handle: "@tenxora", href: links.facebook },
    { network: "LinkedIn", handle: "@tenxora", href: links.linkedin },
    { network: "Instagram", handle: "@tenxora", href: links.instagram },
  ],
  privacyHeading: "Privacy Policy",
  privacyLink: { label: "/cookie-policy", href: links.cookiePolicy },
  copyright: "Copyright © Tenxora 2026",
};

export const cookies = {
  text: "We use cookies to provide you a better user experience on this website.",
  policy: { label: "Cookie Policy", href: links.cookiePolicy },
  essentials: "Only essentials",
  agree: "I agree",
};
