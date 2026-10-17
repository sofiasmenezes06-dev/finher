import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n";
import type { SkillGap } from "@/lib/path-engine";
import { ChartTooltip } from "./chart-tooltip";

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <span className="size-3 rounded-[3px]" style={{ background: color }} aria-hidden="true" />
      {label}
    </span>
  );
}

export function SkillsGapChart({ gaps }: { gaps: SkillGap[] }) {
  const t = useT();
  const [view, setView] = useState<"chart" | "table">("chart");
  const data = gaps.map((g) => ({ name: t.onboarding.skills[g.skill], current: g.current, target: g.target, gap: g.gap }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Swatch color="var(--chart-1)" label={t.overview.you} />
          <Swatch color="var(--chart-2)" label={t.overview.target} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView(view === "chart" ? "table" : "chart")}
          aria-pressed={view === "table"}
        >
          {view === "chart" ? <Table2 /> : <BarChart3 />}
          {view === "chart" ? t.overview.gapTable : t.overview.gapChart}
        </Button>
      </div>

      {view === "chart" ? (
        <figure className="mt-4 h-[22rem]" role="img" aria-label={t.overview.chartLabel}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }} barGap={2} barCategoryGap="28%">
              <CartesianGrid horizontal={false} stroke="var(--chart-grid)" />
              <XAxis
                type="number"
                domain={[0, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--chart-axis)", fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={132}
                tickLine={false}
                axisLine={{ stroke: "var(--chart-axis)" }}
                tick={{ fill: "var(--foreground)", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.6 }}
                content={(p) => (
                  <ChartTooltip active={p.active} label={p.label as string} payload={p.payload as never} format={(v) => `${v} / 5`} />
                )}
              />
              <Bar dataKey="current" name={t.overview.you} fill="var(--chart-1)" radius={[0, 4, 4, 0]} maxBarSize={14} />
              <Bar dataKey="target" name={t.overview.target} fill="var(--chart-2)" radius={[0, 4, 4, 0]} maxBarSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </figure>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th scope="col" className="py-2 pr-3 font-semibold">{t.overview.skill}</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">{t.overview.you}</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">{t.overview.target}</th>
                <th scope="col" className="py-2 pl-3 text-right font-semibold">{t.overview.gap}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.name} className="border-b last:border-0">
                  <th scope="row" className="py-2.5 pr-3 text-left font-medium">{r.name}</th>
                  <td className="tabular px-3 py-2.5 text-right font-mono">{r.current}</td>
                  <td className="tabular px-3 py-2.5 text-right font-mono">{r.target}</td>
                  <td className="tabular py-2.5 pl-3 text-right font-mono font-semibold">{r.gap > 0 ? `−${r.gap}` : "✓"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
