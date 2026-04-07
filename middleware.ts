import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Allow API routes to bypass middleware
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const token =
    req.cookies.get("sb-access-token") ||
    req.cookies.get("sb-refresh-token");

  const protectedRoutes = ["/checkout", "/cart"];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Temporary: allow access even if token missing to avoid redirect loops
  if (isProtected && !token) {
    console.log("No token detected, allowing access (temporary)");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/cart/:path*"],
};