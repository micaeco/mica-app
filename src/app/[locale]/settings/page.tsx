import { useTranslations } from "next-intl";

export default function Settings() {
  const navSettings = useTranslations("common.nav-settings");

  return <div>{navSettings("settings")}</div>;
}
