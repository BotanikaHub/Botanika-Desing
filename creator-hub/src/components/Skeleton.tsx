// Esqueleto de carregamento — mostrado enquanto a tela (que varre a Shopify)
// carrega no servidor. Dá sensação de resposta imediata ao trocar de aba.
export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-hidden>
      <div className="h-7 w-40 rounded bg-[var(--background)]" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card">
            <div className="h-4 w-24 rounded bg-[var(--background)]" />
            <div className="mt-3 h-7 w-28 rounded bg-[var(--background)]" />
          </div>
        ))}
      </div>
      <div className="card space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-5 w-full rounded bg-[var(--background)]" />
        ))}
      </div>
    </div>
  );
}
