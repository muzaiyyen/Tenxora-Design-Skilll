import { footer as c } from "@/lib/content";
import { Icon, Logo, Roll } from "./ui";

export default function Footer() {
  return (
    <footer className="on-dark bg-black pb-32 pt-20 text-white md:pb-28 md:pt-28">
      <div className="wrap">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <a href={c.contact.href} className="roll-host inline-flex min-h-[48px] items-center text-[clamp(32px,4vw,56px)] font-[850] tracking-[-0.03em]">
              <Roll>{c.contact.label}</Roll>
            </a>
          </div>
          <div>
            <h2 className="t-eyebrow text-white/70">{c.follow}</h2>
            <ul className="mt-4 grid gap-1">
              {c.socials.map((s) => (
                <li key={s.network}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="roll-host inline-flex min-h-[44px] items-center gap-3 text-[18px]">
                    <Icon name={s.network.toLowerCase() as "facebook"} />
                    <span className="sr-only">{s.network}</span>
                    <Roll>{s.handle}</Roll>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="t-eyebrow text-white/70">{c.privacyHeading}</h2>
            <a href={c.privacyLink.href} className="roll-host mt-4 inline-flex min-h-[44px] items-center text-[18px]">
              <Roll>{c.privacyLink.label}</Roll>
            </a>
          </div>
        </div>

        <div className="mt-20 border-t border-white/15 pt-10 md:mt-28">
          <a href="/" aria-label="Tenxora home" className="block w-full">
            <Logo variant="white" height={120} className="!h-auto w-full max-w-[1100px]" />
          </a>
          <p className="mt-10 text-[15px] text-white/70">{c.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
