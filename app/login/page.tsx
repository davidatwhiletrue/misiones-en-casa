import { prisma } from "../../lib/db";
import { LoginClient } from "./login-client";
import Image from "next/image";

export const dynamic = "force-dynamic";

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
    <div className="flex min-h-screen min-h-dvh flex-col items-center justify-center p-4 gradient-bg">
      <div className="w-full max-w-md mx-auto">
        {/* Hero */}
        <div className="text-center mb-10 animate-float">
          <div className="flex justify-center mb-4">
            <Image
              src="/apple-touch-icon.png"
              alt="Misiones en Casa"
              width={96}
              height={96}
              className="rounded-2xl shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Misiones en Casa
          </h1>
          <p className="mt-2 text-purple-300/80 text-sm">
            ¡Elige tu perfil y empieza la aventura!
          </p>
        </div>
        <LoginClient users={users} />
      </div>
    </div>
  );
}
