"use server";

import { prisma } from "../../lib/db";
import { getSession } from "../../lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMission(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const reward = parseFloat((formData.get("reward") as string) || "0");
  const xpReward = parseInt((formData.get("xpReward") as string) || "0", 10);
  const category = formData.get("category") as string;
  const difficulty = (formData.get("difficulty") as string) || "medium";
  const rarity = (formData.get("rarity") as string) || "common";
  const repeatable = formData.get("repeatable") === "on";
  
  const allowedChildId = formData.get("allowedChildId") as string;
  
  // If specific child is selected and it's not repeatable, we might just assign it right away?
  // Idea says: "asignación (todos o hijo específico)". In db schema, `allowedChildId` sets who can take it.
  
  await prisma.mission.create({
    data: {
      title,
      description,
      reward,
      xpReward,
      category,
      difficulty,
      rarity,
      repeatable,
      allowedChildId: allowedChildId || null,
      status: "available",
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/review");
  redirect("/admin");
}

export async function approveMission(missionId: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const mission = await prisma.mission.findUnique({ where: { id: missionId } });
  if (!mission) throw new Error("Mission not found");

  await prisma.mission.update({
    where: { id: missionId },
    data: {
      status: "approved",
      approvedAt: new Date(),
    },
  });

  // Award XP to the child when mission is approved
  if (mission.assignedChildId && mission.xpReward > 0) {
    await prisma.user.update({
      where: { id: mission.assignedChildId },
      data: { xp: { increment: mission.xpReward } },
    });
  }

  revalidatePath("/");
  revalidatePath("/child");
  revalidatePath("/admin");
  revalidatePath("/admin/review");
}

export async function rejectMission(missionId: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await prisma.mission.update({
    where: { id: missionId },
    data: {
      status: "assigned", // Goes back to the child to redo
      completedAt: null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/review");
}

export async function payMission(missionId: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await prisma.mission.update({
    where: { id: missionId },
    data: {
      status: "paid",
      paidAt: new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/review");
}

