import { prisma } from "../../lib/db";
import { getSession } from "../../lib/auth";
import { redirect } from "next/navigation";
import { acceptMission, completeMission, joinStreakMission } from "../actions/child-missions";

export const dynamic = "force-dynamic";

function getLevelFromXP(xp: number): { level: number; label: string } {
  if (xp < 100) return { level: 1, label: "Novato" };
  if (xp < 300) return { level: 2, label: "Aprendiz" };
  if (xp < 600) return { level: 3, label: "Explorador" };
  if (xp < 1000) return { level: 4, label: "Aventurero" };
  if (xp < 1500) return { level: 5, label: "Héroe" };
  return { level: 6, label: "Leyenda" };
}

const rarityColors: Record<string, string> = {
  common: "bg-white/10 text-gray-300",
  special: "bg-blue-500/20 text-blue-300",
  epic: "bg-purple-500/20 text-purple-300",
};

const rarityEmoji: Record<string, string> = {
  common: "⚪",
  special: "🔵",
  epic: "🟣",
};

const difficultyColors: Record<string, string> = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-red-400",
};

const difficultyEmoji: Record<string, string> = {
  easy: "⭐",
  medium: "⭐⭐",
  hard: "⭐⭐⭐",
};

const statusLabels: Record<string, string> = {
  assigned: "⚔️ En curso",
  completed: "⏳ Pendiente revisión",
  approved: "✅ Aprobada",
  paid: "💰 Pagada",
};

