import { prisma } from "../../../lib/db";
import { approveMission, rejectMission, payMission } from "../../actions/admin-missions";

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

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Revisar Misiones</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-orange-600">Pendientes de Revisión</h2>
        {pendingReview.length === 0 ? (
          <p className="text-gray-500">No hay misiones pendientes de revisión.</p>
        ) : (
          <div className="grid gap-4">
            {pendingReview.map((mission) => (
              <div key={mission.id} className="bg-white p-4 rounded-lg shadow-sm border border-orange-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{mission.title}</h3>
                  <p className="text-sm text-gray-600">
                    Completada por: {mission.assignedChild?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Recompensa: {mission.reward}€ | XP: {mission.xpReward}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form action={rejectMission.bind(null, mission.id)}>
                    <button type="submit" className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 font-medium">
                      Rechazar
                    </button>
                  </form>
                  <form action={approveMission.bind(null, mission.id)}>
                    <button type="submit" className="bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200 font-medium">
                      Aprobar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-green-600">Pendientes de Pago</h2>
        {pendingPayment.length === 0 ? (
          <p className="text-gray-500">No hay misiones pendientes de pago.</p>
        ) : (
          <div className="grid gap-4">
            {pendingPayment.map((mission) => (
              <div key={mission.id} className="bg-white p-4 rounded-lg shadow-sm border border-green-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{mission.title}</h3>
                  <p className="text-sm text-gray-600">
                    Aprobada para: {mission.assignedChild?.name}
                  </p>
                  <p className="text-sm font-semibold text-green-700">
                    A pagar: {mission.reward}€
                  </p>
                </div>
                <form action={payMission.bind(null, mission.id)}>
                  <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">
                    Marcar como Pagada
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
