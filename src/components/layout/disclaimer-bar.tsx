import { Info } from "lucide-react";
import { useT } from "@/i18n";

/** Persistent, non-intrusive educational disclaimer pinned to the bottom of every page. */
export function DisclaimerBar() {
  const t = useT();
  return (
    <aside
      aria-label={t.disclaimer.label}
      className="fixed inset-x-0 bottom-[var(--tabbar-offset,0px)] z-40 border-t pb-[env(safe-area-inset-bottom,0px)] [.has-tabbar_&]:pb-0 bg-background/92 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <p className="mx-auto flex max-w-7xl items-start gap-2 px-4 py-2 text-[0.75rem] leading-snug text-muted-foreground sm:items-center sm:px-6">
        <Info className="mt-0.5 size-3.5 shrink-0 sm:mt-0" aria-hidden="true" />
        {t.disclaimer.short}
      </p>
    </aside>
  );
}

export function DemoBanner() {
  const t = useT();
  return (
    <div role="status" className="bg-navy px-4 py-2 text-center text-xs text-navy-foreground">
      {t.demoBanner}
    </div>
  );
}
