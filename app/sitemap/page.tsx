import type { Metadata } from "next";
import Header from "@/components/Header";
import SitemapPage from "@/components/SitemapPage";
import CookieBanner from "@/components/CookieBanner";
import { sitemapPage } from "@/lib/pages";

export const metadata: Metadata = {
  title: sitemapPage.title,
};

export default function Page() {
  return (
    <>
      <a href="#wrap" className="skip-link">
        Skip to Content
      </a>
      <Header />
      <main id="wrap">
        <SitemapPage />
      </main>
      <CookieBanner />
    </>
  );
}
