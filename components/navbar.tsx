"use client";

import Link from "next/link";
import { logout } from "../app/actions/auth";

type UserSession = {
  userId: string;
  role: string;
};

export function Navbar({ session, user }: { session: UserSession | null, user: any }) {
  if (!session || !user) return null;

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Misiones
        </Link>
        <div className="hidden md:flex gap-4">
          <Link href={user.role === "admin" ? "/admin" : "/"} className="text-gray-600 hover:text-indigo-600">
            {user.role === "admin" ? "Resumen" : "Mis Misiones"}
          </Link>
          {user.role === "admin" && (
            <>
              <Link href="/admin/missions/create" className="text-gray-600 hover:text-indigo-600">
                Crear Misión
              </Link>
              <Link href="/admin/review" className="text-gray-600 hover:text-indigo-600">
                Revisar
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
            style={{ backgroundColor: user.color || "#e5e7eb" }}
          >
            {user.avatar || "👤"}
          </div>
          <span className="hidden font-medium text-gray-700 sm:block">
            {user.name}
          </span>
        </div>
        <button
          onClick={() => logout()}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          Salir
        </button>
      </div>
    </nav>
  );
}

