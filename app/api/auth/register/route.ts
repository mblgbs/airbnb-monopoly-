import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { signSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const data = registerSchema.parse(json);

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet e-mail." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: data.role,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    const token = await signSession({ userId: user.id, role: user.role });
    await setSessionCookie(token);

    return NextResponse.json({ user });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
