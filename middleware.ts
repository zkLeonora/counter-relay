import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js Middleware for Route Protection
 * Flow:
 * - Unauthenticated user accessing protected routes (e.g. /) -> Redirect to /login
 * - Authenticated user accessing auth routes (/login, /signup) -> Redirect to /
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Better Auth session cookie presence
  const sessionToken = 
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isApiRoute = pathname.startsWith("/api");
  const isStaticAsset = pathname.startsWith("/_next") || pathname.includes(".");
  const isServerAction = request.headers.has("next-action");

  if (isApiRoute || isStaticAsset || isServerAction) {
    return NextResponse.next();
  }

  // 1. If NOT logged in and trying to access protected page -> Redirect to /login
  if (!sessionToken && !isAuthPage) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If LOGGED IN and trying to access /login or /signup -> Redirect to Dashboard (/)
  if (sessionToken && isAuthPage) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
