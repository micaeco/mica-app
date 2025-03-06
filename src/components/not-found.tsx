import { useTranslations } from "next-intl";

export function NotFound() {
  const t = useTranslations("not-found");

  return (
    <div className="p-8">
      <h4>{t("title")}</h4>
      <p className="max-w-[460px]">{t("description")}</p>
    </div>
  );
}
