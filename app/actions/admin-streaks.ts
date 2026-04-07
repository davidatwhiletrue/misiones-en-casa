"use server";

import { prisma } from "../../lib/db";
import { getSession } from "../../lib/auth";
import { revalidatePath } from "next/cache";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime() === yesterday.getTime();
}

function isToday(date: Date): boolean {
  const today = startOfToday();
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime() === today.getTime();
}

export async function checkInStreak(missionId: string, childId: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const mission = await prisma.mission.findUnique({ where: { id: missionId } });
  if (!mission || mission.type !== "streak" || !mission.streakTarget) {
    throw new Error("Not a streak mission");
  }

  // Find or create streak progress for this child
  let progress = await prisma.streakProgress.findUnique({
    where: { missionId_childId: { missionId, childId } },
  });

  if (!progress) {
    progress = await prisma.streakProgress.create({
      data: { missionId, childId, currentStreak: 0, status: "in_progress" },
    });
  }

  // Don't allow check-in if already completed/approved/paid
  if (progress.status !== "in_progress") {
    throw new Error("Streak already completed");
  }

  // Already checked in today
  if (progress.lastCheckInDate && isToday(progress.lastCheckInDate)) {
    return; // no-op
  }

  let newStreak: number;
  if (progress.lastCheckInDate && isYesterday(progress.lastCheckInDate)) {
    // Consecutive day — increment
    newStreak = progress.currentStreak + 1;
  } else {
    // First check-in or streak broken — start at 1
    newStreak = 1;
  }

  const completed = newStreak >= mission.streakTarget;

  await prisma.streakProgress.update({
    where: { id: progress.id },
    data: {
      currentStreak: newStreak,
      lastCheckInDate: startOfToday(),
      ...(completed ? { status: "completed", completedAt: new Date() } : {}),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/streaks");
  revalidatePath("/child");
}

export async function approveStreak(progressId: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const progress = await prisma.streakProgress.findUnique({
    where: { id: progressId },
    include: { mission: true },
  });
  if (!progress) throw new Error("Progress not found");
  if (progress.status !== "completed") throw new Error("Not completed yet");

  await prisma.streakProgress.update({
    where: { id: progressId },
    data: { status: "approved", approvedAt: new Date() },
  });

  // Award XP
  if (progress.mission.xpReward > 0) {
    await prisma.user.update({
      where: { id: progress.childId },
      data: { xp: { increment: progress.mission.xpReward } },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/streaks");
  revalidatePath("/admin/review");
  revalidatePath("/child");
}

export async function restartStreak(progressId: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await prisma.streakProgress.update({
    where: { id: progressId },
    data: {
      currentStreak: 0,
      lastCheckInDate: null,
      status: "in_progress",
      completedAt: null,
      approvedAt: null,
      paidAt: null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/streaks");
  revalidatePath("/child");
}

export async function payStreak(progressId: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await prisma.streakProgress.update({
    where: { id: progressId },
    data: { status: "paid", paidAt: new Date() },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/streaks");
  revalidatePath("/admin/review");
  revalidatePath("/child");
}

