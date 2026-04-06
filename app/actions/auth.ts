"use server";

import { createSession, deleteSession } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { redirect } from "next/navigation";

export async function login(userId: string, pin?: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: "User not found" };
  }

  if (user.pin && user.pin !== pin) {
    return { error: "Invalid PIN" };
  }

  await createSession(user.id, user.role);
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

