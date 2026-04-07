"use client";

import { deleteMission } from "../app/actions/admin-missions";
import { useTransition } from "react";

export default function DeleteMissionButton({ missionId }: { missionId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("¿Seguro que quieres eliminar esta misión?")) return;

    startTransition(async () => {
      await deleteMission(missionId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-[10px] px-2 py-1 rounded-full font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all disabled:opacity-50"
      title="Eliminar misión"
    >
      {isPending ? "…" : "🗑️"}
    </button>
  );
}

