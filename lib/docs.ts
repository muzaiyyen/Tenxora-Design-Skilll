// Copy for the Odoo service pages, Contact, Book a call, the policy pages and the three Partners pages.
// Every word comes from the live tenxora.services copy reference of 19 November 2026
// (/mnt/project-files/copy-reference/Tenxora_17_Page_Copy_2026-11-19.zip). Do not reword or add copy.
// Text markup: a blank line starts a new paragraph, "[label](href)" is a link, "**text**" is bold
// (bold is presentation only: the words are the live words).
// One deliberate difference: "English-speaking" is left out of the Odoo Services intro (lib/pages.ts) at the
// user's request (2026-11-13); flagged for Bilal.
import { footer, links } from "./content";

export type L = { label: string; href: string };
export type Sub = { heading: string; body?: string };
export type Field = { label: string; type?: "text" | "email" | "url" | "select" | "textarea"; options?: string[]; required?: boolean };
export type Sec =
  | { kind: "text"; heading: string; level?: 3; body?: string; subs?: Sub[]; after?: string; links?: L[]; list?: string[]; ordered?: boolean; id?: string }
  | { kind: "steps"; heading?: string; body?: string; plain?: boolean; items: { n: string; tag?: string; heading: string; body?: string }[] }
  | { kind: "offer"; id?: string; label?: string; heading: string; price?: string; body?: string; list?: string[]; after?: string; links?: L[]; cta: L }
  | { kind: "feature"; heading: string; body?: string; links?: L[]; cta?: L }
  | { kind: "links"; heading: string; links: L[] }
  | { kind: "refs"; heading: string; links: L[]; note?: string }
  | { kind: "actions"; heading?: string; body?: string; actions: L[] }
  | { kind: "badges"; heading: string; body?: string; badges: string[] }
  | { kind: "embed"; heading: string; body?: string; src: string; title: string; fallbackLead?: string; fallback: L }
  | { kind: "note"; body: string }
  | { kind: "form" }
  | { kind: "plans"; id?: string; heading: string; plans: { name: string; price: string; hours: string; extra: string; desc: string; cta: L }[]; links?: L[]; after?: string }
  | { kind: "table"; heading: string; caption?: string; head: string[]; rows: string[][] }
  | { kind: "faq"; heading: string; items: { q: string; a?: string }[] }
  | {
      kind: "pform";
      id?: string;
      heading: string;
      body?: string;
      fieldsNote?: string;
      fields: Field[];
      consent?: { before: string; link: L; after: string };
      submit: string;
      note?: string;
      links?: L[];
    }
  | { kind: "cards"; heading: string; items: { heading: string; body?: string; link: L }[] };

export type Doc = {
  slug: string;
  title: string;
  label?: string;
  h1: string;
  lead?: string;
  body?: string;
  updated?: string;
  actions?: L[];
  note?: string; // a line under the hero buttons
  sections: Sec[];
};

const contact = links.contact;
const bookHref = "https://tenxora.services/book-a-call/";
const book: L = { label: "Book a 15-minute introduction", href: bookHref };
const email: L = { label: footer.email, href: `mailto:${footer.email}` };
const mail = `[${footer.email}](mailto:${footer.email})`;
const portal = "https://odoo.tenxora.services/";
const S = "https://tenxora.services/odoo-services/";
const partnerUrl = "https://www.odoo.com/partners/tenxora-private-limited-14366535";
const T = (heading: string, extra: Partial<Extract<Sec, { kind: "text" }>> = {}): Sec => ({ kind: "text", heading, ...extra });

// blocks repeated across the service pages, word for word
const partnerEvidence: Sec = {
  kind: "feature",
  heading: "Check the partner evidence",
  body: `The official Odoo directory lists [Tenxora (Private) Limited as a Ready partner](${partnerUrl}). This credential belongs to the company named in that listing. Your proposal will identify the contracting entity, delivery responsibilities and applicable terms.`,
};
const partnerAttributed: Sec = {
  kind: "feature",
  heading: "Partner evidence, clearly attributed",
  body: `The official Odoo directory lists [Tenxora (Private) Limited as a Ready partner](${partnerUrl}). The credential belongs to the named company. Your proposal identifies the contracting entity and delivery responsibilities.`,
};
const deliveryApproach: Sec = {
  kind: "feature",
  heading: "Explore the delivery approach",
  body: "Our separate Odoo portal introduces AI-assisted delivery. An exploration or discovery step is not a completed implementation. Service scope, environment compatibility and production changes need assessment and approval.",
  cta: { label: "Explore AI-assisted Odoo delivery →", href: portal },
};
const aiHuman: Sec = T("AI-assisted work. Human-reviewed delivery.", {
  body: "Tenxora.Services is an AI-assisted Service as a Software company. AI and code can help prepare mappings, specifications or draft changes; a human reviews the agreed work and test evidence before customer approval and controlled production changes. Odoo services are available now; other service lines remain future offerings.",
});
const refsNote = "Technical references checked 2 November 2026. Features and access depend on your version, plan and hosting.";

