"use client";

import { useState } from "react";

import { Globe, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/_components/ui/select";
import { useRouter, usePathname, Locale } from "@app/_i18n/routing";
import { authClient } from "@app/_lib/auth-client";

const languages: { code: Locale; name: string }[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "ca", name: "Català" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const [isPending, setIsPending] = useState(false);

  const handleLanguageChange = async (newLocale: Locale) => {
    setIsPending(true);
    await authClient.updateUser({ locale: newLocale });
    router.replace(pathname, { locale: newLocale });
    setIsPending(false);
  };

  return (
    <Select onValueChange={handleLanguageChange} value={locale}>
      <SelectTrigger className={className}>
        {isPending ? <Loader2 className="animate-spin" /> : <SelectValue />}
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <div className="flex flex-row items-center gap-2">
                <Globe className="h-4 w-4" />
                {lang.name}
              </div>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
