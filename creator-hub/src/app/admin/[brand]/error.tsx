"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="card border-[var(--danger)] bg-[#fdecea]">
      <h2 className="text-lg font-semibold text-[var(--danger)]">
        Algo deu errado ao carregar esta aba
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Pode ter sido uma falha momentânea de conexão com a loja. Tente novamente.
      </p>
      <button onClick={reset} className="btn btn-outline mt-4">
        Tentar de novo
      </button>
    </div>
  );
}
