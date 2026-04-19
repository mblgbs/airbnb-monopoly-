"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function BookingForm({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, checkIn, checkOut }),
      });
      const data: unknown = await res.json();
      if (!res.ok) {
        const err =
          typeof data === "object" && data !== null && "error" in data
            ? String((data as { error: unknown }).error)
            : "Erreur";
        setError(err);
        return;
      }
      router.push("/reservations");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
    >
      <h3 className="font-semibold text-lg">Réserver</h3>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="book-in" className="block text-xs text-slate-500 mb-1">
          Arrivée
        </label>
        <input
          id="book-in"
          type="date"
          required
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="book-out" className="block text-xs text-slate-500 mb-1">
          Départ
        </label>
        <input
          id="book-out"
          type="date"
          required
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-red-500 text-white py-3 text-sm font-medium hover:bg-red-600 disabled:opacity-60"
      >
        {loading ? "…" : "Demander la réservation"}
      </button>
    </form>
  );
}
