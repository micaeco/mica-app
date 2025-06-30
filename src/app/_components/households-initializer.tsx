"use client";

import { useEffect } from "react";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Loading } from "@app/_components/loading";
import { trpc } from "@app/_lib/trpc";
import { useHouseholdStore } from "@app/_stores/household";

export function HouseholdsInitializer({ children }: { children: React.ReactNode }) {
  const tErrors = useTranslations("common.errors");

  const { data: households, isLoading, error } = trpc.household.getAll.useQuery();

  useEffect(() => {
    if (households) {
      useHouseholdStore.setState({ households });

      if (households.length > 0) {
        const firstId = households[0].id;
        useHouseholdStore.setState({ selectedHouseholdId: firstId });
      }
    }
  }, [households]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    toast.error(tErrors("INTERNAL_SERVER_ERROR"));
  }

  return <>{children}</>;
}
