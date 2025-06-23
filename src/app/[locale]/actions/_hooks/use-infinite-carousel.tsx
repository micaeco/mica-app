"use client";

import { useEffect } from "react";

import type { CarouselApi } from "@app/_components/ui/carousel";

interface UseInfiniteCarouselProps {
  api: CarouselApi | undefined;
  dataLength: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function useInfiniteCarousel({
  api,
  dataLength,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseInfiniteCarouselProps) {
  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      if (!hasNextPage || isFetchingNextPage) {
        return;
      }

      const isNearEnd = api.selectedScrollSnap() >= dataLength - 2;
      if (isNearEnd) {
        fetchNextPage();
      }
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, dataLength, hasNextPage, isFetchingNextPage, fetchNextPage]);
}
