import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Roles } from "../types/globals";

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);

  // Allow public and auth routes without restriction
  if (
    req.nextUrl.pathname === "/" ||
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up") ||
    req.nextUrl.pathname.startsWith("/api/") ||
    req.nextUrl.pathname.startsWith("/api/webhooks")
  ) {
    return NextResponse.next();
  }

  // Retrieve session
  const session = await auth();
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Extract user role from session claims
  const role = session.sessionClaims?.metadata?.role as Roles | undefined;

  // if (!role) {
  //   return NextResponse.redirect(new URL("/sign-in", req.url)); // Ensure logout if no role
  // }

  // Prevent redirection loops: Only redirect if user is in the wrong place
  if (role === "DOCTOR" && req.nextUrl.pathname.startsWith("/user-dashboard")) {
    if (req.nextUrl.pathname !== "/doc-dashboard") {  // Prevent redirect loop
      return NextResponse.redirect(new URL("/doc-dashboard", req.url));
    }
  }

  if (role === "PATIENT" && req.nextUrl.pathname.startsWith("/doc-dashboard")) {
    if (req.nextUrl.pathname !== "/user-dashboard") {  // Prevent redirect loop
      return NextResponse.redirect(new URL("/user-dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
