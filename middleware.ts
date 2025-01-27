import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const session = await auth();

  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/static") ||
    request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Check if it's a protected route
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboarda") ||
    request.nextUrl.pathname.startsWith("/api");

  if (!session && isProtectedRoute) {
    // const signInUrl = new URL('/api/auth/signin', request.url)
    const signInUrl = new URL("/login", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected paths
    "/dashboard/:path*",
    "/api/:path*",

    // Match all routes except static files
    "/:path*"
  ]
};
