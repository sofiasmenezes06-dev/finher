import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookMarked, Bot, Clock, Layers, ListChecks } from "lucide-react";
import { Prose } from "@/components/content/blocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AREA_GUIDES, getAreaGuide } from "@/content/loader";
import { fmt, useT, type Messages } from "@/i18n";
import { isOnboarded } from "@/lib/domain";
import { buildRecommendations, type TrailReason } from "@/lib/path-engine";
import { useAuth } from "@/providers/auth";

const COMING_ICONS = [BookMarked, ListChecks, Bot];

function reasonText(t: Messages, r: TrailReason) {
  const R = t.education.reasons;
  switch (r.kind) {
    case "gap":
      return fmt(R.gap, { skill: t.onboarding.skills[r.skill] });
    case "area":
      return fmt(R.area, { area: getAreaGuide(r.area)?.title ?? t.onboarding.areas[r.area] });
    case "goal":
      return fmt(R.goal, { goal: t.onboarding.goals[r.goal] });
    default:
      return R.foundation;
  }
}

export function EducationPage() {
  const t = useT();
  const E = t.education;
  const { profile } = useAuth();
  const rec = useMemo(() => (isOnboarded(profile) ? buildRecommendations(profile) : null), [profile]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">{E.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{E.title}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{E.subtitle}</p>
      </header>

      {rec && (
        <section aria-labelledby="trails-title">
          <h2 id="trails-title" className="text-2xl font-extrabold">
            {E.trailsTitle}
          </h2>
          <p className="mt-1 text-muted-foreground">{E.trailsSubtitle}</p>
          <ol className="mt-5 grid gap-4 md:grid-cols-2">
            {rec.trails.map(({ trail, reason }, i) => (
              <li key={trail.id}>
                <Card className="flex h-full flex-col">
                  <CardHeader>
                    <span className="tabular font-mono text-sm font-semibold text-primary">0{i + 1}</span>
                    <CardTitle>{trail.title}</CardTitle>
                    <CardDescription>{trail.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex flex-col gap-4">
                    <p className="rounded-xl bg-primary/8 px-3 py-2 text-sm">
                      <span className="font-semibold text-primary">{E.why}: </span>
                      {reasonText(t, reason)}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Layers className="size-4" aria-hidden="true" /> {fmt(E.lessons, { count: trail.lessons })}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-4" aria-hidden="true" /> {fmt(E.minutes, { count: trail.minutes })}
                        </span>
                      </p>
                      <Badge variant="outline">{E.lessonsSoon}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section aria-labelledby="guides-title">
        <h2 id="guides-title" className="text-2xl font-extrabold">
          {E.areasTitle}
        </h2>
        <p className="mt-1 text-muted-foreground">{E.areasSubtitle}</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AREA_GUIDES.map((a) => (
            <li key={a.id}>
              <Link
                to={`/app/education/areas/${a.id}`}
                className="group flex h-full flex-col gap-2 rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <span className="font-display text-lg font-bold">{a.title}</span>
                <span className="text-sm text-muted-foreground">{a.summary}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-primary">
                  {t.overview.readGuide} <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="coming-title">
        <h2 id="coming-title" className="text-xl font-extrabold">
          {E.comingTitle}
        </h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {E.coming.map((c, i) => {
            const Icon = COMING_ICONS[i] ?? BookMarked;
            return (
              <li key={c.title} className="flex flex-col gap-2 rounded-2xl border border-dashed p-5">
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <p className="font-semibold">{c.title}</p>
                <p className="text-sm text-muted-foreground">{c.body}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export function AreaGuidePage() {
  const t = useT();
  const { areaId = "" } = useParams();
  const guide = getAreaGuide(areaId);

  if (!guide) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="rounded-2xl border border-dashed p-6 text-muted-foreground">{t.notFound.body}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/app/education">
            <ArrowLeft /> {t.education.areaBack}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link to="/app/education" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          <ArrowLeft className="size-4" aria-hidden="true" /> {t.education.areaBack}
        </Link>
        <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-primary">{t.education.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{guide.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{guide.summary}</p>
      </div>
      {guide.sections.map((s) => (
        <section key={s.heading} className="rounded-2xl border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-bold">{s.heading}</h2>
          <Prose html={s.html} className="mt-3" />
        </section>
      ))}
    </article>
  );
}
