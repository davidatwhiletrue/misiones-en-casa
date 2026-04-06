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
      <div className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-lg">
        <button
          onClick={() => setSelectedUserId(null)}
          className="mb-4 self-start text-sm text-gray-500 hover:text-gray-700"
        >
          ← Volver
        </button>
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-5xl mb-4"
          style={{ backgroundColor: selectedUser.color || "#e5e7eb" }}
        >
          {selectedUser.avatar || "👤"}
        </div>
        <h2 className="mb-6 text-2xl font-bold">{selectedUser.name}</h2>
        <form onSubmit={onSubmitPin} className="flex w-full max-w-sm flex-col gap-4">
          <input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="rounded-xl border-2 border-gray-200 p-4 text-center text-2xl tracking-[0.5em] focus:border-indigo-500 focus:outline-none"
            autoFocus
            maxLength={4}
            disabled={loading}
          />
          {error && <p className="text-center text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading || !pin}
            className="rounded-xl bg-indigo-600 p-4 font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => handleUserClick(user)}
          className="group flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-xl"
        >
          <div
            className="mb-4 flex h-24 w-24 items-center justify-center rounded-full text-5xl transition-transform group-hover:scale-110"
            style={{ backgroundColor: user.color || "#e5e7eb" }}
          >
            {user.avatar || "👤"}
          </div>
          <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
          <span className="mt-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 uppercase">
            {user.role}
          </span>
        </button>
      ))}
    </div>
  );
}

