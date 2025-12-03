import { useState, useEffect, useCallback, useMemo } from "react";

import { trpc } from "@app/_lib/trpc";
import { useHouseholdStore } from "@app/_stores/household";
import { Consumption, Granularity, TimeWindow } from "@domain/entities/consumption";

export function useConsumption() {
  const intervals = 4;

  const { selectedHouseholdId } = useHouseholdStore();
  const [granularity, setGranularity] = useState<Granularity>("month");
  const [selectedPage, setSelectedPage] = useState<number>(0);
  const [intervalConsumption, setIntervalConsumption] = useState<Consumption[]>([]);
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<TimeWindow | undefined>(undefined);

  const {
    data: consumption,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = trpc.consumption.getConsumptionByGranularity.useInfiniteQuery(
    {
      householdId: selectedHouseholdId!,
      granularity,
      limit: intervals,
    },
    {
      enabled: !!selectedHouseholdId,
      initialCursor: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  useEffect(() => {
    if (selectedHouseholdId) {
      refetch();
      setSelectedPage(0);
    }
  }, [granularity, refetch, selectedHouseholdId]);

  const consumptionPages = useMemo(() => consumption?.pages || [], [consumption?.pages]);

  useEffect(() => {
    if (consumptionPages[selectedPage]?.data && consumptionPages[selectedPage].data.length > 0) {
      const page = consumptionPages[selectedPage];
      const firstEntry = page.data[0];
      if (firstEntry && firstEntry.startDate && firstEntry.endDate) {
        setSelectedTimeWindow({
          startDate: new Date(firstEntry.startDate),
          endDate: new Date(firstEntry.endDate),
        });
      } else {
        setSelectedTimeWindow(undefined);
      }
    } else {
      setSelectedTimeWindow(undefined);
    }
  }, [consumption, selectedPage, consumptionPages]);

  const canMoveTimeWindowForward = useCallback(() => {
    if (selectedPage === 0) {
      return false;
    }
    return true;
  }, [selectedPage]);

  const canMoveTimeWindowBackward = useCallback(() => {
    if (selectedPage + 1 >= consumptionPages.length && hasNextPage && !isFetchingNextPage) {
      return true;
    }
    return selectedPage < consumptionPages.length - 1;
  }, [selectedPage, hasNextPage, isFetchingNextPage, consumptionPages.length]);

  const moveTimeWindow = useCallback(
    (direction: "back" | "forward") => {
      if (direction === "back") {
        if (selectedPage + 1 >= consumptionPages.length && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
        setSelectedPage((prevPage) => {
          const newPage = prevPage + 1;
          if (newPage < consumptionPages.length || hasNextPage) {
            return newPage;
          }
          return prevPage;
        });
      } else if (direction === "forward") {
        setSelectedPage((prevPage) => {
          const newPage = prevPage - 1;
          if (newPage >= 0) {
            return newPage;
          }
          return prevPage;
        });
      }
    },
    [fetchNextPage, consumptionPages.length, hasNextPage, isFetchingNextPage, selectedPage]
  );

  useEffect(() => {
    const currentIntervalData = consumptionPages[selectedPage]?.data || [];
    setIntervalConsumption(currentIntervalData);
  }, [consumptionPages, selectedPage]);

  return {
    granularity,
    setGranularity,
    selectedTimeWindow,
    setSelectedTimeWindow,
    consumption: intervalConsumption,
    isLoading: isLoading || isFetchingNextPage,
    error,
    moveTimeWindow,
    canMoveTimeWindowForward,
    canMoveTimeWindowBackward,
    isFetchingNextPage,
    hasNextPage,
  } as const;
}
