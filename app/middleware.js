import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",                 // Public root route
    "/about",            // Public about page
    "/sign-up",          // Public sign-up page
    "/sign-in",          // Public sign-in page
  ],
  signInUrl: "/sign-up",
  afterSignOutUrl: "/sign-up",
});

export const config = {
  matcher: [
    '/dashboard/*',         // Protect dashboard
    '/((?!.*\\..*|_next).*)', // Match all routes except files with extensions and Next.js internals
    '/(api|trpc)(.*)',    // Protect API and tRPC routes
  ],
};