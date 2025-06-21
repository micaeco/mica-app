import { NextRequest } from "next/server";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import Negotiator from "negotiator";
import { twMerge } from "tailwind-merge";

import { getDateFnsLocale, Locale } from "@app/_i18n/routing";
import { Granularity } from "@domain/entities/consumption";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date, locale: string) {
  if (!(date instanceof Date)) {
    return "Invalid date";
  }
  return format(date, "d MMM yyyy HH:mm:ss", { locale: getDateFnsLocale(locale) });
}

export function formatDateRange(start: Date, end: Date, resolution: Granularity, locale: string) {
  const dateFnsLocale = getDateFnsLocale(locale);
  const formatOptions = { locale: dateFnsLocale };

  switch (resolution) {
    case "hour":
      return format(start, "HH:mm", formatOptions);
    case "day":
      return format(start, "d MMM", formatOptions);
    case "week":
      return `${format(start, "d", formatOptions)}-${format(end, "d", formatOptions)}`;
    case "month":
      return format(start, "MMM", formatOptions);
  }
}

export function resolveLocale(
  request: NextRequest,
  locales: readonly Locale[],
  defaultLocale: Locale
): Locale {
  const pathname = request.nextUrl.pathname;
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      request.cookies.set("NEXT_LOCALE", locale);
      return locale;
    }
  }

  const nextLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (nextLocale && locales.includes(nextLocale as Locale)) {
    return nextLocale as Locale;
  }

  const negotiator = new Negotiator({
    headers: {
      "accept-language": request.headers.get("accept-language") ?? undefined,
    },
  });

  const languages = negotiator.languages();

  return matchLocale(languages, locales, defaultLocale) as unknown as Locale;
}
