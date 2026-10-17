import { Lock, Scale } from "lucide-react";
import { Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COUNTRY_HELP } from "@/content/loader";
import { fmt, formatDay, useT } from "@/i18n";
import { JURISDICTIONS, type Jurisdiction } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth";

/** Renders trusted, build-time Markdown from /content (raw HTML is stripped by the loader). */
export function Prose({ html, className }: { html: string; className?: string }) {
  return <div className={cn("prose-fh", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function LegalNotice({ reviewed, className }: { reviewed?: string; className?: string }) {
  const t = useT();
  return (
    <p role="note" className={cn("flex gap-3 rounded-xl border border-warning/40 bg-warning/8 p-3 text-sm", className)}>
      <Scale className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
      <span>
        {t.legal.notice}
        {reviewed && <span className="mt-1 block text-xs text-muted-foreground">{fmt(t.legal.reviewed, { date: formatDay(reviewed, t.locale) })}</span>}
      </span>
    </p>
  );
}

export function CountrySelect({ id = "country-select", className }: { id?: string; className?: string }) {
  const t = useT();
  const { jurisdiction, setJurisdiction } = useAuth();
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{t.countries.label}</Label>
      <Select
        id={id}
        value={jurisdiction}
        onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}
        aria-describedby={`${id}-hint`}
        className="max-w-xs"
      >
        {JURISDICTIONS.map((j) => (
          <option key={j} value={j}>
            {t.countries[j]}
          </option>
        ))}
      </Select>
      <p id={`${id}-hint`} className="text-xs text-muted-foreground">
        {t.countries.hint}
      </p>
    </div>
  );
}

/** General "where to get help" information for the selected country. */
export function CountryHelp({ headingLevel = "h2" }: { headingLevel?: "h2" | "h3" }) {
  const t = useT();
  const { jurisdiction } = useAuth();
  const help = COUNTRY_HELP[jurisdiction];
  if (!help) return null;
  const H = headingLevel;
  return (
    <section aria-labelledby="country-help-title" className="rounded-2xl border bg-card p-5 sm:p-6">
      <H id="country-help-title" className="text-lg font-bold">
        {fmt(t.legal.helpTitle, { country: t.countries[jurisdiction] })}
      </H>
      <LegalNotice reviewed={help.reviewed} className="mt-4" />
      <Prose html={help.html} className="mt-4" />
    </section>
  );
}

export function SensitiveNote({ className }: { className?: string }) {
  const t = useT();
  const { mode } = useAuth();
  return (
    <aside className={cn("flex gap-3 rounded-xl bg-muted p-4 text-sm", className)} aria-label={t.sensitive.title}>
      <Lock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
      <p>
        <span className="font-semibold">{t.sensitive.title}. </span>
        {mode === "demo" ? t.sensitive.demo : t.sensitive.body}
      </p>
    </aside>
  );
}
