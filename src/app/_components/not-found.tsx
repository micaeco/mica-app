import { useTranslations } from "next-intl";

import { Button } from "@app/_components/ui/button";
import { Link } from "@app/_i18n/routing";

export function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-8">
      <h4>{t("title")}</h4>
      <p>{t("description")}</p>
      <Button asChild>
        <Link href="/">{t("goHome")}</Link>
      </Button>
    </div>
  );
}
