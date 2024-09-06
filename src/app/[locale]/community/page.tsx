import { useTranslations } from "next-intl";

export default function Community() {
  const navPages = useTranslations("common.nav-pages");

  return <div>{navPages("community")}</div>;
}
