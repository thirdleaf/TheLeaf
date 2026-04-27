import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which routes require authentication
const isAppRoute = createRouteMatcher(["/app(.*)"]);
const isAuthRoute = createRouteMatcher(["/login(.*)", "/register(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as any)?.role;

  // 1. Protect all /app/* routes
  if (isAppRoute(request)) {
    if (!userId) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect_url", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect all /admin/* routes - strictly check role
  if (isAdminRoute(request)) {
    if (!userId || role !== "admin") {
      // Redirect unauthorized users to the app dashboard with a toast hint (via search param)
      return NextResponse.redirect(new URL("/app/dashboard?error=unauthorized", request.url));
    }
  }

  // 3. Prevent logged-in users from seeing auth pages (except /register to finish onboarding)
  if (isAuthRoute(request) && userId && !request.nextUrl.pathname.startsWith("/register")) {
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    "/(api|trpc)(.*)",
  ],
};
