"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

import { LoaderCircle, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { trpc } from "@app/_lib/trpc";

import { CreateHouseholdPanel } from "./create-household-panel";
import { Button } from "./ui/button";

// Routes that don't require a household to be accessed
const HOUSEHOLD_EXEMPT_ROUTES = ["/recirculator"];

export function HouseholdGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: households, isLoading } = trpc.household.getAll.useQuery();
  const t = useTranslations("onboarding");

  // Check if current route is exempt from household requirement
  const isExemptRoute = HOUSEHOLD_EXEMPT_ROUTES.some((route) => pathname.includes(route));

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  // Allow access to exempt routes even without households
  if (isExemptRoute) {
    return <>{children}</>;
  }

  if (!households?.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
        <div className="max-w-md space-y-4">
          <Image
            src="/icons/onboarding.webp"
            alt="Create first household"
            width={300}
            height={300}
            className="mx-auto"
          />
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t("subtitle")}</p>
          <Button asChild>
            <CreateHouseholdPanel>
              <Plus className="h-5 w-5" />
              {t("createButton")}
            </CreateHouseholdPanel>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
