// Our Team page copy, from the Figma "Our Team" frames (2026-11-02). Only Bilal has a profile so far;
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
    // logos at their Figma spots on the 1679px profile frame (x, y, width)
    clients: { name: string; logo: string; x: number; y: number; w: number }[];
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
  { id: "ahsan", first: "Ahsan", last: "Mahmood", role: "CFO" },
  { id: "muzaiyyen", first: "Muzaiyyen", last: "Khan", role: "Creative Lead" },
  { id: "zain", first: "Zain", last: "Ali", role: "Accountant" },
  { id: "maryam", first: "Maryam", last: "Hameed", role: "Odoo Developer" },
];
