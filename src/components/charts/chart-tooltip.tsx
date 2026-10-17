interface TooltipEntry {
  name?: string | number;
  value?: number | string | (number | string)[];
  color?: string;
  dataKey?: string | number;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: readonly TooltipEntry[];
  format?: (v: number) => string;
}

/** Shared tooltip: text in ink colors, a small swatch carries series identity. */
export function ChartTooltip({ active, payload, label, format = (v) => v.toFixed(1) }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-36 rounded-xl border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-foreground">{label}</p>
      <ul className="flex flex-col gap-1">
        {payload.map((p) => (
          <li key={String(p.dataKey)} className="flex items-center gap-2 text-muted-foreground">
            <span className="size-2.5 rounded-full" style={{ background: p.color }} aria-hidden="true" />
            <span>{p.name}</span>
            <span className="tabular ml-auto font-mono font-semibold text-foreground">{format(Number(p.value))}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LegendItem({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <svg width="18" height="8" aria-hidden="true">
        <line x1="1" y1="4" x2="17" y2="4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={dashed ? "3 4" : undefined} />
      </svg>
      {label}
    </span>
  );
}
