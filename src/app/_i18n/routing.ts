import { Month } from "date-fns";
import { ca, enUS, es, LocalizeFn, Locale as DateFnsLocale } from "date-fns/locale";
import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const locales = ["ca", "es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ca";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localeCookie: true,
  localeDetection: true,
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

export function getDateFnsLocale(locale: string): DateFnsLocale {
  const customCatalan: DateFnsLocale = {
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
      return getDateFnsLocale(defaultLocale);
  }
}

export type Auth0Locale = "ca-ES" | "es" | "en";

export function getAuth0Locale(locale: Locale): Auth0Locale {
  switch (locale) {
    case "ca":
      return "ca-ES";
    case "en":
      return "en";
    case "es":
      return "es";
    default:
      return getAuth0Locale(defaultLocale);
  }
}
