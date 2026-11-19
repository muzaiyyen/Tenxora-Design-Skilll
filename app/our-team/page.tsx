import type { Metadata } from "next";
import Header from "@/components/Header";
import Team from "@/components/Team";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "Our Team | Tenxora",
};

export default function OurTeam() {
  return (
    <>
      <Header />
      <main id="wrap">
        <Team />
      </main>
      <CookieBanner />
    </>
  );
}
