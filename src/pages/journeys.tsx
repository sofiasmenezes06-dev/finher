import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock3, HeartHandshake, MessagesSquare, Route, Shirt, ShieldQuestion, type LucideIcon } from "lucide-react";
import { Prose } from "@/components/content/blocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStory, INTERVIEWS, PLAYBOOKS, STORY_PARTS } from "@/content/loader";
import { fmt, useT } from "@/i18n";
import { AREAS, CAREER_STAGES, type AreaId, type CareerStageId } from "@/lib/domain";

const COMING_ICONS: LucideIcon[] = [MessagesSquare, ShieldQuestion, Shirt];

const formatDate = (iso: string, locale: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString(locale, { month: "long", year: "numeric" });

export function JourneysPage() {
  const t = useT();
  const J = t.journeys;
  const [stage, setStage] = useState<CareerStageId | "">("");
  const [area, setArea] = useState<AreaId | "">("");

  const stories = INTERVIEWS.filter((s) => (!stage || s.stages.includes(stage)) && (!area || s.areas.includes(area)));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">{J.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{J.title}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{J.subtitle}</p>
      </header>

      {/* Real stories */}
      <section aria-labelledby="stories-title">
        <h2 id="stories-title" className="text-2xl font-extrabold">
          {J.storiesTitle}
        </h2>
        {INTERVIEWS.length === 0 ? (
          <p className="mt-4 flex max-w-2xl gap-3 rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
            <Clock3 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {J.storiesEmpty}
          </p>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="story-stage">{J.filterStage}</Label>
                <Select id="story-stage" value={stage} onChange={(e) => setStage(e.target.value as CareerStageId | "")} className="min-w-56">
                  <option value="">{J.all}</option>
                  {CAREER_STAGES.map((s) => (
                    <option key={s} value={s}>
                      {t.onboarding.stages[s]}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="story-area">{J.filterArea}</Label>
                <Select id="story-area" value={area} onChange={(e) => setArea(e.target.value as AreaId | "")} className="min-w-56">
                  <option value="">{J.all}</option>
                  {AREAS.filter((a) => a !== "notSure").map((a) => (
                    <option key={a} value={a}>
                      {t.onboarding.areas[a]}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {stories.map((s) => (
                <li key={s.id}>
                  <Link
                    to={`/app/journeys/stories/${s.id}`}
                    className="group flex h-full flex-col gap-2 rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md"
                  >
                    <Badge className="self-start">{J.interview}</Badge>
                    <span className="font-display text-lg font-bold">{s.title}</span>
                    <span className="text-sm font-medium">
                      {s.displayName}
                      {s.role ? ` · ${s.role}` : ""}
                    </span>
                    <span className="text-sm text-muted-foreground">{s.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* Practical guides */}
      <section aria-labelledby="guides-title">
        <h2 id="guides-title" className="text-2xl font-extrabold">
          {J.guidesTitle}
        </h2>
        <p className="mt-1 text-muted-foreground">{J.guidesSubtitle}</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <article className="flex flex-col rounded-2xl border bg-card p-5 sm:p-6">
            <Route className="size-6 text-primary" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-bold">{J.challengesTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{J.challengesBody}</p>
            <ul className="mt-4 flex flex-col divide-y">
              {PLAYBOOKS.map((p) => (
                <li key={p.id}>
                  <Link to={`/app/journeys/challenges/${p.id}`} className="flex items-center gap-3 py-2.5 text-sm font-medium hover:text-primary">
                    <span className="flex-1">{p.title}</span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" size="sm" className="mt-4 self-start">
              <Link to="/app/journeys/challenges">{t.navigator.saved}</Link>
            </Button>
          </article>

          <Link to="/app/journeys/family" className="group flex flex-col rounded-2xl bg-navy p-5 text-navy-foreground sm:p-6">
            <HeartHandshake className="size-6 text-cta" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-bold">{J.familyTitle}</h3>
            <p className="mt-1 text-sm text-navy-foreground/80">{J.familyBody}</p>
            <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-cta">
              {J.open} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </section>

      <section aria-labelledby="coming-guides">
        <h2 id="coming-guides" className="text-xl font-extrabold">
          {J.comingTitle}
        </h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {J.coming.map((c, i) => {
            const Icon = COMING_ICONS[i] ?? MessagesSquare;
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

export function StoryPage() {
  const t = useT();
  const J = t.journeys;
  const { storyId = "" } = useParams();
  const story = getStory(storyId);

  if (!story || story.kind !== "interview") {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="rounded-2xl border border-dashed p-6 text-muted-foreground">{t.notFound.body}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/app/journeys">
            <ArrowLeft /> {J.storyBack}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link to="/app/journeys" className="flex w-fit items-center gap-1 text-sm font-semibold text-primary">
          <ArrowLeft className="size-4" aria-hidden="true" /> {J.storyBack}
        </Link>
        <Badge className="mt-4">{J.interview}</Badge>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{story.title}</h1>
        <p className="mt-2 font-medium">
          {story.displayName}
          {story.role ? ` · ${story.role}` : ""}
        </p>
        {story.interviewDate && (
          <p className="mt-1 text-sm text-muted-foreground">{fmt(J.interviewedOn, { date: formatDate(story.interviewDate, t.locale) })}</p>
        )}
      </div>
      {STORY_PARTS.filter((p) => story.parts[p]).map((p, i) => (
        <section key={p} className="rounded-2xl border bg-card p-5 sm:p-6">
          <h2 className="flex items-baseline gap-3 text-lg font-bold">
            <span className="tabular font-mono text-sm text-primary">0{i + 1}</span>
            {J.storyParts[p]}
          </h2>
          <Prose html={story.parts[p]!} className="mt-3" />
        </section>
      ))}
    </article>
  );
}
