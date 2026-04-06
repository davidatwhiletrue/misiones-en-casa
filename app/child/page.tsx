import { prisma } from "../../lib/db";
import { getSession } from "../../lib/auth";
import { redirect } from "next/navigation";
import { acceptMission, completeMission } from "../actions/child-missions";

function getLevelFromXP(xp: number): { level: number; label: string } {
  if (xp < 100) return { level: 1, label: "Novato" };
  if (xp < 300) return { level: 2, label: "Aprendiz" };
  if (xp < 600) return { level: 3, label: "Explorador" };
  if (xp < 1000) return { level: 4, label: "Aventurero" };
  if (xp < 1500) return { level: 5, label: "Héroe" };
  return { level: 6, label: "Leyenda" };
}

const rarityColors: Record<string, string> = {
  common: "bg-gray-100 text-gray-700",
  special: "bg-blue-100 text-blue-700",
  epic: "bg-purple-100 text-purple-700",
};

const difficultyColors: Record<string, string> = {
  easy: "text-green-600",
  medium: "text-yellow-600",
  hard: "text-red-600",
};

const statusLabels: Record<string, string> = {
  assigned: "En curso",
  completed: "Pendiente revisión",
  approved: "Aprobada",
  paid: "Pagada",
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
      OR: [{ allowedChildId: null }, { allowedChildId: childId }],
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

  const { level, label } = getLevelFromXP(child.xp);
  const balance = historyMissions
    .filter((m) => m.status === "approved")
    .reduce((sum, m) => sum + m.reward, 0);
  const totalEarned = historyMissions
    .filter((m) => m.status === "paid")
    .reduce((sum, m) => sum + m.reward, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      {/* Hero Stats */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white flex items-center gap-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shrink-0"
          style={{ backgroundColor: child.color || "#6366f1" }}
        >
          {child.avatar || "👤"}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{child.name}</h1>
          <p className="text-indigo-200 text-sm">Nivel {level} — {label}</p>
          <div className="flex gap-6 mt-3">
            <div>
              <span className="text-xl font-bold">{child.xp}</span>
              <span className="text-indigo-200 text-sm ml-1">XP</span>
            </div>
            <div>
              <span className="text-xl font-bold">{balance.toFixed(2)}€</span>
              <span className="text-indigo-200 text-sm ml-1">Por cobrar</span>
            </div>
            <div>
              <span className="text-xl font-bold">{totalEarned.toFixed(2)}€</span>
              <span className="text-indigo-200 text-sm ml-1">Cobrado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Misiones disponibles */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-800">🗺️ Misiones disponibles</h2>
        {availableMissions.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay misiones disponibles ahora mismo.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {availableMissions.map((mission) => (
              <div key={mission.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{mission.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rarityColors[mission.rarity || "common"]}`}>
                    {mission.rarity}
                  </span>
                </div>
                {mission.description && <p className="text-sm text-gray-500 mb-3">{mission.description}</p>}
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className={`font-medium ${difficultyColors[mission.difficulty || "medium"]}`}>
                    {mission.difficulty}
                  </span>
                  <span className="text-gray-700 font-semibold">{mission.reward}€ + {mission.xpReward} XP</span>
                </div>
                <form action={acceptMission.bind(null, mission.id)}>
                  <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                    Aceptar misión
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Misiones en curso */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-800">⚔️ Misiones en curso</h2>
        {activeMissions.length === 0 ? (
          <p className="text-gray-500 text-sm">No tienes misiones activas. ¡Acepta una!</p>
        ) : (
          <div className="grid gap-4">
            {activeMissions.map((mission) => (
              <div key={mission.id} className="bg-white rounded-xl border border-indigo-200 shadow-sm p-4 flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-gray-900">{mission.title}</h3>
                  {mission.description && <p className="text-sm text-gray-500 mt-0.5">{mission.description}</p>}
                  <p className="text-sm text-indigo-700 font-semibold mt-1">{mission.reward}€ + {mission.xpReward} XP</p>
                </div>
                <form action={completeMission.bind(null, mission.id)}>
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 whitespace-nowrap transition">
                    Marcar como completada
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Historial */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-800">📜 Historial</h2>
        {historyMissions.length === 0 ? (
          <p className="text-gray-500 text-sm">Aún no has completado ninguna misión.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {historyMissions.map((mission) => (
              <div key={mission.id} className="flex justify-between items-center px-4 py-3 border-b border-gray-100 last:border-0">
                <div>
                  <span className="font-medium text-gray-800">{mission.title}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{mission.reward}€ + {mission.xpReward} XP</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  mission.status === "paid" ? "bg-green-100 text-green-700" :
                  mission.status === "approved" ? "bg-blue-100 text-blue-700" :
                  "bg-orange-100 text-orange-700"
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

