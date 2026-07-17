export function Logo({
  className = "",
  brandName,
  color = "var(--brand)",
}: {
  className?: string;
  brandName?: string;
  color?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 font-bold ${className}`}>
      <span
        aria-hidden
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white"
        style={{ background: color }}
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
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-lg tracking-tight">
        {brandName || "Creator"}{" "}
        <span className="font-medium text-[var(--muted)]">Hub</span>
      </span>
    </span>
  );
}
