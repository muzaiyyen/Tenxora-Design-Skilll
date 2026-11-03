// Our Team page copy, from the Figma "Our Team" frames (2026-11-02). Bilal and Ahsan have profiles;
// the other cards are the Figma placeholders and don't open.

export type Member = {
  id: string;
  first: string;
  last: string;
  role: string;
  profile?: {
    intro: string;
    points: string[];
    workedWith: string;
    // studio photo (1679x1085) and where the card's portrait window sits in it (fractions of the photo);
    // focus = how far across the photo the person stands and phoneTop = how far it shifts down (share of its
    // height), for the phone crop; card = optional sharp overlay
    photo: { scene: string; card?: string; left: number; top: number; focus: number; phoneTop?: number; bg: string };
    // Bilal: logos at their Figma spots on the 1679px profile frame (x, y, width).
    // Others: no spot given, so the list wraps in a row under "Worked With"; a name without a logo
    // file shows as text until we have its logo.
    clients: { name: string; logo?: string; x?: number; y?: number; w?: number }[];
  };
};

export const team: Member[] = [
  {
    id: "bilal",
    first: "Bilal",
    last: "Mashkoor",
    role: "Founder & CEO",
    profile: {
      intro:
        "I’m Bilal Mashkoor, CEO of Tenxora. We’re a UK technology and business solutions firm with our delivery centre in Islamabad. I help companies streamline their operations through ERP, automation, AI and specialist teams, so they can grow without friction.",
      points: [
        "11+ years in tech & business transformation",
        "Leading teams across London & Islamabad",
        "Clients in 8+ industries",
        "ERP · Automation · Team Augmentation",
      ],
      workedWith: "Worked With",
      photo: { scene: "/figma/bilal-scene.jpg", card: "/figma/bilal-card.png", left: 0.53906, top: 0.12236, focus: 0.675, bg: "#ebe0d1" },
      clients: [
        { name: "MobilinkBank", logo: "mobilink-bank", x: 287, y: 773.63, w: 28.71 },
        { name: "Norsk Global", logo: "norsk-global", x: 344.44, y: 773.63, w: 84.47 },
        { name: "Symmetric Energy", logo: "symmetric-energy", x: 457.64, y: 773.63, w: 51.6 },
        { name: "Novacare", logo: "novacare", x: 537.71, y: 773.63, w: 130.29 },
        { name: "Impetus", logo: "impetus", x: 287.87, y: 825.86, w: 77.52 },
        { name: "Machine Sens IoT", logo: "machine-sens-iot", x: 398.4, y: 826, w: 73.64 },
        { name: "henri", logo: "henri", x: 505, y: 826, w: 88.7 },
      ],
    },
  },
  {
    id: "ahsan",
    first: "Ahsan",
    last: "Mahmood",
    role: "CFO",
    profile: {
      intro:
        "I’m Ahsan Mahmood, Director at Tenxora. I help businesses build finance functions that actually work, moving them from spreadsheet chaos to structured, automated, insight-driven operations. I’ve spent 15+ years as both the auditor and the CFO, so I know where finance breaks and how to fix it.",
      points: [
        "15+ years in finance & transformation",
        "Started at PwC · ICAEW",
        "Led programmes across UK, Pakistan & Africa",
        "ERP · CFO Advisory · Finance Transformation",
      ],
      workedWith: "Worked With",
      photo: { scene: "/figma/ahsan-scene.jpg", left: 0.596, top: 0.08, focus: 0.68, phoneTop: 0.045, bg: "#f6f4f5" },
      clients: [
        { name: "PwC", logo: "pwc" },
        { name: "IMC Worldwide" },
        { name: "DFID" },
        { name: "OGDCL" },
        { name: "Jazz", logo: "jazz" },
        { name: "Attock Gen" },
        { name: "Pakistan Oilfields" },
        { name: "TNB Liberty Power" },
      ],
    },
  },
  { id: "muzaiyyen", first: "Muzaiyyen", last: "Khan", role: "Creative Lead" },
  { id: "zain", first: "Zain", last: "Ali", role: "Accountant" },
  { id: "maryam", first: "Maryam", last: "Hameed", role: "Odoo Developer" },
];
