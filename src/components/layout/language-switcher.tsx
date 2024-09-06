import React from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: "en", name: "English", flag: "US" },
  { code: "es", name: "Español", flag: "ES" },
  { code: "ca", name: "Català", flag: "CAT" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    router.push(`/${newLocale}`);
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
