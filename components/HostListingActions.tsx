"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HostListingActions({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove() {
    if (!confirm("Supprimer cette annonce ?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
      if (!res.ok) {
        const data: unknown = await res.json();
        const msg =
          typeof data === "object" && data !== null && "error" in data
            ? String((data as { error: unknown }).error)
            : "Erreur";
        alert(msg);
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-3 text-sm">
      <Link
        href={`/host/listings/${listingId}/edit`}
        className="text-red-500 hover:underline"
      >
        Modifier
      </Link>
      <button
        type="button"
        disabled={loading}
        onClick={() => void remove()}
        className="text-slate-500 hover:text-red-600 disabled:opacity-50"
      >
        Supprimer
      </button>
    </div>
  );
}
