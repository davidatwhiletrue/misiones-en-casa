"use client";

import { approveStreak, payStreak, restartStreak } from "../app/actions/admin-streaks";
import { useTransition } from "react";

export function ApproveStreakButton({ progressId }: { progressId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(() => approveStreak(progressId))}
      disabled={isPending}
      className="text-[10px] px-2 py-1 rounded-full font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all disabled:opacity-50"
    >
      {isPending ? "…" : "✅ Aprobar"}
    </button>
  );
}

export function PayStreakButton({ progressId }: { progressId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(() => payStreak(progressId))}
      disabled={isPending}
      className="text-[10px] px-2 py-1 rounded-full font-semibold bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-all disabled:opacity-50"
    >
      {isPending ? "…" : "💰 Pagar"}
    </button>
  );
}

export function RestartStreakButton({ progressId }: { progressId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => {
        if (!confirm("¿Reiniciar la racha para que pueda repetirla?")) return;
        startTransition(() => restartStreak(progressId));
      }}
      disabled={isPending}
      className="text-[10px] px-2 py-1 rounded-full font-semibold bg-white/10 text-purple-300 hover:bg-white/20 transition-all disabled:opacity-50"
    >
      {isPending ? "…" : "🔄 Repetir"}
    </button>
  );
}

