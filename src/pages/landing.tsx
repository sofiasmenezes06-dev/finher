import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Compass,
  EyeOff,
  HeartHandshake,
  Lock,
  MapPin,
  Quote,
  Route,
  ShieldCheck,
  Users,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { fmt, useT } from "@/i18n";

const PILLAR_ICONS: Record<string, LucideIcon> = {
  overview: Compass,
  education: BookOpen,
  community: Users,
  journeys: Route,
};
const EDGE_ICONS: Record<string, LucideIcon> = {
  navigator: Route,
  family: HeartHandshake,
  stories: Quote,
  community: UsersRound,
};
const SAFETY_ICONS: LucideIcon[] = [Wallet, Lock, EyeOff, ShieldCheck];

function Eyebrow({ children, onDark }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p className={onDark ? "text-sm font-semibold uppercase tracking-wider text-cta" : "text-sm font-semibold uppercase tracking-wider text-primary"}>
      {children}
    </p>
  );
}

/** Hero visual: what a personalized path looks like (clearly marked as an example). */
function PathPreview() {
  const t = useT();
  const P = t.landing.preview;
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-xl shadow-navy/5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-base font-bold">{P.title}</p>
        <span className="rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">{P.sample}</span>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-muted p-3">
          <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden="true" /> {P.stageLabel}
          </dt>
          <dd className="mt-1 text-sm font-semibold">{P.stageValue}</dd>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <dt className="text-xs font-medium text-muted-foreground">{P.areasLabel}</dt>
          <dd className="mt-1 text-sm font-semibold">{P.areasValue}</dd>
        </div>
      </dl>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-primary">{P.nextLabel}</p>
      <ol className="mt-2 flex flex-col gap-2">
        {P.steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3 rounded-xl border p-3 text-sm">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-cta font-display text-xs font-extrabold text-cta-foreground">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed p-3 text-sm">
        <Users className="size-4 shrink-0 text-primary" aria-hidden="true" />
        <span>
          <span className="text-muted-foreground">{P.communityLabel}: </span>
          <span className="font-semibold">{P.communityValue}</span>
        </span>
      </div>
    </div>
  );
}

