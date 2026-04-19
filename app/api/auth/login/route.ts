import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { signSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const data = loginSchema.parse(json);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      return NextResponse.json(
        { error: "E-mail ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "E-mail ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    const token = await signSession({ userId: user.id, role: user.role });
    await setSessionCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
