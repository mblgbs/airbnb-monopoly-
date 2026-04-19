"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function CreateListingForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [imageUrlsRaw, setImageUrlsRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const price = Number(pricePerNight);
    if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(price)) {
      setError("Prix par nuit : entier positif requis.");
      return;
    }
    const imageUrls = imageUrlsRaw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    setLoading(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          city,
          pricePerNight: price,
          imageUrls,
        }),
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
      setTitle("");
      setDescription("");
      setCity("");
      setPricePerNight("");
      setImageUrlsRaw("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="font-semibold text-lg">Nouvelle annonce</h2>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <div>
        <label className="block text-xs text-slate-500 mb-1">Titre</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Description</label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Ville</label>
        <input
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Prix / nuit (€)</label>
        <input
          required
          type="number"
          min={1}
          step={1}
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">
          URLs d’images (une par ligne, https://…)
        </label>
        <textarea
          rows={3}
          value={imageUrlsRaw}
          onChange={(e) => setImageUrlsRaw(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono text-xs"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600 disabled:opacity-60"
      >
        {loading ? "…" : "Publier"}
      </button>
    </form>
  );
}
