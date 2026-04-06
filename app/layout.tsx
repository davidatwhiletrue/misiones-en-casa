import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSession } from "../lib/auth";
import { prisma } from "../lib/db";
import { Navbar } from "../components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Misiones en Casa",
  description: "¡Convierte las tareas en misiones épicas y gana recompensas!",
  manifest: undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = session?.userId
    ? await prisma.user.findUnique({ where: { id: session.userId as string } })
    : null;

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Misiones en Casa" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-dvh flex flex-col gradient-bg text-white">
        <Navbar session={session as any} user={user} />
        <main className="flex-1 pb-safe">
          {children}
        </main>
      </body>
    </html>
  );
}
