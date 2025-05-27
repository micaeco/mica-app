import { getRequestConfig } from "next-intl/server";

import { defaultLocale, Locale, locales } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`/src/presentation/messages/${locale}.json`)).default,
  };
});
