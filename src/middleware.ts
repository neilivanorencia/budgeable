import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/transactions(.*)",
  "/categories(.*)",
  "/accounts(.*)",
  "/settings(.*)",
]);

const validRedirectPages = ["/dashboard", "/transactions", "/categories", "/accounts", "/settings"];

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (
    userId &&
    req.nextUrl.pathname !== "/" &&
    validRedirectPages.some((page) => req.nextUrl.pathname.startsWith(page))
  ) {
    const response = NextResponse.next();
    response.cookies.set("lastVisitedPage", req.nextUrl.pathname, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "lax",
    });
    return response;
  }

  if (userId && req.nextUrl.pathname === "/") {
    const lastVisitedPage = req.cookies.get("lastVisitedPage")?.value || "/dashboard";
    return NextResponse.redirect(new URL(lastVisitedPage, req.url));
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
