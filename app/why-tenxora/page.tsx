import type { Metadata } from "next";
import Header from "@/components/Header";
import WhyTenxora from "@/components/WhyTenxora";
import CookieBanner from "@/components/CookieBanner";
import { why } from "@/lib/pages";

export const metadata: Metadata = {
  title: why.title,
};

export default function Page() {
  return (
    <>
      <a href="#wrap" className="skip-link">
        Skip to Content
      </a>
      <Header />
      <main id="wrap">
        <WhyTenxora />
      </main>
      <CookieBanner />
    </>
  );
}
