import Header from "@/components/Header";
import Hero from "@/components/Hero";
import OperationsMap from "@/components/OperationsMap";
import BeforeWith from "@/components/BeforeWith";
import Problem from "@/components/Problem";
import Framework from "@/components/Framework";
import Capabilities from "@/components/Capabilities";
import Audit from "@/components/Audit";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <>
      <a href="#wrap" className="skip-link">
        Skip to Content
      </a>
      <Preloader />
      <Header />
      <main id="wrap">
        <Hero />
        <OperationsMap />
        <BeforeWith />
        <Problem />
        <Framework />
        <Capabilities />
        <Audit />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
