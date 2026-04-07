"use client";

import { checkInStreak } from "../app/actions/admin-streaks";
import { useTransition } from "react";

export default function StreakCheckInButton({
  missionId,
  childId,
  alreadyCheckedIn,
}: {
  missionId: string;
  childId: string;
  alreadyCheckedIn: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await checkInStreak(missionId, childId);
    });
  }

  if (alreadyCheckedIn) {
    return (
      <span className="text-[10px] px-2 py-1 rounded-full font-semibold bg-green-500/20 text-green-300">
        ✅ Hoy
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-[10px] px-2 py-1 rounded-full font-semibold bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 transition-all disabled:opacity-50"
    >
      {isPending ? "…" : "☐ Marcar hoy"}
    </button>
  );
}

