import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Roles } from "../types/globals";

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname === "/" || 
      req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname.startsWith("/sign-up") ||
      req.nextUrl.pathname.startsWith("/api/") ||
      req.nextUrl.pathname.startsWith("/api/webhooks")) {
    return NextResponse.next();
  }
  
  const session = await auth();
  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  const role = session.sessionClaims?.metadata?.role as Roles;
  
  // Role-based routing
  if (role === "doctor" && req.nextUrl.pathname.startsWith('/user-dashboard')) {
    return NextResponse.redirect(new URL('/doc-dashboard', req.url));
  }
  if (role === "PATIENT" && req.nextUrl.pathname.startsWith('/doc-dashboard')) {
    return NextResponse.redirect(new URL('/user-dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ],
};
