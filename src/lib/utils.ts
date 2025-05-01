import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, LocalizeFn, Month } from "date-fns";
import { ca, enUS, es, Locale } from "date-fns/locale";

import { ConsumptionGranularity } from "@core/entities/consumption";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDateFnsLocale(locale: string): Locale {
  const customCatalan: Locale = {
    ...ca,
    localize: {
      ...ca.localize,
      month: ((monthIndex: number, { width = "abbreviated" } = {}) => {
        const months = {
          narrow: ["G", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
          abbreviated: [
            "gen",
            "feb",
            "mar",
            "abr",
            "mai",
            "jun",
            "jul",
            "ago",
            "set",
            "oct",
            "nov",
            "des",
          ],
          wide: [
            "gener",
            "febrer",
            "març",
            "abril",
            "maig",
            "juny",
            "juliol",
            "agost",
            "setembre",
            "octubre",
            "novembre",
            "desembre",
          ],
        };

        return months[width as keyof typeof months][monthIndex];
      }) as LocalizeFn<Month>,
    },
  };

  switch (locale) {
    case "en":
      return enUS;
    case "ca":
      return customCatalan;
    case "es":
      return es;
    default:
      return enUS;
  }
}

export function formatDate(date: Date, locale: string) {
  if (!(date instanceof Date)) {
    return "Invalid date";
  }
  return format(date, "d MMM yyyy HH:mm:ss", { locale: getDateFnsLocale(locale) });
}

export function formatDateRange(
  start: Date,
  end: Date,
  resolution: ConsumptionGranularity,
  locale: string
) {
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
