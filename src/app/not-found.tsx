import { BaseLayout } from "@presentation/components/base-layout";
import { NotFound } from "@presentation/components/not-found";
import { routing } from "@presentation/i18n/routing";

export default function GlobalNotFound() {
  return (
    <BaseLayout locale={routing.defaultLocale}>
      <NotFound />
    </BaseLayout>
  );
}
