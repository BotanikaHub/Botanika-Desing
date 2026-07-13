"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label = "Copiar",
  className = "btn btn-outline",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback silencioso
    }
  }

  return (
    <button type="button" className={className} onClick={copy}>
      {copied ? "Copiado! ✓" : label}
    </button>
  );
}
