import type { Metadata } from "next";
import Header from "@/components/Header";
import Article from "@/components/Article";
import CookieBanner from "@/components/CookieBanner";
import { articles, blog, slugOf } from "@/lib/pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blog.posts.find((p) => slugOf(p.href) === slug);
  return { title: `${post?.title} | Tenxora` };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <>
      <a href="#wrap" className="skip-link">
        Skip to Content
      </a>
      <Header />
      <main id="wrap">
        <Article slug={slug} />
      </main>
      <CookieBanner />
    </>
  );
}
