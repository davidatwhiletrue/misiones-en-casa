import { prisma } from "../../lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const children = await prisma.user.findMany({
    where: { role: "child" },
    include: {
      assignedMissions: {
        where: { status: { in: ["approved", "paid"] } }
      }
    }
  });

  const missions = await prisma.mission.findMany({
    orderBy: { createdAt: "desc" }
  });

  const statusColors: Record<string, string> = {
    available: "bg-green-500/20 text-green-300",
    assigned: "bg-orange-500/20 text-orange-300",
    completed: "bg-yellow-500/20 text-yellow-300",
    approved: "bg-cyan-500/20 text-cyan-300",
    paid: "bg-purple-500/20 text-purple-300",
    rejected: "bg-red-500/20 text-red-300",
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">👑 Panel Admin</h1>
        <div className="flex gap-2">
          <Link href="/admin/missions/create" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 rounded-xl text-xs font-bold hover:from-purple-500 hover:to-pink-500 active:scale-95 transition-all">
            ✨ Crear
          </Link>
          <Link href="/admin/review" className="bg-orange-500/20 text-orange-300 px-3 py-2 rounded-xl text-xs font-bold hover:bg-orange-500/30 active:scale-95 transition-all">
            📋 Revisar
          </Link>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-bold mb-3 text-white">👨‍👩‍👧‍👦 Resumen por Hijo</h2>
        <div className="space-y-3">
          {children.map(child => {
            const totalPaid = child.assignedMissions
              .filter(m => m.status === "paid")
              .reduce((sum, m) => sum + m.reward, 0);
            const pendingPayment = child.assignedMissions
              .filter(m => m.status === "approved")
              .reduce((sum, m) => sum + m.reward, 0);

            return (
              <div key={child.id} className="glass-card p-4 flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 ring-2 ring-purple-500/30"
                  style={{ backgroundColor: child.color || "#6366f1" }}
                >
                  {child.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white">{child.name}</h3>
                  <p className="text-xs text-purple-300">⚡ {child.xp} XP</p>
                  <div className="flex gap-4 mt-1">
                    <span className="text-xs font-semibold text-green-400">✅ {totalPaid}€</span>
                    <span className="text-xs font-semibold text-orange-400">⏳ {pendingPayment}€</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3 text-white">📋 Todas las Misiones</h2>
        <div className="glass-card overflow-hidden">
          {missions.map(mission => (
            <div key={mission.id} className="flex justify-between items-center px-4 py-3 border-b border-white/5 last:border-0">
              <div className="min-w-0 flex-1">
                <span className="font-medium text-white text-sm block truncate">{mission.title}</span>
                <span className="text-[10px] text-purple-300/60">{mission.reward}€ / {mission.xpReward} XP</span>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-semibold shrink-0 ml-2 ${statusColors[mission.status] || "bg-white/10 text-white/60"}`}>
                {mission.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

