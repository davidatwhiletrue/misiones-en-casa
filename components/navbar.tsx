"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../app/actions/auth";
import Image from "next/image";

type UserSession = {
  userId: string;
  role: string;
};

export function Navbar({ session, user }: { session: UserSession | null, user: any }) {
  const pathname = usePathname();
  if (!session || !user) return null;

  const isAdmin = user.role === "admin";

  const navItems = isAdmin
    ? [
        { href: "/admin", label: "Inicio", icon: "🏠" },
        { href: "/admin/missions/create", label: "Crear", icon: "✨" },
        { href: "/admin/review", label: "Revisar", icon: "📋" },
      ]
    : [
        { href: "/child", label: "Misiones", icon: "⚔️" },
      ];

  return (
    <>
      {/* Top bar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 glass-card rounded-none border-x-0 border-t-0"
        style={{ background: "rgba(15, 11, 30, 0.85)", backdropFilter: "blur(16px)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/favicon-96x96.png"
            alt="Misiones en Casa"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Misiones
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg ring-2 ring-purple-500/50"
              style={{ backgroundColor: user.color || "#6366f1" }}
            >
              {user.avatar || "👤"}
            </div>
            <span className="hidden sm:block text-sm font-medium text-purple-200">
              {user.name}
            </span>
          </div>
          <button
            onClick={() => logout()}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-purple-200 hover:bg-white/20 transition-colors"
          >
            Salir
          </button>
        </div>
      </nav>

      {/* Bottom nav for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex justify-around items-center py-2 border-t border-white/10"
        style={{ background: "rgba(15, 11, 30, 0.95)", backdropFilter: "blur(16px)", paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all ${
                isActive
                  ? "text-purple-300 scale-110"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-purple-400 mt-0.5" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

