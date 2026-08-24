"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { label: string; href: string; badge?: number };

export function AdminTabs({
  slug,
  color,
  pendingCount,
  withdrawalsCount,
}: {
  slug: string;
  color: string;
  pendingCount: number;
  withdrawalsCount: number;
}) {
  const pathname = usePathname();
  const base = `/admin/${slug}`;
  const tabs: Tab[] = [
    { label: "Vendas", href: base },
    { label: "Comissões", href: `${base}/comissoes` },
    { label: "Saques", href: `${base}/saques`, badge: withdrawalsCount },
    { label: "Cupons", href: `${base}/cupons` },
    { label: "Metas", href: `${base}/metas` },
    { label: "Envio", href: `${base}/envio` },
    { label: "Cadastros", href: `${base}/cadastros`, badge: pendingCount },
  ];

  return (
    <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5">
      {tabs.map((t) => {
        const active =
          t.href === base ? pathname === base : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className="relative whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition"
            style={{
              borderColor: active ? color : "transparent",
              color: active ? color : "var(--muted)",
            }}
          >
            {t.label}
            {t.badge ? (
              <span
                className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold text-white"
                style={{ background: color }}
              >
                {t.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
