import { prisma } from "../../lib/db";
import { LoginClient } from "./login-client";

export default async function LoginPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      avatar: true,
      color: true,
      role: true,
      pin: true,
    },
    orderBy: {
      role: "asc",
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-3xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
          Misiones en Casa
        </h1>
        <LoginClient users={users} />
      </div>
    </div>
  );
}

