import { prisma } from "../../../lib/db";
import { approveMission, rejectMission, payMission } from "../../actions/admin-missions";
import { ApproveStreakButton, PayStreakButton } from "../../../components/streak-action-buttons";

export const dynamic = "force-dynamic";

export default async function ReviewMissionsPage() {
  const pendingReview = await prisma.mission.findMany({
    where: { status: "completed" },
    include: { assignedChild: true },
    orderBy: { completedAt: "asc" },
  });

  const pendingPayment = await prisma.mission.findMany({
    where: { status: "approved" },
    include: { assignedChild: true },
    orderBy: { approvedAt: "asc" },
  });

  // Streak missions pending review/payment
  const streakPendingReview = await prisma.streakProgress.findMany({
    where: { status: "completed" },
    include: { mission: true, child: true },
    orderBy: { completedAt: "asc" },
  });

  const streakPendingPayment = await prisma.streakProgress.findMany({
    where: { status: "approved" },
    include: { mission: true, child: true },
    orderBy: { approvedAt: "asc" },
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">📋 Revisar Misiones</h1>

      <section>
        <h2 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
          ⏳ <span>Pendientes de Revisión</span>
          {pendingReview.length > 0 && (
            <span className="bg-orange-500/20 text-orange-300 text-xs px-2 py-0.5 rounded-full">{pendingReview.length}</span>
          )}
        </h2>
        {pendingReview.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <span className="text-3xl block mb-2">✨</span>
            <p className="text-purple-300/70 text-sm">No hay misiones pendientes de revisión.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingReview.map((mission) => (
              <div key={mission.id} className="glass-card p-4" style={{ borderLeftWidth: '3px', borderLeftColor: '#fb923c' }}>
                <div className="mb-3">
                  <h3 className="font-bold text-white text-sm">{mission.title}</h3>
                  <p className="text-xs text-purple-200/70 mt-0.5">
                    Completada por: <span className="text-cyan-300 font-medium">{mission.assignedChild?.name}</span>
                  </p>
                  <p className="text-xs text-purple-300/60 mt-0.5">
                    {mission.reward}€ | {mission.xpReward} XP
                  </p>
                </div>
                <div className="flex gap-2">
                  <form action={rejectMission.bind(null, mission.id)} className="flex-1">
                    <button type="submit" className="w-full bg-red-500/20 text-red-300 py-2 rounded-xl text-xs font-bold hover:bg-red-500/30 active:scale-[0.97] transition-all">
                      ❌ Rechazar
                    </button>
                  </form>
                  <form action={approveMission.bind(null, mission.id)} className="flex-1">
                    <button type="submit" className="w-full bg-green-500/20 text-green-300 py-2 rounded-xl text-xs font-bold hover:bg-green-500/30 active:scale-[0.97] transition-all">
                      ✅ Aprobar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
          💰 <span>Pendientes de Pago</span>
          {pendingPayment.length > 0 && (
            <span className="bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded-full">{pendingPayment.length}</span>
          )}
        </h2>
        {pendingPayment.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <span className="text-3xl block mb-2">💸</span>
            <p className="text-purple-300/70 text-sm">No hay misiones pendientes de pago.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingPayment.map((mission) => (
              <div key={mission.id} className="glass-card p-4" style={{ borderLeftWidth: '3px', borderLeftColor: '#22c55e' }}>
                <div className="mb-3">
                  <h3 className="font-bold text-white text-sm">{mission.title}</h3>
                  <p className="text-xs text-purple-200/70 mt-0.5">
                    Para: <span className="text-cyan-300 font-medium">{mission.assignedChild?.name}</span>
                  </p>
                  <p className="text-xs text-green-400 font-bold mt-0.5">
                    A pagar: {mission.reward}€
                  </p>
                </div>
                <form action={payMission.bind(null, mission.id)}>
                  <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-xl text-sm font-bold hover:from-purple-500 hover:to-pink-500 active:scale-[0.97] transition-all">
                    💰 Marcar como Pagada
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Streak: Pending Review */}
      {streakPendingReview.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
            🔥 <span>Rachas Completadas</span>
            <span className="bg-orange-500/20 text-orange-300 text-xs px-2 py-0.5 rounded-full">{streakPendingReview.length}</span>
          </h2>
          <div className="space-y-3">
            {streakPendingReview.map((sp) => (
              <div key={sp.id} className="glass-card p-4" style={{ borderLeftWidth: '3px', borderLeftColor: '#f97316' }}>
                <div className="mb-3">
                  <h3 className="font-bold text-white text-sm">🔥 {sp.mission.title}</h3>
                  <p className="text-xs text-purple-200/70 mt-0.5">
                    Completada por: <span className="text-cyan-300 font-medium">{sp.child.name}</span>
                  </p>
                  <p className="text-xs text-purple-300/60 mt-0.5">
                    {sp.mission.streakTarget} días · {sp.mission.reward}€ · {sp.mission.xpReward} XP
                  </p>
                </div>
                <ApproveStreakButton progressId={sp.id} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Streak: Pending Payment */}
      {streakPendingPayment.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
            🔥💰 <span>Rachas por Pagar</span>
            <span className="bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded-full">{streakPendingPayment.length}</span>
          </h2>
          <div className="space-y-3">
            {streakPendingPayment.map((sp) => (
              <div key={sp.id} className="glass-card p-4" style={{ borderLeftWidth: '3px', borderLeftColor: '#22c55e' }}>
                <div className="mb-3">
                  <h3 className="font-bold text-white text-sm">🔥 {sp.mission.title}</h3>
                  <p className="text-xs text-purple-200/70 mt-0.5">
                    Para: <span className="text-cyan-300 font-medium">{sp.child.name}</span>
                  </p>
                  <p className="text-xs text-green-400 font-bold mt-0.5">
                    A pagar: {sp.mission.reward}€
                  </p>
                </div>
                <PayStreakButton progressId={sp.id} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
