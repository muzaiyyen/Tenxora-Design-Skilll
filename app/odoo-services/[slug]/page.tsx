import type { Metadata } from "next";
import Header from "@/components/Header";
import DocPage from "@/components/DocPage";
import CookieBanner from "@/components/CookieBanner";
import { services } from "@/lib/docs";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: services[slug].title };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <>
      <a href="#wrap" className="skip-link">
        Skip to Content
      </a>
      <Header />
      <main id="wrap">
        <DocPage doc={services[slug]} />
      </main>
      <CookieBanner />
    </>
  );
}
