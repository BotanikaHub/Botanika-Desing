export const PERIODS = [
  { key: "7d", label: "7 dias", days: 7 },
  { key: "14d", label: "14 dias", days: 14 },
  { key: "30d", label: "30 dias", days: 30 },
  { key: "90d", label: "90 dias", days: 90 },
  { key: "12m", label: "12 meses", days: 365 },
  { key: "all", label: "Tudo", days: null },
] as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Resolve o período do filtro (padrão: 90 dias). Suporta "custom" com from/to.
// Retorna a chave ativa + as datas (ISO yyyy-mm-dd) since/until.
export function resolvePeriod(key?: string, from?: string, to?: string) {
  if (key === "custom") {
    const since = from && ISO_DATE.test(from) ? from : null;
    const until = to && ISO_DATE.test(to) ? to : null;
    return { key: "custom", since, until };
  }
  const period = PERIODS.find((p) => p.key === key) ?? PERIODS[3]; // 90 dias
  const since = period.days
    ? new Date(Date.now() - period.days * 86400000).toISOString().slice(0, 10)
    : null;
  return { key: period.key, since, until: null as string | null };
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

// Gera um código de cupom sugerido a partir do nome/instagram
export function suggestCoupon(seed: string): string {
  return (
    seed
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 12) || "CREATOR"
  );
}
