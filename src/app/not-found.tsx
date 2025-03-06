import { BaseLayout } from "@components/base-layout";
import { NotFound } from "@components/not-found";
import { routing } from "@i18n/routing";

export default function GlobalNotFound() {
  return (
    <BaseLayout locale={routing.defaultLocale}>
      <NotFound />
    </BaseLayout>
  );
}