export const services: Record<string, Doc> = {
  implementation: {
    slug: "implementation",
    title: "Odoo Implementation Services | Tenxora",
    label: "A rollout with clear decisions and review gates",
    h1: "Odoo implementation services",
    lead: "Turn your business requirements into an Odoo setup your team can use.",
    body: "Our Odoo implementation service covers the path from an agreed process design to tested workflows and handover. The work starts with your operation: what must happen, who is responsible and how your team will confirm that it works. AI and code support initial preparation; a human reviews the outputs before customer acceptance.",
    actions: [{ label: "Discuss a scoped implementation →", href: contact }, email],
    sections: [
      T("Is this the right starting point?", {
        body: `This service fits a business moving to Odoo or expanding an existing installation with a defined phase. If you are still deciding what to implement, [Odoo consulting](${S}consulting/) can first establish requirements and a realistic scope.`,
      }),
      {
        kind: "steps",
        items: [
          { n: "01", tag: "Define", heading: "A scope your team can approve", body: "Map priority processes, users and exceptions. Identify standard Odoo capabilities, gaps, dependencies and acceptance criteria. Agree the first useful milestone." },
          { n: "02", tag: "Prepare", heading: "A review environment", body: "Configure the agreed applications in a separate environment. Where included, prepare data mappings and integration designs. Identify additional work before it becomes an unapproved change." },
          { n: "03", tag: "Validate", heading: "Evidence from real workflows", body: "A human checks configuration and changes. Your designated users test representative transactions, access permissions and exceptions against agreed criteria. Record issues and resolve launch blockers." },
          { n: "04", tag: "Handover", heading: "An approved transition", body: "Agree data cutover checks, user guidance, rollback responsibilities and the production change window. Customer approval is required before the agreed production transition." },
        ],
      },
      T("What can be included?", {
        body: "The proposal identifies the deliverables for your engagement: process map, configuration record, data import and reconciliation checks, test scenarios, user guidance and handover checklist. Integrations, custom modules, migration, training and ongoing support are included only when named in the agreed scope.",
      }),
      T("What your team provides", {
        list: [
          "A business sponsor and process owners who can resolve requirements and approve outcomes.",
          "Representative data, with responsibility for its accuracy and permission to use it.",
          "Authorized access through an agreed secure channel.",
          "Users available for testing and a decision-maker for scope changes.",
        ],
      }),
      T("Which Odoo environments can you support?", {
        body: "Tell us your version, edition and hosting before we propose technical work. Configuration options and the ability to install custom code or connect external systems vary by environment. Compatibility is assessed individually; this page does not promise support for every Odoo version or hosting option.",
      }),
      T("How long will implementation take?", {
        body: "A single workflow and a multi-team rollout need different plans. Data quality, decision speed, dependencies and testing availability affect timing. We agree milestones after scoping; we do not promise a complete ERP rollout in a fixed number of days.",
      }),
      T("How is the price agreed?", {
        body: "We separate service scope from Odoo licensing and hosting assumptions. Where requirements remain uncertain, a paid discovery and implementation plan may be proposed as the first engagement, with its deliverables and terms agreed before work begins.",
      }),
      partnerEvidence,
      deliveryApproach,
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
    body: "AI-assisted Odoo implementation means AI and code perform initial service work while people remain responsible for checking it. Tenxora.Services uses this approach within an agreed project scope. A generated configuration, script or document is a candidate for review, not approval to change your production system.",
    actions: [
      { label: "Sign up on the Odoo portal →", href: portal },
      { label: "Discuss a scoped project", href: contact },
    ],
    note: `Explore the discovery trial and sign-up options in the [AI-assisted Odoo portal](${portal}).`,
    sections: [
      T("What can AI and code help prepare?", {
        body: "Depending on the engagement, initial work can include organizing requirements, drafting workflow descriptions, preparing configuration proposals, writing candidate code or data transformation scripts, and drafting test cases or handover notes. The proposal states which activities apply to your project. Outputs must be checked against your actual environment and business rules.",
      }),
      {
        kind: "steps",
        items: [
          { n: "01", tag: "Agree inputs", heading: "Set the boundary", body: "Confirm the problem, permitted data, environment, expected output and acceptance checks. Agree data handling before using customer information in delivery tools." },
          { n: "02", tag: "Prepare a candidate", heading: "Work away from production", body: "Prepare the proposed configuration, code or documentation in a separate review environment. Keep assumptions and dependencies visible." },
          { n: "03", tag: "Human review", heading: "Check the actual behavior", body: "Review business logic, access rights, data handling, failure cases and maintainability where relevant. Run agreed tests and record findings rather than accepting generated output at face value." },
          { n: "04", tag: "Customer approval", heading: "Confirm the business result", body: "Your process owner tests the agreed workflows. Resolve blockers, approve the deliverable and agree any production transition separately." },
        ],
      },
      T("A practical review example", {
        body: "For a proposed sales-to-invoice workflow, the review could check who may confirm a quotation, what happens when stock is unavailable, which invoice values are produced and how exceptions are handled. Your process owner then tests representative cases. This is an illustrative checklist, not a claim about a completed customer project.",
      }),
      T("Who approves what?", {
        list: [
          "**Tenxora’s human reviewer:** checks the prepared work against the agreed technical and business requirements.",
          "**Your process owner:** confirms the workflow meets the business acceptance criteria.",
          "**The authorized customer decision-maker:** approves scope changes and the planned production transition.",
        ],
        after: "Reviewer assignments, test evidence and handover responsibilities are agreed for the engagement.",
      }),
      T("Will AI have access to our business data?", {
        body: "That depends on the agreed delivery setup. We establish what data is required, which tools may process it and who may access it before work begins. Use representative or minimized data where practical. Do not send credentials or confidential records through the website enquiry form.",
      }),
      T("Does the portal automatically implement Odoo?", {
        body: "Exploring the portal is not a purchase of a completed rollout and does not authorize production changes. Product capabilities and terms need to be checked for the proposed use. This service does not depend on public checkout or automatic customer-production execution.",
      }),
      T("Does AI guarantee a lower price or faster completion?", {
        body: "No fixed saving or delivery speed is promised. Review, testing, data preparation and business decisions still take work. We assess your requirements and agree the milestones and commercial terms for the engagement.",
      }),
      deliveryApproach,
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
    body: "Odoo consulting helps you turn operational problems into a practical set of decisions. Tenxora.Services assesses your requirements or existing setup, distinguishes configuration from additional development and prepares a prioritized plan. AI and code can organize initial findings; a human reviews the analysis and recommendations.",
    actions: [{ label: "Discuss your consulting needs →", href: contact }, email],
    sections: [
      {
        kind: "offer",
        id: "workflow-review-blueprint",
        label: "A focused first engagement",
        heading: "Odoo Workflow Review & Blueprint",
        price: "US$299 one-time",
        body: "Get a clear plan for one business workflow before you invest in implementation. We agree the workflow boundaries and required inputs before starting.",
        list: [
          "**Discovery workshop:** understand the current process, people, systems and desired outcome.",
          "**Human-reviewed written blueprint:** document requirements, fit-gap findings, assumptions and recommended approach.",
          "**Prioritized implementation plan:** define practical next steps, dependencies and acceptance criteria.",
          "**Handover:** walk through the blueprint and implementation plan with your team.",
          "**One clarification round:** resolve questions about the agreed blueprint.",
        ],
        after:
          "AI and code support initial preparation; a human reviews the written blueprint. Implementation, Odoo licences and hosting are quoted separately. Additional workflows or work outside the agreed scope require a separate agreement.\n\nSession length and delivery timing are agreed after the introductory call, based on the scope and complexity of your workflow.",
        cta: { label: "Request the $299 review →", href: contact },
      },
      T("When consulting is useful", {
        list: [
          "You are considering Odoo but have not agreed the processes and applications in scope.",
          "Your existing setup relies on workarounds, duplicate entry or unclear responsibilities.",
          "Your team needs to decide between standard configuration, integration and customization.",
          "You need a defined first phase before requesting an implementation proposal.",
        ],
      }),
      T("Requirements and process mapping", {
        body: "Identify who does the work, which records they use, where handoffs fail and what the desired process must achieve. Separate essential requirements from later improvements.",
      }),
      T("Fit-gap assessment", {
        body: "Compare agreed needs with the capabilities and constraints of the proposed Odoo environment. Record gaps, assumptions and items requiring technical validation.",
      }),
      T("Existing-system review", {
        body: "Review a bounded workflow, configuration or integration concern. Identify likely causes, dependencies and next checks without treating an initial observation as a proven diagnosis.",
      }),
      T("Implementation planning", {
        body: "Prioritize phases, define deliverables and acceptance criteria, and identify data, access, training and decision dependencies.",
      }),
      T("What you receive", {
        body: "Depending on the agreed scope, the output can include a process summary, requirements register, fit-gap findings, options with tradeoffs, a prioritized roadmap and a proposed first implementation milestone. The blueprint separates agreed requirements from assumptions and unresolved questions, with dependencies and acceptance checks for the next phase. We review it with your decision-makers so your team can approve the scope before separately commissioned implementation.",
      }),
      T("What we need from you", {
        body: "For the one-workflow review, bring a short description of the problem, the intended outcome and examples of the steps, records and exceptions involved. Share your Odoo version, edition and hosting if known. Identify a sponsor and process owner who can answer questions and approve decisions. Agree any secure access or representative data-sharing route separately; do not send passwords or confidential production records through the enquiry form.",
      }),
      T("Does consulting include implementation?", {
        body: `The US$299 review produces the agreed blueprint and plan; it does not include implementation, code changes, data migration or production fixes. Those delivery tasks require a separate scope and quote. If the rollout scope is already clear, see our [Odoo implementation services](${S}implementation/). If records need to move, review the [data migration scope and acceptance checks](${S}migration/) before treating the transfer as a simple import.`,
      }),
      T("Can you advise on cost and timing?", {
        body: `We can identify the scope drivers, dependencies and assumptions needed for an estimate. Any initial range must state its basis. See [which requirements affect an Odoo implementation estimate](${S}implementation-cost/). A delivery commitment follows an agreed scope and commercial proposal, rather than a generic promise on this page.`,
      }),
      partnerEvidence,
      {
        kind: "links",
        heading: "Plan your next step",
        links: [
          { label: "All Odoo services", href: links.odoo },
          { label: "Odoo implementation", href: `${S}implementation/` },
          { label: "AI-assisted implementation", href: `${S}ai-assisted-implementation/` },
        ],
      },
      { kind: "actions", actions: [{ label: "Discuss your consulting needs →", href: contact }, email] },
    ],
  },

  integration: {
    slug: "integration",
    title: "Odoo Integration Services & API Planning | Tenxora",
    label: "Connected workflows",
    h1: "Odoo Integration Services for Connected Workflows",
    lead: "Make the handoff between systems dependable.",
    body: "Odoo integration connects agreed records and actions between Odoo and another system. A useful integration defines which system owns each record, how changes move, how failures are handled and how your team checks that both sides agree.",
    actions: [{ label: "Discuss an Odoo integration →", href: contact }, book],
    sections: [
      T("What can we assess?", {
        body: "Start with a specific handoff: orders from a sales channel, customer records from a CRM, or a defined reporting feed. We assess the actual systems and interfaces before promising a connector. A tool having an API does not establish that every workflow, field or action is supported.",
      }),
      T("Map the data", {
        body: "Define source and destination fields, record identifiers, transformations, required values and the system of record. Decide whether the flow is one-way or two-way and how conflicting edits are resolved.",
      }),
      T("Design for exceptions", {
        body: "Specify duplicate prevention, retries, failed-record handling, logs and an accountable person to resolve exceptions. Agree how totals or record counts will be reconciled.",
      }),
      T("Does your Odoo plan support the connection?", {
        body: "We check your Odoo version, edition, hosting, subscription and permissions alongside the other system’s access rules. Odoo’s current external API documentation limits external API access on its pricing plans to Custom, excluding One App Free and Standard. Your exact deployment and proposed interface need confirmation before a scope is agreed.",
      }),
      {
        kind: "steps",
        heading: "From one flow to an accepted integration",
        plain: true,
        items: [
          { n: "01", heading: "Assess:", body: "inventory both systems, access constraints, transaction volumes and the business owner." },
          { n: "02", heading: "Specify:", body: "agree mappings, sync direction, frequency, failure handling and acceptance checks." },
          { n: "03", heading: "Prepare and review:", body: "develop the agreed flow in a separate environment and review changes and credentials handling." },
          { n: "04", heading: "Test and hand over:", body: "demonstrate normal, duplicate and failure cases; document monitoring and support responsibilities before approved release." },
        ],
      },
      T("What would the scope include?", {
        body: "A proposal can include an interface inventory, mapping document, agreed connection, test results, reconciliation checklist and operating notes. Connector licences, access subscriptions, historical data loading, additional flows and ongoing monitoring are included only when stated. The customer supplies an authorized system owner, access through an agreed secure route, representative sample data and sign-off.",
      }),
      T("Can every connection run in real time?", {
        body: "No universal refresh time is promised. We agree a suitable schedule after checking endpoint capabilities, limits, transaction volume and the cost of delay. A periodic exchange may be more appropriate than continuous synchronization.",
      }),
      T("Who maintains it after launch?", {
        body: "The handover identifies who owns error queues, credential renewal and changes in either system. Ongoing support is a separately agreed responsibility, not an assumed permanent service.",
      }),
      aiHuman,
      partnerAttributed,
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
        note: refsNote,
      },
    ],
  },

  migration: {
    slug: "migration",
    title: "Odoo Data Migration Services & Cutover | Tenxora",
    label: "Data you can account for",
    h1: "Odoo Data Migration and Cutover Planning",
    lead: "Move the right records. Check what arrives.",
    body: "Odoo data migration moves an agreed set of business records from a legacy system, spreadsheet or other source into the target Odoo environment. The work includes cleaning and mapping the data, trial imports, reconciliation and a customer-approved cutover plan.",
    actions: [{ label: "Review your migration scope →", href: contact }, book],
    sections: [
      T("Data migration or an Odoo version upgrade?", {
        body: "This service focuses on business data moving into Odoo. Upgrading an existing Odoo database to another version is a different scope, with application, module and hosting compatibility to assess. The assessment also identifies custom fields, custom modules and integrations that affect the proposed transfer; adapting them is separate work unless included in the proposal. We do not promise that importing files upgrades a database or makes custom modules compatible.",
      }),
      T("What data belongs in the move?", {
        body: "Agree the records and periods before importing: for example, customers and products, opening balances, selected open transactions or a defined history. Decide which data must remain in a read-only archive and who needs access. A full historical transfer is not assumed.",
      }),
      T("Prepare a mapping register", {
        body: "Record source fields, target fields, required values, identifiers and relationships. Log duplicates, missing values and transformations, with a customer owner for unresolved decisions.",
      }),
      T("Reconcile business meaning", {
        body: "Agree record counts and control totals where relevant, then sample relationships and workflows. A successful file upload alone is not acceptance that balances, ownership or transactions are correct.",
      }),
      {
        kind: "steps",
        heading: "How the migration is controlled",
        plain: true,
        items: [
          { n: "01", heading: "Inventory:", body: "confirm source exports, target version, agreed records, access permissions and the custom-module or integration dependencies that need assessment." },
          { n: "02", heading: "Clean and map:", body: "prepare repeatable transformations and an exception list for customer decisions." },
          { n: "03", heading: "Trial:", body: "rehearse the agreed import process in a separate environment; check required fields, record relationships and representative workflows before a production decision." },
          { n: "04", heading: "Reconcile:", body: "compare agreed counts, balances and samples; record and resolve or explicitly accept exceptions, then obtain customer sign-off on the agreed acceptance checks." },
          { n: "05", heading: "Cut over:", body: "plan the data freeze, final extract, backup and recovery responsibilities, change window, rollback triggers and post-load checks. Proceed only after the customer approves the release decision." },
        ],
      },
      T("Can an import simply be undone?", {
        body: "Do not rely on an undo button. Odoo documents imports as permanent. We therefore agree trial runs, backups and a recovery approach before production loading. The appropriate recovery action depends on what changed after the load; rollback is a planned decision, not a guarantee of a loss-free reset.",
      }),
      T("What do you receive, and what must your team provide?", {
        body: "The agreed scope can include a data inventory, mapping register, prepared import files or scripts, trial results, exception log, reconciliation evidence and cutover checklist. The proposal identifies which of these are included. The customer confirms data ownership, supplies usable exports, decides how ambiguous records should be handled and appoints a person to sign off the result. Statutory record-retention decisions, correcting source accounting records and recreating every historical process are not automatically included.",
      }),
      T("How long does a migration take?", {
        body: `Timing depends on data quality, volume, relationships, history and the speed of exception decisions. We estimate after reviewing a representative export and target structure; there is no universal record-count or turnaround promise. These requirements also affect the [migration work included in an implementation estimate](${S}implementation-cost/). If the workflow or target requirements are still unclear, [Odoo consulting can help define the scope first](${S}consulting/); the review and migration delivery are separate engagements.`,
      }),
      aiHuman,
      partnerAttributed,
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
        note: refsNote,
      },
    ],
  },

  customization: {
    slug: "customization",
    title: "Odoo Customization & Module Development | Tenxora",
    label: "Change with a reason",
    h1: "Odoo Customization with Human-Reviewed Delivery",
    lead: "Solve a workflow gap without adding needless complexity.",
    body: "Odoo customization adapts an agreed part of Odoo to a business requirement. We first check whether standard settings and workflows are sufficient, then assess Studio or custom code where appropriate. The proposal defines the change, supported environment, tests and maintenance responsibilities.",
    actions: [{ label: "Discuss a custom workflow →", href: contact }, book],
    sections: [
      T("Configuration, Studio or a custom module?", {
        subs: [
          { heading: "Start with configuration", body: "Review existing settings, permissions and standard process choices. A documented operating change may solve the problem without introducing a new code dependency." },
          { heading: "Choose the right extension", body: "Studio can change items such as fields, views and rules without conventional module coding. A custom module may be considered for an evidenced gap requiring code, on a compatible hosting environment." },
        ],
        after: "For example, adding a required reference field and defining a cross-system approval rule are different requirements. We document the expected behaviour before choosing the tool. This is an illustrative scoping example, not a claim of a delivered customer project.",
      }),
      T("Can custom code run on Odoo Online?", {
        body: "Odoo’s documentation states that Odoo Online does not support custom modules or Odoo Apps Store modules. We assess hosting and deployment options before proposing code. Odoo.sh or an appropriately managed self-hosted environment may be considered, subject to edition, version, module and operating requirements; changing hosting is a separate decision.",
      }),
      T("Does Studio change the subscription cost?", {
        body: "It can. Odoo documents that installing Studio on a Standard-plan database triggers an upsell to Custom. We check the relevant subscription implications with you before choosing Studio; we do not install paid capabilities as an unapproved shortcut.",
      }),
      {
        kind: "steps",
        heading: "What is the delivery process?",
        plain: true,
        items: [
          { n: "01", heading: "Define the gap:", body: "describe the current behaviour, desired result, users, permissions and acceptance scenarios." },
          { n: "02", heading: "Choose an approach:", body: "compare standard configuration, Studio and module development, including hosting and maintenance implications." },
          { n: "03", heading: "Prepare and review:", body: "make the agreed change in a separate environment, with human review of code or configuration and its access effects." },
          { n: "04", heading: "Test:", body: "check the intended workflow and relevant existing behaviour, with customer user acceptance." },
          { n: "05", heading: "Release and hand over:", body: "approve production changes, document the result and agree support and future compatibility checks." },
        ],
      },
      T("What should be in the handover?", {
        body: "A scope can include a requirement specification, configuration or source changes, test evidence, deployment notes and user guidance. Where code is commissioned, the proposal identifies source delivery, licensing and ownership terms. Third-party module fees, broad process redesign, version upgrades and ongoing support are separate unless included.",
      }),
      T("Will the change survive every future upgrade?", {
        body: "Compatibility needs assessment and testing for the target version. No custom change is promised to remain compatible indefinitely without review. The design should make dependencies and future maintenance costs visible before approval.",
      }),
      aiHuman,
      {
        kind: "feature",
        heading: "Explore the AI-assisted approach",
        cta: { label: "Explore discovery and sign-up options on the Odoo portal →", href: portal },
        body: "Portal access is a separate product journey. It does not by itself authorize custom work or production deployment.",
      },
      partnerAttributed,
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
        note: refsNote,
      },
    ],
  },

  "implementation-cost": {
    slug: "implementation-cost",
    title: "Odoo Implementation Cost & Scope | Tenxora",
    label: "Budget from an agreed scope",
    h1: "What Determines Odoo Implementation Cost",
    lead: "Understand the scope and separate costs before comparing quotes.",
    body: "Odoo implementation cost depends on the workflows, data, integrations, custom changes and user support included in the project. We estimate against an agreed scope and separate implementation services from Odoo licences, hosting, third-party tools and ongoing support. There is no published universal rollout price.",
    actions: [{ label: "Request a scoped implementation estimate →", href: contact }, book],
    sections: [
      T("What costs should you separate?", {
        subs: [
          { heading: "Software and infrastructure", body: "Odoo subscription or edition costs, hosting and operating responsibilities, third-party modules and connected-service subscriptions. The applicable options depend on the environment and features you need." },
          { heading: "Delivery and continued operation", body: "Discovery, configuration, data migration, integrations, custom development, testing, training and handover. Support, monitoring and later changes should have an explicit scope rather than being hidden inside a launch estimate." },
        ],
      }),
      T("Which requirements change the estimate?", {
        list: [
          "**Workflow complexity:** exceptions, approval paths and the number of processes or entities included.",
          `**Data quality and history:** [data migration preparation and checks](${S}migration/), including cleaning, mapping, trial loads and reconciliation, not just file size.`,
          "**Interfaces:** the number and behaviour of data flows, authentication, retries and monitoring.",
          "**Custom changes:** the difference between settings, Studio and code, plus future maintenance.",
          "**People and rollout:** roles, training, customer availability, phased release and acceptance needs.",
        ],
      }),
      T("What do we need to prepare an estimate?", {
        body: "Tell us your Odoo version or proposed edition, hosting, team size, main workflow, source systems, required integrations and intended launch constraints. Identify who can approve requirements and test results. We may request a representative data sample through an agreed secure route. Please do not send passwords or confidential production records through the enquiry form.",
      }),
      T("What should the proposal make clear?", {
        body: `Compare proposals against the same [Odoo implementation scope](${S}implementation/): workflows, records to move, interfaces, testing, training and handover. Ask which items are included, optional or excluded, who supplies the inputs and how acceptance is decided. Commercial terms and timing are agreed for the actual engagement. A new requirement can change cost and delivery sequencing; agree how it will be assessed and priced before work proceeds.`,
      }),
      {
        kind: "offer",
        heading: "A defined planning option: US$299 one-time",
        body: `The [Odoo Workflow Review & Blueprint](${S}consulting/#workflow-review-blueprint) covers one business workflow: a discovery workshop, human-reviewed written blueprint, prioritized implementation plan, handover and one clarification round.\n\nImplementation, Odoo licences and hosting are quoted separately. Additional work needs a separate agreement. This is the price of the defined review, not a price for implementing Odoo.\n\nSession length and delivery timing are agreed after the introductory call, based on the scope and complexity of your workflow.`,
        cta: { label: "Request the $299 workflow review →", href: contact },
      },
      T("Are Odoo licence prices included in this page?", {
        body: "No changing subscription rates are copied into an implementation estimate here. Check [Odoo’s current pricing](https://www.odoo.com/pricing-plan) for software plans, then confirm the plan, hosting and feature requirements for your project. External API access and Studio can affect which plan is needed; the technical references below explain those dependencies.",
      }),
      T("Does a portal trial include an implementation?", {
        body: `No. [Explore current discovery and sign-up options on the Odoo portal](${portal}). Portal terms and service proposals are separate; signup does not establish a paid implementation, checkout readiness or permission for production changes.`,
      }),
      aiHuman,
      partnerAttributed,
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
        note: refsNote,
      },
    ],
  },
};