export default function Landing() {
  const t = useT();
  const L = t.landing;

  return (
    <>
      <SiteHeader />
      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]"
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-24 lg:pt-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                <span className="size-1.5 shrink-0 rounded-full bg-cta" aria-hidden="true" />
                {L.hero.eyebrow}
              </p>
              <h1 className="mt-5 text-[2.5rem] font-extrabold leading-[1.02] sm:text-6xl lg:text-[4.25rem]">{L.hero.title}</h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">{L.hero.subtitle}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="cta" size="lg">
                  <Link to="/signup">
                    {L.hero.ctaPrimary} <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#how">{L.hero.ctaSecondary}</a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{L.hero.note}</p>
            </div>
            <div className="lg:pl-4">
              <PathPreview />
            </div>
          </div>
        </section>

        {/* The gap */}
        <section className="bg-navy text-navy-foreground" aria-labelledby="gap-title">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="max-w-3xl">
              <Eyebrow onDark>{L.gap.eyebrow}</Eyebrow>
              <h2 id="gap-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
                {L.gap.title}
              </h2>
              <p className="mt-5 text-lg text-navy-foreground/80">{L.gap.intro}</p>
            </div>
            <ul className="mt-12 grid gap-4 md:grid-cols-3">
              {L.gap.items.map((item) => (
                <li key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-navy-foreground/80">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Four sections */}
        <section id="pillars" className="scroll-mt-20" aria-labelledby="pillars-title">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="max-w-2xl">
              <Eyebrow>{L.pillars.eyebrow}</Eyebrow>
              <h2 id="pillars-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
                {L.pillars.title}
              </h2>
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {L.pillars.items.map((p) => {
                const Icon = PILLAR_ICONS[p.id] ?? Compass;
                return (
                  <li key={p.id} className="rounded-2xl border bg-card p-6">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
                    <p className="mt-2 text-muted-foreground">{p.body}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Why FinHer */}
        <section id="different" className="scroll-mt-20 bg-navy text-navy-foreground" aria-labelledby="edge-title">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:py-24">
            <div>
              <Eyebrow onDark>{L.edge.eyebrow}</Eyebrow>
              <h2 id="edge-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
                {L.edge.title}
              </h2>
              <p className="mt-5 text-lg text-navy-foreground/80">{L.edge.body}</p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {L.edge.items.map((item) => {
                const Icon = EDGE_ICONS[item.id] ?? Route;
                return (
                  <li key={item.id} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                    <div className="flex items-center justify-between gap-3">
                      <Icon className="size-6 text-cta" aria-hidden="true" />
                      {item.soon && (
                        <span className="rounded-full border border-white/20 px-2.5 py-0.5 text-xs font-semibold text-navy-foreground/80">
                          {L.edge.soon}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 text-navy-foreground/80">{item.body}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-20" aria-labelledby="how-title">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="max-w-2xl">
              <Eyebrow>{L.how.eyebrow}</Eyebrow>
              <h2 id="how-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
                {L.how.title}
              </h2>
            </div>
            <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
              {L.how.steps.map((s, i) => (
                <li key={s.title}>
                  <span className="grid size-12 place-items-center rounded-full bg-cta font-display text-lg font-extrabold text-cta-foreground">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Universities */}
        <section id="universities" className="scroll-mt-20 border-y bg-card" aria-labelledby="uni-title">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24">
            <div>
              <Eyebrow>{L.universities.eyebrow}</Eyebrow>
              <h2 id="uni-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
                {L.universities.title}
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">{L.universities.body}</p>
              <div className="mt-8">
                <Button asChild variant="outline" size="lg">
                  <Link to="/signup">
                    {L.universities.cta} <ArrowRight />
                  </Link>
                </Button>
                <p className="mt-3 text-sm text-muted-foreground">{L.universities.ctaNote}</p>
              </div>
            </div>
            <ul className="grid gap-3 self-center">
              {L.universities.items.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl border bg-background p-5">
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Safety */}
        <section id="safety" className="scroll-mt-20" aria-labelledby="safety-title">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="max-w-2xl">
              <Eyebrow>{L.safety.eyebrow}</Eyebrow>
              <h2 id="safety-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
                {L.safety.title}
              </h2>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {L.safety.items.map((s, i) => {
                const Icon = SAFETY_ICONS[i];
                return (
                  <li key={s.title}>
                    <Icon className="size-6 text-primary" aria-hidden="true" />
                    <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                    <p className="mt-2 text-muted-foreground">{s.body}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-t bg-card" aria-labelledby="faq-title">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
            <h2 id="faq-title" className="text-3xl font-extrabold sm:text-4xl">
              {L.faq.title}
            </h2>
            <div className="mt-8 divide-y rounded-2xl border bg-background">
              {L.faq.items.map((f) => (
                <details key={f.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg font-semibold">
                    {f.q}
                    <span className="text-xl text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-7xl rounded-3xl bg-navy px-6 py-14 text-center text-navy-foreground sm:px-12 sm:py-20">
            <h2 className="mx-auto max-w-3xl text-3xl font-extrabold sm:text-5xl">{L.finalCta.title}</h2>
            <Button asChild variant="cta" size="lg" className="mt-8">
              <Link to="/signup">
                {L.finalCta.cta} <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t pb-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground">{t.brand.tagline}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:items-end">
            <ul className="flex gap-4">
              <li>{L.footer.privacy}</li>
              <li>{L.footer.conduct}</li>
              <li>{L.footer.contact}</li>
            </ul>
            <p>{fmt(L.footer.rights, { year: new Date().getFullYear() })}</p>
            <p className="max-w-sm sm:text-right">{L.footer.academic}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
