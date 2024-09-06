import { useTranslations } from "next-intl";

export default function Profile() {
  const navSettings = useTranslations("common.nav-settings");

  return <div>{navSettings("profile")}</div>;
}
