import { useTranslations } from "next-intl";

export default function Help() {
  const navSettings = useTranslations("common.nav-settings");

  return <div>{navSettings("help")}</div>;
}
