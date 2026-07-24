import { formatBRL } from "@/lib/format";

// Bloco de gamificação com tom de conquista/crescimento (nada de cobrança).
export function GoalCard({
  sales,
  goal,
  bonusStep,
  bonusLabel,
  period,
  color,
}: {
  sales: number;
  goal: number;
  bonusStep: number;
  bonusLabel: string;
  period: "monthly" | "all";
  color: string;
}) {
  const reached = goal > 0 && sales >= goal;
  const beyond = Math.max(0, sales - goal);
  const bonuses = bonusStep > 0 ? Math.floor(beyond / bonusStep) : 0;
  const toNext = bonusStep > 0 ? bonusStep - (beyond % bonusStep) : 0;
  const pct = goal > 0 ? Math.min(100, (sales / goal) * 100) : 100;
  const when = period === "monthly" ? "este mês" : "no total";

  return (
    <div
      className="card"
      style={{ background: "var(--brand-soft)", borderColor: color }}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">🌱 Sua jornada {when}</h3>
        {bonuses > 0 && (
          <span
            className="rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ background: color }}
          >
            {bonuses} {bonusLabel} desbloqueado{bonuses > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <p className="mt-2 text-2xl font-bold">{formatBRL(sales)}</p>
      <p className="text-sm text-[var(--muted)]">
        {reached ? (
          <>Meta de {formatBRL(goal)} conquistada 🎉 Você está voando!</>
        ) : (
          <>Sua meta {when}: {formatBRL(goal)}. Você já está no caminho 👏</>
        )}
      </p>

      {/* Barra suave (crescimento, não cobrança) */}
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/70">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>

      <p className="mt-3 text-sm">
        {reached ? (
          bonusStep > 0 ? (
            <>
              Faltam <b>{formatBRL(toNext)}</b> pra desbloquear mais um{" "}
              <b>{bonusLabel}</b> — cada {formatBRL(bonusStep)} além da meta rende
              um novo.
            </>
          ) : (
            <>Continue assim, você passou da meta! 🚀</>
          )
        ) : (
          <>
            Ao alcançar a meta você desbloqueia seu <b>{bonusLabel}</b>. É
            crescimento no seu ritmo — sem pressa, sem pressão.
          </>
        )}
      </p>
    </div>
  );
}
