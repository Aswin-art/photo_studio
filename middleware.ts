import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  console.log("✅ Middleware is running:", request.nextUrl.pathname);

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  console.log("🔥 Session di Middleware:", token);

  const protectedRoutes = ["/dashboard", "/profile"];
  if (!token && protectedRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile", "/login"],
};
