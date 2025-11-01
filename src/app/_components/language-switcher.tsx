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

  const { data: session } = authClient.useSession();

  const handleLanguageChange = async (newLocale: Locale) => {
    setIsPending(true);
    try {
      if (session?.user) {
        await authClient.updateUser({ locale: newLocale });
      }
      router.replace(pathname, { locale: newLocale });
      router.refresh();
    } catch (error) {
      console.error("Failed to update language:", error);
    } finally {
      setIsPending(false);
    }
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <Select onValueChange={handleLanguageChange} value={locale} disabled={isPending}>
      <SelectTrigger className={className}>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <SelectValue>{currentLanguage?.name}</SelectValue>
          </div>
        )}
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
