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

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/admin/missions/create" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Crear Misión
          </Link>
          <Link href="/admin/review" className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
            Revisar
          </Link>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Resumen por Hijo</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {children.map(child => {
            const totalPaid = child.assignedMissions
              .filter(m => m.status === "paid")
              .reduce((sum, m) => sum + m.reward, 0);
            const pendingPayment = child.assignedMissions
              .filter(m => m.status === "approved")
              .reduce((sum, m) => sum + m.reward, 0);

            return (
              <div key={child.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: child.color || "#eee" }}
                >
                  {child.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{child.name}</h3>
                  <p className="text-gray-600">XP Total: {child.xp}</p>
                  <p className="text-sm font-semibold text-green-600 mt-2">Pagado: {totalPaid}€</p>
                  <p className="text-sm font-semibold text-orange-500">Pendiente: {pendingPayment}€</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Todas las Misiones</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recompensa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {missions.map(mission => (
                <tr key={mission.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mission.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mission.reward}€ / {mission.xpReward} XP</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {mission.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

