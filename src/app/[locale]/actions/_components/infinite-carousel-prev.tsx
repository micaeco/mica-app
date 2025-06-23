import { ChevronLeft } from "lucide-react";

import { useCarousel } from "@app/_components/ui/carousel";
import { cn } from "@app/_lib/utils";

export function InfiniteCarouselPrev({ className }: { className?: string }) {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <button
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      className={cn(
        className,
        "rounded-md border p-2 transition-colors hover:enabled:bg-gray-100 disabled:cursor-default disabled:opacity-50"
      )}
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
  );
}
