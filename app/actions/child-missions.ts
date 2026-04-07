"use server";

import { prisma } from "../../lib/db";
import { getSession } from "../../lib/auth";
import { revalidatePath } from "next/cache";

export async function acceptMission(missionId: string) {
  const session = await getSession();
  if (!session || session.role !== "child") {
    throw new Error("Unauthorized");
  }

  const childId = session.userId as string;

  // Check mission is still available
  const mission = await prisma.mission.findUnique({ where: { id: missionId } });
  if (!mission) throw new Error("Mission not found");
  if (mission.status !== "available") throw new Error("Mission no longer available");

  // Check allowed child restriction
  if (mission.allowedChildId && mission.allowedChildId !== childId) {
    throw new Error("You are not allowed to accept this mission");
  }

  await prisma.mission.update({
    where: { id: missionId },
    data: {
      status: "assigned",
      assignedChildId: childId,
    },
  });

  revalidatePath("/child");
  revalidatePath("/admin");
}

export async function joinStreakMission(missionId: string) {
  const session = await getSession();
  if (!session || session.role !== "child") {
    throw new Error("Unauthorized");
  }

  const childId = session.userId as string;

  const mission = await prisma.mission.findUnique({ where: { id: missionId } });
  if (!mission || mission.type !== "streak") throw new Error("Not a streak mission");

  // Check if already participating
  const existing = await prisma.streakProgress.findUnique({
    where: { missionId_childId: { missionId, childId } },
  });
  if (existing) return; // already joined

  await prisma.streakProgress.create({
    data: { missionId, childId, currentStreak: 0, status: "in_progress" },
  });

  revalidatePath("/child");
  revalidatePath("/admin");
  revalidatePath("/admin/streaks");
}

export async function completeMission(missionId: string) {
  const session = await getSession();
  if (!session || session.role !== "child") {
    throw new Error("Unauthorized");
  }

  const childId = session.userId as string;

  const mission = await prisma.mission.findUnique({ where: { id: missionId } });
  if (!mission) throw new Error("Mission not found");
  if (mission.assignedChildId !== childId) throw new Error("Not your mission");
  if (mission.status !== "assigned") throw new Error("Mission cannot be marked as completed");

  await prisma.mission.update({
    where: { id: missionId },
    data: {
      status: "completed",
      completedAt: new Date(),
    },
  });

  revalidatePath("/child");
  revalidatePath("/admin");
  revalidatePath("/admin/review");
}

