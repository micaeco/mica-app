"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@i18n/routing";
import { ArrowRight, Bell, CircleHelp } from "lucide-react";

import { useHouseholdStore } from "@stores/household";
import { cn } from "@lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { getNumberOfLeakEvents, getNumberOfUnknownEvents } from "@app/[locale]/(home)/actions";

export function ActionCards({ className }: { className?: string }) {
  const [leakEvents, setLeakEvents] = useState<number | null>(null);
  const [unknownEvents, setUnknownEvents] = useState<number | null>(null);

  const { selectedHouseholdId } = useHouseholdStore();

  const router = useRouter();
  const tActionCards = useTranslations("action-cards");
  const tErrors = useTranslations("errors");

  useEffect(() => {
    async function fetchEvents() {
      const resultLeakEvents = await getNumberOfLeakEvents(selectedHouseholdId);

      if (!resultLeakEvents.success) {
        toast.error(tErrors(resultLeakEvents.error));
        return;
      }

      setLeakEvents(resultLeakEvents.data);

      const resultUnknownEvents = await getNumberOfUnknownEvents(selectedHouseholdId);

      if (!resultUnknownEvents.success) {
        toast.error(tErrors(resultUnknownEvents.error));
        return;
      }

      setUnknownEvents(resultUnknownEvents.data);
    }

    fetchEvents();
  }, [selectedHouseholdId, tErrors]);

  return (
    <div className={cn("flex gap-2", className)}>
      <Card
        className="group bg-brand-tertiary relative min-w-32 cursor-pointer pb-4"
        onClick={() => router.push("/actions")}
      >
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bell />
            {tActionCards("leaks.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2">
            {tActionCards("leaks.description", { count: leakEvents })}{" "}
          </p>
          <ArrowRight className="absolute right-4 bottom-2 transition-transform group-hover:translate-x-2" />
        </CardContent>
      </Card>
      <Card
        className="group bg-brand-tertiary relative min-w-52 cursor-pointer pb-4"
        onClick={() => router.push("/actions")}
      >
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <CircleHelp />
            {tActionCards("categorize.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2">
            {tActionCards("categorize.description", { count: unknownEvents })}{" "}
          </p>
          <ArrowRight className="absolute right-4 bottom-2 transition-transform group-hover:translate-x-2" />
        </CardContent>
      </Card>
    </div>
  );
}
