"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function BookingForm({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [paymentLinkUrl, setPaymentLinkUrl] = useState<string | null>(null);
  const [reservationCreated, setReservationCreated] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setReservationCreated(false);
    setPaymentLinkUrl(null);
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

      const paymentUrl =
        typeof data === "object" && data !== null && "paymentLinkUrl" in data
          ? (data as { paymentLinkUrl: unknown }).paymentLinkUrl
          : null;

      setReservationCreated(true);
      setPaymentLinkUrl(typeof paymentUrl === "string" && paymentUrl ? paymentUrl : null);
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
      <h3 className="font-semibold text-lg">Reserver</h3>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {reservationCreated && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-900 space-y-3">
          <p>Reservation creee. Vous pouvez regler maintenant ou plus tard.</p>
          <div className="flex flex-wrap gap-2">
            {paymentLinkUrl ? (
              <a
                href={paymentLinkUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700"
              >
                Payer maintenant
              </a>
            ) : (
              <span className="inline-flex items-center rounded-lg border border-emerald-300 px-3 py-2">
                Lien de paiement indisponible
              </span>
            )}
            <a
              href="/reservations"
              className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50"
            >
              Voir mes reservations
            </a>
          </div>
        </div>
      )}
      <div>
        <label htmlFor="book-in" className="block text-xs text-slate-500 mb-1">
          Arrivee
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
          Depart
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
        {loading ? "..." : "Demander la reservation"}
      </button>
    </form>
  );
}
