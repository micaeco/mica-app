import { ChevronRight, CircleCheck, LoaderCircle } from "lucide-react";

import { useCarousel } from "@app/_components/ui/carousel";
import { cn } from "@app/_lib/utils";

export function InfiniteCarouselNext({
  isFetchingNextPage,
  hasNextPage,
  className,
}: {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  className?: string;
}) {
  const { scrollNext, canScrollNext } = useCarousel();

  const showLoaderOnButton = isFetchingNextPage && !canScrollNext;

  const isDisabled = !hasNextPage && !canScrollNext;

  return (
    <button
      onClick={scrollNext}
      disabled={isDisabled || !canScrollNext}
      className={cn(
        className,
        "rounded-md border p-2 transition-colors hover:bg-gray-100 disabled:opacity-50"
      )}
    >
      {showLoaderOnButton ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : !hasNextPage && !canScrollNext ? (
        <CircleCheck className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </button>
  );
}
