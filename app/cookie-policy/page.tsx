import type { Metadata } from "next";
import Header from "@/components/Header";
import DocPage from "@/components/DocPage";
import CookieBanner from "@/components/CookieBanner";
import { cookiePage } from "@/lib/docs";

export const metadata: Metadata = { title: cookiePage.title };

export default function Page() {
  return (
    <>
      <a href="#wrap" className="skip-link">
        Skip to Content
      </a>
      <Header />
      <main id="wrap">
        <DocPage doc={cookiePage} />
      </main>
      <CookieBanner />
    </>
  );
}
