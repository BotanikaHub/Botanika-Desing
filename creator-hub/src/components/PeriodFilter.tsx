import Link from "next/link";
import { PERIODS } from "@/lib/format";

// Filtro de período: presets (7d, 14d, 30d, 90d, 12m, Tudo) + Personalizado.
// Sem JS: navega por links; o custom usa um form GET.
export function PeriodFilter({
  basePath,
  activeKey,
  from,
  to,
  color = "var(--brand)",
}: {
  basePath: string;
  activeKey: string;
  from?: string | null;
  to?: string | null;
  color?: string;
}) {
  const tabStyle = (active: boolean) =>
    active
      ? { background: color, color: "#fff", borderColor: color }
      : undefined;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {PERIODS.map((p) => (
          <Link
            key={p.key}
            href={`${basePath}?period=${p.key}`}
            className="rounded-full border px-3 py-1 text-xs font-semibold transition"
            style={tabStyle(p.key === activeKey)}
          >
            {p.label}
          </Link>
        ))}
        <Link
          href={`${basePath}?period=custom`}
          className="rounded-full border px-3 py-1 text-xs font-semibold transition"
          style={tabStyle(activeKey === "custom")}
        >
          Personalizado
        </Link>
      </div>

      {activeKey === "custom" && (
        <form action={basePath} method="get" className="flex flex-wrap items-end gap-2">
          <input type="hidden" name="period" value="custom" />
          <div>
            <label className="block text-xs text-[var(--muted)]">De</label>
            <input type="date" name="from" defaultValue={from || ""} className="input py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-[var(--muted)]">Até</label>
            <input type="date" name="to" defaultValue={to || ""} className="input py-1 text-sm" />
          </div>
          <button type="submit" className="btn btn-outline py-1.5 text-sm">Aplicar</button>
        </form>
      )}
    </div>
  );
}
