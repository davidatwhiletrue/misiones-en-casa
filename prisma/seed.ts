import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.comment.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: "Mamá",
      role: "admin",
      avatar: "👩",
      color: "#6366f1",
      pin: "1234",
    },
  });

  const lucas = await prisma.user.create({
    data: {
      name: "Lucas",
      role: "child",
      avatar: "🧒",
      color: "#f59e0b",
      pin: "0001",
      xp: 150,
    },
  });

  const sofia = await prisma.user.create({
    data: {
      name: "Sofía",
      role: "child",
      avatar: "👧",
      color: "#ec4899",
      pin: "0002",
      xp: 80,
    },
  });

  console.log(`✅ Created users: ${admin.name}, ${lucas.name}, ${sofia.name}`);

  // Create missions
  const m1 = await prisma.mission.create({
    data: {
      title: "Fregar los platos",
      description: "Fregar todos los platos del fregadero y secarlos.",
      reward: 1.5,
      xpReward: 30,
      category: "cocina",
      difficulty: "easy",
      rarity: "common",
      status: "available",
      repeatable: true,
    },
  });

  const m2 = await prisma.mission.create({
    data: {
      title: "Pasar la aspiradora",
      description: "Pasar la aspiradora por el salón y los dormitorios.",
      reward: 3.0,
      xpReward: 60,
      category: "limpieza",
      difficulty: "medium",
      rarity: "special",
      status: "assigned",
      assignedChildId: lucas.id,
      repeatable: false,
    },
  });

  const m3 = await prisma.mission.create({
    data: {
      title: "Ordenar la habitación",
      description: "Recoger juguetes, hacer la cama y ordenar el escritorio.",
      reward: 2.0,
      xpReward: 40,
      category: "orden",
      difficulty: "easy",
      rarity: "common",
      status: "completed",
      assignedChildId: sofia.id,
      completedAt: new Date(),
      repeatable: true,
    },
  });

  const m4 = await prisma.mission.create({
    data: {
      title: "Sacar al perro",
      description: "Sacar a Max a pasear durante 20 minutos.",
      reward: 2.5,
      xpReward: 50,
      category: "mascotas",
      difficulty: "medium",
      rarity: "common",
      status: "approved",
      assignedChildId: lucas.id,
      completedAt: new Date(Date.now() - 86400000),
      approvedAt: new Date(),
      repeatable: true,
    },
  });

  const m5 = await prisma.mission.create({
    data: {
      title: "Poner la lavadora",
      description: "Seleccionar la ropa, poner el detergente y programar la lavadora.",
      reward: 1.0,
      xpReward: 20,
      category: "ropa",
      difficulty: "easy",
      rarity: "common",
      status: "paid",
      assignedChildId: sofia.id,
      completedAt: new Date(Date.now() - 172800000),
      approvedAt: new Date(Date.now() - 86400000),
      paidAt: new Date(),
      repeatable: false,
    },
  });

  const m6 = await prisma.mission.create({
    data: {
      title: "Limpiar el baño",
      description: "Limpiar el lavabo, el inodoro y la ducha. ¡Misión épica!",
      reward: 5.0,
      xpReward: 100,
      category: "limpieza",
      difficulty: "hard",
      rarity: "epic",
      status: "available",
      repeatable: false,
    },
  });

  console.log(
    `✅ Created missions: ${[m1, m2, m3, m4, m5, m6].map((m) => m.title).join(", ")}`
  );

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

