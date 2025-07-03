import { NextRequest } from "next/server";

import createMiddleware from "next-intl/middleware";

import { routing } from "@app/_i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // protect everything except _next, api, static files, etc.
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)",
  ],
};
