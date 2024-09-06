import { useTranslations } from "next-intl";

export default function Savings() {
  const navPages = useTranslations("common.nav-pages");

  return <div>{navPages("savings")}</div>;
}
