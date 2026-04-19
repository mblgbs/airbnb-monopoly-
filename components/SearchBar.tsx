"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Props = {
  initialCity?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
};

export function SearchBar({ initialCity, initialCheckIn, initialCheckOut }: Props) {
  const router = useRouter();
  const [city, setCity] = useState(initialCity ?? "");
  const [checkIn, setCheckIn] = useState(initialCheckIn ?? "");
  const [checkOut, setCheckOut] = useState(initialCheckOut ?? "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (city.trim()) p.set("city", city.trim());
    if (checkIn && checkOut) {
      p.set("checkIn", checkIn);
      p.set("checkOut", checkOut);
    }
    const q = p.toString();
    router.push(q ? `/?${q}` : "/");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 md:grid-cols-4 mb-10 p-4 bg-white rounded-xl border border-slate-200 shadow-sm items-end"
    >
      <div>
        <label htmlFor="city" className="block text-xs font-medium text-slate-500 mb-1">
          Destination
        </label>
        <input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ville"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="checkIn" className="block text-xs font-medium text-slate-500 mb-1">
          Arrivée
        </label>
        <input
          id="checkIn"
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="checkOut" className="block text-xs font-medium text-slate-500 mb-1">
          Départ
        </label>
        <input
          id="checkOut"
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600 h-10"
      >
        Rechercher
      </button>
    </form>
  );
}
