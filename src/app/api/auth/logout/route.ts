import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/secret";

export async function GET() {
  const cookie = `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
  const response = NextResponse.redirect(
    new URL("/admin/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
  );
  response.headers.append("Set-Cookie", cookie);
  return response;
}
