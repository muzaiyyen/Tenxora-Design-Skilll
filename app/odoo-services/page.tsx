import type { Metadata } from "next";
import Header from "@/components/Header";
import OdooServices from "@/components/OdooServices";
import CookieBanner from "@/components/CookieBanner";
import { odooServices } from "@/lib/pages";

export const metadata: Metadata = {
  title: odooServices.title,
};

export default function Page() {
  return (
    <>
      <a href="#wrap" className="skip-link">
        Skip to Content
      </a>
      <Header />
      <main id="wrap">
        <OdooServices />
      </main>
      <CookieBanner />
    </>
  );
}
