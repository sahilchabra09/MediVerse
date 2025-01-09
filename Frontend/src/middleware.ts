import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export default function middleware(req: NextRequest) {
  const { userId, sessionClaims } = getAuth(req);

  if (!userId) {
    return NextResponse.redirect("/sign-in"); // Redirect unauthenticated users
  }

  const role = sessionClaims?.role;

  if (req.nextUrl.pathname === "/dashboard") {
    // Redirect based on role
    if (role === "doctor") {
      return NextResponse.redirect("/doc-dashboard");
    } else if (role === "member") {
      return NextResponse.redirect("/user-dashboard");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
