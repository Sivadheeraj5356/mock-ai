import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const publicRoutes = ["/", "/sign-in", "/sign-up", "/about"];

// Middleware function
export default clerkMiddleware({
  publicRoutes,
  signInUrl: "/sign-in",
  afterSignOutUrl: "/sign-up",
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)", // Match all except static assets
    "/dashboard/:path*", // Protect all dashboard routes
  ],
};
