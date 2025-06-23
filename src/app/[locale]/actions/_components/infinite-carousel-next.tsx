import { ChevronRight, CircleCheck, LoaderCircle } from "lucide-react";

import { Button } from "@app/_components/ui/button";
import { useCarousel } from "@app/_components/ui/carousel";

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

  const isDisabled = isFetchingNextPage || !hasNextPage;

  return (
    <Button
      variant="outline"
      onClick={scrollNext}
      disabled={isDisabled || !canScrollNext}
      className={className}
    >
      {isFetchingNextPage ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : !hasNextPage && !canScrollNext ? (
        <CircleCheck className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  );
}
