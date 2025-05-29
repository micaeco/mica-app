import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import createMiddleware from "next-intl/middleware";

import { auth } from "@adapters/auth";
import { defaultLocale, getAuth0Locale, locales, routing } from "@app/_i18n/routing";
import { resolveLocale } from "@app/_lib/utils";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  // --- Handle /auth routes ---
  if (nextUrl.pathname.startsWith("/auth")) {
    const authResponse = await auth.middleware(request);

    if (nextUrl.pathname.startsWith("/auth/login") && authResponse.headers.has("Location")) {
      const redirectUrl = new URL(authResponse.headers.get("Location")!, request.url);

      const locale = resolveLocale(request, locales, defaultLocale);
      const auth0Locale = getAuth0Locale(locale);

      redirectUrl.searchParams.set("ui_locales", auth0Locale);

      authResponse.headers.set("Location", redirectUrl.toString());
      authResponse.cookies.set("NEXT_LOCALE", locale);
    }

    // This is a workaround for this issue: https://github.com/auth0/nextjs-auth0/issues/1917
    // The auth0 middleware sets some transaction cookies that are not deleted after the login flow completes.
    // This causes stale cookies to be used in subsequent requests and eventually causes the request header to be rejected because it is too large.
    if (request.nextUrl.pathname === "/auth/login") {
      const reqCookieNames = request.cookies.getAll().map((cookie) => cookie.name);
      reqCookieNames.forEach((cookie) => {
        if (cookie.startsWith("__txn")) {
          authResponse.cookies.delete(cookie);
        }
      });
    }

    return authResponse;
  }

  const session = await auth.getSession(request);
  if (!session) {
    const locale = resolveLocale(request, locales, defaultLocale);
    const auth0Locale = getAuth0Locale(locale);

    const loginUrl = new URL("/auth/login", nextUrl.origin);
    loginUrl.searchParams.set("ui_locales", auth0Locale);

    const response = NextResponse.redirect(loginUrl);

    response.cookies.set("NEXT_LOCALE", locale);

    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // protect everything except _next, api, static files, etc.
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)",
  ],
};
