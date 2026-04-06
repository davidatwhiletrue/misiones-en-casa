import { getSession } from "../lib/auth";
import { prisma } from "../lib/db";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  const user = session?.userId
    ? await prisma.user.findUnique({ where: { id: session.userId as string } })
    : null;

  if (!user) {
    redirect("/login");
  }

  if (user.role === "admin") {
    redirect("/admin");
  }

  // Child users go to their dashboard
  redirect("/child");
}
