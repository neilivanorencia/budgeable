import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Defines which application routes require authentication to be accessed.
 */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/transactions(.*)",
  "/categories(.*)",
  "/accounts(.*)",
  "/settings(.*)",
]);

/**
 * A list of top-level paths eligible for tracking as the user`s last visited page.
 */
const validRedirectPages = ["/dashboard", "/transactions", "/categories", "/accounts", "/settings"];

/**
 * Main middleware wrapper from Clerk that handles authentication tracking and route protection.
 */
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If the user is authenticated, persist their current location in an HTTP-only cookie for future session restoration.
  if (
    userId &&
    req.nextUrl.pathname !== "/" &&
    validRedirectPages.some((page) => req.nextUrl.pathname.startsWith(page))
  ) {
    const response = NextResponse.next();
    response.cookies.set("lastVisitedPage", req.nextUrl.pathname, {
      path: "/",
      // Persists the cookie preference for 30 days.
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "lax",
    });
    return response;
  }

  // If an authenticated user hits the root landing page, intercept the request.
  if (userId && req.nextUrl.pathname === "/") {
    const lastVisitedPage = req.cookies.get("lastVisitedPage")?.value || "/dashboard";
    return NextResponse.redirect(new URL(lastVisitedPage, req.url));
  }

  // Enforces authentication constraints if the incoming request matches any protected route patterns.
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

/**
 * Next.js middleware configuration determining which entry points trigger this file.
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
