import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/auth";
import { routeAccessMap } from "./lib/settings";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow ALL API routes to bypass middleware (they handle their own auth if needed)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Allow public routes
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Get session
  const session = await getSession();

  // Check if route requires authentication
  if (!session) {
    // Redirect to login if not authenticated
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Check role-based access
  if (session) {
    for (const [route, allowedRoles] of Object.entries(routeAccessMap)) {
      const routePattern = new RegExp(route.replace("(.*)", ".*"));
      if (routePattern.test(pathname)) {
        if (!allowedRoles.includes(session.role)) {
          // Redirect to user's dashboard if access denied
          const url = request.nextUrl.clone();
          url.pathname = `/${session.role}`;
          return NextResponse.redirect(url);
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
