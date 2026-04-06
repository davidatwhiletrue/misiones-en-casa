import { prisma } from "../../../../lib/db";
import { createMission } from "../../../actions/admin-missions";
import Link from "next/link";

export default async function CreateMissionPage() {
  const children = await prisma.user.findMany({
    where: { role: "child" },
  });

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Crear Misión</h1>
        <Link
          href="/admin"
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Volver
        </Link>
      </div>

      <form action={createMission} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="reward" className="block text-sm font-medium text-gray-700">Recompensa (€)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              id="reward"
              name="reward"
              defaultValue="0"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="xpReward" className="block text-sm font-medium text-gray-700">XP</label>
            <input
              type="number"
              min="0"
              id="xpReward"
              name="xpReward"
              defaultValue="10"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              id="category"
              name="category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="limpieza">Limpieza</option>
              <option value="orden">Orden</option>
              <option value="cocina">Cocina</option>
              <option value="mascotas">Mascotas</option>
              <option value="ropa">Ropa</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Dificultad</label>
            <select
              id="difficulty"
              name="difficulty"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="easy">Fácil</option>
              <option value="medium">Media</option>
              <option value="hard">Difícil</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="rarity" className="block text-sm font-medium text-gray-700">Rareza</label>
            <select
              id="rarity"
              name="rarity"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="common">Común</option>
              <option value="special">Especial</option>
              <option value="epic">Épica</option>
            </select>
          </div>

          <div>
            <label htmlFor="allowedChildId" className="block text-sm font-medium text-gray-700">Asignar a</label>
            <select
              id="allowedChildId"
              name="allowedChildId"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Cualquiera</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="repeatable"
            name="repeatable"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="repeatable" className="ml-2 block text-sm text-gray-900">
            Misión repetible
          </label>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Crear Misión
          </button>
        </div>
      </form>
    </div>
  );
}
