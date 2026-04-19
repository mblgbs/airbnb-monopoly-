import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Mot de passe: minimum 8 caractères"),
  name: z.string().min(1),
  role: z.enum(["HOST", "GUEST"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const listingCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  city: z.string().min(1),
  pricePerNight: z.number().int().positive(),
  imageUrls: z.array(z.string().url()).optional().default([]),
});

/** Mise à jour partielle : ne pas appliquer de défaut sur `imageUrls` (évite d’effacer les images). */
export const listingUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  pricePerNight: z.number().int().positive().optional(),
  imageUrls: z.array(z.string().url()).optional(),
});

export const reservationCreateSchema = z.object({
  listingId: z.string().min(1),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export function parseJsonBody<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data);
}
