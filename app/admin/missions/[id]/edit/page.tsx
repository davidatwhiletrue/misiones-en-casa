import { prisma } from "../../../../../lib/db";
import { updateMission } from "../../../../actions/admin-missions";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditMissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [mission, children] = await Promise.all([
    prisma.mission.findUnique({ where: { id } }),
    prisma.user.findMany({ where: { role: "child" } }),
  ]);

  if (!mission) notFound();

  const updateMissionWithId = updateMission.bind(null, mission.id);

  const inputClass = "mt-1 block w-full rounded-xl bg-white/10 border border-white/10 p-3 text-sm text-white placeholder-purple-300/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all";
  const labelClass = "block text-xs font-semibold text-purple-300 mb-0.5";

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">✏️ Editar Misión</h1>
        <Link
          href="/admin"
          className="text-purple-300 hover:text-white text-sm font-medium transition-colors"
        >
          ← Volver
        </Link>
      </div>

      <form action={updateMissionWithId} className="space-y-5 glass-card p-5">
        <div>
          <label htmlFor="title" className={labelClass}>Título</label>
          <input type="text" id="title" name="title" required defaultValue={mission.title} className={inputClass} />
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Descripción</label>
          <textarea id="description" name="description" rows={3} required defaultValue={mission.description || ""} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="reward" className={labelClass}>💰 Recompensa (€)</label>
            <input type="number" step="0.1" min="0" id="reward" name="reward" defaultValue={mission.reward} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="xpReward" className={labelClass}>⚡ XP</label>
            <input type="number" min="0" id="xpReward" name="xpReward" defaultValue={mission.xpReward} required className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="category" className={labelClass}>📂 Categoría</label>
            <select id="category" name="category" defaultValue={mission.category || "limpieza"} className={inputClass}>
              <option value="limpieza">🧹 Limpieza</option>
              <option value="orden">📦 Orden</option>
              <option value="cocina">🍳 Cocina</option>
              <option value="mascotas">🐾 Mascotas</option>
              <option value="ropa">👕 Ropa</option>
              <option value="otros">📌 Otros</option>
            </select>
          </div>
          <div>
            <label htmlFor="difficulty" className={labelClass}>⭐ Dificultad</label>
            <select id="difficulty" name="difficulty" defaultValue={mission.difficulty || "medium"} className={inputClass}>
              <option value="easy">⭐ Fácil</option>
              <option value="medium">⭐⭐ Media</option>
              <option value="hard">⭐⭐⭐ Difícil</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="rarity" className={labelClass}>💎 Rareza</label>
            <select id="rarity" name="rarity" defaultValue={mission.rarity || "common"} className={inputClass}>
              <option value="common">⚪ Común</option>
              <option value="special">🔵 Especial</option>
              <option value="epic">🟣 Épica</option>
            </select>
          </div>
          <div>
            <label htmlFor="allowedChildId" className={labelClass}>👤 Asignar a</label>
            <select id="allowedChildId" name="allowedChildId" defaultValue={mission.allowedChildId || ""} className={inputClass}>
              <option value="">Cualquiera</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>{child.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 rounded-xl p-3">
          <input
            id="repeatable"
            name="repeatable"
            type="checkbox"
            defaultChecked={mission.repeatable}
            className="h-5 w-5 rounded border-purple-500/30 bg-white/10 text-purple-600 focus:ring-purple-500/20"
          />
          <label htmlFor="repeatable" className="text-sm text-purple-200 font-medium">
            🔄 Misión repetible
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold text-sm hover:from-purple-500 hover:to-pink-500 active:scale-[0.97] transition-all"
        >
          💾 Guardar Cambios
        </button>
      </form>
    </div>
  );
}

