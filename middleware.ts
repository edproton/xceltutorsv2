import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "pocketbase";
import { AUTH_COOKIE_NAME } from "./lib/constants";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);

  // Extract the token from the cookie
  const token = authCookie?.value ? JSON.parse(authCookie.value).token : null;

  // Check if the token is missing or expired
  if (!token || isTokenExpired(token)) {
    // Get the current origin and requested path
    const origin = request.nextUrl.origin;
    const requestedPath = request.nextUrl.pathname;

    // Construct a safe redirect URL with the current origin
    const redirectUrl = new URL("/auth", origin);

    // Optionally, include a 'redirectTo' query parameter to return the user to the requested path after login
    redirectUrl.searchParams.set("redirectTo", requestedPath);

    return NextResponse.redirect(redirectUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configuration with matcher
export const config = {
  matcher: [
    "/messages/:path*", // Protect /messages and any sub-routes
    "/view-tutors/:path*", // Protect /view-tutors and any sub-routes
  ],
};
