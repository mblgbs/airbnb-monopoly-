import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/LogoutButton";

export async function Nav() {
  const session = await getSession();
  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.userId },
        select: { name: true },
      })
    : null;

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-xl font-semibold text-red-500 tracking-tight">
          airbnb-monopoly
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          {session ? (
            <>
              <span className="text-slate-600">
                Bonjour, <span className="font-medium text-slate-900">{user?.name ?? "…"}</span>
              </span>
              {session.role === "HOST" && (
                <Link href="/host/listings" className="text-slate-700 hover:text-red-500">
                  Mes annonces
                </Link>
              )}
              <Link href="/reservations" className="text-slate-700 hover:text-red-500">
                Mes réservations
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-700 hover:text-red-500">
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-red-500 text-white px-4 py-2 hover:bg-red-600"
              >
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