export default async function ChildDashboard() {
  const session = await getSession();
  if (!session || session.role !== "child") {
    redirect("/login");
  }

  const childId = session.userId as string;

  const child = await prisma.user.findUnique({ where: { id: childId } });
  if (!child) redirect("/login");

  const availableMissions = await prisma.mission.findMany({
    where: {
      status: "available",
      type: "standard",
      OR: [{ allowedChildId: null }, { allowedChildId: childId }],
    },
    orderBy: { createdAt: "desc" },
  });

  // Streak missions with this child's progress
  const streakMissions = await prisma.mission.findMany({
    where: { type: "streak", status: "available" },
    include: {
      streakProgress: {
        where: { childId },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const activeMissions = await prisma.mission.findMany({
    where: { assignedChildId: childId, status: "assigned" },
    orderBy: { createdAt: "desc" },
  });

  const historyMissions = await prisma.mission.findMany({
    where: {
      assignedChildId: childId,
      status: { in: ["completed", "approved", "paid"] },
    },
    orderBy: { updatedAt: "desc" },
  });

  const historyStreakProgress = await prisma.streakProgress.findMany({
    where: {
      childId: childId,
      status: { in: ["completed", "approved", "paid"] },
    },
    include: { mission: true },
    orderBy: { createdAt: "desc" },
  });

  const { level, label } = getLevelFromXP(child.xp);
  const balance = historyMissions
    .filter((m) => m.status === "approved")
    .reduce((sum, m) => sum + m.reward, 0) +
    historyStreakProgress
      .filter((sp) => sp.status === "approved")
      .reduce((sum, sp) => sum + sp.mission.reward, 0);
  const totalEarned = historyMissions
    .filter((m) => m.status === "paid")
    .reduce((sum, m) => sum + m.reward, 0) +
    historyStreakProgress
      .filter((sp) => sp.status === "paid")
      .reduce((sum, sp) => sum + sp.mission.reward, 0);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
      {/* Hero Stats */}
      <div className="glass-card p-5 glow-purple">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 ring-3 ring-purple-400/50 animate-float"
            style={{ backgroundColor: child.color || "#6366f1" }}
          >
            {child.avatar || "👤"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{child.name}</h1>
            <p className="text-purple-300 text-sm font-medium">🏅 Nivel {level} — {label}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-purple-500/15 rounded-xl p-3 text-center">
            <span className="text-lg font-bold text-purple-300">{child.xp}</span>
            <p className="text-[10px] text-purple-400/80 font-medium mt-0.5">XP</p>
          </div>
          <div className="bg-cyan-500/15 rounded-xl p-3 text-center">
            <span className="text-lg font-bold text-cyan-300">{balance.toFixed(2)}€</span>
            <p className="text-[10px] text-cyan-400/80 font-medium mt-0.5">Por cobrar</p>
          </div>
          <div className="bg-green-500/15 rounded-xl p-3 text-center">
            <span className="text-lg font-bold text-green-300">{totalEarned.toFixed(2)}€</span>
            <p className="text-[10px] text-green-400/80 font-medium mt-0.5">Cobrado</p>
          </div>
        </div>
      </div>

      {/* Misiones disponibles */}
      <section>
        <h2 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
          🗺️ <span>Misiones disponibles</span>
          {availableMissions.length > 0 && (
            <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full">{availableMissions.length}</span>
          )}
        </h2>
        {availableMissions.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <span className="text-3xl block mb-2">😴</span>
            <p className="text-purple-300/70 text-sm">No hay misiones disponibles ahora mismo.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableMissions.map((mission) => (
              <div key={mission.id} className={`glass-card p-4 rarity-${mission.rarity || "common"}`}>
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="font-bold text-white text-sm">{mission.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${rarityColors[mission.rarity || "common"]}`}>
                    {rarityEmoji[mission.rarity || "common"]} {mission.rarity}
                  </span>
                </div>
                {mission.description && <p className="text-xs text-purple-200/70 mb-2.5">{mission.description}</p>}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className={`font-medium ${difficultyColors[mission.difficulty || "medium"]}`}>
                    {difficultyEmoji[mission.difficulty || "medium"]}
                  </span>
                  <span className="text-cyan-300 font-bold">{mission.reward}€ + {mission.xpReward} XP</span>
                </div>
                <form action={acceptMission.bind(null, mission.id)}>
                  <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-xl text-sm font-bold hover:from-purple-500 hover:to-pink-500 active:scale-[0.97] transition-all">
                    ⚔️ Aceptar misión
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Misiones de Racha */}
      {streakMissions.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
            🔥 <span>Rachas</span>
            <span className="bg-orange-500/20 text-orange-300 text-xs px-2 py-0.5 rounded-full">{streakMissions.length}</span>
          </h2>
          <div className="space-y-3">
            {streakMissions.map((mission) => {
              const progress = mission.streakProgress[0];
              const streak = progress?.currentStreak || 0;
              const target = mission.streakTarget || 7;
              const pct = Math.min(100, Math.round((streak / target) * 100));
              const joined = !!progress;
              const streakStatus = progress?.status || "not_joined";

              return (
                <div key={mission.id} className="glass-card p-4 border-l-3" style={{ borderLeftWidth: '3px', borderLeftColor: '#f97316' }}>
                  <div className="flex justify-between items-start mb-1.5">
                    <h3 className="font-bold text-white text-sm">{mission.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-orange-500/20 text-orange-300">
                      🔥 Racha
                    </span>
                  </div>
                  {mission.description && <p className="text-xs text-purple-200/70 mb-2">{mission.description}</p>}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-orange-300 font-bold">🔥 {streak}/{target} días</span>
                    <span className="text-cyan-300 font-bold">{mission.reward}€ + {mission.xpReward} XP</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {!joined ? (
                    <form action={joinStreakMission.bind(null, mission.id)}>
                      <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 text-white py-2.5 rounded-xl text-sm font-bold hover:from-orange-500 hover:to-yellow-400 active:scale-[0.97] transition-all">
                        🔥 Unirme a la racha
                      </button>
                    </form>
                  ) : streakStatus === "completed" ? (
                    <div className="text-center text-sm font-bold text-yellow-300 bg-yellow-500/10 rounded-xl py-2">⏳ Pendiente de aprobación</div>
                  ) : streakStatus === "approved" ? (
                    <div className="text-center text-sm font-bold text-cyan-300 bg-cyan-500/10 rounded-xl py-2">✅ ¡Aprobada! Pendiente de pago</div>
                  ) : streakStatus === "paid" ? (
                    <div className="text-center text-sm font-bold text-green-300 bg-green-500/10 rounded-xl py-2">💰 ¡Pagada! Puedes repetirla</div>
                  ) : (
                    <div className="text-center text-xs text-purple-300/60 py-1">El admin marca tu progreso diario</div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Misiones en curso */}
      <section>
        <h2 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
          ⚔️ <span>Misiones en curso</span>
          {activeMissions.length > 0 && (
            <span className="bg-orange-500/20 text-orange-300 text-xs px-2 py-0.5 rounded-full">{activeMissions.length}</span>
          )}
        </h2>
        {activeMissions.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <span className="text-3xl block mb-2">🎯</span>
            <p className="text-purple-300/70 text-sm">No tienes misiones activas. ¡Acepta una!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeMissions.map((mission) => (
              <div key={mission.id} className="glass-card p-4 border-l-3 border-l-orange-400" style={{ borderLeftWidth: '3px', borderLeftColor: '#fb923c' }}>
                <div className="mb-2">
                  <h3 className="font-bold text-white text-sm">{mission.title}</h3>
                  {mission.description && <p className="text-xs text-purple-200/70 mt-0.5">{mission.description}</p>}
                  <p className="text-xs text-cyan-300 font-bold mt-1">{mission.reward}€ + {mission.xpReward} XP</p>
                </div>
                <form action={completeMission.bind(null, mission.id)}>
                  <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2.5 rounded-xl text-sm font-bold hover:from-green-500 hover:to-emerald-400 active:scale-[0.97] transition-all">
                    ✅ ¡Completada!
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Historial */}
      <section>
        <h2 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
          📜 <span>Historial</span>
        </h2>
        {historyMissions.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <span className="text-3xl block mb-2">🌟</span>
            <p className="text-purple-300/70 text-sm">Aún no has completado ninguna misión.</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            {historyMissions.map((mission) => (
              <div key={mission.id} className="flex justify-between items-center px-4 py-3 border-b border-white/5 last:border-0">
                <div>
                  <span className="font-medium text-white text-sm">{mission.title}</span>
                  <p className="text-[10px] text-purple-300/60 mt-0.5">{mission.reward}€ + {mission.xpReward} XP</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                  mission.status === "paid" ? "bg-green-500/20 text-green-300" :
                  mission.status === "approved" ? "bg-cyan-500/20 text-cyan-300" :
                  "bg-orange-500/20 text-orange-300"
                }`}>
                  {statusLabels[mission.status] || mission.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