export const contactPage: Doc = {
  slug: "contactus",
  title: "Contact Tenxora | Odoo Consulting & Implementation",
  label: "Start a conversation",
  h1: "Let’s improve the way your business works.",
  lead: "Tell us about your Odoo project or the workflow holding your team back.",
  sections: [
    {
      kind: "feature",
      heading: "Prefer a conversation?",
      body: "Book a free 15-minute Odoo introduction on Google Meet. Monday–Friday, 1–6pm Pakistan time.",
      cta: { label: "Book a 15-minute call →", href: bookHref },
    },
    {
      kind: "feature",
      heading: "What would you like to change?",
      body: `Share a short description of your current setup, your main challenge and the outcome you want. We will review your enquiry and discuss a suitable next step.\n\nPrefer email? ${mail}`,
    },
    T("What happens next", {
      level: 3,
      ordered: true,
      list: ["We review your message.", "We clarify your requirements and fit.", "We agree scope before starting work."],
      after: "Submitting this form requests a conversation. It does not book an appointment or commit you to a paid service.",
    }),
    { kind: "form" },
  ],
};

// Contact form labels, word for word. On WordPress the live form (the tenxora_contact shortcode) replaces this one.
export const contactForm = {
  required: "Fields marked * are required.",
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

const calendly = "https://calendly.com/contact-tenxora/odoo-introduction";
export const bookPage: Doc = {
  slug: "book-a-call",
  title: "Book an Odoo Introduction | Tenxora",
  label: "Your next step with Odoo",
  h1: "Book a call",
  sections: [
    {
      kind: "badges",
      heading: "A short conversation.\nA clearer way forward.",
      body: "Tell us about your Odoo goals and the workflow you want to improve. We’ll use this free introduction to understand the fit and agree on a useful next step.",
      badges: ["15-minute intro", "Google Meet", "No charge"],
    },
    T("Bring one workflow.", {
      body: "A quick overview of your business, your current Odoo setup and the challenge you’d like to solve is enough. Detailed consulting and implementation are scoped separately.",
    }),
    T("Choose a time that fits.", {
      body: "Monday–Friday, 1–6pm Pakistan time (Asia/Karachi), with a 15-minute break between calls. The calendar shows times in your selected timezone. Please book at least 24 hours ahead.",
    }),
    {
      kind: "embed",
      heading: "Choose your 15-minute introduction",
      body: "Select a date and time below. You’ll receive a calendar invitation with Google Meet details and links to cancel or reschedule.",
      src: calendly,
      title: "Book your Odoo introduction with Tenxora",
      fallbackLead: "Calendar not loading?",
      fallback: { label: "Open the booking calendar in a new tab ↗", href: calendly },
    },
    {
      kind: "feature",
      heading: "Prefer to start with a message?",
      body: `[Send a project enquiry](${contact}) or email ${mail}.`,
    },
    {
      kind: "note",
      body: "Scheduling is provided by Calendly and connected to our Google calendar. Please share only the information needed to arrange your call; leave passwords and sensitive business records out of booking notes. See our [privacy policy](https://tenxora.services/privacy/) and [Calendly’s privacy notice](https://calendly.com/legal/privacy-notice).",
    },
  ],
};

export const privacyPage: Doc = {
  slug: "privacy",
  title: "Privacy Policy | Tenxora",
  label: "Website enquiries & privacy",
  h1: "Privacy policy",
  body: "This policy describes the enquiry form and public marketing website for Tenxora.Services. Updated 14 November 2026.",
  sections: [
    T("Information you choose to share", {
      body: "The contact form collects your name, email address, optional company name, area of interest and message. We use this information to assess and respond to your enquiry and discuss requested services. Do not submit passwords, payment details or sensitive personal information.",
    }),
    T("Where enquiries go", {
      body: `Your message is stored in the website’s restricted administration area and a notification is sent to ${mail}. Website hosting, security and email providers process information needed to operate these functions. Enquiry information is not published on the website.`,
    }),
    T("Technical information", {
      body: "The hosting and security services may process request information such as IP addresses, browser details and access times for operation and abuse prevention. The form uses a temporary hashed network identifier to limit repeated submissions.",
    }),
    T("AI and service delivery", {
      body: "Our services use AI and code for initial work, with human review. The website contact form itself does not send your message to an AI service. Any additional handling needed for a service engagement should be agreed as part of that engagement.",
    }),
    T("Cookies and external resources", {
      body: "See our [cookie policy](https://tenxora.services/cookie-policy/) for website functionality and external resources. Links to third-party websites are subject to those providers’ own practices.",
    }),
    T("Retention and requests", {
      body: `We keep enquiry information while it is needed to respond, manage the resulting relationship or meet applicable recordkeeping obligations. Contact ${mail} to ask about your information, request a correction or request deletion. Some records may need to be retained where required by law or an active service relationship.`,
    }),
    T("Scope of this policy", {
      body: "Separate product portals and service engagements may have additional terms and privacy information. Contact us if you need clarification before sharing information.",
    }),
    T("Optional website analytics", {
      body: "With your agreement, Google Analytics measures visits to public pages on tenxora.services, including basic page, device and approximate location information. Google receives technical connection information when Analytics loads. We exclude logged-in visitors, private routes and links with sensitive newsletter or authentication query keys. Reported page and referrer URLs omit query values. We do not send contact form values or newsletter details. Google Signals and advertising personalization are off. You can withdraw through the [Cookie Policy](https://tenxora.services/cookie-policy/). For Google’s handling of data, see [Google’s Privacy Policy](https://policies.google.com/privacy).",
    }),
  ],
};

export const cookiePage: Doc = {
  slug: "cookie-policy",
  title: "Cookie Policy | Tenxora",
  label: "How this website works",
  h1: "Cookie policy",
  updated: "Updated 14 November 2026.",
  sections: [
    T("Website functionality", {
      body: "WordPress uses cookies for signed-in administrators. Hosting and security services may use cookies or similar mechanisms to protect the website and check browser requests. These functions support administration, security and operation.",
    }),
    T("Marketing and analytics", {
      body: "Optional Google Analytics helps us understand visits to public pages after you choose “I agree”. “Only essentials” keeps Analytics off. Advertising personalization and Google Signals are disabled. Analytics cookies (_ga and _ga_*) can last up to two years. We do not track enquiry fields, newsletter preferences, bookings or signed links. Analytics is not enabled on our other portals.",
    }),
    T("External resources and links", {
      body: "The design loads fonts and other visual resources. External providers can receive technical request information when their resources load. Clicking a social media or other external link takes you to a separate website with its own cookie and privacy practices.",
    }),
    T("Your choices", {
      body: `You can manage or delete cookies in your browser settings. Blocking necessary cookies may affect sign-in or security checks. For privacy questions, email ${mail} or see our [privacy policy](https://tenxora.services/privacy/).`,
    }),
    T("Your Analytics choice", {
      body: "[Change cookie choices](https://tenxora.services/#cookie-choices) to agree or withdraw consent on this device. Withdrawing stops further Analytics collection and removes this site’s Analytics cookies. Data already sent cannot be recalled through this control. Browser cookie controls remain available.",
    }),
  ],
};

// ===== For Partners =====
const P = "https://tenxora.services/partners/";
const plans = [
  { name: "Starter block", price: "$1,000/month", hours: "40 hours", extra: "Extra hours: $25/hour.", desc: "Shared delivery pool for overflow and support tickets.", cta: { label: "Start now", href: `${P}pricing/?partner_plan=starter#checkout` } },
  { name: "Delivery pod", price: "$2,200/month", hours: "100 hours", extra: "Extra hours: $22/hour.", desc: "Functional and technical consultant capacity for ongoing projects.", cta: { label: "Start now", href: `${P}pricing/?partner_plan=pod#checkout` } },
  { name: "Dedicated consultant", price: "$2,900/month", hours: "160 hours", extra: "Extra hours: $18/hour.", desc: "One named consultant for a long implementation.", cta: { label: "Start now", href: `${P}pricing/?partner_plan=dedicated#checkout` } },
];
const consent = { before: "I have read the ", link: { label: "privacy policy", href: "https://tenxora.services/privacy/" }, after: " and understand that Tenxora will use my details to respond to this enquiry. *" };

export const partnersPage: Doc = {
  slug: "partners",
  title: "White-label Odoo Development for Partners | Tenxora",
  label: "White-label Odoo delivery for partners",
  h1: "White-label Odoo delivery for partners",
  lead: "Your Odoo backlog, delivered under your brand.",
  body: "Functional and technical delivery capacity for Odoo partners and agencies in the UK, EU and Gulf. AI and code prepare initial work; people review it. You sell, we build, and you keep the client relationship.",
  actions: [
    { label: "Choose your plan", href: `${P}#pricing` },
    { label: "See pricing", href: `${P}#pricing` },
  ],
  note: "From $1,000/month for 40 hours. Delivery from Islamabad, Pakistan. Contracting and invoicing through TENXORA LTD, UK company no. 17163494.",
  sections: [
    T("Keep client work moving", {
      list: [
        "Take on work when your existing team is already committed.",
        "Add delivery capacity without recruiting for every backlog.",
        "Give ERP tickets a defined scope, review and handover.",
      ],
    }),
    {
      kind: "steps",
      heading: "Hire delivery capacity for your next project",
      plain: true,
      items: [
        { n: "01", heading: "Choose your plan.", body: "Pick a monthly block and tell us about your project, backlog and preferred start date." },
        { n: "02", heading: "Confirm the engagement.", body: "We agree scope, availability, service terms and payment arrangements before work begins." },
        { n: "03", heading: "Keep your workflow.", body: "Send work through your agreed tools: Jira, Slack, email or your Odoo.sh project. We deliver to staging with notes; you review and release." },
        { n: "04", heading: "Adjust as work changes.", body: "After the three-month minimum, discuss a different block for your next phase. The service continues month to month, with 30 days’ notice to end it." },
      ],
    },
    T("Hand over the delivery work", {
      list: [
        "Functional configuration for Accounting, Inventory, Sales, Purchase, Manufacturing, HR/Payroll and CRM, within an agreed scope.",
        "Custom modules and changes to existing modules.",
        "Reports and QWeb/PDF templates.",
        "Integrations, APIs and data migration.",
        "Version upgrades and post-go-live support tickets.",
      ],
      after:
        "We assess the ticket against your Odoo version, edition, hosting and localization requirements before agreeing scope. Hosting compatibility is confirmed for your edition and ticket before work starts.\n\nFor Odoo Online, work must fit the platform’s hosting limits. Custom server modules need a compatible hosting setup. See [Odoo’s hosting guidance](https://www.odoo.com/documentation/18.0/administration/odoo_sh/getting_started/create.html).\n\nAccounting means Odoo configuration and workflow work. This offer does not include outsourced accounting services.",
    }),
    {
      kind: "plans",
      id: "pricing",
      heading: "Choose your monthly capacity",
      plans,
      links: [
        { label: "Compare all plans", href: `${P}pricing/` },
        { label: "Terms and refund policy", href: `${P}terms/#refunds` },
      ],
      after:
        "Billed monthly in advance in USD. Three-month minimum, then month to month with 30 days’ notice. Unused hours roll over for one month, then expire. NDA and white-label delivery as standard. Invoiced by TENXORA LTD (UK).\n\nChoose a plan and complete secure checkout to reserve your monthly delivery capacity. We confirm scope, team availability and your start date before delivery begins. Have questions first? Send a hiring enquiry below.",
    },
    {
      kind: "pform",
      id: "engagement",
      heading: "Start your engagement",
      body: "Tell us your company, contact details, preferred plan and the work you want to hand over. Include your Odoo version, hosting and preferred start date so we can assess scope and availability.\n\nWe sign an NDA before client data is shared. Leave out client records, passwords, access tokens and confidential attachments. Any repository or staging link must be non-secret; access is arranged privately.",
      fieldsNote: "Fields marked * are required. Leave out client records, passwords and access tokens.",
      fields: [
        { label: "Name *", required: true },
        { label: "Company *", required: true },
        { label: "Work email *", type: "email", required: true },
        { label: "Country *", required: true },
        { label: "Odoo version *", required: true },
        { label: "Monthly plan *", type: "select", required: true, options: ["Choose a plan", "Starter block — 40 hours, $1,000/month", "Delivery pod — 100 hours, $2,200/month", "Dedicated consultant — 160 hours, $2,900/month"] },
        { label: "Hosting *", type: "select", required: true, options: ["Choose hosting", "Odoo.sh", "Odoo Online", "On-premise"] },
        { label: "Engagement scope *", type: "textarea", required: true, options: ["20–5,000 characters. A non-confidential summary only. We arrange access privately after the NDA."] },
        { label: "Non-secret repository or staging URL (optional)", type: "url", options: ["No sign-in details, signed access links, query parameters or fragments. Do not upload files or send credentials."] },
      ],
      consent,
      submit: "Send hiring enquiry",
      note: `Prefer to speak first? [Book an introduction](${bookHref}).`,
    },
    T("Keep your client relationship", {
      list: [
        "**UK contracting.** Contracts and invoices come from TENXORA LTD (UK, company no. 17163494).",
        "**White-label as standard.** We sign an NDA and contact your client only when you ask us to.",
        "**Human review.** AI and code prepare initial work; a person checks changes before handover for your review.",
        "**Your release decision.** You review the staging work and notes before deciding what reaches your client.",
      ],
    }),
    {
      kind: "faq",
      heading: "Questions before you start",
      items: [
        { q: "Who owns the code?", a: "Custom deliverables are assigned to you or your client after payment under the agreed terms. Odoo, third-party modules and pre-existing code retain their applicable licences." },
        { q: "Do you speak to our client?", a: "Only if you ask us to. You remain the client’s primary contact." },
        { q: "What if we don’t use all our hours?", a: "Unused hours roll over for one month, then expire. We agree the billing-period and rollover details in your written terms before you order." },
        { q: "What if we need more hours?", a: "Extra hours are billed separately at $25/hour for Starter block, $22/hour for Delivery pod and $18/hour for Dedicated consultant." },
        { q: "What is the minimum commitment?", a: "Three months, then month to month with 30 days’ notice." },
        { q: "How do we pay?", a: "Monthly in advance in USD, by card or an agreed bank-transfer method. We confirm payment arrangements before you order." },
        { q: "How quickly do you respond?", a: "We agree support hours, response targets and escalation arrangements for your engagement before work starts." },
      ],
    },
    {
      kind: "actions",
      heading: "Put delivery capacity behind your next project",
      body: "Choose the monthly block that fits your work. We’ll confirm the scope, team availability, agreement and payment arrangements before starting.",
      actions: [
        { label: "Choose your plan", href: `${P}#pricing` },
        { label: "Start your engagement", href: `${P}#engagement` },
      ],
    },
  ],
};

export const partnersPricingPage: Doc = {
  slug: "partners/pricing",
  title: "Odoo Partner Delivery Pricing | Tenxora",
  h1: "Odoo partner delivery pricing",
  lead: "Odoo delivery capacity, with a clear monthly price.",
  body: "Choose a monthly block for white-label functional and technical work. Your team owns the client relationship, reviews the work and controls release.",
  sections: [
    {
      kind: "plans",
      heading: "Choose the hours you need",
      plans: [
        { name: "Starter block", price: "$1,000/month", hours: "40 hours", extra: "", desc: "Shared pool. For overflow and support tickets.", cta: { label: "Start now", href: "#checkout" } },
        { name: "Delivery pod", price: "$2,200/month", hours: "100 hours", extra: "", desc: "Functional + technical consultant. For ongoing projects.", cta: { label: "Start now", href: "#checkout" } },
        { name: "Dedicated consultant", price: "$2,900/month", hours: "160 hours", extra: "", desc: "One named consultant. For a long implementation.", cta: { label: "Start now", href: "#checkout" } },
      ],
      links: [{ label: "Talk to us first", href: bookHref }],
    },
    {
      kind: "table",
      heading: "Compare the plans",
      caption: "Partner delivery plans — monthly prices in USD",
      head: ["Plan detail", "Starter block", "Delivery pod", "Dedicated consultant"],
      rows: [
        ["Monthly price", "$1,000", "$2,200", "$2,900"],
        ["Included hours", "40", "100", "160"],
        ["Team", "Shared pool", "Functional + technical consultant", "One named consultant"],
        ["Best for", "Overflow and support tickets", "Ongoing projects", "A long implementation"],
        ["Extra hours", "$25/hour", "$22/hour", "$18/hour"],
      ],
    },
    T("Know the commitment", {
      body: `Billed monthly in advance in USD. Three-month minimum, then month to month with 30 days’ notice. Unused hours roll over for one month, then expire. NDA and white-label delivery as standard. Invoiced by TENXORA LTD (UK, company no. 17163494).\n\n[Read the partner terms](${P}terms/). All services are paid. Completed work remains payable. See our cancellation and refund policy in the partner terms.`,
    }),
    {
      kind: "faq",
      heading: "Billing questions",
      items: [
        { q: "What if we don’t use all our hours?", a: "Unused hours roll over for one month, then expire." },
        { q: "What if we need more hours?", a: "Extra hours are billed separately at $25/hour for Starter block, $22/hour for Delivery pod and $18/hour for Dedicated consultant." },
        { q: "What is the minimum commitment?", a: "Three months, then month to month with 30 days’ notice." },
        { q: "How do we pay?", a: "Monthly in advance in USD through secure checkout." },
        { q: "Can we cancel or receive a refund?", a: `After the three-month minimum, cancel with 30 days’ written notice. Work performed and services already provided remain payable. [Read the cancellation and refund policy](${P}terms/#refunds).` },
      ],
    },
    {
      kind: "pform",
      id: "checkout",
      heading: "Start your engagement",
      body: "Choose your monthly plan and complete checkout. We will confirm your scope, tools and start date before delivery begins.",
      fields: [{ label: "Your monthly plan", type: "select", required: true, options: ["Choose a plan", "Starter block — $1,000/month · 40 hours", "Delivery pod — $2,200/month · 100 hours", "Dedicated consultant — $2,900/month · 160 hours"] }],
      consent: {
        before: "I am purchasing for my business and agree to the ",
        link: { label: "partner terms and refund policy", href: `${P}terms/` },
        after: ", including monthly billing, the three-month minimum and payment for work performed.",
      },
      submit: "Continue to secure checkout",
      note: "Payment is taken only when you complete secure Stripe checkout. [Privacy policy](https://tenxora.services/privacy/)",
      links: [{ label: "Talk to us first", href: bookHref }],
    },
  ],
};

export const partnersTermsPage: Doc = {
  slug: "partners/terms",
  title: "Partner Delivery Terms | Tenxora",
  label: "Partner service terms and refund policy",
  h1: "Partner delivery terms",
  body: `Effective 17 November 2026. These terms apply to business purchases of Tenxora’s white-label Odoo partner delivery services. The supplier is TENXORA LTD, UK company no. 17163494. Business address: 124 City Road, London EC1V 2NX, United Kingdom. Delivery is from Islamabad, Pakistan. Contact: ${mail}.`,
  sections: [
    T("Your monthly plan", {
      list: [
        "**Starter block:** $1,000 per month for 40 hours. Extra hours: $25 per hour.",
        "**Delivery pod:** $2,200 per month for 100 hours. Extra hours: $22 per hour.",
        "**Dedicated consultant:** $2,900 per month for 160 hours. Extra hours: $18 per hour.",
      ],
      after:
        "All amounts are in USD. Monthly fees are charged in advance. Extra hours require your approval and are invoiced separately. The amount payable is shown before you complete checkout.\n\nThere is no free service or free delivery trial. All agreed services and work performed must be paid for. A separately offered free introductory call does not include delivery work.",
    }),
    T("Minimum term and renewal", {
      body: `The minimum commitment is three months, billed monthly. After that, your service continues month to month until ended with 30 days’ written notice to ${mail}. Cancelling a payment method does not cancel the agreement or remove amounts properly due.\n\nWe confirm your delivery scope, tools, availability and start date with you. If we cannot accept your engagement or provide the agreed capacity, we refund the corresponding advance payment for services not provided.`,
    }),
    T("Hours and delivery", {
      body: "Monthly fees reserve the agreed delivery capacity. Unused included hours roll over for one month and then expire; they have no cash value and are not automatically refunded when you choose not to use available capacity. We agree scheduling and changes to your plan in writing.\n\nYou provide clear requirements and timely access and feedback. We prepare work in staging with handover notes. You review the deliverables and control release to your client or production system. Additional scope is agreed before it is charged.",
    }),
    T("Cancellation and refunds", {
      id: "refunds",
      body: `Work performed and services already provided remain payable. This includes authorised configuration, development, consultancy, investigation, support and agreed preparation completed before cancellation. Ending the engagement does not make completed work free.\n\nMonthly capacity already made available is not refundable solely because you change your mind, stop a project, delay providing access or do not use all your hours. The three-month minimum and notice period continue to apply, subject to any remedy required by law or separately agreed in writing.\n\nIf Tenxora cannot provide an agreed service, we will first discuss a reasonable correction or replacement delivery arrangement. If the service cannot be provided, we will refund the relevant prepaid amount for the service not provided. Duplicate payments and confirmed billing errors are corrected or refunded. This does not remove your right to remedies for defective or misdescribed services.\n\nTo request cancellation, raise a delivery concern or request a refund, email ${mail} with your company, invoice or payment reference and the reason. We review the agreed scope, delivery records and amounts paid. Approved refunds are returned to the original payment method; bank and payment-provider processing times apply.\n\nNothing in these terms excludes or restricts rights or remedies that cannot lawfully be excluded. If mandatory consumer protections apply to a purchase, those protections take precedence.`,
    }),
    T("White-label delivery and ownership", {
      body: "We work under your brand. You keep the client relationship, and we contact your client only when you ask us to. An NDA is signed before client data is shared. Do not send passwords, access tokens or client records through public forms; secure access is arranged separately.\n\nCustom deliverables belong to you or your client once paid for, subject to the agreed scope. Odoo, third-party software and pre-existing components retain their applicable licences. AI and code may assist preparation; people review the deliverables.",
    }),
    T("Checkout and payment records", {
      body: "On tenxora.services, we record your chosen plan, the terms version you accept, a checkout reference and any campaign identifiers before sending you to Stripe. This record does not confirm payment. Stripe collects payment and billing details; we receive the information needed to administer your engagement, reconcile payments and keep business records. See our [website privacy policy](https://tenxora.services/privacy/) and [Stripe’s privacy policy](https://stripe.com/privacy). Do not send card details through the website enquiry form.",
    }),
    T("Agreeing your engagement", {
      body: "By accepting these terms at checkout, you confirm you are authorised to purchase for your business and accept the selected plan, recurring monthly charges, minimum commitment and cancellation and refund policy. A signed service agreement or statement of work may add project-specific terms. Any agreed changes must be recorded in writing.",
    }),
    { kind: "note", body: `Questions about your engagement or a payment? Email ${mail}.` },
  ],
};
