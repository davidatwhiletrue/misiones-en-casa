"use client";

import { useState } from "react";
import { login } from "../actions/auth";

type User = {
  id: string;
  name: string;
  avatar: string | null;
  color: string | null;
  role: string;
  pin: string | null;
};

export function LoginClient({ users }: { users: User[] }) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleUserClick = (user: User) => {
    if (!user.pin) {
      handleLogin(user.id, "");
    } else {
      setSelectedUserId(user.id);
      setPin("");
      setError("");
    }
  };

  const handleLogin = async (userId: string, enteredPin: string) => {
    if (typeof window !== "undefined") (window as any).testLoginResult = null;
    setLoading(true);
    setError("");
    const res = await login(userId, enteredPin);
    if (typeof window !== "undefined") (window as any).testLoginResult = res || "SUCCESS";
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  if (typeof window !== "undefined") {
    (window as any).handleLogin = handleLogin;
  }

  const onSubmitPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      handleLogin(selectedUser.id, pin);
    }
  };

  if (selectedUser) {
    return (
      <div className="flex flex-col items-center glass-card p-8">
        <button
          onClick={() => setSelectedUserId(null)}
          className="mb-4 self-start text-sm text-purple-300 hover:text-white transition-colors"
        >
          ← Volver
        </button>
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-5xl mb-4 ring-4 ring-purple-500/40"
          style={{ backgroundColor: selectedUser.color || "#6366f1" }}
        >
          {selectedUser.avatar || "👤"}
        </div>
        <h2 className="mb-6 text-2xl font-bold text-white">{selectedUser.name}</h2>
        <form onSubmit={onSubmitPin} className="flex w-full max-w-sm flex-col gap-4">
          <input
            type="password"
            placeholder="• • • •"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="rounded-xl border-2 border-purple-500/30 bg-white/10 p-4 text-center text-2xl tracking-[0.5em] text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            autoFocus
            maxLength={4}
            disabled={loading}
          />
          {error && <p className="text-center text-pink-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !pin}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-4 font-bold text-white transition-all hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 active:scale-95"
          >
            {loading ? "Entrando... ⏳" : "¡Entrar! 🚀"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => handleUserClick(user)}
          className="group flex flex-col items-center justify-center glass-card p-5 transition-all hover:scale-[1.04] active:scale-95 hover:bg-white/10"
        >
          <div
            className="mb-3 flex h-20 w-20 items-center justify-center rounded-full text-4xl transition-transform group-hover:scale-110 ring-3 ring-white/20 group-hover:ring-purple-400/50"
            style={{ backgroundColor: user.color || "#6366f1" }}
          >
            {user.avatar || "👤"}
          </div>
          <h3 className="text-lg font-bold text-white">{user.name}</h3>
          <span className="mt-1 rounded-full bg-purple-500/20 px-3 py-0.5 text-[10px] text-purple-300 uppercase font-semibold tracking-wider">
            {user.role === "admin" ? "👑 Admin" : "🎮 Jugador"}
          </span>
        </button>
      ))}
    </div>
  );
}

