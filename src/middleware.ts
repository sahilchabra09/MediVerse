import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname === "/" || 
      req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname.startsWith("/sign-up") ||
      req.nextUrl.pathname.startsWith("/api/") ||
      req.nextUrl.pathname.startsWith("/api/webhooks") ||
      req.nextUrl.pathname === "/UserTypeSelection") {
    return NextResponse.next();
  }
  
  const session = await auth();
  return session ? NextResponse.next() : NextResponse.redirect(new URL('/sign-in', req.url));
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
    '/!api/webhooks(.*)'  // Explicitly exclude webhook routes
  ],
};
