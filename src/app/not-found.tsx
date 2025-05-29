import { BaseLayout } from "@app/_components/base-layout";
import { NotFound } from "@app/_components/not-found";
import { routing } from "@app/_i18n/routing";

export default function GlobalNotFound() {
  return (
    <BaseLayout locale={routing.defaultLocale}>
      <NotFound />
    </BaseLayout>
  );
}
