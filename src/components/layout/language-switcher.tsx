import React from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Locale = "en" | "es" | "ca";

const languages: { code: Locale; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "US" },
  { code: "es", name: "Español", flag: "ES" },
  { code: "ca", name: "Català", flag: "CAT" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: Locale) => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <Select onValueChange={handleLanguageChange} defaultValue={locale}>
      <SelectTrigger className="w-[180px] bg-brand-primary text-white">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem
            className="flex flex-row"
            key={lang.code}
            value={lang.code}
          >
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
