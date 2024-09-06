import { useTranslations } from "next-intl";

export default function PlantATree() {
  const navPages = useTranslations("common.nav-pages");

  return <div>{navPages("plant-a-tree")}</div>;
}
