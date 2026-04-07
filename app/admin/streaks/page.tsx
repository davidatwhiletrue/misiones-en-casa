import { prisma } from "../../../lib/db";
import Link from "next/link";
import StreakCheckInButton from "../../../components/streak-check-in-button";
import { ApproveStreakButton, PayStreakButton, RestartStreakButton } from "../../../components/streak-action-buttons";

export const dynamic = "force-dynamic";

function isToday(date: Date | null): boolean {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime() === today.getTime();
}

export default async function StreakDashboardPage() {
  const streakMissions = await prisma.mission.findMany({
    where: { type: "streak" },
    include: {
      streakProgress: {
        include: { child: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const children = await prisma.user.findMany({
    where: { role: "child" },
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">🔥 Rachas</h1>
        <Link
          href="/admin"
          className="text-purple-300 hover:text-white text-sm font-medium transition-colors"
        >
          ← Volver
        </Link>
      </div>

      {streakMissions.length === 0 && (
        <div className="glass-card p-6 text-center">
          <p className="text-purple-300/60 text-sm">No hay misiones de racha todavía.</p>
          <Link href="/admin/missions/create" className="text-purple-400 text-sm hover:text-white mt-2 inline-block">
            ✨ Crear una
          </Link>
        </div>
      )}

      {streakMissions.map((mission) => (
        <section key={mission.id} className="glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-white text-sm">{mission.title}</h2>
                <p className="text-[10px] text-purple-300/60">
                  🔥 {mission.streakTarget} días · {mission.reward}€ · {mission.xpReward} XP
                </p>
              </div>
              <Link
                href={`/admin/missions/${mission.id}/edit`}
                className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-purple-300 hover:bg-white/20 transition-all"
              >
                ✏️
              </Link>
            </div>
          </div>

          {children.map((child) => {
            const progress = mission.streakProgress.find((p) => p.childId === child.id);
            const streak = progress?.currentStreak || 0;
            const target = mission.streakTarget || 7;
            const pct = Math.min(100, Math.round((streak / target) * 100));
            const checkedInToday = progress ? isToday(progress.lastCheckInDate) : false;
            const status = progress?.status || "not_joined";

            return (
              <div key={child.id} className="px-4 py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
                      style={{ backgroundColor: child.color || "#6366f1" }}
                    >
                      {child.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium text-white block truncate">{child.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-orange-300 font-semibold shrink-0">
                          🔥 {streak}/{target}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {status === "not_joined" || status === "in_progress" ? (
                      <StreakCheckInButton
                        missionId={mission.id}
                        childId={child.id}
                        alreadyCheckedIn={checkedInToday}
                      />
                    ) : status === "completed" ? (
                      <ApproveStreakButton progressId={progress!.id} />
                    ) : status === "approved" ? (
                      <PayStreakButton progressId={progress!.id} />
                    ) : status === "paid" ? (
                      <RestartStreakButton progressId={progress!.id} />
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

