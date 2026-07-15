import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/lib/secret";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.redirect(new URL("/admin/login", origin));
}
