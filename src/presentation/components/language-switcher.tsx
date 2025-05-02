"use client";

import React from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@presentation/i18n/routing";
import { Globe } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@presentation/components/ui/select";

type Locale = "en" | "es" | "ca";

const languages: { code: Locale; name: string }[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "ca", name: "Català" },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Select onValueChange={handleLanguageChange} value={locale}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex flex-row items-center gap-2">
              <Globe className="h-4 w-4" />
              {lang.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
