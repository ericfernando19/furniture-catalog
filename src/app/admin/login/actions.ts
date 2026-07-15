"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/secret";

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username dan password wajib diisi" };
  }

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) {
    return { error: "Username atau password salah" };
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    return { error: "Username atau password salah" };
  }

  const token = await createSession({ adminId: admin.id, username: admin.username });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/admin/dashboard");
}
