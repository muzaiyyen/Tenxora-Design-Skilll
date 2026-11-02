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
  };
};

export const team: Member[] = [
  {
    id: "bilal",
    first: "Bilal",
    last: "Mashkoor",
    role: "CEO",
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
    },
  },
  { id: "ahsan", first: "Ahsan", last: "Mahmood", role: "CFO" },
  { id: "muzaiyyen", first: "Muzaiyyen", last: "Khan", role: "Creative Lead" },
  { id: "zain", first: "Zain", last: "Ali", role: "Accountant" },
  { id: "maryam", first: "Maryam", last: "Hameed", role: "Odoo Developer" },
];
