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
      const { setHouseholds, selectedHouseholdId } = useHouseholdStore.getState();
      setHouseholds(households);

      // Only set selected household if none is selected or if the currently selected one no longer exists
      const selectedExists = households.some((h) => h.id === selectedHouseholdId);
      if (!selectedHouseholdId || !selectedExists) {
        if (households.length > 0) {
          const firstId = households[0].id;
          useHouseholdStore.getState().selectHousehold(firstId);
        }
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
