export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-bold ${className}`}>
      <span
        aria-hidden
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--brand-contrast)]"
        style={{ background: "var(--brand)" }}
      >
        {/* folha */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 4C10 4 4 10 4 20c8 0 16-6 16-16Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M11 13c2-2 5-3 5-3"
            stroke="var(--brand)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-lg tracking-tight">
        Botanika <span className="font-medium text-[var(--muted)]">Creators</span>
      </span>
    </span>
  );
}
