"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className="text-sm text-slate-600 hover:text-slate-900 underline"
    >
      Déconnexion
    </button>
  );
}
