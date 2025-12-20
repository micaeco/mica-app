import { getRequestConfig } from "next-intl/server";

import { defaultLocale, Locale, locales } from "../app/_i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../app/_messages/${locale}.json`)).default,
  };
});
