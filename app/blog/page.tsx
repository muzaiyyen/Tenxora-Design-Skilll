import type { Metadata } from "next";
import Header from "@/components/Header";
import Blog from "@/components/Blog";
import CookieBanner from "@/components/CookieBanner";
import { blog } from "@/lib/pages";

export const metadata: Metadata = {
  title: blog.title,
};

export default function Page() {
  return (
    <>
      <a href="#wrap" className="skip-link">
        Skip to Content
      </a>
      <Header />
      <main id="wrap">
        <Blog />
      </main>
      <CookieBanner />
    </>
  );
}
